"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";

/* ═══════════════════════════════════════════════════════════════
   VEGA LABS — LANDING PAGE (LIGHT LIQUID GLASS)
   Aesthetic: Clean White, Apple Liquid Glass, Emerald Accents.
   Typography: Instrument Sans (display) + JetBrains Mono (mono).
   Motion: Soft ambient refractions, staggered reveals, scan line.
   ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  /* ── Scroll Tracking ────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Intersection Observer ──────────────────────────── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in-view");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Header />

      {/* Ambient Moving Background for Glass Refraction */}
      <div className="ambient-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="noise-overlay" />
      </div>

      <main className="page">
        {/* ━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="hero">
          <div className="wrap hero-inner">
            <span className="eyebrow stagger-1">
              <span className="dot" />
              Subsurface Intelligence
            </span>

            <h1 className="hero-h1 stagger-2">
              Agriculture.
              <br />
              <span className="em liquid-text">Beneath the surface.</span>
            </h1>

            <p className="hero-p stagger-3">
              Volumetric sensing networks that map soil structure, moisture
              dynamics, and root-zone health in real time. The invisible, made
              visible.
            </p>

            <div className="hero-actions stagger-4">
              <button
                className="btn-glass-dark"
                onClick={() => router.push("/clusters/new/step-1")}
              >
                Deploy a Cluster
              </button>
              <button className="btn-ghost">
                Read Whitepaper <span className="arr">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━ METRICS BENTO ━━━━━━━━━━━━━━━━━━━ */}
        <section className="section">
          <div className="wrap">
            <div className="bento">
              {/* Wide card */}
              <div className="glass-panel wide reveal">
                <div className="glass-content">
                  <h3 className="bento-h">Sub-millimeter Precision</h3>
                  <p className="bento-p">
                    Edge-compute nodes use low-frequency wave inversion to build
                    high-fidelity 3D structural models of your soil, layer by
                    layer.
                  </p>
                </div>
                <div className="scan-viz">
                  <div className="scan-grid" />
                  <div className="scan-line" />
                </div>
              </div>

              {/* Metric cards */}
              <div className="glass-panel reveal" style={{ transitionDelay: "0.1s" }}>
                <span className="metric-num">
                  10<span className="metric-unit">yr</span>
                </span>
                <h3 className="bento-h">Battery Life</h3>
                <p className="bento-p">
                  Ultra-low power architecture outlasts crop cycles.
                </p>
              </div>

              <div className="glass-panel reveal" style={{ transitionDelay: "0.2s" }}>
                <span className="metric-num">
                  0.1<span className="metric-unit">Hz</span>
                </span>
                <h3 className="bento-h">Live Telemetry</h3>
                <p className="bento-p">
                  Continuous real-time data streaming to your dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━ PHILOSOPHY ━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="section">
          <div className="wrap narrow center reveal">
            <h2 className="section-h">The ground is a living system.</h2>
            <p className="section-p-large">
              Soil is not passive matter. It is a layered mechanical,
              hydrological, and biological architecture. Most agricultural tools
              observe the canopy. We measure the foundation.
            </p>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━ SYSTEM STACK ━━━━━━━━━━━━━━━━━━━━ */}
        <section className="section">
          <div className="wrap stack-wrap">
            <StackRow
              idx="01"
              title="Density Mapping Engine"
              desc="Non-destructive voxel reconstruction detects compaction layers and subsurface structural discontinuities."
            />
            <StackRow
              idx="02"
              title="Moisture Gradient Intelligence"
              desc="Monitors capillary action, infiltration rates, and water movement across varied depth horizons."
            />
            <StackRow
              idx="03"
              title="Root-Zone Structural Modeling"
              desc="Analyzes mechanical constraints to understand how soil density limits active root expansion."
            />
          </div>
        </section>

        {/* ━━━━━━━━━━━━━ DEPLOYMENT ━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="section">
          <div className="wrap">
            <div className="glass-panel deploy-panel reveal">
              <div className="deploy-text">
                <h2 className="section-h">Infinite Scalability.</h2>
                <p className="section-p">
                  Distributed sensing nodes form a self-healing mesh network,
                  feeding volumetric inversion models across thousands of acres.
                </p>
                <button
                  className="btn-link"
                  onClick={() => router.push("/clusters/new/step-1")}
                >
                  Configure your network <span className="arr">→</span>
                </button>
              </div>

              <div className="deploy-graphic">
                <MeshGraphic />
              </div>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━ CLOSING ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="section closing reveal">
          <div className="wrap narrow center">
            <h2 className="closing-h">
              The ground is now
              <br />
              <span className="em liquid-text">an API.</span>
            </h2>
          </div>
        </section>
      </main>

      <Footer />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         STYLES
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <style jsx>{`
        /* ── Tokens ──────────────────────────── */
        :root {
          --bg-base: #ffffff;
          --text-main: #1d1d1f;
          --text-muted: #86868b;
          
          /* Liquid Glass Tokens */
          --glass-bg: rgba(255, 255, 255, 0.65);
          --glass-border: rgba(255, 255, 255, 1);
          --glass-shadow: 0 24px 48px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.02);
          --glass-highlight: inset 0 2px 4px rgba(255, 255, 255, 1), inset 0 -2px 10px rgba(255, 255, 255, 0.3);
          
          --accent: #10b981;
          --accent-glow: rgba(16, 185, 129, 0.4);
          --radius: 32px; /* Massively rounded */
          --font: "Instrument Sans", -apple-system, sans-serif;
          --mono: "JetBrains Mono", monospace;
        }

        /* ── Base & Background ───────────────── */
        .page {
          font-family: var(--font);
          -webkit-font-smoothing: antialiased;
          color: var(--text-main);
          position: relative;
          z-index: 1;
        }

        .ambient-bg {
          position: fixed;
          inset: 0;
          background: var(--bg-base);
          z-index: 0;
          overflow: hidden;
        }

        /* These orbs give the glass something to blur on a white background */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.35;
          animation: float 25s ease-in-out infinite alternate;
        }
        .orb-1 {
          top: 0%;
          right: -10%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%);
        }
        .orb-2 {
          bottom: -10%;
          left: -10%;
          width: 60vw;
          height: 60vw;
          background: radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%);
          animation-delay: -10s;
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-50px, 80px) scale(1.15); }
        }

        /* ── Layout ──────────────────────────── */
        .wrap { max-width: 1080px; margin: 0 auto; padding: 0 2rem; }
        .narrow { max-width: 680px; }
        .center { text-align: center; margin: 0 auto; }
        .section { padding: 8rem 0; position: relative; }

        /* ── Animations ──────────────────────── */
        .reveal {
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.in-view {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ── Liquid Glass Components ─────────── */
        .glass-panel {
          position: relative;
          background: var(--glass-bg);
          backdrop-filter: blur(40px) saturate(140%);
          -webkit-backdrop-filter: blur(40px) saturate(140%);
          border-radius: var(--radius);
          padding: 2.5rem;
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow), var(--glass-highlight);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s;
          overflow: hidden;
        }

        .glass-panel:hover {
          transform: translateY(-4px);
          box-shadow: 0 32px 64px rgba(0, 0, 0, 0.06), 0 8px 16px rgba(0, 0, 0, 0.03), var(--glass-highlight);
        }

        /* ── Hero ────────────────────────────── */
        .hero { min-height: 100vh; display: flex; align-items: center; padding-top: 5rem; }
        .hero-inner { position: relative; z-index: 2; max-width: 720px; }

        .stagger-1, .stagger-2, .stagger-3, .stagger-4 {
          opacity: 0;
          transform: translateY(20px);
          animation: rise 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }

        @keyframes rise { to { opacity: 1; transform: translateY(0); } }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--text-muted); margin-bottom: 2rem;
        }

        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 12px var(--accent-glow);
        }

        .hero-h1 {
          font-size: clamp(3.5rem, 7vw, 6rem); font-weight: 600;
          line-height: 1.05; letter-spacing: -0.04em; margin: 0 0 1.5rem;
        }
        
        .liquid-text {
           background: linear-gradient(135deg, #059669 0%, #0891b2 100%);
           -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .hero-p {
          font-size: 1.25rem; line-height: 1.6; color: var(--text-muted);
          max-width: 580px; margin: 0 0 3rem; font-weight: 400;
        }

        .hero-actions { display: flex; gap: 1rem; align-items: center; }

        /* ── Buttons ─────────────────────────── */
        .btn-glass-dark {
          display: inline-flex; padding: 1rem 2rem;
          background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.9); border-radius: 16px;
          color: #fff; font-size: 0.95rem; font-weight: 500;
          cursor: pointer; transition: all 0.3s ease;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.2);
        }
        .btn-glass-dark:hover {
          background: #000;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.3);
        }

        .btn-ghost {
          background: transparent; border: none; color: var(--text-main);
          font-size: 0.95rem; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; gap: 0.5rem;
          transition: opacity 0.3s;
        }
        .btn-ghost:hover { opacity: 0.6; }
        .btn-ghost:hover .arr { transform: translateX(4px); }
        .arr { transition: transform 0.3s; }

        .btn-link {
          background: none; border: none; color: var(--accent);
          font-size: 1rem; font-weight: 600; cursor: pointer;
          padding: 0; margin-top: 2rem; display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .btn-link:hover .arr { transform: translateX(4px); }

        /* ── Bento ───────────────────────────── */
        .bento {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
        }
        .glass-panel.wide {
          grid-column: span 2; display: flex; flex-direction: column; justify-content: space-between;
        }

        .bento-h { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.5rem; letter-spacing: -0.02em; }
        .bento-p { font-size: 1rem; color: var(--text-muted); line-height: 1.6; margin: 0; }

        .metric-num {
          font-size: 4rem; font-weight: 500; letter-spacing: -0.05em; line-height: 1;
          color: var(--text-main); display: block; margin-bottom: 1rem;
        }
        .metric-unit { font-size: 1.25rem; font-weight: 400; color: var(--text-muted); margin-left: 4px; }

        /* Scan viz - Optimized for light mode */
        .scan-viz {
          margin-top: 2rem; height: 120px; width: 100%; position: relative;
          border-radius: 16px; overflow: hidden; background: rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.04);
        }
        .scan-grid {
          position: absolute; inset: 0;
          background-image: 
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          transform: perspective(500px) rotateX(60deg) translateY(-30px) scale(2);
        }
        .scan-line {
          position: absolute; top: 0; left: 0; height: 100%; width: 2px;
          background: var(--accent);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.2);
          animation: scanX 4s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
        }
        @keyframes scanX { 0% { left: 0%; } 100% { left: 100%; } }

        /* ── Typography ──────────────────────── */
        .section-h { font-size: clamp(2.2rem, 4vw, 3.2rem); font-weight: 600; letter-spacing: -0.03em; margin: 0 0 1.5rem; }
        .section-p { font-size: 1.1rem; color: var(--text-muted); line-height: 1.6; margin: 0; }
        .section-p-large { font-size: 1.5rem; color: var(--text-main); line-height: 1.5; letter-spacing: -0.02em; font-weight: 400; margin: 0; }

        /* ── Stack ───────────────────────────── */
        .stack-wrap { max-width: 800px; }

        /* ── Deploy panel ────────────────────── */
        .deploy-panel {
          display: grid; grid-template-columns: 1.2fr 1fr; gap: 4rem; align-items: center; padding: 4rem;
        }
        .deploy-graphic { display: flex; align-items: center; justify-content: center; }

        /* ── Closing ─────────────────────────── */
        .closing { min-height: 40vh; display: flex; align-items: center; }
        .closing-h { font-size: clamp(3rem, 6vw, 5rem); font-weight: 600; line-height: 1.1; letter-spacing: -0.04em; margin: 0; }

        @media (max-width: 900px) {
          .bento { grid-template-columns: 1fr; }
          .glass-panel.wide { grid-column: span 1; }
          .deploy-panel { grid-template-columns: 1fr; padding: 2.5rem; gap: 2rem; }
        }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function StackRow({ idx, title, desc }: { idx: string; title: string; desc: string }) {
  return (
    <div className="stack-row glass-panel reveal">
      <div className="stack-idx">{idx}</div>
      <div className="stack-body">
        <h3 className="stack-title">{title}</h3>
        <p className="stack-desc">{desc}</p>
      </div>

      <style jsx>{`
        .stack-row {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 2rem;
          margin-bottom: 1.5rem;
          padding: 2.5rem;
          border-radius: 28px; /* Slightly less than the var(--radius) to fit nicely */
        }
        .stack-idx {
          font-family: var(--mono);
          font-size: 1rem;
          color: var(--text-muted);
          border-right: 1px solid rgba(0,0,0,0.06);
          padding-top: 4px;
        }
        .stack-title { font-size: 1.3rem; font-weight: 600; margin: 0 0 0.5rem; letter-spacing: -0.02em; color: var(--text-main); }
        .stack-desc { font-size: 1.05rem; color: var(--text-muted); line-height: 1.6; margin: 0; max-width: 600px; }
        
        @media (max-width: 600px) {
          .stack-row { grid-template-columns: 1fr; gap: 1rem; padding: 1.5rem; }
          .stack-idx { border-right: none; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 0.5rem; }
        }
      `}</style>
    </div>
  );
}

function MeshGraphic() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", maxWidth: 280 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hubGlowLight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Connection lines (Darkened for light mode) */}
      <g stroke="rgba(0,0,0,0.1)" strokeWidth="1.5">
        <line x1="100" y1="100" x2="100" y2="30" />
        <line x1="100" y1="100" x2="160" y2="60" />
        <line x1="100" y1="100" x2="160" y2="140" />
        <line x1="100" y1="100" x2="100" y2="170" />
        <line x1="100" y1="100" x2="40" y2="140" />
        <line x1="100" y1="100" x2="40" y2="60" />
        <polygon points="100,30 160,60 160,140 100,170 40,140 40,60" fill="rgba(0,0,0,0.02)" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
      </g>

      {/* Orbit rings */}
      <circle cx="100" cy="100" r="42" stroke="rgba(0,0,0,0.06)" strokeWidth="1" fill="none" />
      <circle cx="100" cy="100" r="78" stroke="rgba(0,0,0,0.04)" strokeWidth="1.5" strokeDasharray="4 8" fill="none">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="40s" repeatCount="indefinite" />
      </circle>

      {/* Hub */}
      <circle cx="100" cy="100" r="24" fill="url(#hubGlowLight)" />
      <circle cx="100" cy="100" r="6" fill="#10b981" />
      <circle cx="100" cy="100" r="16" fill="none" stroke="#10b981" strokeWidth="1.5">
        <animate attributeName="r" from="10" to="35" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Nodes */}
      <g fill="#1d1d1f">
        <circle cx="100" cy="30" r="4" />
        <circle cx="160" cy="60" r="4" />
        <circle cx="160" cy="140" r="4" />
        <circle cx="100" cy="170" r="4" />
        <circle cx="40" cy="140" r="4" />
        <circle cx="40" cy="60" r="4" />
      </g>
    </svg>
  );
}