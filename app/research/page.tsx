"use client";

import { useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";

export default function Research() {

  /* ── scroll reveal ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".r").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── typed text effect ── */
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".typed-text");
    if (!el) return;
    const words = ["Structural Insight", "Density Modeling", "Particle Physics", "Root-Zone Analysis"];
    let wi = 0, ci = 0, deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const type = () => {
      const word = words[wi];
      if (!deleting) {
        el.textContent = word.slice(0, ci + 1);
        ci++;
        if (ci === word.length) { deleting = true; timer = setTimeout(type, 1800); return; }
      } else {
        el.textContent = word.slice(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      timer = setTimeout(type, deleting ? 45 : 80);
    };
    timer = setTimeout(type, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
      <ParticleBackground />

      <div className="page-offset">
        <main className="research-page">
          <div className="container">

            {/* ── HERO ── */}
            <section className="research-hero">
              <div className="hero-glow" />
              <div className="hero-glow hero-glow-2" />

              <span className="research-eyebrow li a1">
                <span className="eyebrow-dot" />
                Research Overview
              </span>

              <h1 className="research-title li a2">
                The Physics of<br />
                <span className="grad typed-text">Structural Insight</span><span className="cursor">|</span>
              </h1>

              <p className="research-intro li a3">
                Vega Labs applies fundamental particle physics to the analysis of
                large-scale structures and geological formations. Our research
                emphasizes non-invasive techniques for understanding internal
                density variation where conventional inspection methods are
                insufficient.
              </p>

              {/* animated stat row */}
              <div className="hero-stats li a4">
                {[
                  { v: "0.1", u: "mm", l: "Resolution" },
                  { v: "3D",  u: "",   l: "Density Models" },
                  { v: "Non", u: "-invasive", l: "Methodology" },
                ].map((s) => (
                  <div className="hstat" key={s.l}>
                    <span className="hstat-n">{s.v}<span className="hstat-u">{s.u}</span></span>
                    <span className="hstat-l">{s.l}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── CONTENT GRID ── */}
            <section className="research-grid">

              {/* MAIN */}
              <div className="research-main">
                <h2 className="r">Volumetric Density Analysis</h2>

                <p className="r d1">
                  Traditional structural assessment techniques often depend on
                  surface observation, localized sampling, or indirect inference.
                  Vega Labs research explores volumetric approaches that infer
                  internal material distribution through naturally occurring
                  particle flux.
                </p>

                <p className="r d1">
                  By observing how particles traverse matter from multiple angles,
                  relative density differences can be estimated throughout an
                  entire structure. These observations are accumulated over time
                  and reconstructed into three-dimensional density models.
                </p>

                <div className="research-figure r d2">
                  <div className="figure-glow" />
                  <div className="figure-content">
                    <DensityGrid />
                  </div>
                  <div className="figure-label">
                    Conceptual Density Reconstruction Model
                  </div>
                </div>

                <h3 className="r">Applications in the Built Environment</h3>

                <p className="r d1">
                  Current research efforts focus on civil infrastructure,
                  subsurface mapping, and long-term structural monitoring.
                  Emphasis is placed on early identification of internal
                  anomalies and material inconsistencies without invasive access
                  or operational disruption.
                </p>
              </div>

              {/* SIDEBAR */}
              <aside className="research-sidebar r d2">
                <div className="sidebar-card">
                  <div className="sidebar-header">
                    <h4 className="sidebar-title">Selected Publications</h4>
                  </div>
                  <ul className="sidebar-list">
                    <li className="sidebar-item">
                      <strong>Journal of Applied Physics — 2025</strong>
                      <span>
                        Particle-based methods for non-invasive density estimation
                        in large structures
                      </span>
                    </li>
                    <li className="sidebar-item">
                      <strong>Structural Health Monitoring Review — 2024</strong>
                      <span>
                        Advances in volumetric analysis for infrastructure
                        assessment
                      </span>
                    </li>
                  </ul>
                </div>
              </aside>

            </section>
          </div>
        </main>
      </div>

      <Footer />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg:   #080807; --s1: #0f0f0e; --s2: #141413; --s3: #1a1a18;
          --b0:   rgba(255,255,255,.05); --b1: rgba(255,255,255,.09); --b2: rgba(255,255,255,.15);
          --t0:   #f0f0ec; --t1: rgba(240,240,236,.58); --t2: rgba(240,240,236,.3); --t3: rgba(240,240,236,.15);
          --g0:   #10b981; --g1: #34d399;
          --ga:   rgba(16,185,129,.07); --gb: rgba(16,185,129,.13);
          --font: 'Instrument Sans', -apple-system, sans-serif;
          --mono: 'JetBrains Mono', monospace;
        }

        html, body { background: var(--bg) !important; color: var(--t0); }

        /* ── REVEAL ── */
        .r { opacity:0; transform:translateY(24px); transition:opacity .9s cubic-bezier(.25,1,.5,1), transform .9s cubic-bezier(.25,1,.5,1); }
        .r.in { opacity:1; transform:translateY(0); }
        .d1{transition-delay:.12s} .d2{transition-delay:.25s} .d3{transition-delay:.38s}

        /* ── LOAD-IN ── */
        .li{opacity:0;transform:translateY(18px);animation:ri .85s cubic-bezier(.25,1,.5,1) forwards}
        @keyframes ri{to{opacity:1;transform:translateY(0)}}
        .a1{animation-delay:.15s}.a2{animation-delay:.3s}.a3{animation-delay:.45s}.a4{animation-delay:.6s}

        /* PAGE */
        .page-offset { padding-top: var(--header-height, 96px); position: relative; z-index: 1; background: var(--bg); }
        .research-page { padding: 0 0 7rem; min-height: 100vh; background: var(--bg); }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 2.5rem; }

        /* ── HERO ── */
        .research-hero {
          padding: 5rem 0 4rem; position: relative;
          border-bottom: 1px solid var(--b0); margin-bottom: 4.5rem; overflow: hidden;
        }
        .research-hero::after {
          content: ''; position: absolute; bottom: -1px; left: 0;
          width: 72px; height: 1px; background: var(--g0);
          animation: expandLine 1.2s cubic-bezier(.25,1,.5,1) .8s both;
        }
        @keyframes expandLine { from{width:0} to{width:72px} }

        .hero-glow {
          position: absolute; top: -80px; left: -120px;
          width: 600px; height: 500px;
          background: radial-gradient(ellipse, rgba(16,185,129,.07), transparent 65%);
          filter: blur(80px); pointer-events: none;
          animation: floatGlow 12s ease-in-out infinite alternate;
        }
        .hero-glow-2 {
          top: auto; bottom: -100px; left: auto; right: -80px;
          width: 400px; height: 400px;
          background: radial-gradient(ellipse, rgba(16,185,129,.04), transparent 65%);
          animation-delay: -6s;
        }
        @keyframes floatGlow {
          0%   { transform: translate(0,0) scale(.9); opacity:.6; }
          50%  { transform: translate(30px,-20px) scale(1.05); }
          100% { transform: translate(-15px,15px) scale(1.1); opacity:1; }
        }

        /* EYEBROW */
        .research-eyebrow {
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
        .research-title {
          font-size: clamp(2.6rem, 5vw, 4.2rem); font-weight: 700;
          letter-spacing: -.05em; line-height: 1.04;
          color: var(--t0); margin-bottom: 1.5rem; max-width: 700px;
        }
        .grad {
          background: linear-gradient(118deg, #fff 0%, #a7f3d0 45%, #34d399 75%, #059669 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .cursor {
          -webkit-text-fill-color: var(--g0);
          animation: blink 0.75s step-end infinite;
          font-weight: 300; margin-left: 2px;
        }

        .research-intro { font-size: 1.08rem; line-height: 1.78; color: var(--t1); max-width: 620px; }

        /* STATS ROW */
        .hero-stats { display: flex; gap: 0; margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--b0); }
        .hstat { padding: 0 2.25rem 0 0; transition: transform .3s; }
        .hstat:hover { transform: translateY(-2px); }
        .hstat + .hstat { padding-left: 2.25rem; border-left: 1px solid var(--b0); }
        .hstat-n { display: block; font-size: 1.6rem; font-weight: 700; letter-spacing: -.04em; color: var(--g1); line-height: 1; margin-bottom: .2rem; }
        .hstat-u { font-size: .85rem; color: rgba(52,211,153,.4); }
        .hstat-l { font-family: var(--mono); font-size: .62rem; color: var(--t3); letter-spacing: .07em; text-transform: uppercase; }

        /* ── GRID ── */
        .research-grid { display: grid; grid-template-columns: 1fr 300px; gap: 5rem; align-items: start; }

        /* ── MAIN ── */
        .research-main h2 {
          font-size: 1.6rem; font-weight: 700; letter-spacing: -.04em;
          color: var(--t0); margin-bottom: 1.25rem; line-height: 1.15;
        }
        .research-main h3 {
          font-size: 1.05rem; font-weight: 600; letter-spacing: -.02em;
          color: var(--t0); margin: 3rem 0 .9rem;
          display: flex; align-items: center; gap: .75rem;
        }
        .research-main h3::before {
          content: ''; display: inline-block; width: 3px; height: 1em;
          background: var(--g0); border-radius: 2px; flex-shrink: 0;
        }
        .research-main p { font-size: .97rem; line-height: 1.87; color: var(--t1); margin-bottom: 1.5rem; }

        /* ── FIGURE ── */
        .research-figure {
          margin: 2.5rem 0 3rem; border: 1px solid var(--b1);
          border-radius: 16px; background: var(--s2); overflow: hidden; position: relative;
          transition: border-color .3s, box-shadow .3s;
        }
        .research-figure:hover { border-color: var(--b2); box-shadow: 0 0 40px -10px rgba(16,185,129,.08); }
        .figure-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(16,185,129,.06), transparent 68%);
          pointer-events: none;
        }
        .figure-content { padding: 2rem 2rem 1.25rem; position: relative; z-index: 1; }
        .figure-label {
          font-family: var(--mono); font-size: .63rem; letter-spacing: .1em;
          text-transform: uppercase; color: var(--t3);
          padding: .65rem 1.25rem; border-top: 1px solid var(--b0);
          text-align: center; background: var(--s3);
        }

        /* ── SIDEBAR ── */
        .research-sidebar { position: sticky; top: calc(var(--header-height, 96px) + 1.5rem); }
        .sidebar-card { background: var(--s2); border: 1px solid var(--b1); border-radius: 14px; overflow: hidden; transition: border-color .3s; }
        .sidebar-card:hover { border-color: var(--b2); }
        .sidebar-header { padding: 1rem 1.25rem; border-bottom: 1px solid var(--b0); background: var(--s3); }
        .sidebar-title { font-family: var(--mono); font-size: .65rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--g0); }
        .sidebar-list { padding: .5rem 0; list-style: none; }
        .sidebar-item { padding: 1rem 1.25rem; border-bottom: 1px solid var(--b0); transition: background .18s, padding-left .2s; position: relative; overflow: hidden; }
        .sidebar-item:last-child { border-bottom: none; }
        .sidebar-item:hover { background: var(--s3); padding-left: 1.6rem; }
        .sidebar-item::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: transparent; transition: background .18s; }
        .sidebar-item:hover::before { background: var(--g0); }
        .sidebar-item strong { display: block; font-size: .8rem; font-weight: 600; color: var(--g1); margin-bottom: .35rem; letter-spacing: -.01em; line-height: 1.3; }
        .sidebar-item span { font-size: .8rem; color: var(--t1); line-height: 1.65; display: block; }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .research-grid { grid-template-columns: 1fr; gap: 3rem; }
          .research-sidebar { position: static; }
          .hero-stats { gap: 0; }
        }
        @media (max-width: 560px) {
          .research-title { font-size: 2rem; }
          .container { padding: 0 1.5rem; }
          .research-hero { padding: 3rem 0; }
        }
      `}</style>
    </>
  );
}

/* ── Density Grid SVG ── */
function DensityGrid() {
  const rows = [
    [.06,.1,.18,.28,.42,.58,.72,.58,.42,.28,.18,.1,.06,.04],
    [.1,.2,.38,.55,.72,.88,1,.88,.72,.55,.38,.2,.1,.06],
    [.08,.16,.3,.48,.65,.8,.88,.8,.65,.48,.3,.16,.08,.04],
    [.04,.08,.14,.22,.32,.42,.48,.42,.32,.22,.14,.08,.04,.02],
  ];
  const cellW = 34, cellH = 28, pad = 10;
  const W = rows[0].length * cellW + pad * 2;
  const H = rows.length * cellH + pad * 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.3" />
        </radialGradient>
        <radialGradient id="sg" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>
      {rows.map((row, r) =>
        row.map((val, c) => (
          <rect
            key={`${r}-${c}`}
            x={pad + c * cellW + 1} y={pad + r * cellH + 1}
            width={cellW - 2} height={cellH - 2}
            rx="3"
            fill={`rgba(16,185,129,${val})`}
          >
            <animate attributeName="opacity" values={`${val};${Math.min(val * 1.3, 1)};${val}`} dur={`${2 + (r * rows[0].length + c) * 0.05}s`} repeatCount="indefinite" />
          </rect>
        ))
      )}
      {/* scan line */}
      <rect x={pad} y={pad} width="3" height={rows.length * cellH} fill="url(#cg)" rx="1">
        <animateTransform attributeName="transform" type="translate" from="0 0" to={`${rows[0].length * cellW} 0`} dur="4s" repeatCount="indefinite" />
      </rect>
      {/* scan glow */}
      <rect x={pad - 20} y={pad - 4} width="46" height={rows.length * cellH + 8} fill="url(#sg)" opacity=".5">
        <animateTransform attributeName="transform" type="translate" from="0 0" to={`${rows[0].length * cellW} 0`} dur="4s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}