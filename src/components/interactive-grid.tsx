"use client";

import { useEffect, useRef } from "react";

type GridDot = {
  x: number;
  y: number;
  glow: number;
  alpha: number;
  size: number;
};

type RippleEvent = {
  x: number;
  y: number;
  r: number;
  maxR: number;
  speed: number;
};

export function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let animationFrameId = 0;
    let frame = 0;

    // Mouse coordinates (target and current interpolated)
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let curMouseX = -1000;
    let curMouseY = -1000;
    let mouseActive = false;

    // Click ripples array
    let ripples: RippleEvent[] = [];

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: PointerEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      mouseActive = true;
    };

    const onPointerLeave = () => {
      mouseActive = false;
      targetMouseX = -1000;
      targetMouseY = -1000;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 0,
        maxR: Math.max(width, height) * 0.9,
        speed: 7,
      });
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerdown", onPointerDown);

    const GAP = 45; // Grid spacing in px
    const WARP_RADIUS = 280; // Proximity radius for warp
    const MAX_PULL = 26; // Max displacement in px

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Interpolate mouse coordinates for liquid motion
      if (mouseActive) {
        if (curMouseX === -1000) {
          curMouseX = targetMouseX;
          curMouseY = targetMouseY;
        } else {
          curMouseX += (targetMouseX - curMouseX) * 0.08;
          curMouseY += (targetMouseY - curMouseY) * 0.08;
        }
      } else {
        curMouseX += (-1000 - curMouseX) * 0.08;
        curMouseY += (-1000 - curMouseY) * 0.08;
      }

      // Update ripples
      ripples = ripples.filter((rip) => {
        rip.r += rip.speed;
        return rip.r < rip.maxR;
      });

      const cols = Math.ceil(width / GAP) + 1;
      const rows = Math.ceil(height / GAP) + 1;

      // 2D grid allocation for drawing connections
      const grid: GridDot[][] = [];

      // Calculate all positions and glow values
      for (let col = 0; col < cols; col++) {
        grid[col] = [];
        for (let row = 0; row < rows; row++) {
          const rx = col * GAP - (width % GAP) / 2;
          const ry = row * GAP - (height % GAP) / 2;

          let dx = curMouseX - rx;
          let dy = curMouseY - ry;
          let d = Math.hypot(dx, dy);

          let x = rx;
          let y = ry;
          let glow = 0;

          // Mouse warp & glow (max glow = 0.45)
          if (d < WARP_RADIUS && d > 0.001) {
            const f = Math.pow(1 - d / WARP_RADIUS, 1.8) * MAX_PULL;
            x = rx + (dx / d) * f;
            y = ry + (dy / d) * f;
            glow = Math.pow(1 - d / WARP_RADIUS, 1.8) * 0.45;
          }

          // Click ripples interaction
          for (const rip of ripples) {
            const rdx = rx - rip.x;
            const rdy = ry - rip.y;
            const rd = Math.hypot(rdx, rdy);
            const distFromFront = Math.abs(rd - rip.r);

            if (distFromFront < 45 && rd > 0.001) {
              const ripStrength = (1 - distFromFront / 45) * (1 - rip.r / rip.maxR);
              glow += ripStrength * 0.35;

              // Displace away from ripple origin
              const push = ripStrength * 14;
              x += (rdx / rd) * push;
              y += (rdy / rd) * push;
            }
          }

          // Ambient breathing wave
          const wave = Math.sin((rx + ry) * 0.003 - frame * 0.015) * 0.016 + 0.016;
          const alpha = 0.035 + glow + wave;
          // Scale size up to 2.2px
          const size = 0.95 + glow * 2.8;

          grid[col][row] = { x, y, glow, alpha, size };
        }
      }

      // Draw connective lines (Mesh) first (underneath dots)
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const a = grid[col][row];

          // Connect to right neighbor
          if (col + 1 < cols) {
            const b = grid[col + 1][row];
            const sumGlow = a.glow + b.glow;
            if (sumGlow > 0.01) {
              const lineAlpha = 0.006 + sumGlow * 0.28;
              const lineFactor = Math.min(1, sumGlow / 0.7);
              // Shift from violet (155, 77, 255) to crimson (255, 90, 114) on hover
              const lr = Math.round(155 + (255 - 155) * lineFactor);
              const lg = Math.round(77 + (90 - 77) * lineFactor);
              const lb = Math.round(255 + (114 - 255) * lineFactor);

              ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${lineAlpha})`;
              ctx.lineWidth = 0.45 + lineFactor * 0.4;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }

          // Connect to bottom neighbor
          if (row + 1 < rows) {
            const c = grid[col][row + 1];
            const sumGlow = a.glow + c.glow;
            if (sumGlow > 0.01) {
              const lineAlpha = 0.006 + sumGlow * 0.28;
              const lineFactor = Math.min(1, sumGlow / 0.7);
              // Shift from violet (155, 77, 255) to crimson (255, 90, 114) on hover
              const lr = Math.round(155 + (255 - 155) * lineFactor);
              const lg = Math.round(77 + (90 - 77) * lineFactor);
              const lb = Math.round(255 + (114 - 255) * lineFactor);

              ctx.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${lineAlpha})`;
              ctx.lineWidth = 0.45 + lineFactor * 0.4;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(c.x, c.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw Grid Dots on top
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const a = grid[col][row];
          const factor = Math.min(1, a.glow / 0.45);
          // Shift from violet (155, 77, 255) to crimson (255, 90, 114) on hover
          const r = Math.round(155 + (255 - 155) * factor);
          const g = Math.round(77 + (90 - 77) * factor);
          const b = Math.round(255 + (114 - 255) * factor);

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a.alpha})`;
          ctx.beginPath();
          ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      } else {
        // Draw static grid once if motion is reduced
        ctx.clearRect(0, 0, width, height);
        const colsStatic = Math.ceil(width / GAP) + 1;
        const rowsStatic = Math.ceil(height / GAP) + 1;
        for (let col = 0; col < colsStatic; col++) {
          for (let row = 0; row < rowsStatic; row++) {
            const rx = col * GAP - (width % GAP) / 2;
            const ry = row * GAP - (height % GAP) / 2;
            ctx.fillStyle = `rgba(155, 77, 255, 0.035)`;
            ctx.beginPath();
            ctx.arc(rx, ry, 0.9, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
