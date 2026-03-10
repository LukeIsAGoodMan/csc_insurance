import { useRef, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "../../hooks/useIsMobile";
import { AutoScene } from "./AutoHero3D";
import { HomeScene } from "./HomePrism3D";
import { BusinessScene } from "./DataOrbit3D";
import { TravelScene } from "./CrystalGlobe";

/* ────────────────────────────────────────────────────────────
   GlobalCanvasManager — Singleton WebGL Canvas.

   Architecture:
   ✅ ONE Canvas, permanently mounted in MainLayout
   ✅ DOM-level fade transition: fadeOut → swap scene → fadeIn
   ✅ DisposableGroup: geometry + material + texture + RT disposal
   ✅ SceneGuard: useFrame wipe when no product page active
   ✅ 3 context losses → static gradient fallback
   ──────────────────────────────────────────────────────────── */

/* ── Suppress THREE.Clock deprecation (R3F creates it internally) ── */
const _warn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("Clock")) return;
  _warn.apply(console, args);
};

/* ── Route → scene key ── */
const SCENE_MAP: Record<string, string> = {
  "/auto-insurance": "auto",
  "/home-insurance": "home",
  "/business-insurance": "business",
  "/travel-insurance": "travel",
};

/* ── Per-scene camera configs ── */
const CAM: Record<string, { pos: [number, number, number]; fov: number }> = {
  auto: { pos: [0, 0, 5.5], fov: 42 },
  home: { pos: [0, 1.2, 4.5], fov: 40 },
  business: { pos: [0, 1.5, 5.5], fov: 42 },
  travel: { pos: [0, 0, 5.5], fov: 45 },
};

/* ── Camera controller ── */
function SceneCamera({ scene }: { scene: string }) {
  const { camera } = useThree();
  useEffect(() => {
    const cfg = CAM[scene];
    if (!cfg) return;
    camera.position.set(...cfg.pos);
    const pCam = camera as THREE.PerspectiveCamera;
    pCam.fov = cfg.fov;
    pCam.updateProjectionMatrix();
  }, [scene, camera]);
  return null;
}

/* ── Nuclear disposal — geometry + material + texture + renderTarget ── */
function nuclearDispose(group: THREE.Object3D) {
  group.traverse((child) => {
    // Geometry
    if ("geometry" in child && child.geometry) {
      (child.geometry as THREE.BufferGeometry).dispose();
    }

    // Material(s)
    if ("material" in child && child.material) {
      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];
      for (const mat of mats as THREE.Material[]) {
        // Dispose every texture property on the material
        for (const key of Object.keys(mat)) {
          const val = (mat as unknown as Record<string, unknown>)[key];
          if (val instanceof THREE.Texture) val.dispose();
        }
        mat.dispose();
      }
    }

    // Render targets
    if ("renderTarget" in child) {
      const rt = (child as Record<string, unknown>).renderTarget;
      if (rt instanceof THREE.WebGLRenderTarget) rt.dispose();
    }
  });
}

/* ── Disposal wrapper — keyed to force unmount/remount on scene change ── */
function DisposableGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!);

  useEffect(() => {
    const group = ref.current;
    return () => {
      if (group) nuclearDispose(group);
    };
  }, []);

  return <group ref={ref}>{children}</group>;
}

/* ── Scene guard — wipes lingering GPU objects when no scene is active ── */
function SceneGuard({ active }: { active: boolean }) {
  const { scene } = useThree();
  const wasActive = useRef(active);

  useFrame(() => {
    if (wasActive.current && !active) {
      // Just left a product page — sweep the scene
      scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh ||
          child instanceof THREE.Line ||
          child instanceof THREE.Points
        ) {
          child.geometry?.dispose();
          const mat = child.material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else if (mat) (mat as THREE.Material).dispose();
        }
      });
    }
    wasActive.current = active;
  });

  return null;
}

/* ── Exclusive scene renderer — only ONE scene at a time ── */
function ActiveScene({ scene, isMobile }: { scene: string; isMobile: boolean }) {
  switch (scene) {
    case "auto":
      return <AutoScene isMobile={isMobile} />;
    case "home":
      return <HomeScene isMobile={isMobile} />;
    case "business":
      return <BusinessScene isMobile={isMobile} />;
    case "travel":
      return <TravelScene isMobile={isMobile} />;
    default:
      return null;
  }
}

/* ── Main singleton Canvas ── */
export function GlobalCanvasManager() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [ctxLost, setCtxLost] = useState(0);

  /* ── Scene transition state machine ── */
  const targetScene = SCENE_MAP[pathname] ?? null;
  const [displayScene, setDisplayScene] = useState<string | null>(targetScene);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Same scene (or both null) — ensure not stuck in fading state
    if (targetScene === displayScene) {
      setFading(false);
      return;
    }

    // Phase 1: fade container to opacity 0
    setFading(true);

    // Phase 2: after fade-out, swap scene while invisible
    const id = setTimeout(() => {
      setDisplayScene(targetScene);
      // Phase 3: fade back in on next frame (after React mounts new scene)
      requestAnimationFrame(() => setFading(false));
    }, 500);

    return () => clearTimeout(id);
  }, [targetScene, displayScene]);

  /* Container opacity: 0 during fade, 0.7 when scene active, 0 when no scene */
  const containerOpacity = fading ? 0 : displayScene ? 0.7 : 0;
  const fallback = ctxLost >= 3;

  /* After 3 context losses → static gradient, no WebGL */
  if (fallback && displayScene) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[1]">
        <div className="h-full w-full bg-gradient-to-br from-indigo-950/20 via-transparent to-violet-950/10" />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[1]"
      style={{
        opacity: containerOpacity,
        pointerEvents: displayScene ? "auto" : "none",
        transition: "opacity 0.5s ease",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: "low-power" }}
        dpr={[1, isMobile ? 1 : 1.5]}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            setCtxLost((n) => n + 1);
          });
        }}
      >
        <SceneGuard active={!!displayScene} />

        {displayScene && (
          <>
            <SceneCamera scene={displayScene} />
            <ambientLight intensity={displayScene === "travel" ? 0.3 : 0.2} />
            <DisposableGroup key={displayScene}>
              <ActiveScene scene={displayScene} isMobile={isMobile} />
            </DisposableGroup>
            <OrbitControls
              key={displayScene}
              enableZoom={false}
              enablePan={false}
              rotateSpeed={0.35}
            />
          </>
        )}
      </Canvas>
    </div>
  );
}
