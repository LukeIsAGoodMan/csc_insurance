import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────
   TravelScene — Wireframe globe with glowing latitude/longitude.
   Pure scene content — rendered inside GlobalCanvasManager.
   ──────────────────────────────────────────────────────────── */

function WireframeGlobe({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  const segments = isMobile ? 48 : 96;
  const latStep = isMobile ? 30 : 15;
  const lonStep = isMobile ? 30 : 15;

  const { latitudes, longitudes } = useMemo(() => {
    const lats: THREE.BufferGeometry[] = [];
    const lons: THREE.BufferGeometry[] = [];
    const radius = 2;

    for (let lat = -75; lat <= 75; lat += latStep) {
      const phi = (90 - lat) * (Math.PI / 180);
      const r = radius * Math.sin(phi);
      const y = radius * Math.cos(phi);
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
      }
      lats.push(new THREE.BufferGeometry().setFromPoints(points));
    }

    for (let lon = 0; lon < 180; lon += lonStep) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const phi = (i / segments) * Math.PI;
        const theta = lon * (Math.PI / 180);
        points.push(
          new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta),
          ),
        );
      }
      lons.push(new THREE.BufferGeometry().setFromPoints(points));
    }

    return { latitudes: lats, longitudes: lons };
  }, [segments, latStep, lonStep]);

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#7B6FE0"),
        transparent: true,
        opacity: 0.35,
      }),
    [],
  );

  const accentMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#A78BFA"),
        transparent: true,
        opacity: 0.15,
      }),
    [],
  );

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1.96, isMobile ? 24 : 48, isMobile ? 24 : 48]} />
        <meshBasicMaterial color="#7B6FE0" transparent opacity={0.02} />
      </mesh>

      {latitudes.map((geo, i) => {
        const line = new THREE.Line(geo, i % 2 === 0 ? lineMaterial : accentMaterial);
        return <primitive key={`lat-${i}`} object={line} />;
      })}

      {longitudes.map((geo, i) => {
        const line = new THREE.Line(geo, i % 3 === 0 ? lineMaterial : accentMaterial);
        return <primitive key={`lon-${i}`} object={line} />;
      })}

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.02, 2.06, isMobile ? 48 : 96]} />
        <meshBasicMaterial color="#A78BFA" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#A78BFA" size={0.015} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export function TravelScene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <WireframeGlobe isMobile={isMobile} />
      <Particles count={isMobile ? 80 : 200} />
    </>
  );
}
