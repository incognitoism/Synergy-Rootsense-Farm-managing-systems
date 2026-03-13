"use client";

import { useEffect, useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLElement>(null);

  // Scroll Reveal & Parallax Logic
  useEffect(() => {
    // Parallax soft-glow effect
    const glow = document.querySelector(".hero-ambient-glow") as HTMLElement | null;
    const onScroll = () => {
      const y = window.scrollY;
      if (glow) {
        glow.style.transform = `translateY(${y * 0.4}px) scale(${1 + y * 0.001})`;
        glow.style.opacity = `${Math.max(0, 0.8 - y / 600)}`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Intersection Observer for Apple-style smooth reveal animations
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Header />

      <main className="main-container">
        {/* --- HERO SECTION --- */}
        <section ref={heroRef} className="hero-section">
          {/* Subtle Apple-like ambient breathing glow */}
          <div className="hero-ambient-glow"></div>

          <div className="container relative z-10">
            <div className="hero-content">
              <div className="eyebrow fade-in-up delay-1">
                <span className="live-dot"></span> Subsurface Intelligence
              </div>

              <h1 className="hero-title fade-in-up delay-2">
                Agriculture. <br />
                <span className="text-gradient">Beneath the surface.</span>
              </h1>

              <p className="hero-subtitle fade-in-up delay-3">
                Precision farming requires more than surface-level data. We engineer
                volumetric sensing networks that map soil structure, moisture dynamics,
                and root-zone health in real time. The invisible, made visible.
              </p>

              <div className="hero-actions fade-in-up delay-4">
                <button
                  onClick={() => router.push('/clusters/new/step-1')}
                  className="btn-primary"
                >
                  Deploy a Cluster
                </button>
                <button className="btn-secondary">
                  Read Whitepaper <span className="arrow">→</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- HARDWARE & METRICS (New Section) --- */}
        <section className="section metrics-section">
          <div className="container">
            <div className="bento-grid">
              <div className="bento-card reveal-on-scroll col-span-2">
                <h3 className="bento-title">Sub-millimeter Precision</h3>
                <p className="bento-text">
                  Our edge-compute nodes utilize low-frequency wave inversion to build
                  high-fidelity, 3D structural models of your soil, layer by layer.
                </p>
                <div className="viz-clean-grid">
                  <div className="scanning-laser"></div>
                </div>
              </div>

              <div className="bento-card reveal-on-scroll">
                <div className="metric-value">10<span className="unit">yr</span></div>
                <h3 className="bento-title">Battery Life</h3>
                <p className="bento-text">Ultra-low power architecture designed to outlast crop cycles.</p>
              </div>

              <div className="bento-card reveal-on-scroll">
                <div className="metric-value">0.1<span className="unit">Hz</span></div>
                <h3 className="bento-title">Live Telemetry</h3>
                <p className="bento-text">Continuous, real-time data streaming directly to your dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- PHILOSOPHY SECTION --- */}
        <section className="section philosophy-section">
          <div className="container">
            <div className="content-narrow reveal-on-scroll">
              <h2 className="section-heading">The ground is a living system.</h2>
              <p className="section-text large">
                Soil is not passive matter. It is a layered mechanical, hydrological,
                and biological architecture. Most agricultural tools observe only the canopy.
                We measure the foundation.
              </p>
            </div>
          </div>
        </section>

        {/* --- SYSTEM STACK --- */}
        <section className="section stack-section">
          <div className="container">
            <div className="stack-container">
              <SystemBlock
                index="01"
                title="Density Mapping Engine"
                description="Detect compaction layers and subsurface structural discontinuities using non-destructive voxel reconstruction."
              />
              <SystemBlock
                index="02"
                title="Moisture Gradient Intelligence"
                description="Monitor capillary action, infiltration rates, and precise water movement across varied depth horizons."
              />
              <SystemBlock
                index="03"
                title="Root-Zone Structural Modeling"
                description="Analyze mechanical constraints to understand exactly how soil density impacts and limits active root expansion."
              />
            </div>
          </div>
        </section>

        {/* --- FIELD DEPLOYMENT --- */}
        <section className="section deployment-section">
          <div className="container">
            <div className="glass-panel reveal-on-scroll">
              <div className="deployment-content">
                <h2 className="section-heading">Infinite Scalability.</h2>
                <p className="section-text">
                  Distributed sensing nodes form a self-healing mesh network,
                  feeding volumetric inversion models to produce statistically stable
                  reconstructions across thousands of acres.
                </p>
                <button
                  onClick={() => router.push('/clusters/new/step-1')}
                  className="btn-text mt-4"
                >
                  Configure your network <span className="arrow">→</span>
                </button>
              </div>
              <div className="deployment-graphics">
                <svg viewBox="0 0 200 200" className="node-mesh-clean">
                  {/* Central Hub */}
                  <circle cx="100" cy="100" r="4" fill="#10b981" />
                  <circle cx="100" cy="100" r="16" fill="rgba(16, 185, 129, 0.1)" className="pulse-ring" />
                  <circle cx="100" cy="100" r="45" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="0.5" fill="none" />
                  <circle cx="100" cy="100" r="85" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="0.5" strokeDasharray="2 4" fill="none" />

                  {/* Connected Nodes */}
                  <g stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.5">
                    <line x1="100" y1="100" x2="100" y2="30" />
                    <line x1="100" y1="100" x2="160" y2="65" />
                    <line x1="100" y1="100" x2="160" y2="135" />
                    <line x1="100" y1="100" x2="40" y2="135" />
                    <line x1="100" y1="100" x2="40" y2="65" />
                  </g>

                  <g fill="#059669">
                    <circle cx="100" cy="30" r="2.5" />
                    <circle cx="160" cy="65" r="2.5" />
                    <circle cx="160" cy="135" r="2.5" />
                    <circle cx="40" cy="135" r="2.5" />
                    <circle cx="40" cy="65" r="2.5" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* --- CLOSING --- */}
        <section className="section closing-section reveal-on-scroll">
          <div className="container text-center relative z-10">
            <h2 className="closing-statement">
              The ground is now <br />
              <span className="text-gradient font-medium">an API.</span>
            </h2>
          </div>
          <div className="closing-glow"></div>
        </section>

      </main>

      <Footer />

      {/* --- GLOBAL STYLES --- */}
      <style jsx>{`
        /* Core Layout & Apple-like Theme */
        .main-container {
          background-color: #fbfbfd; /* Apple off-white */
          color: #1d1d1f;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .container {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .section {
          padding: 8rem 0;
          position: relative;
        }

        /* Typography & Colors */
        .text-gradient {
          background: linear-gradient(135deg, #059669 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-heading {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          margin-bottom: 1.5rem;
          color: #1d1d1f;
          line-height: 1.1;
        }

        .section-text {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #86868b;
        }
        
        .section-text.large {
          font-size: 1.5rem;
          font-weight: 400;
          color: #1d1d1f;
          line-height: 1.4;
          letter-spacing: -0.01em;
        }

        .content-narrow {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }

        /* --- Scroll Reveal Animations --- */
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s cubic-bezier(0.25, 1, 0.5, 1), transform 1s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .reveal-on-scroll.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* --- Hero Section --- */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          background: #fbfbfd;
          overflow: hidden;
          padding-top: 4rem;
        }

        /* Soft, breathing green glow */
        .hero-ambient-glow {
          position: absolute;
          width: 80vw;
          height: 80vw;
          max-width: 800px;
          max-height: 800px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(251, 251, 253, 0) 60%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          animation: breathe 8s ease-in-out infinite alternate;
        }

        @keyframes breathe {
          0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.95); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
        }

        .hero-content {
          max-width: 750px;
          position: relative;
          z-index: 10;
        }

        /* Load-in animations */
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }

        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 0.5rem;
          text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.75rem;
          font-weight: 600; color: #86868b; margin-bottom: 2rem;
        }
        
        .live-dot {
          width: 6px; height: 6px; background: #10b981; border-radius: 50%;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6); animation: pulse 2s infinite;
        }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

        .hero-title {
          font-size: clamp(3.5rem, 7vw, 6rem);
          font-weight: 700;
          line-height: 1.05;
          margin-bottom: 1.5rem;
          letter-spacing: -0.04em;
          color: #1d1d1f;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: #86868b;
          line-height: 1.6;
          max-width: 600px;
          margin-bottom: 3rem;
          font-weight: 400;
        }

        /* Buttons */
        .hero-actions { display: flex; gap: 1rem; align-items: center; }

        .btn-primary {
          padding: 1rem 2rem; border-radius: 30px; border: none; 
          background: #1d1d1f; color: white; font-size: 1rem; 
          font-weight: 500; cursor: pointer; transition: all 0.3s ease;
        }
        .btn-primary:hover { background: #333336; transform: scale(1.02); }

        .btn-secondary {
          padding: 1rem 1.5rem; border-radius: 30px; border: none; background: transparent;
          color: #1d1d1f; font-size: 1rem; font-weight: 500; cursor: pointer; 
          display: flex; align-items: center; gap: 0.5rem; transition: opacity 0.3s;
        }
        .btn-secondary:hover { opacity: 0.6; }
        .btn-secondary .arrow { transition: transform 0.3s; }
        .btn-secondary:hover .arrow { transform: translateX(4px); }

        .btn-text {
          background: none; border: none; color: #10b981; font-size: 1.1rem;
          font-weight: 500; cursor: pointer; padding: 0; display: inline-flex;
          align-items: center; gap: 0.5rem; transition: opacity 0.2s;
        }
        .btn-text:hover { opacity: 0.7; }

        /* --- Bento Grid Section (New) --- */
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .col-span-2 { grid-column: span 2; }
        @media (max-width: 800px) {
          .bento-grid { grid-template-columns: 1fr; }
          .col-span-2 { grid-column: span 1; }
        }

        .bento-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.04);
          display: flex; flex-direction: column; justify-content: center;
          position: relative; overflow: hidden;
        }

        .bento-title { font-size: 1.25rem; font-weight: 600; color: #1d1d1f; margin-bottom: 0.5rem; }
        .bento-text { font-size: 1rem; color: #86868b; line-height: 1.5; margin: 0; }
        
        .metric-value {
          font-size: 3.5rem; font-weight: 700; color: #10b981; 
          letter-spacing: -0.04em; margin-bottom: 0.5rem; line-height: 1;
        }
        .metric-value .unit { font-size: 1.5rem; color: #86868b; margin-left: 0.2rem; font-weight: 500; }

        /* Clean Matrix Viz */
        .viz-clean-grid {
          margin-top: 2rem; height: 100px; width: 100%; position: relative;
          background-image: radial-gradient(#d2d2d7 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .scanning-laser {
          position: absolute; left: 0; top: 0; height: 100%; width: 2px;
          background: #10b981; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
          animation: scanRight 4s ease-in-out infinite alternate;
        }
        @keyframes scanRight { 0% { left: 0; } 100% { left: 100%; } }

        /* --- System Stack --- */
        .stack-section { background: #ffffff; }
        .stack-container { display: flex; flex-direction: column; max-width: 800px; margin: 0 auto; }

        /* --- Field Deployment Glass Panel --- */
        .glass-panel {
          display: grid; grid-template-columns: 1.2fr 1fr; gap: 4rem; align-items: center;
          background: #ffffff; border-radius: 32px; padding: 5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(0, 0, 0, 0.04);
        }
        @media (max-width: 900px) { .glass-panel { grid-template-columns: 1fr; padding: 3rem 2rem; } }

        .node-mesh-clean { width: 100%; height: auto; max-width: 300px; margin: 0 auto; display: block; }
        .pulse-ring { animation: pulseRing 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; transform-origin: center; }
        @keyframes pulseRing { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(3); opacity: 0; } }

        /* --- Closing Section --- */
        .closing-section {
          background: #fbfbfd; min-height: 50vh; display: flex; align-items: center; 
          justify-content: center; overflow: hidden; text-align: center;
        }
        .closing-statement {
          font-size: clamp(3rem, 6vw, 5rem); font-weight: 600; line-height: 1.1; 
          letter-spacing: -0.04em; color: #1d1d1f;
        }
        .closing-glow {
          position: absolute; bottom: -150px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 300px; 
          background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
          filter: blur(40px); pointer-events: none;
        }
      `}</style>
    </>
  );
}

/* ------------------ REUSABLE COMPONENTS ------------------ */

function SystemBlock({ index, title, description }: { index: string; title: string; description: string }) {
  return (
    <div className="system-block reveal-on-scroll">
      <div className="block-index">{index}</div>
      <div className="block-content">
        <h3 className="block-title">{title}</h3>
        <p className="block-desc">{description}</p>
      </div>

      <style jsx>{`
        .system-block {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 2rem;
          padding: 3rem 0;
          border-bottom: 1px solid #e5e5ea;
        }
        .system-block:last-child { border-bottom: none; }
        
        .block-index {
          font-size: 1.2rem;
          font-weight: 600;
          color: #d2d2d7;
          font-variant-numeric: tabular-nums;
          padding-top: 0.2rem;
        }
        
        .block-title {
          font-size: 1.5rem; font-weight: 600; color: #1d1d1f; margin-bottom: 0.5rem; letter-spacing: -0.02em;
        }
        .block-desc {
          font-size: 1.1rem; color: #86868b; line-height: 1.6; margin: 0; max-width: 600px;
        }

        @media (max-width: 600px) {
          .system-block { grid-template-columns: 1fr; gap: 1rem; padding: 2rem 0; }
        }
      `}</style>
    </div>
  );
}