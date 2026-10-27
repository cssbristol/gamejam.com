import { useEffect, useRef } from "react";
import "./TimeVortex.css";

export default function TimeVortex() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height, animationId;
    let time = 0;
    let stars = [];
    let clocks = [];
    let tardis = null;
    let tardisTimer = 0;
    let delorean = null;
    let deloreanTimer = 0;
    let deloreanNextSpawn = 1800 + Math.random() * 1200;

    const rand = (min, max) =>
      min + Math.random() * (max - min);

    // Create 2D clocks that fly across the screen.
    const createClock = (randomPosition = true) => ({
      x: randomPosition ? rand(0, width) : -60,
      y: randomPosition ? rand(0, height) : rand(0, height),
      vx: rand(0.7, 2.5) * (Math.random() > 0.5 ? 1 : -1),
      vy: rand(-0.9, 0.9),
      size: rand(22, 60),
      rotation: rand(0, Math.PI * 2),
      spin: rand(-0.025, 0.025),
      alpha: rand(0.4, 0.9),
      color: Math.random() > 0.3 ? "#e7b96d" : "#8db6e8",
    });

    const createTardis = () => ({
      x: Math.random() > 0.5 ? -100 : width + 100,
      y: rand(height * 0.12, height * 0.82),
      vx: rand(0.8, 1.5) * (Math.random() > 0.5 ? 1 : -1),
      vy: rand(-0.25, 0.25),
      size: rand(45, 75),
      rotation: rand(-0.08, 0.08),
      spin: rand(-0.003, 0.003),
      alpha: rand(0.75, 1),
    });

    const createDelorean = () => {
      const fromLeft = Math.random() > 0.5;

      return {
        x: fromLeft ? -150 : width + 150,
        y: rand(height * 0.15, height * 0.85),
        vx: fromLeft ? rand(2, 3.5) : -rand(2, 3.5),
        vy: rand(-0.3, 0.3),
        size: rand(75, 115),
        rotation: rand(-0.04, 0.04),
        spin: rand(-0.001, 0.001),
        alpha: rand(0.8, 1),
        direction: fromLeft ? 1 : -1,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: 180 }, () => ({
        angle: rand(0, Math.PI * 2),
        radius: Math.random() * Math.max(width, height),
        speed: rand(0.15, 0.7),
        size: rand(0.3, 2),
        alpha: rand(0.2, 0.9),
      }));

      clocks = Array.from({ length: 12 }, () => createClock());
    };

    // Draw a floating antique clock.
    const drawClock = (clock) => {
      const { x, y, size, rotation, alpha, color } = clock;
      const r = size / 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;

      // Metallic outer rim.
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "#101725";
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, size * 0.055);
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Clock face.
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
      ctx.fillStyle = "#1c2430";
      ctx.fill();

      // Hour markings.
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(
          Math.cos(a) * r * 0.62,
          Math.sin(a) * r * 0.62
        );
        ctx.lineTo(
          Math.cos(a) * r * 0.75,
          Math.sin(a) * r * 0.75
        );

        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(0.7, size * 0.025);
        ctx.stroke();
      }

      // Animated clock hands.
      const hands = [
        { angle: time * 0.8, length: 0.42, width: 1.5 },
        { angle: -time * 2.4, length: 0.62, width: 1 },
      ];

      hands.forEach((hand) => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
          Math.sin(hand.angle) * r * hand.length,
          -Math.cos(hand.angle) * r * hand.length
        );

        ctx.strokeStyle = "#ffe2a6";
        ctx.lineWidth = Math.max(0.8, hand.width * size / 30);
        ctx.stroke();
      });

      // Centre pin.
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1.5, size * 0.06), 0, Math.PI * 2);
      ctx.fillStyle = "#fff0c9";
      ctx.fill();

      ctx.restore();
    };

    // Draw a blue TARDIS-style police box.
    const drawTardis = (box) => {
      const { x, y, size, rotation, alpha } = box;
      const w = size * 0.62;
      const h = size;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;

      // Blue glow.
      ctx.shadowColor = "#238bff";
      ctx.shadowBlur = 22;

      // Roof.
      ctx.fillStyle = "#2863a9";
      ctx.fillRect(-w * 0.55, -h * 0.48, w * 1.1, h * 0.12);

      ctx.beginPath();
      ctx.moveTo(-w * 0.48, -h * 0.48);
      ctx.lineTo(-w * 0.35, -h * 0.57);
      ctx.lineTo(w * 0.35, -h * 0.57);
      ctx.lineTo(w * 0.48, -h * 0.48);
      ctx.closePath();
      ctx.fill();

      // Main body.
      ctx.fillStyle = "#124b91";
      ctx.fillRect(-w / 2, -h * 0.36, w, h * 0.84);
      ctx.strokeStyle = "#77baff";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-w / 2, -h * 0.36, w, h * 0.84);
      ctx.shadowBlur = 0;

      // Police box sign.
      ctx.fillStyle = "#071b30";
      ctx.fillRect(-w * 0.43, -h * 0.32, w * 0.86, h * 0.1);

      if (size > 45) {
        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.max(5, size * 0.065)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("POLICE BOX", 0, -h * 0.27, w * 0.82);
      }

      // Glowing roof lamp.
      ctx.fillStyle = "#b8eaff";
      ctx.shadowColor = "#83d6ff";
      ctx.shadowBlur = 15;
      ctx.fillRect(-w * 0.08, -h * 0.53, w * 0.16, h * 0.06);
      ctx.shadowBlur = 0;

      // Windows.
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          const wx = -w * 0.36 + col * w * 0.38;
          const wy = -h * 0.17 + row * h * 0.15;

          ctx.fillStyle = "#8edfff";
          ctx.shadowColor = "#43baff";
          ctx.shadowBlur = 9;
          ctx.fillRect(wx, wy, w * 0.3, h * 0.12);
          ctx.shadowBlur = 0;

          ctx.strokeStyle = "#071f43";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(wx, wy, w * 0.3, h * 0.12);
        }
      }

      // Door panels.
      ctx.strokeStyle = "#6ca4df";
      ctx.lineWidth = 1;

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          ctx.strokeRect(
            -w * 0.35 + col * w * 0.37,
            h * 0.15 + row * h * 0.1,
            w * 0.29,
            h * 0.08
          );
        }
      }

      // Door handle.
      ctx.beginPath();
      ctx.arc(w * 0.12, h * 0.14, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffe1a1";
      ctx.fill();

      ctx.restore();
    };

    // Draw a recognisable side-on DeLorean DMC-12 with Back to the Future details.
    const drawDelorean = (car) => {
      const { x, y, size, rotation, alpha, direction } = car;
      const w = size;
      const h = size * 0.48;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(direction, 1);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;

      // Three glowing time-travel exhausts at the rear.
      ctx.save();
      ctx.shadowColor = "#38dfff";
      ctx.shadowBlur = size * 0.18;

      for (let i = 0; i < 3; i++) {
        const exhaustX = -w * 0.505;
        const exhaustY = (i - 1) * h * 0.105;

        ctx.beginPath();
        ctx.ellipse(
          exhaustX,
          exhaustY,
          w * 0.045,
          h * 0.052,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "#111c28";
        ctx.fill();
        ctx.strokeStyle = "#a7f5ff";
        ctx.lineWidth = Math.max(1, size * 0.012);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(
          exhaustX - w * 0.012,
          exhaustY,
          w * 0.025,
          h * 0.031,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = i === 1 ? "#ffffff" : "#42d8ff";
        ctx.fill();
      }

      ctx.restore();

      // Stainless-steel wedge-shaped body.
      ctx.shadowColor = "#70e5ff";
      ctx.shadowBlur = size * 0.12;

      ctx.beginPath();
      ctx.moveTo(-w * 0.49, h * 0.105);
      ctx.lineTo(-w * 0.455, -h * 0.015);
      ctx.lineTo(-w * 0.32, -h * 0.075);
      ctx.lineTo(-w * 0.17, -h * 0.365);
      ctx.lineTo(w * 0.105, -h * 0.365);
      ctx.lineTo(w * 0.275, -h * 0.105);
      ctx.lineTo(w * 0.425, -h * 0.045);
      ctx.lineTo(w * 0.49, h * 0.075);
      ctx.lineTo(w * 0.475, h * 0.155);
      ctx.lineTo(w * 0.385, h * 0.19);
      ctx.lineTo(-w * 0.405, h * 0.19);
      ctx.lineTo(-w * 0.49, h * 0.145);
      ctx.closePath();

      const steel = ctx.createLinearGradient(
        0,
        -h * 0.4,
        0,
        h * 0.22
      );

      steel.addColorStop(0, "#f5f7f8");
      steel.addColorStop(0.18, "#c7d1d6");
      steel.addColorStop(0.42, "#778b96");
      steel.addColorStop(0.65, "#dfe6e9");
      steel.addColorStop(1, "#7c8c94");

      ctx.fillStyle = steel;
      ctx.fill();
      ctx.strokeStyle = "#f0fbff";
      ctx.lineWidth = Math.max(1, size * 0.012);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Rear bumper and red tail lights.
      ctx.fillStyle = "#202a32";
      ctx.fillRect(-w * 0.495, h * 0.13, w * 0.105, h * 0.035);

      ctx.fillStyle = "#e92c49";
      ctx.shadowColor = "#ff294d";
      ctx.shadowBlur = size * 0.07;
      ctx.fillRect(-w * 0.475, h * 0.065, w * 0.055, h * 0.025);
      ctx.fillRect(-w * 0.475, h * 0.095, w * 0.055, h * 0.025);
      ctx.shadowBlur = 0;

      // Rear engine-cover louvres.
      ctx.fillStyle = "#263640";
      ctx.fillRect(-w * 0.365, -h * 0.105, w * 0.13, h * 0.12);

      for (let i = 0; i < 6; i++) {
        const lineY = -h * 0.09 + i * h * 0.018;

        ctx.beginPath();
        ctx.moveTo(-w * 0.355, lineY);
        ctx.lineTo(-w * 0.245, lineY);
        ctx.strokeStyle = i % 2 === 0 ? "#d2dce1" : "#7b8c95";
        ctx.lineWidth = Math.max(0.7, size * 0.008);
        ctx.stroke();
      }

      // Mr. Fusion reactor on the rear deck.
      ctx.save();
      ctx.translate(-w * 0.285, -h * 0.19);

      ctx.fillStyle = "#d9e0e3";
      ctx.fillRect(-w * 0.045, -h * 0.11, w * 0.09, h * 0.13);

      ctx.fillStyle = "#7e8b91";
      ctx.fillRect(-w * 0.05, -h * 0.12, w * 0.1, h * 0.025);

      ctx.fillStyle = "#202b31";
      ctx.fillRect(-w * 0.035, -h * 0.075, w * 0.07, h * 0.045);

      ctx.fillStyle = "#a8f4ff";
      ctx.fillRect(-w * 0.025, -h * 0.065, w * 0.05, h * 0.012);

      ctx.restore();

      // Cabin windows and windscreen.
      ctx.beginPath();
      ctx.moveTo(-w * 0.14, -h * 0.325);
      ctx.lineTo(w * 0.085, -h * 0.325);
      ctx.lineTo(w * 0.225, -h * 0.115);
      ctx.lineTo(-w * 0.245, -h * 0.115);
      ctx.closePath();

      const glass = ctx.createLinearGradient(
        0,
        -h * 0.34,
        0,
        -h * 0.1
      );

      glass.addColorStop(0, "#a9e7f8");
      glass.addColorStop(0.3, "#31566c");
      glass.addColorStop(1, "#101e2b");

      ctx.fillStyle = glass;
      ctx.fill();
      ctx.strokeStyle = "#eefaff";
      ctx.lineWidth = Math.max(1, size * 0.012);
      ctx.stroke();

      // Gull-wing door outline and handle.
      ctx.beginPath();
      ctx.moveTo(-w * 0.12, -h * 0.105);
      ctx.lineTo(w * 0.19, -h * 0.105);
      ctx.lineTo(w * 0.255, h * 0.12);
      ctx.lineTo(-w * 0.12, h * 0.12);
      ctx.closePath();

      ctx.strokeStyle = "#f1fbff";
      ctx.lineWidth = Math.max(1, size * 0.01);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w * 0.13, -h * 0.09);
      ctx.lineTo(w * 0.205, h * 0.1);
      ctx.strokeStyle = "#657b86";
      ctx.stroke();

      ctx.fillStyle = "#263844";
      ctx.fillRect(w * 0.015, h * 0.035, w * 0.055, h * 0.012);

      // Front grille and square headlamps.
      ctx.fillStyle = "#202b34";
      ctx.fillRect(w * 0.405, h * 0.045, w * 0.075, h * 0.075);

      ctx.fillStyle = "#e8faff";
      ctx.fillRect(w * 0.414, h * 0.052, w * 0.025, h * 0.025);
      ctx.fillRect(w * 0.414, h * 0.085, w * 0.025, h * 0.025);
      ctx.fillRect(w * 0.45, h * 0.052, w * 0.02, h * 0.025);
      ctx.fillRect(w * 0.45, h * 0.085, w * 0.02, h * 0.025);

      ctx.fillStyle = "#131c24";
      ctx.fillRect(w * 0.285, h * 0.12, w * 0.115, h * 0.025);

      ctx.fillStyle = "#aab8bf";
      ctx.fillRect(w * 0.3, h * 0.126, w * 0.08, h * 0.007);

      // Exposed time-machine wiring and glowing flux coils.
      ctx.strokeStyle = "#50dfff";
      ctx.lineWidth = Math.max(1, size * 0.012);
      ctx.shadowColor = "#36cfff";
      ctx.shadowBlur = size * 0.08;

      for (let i = 0; i < 4; i++) {
        const coilX = -w * 0.17 + i * w * 0.055;

        ctx.beginPath();
        ctx.moveTo(coilX, h * 0.15);
        ctx.lineTo(coilX, h * 0.215);
        ctx.stroke();
      }

      // Electrical arcs beneath the car.
      ctx.beginPath();
      ctx.moveTo(-w * 0.34, h * 0.285);
      ctx.lineTo(-w * 0.19, h * 0.25);
      ctx.lineTo(-w * 0.07, h * 0.31);
      ctx.lineTo(w * 0.08, h * 0.26);
      ctx.lineTo(w * 0.21, h * 0.3);
      ctx.lineTo(w * 0.36, h * 0.265);
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Wheels and turbine-style alloy hubs.
      for (const wheelX of [-w * 0.31, w * 0.31]) {
        ctx.beginPath();
        ctx.ellipse(
          wheelX,
          h * 0.205,
          w * 0.085,
          h * 0.235,
          0,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = "#070b10";
        ctx.fill();
        ctx.strokeStyle = "#a8b6bd";
        ctx.lineWidth = Math.max(1.2, size * 0.018);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(wheelX, h * 0.205, w * 0.047, 0, Math.PI * 2);
        ctx.fillStyle = "#cbd5da";
        ctx.fill();
        ctx.strokeStyle = "#657984";
        ctx.lineWidth = Math.max(0.8, size * 0.008);
        ctx.stroke();

        for (let spoke = 0; spoke < 8; spoke++) {
          const angle = (spoke / 8) * Math.PI * 2;

          ctx.beginPath();
          ctx.moveTo(wheelX, h * 0.205);
          ctx.lineTo(
            wheelX + Math.cos(angle) * w * 0.037,
            h * 0.205 + Math.sin(angle) * w * 0.037
          );

          ctx.strokeStyle = "#657984";
          ctx.lineWidth = Math.max(0.6, size * 0.006);
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    const draw = () => {
      time += 0.006;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height);

      // Midnight background.
      const bg = ctx.createRadialGradient(
        cx, cy, 0,
        cx, cy, scale * 0.85
      );

      bg.addColorStop(0, "#172238");
      bg.addColorStop(0.45, "#080f20");
      bg.addColorStop(1, "#02040b");

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Central golden glow.
      const glow = ctx.createRadialGradient(
        cx, cy, 0,
        cx, cy, scale * 0.42
      );

      glow.addColorStop(0, "rgba(216,155,66,0.16)");
      glow.addColorStop(0.4, "rgba(72,100,155,0.08)");
      glow.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Spiral stars.
      for (const star of stars) {
        const radius =
          (star.radius + time * 35 * star.speed) %
          (scale * 0.85);

        const angle =
          star.angle + time * star.speed + radius * 0.002;

        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(angle) * radius,
          cy + Math.sin(angle) * radius * 0.72,
          star.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(255,211,139,${
          star.alpha * (1 - radius / (scale * 0.85))
        })`;

        ctx.fill();
      }

      // Rotating clockwork rings.
      ctx.save();
      ctx.translate(cx, cy);

      for (let i = 0; i < 13; i++) {
        const depth = (i + 1) / 13;
        const radius = scale * (0.035 + depth * 0.52);

        ctx.save();
        ctx.rotate(time * (i % 2 === 0 ? 1 : -0.65));

        ctx.beginPath();
        ctx.ellipse(
          0,
          0,
          radius,
          radius * (0.54 + depth * 0.22),
          0,
          0,
          Math.PI * 2
        );

        ctx.strokeStyle = `rgba(210,164,91,${
          0.08 + (1 - depth) * 0.28
        })`;

        ctx.lineWidth = depth < 0.25 ? 2 : 1;
        ctx.stroke();

        for (let j = 0; j < 60; j++) {
          const a = j * Math.PI / 30;
          const inner = radius - (j % 5 === 0 ? 10 : 4);
          const outer = radius + (j % 5 === 0 ? 3 : 1);

          ctx.beginPath();
          ctx.moveTo(
            Math.cos(a) * inner,
            Math.sin(a) * inner * 0.65
          );
          ctx.lineTo(
            Math.cos(a) * outer,
            Math.sin(a) * outer * 0.65
          );

          ctx.strokeStyle = j % 5 === 0
            ? "rgba(255,207,125,0.55)"
            : "rgba(205,175,120,0.22)";

          ctx.lineWidth = j % 5 === 0 ? 1.5 : 0.7;
          ctx.stroke();
        }

        ctx.restore();
      }

      // Central clock face.
      const r = scale * 0.135;

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(5,10,20,0.85)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,198,106,0.85)";
      ctx.lineWidth = 2;
      ctx.stroke();

      const numerals = [
        "XII", "I", "II", "III", "IV", "V",
        "VI", "VII", "VIII", "IX", "X", "XI",
      ];

      ctx.font = `bold ${Math.max(10, scale * 0.018)}px Georgia`;
      ctx.fillStyle = "#f1cb8c";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      numerals.forEach((n, i) => {
        const a = i * Math.PI / 6 - Math.PI / 2;

        ctx.fillText(
          n,
          Math.cos(a) * r * 0.73,
          Math.sin(a) * r * 0.73
        );
      });

      for (const [angle, length, color, lineWidth] of [
        [time * 0.4, r * 0.48, "#ffe0a0", 3],
        [-time * 1.3, r * 0.68, "#e4b66d", 2],
        [time * 3, r * 0.78, "#fff2d5", 1],
      ]) {
        ctx.save();
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -length);

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.stroke();

        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#fff0c9";
      ctx.fill();

      ctx.restore();

      // Golden spiral filaments.
      for (let strand = 0; strand < 5; strand++) {
        ctx.beginPath();

        for (let i = 0; i <= 220; i++) {
          const p = i / 220;

          const a =
            p * Math.PI * 5 +
            time * (strand % 2 ? -1 : 1) +
            strand * Math.PI * 2 / 5;

          const radius = scale * (0.025 + p * 0.48);
          const x = cx + Math.cos(a) * radius;
          const y = cy + Math.sin(a) * radius * 0.68;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = strand % 2 === 0
          ? "rgba(255,192,99,0.2)"
          : "rgba(107,153,222,0.18)";

        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Animate the 2D clocks.
      for (const clock of clocks) {
        clock.x += clock.vx;
        clock.y += clock.vy;
        clock.rotation += clock.spin;

        const margin = clock.size * 2;

        if (clock.x < -margin) clock.x = width + margin;
        if (clock.x > width + margin) clock.x = -margin;
        if (clock.y < -margin) clock.y = height + margin;
        if (clock.y > height + margin) clock.y = -margin;

        drawClock(clock);
      }

      // Occasionally introduce a TARDIS.
      if (!tardis) {
        tardisTimer++;

        // Approximately every 12–23 seconds at 60 FPS.
        if (tardisTimer > rand(720, 1380)) {
          tardis = createTardis();
          tardisTimer = 0;
        }
      } else {
        tardis.x += tardis.vx;
        tardis.y += tardis.vy;
        tardis.rotation += tardis.spin;

        // A faint blue trail.
        ctx.beginPath();
        ctx.moveTo(
          tardis.x - tardis.vx * 12,
          tardis.y - tardis.vy * 12
        );
        ctx.lineTo(tardis.x, tardis.y);

        ctx.strokeStyle = "rgba(65,155,255,0.3)";
        ctx.lineWidth = tardis.size * 0.18;
        ctx.shadowColor = "#238bff";
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.shadowBlur = 0;

        drawTardis(tardis);

        if (
          tardis.x < -tardis.size * 2 ||
          tardis.x > width + tardis.size * 2 ||
          tardis.y < -tardis.size * 2 ||
          tardis.y > height + tardis.size * 2
        ) {
          tardis = null;
        }
      }

      // Occasionally introduce the DeLorean.
      // Approximately every 30–50 seconds at 60 FPS.
      if (!delorean) {
        deloreanTimer++;

        if (deloreanTimer > deloreanNextSpawn) {
          delorean = createDelorean();
          deloreanTimer = 0;
          deloreanNextSpawn = rand(1800, 3000);
        }
      } else {
        delorean.x += delorean.vx;
        delorean.y += delorean.vy;
        delorean.rotation += delorean.spin;

        // Glowing time-travel trail.
        ctx.save();
        ctx.globalAlpha = delorean.alpha;

        const trail = ctx.createLinearGradient(
          delorean.x,
          delorean.y,
          delorean.x - delorean.vx * delorean.size * 0.7,
          delorean.y
        );

        trail.addColorStop(0, "rgba(120,240,255,0.7)");
        trail.addColorStop(0.4, "rgba(45,155,255,0.3)");
        trail.addColorStop(1, "rgba(45,155,255,0)");

        ctx.strokeStyle = trail;
        ctx.lineWidth = delorean.size * 0.22;
        ctx.shadowColor = "#36cfff";
        ctx.shadowBlur = 22;

        ctx.beginPath();
        ctx.moveTo(
          delorean.x,
          delorean.y + delorean.size * 0.12
        );
        ctx.lineTo(
          delorean.x - delorean.vx * delorean.size * 0.7,
          delorean.y + delorean.size * 0.12
        );
        ctx.stroke();

        // Electrical sparks.
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#a5f5ff";

        for (let i = 0; i < 3; i++) {
          const sparkX =
            delorean.x - delorean.vx * rand(3, 16);

          const sparkY =
            delorean.y +
            rand(-delorean.size * 0.3, delorean.size * 0.4);

          ctx.beginPath();
          ctx.arc(
            sparkX,
            sparkY,
            rand(0.8, 2.2),
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        ctx.restore();

        drawDelorean(delorean);

        if (
          delorean.x < -delorean.size * 3 ||
          delorean.x > width + delorean.size * 3
        ) {
          delorean = null;
        }
      }

      // Dark vignette.
      const vignette = ctx.createRadialGradient(
        cx,
        cy,
        scale * 0.18,
        cx,
        cy,
        scale * 0.8
      );

      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.5)");

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="time-vortex" />;
}