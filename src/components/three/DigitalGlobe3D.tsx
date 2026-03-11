import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────
   DigitalGlobe3D — Hyper-premium Earth network visualization.

   Material:  Translucent point-cloud sphere + vector continent lines
   Network:   Glowing city nodes + quadratic Bézier arc connections
   Palette:   Indigo #6366F1 → Violet #A855F7 → Fuchsia #E879F9
   Motion:    23.4° axial tilt, slow cinematic rotation
   Glow:      Dual-layer backside atmosphere + inner gradient sphere
   ──────────────────────────────────────────────────────────── */

const R = 1.6;

/* ── Geographic → Cartesian ── */
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

/* ── Major global cities ── */
const CITIES = [
  { lat: 43.7, lng: -79.4 },  // Toronto
  { lat: 40.7, lng: -74.0 },  // New York
  { lat: 51.5, lng: -0.1 },   // London
  { lat: 48.9, lng: 2.3 },    // Paris
  { lat: 25.3, lng: 55.3 },   // Dubai
  { lat: 19.1, lng: 72.9 },   // Mumbai
  { lat: 1.3, lng: 103.8 },   // Singapore
  { lat: 35.7, lng: 139.7 },  // Tokyo
  { lat: -33.9, lng: 151.2 }, // Sydney
  { lat: -23.6, lng: -46.6 }, // São Paulo
  { lat: 6.5, lng: 3.4 },     // Lagos
  { lat: 30.0, lng: 31.2 },   // Cairo
];

/* ── Connection pairs (city indices) ── */
const ARCS: [number, number][] = [
  [0, 2], [1, 9], [2, 3], [2, 10], [3, 4],
  [4, 5], [5, 6], [6, 7], [7, 8], [10, 11],
  [11, 4], [0, 1],
];

/* ────────────────── Sub-components ────────────────── */

/* Point-cloud sphere surface */
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
function Graticule({ isMobile }: { isMobile: boolean }) {
  const lines = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "#6366F1", transparent: true, opacity: 0.04 });
    const segs = isMobile ? 48 : 72;
    const result: THREE.Line[] = [];

    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= segs; i++) {
        pts.push(latLngToVec3(lat, (i / segs) * 360 - 180));
      }
      result.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }

    for (let lng = -180; lng < 180; lng += 30) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= segs; i++) {
        pts.push(latLngToVec3((i / segs) * 180 - 90, lng));
      }
      result.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }

    return result;
  }, [isMobile]);

  return (
    <>
      {lines.map((l, i) => (
        <primitive key={`g-${i}`} object={l} />
      ))}
    </>
  );
}

/* Vector continent outlines */
function ContinentLines() {
  const lines = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "#818CF8", transparent: true, opacity: 0.55 });
    return CONTINENTS.map((path) => {
      const pts = path.map(([lat, lng]) => latLngToVec3(lat, lng, R + 0.003));
      return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
    });
  }, []);

  return (
    <>
      {lines.map((l, i) => (
        <primitive key={`c-${i}`} object={l} />
      ))}
    </>
  );
}

/* Pulsing city node with glow halo */
function CityNode({ position, phase }: { position: THREE.Vector3; phase: number }) {
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
      <mesh>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.9} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/* All city nodes */
function CityNodes() {
  const data = useMemo(
    () => CITIES.map((c, i) => ({
      pos: latLngToVec3(c.lat, c.lng, R + 0.008),
      phase: (i / CITIES.length) * Math.PI * 2,
    })),
    [],
  );

  return (
    <>
      {data.map((d, i) => (
        <CityNode key={`n-${i}`} position={d.pos} phase={d.phase} />
      ))}
    </>
  );
}

/* Traveling dot along an arc */
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

/* Bézier arc connections + traveling dots */
function NetworkArcs({ isMobile }: { isMobile: boolean }) {
  const data = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "#A855F7", transparent: true, opacity: 0.22 });
    const detail = isMobile ? 24 : 48;

    return ARCS.map(([a, b]) => {
      const start = latLngToVec3(CITIES[a].lat, CITIES[a].lng, R + 0.005);
      const end = latLngToVec3(CITIES[b].lat, CITIES[b].lng, R + 0.005);
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const elev = 0.18 + start.distanceTo(end) * 0.28;
      mid.normalize().multiplyScalar(R + elev);
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

/* Dual-layer atmosphere rim glow */
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

/* Inner gradient glow */
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

/* ────────────────── Assembled Globe ────────────────── */

function DigitalGlobe({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.15, 0, -0.41]}>
      <PointCloudSurface count={isMobile ? 1500 : 3500} />
      {!isMobile && <Graticule isMobile={isMobile} />}
      <ContinentLines />
      <InnerGlow />
      <CityNodes />
      <NetworkArcs isMobile={isMobile} />
      <Atmosphere />
    </group>
  );
}

export function DigitalGlobeScene({ isMobile }: { isMobile: boolean }) {
  return <DigitalGlobe isMobile={isMobile} />;
}
