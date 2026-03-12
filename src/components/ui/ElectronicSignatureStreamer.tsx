import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ────────────────────────────────────────────────────────────
   ElectronicSignatureStreamer — Neon signature pad modal.

   Material:  Glassmorphism 2.0 (blur-60 + bg-white/3%)
   Stroke:    #6366F1 base → #A855F7 glow → #E879F9 bright core
   Streamer:  Glow color cycles through palette as stroke progresses
   Canvas:    DPI-aware, touch-enabled, smooth lineTo drawing
   ──────────────────────────────────────────────────────────── */

interface SignatureStreamerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (dataUrl: string) => void;
  onSuccess?: () => void;
}

const GLOW_PALETTE = ["#A855F7", "#E879F9", "#818CF8"];
const SPRING = { type: "spring" as const, stiffness: 300, damping: 30 };

export function ElectronicSignatureStreamer({ open, onClose, onConfirm, onSuccess }: SignatureStreamerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const distRef = useRef(0);
  const [hasStrokes, setHasStrokes] = useState(false);

  /* ── DPI-aware canvas init ── */
  useEffect(() => {
    if (!open) return;
    setHasStrokes(false);
    distRef.current = 0;

    // Defer to allow layout to settle
    const raf = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      drawGuide(ctx, rect.width, rect.height);
    });

    return () => cancelAnimationFrame(raf);
  }, [open]);

  function drawGuide(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.beginPath();
    ctx.moveTo(32, h * 0.72);
    ctx.lineTo(w - 32, h * 0.72);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.stroke();
    ctx.font = "14px system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillText("\u00d7", 24, h * 0.72 - 8);
  }

  /* ── Coordinate helpers ── */
  function mousePos(e: React.MouseEvent) {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function touchPos(e: React.TouchEvent) {
    const r = canvasRef.current!.getBoundingClientRect();
    const t = e.touches[0] ?? e.changedTouches[0];
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }

  /* ── Drawing engine ── */
  function beginStroke(pos: { x: number; y: number }) {
    lastRef.current = pos;
  }

  function addPoint(pos: { x: number; y: number }) {
    const prev = lastRef.current;
    if (!prev) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const dx = pos.x - prev.x;
    const dy = pos.y - prev.y;
    distRef.current += Math.sqrt(dx * dx + dy * dy);

    // Glow layer — streamer color cycles along stroke distance
    const glowIdx = Math.floor(distRef.current / 40) % GLOW_PALETTE.length;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#6366F1";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowBlur = 14;
    ctx.shadowColor = GLOW_PALETTE[glowIdx];
    ctx.stroke();

    // Bright core
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#E879F9";
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
    ctx.stroke();

    lastRef.current = pos;
    if (!hasStrokes) setHasStrokes(true);
  }

  function endStroke() {
    lastRef.current = null;
  }

  /* ── Actions ── */
  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rect = canvas.getBoundingClientRect();
    drawGuide(ctx, rect.width, rect.height);
    setHasStrokes(false);
    distRef.current = 0;
  }

  function handleConfirm() {
    if (!canvasRef.current) return;
    onConfirm(canvasRef.current.toDataURL("image/png"));
    onSuccess?.();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[50] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop — dims & blurs the 3D globe */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
            onClick={onClose}
          />

          {/* Glass modal */}
          <motion.div
            className="relative z-10 mx-6 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={SPRING}
          >
            <div className="overflow-hidden rounded-3xl border border-white/10">
              {/* Glass background */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{
                  backdropFilter: "blur(60px)",
                  WebkitBackdropFilter: "blur(60px)",
                  background: "rgba(255,255,255,0.03)",
                  boxShadow:
                    "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 8px 60px rgba(0,0,0,0.2)",
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-8">
                <h2 className="text-lg font-semibold tracking-tight text-primary">
                  Electronic Signature
                </h2>
                <p className="mt-1 text-xs text-primary/35">
                  Draw your signature below to confirm your application.
                </p>

                {/* Signature canvas */}
                <canvas
                  ref={canvasRef}
                  className="mt-5 w-full cursor-crosshair rounded-2xl"
                  style={{
                    height: 200,
                    touchAction: "none",
                    background: "rgba(6,6,18,0.6)",
                    boxShadow: "inset 0 2px 12px rgba(0,0,0,0.3)",
                  }}
                  onMouseDown={(e) => beginStroke(mousePos(e))}
                  onMouseMove={(e) => addPoint(mousePos(e))}
                  onMouseUp={endStroke}
                  onMouseLeave={endStroke}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    beginStroke(touchPos(e));
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    addPoint(touchPos(e));
                  }}
                  onTouchEnd={endStroke}
                />

                <p className="mt-2 text-[10px] uppercase tracking-widest text-primary/20">
                  Sign above the line
                </p>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-sm text-primary/35 transition-colors hover:text-primary/60"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!hasStrokes}
                    className={`rounded-full border px-8 py-2.5 text-sm font-medium transition-all ${
                      hasStrokes
                        ? "border-accent-trust text-accent-trust hover:bg-accent-trust hover:text-white"
                        : "cursor-not-allowed border-primary/10 text-primary/20"
                    }`}
                  >
                    Confirm &amp; Sign
                  </button>
                </div>

                <p className="mt-5 text-[10px] leading-relaxed text-primary/20">
                  By signing above you confirm that the information provided is accurate
                  and authorize CSC Insurance to process your application.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
