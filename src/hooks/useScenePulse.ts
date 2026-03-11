import { createContext, useContext, useState, useCallback } from "react";

/* ────────────────────────────────────────────────────────────
   ScenePulse — Lightweight context for 3D scene feedback.

   Components call triggerPulse() to notify 3D scenes of events.
   Scenes read `pulse` counter and react with visual feedback.
   ──────────────────────────────────────────────────────────── */

interface ScenePulseCtx {
  pulse: number;
  triggerPulse: () => void;
}

const ScenePulseContext = createContext<ScenePulseCtx>({
  pulse: 0,
  triggerPulse: () => {},
});

export function useScenePulse() {
  return useContext(ScenePulseContext);
}

export function useScenePulseProvider() {
  const [pulse, setPulse] = useState(0);
  const triggerPulse = useCallback(() => setPulse((n) => n + 1), []);
  return { pulse, triggerPulse };
}

export { ScenePulseContext };
