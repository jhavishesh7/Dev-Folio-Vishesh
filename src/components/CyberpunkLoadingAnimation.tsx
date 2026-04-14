import { useEffect, useRef } from "react";

interface CyberpunkLoadingAnimationProps {
  onComplete: () => void;
}

export default function CyberpunkLoadingAnimation({ onComplete }: CyberpunkLoadingAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // Logical dimensions (CSS px)
    const cw = () => canvas!.width / dpr;
    const ch = () => canvas!.height / dpr;

    const isMobile = window.innerWidth < 768;

    const COLS = {
      green: ["#00ff88", "#39ff14", "#00ffa3", "#7fff00", "#00e070"],
      pink:  ["#ff007f", "#ff2d9b", "#ff6ec7", "#ff0066", "#ff3399"],
      purple:["#9d4edd", "#c77dff", "#a78bfa", "#7c5cfc", "#c4b5fd"],
    };
    const ALL_COLS = [...COLS.green, ...COLS.pink, ...COLS.purple];
    const rc = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // ── background nodes ──
    const BNODES = isMobile ? 18 : 30;
    const bnodes = Array.from({ length: BNODES }, () => ({
      x: Math.random() * cw(),
      y: Math.random() * ch(),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.8,
      col: Math.random() < 0.45 ? rc(COLS.green) : Math.random() < 0.5 ? rc(COLS.pink) : rc(COLS.purple),
      fire: 0,
    }));
    const signals: { from: number; to: number; t: number; speed: number }[] = [];

    // ── particle count: scale with screen area for consistent density ──
    const NPARTICLES = isMobile ? 900 : 2000;

    // ── text pixel sampling — adaptive step to match particle count ──
    function getTextPixels(text: string, maxFontSize: number, w: number, h: number, targetCount: number) {
      const off = document.createElement("canvas");
      // Use a smaller offscreen canvas for performance (half resolution is fine for sampling)
      const scale = 0.5;
      const ow = Math.floor(w * scale);
      const oh = Math.floor(h * scale);
      off.width = ow;
      off.height = oh;
      const oc = off.getContext("2d");
      if (!oc) return [];

      // Scale font size for the smaller canvas
      let fontSize = maxFontSize * scale;
      const padX = ow * 0.06;
      const availableWidth = ow - padX * 2;

      oc.font = `900 ${fontSize}px 'Arial Black', 'Impact', sans-serif`;
      let measured = oc.measureText(text);

      if (measured.width > availableWidth) {
        fontSize = Math.floor(fontSize * (availableWidth / measured.width));
        oc.font = `900 ${fontSize}px 'Arial Black', 'Impact', sans-serif`;
      }

      oc.fillStyle = "#fff";
      oc.textAlign = "center";
      oc.textBaseline = "middle";
      oc.fillText(text, ow / 2, oh / 2);

      const data = oc.getImageData(0, 0, ow, oh).data;

      // First pass: collect all text pixels with step=2 (fine sampling on small canvas)
      const allPts: { x: number; y: number }[] = [];
      const step = 2;
      for (let y = 0; y < oh; y += step)
        for (let x = 0; x < ow; x += step)
          if (data[(y * ow + x) * 4 + 3] > 80) allPts.push({ x: x / scale, y: y / scale });

      // If we have fewer points than target, return all
      if (allPts.length <= targetCount) return allPts;

      // Subsample: shuffle then pick targetCount points for even coverage
      for (let i = allPts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPts[i], allPts[j]] = [allPts[j], allPts[i]];
      }
      return allPts.slice(0, targetCount);
    }

    // ── multi-line text for mobile ──
    function getMultiLineTextPixels(lines: string[], maxFontSize: number, w: number, h: number, targetCount: number) {
      const off = document.createElement("canvas");
      const scale = 0.5;
      const ow = Math.floor(w * scale);
      const oh = Math.floor(h * scale);
      off.width = ow;
      off.height = oh;
      const oc = off.getContext("2d");
      if (!oc) return [];

      let fontSize = maxFontSize * scale;
      const padX = ow * 0.08;
      const availableWidth = ow - padX * 2;

      // Measure each line and find the max width, scale font to fit
      oc.font = `900 ${fontSize}px 'Arial Black', 'Impact', sans-serif`;
      let maxLineWidth = 0;
      for (const line of lines) {
        const m = oc.measureText(line);
        if (m.width > maxLineWidth) maxLineWidth = m.width;
      }
      if (maxLineWidth > availableWidth) {
        fontSize = Math.floor(fontSize * (availableWidth / maxLineWidth));
        oc.font = `900 ${fontSize}px 'Arial Black', 'Impact', sans-serif`;
      }

      oc.fillStyle = "#fff";
      oc.textAlign = "center";
      oc.textBaseline = "middle";

      const lineHeight = fontSize * 1.3;
      const totalHeight = lineHeight * lines.length;
      const startY = (oh - totalHeight) / 2 + lineHeight / 2;

      for (let i = 0; i < lines.length; i++) {
        oc.fillText(lines[i], ow / 2, startY + i * lineHeight);
      }

      const data = oc.getImageData(0, 0, ow, oh).data;
      const allPts: { x: number; y: number }[] = [];
      const step = 2;
      for (let y = 0; y < oh; y += step)
        for (let x = 0; x < ow; x += step)
          if (data[(y * ow + x) * 4 + 3] > 80) allPts.push({ x: x / scale, y: y / scale });

      if (allPts.length <= targetCount) return allPts;

      for (let i = allPts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPts[i], allPts[j]] = [allPts[j], allPts[i]];
      }
      return allPts.slice(0, targetCount);
    }

    let vjTargets: { x: number; y: number }[] = [];
    let fullTargets: { x: number; y: number }[] = [];

    function buildTargets() {
      const w = cw(), h = ch();
      const vjSize = isMobile
        ? Math.min(140, w * 0.35, h * 0.25)
        : Math.min(200, w * 0.22, h * 0.35);

      vjTargets = getTextPixels("VJ", vjSize, w, h, NPARTICLES);

      if (isMobile) {
        const fullSize = Math.min(90, w * 0.25, h * 0.14);
        fullTargets = getMultiLineTextPixels(["Vishesh", "Jha"], fullSize, w, h, NPARTICLES);
      } else {
        const fullSize = Math.min(140, w * 0.16, h * 0.22);
        fullTargets = getTextPixels("Vishesh Jha", fullSize, w, h, NPARTICLES);
      }
    }
    buildTargets();

    // ── particles ──
    const particles = Array.from({ length: NPARTICLES }, () => {
      const col = rc(ALL_COLS);
      return {
        x: Math.random() * cw(),
        y: Math.random() * ch(),
        tx: 0,
        ty: 0,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5,
        col,
        baseCol: col,
        r: Math.random() * 1.4 + 1.2, // larger base radius for crystal-clear text fill
        fire: 0,
        delay: Math.floor(Math.random() * 40),
        glitch: 0,
      };
    });

    function assignTargets(pts: { x: number; y: number }[]) {
      if (pts.length === 0) return;
      for (let i = 0; i < particles.length; i++) {
        // Points array is already subsampled to ~NPARTICLES, so tile if needed
        const p = pts[i % pts.length];
        particles[i].tx = p.x + (Math.random() - 0.5) * 1.2;
        particles[i].ty = p.y + (Math.random() - 0.5) * 1.2;
        particles[i].delay = Math.floor(Math.random() * 12);
      }
    }

    function explodeParticles() {
      const cx = cw() / 2, cy = ch() / 2;
      for (const p of particles) {
        const dx = p.x - cx, dy = p.y - cy;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const spd = 5 + Math.random() * 12;
        p.vx = (dx / d) * spd + (Math.random() - 0.5) * 6;
        p.vy = (dy / d) * spd + (Math.random() - 0.5) * 6;
        p.glitch = 30 + Math.floor(Math.random() * 30);
      }
    }

    // phases: 0=float(100f), 1=form VJ(80f), 2=hold VJ(55f), 3=explode(40f), 4=form name(120f), 5=hold(160f), 6=done
    const PHASE_DUR = [100, 80, 55, 40, 120, 160, 999999];
    const stateRef = { phase: 0, phaseTimer: 0 };

    const handleResize = () => {
      resize();
      buildTargets();
      if (stateRef.phase >= 4) assignTargets(fullTargets);
      else if (stateRef.phase >= 1) assignTargets(vjTargets);
    };
    window.addEventListener("resize", handleResize);

    function spawnSignal() {
      const a = Math.floor(Math.random() * bnodes.length);
      const nb: number[] = [];
      for (let j = 0; j < bnodes.length; j++) {
        if (j === a) continue;
        const dx = bnodes[a].x - bnodes[j].x, dy = bnodes[a].y - bnodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 150) nb.push(j);
      }
      if (nb.length) {
        const b = nb[Math.floor(Math.random() * nb.length)];
        signals.push({ from: a, to: b, t: 0, speed: 0.02 + Math.random() * 0.02 });
        bnodes[a].fire = 1;
      }
    }

    let frame = 0;
    let rafId: number;
    let completeFired = false;

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function draw() {
      const w = cw(), h = ch();
      ctx!.clearRect(0, 0, w, h);
      frame++;
      stateRef.phaseTimer++;

      // Phase transitions
      if (stateRef.phaseTimer >= PHASE_DUR[stateRef.phase]) {
        stateRef.phase++;
        stateRef.phaseTimer = 0;
        const ph = stateRef.phase;
        if (ph === 1) assignTargets(vjTargets);
        if (ph === 3) explodeParticles();
        if (ph === 4) assignTargets(fullTargets);
        if (ph === 6 && !completeFired) {
          completeFired = true;
          onCompleteRef.current();
        }
      }

      const curPhase = stateRef.phase;

      // Background ambient (skip grid for performance with 2000 particles)

      // Background nodes
      for (const n of bnodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        if (n.fire > 0) n.fire -= 0.04;
      }
      // Node connections
      for (let i = 0; i < bnodes.length; i++) {
        for (let j = i + 1; j < bnodes.length; j++) {
          const dx = bnodes[i].x - bnodes[j].x, dy = bnodes[i].y - bnodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            const a = (1 - d / 150) * 0.1;
            ctx!.beginPath();
            ctx!.moveTo(bnodes[i].x, bnodes[i].y);
            ctx!.lineTo(bnodes[j].x, bnodes[j].y);
            ctx!.strokeStyle = `rgba(0,255,136,${a})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      // Signals
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i]; s.t += s.speed;
        if (s.t >= 1) { signals.splice(i, 1); bnodes[s.to].fire = 1; continue; }
        const fx = bnodes[s.from].x, fy = bnodes[s.from].y;
        const tx2 = bnodes[s.to].x, ty2 = bnodes[s.to].y;
        const sx = fx + (tx2 - fx) * s.t, sy = fy + (ty2 - fy) * s.t;
        ctx!.beginPath(); ctx!.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(57,255,20,0.9)"; ctx!.fill();
      }

      // Draw nodes
      for (const n of bnodes) {
        ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle = n.fire > 0 ? "#fff" : n.col;
        ctx!.globalAlpha = n.fire > 0 ? 1 : 0.45;
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }
      if (frame % 10 === 0 && signals.length < 12) spawnSignal();

      // ── Particles ──
      for (const p of particles) {
        if (p.delay > 0) { p.delay--; continue; }

        if (curPhase === 0) {
          // Float freely
          p.x += p.vx; p.y += p.vy;
          p.vx *= 0.99; p.vy *= 0.99;
          p.vx += (Math.random() - 0.5) * 0.1;
          p.vy += (Math.random() - 0.5) * 0.1;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        } else if (curPhase === 1 || curPhase === 2) {
          // Form / hold VJ
          p.x = lerp(p.x, p.tx, curPhase === 1 ? 0.07 : 0.025);
          p.y = lerp(p.y, p.ty, curPhase === 1 ? 0.07 : 0.025);
          if (curPhase === 2) {
            const d = Math.hypot(p.x - p.tx, p.y - p.ty);
            if (d < 4) p.col = Math.random() < 0.6 ? rc(COLS.green) : rc(COLS.pink);
          }
        } else if (curPhase === 3) {
          // Explode
          p.x += p.vx; p.y += p.vy;
          p.vx *= 0.92; p.vy *= 0.92;
          if (p.glitch > 0) {
            p.glitch--;
            p.col = p.glitch % 4 < 2 ? rc(COLS.green) : rc(COLS.pink);
          }
        } else if (curPhase >= 4) {
          // Form / hold full name
          const spd = curPhase === 4 ? 0.075 : 0.025;
          p.x = lerp(p.x, p.tx, spd);
          p.y = lerp(p.y, p.ty, spd);
        }

        let drawCol = p.col;
        let extraR = 0;
        let alpha = curPhase === 0 ? 0.6 : 1;

        if (curPhase >= 5) {
          // Gentle wave animation on hold phase
          extraR = Math.sin(frame * 0.04 + p.tx * 0.02) * 0.4;
          // Slow color cycle
          if (frame % 3 === 0) {
            const t2 = frame * 0.02 + p.ty * 0.01;
            drawCol = Math.sin(t2) > 0 ? rc(COLS.green) : rc(COLS.pink);
          }
        }

        // Main particle (no glow halo — sharper text with more particles)
        ctx!.globalAlpha = alpha;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r + extraR, 0, Math.PI * 2);
        ctx!.fillStyle = drawCol;
        ctx!.fill();
        ctx!.globalAlpha = 1;

        // White flicker on hold
        if (curPhase >= 5 && p.fire > 0) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.r + 1, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255,255,255,${p.fire})`;
          ctx!.fill();
          p.fire -= 0.12;
        }
        if (curPhase >= 5 && Math.random() < 0.0006) p.fire = 1;
      }

      rafId = requestAnimationFrame(draw);
    }

    assignTargets(vjTargets);
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#060610",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
