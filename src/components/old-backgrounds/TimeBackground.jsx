import { useEffect, useRef } from "react";
import "./TimeBackground.css";

export default function TimeBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let animationFrame;
    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = Array.from(
        {
          length: Math.min(
            110,
            Math.floor((width * height) / 12000)
          ),
        },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.6 + 0.3,
          speed: Math.random() * 0.35 + 0.08,
          phase: Math.random() * Math.PI * 2,
        })
      );
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);

      // Deep midnight background with a subtle central glow
      const glow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        0,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.75
      );

      glow.addColorStop(0, "#111d38");
      glow.addColorStop(0.55, "#080f20");
      glow.addColorStop(1, "#030610");

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.48;
      const base = Math.min(width, height) * 0.23;
      const rotation = time * 0.00008;

      // Slowly rotating orbital rings
      for (let i = 0; i < 5; i++) {
        const radius = base * (0.65 + i * 0.28);

        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          radius,
          radius * (0.82 + i * 0.025),
          rotation * (i % 2 ? -1 : 1) + i * 0.2,
          0,
          Math.PI * 2
        );

        ctx.strokeStyle =
          i % 2
            ? "rgba(74, 160, 220, 0.12)"
            : "rgba(221, 180, 104, 0.13)";

        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Clock-face markings
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation * 2);

      for (let i = 0; i < 120; i++) {
        const angle = (i / 120) * Math.PI * 2;
        const major = i % 5 === 0;
        const outer = base * 0.82;
        const inner = outer - (major ? 13 : 5);

        ctx.beginPath();
        ctx.moveTo(
          Math.cos(angle) * outer,
          Math.sin(angle) * outer
        );
        ctx.lineTo(
          Math.cos(angle) * inner,
          Math.sin(angle) * inner
        );

        ctx.strokeStyle = major
          ? "rgba(233, 194, 126, 0.55)"
          : "rgba(139, 183, 218, 0.22)";

        ctx.lineWidth = major ? 1.4 : 0.7;
        ctx.stroke();
      }

      ctx.restore();

      // Floating, glowing particles
      for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(time * 0.0003 + p.phase) * 0.15;

        if (p.y < -5) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }

        const alpha =
          0.25 +
          ((Math.sin(time * 0.001 + p.phase) + 1) / 2) * 0.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155, 203, 245, ${alpha})`;
        ctx.fill();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    animationFrame = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="time-background" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="time-background__canvas"
      />
      <div className="time-background__vignette" />
    </div>
  );
}
