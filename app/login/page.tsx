'use client';

import { useEffect, useRef } from 'react';
import Header from '../components/Header';
import {
    RegisterLink,
    LoginLink
} from "@kinde-oss/kinde-auth-nextjs/components";

export default function LoginPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    /* ── 3D rotating particle field ── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        let W = canvas.width = canvas.offsetWidth;
        let H = canvas.height = canvas.offsetHeight;

        const onResize = () => {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', onResize);

        /* 3D points */
        const pts: { x: number; y: number; z: number; vx: number; vy: number; vz: number }[] = [];
        for (let i = 0; i < 80; i++) {
            pts.push({
                x: (Math.random() - .5) * 600,
                y: (Math.random() - .5) * 600,
                z: (Math.random() - .5) * 600,
                vx: (Math.random() - .5) * .4,
                vy: (Math.random() - .5) * .4,
                vz: (Math.random() - .5) * .4,
            });
        }

        let angle = 0;
        let raf: number;

        const project = (x: number, y: number, z: number) => {
            const fov = 500;
            const cosA = Math.cos(angle), sinA = Math.sin(angle);
            const rx = x * cosA - z * sinA;
            const rz = x * sinA + z * cosA;
            const scale = fov / (fov + rz + 300);
            return { sx: W / 2 + rx * scale, sy: H / 2 + y * scale, scale };
        };

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            angle += 0.003;

            const projected = pts.map(p => {
                p.x += p.vx; p.y += p.vy; p.z += p.vz;
                if (Math.abs(p.x) > 300) p.vx *= -1;
                if (Math.abs(p.y) > 300) p.vy *= -1;
                if (Math.abs(p.z) > 300) p.vz *= -1;
                return { ...project(p.x, p.y, p.z) };
            });

            /* draw connections */
            for (let i = 0; i < projected.length; i++) {
                for (let j = i + 1; j < projected.length; j++) {
                    const dx = projected[i].sx - projected[j].sx;
                    const dy = projected[i].sy - projected[j].sy;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const alpha = (1 - dist / 100) * 0.18 * Math.min(projected[i].scale, projected[j].scale) * 3;
                        ctx.beginPath();
                        ctx.moveTo(projected[i].sx, projected[i].sy);
                        ctx.lineTo(projected[j].sx, projected[j].sy);
                        ctx.strokeStyle = `rgba(16,185,129,${alpha})`;
                        ctx.lineWidth = .6;
                        ctx.stroke();
                    }
                }
            }

            /* draw dots */
            projected.forEach(p => {
                const r = Math.max(1, p.scale * 2.5);
                const alpha = Math.min(1, p.scale * 1.5);
                ctx.beginPath();
                ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(52,211,153,${alpha * 0.7})`;
                ctx.fill();
            });

            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(raf); };
    }, []);

    /* ── card 3D tilt on mouse ── */
    useEffect(() => {
        const card = document.querySelector<HTMLElement>('.auth-container');
        if (!card) return;
        const onMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / rect.width;
            const dy = (e.clientY - cy) / rect.height;
            card.style.transform = `perspective(1200px) rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg) scale(1.01)`;
        };
        const onLeave = () => {
            card.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1)';
        };
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
        return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave); };
    }, []);

    return (
        <>
            <Header />

            <main className="auth-page">
                {/* page ambient */}
                <div className="page-glow-a" />
                <div className="page-glow-b" />

                <div className="auth-container">

                    {/* ── LEFT PANEL ── */}
                    <div className="auth-left">
                        <canvas ref={canvasRef} className="left-canvas" />
                        <div className="left-inner">
                            <span className="system-label fade-in d1">
                                Node Network · Secure Uplink
                            </span>
                            <h1 className="left-h1 fade-in d2">
                                Subsurface <br />Telemetry.
                            </h1>
                            <p className="left-p fade-in d3">
                                Access the volumetric inversion dashboard. Monitor soil
                                structure, density shifts, and moisture gradients across
                                your active clusters in real time.
                            </p>
                            <div className="left-meta fade-in d4">
                                Vega Labs · Core Architecture
                            </div>
                        </div>
                        {/* 3D floating orb */}
                        <div className="orb" />
                        <div className="orb orb-2" />
                    </div>

                    {/* ── RIGHT PANEL ── */}
                    <div className="auth-right">
                        <div className="form-box fade-in d2">
                            <div className="form-header">
                                <div className="form-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="form-title">Platform Access</h2>
                                    <p className="form-sub">Authenticate to interface with your cluster.</p>
                                </div>
                            </div>

                            <div className="btn-stack">
                                {/* Sign In */}
                                <LoginLink className="btn-primary">
                                    <span className="btn-label">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                            <polyline points="10 17 15 12 10 7" />
                                            <line x1="15" y1="12" x2="3" y2="12" />
                                        </svg>
                                        Sign In
                                    </span>
                                    <span className="btn-shine" />
                                </LoginLink>

                                {/* Synergy SSO */}
                                <LoginLink
                                    authUrlParams={{ connection_id: "synergy-account" }}
                                    className="btn-secondary"
                                >
                                    <span className="btn-label">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                                            <polyline points="2 17 12 22 22 17" />
                                            <polyline points="2 12 12 17 22 12" />
                                        </svg>
                                        Continue with Synergy
                                    </span>
                                </LoginLink>

                                <div className="divider">
                                    <span className="divider-line" />
                                    <span className="divider-text">or</span>
                                    <span className="divider-line" />
                                </div>

                                {/* Register */}
                                <RegisterLink className="btn-ghost">
                                    Provision New Account
                                </RegisterLink>
                            </div>

                            <p className="form-foot">
                                Secure authentication via Kinde Identity Platform
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

                :root {
                    --bg:   #080807; --s1: #0f0f0e; --s2: #141413; --s3: #1a1a18; --s4: #212120;
                    --b0:   rgba(255,255,255,.05); --b1: rgba(255,255,255,.09); --b2: rgba(255,255,255,.16);
                    --t0:   #f0f0ec; --t1: rgba(240,240,236,.58); --t2: rgba(240,240,236,.3); --t3: rgba(240,240,236,.15);
                    --g0:   #10b981; --g1: #34d399; --g2: #6ee7b7;
                    --ga:   rgba(16,185,129,.08); --gb: rgba(16,185,129,.16);
                    --font: 'Instrument Sans', -apple-system, sans-serif;
                    --mono: 'JetBrains Mono', monospace;
                }

                *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
                html, body { background: var(--bg) !important; color: var(--t0); font-family: var(--font); -webkit-font-smoothing: antialiased; }

                /* ── PAGE ── */
                .auth-page {
                    min-height: 100vh;
                    display: flex; align-items: center; justify-content: center;
                    padding: 6rem 2rem 3rem;
                    background: var(--bg);
                    position: relative; overflow: hidden;
                }

                /* ambient glows */
                .page-glow-a {
                    position: fixed; width: 700px; height: 700px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(16,185,129,.08) 0%, transparent 65%);
                    filter: blur(100px); top: 10%; left: 20%;
                    transform: translate(-50%, -50%); pointer-events: none;
                    animation: floatA 14s ease-in-out infinite alternate;
                }
                .page-glow-b {
                    position: fixed; width: 500px; height: 500px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(16,185,129,.05) 0%, transparent 65%);
                    filter: blur(80px); top: 80%; left: 75%;
                    pointer-events: none;
                    animation: floatB 10s ease-in-out infinite alternate;
                }
                @keyframes floatA { 0%{transform:translate(-50%,-50%) scale(.88);opacity:.6} 100%{transform:translate(-50%,-50%) scale(1.12);opacity:1} }
                @keyframes floatB { 0%{transform:scale(.9) translate(0,0);opacity:.5} 100%{transform:scale(1.15) translate(-20px,15px);opacity:.8} }

                /* ── CONTAINER ── */
                .auth-container {
                    position: relative; z-index: 10;
                    width: 100%; max-width: 1040px;
                    display: grid; grid-template-columns: 1.1fr .9fr;
                    border: 1px solid var(--b1);
                    border-radius: 24px; overflow: hidden;
                    box-shadow: 0 60px 120px -30px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.04), inset 0 1px 0 rgba(255,255,255,.07);
                    transition: transform .25s cubic-bezier(.25,1,.5,1), box-shadow .25s;
                    transform-style: preserve-3d;
                    opacity: 0;
                    animation: cardIn .9s cubic-bezier(.25,1,.5,1) .1s forwards;
                }
                @keyframes cardIn {
                    from { opacity: 0; transform: perspective(1200px) translateY(40px) scale(.97); }
                    to   { opacity: 1; transform: perspective(1200px) translateY(0) scale(1); }
                }
                .auth-container:hover {
                    box-shadow: 0 80px 140px -30px rgba(0,0,0,.8), 0 0 60px -20px rgba(16,185,129,.1), 0 0 0 1px rgba(255,255,255,.06);
                }

                /* ── LEFT PANEL ── */
                .auth-left {
                    background: #0a1a12;
                    padding: 4rem 3.5rem;
                    position: relative; overflow: hidden;
                    display: flex; align-items: center;
                    min-height: 580px;
                }
                .left-canvas {
                    position: absolute; inset: 0;
                    width: 100%; height: 100%;
                    pointer-events: none;
                }
                /* big breathing orb */
                .orb {
                    position: absolute; width: 500px; height: 500px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(16,185,129,.18) 0%, transparent 65%);
                    filter: blur(80px);
                    top: 50%; left: 50%; transform: translate(-50%, -50%);
                    pointer-events: none;
                    animation: orbBreathe 8s ease-in-out infinite alternate;
                }
                .orb-2 {
                    width: 300px; height: 300px;
                    background: radial-gradient(circle, rgba(52,211,153,.1) 0%, transparent 65%);
                    top: 20%; left: 10%; transform: none;
                    animation: orbBreathe 6s ease-in-out infinite alternate-reverse;
                }
                @keyframes orbBreathe {
                    0%  { transform: translate(-50%,-50%) scale(.85); opacity:.7; }
                    100%{ transform: translate(-50%,-50%) scale(1.15); opacity:1; }
                }
                .left-inner { position: relative; z-index: 2; max-width: 380px; }

                /* stagger */
                .fade-in { opacity: 0; transform: translateY(20px); animation: fi .8s cubic-bezier(.25,1,.5,1) forwards; }
                .d1{animation-delay:.25s} .d2{animation-delay:.38s} .d3{animation-delay:.5s} .d4{animation-delay:.62s}
                @keyframes fi { to { opacity: 1; transform: translateY(0); } }

                .system-label {
                    font-family: var(--mono); font-size: .7rem; font-weight: 500;
                    letter-spacing: .14em; text-transform: uppercase; color: var(--g0);
                    display: block; margin-bottom: 1.75rem;
                }
                .left-h1 {
                    font-size: clamp(2.4rem, 4vw, 3.4rem); font-weight: 700;
                    letter-spacing: -.045em; line-height: 1.08;
                    color: #ffffff; margin-bottom: 1.5rem;
                }
                .left-p {
                    font-size: 1rem; line-height: 1.68;
                    color: rgba(255,255,255,.5); font-weight: 400;
                }
                .left-meta {
                    margin-top: 3.5rem; font-family: var(--mono);
                    font-size: .68rem; font-weight: 500; letter-spacing: .1em;
                    text-transform: uppercase; color: rgba(255,255,255,.2);
                }

                /* ── RIGHT PANEL ── */
                .auth-right {
                    background: var(--s2);
                    padding: 4rem 3.5rem;
                    display: flex; align-items: center; justify-content: center;
                    border-left: 1px solid var(--b1);
                }
                .form-box { width: 100%; max-width: 340px; }

                .form-header {
                    display: flex; align-items: flex-start; gap: 1rem;
                    margin-bottom: 2.5rem;
                }
                .form-icon {
                    width: 40px; height: 40px; border-radius: 10px;
                    background: var(--ga); border: 1px solid rgba(16,185,129,.2);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--g0); flex-shrink: 0; margin-top: .2rem;
                }
                .form-title {
                    font-size: 1.6rem; font-weight: 700; letter-spacing: -.04em;
                    color: var(--t0); margin-bottom: .35rem;
                }
                .form-sub { font-size: .88rem; color: var(--t2); line-height: 1.5; }

                /* ── BUTTONS ── */
                .btn-stack { display: flex; flex-direction: column; gap: .85rem; }

                .btn-primary {
                    display: flex; align-items: center; justify-content: center;
                    padding: .9rem 1.5rem;
                    background: var(--g0); color: #fff;
                    border: none; border-radius: 11px;
                    font-family: var(--font); font-size: .92rem; font-weight: 600;
                    cursor: pointer; text-decoration: none;
                    position: relative; overflow: hidden;
                    transition: opacity .2s, transform .2s, box-shadow .2s;
                    letter-spacing: -.01em;
                }
                .btn-primary:hover {
                    opacity: .9; transform: translateY(-2px);
                    box-shadow: 0 12px 30px -8px rgba(16,185,129,.45);
                }
                .btn-primary:active { transform: scale(.97); }
                /* shine sweep */
                .btn-shine {
                    position: absolute; top: 0; left: -75%;
                    width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
                    transform: skewX(-20deg);
                    animation: shine 3.5s ease-in-out infinite;
                }
                @keyframes shine {
                    0%,70%  { left: -75%; }
                    100% { left: 130%; }
                }

                .btn-secondary {
                    display: flex; align-items: center; justify-content: center;
                    padding: .9rem 1.5rem;
                    background: var(--s3); color: var(--t0);
                    border: 1px solid var(--b2); border-radius: 11px;
                    font-family: var(--font); font-size: .92rem; font-weight: 500;
                    cursor: pointer; text-decoration: none;
                    transition: background .2s, border-color .2s, transform .2s;
                    letter-spacing: -.01em;
                }
                .btn-secondary:hover {
                    background: var(--s4); border-color: rgba(16,185,129,.3);
                    transform: translateY(-1px);
                }

                .btn-ghost {
                    display: flex; align-items: center; justify-content: center;
                    padding: .9rem 1.5rem;
                    background: transparent; color: var(--t1);
                    border: 1px solid var(--b1); border-radius: 11px;
                    font-family: var(--font); font-size: .92rem; font-weight: 500;
                    cursor: pointer; text-decoration: none;
                    transition: color .2s, border-color .2s, background .2s;
                    letter-spacing: -.01em;
                }
                .btn-ghost:hover {
                    color: var(--t0); border-color: var(--b2);
                    background: var(--s3);
                }

                .btn-label {
                    display: inline-flex; align-items: center; gap: .5rem;
                    position: relative; z-index: 1;
                }

                /* DIVIDER */
                .divider {
                    display: flex; align-items: center; gap: .75rem;
                    margin: .25rem 0;
                }
                .divider-line { flex: 1; height: 1px; background: var(--b1); }
                .divider-text { font-size: .78rem; color: var(--t3); font-weight: 500; }

                /* FOOTER */
                .form-foot {
                    margin-top: 1.75rem; text-align: center;
                    font-family: var(--mono); font-size: .62rem;
                    color: var(--t3); letter-spacing: .04em;
                }

                /* RESPONSIVE */
                @media (max-width: 840px) {
                    .auth-container { grid-template-columns: 1fr; max-width: 460px; }
                    .auth-left { display: none; }
                    .auth-right { padding: 3rem 2rem; border-left: none; }
                }
            `}</style>
        </>
    );
}