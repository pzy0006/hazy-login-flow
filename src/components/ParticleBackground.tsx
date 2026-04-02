import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const colors = [
      "hsla(220, 80%, 65%, 0.5)",
      "hsla(260, 60%, 60%, 0.4)",
      "hsla(200, 80%, 55%, 0.4)",
      "hsla(180, 60%, 50%, 0.3)",
      "hsla(240, 50%, 70%, 0.3)",
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 5000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const drawConnections = (p: Particle) => {
      for (const other of particles) {
        const dx = p.x - other.x;
        const dy = p.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `hsla(220, 70%, 60%, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        drawConnections(p);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Gradient base layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--particle-1)/0.15)] via-[hsl(var(--particle-2)/0.1)] to-[hsl(var(--particle-3)/0.15)]" />
      
      {/* Canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px]" />
      
      {/* Floating orbs for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[hsl(var(--particle-1)/0.08)] blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[hsl(var(--particle-2)/0.08)] blur-3xl animate-float-medium" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-[hsl(var(--particle-3)/0.06)] blur-3xl animate-float-fast" />
    </div>
  );
};

export default ParticleBackground;
