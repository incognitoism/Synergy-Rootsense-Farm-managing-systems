"use client";

import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";

export default function Capabilities() {

  /* ── scroll reveal ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".r").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── bar fill animation on scroll ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const bar = e.target as HTMLElement;
          bar.style.width = bar.dataset.w ?? "0%";
        }
      }),
      { threshold: 0.5 }
    );
    document.querySelectorAll(".spec-bar-fill").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Header />
      <ParticleBackground />

      <div className="page-offset">
        <main className="cap-page">
          <div className="container">

            {/* ── HERO ── */}
            <section className="cap-hero">
              <div className="hero-glow" />
              <div className="hero-glow hero-glow-2" />

              <span className="cap-eyebrow li a1">
                <span className="eyebrow-dot" />
                Instrument Specifications
              </span>

              <h1 className="cap-title li a2">
                Instrument<br />
                <span className="grad">Specifications</span>
              </h1>

              <p className="cap-intro li a3">
                Our primary capability is non-invasive density contrast imaging. By utilizing the
                constant flux of cosmic ray muons, we generate volumetric data of massive structures
                without a single bore hole.
              </p>
            </section>

            {/* ── INSTRUMENTS GRID ── */}
            <section className="instruments-grid">

              {/* ── Series V ── */}
              <div className="instrument-card r">
                <div className="card-glow" />
                <div className="card-header">
                  <div className="card-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <div>
                    <span className="card-series">Series V</span>
                    <h3 className="card-name">Muon Telescopes</h3>
                  </div>
                </div>

                <p className="card-desc">High-mobility distinct units for variable geometry deployment.</p>

                <div className="spec-table">
                  {[
                    { label: "Angular Resolution", value: "15 mrad",              bar: 72 },
                    { label: "Effective Area",      value: "2 m² / unit",         bar: 55 },
                    { label: "Power Draw",          value: "45W (Solar Compatible)", bar: 38 },
                    { label: "Depth Penetration",   value: "~ 2 km w.e.",         bar: 90 },
                  ].map((s) => (
                    <div className="spec-row" key={s.label}>
                      <div className="spec-top">
                        <span className="spec-label">{s.label}</span>
                        <span className="spec-value">{s.value}</span>
                      </div>
                      <div className="spec-track">
                        <div
                          className="spec-bar-fill"
                          data-w={`${s.bar}%`}
                          style={{ width: "0%", transition: "width 1.2s cubic-bezier(.25,1,.5,1)" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Series G ── */}
              <div className="instrument-card r d1">
                <div className="card-glow" />
                <div className="card-header">
                  <div className="card-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <span className="card-series">Series G</span>
                    <h3 className="card-name">Gravimeters</h3>
                  </div>
                </div>

                <p className="card-desc">Micro-gravity fluctuation sensing for void detection.</p>

                <div className="spec-table">
                  {[
                    { label: "Sensitivity",   value: "1 µGal",          bar: 95 },
                    { label: "Drift",         value: "< 5 µGal / day",  bar: 60 },
                    { label: "Sampling Rate", value: "1 Hz - 100 Hz",   bar: 80 },
                  ].map((s) => (
                    <div className="spec-row" key={s.label}>
                      <div className="spec-top">
                        <span className="spec-label">{s.label}</span>
                        <span className="spec-value">{s.value}</span>
                      </div>
                      <div className="spec-track">
                        <div
                          className="spec-bar-fill"
                          data-w={`${s.bar}%`}
                          style={{ width: "0%", transition: "width 1.2s cubic-bezier(.25,1,.5,1)" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </section>

            {/* ── COMPARISON BENTO ── */}
            <section className="compare-section r">
              <div className="sec-label">
                <span className="sec-tag">At a Glance</span>
                <h2 className="sec-h">Side-by-side comparison</h2>
              </div>
              <div className="compare-grid">
                {[
                  { label: "Angular Resolution", v: "15 mrad",            g: "—" },
                  { label: "Sensitivity",         v: "—",                 g: "1 µGal" },
                  { label: "Depth Penetration",   v: "~2 km w.e.",        g: "Surface" },
                  { label: "Power Draw",          v: "45W",               g: "12W" },
                  { label: "Deployment",          v: "Variable Geometry", g: "Fixed Station" },
                  { label: "Sampling Rate",       v: "Continuous",        g: "1–100 Hz" },
                ].map((row, i) => (
                  <div className={`compare-row r`} key={row.label} style={{ transitionDelay: `${i * 0.07}s` }}>
                    <span className="compare-label">{row.label}</span>
                    <span className="compare-val v-accent">{row.v}</span>
                    <span className="compare-val">{row.g}</span>
                  </div>
                ))}
              </div>
              <div className="compare-header">
                <span />
                <span className="compare-head">Series V</span>
                <span className="compare-head">Series G</span>
              </div>
            </section>

          </div>
        </main>
      </div>

      <Footer />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg:   #080807; --s1: #0f0f0e; --s2: #141413; --s3: #1a1a18; --s4: #212120;
          --b0:   rgba(255,255,255,.05); --b1: rgba(255,255,255,.09); --b2: rgba(255,255,255,.15);
          --t0:   #f0f0ec; --t1: rgba(240,240,236,.58); --t2: rgba(240,240,236,.3); --t3: rgba(240,240,236,.15);
          --g0:   #10b981; --g1: #34d399;
          --ga:   rgba(16,185,129,.07); --gb: rgba(16,185,129,.13);
          --font: 'Instrument Sans', -apple-system, sans-serif;
          --mono: 'JetBrains Mono', monospace;
        }

        html, body { background: var(--bg) !important; color: var(--t0); }

        /* REVEAL */
        .r { opacity:0; transform:translateY(24px); transition:opacity .9s cubic-bezier(.25,1,.5,1), transform .9s cubic-bezier(.25,1,.5,1); }
        .r.in { opacity:1; transform:translateY(0); }
        .d1{transition-delay:.12s} .d2{transition-delay:.25s} .d3{transition-delay:.38s}

        /* LOAD-IN */
        .li{opacity:0;transform:translateY(18px);animation:ri .85s cubic-bezier(.25,1,.5,1) forwards}
        @keyframes ri{to{opacity:1;transform:translateY(0)}}
        .a1{animation-delay:.1s}.a2{animation-delay:.25s}.a3{animation-delay:.4s}

        /* PAGE */
        .page-offset { padding-top: var(--header-height, 96px); position: relative; z-index: 1; background: var(--bg); }
        .cap-page { padding: 0 0 7rem; min-height: 100vh; background: var(--bg); }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 2.5rem; }

        /* ── HERO ── */
        .cap-hero {
          padding: 5rem 0 4.5rem; position: relative;
          border-bottom: 1px solid var(--b0); margin-bottom: 5rem; overflow: hidden;
        }
        .cap-hero::after {
          content: ''; position: absolute; bottom: -1px; left: 0;
          width: 72px; height: 1px; background: var(--g0);
          animation: expandLine 1.2s cubic-bezier(.25,1,.5,1) .8s both;
        }
        @keyframes expandLine { from{width:0} to{width:72px} }

        .hero-glow {
          position: absolute; top: -80px; left: -100px;
          width: 600px; height: 500px;
          background: radial-gradient(ellipse, rgba(16,185,129,.07), transparent 65%);
          filter: blur(80px); pointer-events: none;
          animation: floatGlow 12s ease-in-out infinite alternate;
        }
        .hero-glow-2 {
          top: auto; bottom: -100px; left: auto; right: -60px;
          width: 400px; height: 400px; animation-delay: -6s;
          background: radial-gradient(ellipse, rgba(16,185,129,.04), transparent 65%);
        }
        @keyframes floatGlow {
          0%   { transform: translate(0,0) scale(.9); opacity:.6; }
          50%  { transform: translate(25px,-15px) scale(1.05); }
          100% { transform: translate(-10px,10px) scale(1.1); opacity:1; }
        }

        /* EYEBROW */
        .cap-eyebrow {
          display: inline-flex; align-items: center; gap: .45rem;
          padding: .28rem .85rem .28rem .5rem;
          background: var(--ga); border: 1px solid rgba(16,185,129,.18);
          border-radius: 40px; font-family: var(--mono);
          font-size: .67rem; font-weight: 500; letter-spacing: .1em;
          text-transform: uppercase; color: var(--g0); margin-bottom: 1.75rem;
        }
        .eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--g0); box-shadow: 0 0 8px rgba(16,185,129,.6);
          animation: blink 2.4s ease infinite; flex-shrink: 0;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.15} }

        /* TITLE */
        .cap-title {
          font-size: clamp(2.6rem, 5vw, 4.2rem); font-weight: 700;
          letter-spacing: -.055em; line-height: 1.04;
          color: var(--t0); margin-bottom: 1.5rem; max-width: 640px;
        }
        .grad {
          background: linear-gradient(118deg, #fff 0%, #a7f3d0 45%, #34d399 75%, #059669 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .cap-intro { font-size: 1.08rem; line-height: 1.78; color: var(--t1); max-width: 620px; }

        /* ── INSTRUMENTS GRID ── */
        .instruments-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1.5rem; margin-bottom: 5rem;
        }

        /* INSTRUMENT CARD */
        .instrument-card {
          background: var(--s2); border: 1px solid var(--b1);
          border-radius: 20px; padding: 2.5rem;
          position: relative; overflow: hidden;
          transition: border-color .3s, box-shadow .3s, transform .3s;
        }
        .instrument-card:hover {
          border-color: var(--b2);
          box-shadow: 0 0 50px -15px rgba(16,185,129,.1);
          transform: translateY(-3px);
        }
        .instrument-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(16,185,129,.2), transparent);
        }
        .card-glow {
          position: absolute; top: -60px; right: -60px;
          width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(16,185,129,.06), transparent 65%);
          pointer-events: none;
          animation: floatGlow 10s ease-in-out infinite alternate;
        }

        /* CARD HEADER */
        .card-header {
          display: flex; align-items: center; gap: 1rem;
          margin-bottom: 1rem;
        }
        .card-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: var(--ga); border: 1px solid rgba(16,185,129,.18);
          display: flex; align-items: center; justify-content: center;
          color: var(--g0); flex-shrink: 0;
          transition: background .2s, border-color .2s;
        }
        .instrument-card:hover .card-icon { background: var(--gb); border-color: rgba(16,185,129,.3); }
        .card-series {
          font-family: var(--mono); font-size: .62rem; font-weight: 500;
          letter-spacing: .1em; text-transform: uppercase; color: var(--g0);
          display: block; margin-bottom: .2rem;
        }
        .card-name {
          font-size: 1.25rem; font-weight: 700; letter-spacing: -.03em;
          color: var(--t0); line-height: 1.2;
        }
        .card-desc { font-size: .88rem; color: var(--t1); line-height: 1.6; margin-bottom: 2rem; }

        /* SPEC TABLE */
        .spec-table { display: flex; flex-direction: column; gap: 1.1rem; }
        .spec-row {}
        .spec-top {
          display: flex; justify-content: space-between; align-items: baseline;
          margin-bottom: .5rem;
        }
        .spec-label {
          font-size: .8rem; color: var(--t2);
          font-weight: 500; letter-spacing: .01em;
        }
        .spec-value {
          font-family: var(--mono); font-size: .78rem; font-weight: 500;
          color: var(--t0); letter-spacing: -.01em;
        }
        .spec-track {
          height: 3px; background: rgba(255,255,255,.06);
          border-radius: 2px; overflow: hidden;
        }
        .spec-bar-fill {
          height: 100%; background: linear-gradient(90deg, #059669, #34d399);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(16,185,129,.4);
        }

        /* ── COMPARE SECTION ── */
        .compare-section { margin-bottom: 4rem; }
        .sec-label { margin-bottom: 2.5rem; }
        .sec-tag {
          font-family: var(--mono); font-size: .68rem; font-weight: 500;
          letter-spacing: .1em; text-transform: uppercase; color: var(--g0);
          display: block; margin-bottom: .7rem;
        }
        .sec-h {
          font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 700;
          letter-spacing: -.045em; line-height: 1.1; color: var(--t0);
        }

        .compare-grid {
          background: var(--s2); border: 1px solid var(--b1);
          border-radius: 16px; overflow: hidden;
        }
        .compare-header {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          padding: .65rem 1.5rem;
          background: var(--s3); border-bottom: 1px solid var(--b0);
          order: -1;
        }
        .compare-head {
          font-family: var(--mono); font-size: .65rem; font-weight: 500;
          letter-spacing: .09em; text-transform: uppercase; color: var(--g0);
          text-align: center;
        }
        .compare-row {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--b0);
          align-items: center;
          transition: background .18s;
        }
        .compare-row:last-child { border-bottom: none; }
        .compare-row:hover { background: var(--s3); }
        .compare-label {
          font-size: .85rem; font-weight: 500; color: var(--t1);
        }
        .compare-val {
          font-family: var(--mono); font-size: .82rem; font-weight: 500;
          color: var(--t2); text-align: center;
        }
        .compare-val.v-accent { color: var(--g1); }

        /* RESPONSIVE */
        @media (max-width: 860px) {
          .instruments-grid { grid-template-columns: 1fr; }
          .compare-header, .compare-row { grid-template-columns: 1fr 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .cap-title { font-size: 2.2rem; }
          .container { padding: 0 1.5rem; }
          .cap-hero { padding: 3rem 0; }
          .instrument-card { padding: 1.75rem; }
        }
      `}</style>
    </>
  );
}