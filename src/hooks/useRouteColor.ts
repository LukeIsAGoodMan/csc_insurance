import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/**
 * Route-aware color palette for the nebula background.
 * Returns RGB vec3 triplets (0–1 range) for GLSL uniforms.
 */
export interface RouteColors {
  col1: [number, number, number];
  col2: [number, number, number];
  col3: [number, number, number];
}

const palettes: Record<string, RouteColors> = {
  "/auto-insurance": {
    col1: [0.18, 0.24, 0.62], // deep navy
    col2: [0.25, 0.34, 0.78], // strong blue
    col3: [0.38, 0.42, 0.88], // bright blue
  },
  "/home-insurance": {
    col1: [0.52, 0.38, 0.92], // soft violet
    col2: [0.48, 0.44, 0.86], // lavender
    col3: [0.60, 0.52, 0.95], // light purple
  },
  "/business-insurance": {
    col1: [0.22, 0.28, 0.72], // corporate blue
    col2: [0.34, 0.38, 0.82], // steel blue
    col3: [0.44, 0.48, 0.90], // bright steel
  },
  "/travel-insurance": {
    col1: [0.30, 0.42, 0.88], // sky blue
    col2: [0.44, 0.36, 0.92], // violet
    col3: [0.38, 0.52, 0.94], // cyan-blue
  },
};

// Default: original blue-violet
const defaultPalette: RouteColors = {
  col1: [0.44, 0.36, 0.92],
  col2: [0.30, 0.42, 0.88],
  col3: [0.55, 0.48, 0.95],
};

export function useRouteColor(): RouteColors {
  const { pathname } = useLocation();
  return useMemo(() => palettes[pathname] ?? defaultPalette, [pathname]);
}
