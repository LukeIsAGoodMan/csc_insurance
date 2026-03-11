import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────
   AutoScene — Energy shield / glowing core.
   Pulsing inner icosahedron surrounded by concentric shield
   rings rotating at different speeds.
   Pure scene content — rendered inside GlobalCanvasManager.
   ──────────────────────────────────────────────────────────── */

function ShieldCore({ isMobile, pulse = 0 }: { isMobile: boolean; pulse?: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(0);
  const pulseRef = useRef(pulse);
  const pulseTimer = useRef(0);
  const segments = isMobile ? 24 : 48;

  useFrame((_, delta) => {
    timeRef.current += delta;

    /* ── Pulse detection ── */
    if (pulse !== pulseRef.current) {
      pulseRef.current = pulse;
      pulseTimer.current = 0.5; // 500ms burst
    }
    const isPulsing = pulseTimer.current > 0;
    if (isPulsing) pulseTimer.current = Math.max(0, pulseTimer.current - delta);
    const speedMult = isPulsing ? 3 : 1;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05 * speedMult;
    }
    if (coreRef.current) {
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      const baseOpacity = 0.06 + Math.sin(timeRef.current * 1.2) * 0.03;
      mat.opacity = isPulsing ? 0.15 : baseOpacity;
      coreRef.current.rotation.x += delta * 0.15 * speedMult;
      coreRef.current.rotation.z += delta * 0.1 * speedMult;
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
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.9, isMobile ? 0 : 1]} />
        <meshBasicMaterial color="#7B6FE0" transparent opacity={0.06} wireframe />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.7, segments, segments]} />
        <meshBasicMaterial color="#A78BFA" transparent opacity={0.04} />
      </mesh>

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

export function AutoScene({ isMobile, pulse = 0 }: { isMobile: boolean; pulse?: number }) {
  return (
    <>
      <ShieldCore isMobile={isMobile} pulse={pulse} />
      <Particles count={isMobile ? 80 : 160} />
    </>
  );
}
