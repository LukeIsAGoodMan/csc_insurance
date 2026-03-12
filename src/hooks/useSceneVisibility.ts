import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

/* ────────────────────────────────────────────────────────────
   useSceneVisibility — Fade state machine for 3D scene transitions.

   Extracted from GlobalCanvasManager so the canvas can live at
   the App root while the visibility logic tracks route changes.
   ──────────────────────────────────────────────────────────── */

const SCENE_MAP: Record<string, string> = {
  "/auto-insurance": "auto",
  "/home-insurance": "home",
  "/business-insurance": "business",
  "/travel-insurance": "globe",
  "/get-a-quote": "auto",
  "/about": "globe",
};

export interface SceneVisibility {
  displayScene: string | null;
  containerOpacity: number;
}

export function useSceneVisibility(): SceneVisibility {
  const { pathname } = useLocation();
  const targetScene = SCENE_MAP[pathname] ?? null;
  const [displayScene, setDisplayScene] = useState<string | null>(targetScene);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (targetScene === displayScene) {
      setFading(false);
      return;
    }
    setFading(true);
    const id = setTimeout(() => {
      setDisplayScene(targetScene);
      requestAnimationFrame(() => setFading(false));
    }, 500);
    return () => clearTimeout(id);
  }, [targetScene, displayScene]);

  const containerOpacity = fading ? 0 : displayScene ? 0.8 : 0;
  return { displayScene, containerOpacity };
}
