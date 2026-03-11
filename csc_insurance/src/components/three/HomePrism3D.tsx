import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ────────────────────────────────────────────────────────────
   HomeScene — Minimalist wireframe house with refraction glow.
   Rectangular base + triangular roof, transparent glowing edges,
   pulsing inner light.
   Pure scene content — rendered inside GlobalCanvasManager.
   ──────────────────────────────────────────────────────────── */

function HouseFrame({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.03 + Math.sin(timeRef.current * 0.8) * 0.015;
    }
  });

  const edgeMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#A78BFA"),
        transparent: true,
        opacity: 0.45,
      }),
    [],
  );

  const accentMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#7B6FE0"),
        transparent: true,
        opacity: 0.25,
      }),
    [],
  );

  const w = 1.6, h = 1.0, d = 1.2, roofH = 0.8;
  const hw = w / 2, hd = d / 2;

  const edges = useMemo(() => {
    const b0 = new THREE.Vector3(-hw, 0, -hd);
    const b1 = new THREE.Vector3(hw, 0, -hd);
    const b2 = new THREE.Vector3(hw, 0, hd);
    const b3 = new THREE.Vector3(-hw, 0, hd);
    const t0 = new THREE.Vector3(-hw, h, -hd);
    const t1 = new THREE.Vector3(hw, h, -hd);
    const t2 = new THREE.Vector3(hw, h, hd);
    const t3 = new THREE.Vector3(-hw, h, hd);
    const r0 = new THREE.Vector3(0, h + roofH, -hd);
    const r1 = new THREE.Vector3(0, h + roofH, hd);

    const lines: THREE.Vector3[][] = [
      [b0, b1], [b1, b2], [b2, b3], [b3, b0],
      [b0, t0], [b1, t1], [b2, t2], [b3, t3],
      [t0, t1], [t1, t2], [t2, t3], [t3, t0],
      [t0, r0], [t1, r0], [t2, r1], [t3, r1],
      [r0, r1],
    ];

    return lines.map((pts) => new THREE.BufferGeometry().setFromPoints(pts));
  }, [hw, h, hd, roofH]);

  const panelGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-hw, 0);
    shape.lineTo(hw, 0);
    shape.lineTo(hw, h);
    shape.lineTo(0, h + roofH);
    shape.lineTo(-hw, h);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [hw, h, roofH]);

  const segments = isMobile ? 24 : 48;

  return (
    <group ref={groupRef}>
      <mesh ref={glowRef} position={[0, h * 0.6, 0]}>
        <sphereGeometry args={[0.5, segments, segments]} />
        <meshBasicMaterial color="#A78BFA" transparent opacity={0.03} />
      </mesh>

      {edges.map((geo, i) => {
        const line = new THREE.Line(geo, i < 4 || i >= 12 ? edgeMaterial : accentMaterial);
        return <primitive key={`edge-${i}`} object={line} />;
      })}

      <mesh geometry={panelGeo} position={[0, 0, hd + 0.001]}>
        <meshBasicMaterial
          color="#A78BFA"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh geometry={panelGeo} position={[0, 0, -hd - 0.001]}>
        <meshBasicMaterial
          color="#7B6FE0"
          transparent
          opacity={0.02}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[2, segments]} />
        <meshBasicMaterial color="#A78BFA" transparent opacity={0.02} />
      </mesh>
    </group>
  );
}

function Particles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;
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
      <pointsMaterial color="#A78BFA" size={0.012} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export function HomeScene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <HouseFrame isMobile={isMobile} />
      <Particles count={isMobile ? 80 : 150} />
    </>
  );
}
