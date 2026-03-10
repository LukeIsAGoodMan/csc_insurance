import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRouteColor, type RouteColors } from "../../hooks/useRouteColor";

/* ────────────────────────────────────────────────────────────
   Nebula Mesh — route-aware drifting gradient blobs
   Opacity capped at ~5% to preserve "blank canvas" readability.
   Color uniforms lerp smoothly on route change.
   ──────────────────────────────────────────────────────────── */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uCol1;
  uniform vec3 uCol2;
  uniform vec3 uCol3;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 uv = vUv;

    float n1 = noise(uv * 2.0 + uTime * 0.03);
    float n2 = noise(uv * 3.0 - uTime * 0.02 + 5.0);
    float n3 = noise(uv * 1.5 + uTime * 0.015 + 10.0);

    vec3 color = mix(uCol1, uCol2, n1);
    color = mix(color, uCol3, n2 * 0.5);

    float dist = distance(uv, vec2(0.5));
    float vignette = 1.0 - smoothstep(0.1, 0.7, dist);

    float alpha = (n1 * 0.3 + n2 * 0.2 + n3 * 0.15) * vignette * 0.05;

    gl_FragColor = vec4(color, alpha);
  }
`;

function NebulaMesh({ colors }: { colors: RouteColors }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCol1: { value: new THREE.Vector3(...colors.col1) },
      uCol2: { value: new THREE.Vector3(...colors.col2) },
      uCol3: { value: new THREE.Vector3(...colors.col3) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Smooth lerp toward target colors on route change
  const targetRef = useRef(colors);
  targetRef.current = colors;

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;

    const lerpSpeed = delta * 1.2; // ~1.2s to full blend
    const t = targetRef.current;
    uniforms.uCol1.value.lerp(new THREE.Vector3(...t.col1), lerpSpeed);
    uniforms.uCol2.value.lerp(new THREE.Vector3(...t.col2), lerpSpeed);
    uniforms.uCol3.value.lerp(new THREE.Vector3(...t.col3), lerpSpeed);
  });

  // Set initial colors on mount
  useEffect(() => {
    uniforms.uCol1.value.set(...colors.col1);
    uniforms.uCol2.value.set(...colors.col2);
    uniforms.uCol3.value.set(...colors.col3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function NebulaCanvas() {
  const colors = useRouteColor();

  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: false }}
      dpr={[1, 1.5]}
    >
      <NebulaMesh colors={colors} />
    </Canvas>
  );
}

export function NebulaBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <NebulaCanvas />
    </div>
  );
}
