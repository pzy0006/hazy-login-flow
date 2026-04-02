import { useEffect, useRef } from "react";

const LiquidGlassBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const w = () => canvas.width / window.devicePixelRatio;
    const h = () => canvas.height / window.devicePixelRatio;

    // Metaball-like blobs for liquid glass effect
    const blobs = Array.from({ length: 7 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      radius: 0.15 + Math.random() * 0.2,
      phase: i * 0.9,
    }));

    const animate = () => {
      const W = w();
      const H = h();
      ctx.clearRect(0, 0, W, H);
      time += 0.003;

      // Deep black base
      ctx.fillStyle = "hsl(230, 25%, 3%)";
      ctx.fillRect(0, 0, W, H);

      // Update blob positions with organic motion
      blobs.forEach((b) => {
        b.x += Math.sin(time * 2 + b.phase) * 0.0008 + b.vx;
        b.y += Math.cos(time * 1.5 + b.phase * 1.3) * 0.0006 + b.vy;
        if (b.x < -0.2) b.x = 1.2;
        if (b.x > 1.2) b.x = -0.2;
        if (b.y < -0.2) b.y = 1.2;
        if (b.y > 1.2) b.y = -0.2;
      });

      // Draw liquid glass layers
      // Layer 1: Deep ambient glow
      blobs.forEach((b, i) => {
        const cx = b.x * W;
        const cy = b.y * H;
        const r = b.radius * Math.min(W, H);

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const hue = 210 + Math.sin(time + b.phase) * 30;
        const lightness = 8 + Math.sin(time * 0.7 + i) * 4;
        grad.addColorStop(0, `hsla(${hue}, 60%, ${lightness + 10}%, 0.15)`);
        grad.addColorStop(0.4, `hsla(${hue}, 50%, ${lightness + 5}%, 0.08)`);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      });

      // Layer 2: Glass surface reflections - flowing bands
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const yBase = H * (0.2 + i * 0.15);
        ctx.moveTo(0, yBase);

        for (let x = 0; x <= W; x += 3) {
          const nx = x / W;
          const wave1 = Math.sin(nx * 4 + time * 1.2 + i * 0.8) * 60;
          const wave2 = Math.sin(nx * 2.5 + time * 0.8 + i * 1.2) * 40;
          const wave3 = Math.cos(nx * 6 + time * 1.5 + i * 0.5) * 20;
          const y = yBase + wave1 + wave2 + wave3;
          ctx.lineTo(x, y);
        }

        const hue = 200 + i * 15 + Math.sin(time + i) * 10;
        const grad = ctx.createLinearGradient(0, yBase - 80, 0, yBase + 80);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.3, `hsla(${hue}, 70%, 25%, 0.04)`);
        grad.addColorStop(0.5, `hsla(${hue}, 80%, 40%, 0.07)`);
        grad.addColorStop(0.7, `hsla(${hue}, 70%, 25%, 0.04)`);
        grad.addColorStop(1, "transparent");

        ctx.strokeStyle = `hsla(${hue}, 60%, 50%, 0.06)`;
        ctx.lineWidth = 60 + Math.sin(time + i * 2) * 20;
        ctx.stroke();
      }
      ctx.restore();

      // Layer 3: Bright specular highlights (mirror reflections)
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < 3; i++) {
        const cx = W * (0.3 + i * 0.2 + Math.sin(time * 0.5 + i * 2) * 0.15);
        const cy = H * (0.3 + Math.cos(time * 0.4 + i * 1.5) * 0.2);
        const rx = 200 + Math.sin(time * 0.6 + i) * 80;
        const ry = 60 + Math.sin(time * 0.8 + i * 0.7) * 30;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.sin(time * 0.3 + i) * 0.3);
        ctx.scale(1, ry / rx);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        const hue = 220 + Math.sin(time * 0.5 + i * 1.5) * 20;
        grad.addColorStop(0, `hsla(${hue}, 80%, 70%, 0.08)`);
        grad.addColorStop(0.3, `hsla(${hue}, 60%, 50%, 0.04)`);
        grad.addColorStop(1, "transparent");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // Layer 4: Thin caustic lines (light through glass)
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const startY = H * (0.1 + i * 0.1);

        for (let x = 0; x <= W; x += 2) {
          const nx = x / W;
          const y =
            startY +
            Math.sin(nx * 8 + time * 2 + i * 0.7) * 15 +
            Math.sin(nx * 3 + time * 1.2 + i * 1.1) * 25 +
            Math.cos(nx * 12 + time * 2.5 + i * 0.4) * 5;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const alpha = 0.015 + Math.sin(time * 0.6 + i * 0.8) * 0.01;
        const hue = 190 + i * 10;
        ctx.strokeStyle = `hsla(${hue}, 90%, 70%, ${alpha})`;
        ctx.lineWidth = 1 + Math.sin(time + i) * 0.5;
        ctx.stroke();
      }
      ctx.restore();

      // Layer 5: Soft moving gradient overlay
      const grd = ctx.createLinearGradient(
        W * (0.3 + Math.sin(time * 0.3) * 0.2),
        0,
        W * (0.7 + Math.cos(time * 0.4) * 0.2),
        H
      );
      grd.addColorStop(0, "hsla(260, 50%, 10%, 0.08)");
      grd.addColorStop(0.5, "hsla(210, 60%, 15%, 0.05)");
      grd.addColorStop(1, "hsla(240, 40%, 8%, 0.1)");

      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-background overflow-hidden">
      {/* Ambient radial glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_20%,_hsla(220,80%,30%,0.06)_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,_hsla(260,60%,25%,0.05)_0%,_transparent_60%)]" />

      {/* Glass surface canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Frosted glass overlay for depth */}
      <div className="absolute inset-0 backdrop-blur-[0.5px]" />
    </div>
  );
};

export default LiquidGlassBackground;
