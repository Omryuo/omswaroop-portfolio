"use client";

import { useEffect, useRef } from "react";

type NodeType = "standard" | "gateway" | "database" | "core" | "threat";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  ph: number;
  type: NodeType;
  label: string;
  alertTime: number;
  alertText: string;
  alertTextY: number;
  alertTextOpacity: number;
};

type Packet = {
  i: number;
  j: number;
  t: number;
  sp: number;
  c: string;
  isThreat: boolean;
  history: { x: number; y: number }[];
  path?: number[];
  pathIndex?: number;
};

type Ripple = {
  x: number;
  y: number;
  r: number;
  maxR: number;
  c: string;
};

const CRIM = "255,90,114";
const VIO = "185,133,255";
const DIST = 120;

const ALERTS = [
  "BLOCKED: SQL_INJECTION",
  "IDS: PORT_SCAN_BLOCKED",
  "MITIGATED: DDOS_ATTACK",
  "CONTAINED: APT29_MALWARE",
  "PREVENTED: SHELLCODE_EXEC",
  "BLOCKED: BRUTEFORCE_ATTACK"
];

export function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let frame = 0;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let ripples: Ripple[] = [];
    let mx = -1;
    let my = -1;
    let lastThreatSpawn = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Generate Nodes
    const N = Math.max(24, Math.min(44, Math.round(w / 14)));
    const tempNodes: Node[] = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: 1.1 + Math.random() * 1.4,
      ph: Math.random() * Math.PI * 2,
      type: "standard",
      label: "",
      alertTime: 0,
      alertText: "",
      alertTextY: 0,
      alertTextOpacity: 0,
    }));

    // Find distinct indices for special nodes based on positioning
    const sortedTL = [...tempNodes]
      .map((n, i) => ({ n, i, d: Math.hypot(n.x, n.y) }))
      .sort((a, b) => a.d - b.d);
    const threatActorIdx = sortedTL[0].i;

    const sortedBR = [...tempNodes]
      .map((n, i) => ({ n, i, d: Math.hypot(w - n.x, h - n.y) }))
      .filter((item) => item.i !== threatActorIdx)
      .sort((a, b) => a.d - b.d);
    const dbIdx = sortedBR[0].i;

    const sortedTR = [...tempNodes]
      .map((n, i) => ({ n, i, d: Math.hypot(w - n.x, n.y) }))
      .filter((item) => item.i !== threatActorIdx && item.i !== dbIdx)
      .sort((a, b) => a.d - b.d);
    const gatewayIdx = sortedTR[0].i;

    const sortedCenter = [...tempNodes]
      .map((n, i) => ({ n, i, d: Math.hypot(w / 2 - n.x, h / 2 - n.y) }))
      .filter((item) => item.i !== threatActorIdx && item.i !== dbIdx && item.i !== gatewayIdx)
      .sort((a, b) => a.d - b.d);
    const socIdx = sortedCenter[0].i;

    const sortedAgent = [...tempNodes]
      .map((n, i) => ({ n, i, d: Math.hypot(w * 0.75 - n.x, h * 0.5 - n.y) }))
      .filter((item) => item.i !== threatActorIdx && item.i !== dbIdx && item.i !== gatewayIdx && item.i !== socIdx)
      .sort((a, b) => a.d - b.d);
    const agentIdx = sortedAgent[0].i;

    tempNodes.forEach((n, idx) => {
      if (idx === threatActorIdx) {
        n.type = "threat";
        n.label = "ATTACK_SRC";
      } else if (idx === dbIdx) {
        n.type = "database";
        n.label = "DB_SECURE";
      } else if (idx === gatewayIdx) {
        n.type = "gateway";
        n.label = "GW_EXTERNAL";
      } else if (idx === socIdx) {
        n.type = "core";
        n.label = "SOC_CORE";
      } else if (idx === agentIdx) {
        n.type = "core";
        n.label = "AGENT_01";
      }
    });

    nodes = tempNodes;

    const neighbors = (i: number) => {
      const out: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < DIST * DIST) out.push(j);
      }
      return out;
    };

    const findPath = (start: number, end: number): number[] | null => {
      const queue: number[][] = [[start]];
      const visited = new Set<number>([start]);
      while (queue.length > 0) {
        const path = queue.shift()!;
        const node = path[path.length - 1];
        if (node === end) return path;
        
        const nb = neighbors(node);
        for (const n of nb) {
          if (!visited.has(n)) {
            visited.add(n);
            queue.push([...path, n]);
          }
        }
      }
      return null;
    };

    const addRipple = (x: number, y: number, maxR: number, c: string) => {
      ripples.push({ x, y, r: 2, maxR, c });
    };

    const spawnPacket = () => {
      if (packets.filter(p => !p.isThreat).length >= 8) return;
      let i = Math.floor(Math.random() * nodes.length);
      if (i === threatActorIdx) i = (i + 1) % nodes.length;
      
      const nb = neighbors(i);
      if (!nb.length) return;
      const j = nb[Math.floor(Math.random() * nb.length)];
      packets.push({
        i,
        j,
        t: 0,
        sp: 0.005 + Math.random() * 0.008,
        c: Math.random() < 0.4 ? CRIM : VIO,
        isThreat: false,
        history: []
      });
    };

    const spawnThreat = () => {
      const targets = [dbIdx, socIdx, agentIdx];
      const target = targets[Math.floor(Math.random() * targets.length)];
      const path = findPath(threatActorIdx, target);
      if (path && path.length > 1) {
        packets.push({
          i: path[0],
          j: path[1],
          t: 0,
          sp: 0.012,
          c: CRIM,
          isThreat: true,
          history: [],
          path: path,
          pathIndex: 0
        });
        lastThreatSpawn = frame;
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => {
      mx = -1;
      my = -1;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      // Node Physics
      if (!reduce) {
        for (const n of nodes) {
          if (mx >= 0) {
            const dx = mx - n.x;
            const dy = my - n.y;
            const d = Math.hypot(dx, dy);
            if (d < 160 && d > 0.001) {
              const f = (1 - d / 160) * 0.015;
              n.vx += (dx / d) * f;
              n.vy += (dy / d) * f;
            }
          }
          n.x += n.vx;
          n.y += n.vy;
          n.vx *= 0.995;
          n.vy *= 0.995;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          n.x = Math.max(0, Math.min(w, n.x));
          n.y = Math.max(0, Math.min(h, n.y));
        }
      }

      // Draw Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < DIST * DIST) {
            const d = Math.sqrt(d2);
            const al = (1 - d / DIST) * 0.35;
            
            // Check if connection is part of the threat path
            const activeThreat = packets.find(p => p.isThreat);
            let isThreatPath = false;
            if (activeThreat && activeThreat.path && activeThreat.pathIndex !== undefined) {
              const pIdx = activeThreat.path.indexOf(i);
              const pIdxJ = activeThreat.path.indexOf(j);
              // Must be consecutive nodes in the path
              if (pIdx !== -1 && pIdxJ !== -1 && Math.abs(pIdx - pIdxJ) === 1) {
                isThreatPath = true;
              }
            }

            if (isThreatPath) {
              ctx.strokeStyle = `rgba(${CRIM}, ${Math.min(0.85, al * 2.5)})`;
              ctx.lineWidth = 1.1;
              ctx.save();
              ctx.setLineDash([4, 4]);
              ctx.lineDashOffset = -frame * 0.18;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
              ctx.restore();
            } else {
              ctx.strokeStyle = (i + j) % 2 ? `rgba(${CRIM},${al})` : `rgba(${VIO},${al})`;
              ctx.lineWidth = 0.55;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw Cursor Connections
      if (mx >= 0) {
        for (const n of nodes) {
          const dx = mx - n.x;
          const dy = my - n.y;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            const al = (1 - d / 140) * 0.42;
            ctx.strokeStyle = `rgba(${VIO},${al})`;
            ctx.lineWidth = 0.65;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 55);
        g.addColorStop(0, `rgba(${CRIM},0.15)`);
        g.addColorStop(1, `rgba(${CRIM},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mx, my, 55, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Ripples
      ripples = ripples.filter((rip) => {
        rip.r += 0.75;
        const alpha = Math.max(0, 1 - rip.r / rip.maxR);
        if (alpha <= 0) return false;
        
        ctx.strokeStyle = `rgba(${rip.c}, ${alpha})`;
        ctx.lineWidth = 0.95;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.stroke();
        return true;
      });

      // Spawn Threat Packet if none is active
      const hasActiveThreat = packets.some(p => p.isThreat);
      if (!reduce && !hasActiveThreat && frame - lastThreatSpawn > 320) {
        spawnThreat();
      }

      // Packets Processing
      if (!reduce) {
        if (frame % 25 === 0) spawnPacket();

        packets = packets.filter((p) => {
          p.t += p.sp;
          
          const a = nodes[p.i];
          const b = nodes[p.j];
          if (!a || !b) return false;

          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;

          // Track trail history
          p.history.push({ x, y });
          if (p.history.length > 8) p.history.shift();

          // Draw trails
          for (let k = 0; k < p.history.length; k++) {
            const pt = p.history[k];
            const ratio = (k + 1) / p.history.length;
            const size = p.isThreat ? (1.0 + ratio * 2.2) : (0.8 + ratio * 1.5);
            const alpha = ratio * (p.isThreat ? 0.75 : 0.45);
            ctx.fillStyle = `rgba(${p.c}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
            ctx.fill();
          }

          // Lead dot
          const leadingSize = p.isThreat ? 2.8 : 1.9;
          ctx.fillStyle = `rgba(${p.c}, 0.95)`;
          ctx.beginPath();
          ctx.arc(x, y, leadingSize, 0, Math.PI * 2);
          ctx.fill();

          // Glow for threat packet
          if (p.isThreat) {
            const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, 8);
            glowGrad.addColorStop(0, `rgba(${p.c}, 0.35)`);
            glowGrad.addColorStop(1, `rgba(${p.c}, 0)`);
            ctx.fillStyle = glowGrad;
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();
          }

          // Check destination
          if (p.t >= 1) {
            if (p.isThreat && p.path && p.pathIndex !== undefined) {
              const currentPathIdx = p.pathIndex;
              if (currentPathIdx + 1 < p.path.length - 1) {
                p.pathIndex = currentPathIdx + 1;
                p.i = p.path[p.pathIndex];
                p.j = p.path[p.pathIndex + 1];
                p.t = 0;
                addRipple(b.x, b.y, 30, CRIM);
                return true;
              } else {
                // Reached final asset
                const destNode = nodes[p.path[p.path.length - 1]];
                if (destNode) {
                  destNode.alertTime = 95;
                  destNode.alertText = ALERTS[Math.floor(Math.random() * ALERTS.length)];
                  destNode.alertTextY = -5;
                  destNode.alertTextOpacity = 1.0;
                  addRipple(destNode.x, destNode.y, 70, CRIM);
                }
                return false;
              }
            } else {
              // Standard packet reached target
              addRipple(b.x, b.y, 18, VIO);
              return false;
            }
          }
          return true;
        });
      }

      // Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const tw = reduce ? 0.9 : 0.75 + 0.25 * Math.sin(frame * 0.03 + n.ph);
        const col = i % 2 ? CRIM : VIO;
        
        let isAsset = n.type !== "standard";
        let nodeColor = col;
        let baseR = n.r;

        if (n.type === "threat") {
          nodeColor = CRIM;
          baseR = 3.5;
        } else if (n.type === "database" || n.type === "gateway") {
          baseR = 3.2;
        } else if (n.type === "core") {
          baseR = 3.5;
        }

        // Handle alert flashing
        if (n.alertTime > 0) {
          nodeColor = CRIM;
          const flash = Math.sin(frame * 0.45) > 0;
          ctx.fillStyle = flash ? `rgba(${CRIM}, 0.95)` : `rgba(255, 255, 255, 0.4)`;
        } else {
          ctx.fillStyle = `rgba(${nodeColor}, ${0.9 * tw})`;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, baseR, 0, Math.PI * 2);
        ctx.fill();

        // Draw rotating dashed rings for assets
        if (isAsset && !reduce) {
          ctx.strokeStyle = `rgba(${nodeColor}, 0.55)`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          
          if (n.type === "gateway" || n.type === "threat") {
            ctx.save();
            ctx.setLineDash([2.5, 3]);
            ctx.arc(n.x, n.y, baseR + 5, 0, Math.PI * 2);
            ctx.lineDashOffset = frame * 0.12;
            ctx.stroke();
            ctx.restore();
          } else {
            const ringR = baseR + 4.5 + Math.sin(frame * 0.05 + n.ph) * 1.5;
            ctx.arc(n.x, n.y, ringR, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        // Label for assets
        if (isAsset && n.label) {
          ctx.font = "9px ui-monospace, JetBrains Mono, SFMono-Regular, monospace";
          ctx.fillStyle = n.type === "threat" 
            ? "rgba(255, 90, 114, 0.6)" 
            : "rgba(244, 244, 246, 0.45)";
          ctx.fillText(n.label, n.x + 9, n.y + 3.5);
        }

        // Alert popup
        if (n.alertTime > 0 && n.alertText) {
          n.alertTime--;
          n.alertTextY -= 0.15;
          
          if (n.alertTime < 30) {
            n.alertTextOpacity = n.alertTime / 30;
          }

          const txt = n.alertText;
          ctx.font = "bold 9px ui-monospace, JetBrains Mono, SFMono-Regular, monospace";
          const twid = ctx.measureText(txt).width;
          const padX = 6;
          const padY = 3.5;
          const bx = n.x - twid / 2 - padX;
          const by = n.y + n.alertTextY - 20;

          // Draw popup bubble
          ctx.fillStyle = `rgba(18, 12, 18, ${0.9 * n.alertTextOpacity})`;
          ctx.strokeStyle = `rgba(255, 35, 66, ${0.5 * n.alertTextOpacity})`;
          ctx.lineWidth = 1.0;
          
          const rx = bx;
          const ry = by;
          const rw = twid + padX * 2;
          const rh = 15;
          const rad = 3;
          
          ctx.beginPath();
          ctx.moveTo(rx + rad, ry);
          ctx.lineTo(rx + rw - rad, ry);
          ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rad);
          ctx.lineTo(rx + rw, ry + rh - rad);
          ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rad, ry + rh);
          ctx.lineTo(rx + rad, ry + rh);
          ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rad);
          ctx.lineTo(rx, ry + rad);
          ctx.quadraticCurveTo(rx, ry, rx + rad, ry);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Alert Text
          ctx.fillStyle = `rgba(255, 90, 114, ${n.alertTextOpacity})`;
          ctx.fillText(txt, bx + padX, by + 10.5);
        }
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
