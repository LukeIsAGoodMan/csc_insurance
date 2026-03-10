import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────
   BusinessScene — Flowing orbital rings with luminous data nodes.
   Multiple elliptical orbits with traveling "data packets"
   (small spheres with trailing glow).
   Pure scene content — rendered inside GlobalCanvasManager.
   ──────────────────────────────────────────────────────────── */

interface OrbitConfig {
  rx: number;
  ry: number;
  tilt: [number, number, number];
  speed: number;
  nodeCount: number;
  color: string;
}

const orbits: OrbitConfig[] = [
  { rx: 2.2, ry: 1.6, tilt: [0.3, 0, 0], speed: 0.4, nodeCount: 5, color: "#7B6FE0" },
  { rx: 1.8, ry: 2.0, tilt: [-0.2, 0.5, 0.3], speed: -0.3, nodeCount: 4, color: "#A78BFA" },
  { rx: 2.5, ry: 1.3, tilt: [0.5, -0.3, 0.1], speed: 0.25, nodeCount: 3, color: "#4F46E5" },
  { rx: 1.5, ry: 2.3, tilt: [-0.4, 0.2, -0.2], speed: -0.2, nodeCount: 4, color: "#818CF8" },
];

function OrbitalRing({ config, isMobile }: { config: OrbitConfig; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const nodesRef = useRef<THREE.Group>(null!);
  const segments = isMobile ? 48 : 96;

  const ringGeo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(config.rx * Math.cos(angle), config.ry * Math.sin(angle), 0));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [config.rx, config.ry, segments]);

  const lineMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: config.color, transparent: true, opacity: 0.15 }),
    [config.color],
  );

  const line = useMemo(() => new THREE.Line(ringGeo, lineMat), [ringGeo, lineMat]);

  const timeRef = useRef(0);
  useFrame((_, delta) => {
    timeRef.current += delta;
    if (!nodesRef.current) return;
    const t = timeRef.current * config.speed;
    nodesRef.current.children.forEach((child, i) => {
      const offset = (i / config.nodeCount) * Math.PI * 2;
      const angle = t + offset;
      child.position.set(
        config.rx * Math.cos(angle),
        config.ry * Math.sin(angle),
        0,
      );
      const scale = 1 + Math.sin(timeRef.current * 2 + i) * 0.3;
      child.scale.setScalar(scale);
    });
  });

  const nodeCount = isMobile ? Math.ceil(config.nodeCount / 2) : config.nodeCount;

  return (
    <group ref={groupRef} rotation={config.tilt}>
      <primitive object={line} />
      <group ref={nodesRef}>
        {Array.from({ length: nodeCount }, (_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.04, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
            <meshBasicMaterial color={config.color} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CentralCore({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1;
      ref.current.rotation.x += delta * 0.05;
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.05 + Math.sin(timeRef.current * 0.6) * 0.02;
    }
  });

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.5, isMobile ? 0 : 1]} />
      <meshBasicMaterial color="#7B6FE0" transparent opacity={0.05} wireframe />
    </mesh>
  );
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#818CF8" size={0.01} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

export function BusinessScene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <CentralCore isMobile={isMobile} />
      {orbits.map((cfg, i) => (
        <OrbitalRing key={i} config={cfg} isMobile={isMobile} />
      ))}
      <Particles count={isMobile ? 60 : 120} />
    </>
  );
}
