import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useIsMobile } from "../../hooks/useIsMobile";

/* ────────────────────────────────────────────────────────────
   AutoHero3D — Energy shield / glowing core.
   A pulsing inner icosahedron core surrounded by concentric
   shield rings rotating at different speeds.
   ──────────────────────────────────────────────────────────── */

function ShieldCore({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const segments = isMobile ? 24 : 48;

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.06 + Math.sin(state.clock.elapsedTime * 1.2) * 0.03;
      coreRef.current.rotation.x += delta * 0.15;
      coreRef.current.rotation.z += delta * 0.1;
    }
  });

  const ringMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#4F46E5", transparent: true, opacity: 0.3 }),
    [],
  );
  const ringAccent = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#7B6FE0", transparent: true, opacity: 0.18 }),
    [],
  );

  // Generate shield rings at different tilts
  const rings = useMemo(() => {
    const result: { geo: THREE.BufferGeometry; tilt: [number, number, number]; speed: number }[] = [];
    const ringSegments = isMobile ? 48 : 96;
    const configs = [
      { radius: 1.8, tilt: [0, 0, 0] as [number, number, number], speed: 0.12 },
      { radius: 1.9, tilt: [Math.PI / 6, Math.PI / 4, 0] as [number, number, number], speed: -0.08 },
      { radius: 2.0, tilt: [Math.PI / 3, 0, Math.PI / 5] as [number, number, number], speed: 0.06 },
    ];

    for (const cfg of configs) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= ringSegments; i++) {
        const angle = (i / ringSegments) * Math.PI * 2;
        points.push(new THREE.Vector3(
          cfg.radius * Math.cos(angle),
          cfg.radius * Math.sin(angle),
          0,
        ));
      }
      result.push({
        geo: new THREE.BufferGeometry().setFromPoints(points),
        tilt: cfg.tilt,
        speed: cfg.speed,
      });
    }
    return result;
  }, [isMobile]);

  return (
    <group ref={groupRef}>
      {/* Inner icosahedron core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.9, isMobile ? 0 : 1]} />
        <meshBasicMaterial color="#7B6FE0" transparent opacity={0.06} wireframe />
      </mesh>

      {/* Core glow sphere */}
      <mesh>
        <sphereGeometry args={[0.7, segments, segments]} />
        <meshBasicMaterial color="#A78BFA" transparent opacity={0.04} />
      </mesh>

      {/* Shield rings */}
      {rings.map((ring, i) => {
        const line = new THREE.Line(ring.geo, i === 0 ? ringMaterial : ringAccent);
        return (
          <RotatingRing key={`ring-${i}`} tilt={ring.tilt} speed={ring.speed}>
            <primitive object={line} />
          </RotatingRing>
        );
      })}
    </group>
  );
}

function RotatingRing({
  children,
  tilt,
  speed,
}: {
  children: React.ReactNode;
  tilt: [number, number, number];
  speed: number;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });
  return (
    <group ref={ref} rotation={tilt}>
      {children}
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
    if (ref.current) ref.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#7B6FE0" size={0.015} transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

export function AutoHero3D() {
  const isMobile = useIsMobile();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-[380px] w-full md:h-[480px]"
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: !isMobile }}
      >
        <ambientLight intensity={0.2} />
        <ShieldCore isMobile={isMobile} />
        <Particles count={isMobile ? 80 : 160} />
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.35} />
      </Canvas>
    </motion.div>
  );
}
