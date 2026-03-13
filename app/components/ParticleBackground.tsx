"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

const ParticleBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const DPR = window.devicePixelRatio || 1;
        canvas.width = width * DPR;
        canvas.height = height * DPR;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.scale(DPR, DPR);

        let time = 0;

        const layers = 8;
        const amplitude = 40;
        const speed = 0.00003;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // ---- BACKGROUND GRADIENT ----
            const gradient = ctx.createLinearGradient(0, 0, 0, height);

            if (theme === "dark") {
                gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
                gradient.addColorStop(1, "rgba(255, 255, 255, 1)");
            } else {
                gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
                gradient.addColorStop(1, "rgba(255, 255, 255, 1)");
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // ---- LAYERED DEPTH CONTOURS ----
            for (let l = 0; l < layers; l++) {
                const depth = l / layers;
                const baseY = height * (0.35 + depth * 0.5);

                ctx.beginPath();

                for (let x = 0; x <= width; x += 8) {
                    const wave =
                        Math.sin(x * 0.01 + time * (1 + depth)) *
                        amplitude *
                        (1 - depth);

                    const y = baseY + wave;

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }

                ctx.strokeStyle =
                    theme === "dark"
                        ? `rgba(255,255,255,${0.12 - depth * 0.08})`
                        : `rgba(0,0,0,${0.15 - depth * 0.1})`;

                ctx.lineWidth = 1.2;
                ctx.stroke();
            }

            time += speed * width;
            requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;

            canvas.width = width * DPR;
            canvas.height = height * DPR;
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            ctx.scale(DPR, DPR);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: -1,
                pointerEvents: "none",
                opacity: 1
            }}
        />
    );
};

export default ParticleBackground;
