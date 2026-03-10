import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

/* ────────────────────────────────────────────────────────────
   Wireframe Sphere — glowing latitude/longitude lines
   ──────────────────────────────────────────────────────────── */
function WireframeGlobe() {
  const groupRef = useRef<THREE.Group>(null!);

  // Slow auto-rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  // Generate latitude & longitude ring geometries
  const { latitudes, longitudes } = useMemo(() => {
    const lats: THREE.BufferGeometry[] = [];
    const lons: THREE.BufferGeometry[] = [];
    const radius = 2;
    const segments = 96;

    // Latitudes: -75° to 75° in 15° steps
    for (let lat = -75; lat <= 75; lat += 15) {
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

    // Longitudes: every 15°
    for (let lon = 0; lon < 180; lon += 15) {
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
  }, []);

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
      {/* Core glow sphere */}
      <mesh>
        <sphereGeometry args={[1.96, 48, 48]} />
        <meshBasicMaterial color="#7B6FE0" transparent opacity={0.02} />
      </mesh>

      {/* Latitude lines — use primitive to avoid SVG <line> type conflict */}
      {latitudes.map((geo, i) => {
        const line = new THREE.Line(geo, i % 2 === 0 ? lineMaterial : accentMaterial);
        return <primitive key={`lat-${i}`} object={line} />;
      })}

      {/* Longitude lines */}
      {longitudes.map((geo, i) => {
        const line = new THREE.Line(geo, i % 3 === 0 ? lineMaterial : accentMaterial);
        return <primitive key={`lon-${i}`} object={line} />;
      })}

      {/* Outer glow ring — equator accent */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.02, 2.06, 96]} />
        <meshBasicMaterial
          color="#A78BFA"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ────────────────────────────────────────────────────────────
   Ambient particles — scattered dust
   ──────────────────────────────────────────────────────────── */
function Particles({ count = 200 }: { count?: number }) {
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
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#A78BFA"
        size={0.015}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

/* ────────────────────────────────────────────────────────────
   CrystalGlobe — exported component with fade-in + scale
   ──────────────────────────────────────────────────────────── */
export function CrystalGlobe() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-[420px] w-full md:h-[520px]"
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.3} />
        <WireframeGlobe />
        <Particles />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.4}
          autoRotate={false}
        />
      </Canvas>
    </motion.div>
  );
}
