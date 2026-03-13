"use client";

import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════════════════
   VEGA LABS — LANDING PAGE
   Aesthetic: Editorial minimalism. Ink + Stone + one emerald accent.
   Typography: Instrument Sans (display) + JetBrains Mono (mono details).
   Motion: Orchestrated staggered reveals on load, scroll-triggered
           sections, one signature animation (the scan line).
   ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  /* ── Scroll tracking ────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Intersection observer for reveal ───────────────── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in-view");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Header />

      <main className="page">
        {/* ━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="hero">
          {/* Ambient glow — only element with color */}
          <div
            className="hero-glow"
            style={{
              transform: `translate(-50%, calc(-50% + ${scrollY * 0.25}px))`,
              opacity: Math.max(0, 1 - scrollY / 700),
            }}
          />

          <div className="wrap hero-inner">
            <span className="eyebrow stagger-1">
              <span className="dot" />
              Subsurface Intelligence
            </span>

            <h1 className="hero-h1 stagger-2">
              Agriculture.
              <br />
              <span className="em">Beneath the surface.</span>
            </h1>

            <p className="hero-p stagger-3">
              Volumetric sensing networks that map soil structure, moisture
              dynamics, and root-zone health in real time. The invisible, made
              visible.
            </p>

            <div className="hero-actions stagger-4">
              <button
                className="btn-solid"
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
              <div className="bento-card wide reveal">
                <h3 className="bento-h">Sub-millimeter Precision</h3>
                <p className="bento-p">
                  Edge-compute nodes use low-frequency wave inversion to build
                  high-fidelity 3D structural models of your soil, layer by
                  layer.
                </p>
                <div className="scan-viz">
                  <div className="scan-line" />
                </div>
              </div>

              {/* Metric cards */}
              <div className="bento-card reveal">
                <span className="metric-num">
                  10<span className="metric-unit">yr</span>
                </span>
                <h3 className="bento-h">Battery Life</h3>
                <p className="bento-p">
                  Ultra-low power architecture outlasts crop cycles.
                </p>
              </div>

              <div className="bento-card reveal">
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
        <section className="section section-alt">
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
        <section className="section section-alt">
          <div className="wrap">
            <div className="deploy-panel reveal">
              <div className="deploy-text">
                <h2 className="section-h">Infinite Scalability.</h2>
                <p className="section-p">
                  Distributed sensing nodes form a self-healing mesh network,
                  feeding volumetric inversion models across thousands of
                  acres.
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
              <span className="em">an API.</span>
            </h2>
          </div>
          <div className="closing-glow" />
        </section>
      </main>

      <Footer />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         STYLES
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <style jsx>{`
        /* ── Tokens ──────────────────────────── */
        :root {
          --ink: #111110;
          --ink-80: rgba(17, 17, 16, 0.8);
          --ink-50: rgba(17, 17, 16, 0.5);
          --ink-30: rgba(17, 17, 16, 0.3);
          --ink-12: rgba(17, 17, 16, 0.12);
          --ink-06: rgba(17, 17, 16, 0.06);
          --ink-03: rgba(17, 17, 16, 0.03);
          --stone: #f5f5f3;
          --card: #ffffff;
          --accent: #10b981;
          --accent-soft: rgba(16, 185, 129, 0.08);
          --radius: 16px;
          --font: "Instrument Sans", -apple-system, BlinkMacSystemFont,
            sans-serif;
          --mono: var(--font-mono), "JetBrains Mono", monospace;
        }

        @import url("https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap");

        /* ── Resets ──────────────────────────── */
        .page {
          font-family: var(--font);
          -webkit-font-smoothing: antialiased;
          background: var(--stone);
          color: var(--ink);
          overflow-x: hidden;
        }

        .wrap {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .narrow {
          max-width: 680px;
        }
        .center {
          text-align: center;
          margin-left: auto;
          margin-right: auto;
        }

        .section {
          padding: 7rem 0;
          position: relative;
        }
        .section-alt {
          background: var(--card);
        }

        /* ── Reveal animation ────────────────── */
        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.9s cubic-bezier(0.25, 1, 0.5, 1),
            transform 0.9s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Hero ────────────────────────────── */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding-top: 5rem;
        }

        .hero-glow {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            var(--accent-soft) 0%,
            transparent 65%
          );
          filter: blur(80px);
          top: 50%;
          left: 50%;
          pointer-events: none;
          animation: breathe 10s ease-in-out infinite alternate;
        }

        @keyframes breathe {
          0% {
            transform: translate(-50%, -50%) scale(0.92);
          }
          100% {
            transform: translate(-50%, -50%) scale(1.08);
          }
        }

        .hero-inner {
          position: relative;
          z-index: 2;
          max-width: 720px;
        }

        /* Staggered load-in */
        .stagger-1,
        .stagger-2,
        .stagger-3,
        .stagger-4 {
          opacity: 0;
          transform: translateY(18px);
          animation: riseIn 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .stagger-1 {
          animation-delay: 0.15s;
        }
        .stagger-2 {
          animation-delay: 0.28s;
        }
        .stagger-3 {
          animation-delay: 0.4s;
        }
        .stagger-4 {
          animation-delay: 0.52s;
        }

        @keyframes riseIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.72rem;
          font-weight: 650;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-30);
          margin-bottom: 2rem;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
          animation: pulse 2.5s ease infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.25;
          }
        }

        .hero-h1 {
          font-size: clamp(3rem, 6.5vw, 5.5rem);
          font-weight: 700;
          line-height: 1.04;
          letter-spacing: -0.045em;
          margin: 0 0 1.5rem;
        }

        .em {
          background: linear-gradient(135deg, #059669 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-p {
          font-size: 1.15rem;
          line-height: 1.65;
          color: var(--ink-50);
          max-width: 540px;
          margin: 0 0 2.5rem;
        }

        .hero-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }

        /* ── Buttons ─────────────────────────── */
        .btn-solid {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.75rem 1.6rem;
          background: var(--ink);
          color: var(--stone);
          border: none;
          border-radius: 10px;
          font-family: var(--font);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
        }
        .btn-solid:hover {
          opacity: 0.82;
          transform: translateY(-1px);
        }
        .btn-solid:active {
          transform: scale(0.97);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.75rem 1.2rem;
          background: transparent;
          border: none;
          font-family: var(--font);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--ink);
          cursor: pointer;
          transition: color 0.2s;
        }
        .btn-ghost:hover {
          color: var(--ink-50);
        }
        .btn-ghost .arr {
          transition: transform 0.2s;
        }
        .btn-ghost:hover .arr {
          transform: translateX(3px);
        }

        .btn-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: none;
          border: none;
          font-family: var(--font);
          font-size: 1rem;
          font-weight: 600;
          color: var(--accent);
          cursor: pointer;
          padding: 0;
          margin-top: 2rem;
          transition: opacity 0.2s;
        }
        .btn-link:hover {
          opacity: 0.7;
        }
        .btn-link .arr {
          transition: transform 0.2s;
        }
        .btn-link:hover .arr {
          transform: translateX(3px);
        }

        /* ── Bento ───────────────────────────── */
        .bento {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        .bento-card {
          background: var(--card);
          border: 1px solid var(--ink-06);
          border-radius: var(--radius);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .bento-card:hover {
          border-color: var(--ink-12);
          box-shadow: 0 8px 30px -8px rgba(17, 17, 16, 0.07);
        }
        .bento-card.wide {
          grid-column: span 2;
          justify-content: space-between;
        }

        .bento-h {
          font-size: 1.1rem;
          font-weight: 650;
          margin: 0 0 0.35rem;
          letter-spacing: -0.015em;
        }
        .bento-p {
          font-size: 0.92rem;
          color: var(--ink-50);
          line-height: 1.55;
          margin: 0;
        }

        .metric-num {
          font-size: 3rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1;
          color: var(--accent);
          display: block;
          margin-bottom: 0.75rem;
        }
        .metric-unit {
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--ink-30);
          margin-left: 2px;
        }

        /* Scan viz */
        .scan-viz {
          margin-top: 1.75rem;
          height: 80px;
          width: 100%;
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          background-image: radial-gradient(
            var(--ink-06) 1px,
            transparent 1px
          );
          background-size: 16px 16px;
        }
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 2px;
          background: var(--accent);
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.45),
            8px 0 30px rgba(16, 185, 129, 0.08);
          animation: scanX 5s ease-in-out infinite alternate;
        }
        @keyframes scanX {
          0% {
            left: 0%;
          }
          100% {
            left: 100%;
          }
        }

        @media (max-width: 768px) {
          .bento {
            grid-template-columns: 1fr;
          }
          .bento-card.wide {
            grid-column: span 1;
          }
        }

        /* ── Section typography ──────────────── */
        .section-h {
          font-size: clamp(1.75rem, 3.5vw, 2.75rem);
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 1.12;
          margin: 0 0 1.25rem;
        }
        .section-p {
          font-size: 1.05rem;
          color: var(--ink-50);
          line-height: 1.65;
          margin: 0;
        }
        .section-p-large {
          font-size: 1.35rem;
          color: var(--ink-80);
          line-height: 1.5;
          letter-spacing: -0.01em;
          margin: 0;
        }

        /* ── Stack ───────────────────────────── */
        .stack-wrap {
          max-width: 800px;
        }

        /* ── Deploy panel ────────────────────── */
        .deploy-panel {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 3rem;
          align-items: center;
          background: var(--ink);
          color: var(--stone);
          border-radius: 20px;
          padding: 4rem;
          overflow: hidden;
        }
        .deploy-panel .section-h {
          color: var(--stone);
        }
        .deploy-panel .section-p {
          color: rgba(245, 245, 243, 0.55);
        }
        .deploy-panel .btn-link {
          color: #34d399;
        }
        .deploy-graphic {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 900px) {
          .deploy-panel {
            grid-template-columns: 1fr;
            padding: 3rem 2rem;
          }
        }

        /* ── Closing ─────────────────────────── */
        .closing {
          min-height: 45vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .closing-h {
          font-size: clamp(2.5rem, 5.5vw, 4.5rem);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: -0.045em;
          margin: 0;
        }
        .closing-glow {
          position: absolute;
          bottom: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 260px;
          background: radial-gradient(
            circle,
            rgba(16, 185, 129, 0.1) 0%,
            transparent 70%
          );
          filter: blur(50px);
          pointer-events: none;
        }

        /* ── Responsive ──────────────────────── */
        @media (max-width: 640px) {
          .hero {
            padding-top: 4rem;
          }
          .hero-h1 {
            font-size: 2.6rem;
          }
          .section {
            padding: 4.5rem 0;
          }
          .deploy-panel {
            padding: 2.5rem 1.5rem;
          }
        }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* ── Stack Row ─────────────────────────────────────────────── */
function StackRow({
  idx,
  title,
  desc,
}: {
  idx: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="stack-row reveal">
      <span className="stack-idx">{idx}</span>
      <div className="stack-body">
        <h3 className="stack-title">{title}</h3>
        <p className="stack-desc">{desc}</p>
      </div>

      <style jsx>{`
        .stack-row {
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 1.75rem;
          padding: 2.5rem 0;
          border-bottom: 1px solid var(--ink-06);
        }
        .stack-row:last-child {
          border-bottom: none;
        }
        .stack-idx {
          font-family: var(--mono);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--ink-12);
          padding-top: 0.15rem;
          letter-spacing: -0.02em;
        }
        .stack-title {
          font-size: 1.25rem;
          font-weight: 650;
          letter-spacing: -0.02em;
          margin: 0 0 0.4rem;
        }
        .stack-desc {
          font-size: 1rem;
          color: var(--ink-50);
          line-height: 1.6;
          margin: 0;
          max-width: 560px;
        }
        @media (max-width: 600px) {
          .stack-row {
            grid-template-columns: 1fr;
            gap: 0.6rem;
            padding: 2rem 0;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Mesh Graphic (SVG) ───────────────────────────────────── */
function MeshGraphic() {
  return (
    <svg
      viewBox="0 0 200 200"
      style={{ width: "100%", maxWidth: 240 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Connection lines */}
      <g stroke="rgba(245,245,243,0.12)" strokeWidth="0.6">
        <line x1="100" y1="100" x2="100" y2="30" />
        <line x1="100" y1="100" x2="160" y2="60" />
        <line x1="100" y1="100" x2="160" y2="140" />
        <line x1="100" y1="100" x2="100" y2="170" />
        <line x1="100" y1="100" x2="40" y2="140" />
        <line x1="100" y1="100" x2="40" y2="60" />
        {/* Cross links */}
        <line x1="100" y1="30" x2="160" y2="60" />
        <line x1="160" y1="60" x2="160" y2="140" />
        <line x1="160" y1="140" x2="100" y2="170" />
        <line x1="100" y1="170" x2="40" y2="140" />
        <line x1="40" y1="140" x2="40" y2="60" />
        <line x1="40" y1="60" x2="100" y2="30" />
      </g>

      {/* Orbit rings */}
      <circle
        cx="100"
        cy="100"
        r="42"
        stroke="rgba(245,245,243,0.06)"
        strokeWidth="0.5"
        fill="none"
      />
      <circle
        cx="100"
        cy="100"
        r="78"
        stroke="rgba(245,245,243,0.04)"
        strokeWidth="0.5"
        strokeDasharray="2 5"
        fill="none"
      />

      {/* Hub */}
      <circle cx="100" cy="100" r="5" fill="#34d399" />
      <circle cx="100" cy="100" r="14" fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth="0.5">
        <animate
          attributeName="r"
          from="10"
          to="28"
          dur="3s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          from="0.6"
          to="0"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Nodes */}
      <g fill="#34d399">
        <circle cx="100" cy="30" r="3" />
        <circle cx="160" cy="60" r="3" />
        <circle cx="160" cy="140" r="3" />
        <circle cx="100" cy="170" r="3" />
        <circle cx="40" cy="140" r="3" />
        <circle cx="40" cy="60" r="3" />
      </g>

      {/* Tiny data labels */}
      <g
        fill="rgba(245,245,243,0.3)"
        fontSize="6"
        fontFamily="monospace"
        textAnchor="middle"
      >
        <text x="100" y="22">N-01</text>
        <text x="174" y="58">N-02</text>
        <text x="174" y="148">N-03</text>
        <text x="100" y="184">N-04</text>
        <text x="26" y="148">N-05</text>
        <text x="26" y="58">N-06</text>
      </g>
    </svg>
  );
}