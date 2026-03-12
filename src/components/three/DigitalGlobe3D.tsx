import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────
   DigitalGlobe3D — Hyper-premium Earth network visualization.

   Interaction: OrbitControls (no zoom), 3s idle auto-rotate resume
   Material:    Point-cloud sphere + vector continent outlines (0.75)
   Landmass:    MeshPhongMaterial fill (0.1) + ShaderMaterial shore glow
   Network:     32 city nodes + Billboard labels + Bezier arcs
   Celebration: Particle burst triggered by signature confirmation
   Palette:     Indigo #6366F1 -> Violet #A855F7 -> Fuchsia #E879F9
   ──────────────────────────────────────────────────────────── */

const R = 1.6;

/* ── Geographic -> Cartesian ── */
function latLngToVec3(lat: number, lng: number, r = R): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

/* ── Continent outline vertices [lat, lng][] ── */
const CONTINENTS: [number, number][][] = [
  /* North America */
  [
    [70, -168], [72, -155], [70, -140], [72, -115], [68, -85],
    [60, -64], [48, -53], [45, -66], [42, -70], [40, -74],
    [35, -75], [30, -81], [25, -80], [29, -89], [26, -97],
    [20, -105], [15, -96], [10, -84], [9, -79], [15, -86],
    [20, -105], [24, -110], [32, -117], [37, -122], [48, -124],
    [55, -131], [60, -140], [70, -168],
  ],
  /* South America */
  [
    [12, -72], [5, -77], [0, -80], [-5, -81], [-15, -75],
    [-24, -70], [-33, -71], [-42, -73], [-50, -74], [-55, -68],
    [-53, -64], [-40, -62], [-35, -57], [-25, -48], [-23, -43],
    [-12, -38], [-2, -44], [2, -50], [7, -58], [12, -72],
  ],
  /* Europe */
  [
    [36, -9], [38, -4], [43, -2], [46, 1], [48, -5], [51, 2],
    [54, 9], [57, 8], [60, 5], [63, 10], [68, 16], [71, 26],
    [70, 32], [62, 30], [55, 28], [50, 20], [47, 15], [44, 12],
    [41, 14], [39, 22], [36, 28], [35, 25], [37, 15], [36, -9],
  ],
  /* Africa */
  [
    [37, 10], [35, 0], [32, -8], [28, -13], [22, -17], [15, -17],
    [10, -14], [5, -7], [4, 9], [0, 10], [-5, 12], [-12, 14],
    [-20, 15], [-26, 28], [-34, 23], [-34, 18], [-22, 35],
    [-10, 40], [0, 43], [10, 50], [12, 44], [18, 40],
    [30, 33], [32, 36], [37, 36], [37, 10],
  ],
  /* Asia */
  [
    [42, 28], [44, 40], [38, 44], [30, 48], [24, 56], [22, 60],
    [25, 66], [28, 68], [35, 72], [30, 78], [22, 88], [20, 92],
    [10, 98], [1, 104], [7, 116], [22, 114], [30, 121],
    [35, 129], [40, 131], [38, 140], [43, 145], [50, 143],
    [55, 140], [60, 138], [68, 170], [72, 180], [72, 130],
    [68, 85], [62, 68], [55, 65], [50, 53], [47, 40], [42, 28],
  ],
  /* Australia */
  [
    [-12, 130], [-14, 127], [-22, 114], [-32, 115], [-35, 118],
    [-35, 137], [-38, 146], [-36, 150], [-28, 154], [-22, 150],
    [-15, 141], [-12, 130],
  ],
  /* Greenland */
  [
    [60, -43], [66, -38], [72, -22], [78, -18], [82, -35],
    [78, -55], [72, -55], [65, -50], [60, -43],
  ],
  /* Japan */
  [
    [31, 131], [33, 132], [35, 135], [38, 137], [41, 140],
    [44, 145], [43, 141], [38, 136], [34, 131], [31, 131],
  ],
];

/* ── 32 global cities ── */
const CITIES = [
  { name: "Toronto", lat: 43.7, lng: -79.4 },
  { name: "New York", lat: 40.7, lng: -74.0 },
  { name: "London", lat: 51.5, lng: -0.1 },
  { name: "Paris", lat: 48.9, lng: 2.3 },
  { name: "Dubai", lat: 25.3, lng: 55.3 },
  { name: "Mumbai", lat: 19.1, lng: 72.9 },
  { name: "Singapore", lat: 1.3, lng: 103.8 },
  { name: "Tokyo", lat: 35.7, lng: 139.7 },
  { name: "Sydney", lat: -33.9, lng: 151.2 },
  { name: "Sao Paulo", lat: -23.6, lng: -46.6 },
  { name: "Lagos", lat: 6.5, lng: 3.4 },
  { name: "Cairo", lat: 30.0, lng: 31.2 },
  { name: "Moscow", lat: 55.8, lng: 37.6 },
  { name: "Istanbul", lat: 41.0, lng: 28.9 },
  { name: "Beijing", lat: 39.9, lng: 116.4 },
  { name: "Shanghai", lat: 31.2, lng: 121.5 },
  { name: "Hong Kong", lat: 22.3, lng: 114.2 },
  { name: "Seoul", lat: 37.6, lng: 127.0 },
  { name: "Bangkok", lat: 13.8, lng: 100.5 },
  { name: "Jakarta", lat: -6.2, lng: 106.8 },
  { name: "Manila", lat: 14.6, lng: 121.0 },
  { name: "Nairobi", lat: -1.3, lng: 36.8 },
  { name: "Johannesburg", lat: -26.2, lng: 28.0 },
  { name: "Mexico City", lat: 19.4, lng: -99.1 },
  { name: "Buenos Aires", lat: -34.6, lng: -58.4 },
  { name: "Lima", lat: -12.1, lng: -77.0 },
  { name: "Santiago", lat: -33.5, lng: -70.6 },
  { name: "Berlin", lat: 52.5, lng: 13.4 },
  { name: "Madrid", lat: 40.4, lng: -3.7 },
  { name: "Amsterdam", lat: 52.4, lng: 4.9 },
  { name: "Rome", lat: 41.9, lng: 12.5 },
  { name: "Kuala Lumpur", lat: 3.1, lng: 101.7 },
];

/* ── Connection pairs (city indices) ── */
const ARCS: [number, number][] = [
  /* Original network */
  [0, 2], [1, 9], [2, 3], [2, 10], [3, 4],
  [4, 5], [5, 6], [6, 7], [7, 8], [10, 11],
  [11, 4], [0, 1],
  /* European ring */
  [2, 27], [27, 30], [30, 28], [3, 29],
  /* Istanbul / Moscow bridge */
  [4, 13], [13, 12], [12, 27],
  /* Africa spine */
  [4, 21], [21, 22], [11, 21],
  /* East Asia chain */
  [14, 15], [15, 16], [16, 17],
  /* SE Asia loop */
  [6, 18], [18, 19], [19, 31],
  /* Americas cross-links */
  [23, 24], [24, 25], [1, 23], [0, 23], [9, 24],
  /* Pacific arcs */
  [8, 19], [7, 20],
];

/* ──────────────────────────────────────────────────
   1. OrbitControls — grab/grabbing cursor, idle auto-rotate
   ────────────────────────────────────────────────── */

function GlobeControls({ isMobile }: { isMobile: boolean }) {
  const { gl } = useThree();
  const [autoRotate, setAutoRotate] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (isMobile) return;
    gl.domElement.style.cursor = "grab";
    return () => {
      gl.domElement.style.cursor = "";
      clearTimeout(timerRef.current);
    };
  }, [gl, isMobile]);

  if (isMobile) return null;

  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      minDistance={4.21}
      maxDistance={4.21}
      target={[0, 0, 0]}
      onStart={() => {
        clearTimeout(timerRef.current);
        setAutoRotate(false);
        gl.domElement.style.cursor = "grabbing";
      }}
      onEnd={() => {
        gl.domElement.style.cursor = "grab";
        timerRef.current = setTimeout(() => setAutoRotate(true), 3000);
      }}
    />
  );
}

/* ──────────────────────────────────────────────────
   2. Globe surface layers
   ────────────────────────────────────────────────── */

/* Point-cloud sphere */
function PointCloudSurface({ count }: { count: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      arr[i * 3] = R * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = R * Math.cos(phi);
      arr[i * 3 + 2] = R * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#6366F1" size={0.008} transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

/* Subtle lat/lng graticule grid */
function Graticule() {
  const lines = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "#6366F1", transparent: true, opacity: 0.04 });
    const segs = 72;
    const result: THREE.Line[] = [];

    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= segs; i++) pts.push(latLngToVec3(lat, (i / segs) * 360 - 180));
      result.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }
    for (let lng = -180; lng < 180; lng += 30) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= segs; i++) pts.push(latLngToVec3((i / segs) * 180 - 90, lng));
      result.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }
    return result;
  }, []);

  return <>{lines.map((l, i) => <primitive key={`g-${i}`} object={l} />)}</>;
}

/* ──────────────────────────────────────────────────
   3. Continent visuals — outlines + fill + shore glow
   ────────────────────────────────────────────────── */

/* Vector continent outlines — 0.75 opacity */
function ContinentLines() {
  const lines = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "#818CF8", transparent: true, opacity: 0.75 });
    return CONTINENTS.map((path) => {
      const pts = path.map(([lat, lng]) => latLngToVec3(lat, lng, R + 0.003));
      return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
    });
  }, []);

  return <>{lines.map((l, i) => <primitive key={`c-${i}`} object={l} />)}</>;
}

/* MeshPhongMaterial landmass fill — ShapeGeometry projected to sphere */
function ContinentFill() {
  const meshes = useMemo(() => {
    const mat = new THREE.MeshPhongMaterial({
      color: "#818CF8",
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    return CONTINENTS.map((path) => {
      const shape = new THREE.Shape();
      shape.moveTo(path[0][1], path[0][0]);
      for (let i = 1; i < path.length; i++) shape.lineTo(path[i][1], path[i][0]);

      const geo = new THREE.ShapeGeometry(shape, 1);
      const pos = geo.attributes.position;
      const normals = new Float32Array(pos.count * 3);

      for (let j = 0; j < pos.count; j++) {
        const lng = pos.getX(j);
        const lat = pos.getY(j);
        const v = latLngToVec3(lat, lng, R + 0.001);
        pos.setXYZ(j, v.x, v.y, v.z);
        const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        normals[j * 3] = v.x / len;
        normals[j * 3 + 1] = v.y / len;
        normals[j * 3 + 2] = v.z / len;
      }

      pos.needsUpdate = true;
      geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
      return new THREE.Mesh(geo, mat);
    });
  }, []);

  return <>{meshes.map((m, i) => <primitive key={`fill-${i}`} object={m} />)}</>;
}

/* Shoreline glow — ShaderMaterial soft points along coastlines */
function ShorelineGlow() {
  const { positions, count } = useMemo(() => {
    const pts: number[] = [];
    for (const path of CONTINENTS) {
      for (let j = 0; j < path.length - 1; j++) {
        const [lat1, lng1] = path[j];
        const [lat2, lng2] = path[j + 1];
        for (let s = 0; s <= 4; s++) {
          const t = s / 4;
          const v = latLngToVec3(lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t, R + 0.004);
          pts.push(v.x, v.y, v.z);
        }
      }
    }
    return { positions: new Float32Array(pts), count: pts.length / 3 };
  }, []);

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color("#818CF8") } },
        vertexShader: `
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = 30.0 / (-mv.z);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d) * 0.15;
            gl_FragColor = vec4(uColor, a);
          }
        `,
      }),
    [],
  );

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <primitive object={shaderMat} attach="material" />
    </points>
  );
}

/* ──────────────────────────────────────────────────
   4. City nodes — Billboard labels + hover color sync
   ────────────────────────────────────────────────── */

function CityLabel({ name }: { name: string }) {
  const groupRef = useRef<THREE.Group>(null!);
  const { camera } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      const wp = new THREE.Vector3();
      groupRef.current.getWorldPosition(wp);
      groupRef.current.visible =
        wp.normalize().dot(camera.position.clone().normalize()) > 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <Billboard>
        <Text
          fontSize={0.04}
          color="#94A3B8"
          anchorX="left"
          anchorY="bottom"
          letterSpacing={0.06}
          position={[0.055, 0.015, 0]}
        >
          {name}
        </Text>
      </Billboard>
    </group>
  );
}

function CityNode({
  position,
  name,
  phase,
  isMobile,
}: {
  position: THREE.Vector3;
  name: string;
  phase: number;
  isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef<THREE.Mesh>(null!);
  const t = useRef(phase);

  useFrame((_, delta) => {
    t.current += delta;
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.12 + Math.sin(t.current * 2) * 0.08;
    }
  });

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color={hovered ? "#A855F7" : "#6366F1"} transparent opacity={0.9} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.12} />
      </mesh>
      {!isMobile && <CityLabel name={name} />}
    </group>
  );
}

function CityNodes({ isMobile }: { isMobile: boolean }) {
  const data = useMemo(
    () =>
      CITIES.map((c, i) => ({
        pos: latLngToVec3(c.lat, c.lng, R + 0.008),
        name: c.name,
        phase: (i / CITIES.length) * Math.PI * 2,
      })),
    [],
  );

  return (
    <>
      {data.map((d, i) => (
        <CityNode key={`n-${i}`} position={d.pos} name={d.name} phase={d.phase} isMobile={isMobile} />
      ))}
    </>
  );
}

/* ──────────────────────────────────────────────────
   5. Network arcs + traveling dots
   ────────────────────────────────────────────────── */

function TravelDot({ curve, speed }: { curve: THREE.QuadraticBezierCurve3; speed: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  const t = useRef(Math.random());

  useFrame((_, delta) => {
    t.current = (t.current + delta * speed) % 1;
    if (ref.current) ref.current.position.copy(curve.getPointAt(t.current));
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.012, 6, 6]} />
      <meshBasicMaterial color="#E879F9" transparent opacity={0.85} />
    </mesh>
  );
}

function NetworkArcs({ isMobile }: { isMobile: boolean }) {
  const data = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "#A855F7", transparent: true, opacity: 0.22 });
    const detail = isMobile ? 24 : 48;

    return ARCS.map(([a, b]) => {
      const start = latLngToVec3(CITIES[a].lat, CITIES[a].lng, R + 0.005);
      const end = latLngToVec3(CITIES[b].lat, CITIES[b].lng, R + 0.005);
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(R + 0.18 + start.distanceTo(end) * 0.28);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(detail));
      return { line: new THREE.Line(geo, mat), curve, speed: 0.06 + Math.random() * 0.04 };
    });
  }, [isMobile]);

  return (
    <>
      {data.map((d, i) => (
        <group key={`a-${i}`}>
          <primitive object={d.line} />
          {!isMobile && <TravelDot curve={d.curve} speed={d.speed} />}
        </group>
      ))}
    </>
  );
}

/* ──────────────────────────────────────────────────
   6. Atmosphere + inner glow
   ────────────────────────────────────────────────── */

function Atmosphere() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[R * 1.12, 64, 64]} />
        <meshBasicMaterial color="#6366F1" transparent opacity={0.045} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[R * 1.22, 48, 48]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.02} side={THREE.BackSide} />
      </mesh>
    </>
  );
}

function InnerGlow() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[R * 0.96, 32, 32]} />
        <meshBasicMaterial color="#6366F1" transparent opacity={0.025} />
      </mesh>
      <mesh>
        <sphereGeometry args={[R * 0.88, 24, 24]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.015} />
      </mesh>
    </>
  );
}

/* ──────────────────────────────────────────────────
   7. CelebrationBurst — particle explosion on signature
   ────────────────────────────────────────────────── */

const BURST_COUNT = 80;
const BURST_LIFETIME = 1.5;

function CelebrationBurst({ trigger }: { trigger: number }) {
  const triggered = useRef(0);
  const age = useRef<number | null>(null);
  const directions = useRef<Float32Array>(new Float32Array(BURST_COUNT * 3));
  const speeds = useRef<Float32Array>(new Float32Array(BURST_COUNT));
  const origins = useRef<Float32Array>(new Float32Array(BURST_COUNT * 3));
  const posRef = useRef<THREE.BufferAttribute>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);

  useEffect(() => {
    if (trigger === 0 || trigger === triggered.current) return;
    triggered.current = trigger;
    age.current = 0;

    for (let i = 0; i < BURST_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const ox = R * Math.sin(phi) * Math.cos(theta);
      const oy = R * Math.cos(phi);
      const oz = R * Math.sin(phi) * Math.sin(theta);

      origins.current[i * 3] = ox;
      origins.current[i * 3 + 1] = oy;
      origins.current[i * 3 + 2] = oz;

      const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
      directions.current[i * 3] = ox / len;
      directions.current[i * 3 + 1] = oy / len;
      directions.current[i * 3 + 2] = oz / len;

      speeds.current[i] = 0.8 + Math.random() * 1.2;
    }
  }, [trigger]);

  useFrame((_, delta) => {
    if (age.current === null) return;
    age.current += delta;

    const t = age.current / BURST_LIFETIME;
    if (t >= 1) {
      age.current = null;
      if (matRef.current) matRef.current.opacity = 0;
      return;
    }

    if (posRef.current) {
      const arr = posRef.current.array as Float32Array;
      for (let i = 0; i < BURST_COUNT; i++) {
        const dist = speeds.current[i] * age.current;
        arr[i * 3] = origins.current[i * 3] + directions.current[i * 3] * dist;
        arr[i * 3 + 1] = origins.current[i * 3 + 1] + directions.current[i * 3 + 1] * dist;
        arr[i * 3 + 2] = origins.current[i * 3 + 2] + directions.current[i * 3 + 2] * dist;
      }
      posRef.current.needsUpdate = true;
    }

    if (matRef.current) {
      matRef.current.opacity = t < 0.3 ? 0.9 : 0.9 * (1 - (t - 0.3) / 0.7);
    }
  });

  const initialPositions = useMemo(() => new Float32Array(BURST_COUNT * 3), []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          ref={posRef}
          attach="attributes-position"
          args={[initialPositions, 3]}
          count={BURST_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color="#E879F9"
        size={0.035}
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ──────────────────────────────────────────────────
   8. Assembled globe + scene export
   ────────────────────────────────────────────────── */

function DigitalGlobe({ isMobile }: { isMobile: boolean }) {
  return (
    <group rotation={[0.15, 0, -0.41]}>
      <PointCloudSurface count={isMobile ? 1500 : 3500} />
      {!isMobile && <Graticule />}
      <ContinentFill />
      <ContinentLines />
      <ShorelineGlow />
      <InnerGlow />
      <CityNodes isMobile={isMobile} />
      <NetworkArcs isMobile={isMobile} />
      <Atmosphere />
    </group>
  );
}

export function DigitalGlobeScene({
  isMobile,
  celebration,
}: {
  isMobile: boolean;
  celebration: number;
}) {
  return (
    <>
      <directionalLight position={[3, 2, 4]} intensity={0.3} />
      <GlobeControls isMobile={isMobile} />
      <DigitalGlobe isMobile={isMobile} />
      <CelebrationBurst trigger={celebration} />
    </>
  );
}
