import { useEffect, useRef } from "react";

const LiquidWaveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawWave = (
      yBase: number,
      amplitude: number,
      frequency: number,
      speed: number,
      color: string,
      phase: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x += 2) {
        const y =
          yBase +
          Math.sin(x * frequency + time * speed + phase) * amplitude +
          Math.sin(x * frequency * 0.5 + time * speed * 0.7 + phase * 1.3) * amplitude * 0.6 +
          Math.cos(x * frequency * 0.3 + time * speed * 0.4 + phase * 0.7) * amplitude * 0.3;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.008;

      const h = canvas.height;

      // Deep layered waves from back to front
      drawWave(h * 0.35, 40, 0.003, 0.4, "hsla(260, 70%, 15%, 0.15)", 0);
      drawWave(h * 0.42, 35, 0.004, 0.5, "hsla(220, 80%, 20%, 0.12)", 1);
      drawWave(h * 0.50, 30, 0.005, 0.6, "hsla(200, 70%, 18%, 0.10)", 2);
      drawWave(h * 0.55, 25, 0.004, 0.7, "hsla(240, 60%, 22%, 0.13)", 3);
      drawWave(h * 0.62, 35, 0.003, 0.45, "hsla(220, 80%, 25%, 0.10)", 4);
      drawWave(h * 0.70, 28, 0.005, 0.55, "hsla(260, 50%, 20%, 0.12)", 5);
      drawWave(h * 0.78, 22, 0.006, 0.65, "hsla(200, 60%, 15%, 0.14)", 6);
      drawWave(h * 0.85, 18, 0.004, 0.75, "hsla(230, 70%, 12%, 0.18)", 7);

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
    <div className="fixed inset-0 -z-10 bg-background">
      {/* Deep space radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--particle-1)/0.08)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--particle-2)/0.06)_0%,_transparent_50%)]" />

      {/* Liquid wave canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Soft blur overlay for depth */}
      <div className="absolute inset-0 backdrop-blur-[1px]" />
    </div>
  );
};

export default LiquidWaveBackground;
