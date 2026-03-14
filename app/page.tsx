"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── particle canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const dots: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    for (let i = 0; i < 55; i++) {
      dots.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.5 + .5, a: Math.random() });
    }
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(52,211,153,${d.a * .35})`;
        ctx.fill();
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(16,185,129,${(1 - dist / 120) * .08})`;
            ctx.lineWidth = .6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);

  /* ── scroll reveal ── */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".r").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* ── counter animation ── */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".count-up");
    els.forEach(el => {
      const target = parseFloat(el.dataset.target || "0");
      const isFloat = String(target).includes(".");
      let start = 0;
      const step = target / 40;
      const tick = () => {
        start = Math.min(start + step, target);
        el.textContent = isFloat ? start.toFixed(1) : Math.round(start).toString();
        if (start < target) requestAnimationFrame(tick);
      };
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { tick(); io.disconnect(); } }, { threshold: .5 });
      io.observe(el);
    });
  }, []);

  return (
    <>
      <Header />
      <main className="page">

        {/* ── HERO ── */}
        <section className="hero">
          <canvas ref={canvasRef} className="hero-canvas" />
          <div className="hero-glow-a" />
          <div className="hero-glow-b" />
          <div className="hero-grid" />

          <div className="hero-content">
            <div className="eyebrow li a1">
              <span className="eyebrow-dot" />
              Subsurface Intelligence
              <span className="eyebrow-div" />
              <span className="eyebrow-status">All systems operational</span>
            </div>

            <h1 className="hero-h1 li a2">
              Agriculture.<br />
              <span className="grad">Beneath the surface.</span>
            </h1>

            <p className="hero-p li a3">
              Volumetric sensing networks that map soil structure, moisture
              dynamics, and root-zone health in real time. The invisible, made visible.
            </p>

            <div className="hero-btns li a4">
              <button className="btn-a" onClick={() => router.push("/clusters/new/step-1")}>
                Deploy a Cluster
              </button>
              <button className="btn-b" onClick={() => router.push("/research")}>
                Read Whitepaper →
              </button>
            </div>

            <div className="stats li a5">
              {[
                { n: "10",   u: "yr", l: "Battery Life",  target: 10,   float: false },
                { n: "0.1",  u: "mm", l: "Precision",     target: 0.1,  float: true  },
                { n: "<2",   u: "s",  l: "Latency",       target: null, float: false },
                { n: "99.9", u: "%",  l: "Uptime SLA",    target: 99.9, float: true  },
              ].map((s) => (
                <div className="stat" key={s.l}>
                  <span className="stat-n">
                    {s.target !== null
                      ? <span className="count-up" data-target={s.target}>{s.n}</span>
                      : s.n}
                    <span className="stat-u">{s.u}</span>
                  </span>
                  <span className="stat-l">{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal card */}
          <div className="terminal li a3" style={{ animationDelay: "0.45s" }}>
            <div className="term-bar">
              <span className="td" style={{ background: "#ff5f57" }} />
              <span className="td" style={{ background: "#ffbd2e" }} />
              <span className="td" style={{ background: "#28c840" }} />
              <span className="term-title">rootsense · live feed</span>
            </div>
            <div className="term-body">
              <TerminalLines />
            </div>
          </div>
        </section>

        {/* ── BENTO ── */}
        <section className="section">
          <div className="wrap">
            <div className="sec-pre r">
              <span className="sec-tag">Platform Capabilities</span>
              <h2 className="sec-h">Built for what lives underground.</h2>
            </div>
            <div className="bento r d1">
              <div className="bc bc-wide">
                <div className="bc-top">
                  <div>
                    <span className="bc-tag">Core Technology</span>
                    <h3 className="bc-h">Sub-millimeter Precision</h3>
                    <p className="bc-p">Edge-compute nodes use low-frequency wave inversion to build high-fidelity 3D structural models of your soil, layer by layer.</p>
                  </div>
                  <div className="bc-badge">Active</div>
                </div>
                <div>
                  <div className="scan-box"><div className="scan-ln" /></div>
                  <div className="scan-labels">
                    <span className="scan-l">DEPTH 0–200cm</span>
                    <span className="scan-l">RES 0.1mm</span>
                    <span className="scan-l scan-live"><span className="dot-sm" />SCANNING</span>
                  </div>
                </div>
              </div>
              <div className="bc">
                <span className="bc-tag">Power</span>
                <span className="bc-n">10<span className="bc-nu">yr</span></span>
                <h3 className="bc-h">Battery Life</h3>
                <p className="bc-p">Ultra-low power architecture outlasts crop cycles.</p>
              </div>
              <div className="bc bc-accent">
                <span className="bc-tag">Telemetry</span>
                <span className="bc-n" style={{ color: "#34d399" }}>0.1<span className="bc-nu" style={{ color: "rgba(52,211,153,.35)" }}>Hz</span></span>
                <h3 className="bc-h">Live Streaming</h3>
                <p className="bc-p">Continuous real-time data to your dashboard.</p>
              </div>
              <div className="bc">
                <span className="bc-tag">Network</span>
                <span className="bc-n">∞</span>
                <h3 className="bc-h">Scalable Mesh</h3>
                <p className="bc-p">Self-healing node clusters across thousands of acres.</p>
              </div>
              <div className="bc bc-dark">
                <span className="bc-tag" style={{ color: "rgba(52,211,153,.45)" }}>Intelligence</span>
                <h3 className="bc-h" style={{ marginTop: "auto", fontSize: "1.05rem", lineHeight: 1.4 }}>
                  Root-zone models update every cycle — no manual calibration required.
                </h3>
                <div className="bc-arrow">→</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PHILOSOPHY ── */}
        <div className="phil">
          <div className="phil-glow" />
          <div className="wrap" style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <span className="sec-tag r" style={{ display: "block", textAlign: "center" }}>Perspective</span>
            <h2 className="phil-h r d1">The ground is a<br /><span className="grad">living system.</span></h2>
            <p className="phil-p r d2">
              Soil is not passive matter. It is a layered mechanical, hydrological,
              and biological architecture. Most agricultural tools observe the canopy.
              We measure the foundation.
            </p>
          </div>
        </div>

        {/* ── STACK ── */}
        <div className="stack-bg">
          <div className="section wrap">
            <div className="sec-pre r">
              <span className="sec-tag">System Architecture</span>
              <h2 className="sec-h">Three integrated engines.</h2>
            </div>
            <div className="stack-list">
              {[
                { idx: "01", tag: "Structural",   title: "Density Mapping Engine",         desc: "Non-destructive voxel reconstruction detects compaction layers and subsurface structural discontinuities with sub-millimeter fidelity.", delay: "" },
                { idx: "02", tag: "Hydrological", title: "Moisture Gradient Intelligence", desc: "Monitors capillary action, infiltration rates, and water movement across varied depth horizons in continuous real-time streams.", delay: "d1" },
                { idx: "03", tag: "Biological",   title: "Root-Zone Structural Modeling",  desc: "Analyzes mechanical constraints to understand how soil density and compaction limit active root expansion and long-term crop yield.", delay: "d2" },
              ].map((s) => (
                <div className={`stack-row r ${s.delay}`} key={s.idx}>
                  <span className="snum">{s.idx}</span>
                  <div>
                    <h3 className="stitle">{s.title}</h3>
                    <p className="sdesc">{s.desc}</p>
                  </div>
                  <span className="stag">{s.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DEPLOY ── */}
        <section className="section">
          <div className="wrap">
            <div className="deploy-card r">
              <div className="deploy-card-glow" />
              <div>
                <span className="sec-tag">Infrastructure</span>
                <h2 className="sec-h" style={{ marginTop: ".4rem" }}>Infinite Scalability.<br />Zero Compromise.</h2>
                <p className="sec-p">
                  Distributed sensing nodes form a self-healing mesh network,
                  feeding volumetric inversion models across thousands of acres.
                </p>
                <button className="btn-a" style={{ marginTop: "2rem" }} onClick={() => router.push("/clusters/new/step-1")}>
                  Configure your network →
                </button>
              </div>
              <div className="deploy-graphic">
                <MeshGraphic />
              </div>
            </div>
          </div>
        </section>

        {/* ── CLOSING ── */}
        <section className="closing">
          <div className="closing-glow" />
          <div className="wrap" style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
            <h2 className="closing-h r">The ground is now<br /><span className="grad">an API.</span></h2>
            <p className="closing-sub r d1">Start mapping what matters — from 5 cm to 5 metres deep.</p>
            <div className="r d2">
              <button className="btn-a" style={{ fontSize: ".95rem", padding: ".85rem 2.2rem" }} onClick={() => router.push("/clusters/new/step-1")}>
                Deploy a Cluster →
              </button>
            </div>
          </div>
        </section>

      </main>
      <Footer />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}

        :root {
          --bg:#080807;--s1:#0f0f0e;--s2:#141413;--s3:#1a1a18;--s4:#212120;--s5:#2a2a28;
          --b0:rgba(255,255,255,.04);--b1:rgba(255,255,255,.08);--b2:rgba(255,255,255,.13);--b3:rgba(255,255,255,.2);
          --t0:#f0f0ec;--t1:rgba(240,240,236,.6);--t2:rgba(240,240,236,.32);--t3:rgba(240,240,236,.16);
          --g0:#10b981;--g1:#34d399;--g2:#6ee7b7;
          --ga:rgba(16,185,129,.07);--gb:rgba(16,185,129,.14);--gc:rgba(16,185,129,.22);
          --font:'Instrument Sans',-apple-system,sans-serif;
          --mono:'JetBrains Mono',monospace;
        }

        html{scroll-behavior:smooth}
        body{font-family:var(--font);background:var(--bg);color:var(--t0);-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .page{background:var(--bg)}
        .wrap{max-width:1140px;margin:0 auto;padding:0 2.5rem}
        .section{padding:6rem 0}

        /* REVEAL */
        .r{opacity:0;transform:translateY(22px);transition:opacity .9s cubic-bezier(.25,1,.5,1),transform .9s cubic-bezier(.25,1,.5,1)}
        .r.in{opacity:1;transform:translateY(0)}
        .d1{transition-delay:.12s}.d2{transition-delay:.24s}.d3{transition-delay:.36s}

        /* LOAD-IN */
        .li{opacity:0;transform:translateY(16px);animation:ri .85s cubic-bezier(.25,1,.5,1) forwards}
        @keyframes ri{to{opacity:1;transform:translateY(0)}}
        .a1{animation-delay:.1s}.a2{animation-delay:.24s}.a3{animation-delay:.38s}.a4{animation-delay:.52s}.a5{animation-delay:.64s}

        /* PARTICLE CANVAS */
        .hero-canvas{position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.6}

        /* SECTION LABELS */
        .sec-pre{margin-bottom:2.75rem}
        .sec-tag{font-family:var(--mono);font-size:.68rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--g0);display:block;margin-bottom:.7rem}
        .sec-h{font-size:clamp(1.8rem,3vw,2.5rem);font-weight:700;letter-spacing:-.045em;line-height:1.1;color:var(--t0)}
        .sec-p{font-size:1rem;color:var(--t1);line-height:1.65;margin-top:.7rem}

        /* GRADIENT TEXT */
        .grad{background:linear-gradient(118deg,#fff 0%,#a7f3d0 40%,#34d399 70%,#059669 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

        /* HERO */
        .hero{min-height:100vh;display:grid;grid-template-columns:1fr 400px;gap:3rem;align-items:center;max-width:1140px;margin:0 auto;padding:6rem 2.5rem 4rem;position:relative}
        .hero-glow-a{position:fixed;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,.09) 0%,transparent 65%);filter:blur(80px);top:20%;left:30%;transform:translate(-50%,-50%);pointer-events:none;z-index:0;animation:floatA 14s ease-in-out infinite alternate}
        .hero-glow-b{position:fixed;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,.05) 0%,transparent 65%);filter:blur(70px);top:70%;left:70%;pointer-events:none;z-index:0;animation:floatB 10s ease-in-out infinite alternate}
        @keyframes floatA{0%{opacity:.6;transform:translate(-50%,-50%) scale(.88) translate(0,0)}50%{transform:translate(-50%,-50%) scale(1.05) translate(30px,-20px)}100%{opacity:1;transform:translate(-50%,-50%) scale(1.1) translate(-20px,10px)}}
        @keyframes floatB{0%{opacity:.5;transform:scale(.9) translate(0,0)}100%{opacity:.8;transform:scale(1.15) translate(-30px,20px)}}
        .hero-grid{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(ellipse 85% 70% at 50% 35%,black 15%,transparent 72%)}
        .hero-content{position:relative;z-index:2}

        /* EYEBROW */
        .eyebrow{display:inline-flex;align-items:center;gap:.5rem;padding:.3rem .9rem .3rem .5rem;background:var(--ga);border:1px solid rgba(16,185,129,.2);border-radius:40px;font-family:var(--mono);font-size:.68rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:var(--g0);margin-bottom:2rem}
        .eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--g0);box-shadow:0 0 8px rgba(16,185,129,.7);animation:blink 2.4s ease infinite;flex-shrink:0}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}
        .eyebrow-div{width:1px;height:9px;background:rgba(16,185,129,.2);margin:0 .15rem}
        .eyebrow-status{color:var(--t2);font-weight:400;letter-spacing:.06em;text-transform:none;font-size:.67rem}

        /* HERO TEXT */
        .hero-h1{font-size:clamp(3rem,5.2vw,5.2rem);font-weight:700;line-height:1.02;letter-spacing:-.055em;margin-bottom:1.4rem}
        .hero-p{font-size:1.05rem;line-height:1.75;color:var(--t1);max-width:480px;margin:0 0 2.5rem}
        .hero-btns{display:flex;gap:.65rem;align-items:center;flex-wrap:wrap}

        /* BUTTONS */
        .btn-a{padding:.72rem 1.55rem;background:var(--t0);color:var(--bg);border:none;border-radius:9px;font-family:var(--font);font-size:.88rem;font-weight:600;cursor:pointer;transition:opacity .2s,transform .2s,box-shadow .2s;letter-spacing:-.01em}
        .btn-a:hover{opacity:.88;transform:translateY(-2px);box-shadow:0 8px 24px -6px rgba(16,185,129,.25)}
        .btn-a:active{transform:scale(.97)}
        .btn-b{padding:.72rem 1.2rem;background:transparent;border:1px solid var(--b2);border-radius:9px;font-family:var(--font);font-size:.88rem;font-weight:500;color:var(--t1);cursor:pointer;transition:border-color .2s,color .2s,background .2s}
        .btn-b:hover{border-color:var(--g0);color:var(--g1);background:var(--ga)}

        /* STATS */
        .stats{display:flex;gap:0;margin-top:3rem;padding-top:2.5rem;border-top:1px solid var(--b0)}
        .stat{padding:0 2.25rem 0 0;transition:transform .3s}.stat:hover{transform:translateY(-2px)}
        .stat+.stat{padding-left:2.25rem;border-left:1px solid var(--b0)}
        .stat-n{display:block;font-size:1.9rem;font-weight:700;letter-spacing:-.05em;color:var(--g1);line-height:1;margin-bottom:.2rem}
        .stat-u{font-size:.95rem;color:rgba(52,211,153,.4)}
        .stat-l{font-family:var(--mono);font-size:.65rem;color:var(--t3);letter-spacing:.07em;text-transform:uppercase}

        /* TERMINAL */
        .terminal{position:relative;z-index:2;border-radius:16px;overflow:hidden;border:1px solid var(--b1);box-shadow:0 40px 100px -20px rgba(0,0,0,.7),inset 0 1px 0 rgba(255,255,255,.06);background:var(--s2);animation:termFloat 6s ease-in-out infinite alternate}
        @keyframes termFloat{0%{transform:translateY(0) rotate(-.3deg)}100%{transform:translateY(-8px) rotate(.3deg)}}
        .term-bar{display:flex;align-items:center;gap:.4rem;padding:.8rem 1.2rem;background:var(--s3);border-bottom:1px solid var(--b0)}
        .td{width:11px;height:11px;border-radius:50%;display:inline-block}
        .term-title{font-family:var(--mono);font-size:.7rem;color:var(--t3);margin-left:.5rem;letter-spacing:.04em}
        .term-body{padding:1.2rem 1.4rem;font-family:var(--mono);font-size:.72rem;line-height:1.9}

        /* BENTO */
        .bento{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--b0);border-radius:20px;overflow:hidden;border:1px solid var(--b1)}
        .bc{background:var(--s1);padding:2.2rem;display:flex;flex-direction:column;justify-content:flex-end;transition:background .25s;position:relative;overflow:hidden}
        .bc::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 80% 20%,rgba(16,185,129,.03),transparent 60%);pointer-events:none}
        .bc:hover{background:var(--s2)}
        .bc-wide{grid-column:span 2;justify-content:space-between}
        .bc-dark{background:var(--s2)}.bc-dark:hover{background:var(--s3)}
        .bc-accent{background:var(--ga)}.bc-accent:hover{background:var(--gb)}
        .bc-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem;gap:1rem}
        .bc-badge{font-family:var(--mono);font-size:.62rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--g0);padding:.22rem .6rem;background:var(--ga);border:1px solid rgba(16,185,129,.18);border-radius:5px;align-self:flex-start;flex-shrink:0}
        .bc-tag{font-family:var(--mono);font-size:.65rem;font-weight:500;letter-spacing:.09em;text-transform:uppercase;color:var(--t3);display:block;margin-bottom:1.2rem}
        .bc-n{display:block;font-size:3.5rem;font-weight:700;letter-spacing:-.06em;color:var(--g0);line-height:1;margin-bottom:.55rem}
        .bc-nu{font-size:1.2rem;font-weight:500;color:rgba(52,211,153,.35)}
        .bc-h{font-size:1.05rem;font-weight:650;letter-spacing:-.02em;color:var(--t0);margin-bottom:.35rem}
        .bc-p{font-size:.86rem;color:var(--t1);line-height:1.6}
        .bc-arrow{font-size:1.3rem;color:var(--g0);margin-top:auto;padding-top:1.5rem;transition:transform .2s}
        .bc:hover .bc-arrow{transform:translateX(4px)}

        /* SCAN */
        .scan-box{height:72px;border-radius:9px;overflow:hidden;position:relative;background-image:radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px);background-size:14px 14px}
        .scan-ln{position:absolute;top:0;left:0;height:100%;width:2px;background:var(--g0);box-shadow:0 0 12px rgba(16,185,129,.55),8px 0 30px rgba(16,185,129,.06);animation:sx 4.5s ease-in-out infinite alternate}
        @keyframes sx{0%{left:0}100%{left:calc(100% - 2px)}}
        .scan-labels{display:flex;gap:1.2rem;margin-top:.6rem}
        .scan-l{font-family:var(--mono);font-size:.62rem;letter-spacing:.07em;text-transform:uppercase;color:var(--t3);display:inline-flex;align-items:center;gap:.3rem}
        .scan-live{color:var(--g0)}
        .dot-sm{width:5px;height:5px;border-radius:50%;background:var(--g0);display:inline-block;animation:blink 2s ease infinite}

        /* PHILOSOPHY */
        .phil{padding:8rem 0;text-align:center;position:relative;overflow:hidden;background:var(--s1)}
        .phil::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--b1),transparent)}
        .phil::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--b1),transparent)}
        .phil-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:400px;background:radial-gradient(ellipse,rgba(16,185,129,.06),transparent 65%);filter:blur(60px);pointer-events:none;animation:floatB 8s ease-in-out infinite alternate}
        .phil-h{font-size:clamp(2.4rem,4.8vw,4rem);font-weight:700;letter-spacing:-.05em;line-height:1.05;margin:.6rem 0 1.6rem}
        .phil-p{font-size:1.12rem;color:var(--t1);line-height:1.62;max-width:560px;margin:0 auto;letter-spacing:-.01em}

        /* STACK */
        .stack-bg{background:var(--s1)}
        .stack-list{max-width:820px}
        .stack-row{display:grid;grid-template-columns:52px 1fr auto;gap:2.5rem;padding:2.4rem 0;border-bottom:1px solid var(--b0);align-items:start;transition:border-color .25s,padding-left .25s}
        .stack-row:hover{border-color:var(--b2);padding-left:.75rem}
        .stack-row:last-child{border-bottom:none}
        .snum{font-family:var(--mono);font-size:.75rem;font-weight:500;color:var(--t3);padding-top:.18rem;letter-spacing:-.01em}
        .stitle{font-size:1.15rem;font-weight:650;letter-spacing:-.025em;color:var(--t0);margin-bottom:.38rem}
        .sdesc{font-size:.93rem;color:var(--t1);line-height:1.65;max-width:500px}
        .stag{font-family:var(--mono);font-size:.65rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--g0);padding:.26rem .65rem;background:var(--ga);border:1px solid rgba(16,185,129,.14);border-radius:5px;white-space:nowrap;margin-top:.1rem;transition:background .2s,border-color .2s}
        .stack-row:hover .stag{background:var(--gb);border-color:rgba(16,185,129,.3)}

        /* DEPLOY */
        .deploy-card{background:var(--s2);border:1px solid var(--b1);border-radius:22px;padding:4rem 4.5rem;display:grid;grid-template-columns:1.35fr 1fr;gap:4rem;align-items:center;position:relative;overflow:hidden;transition:border-color .3s,box-shadow .3s}
        .deploy-card:hover{border-color:var(--b2);box-shadow:0 0 60px -20px rgba(16,185,129,.08)}
        .deploy-card-glow{position:absolute;top:-60px;right:-60px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,.07),transparent 65%);pointer-events:none;animation:floatA 10s ease-in-out infinite alternate}
        .deploy-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(16,185,129,.22),transparent)}
        .deploy-graphic{display:flex;align-items:center;justify-content:center}

        /* CLOSING */
        .closing{padding:10rem 0;text-align:center;position:relative;overflow:hidden}
        .closing-glow{position:absolute;bottom:-60px;left:50%;transform:translateX(-50%);width:700px;height:380px;background:radial-gradient(ellipse,rgba(16,185,129,.1),transparent 65%);filter:blur(60px);pointer-events:none;animation:floatB 9s ease-in-out infinite alternate}
        .closing-h{font-size:clamp(3rem,6.5vw,5.6rem);font-weight:700;letter-spacing:-.056em;line-height:1.03;margin-bottom:1.7rem;position:relative;z-index:1}
        .closing-sub{font-size:1.05rem;color:var(--t1);margin-bottom:2.75rem;position:relative;z-index:1}

        /* RESPONSIVE */
        @media(max-width:900px){
          .hero{grid-template-columns:1fr;padding:6rem 1.5rem 3rem}.terminal{display:none}
          .bento{grid-template-columns:1fr}.bc-wide{grid-column:1}
          .stack-row{grid-template-columns:40px 1fr}.stag{display:none}
          .deploy-card{grid-template-columns:1fr;padding:2.5rem 2rem}.deploy-graphic{display:none}
          .section{padding:4.5rem 0}
        }
      `}</style>
    </>
  );
}

function TerminalLines() {
  return (
    <div style={{ fontFamily: "var(--mono)", fontSize: ".72rem", lineHeight: 1.9 }}>
      <div style={{ color: "var(--t3)" }}>$ rootsense daemon --cluster prod-01</div>
      <div style={{ color: "var(--g0)" }}>✓ Connected to 6 nodes</div>
      <div style={{ height: ".4rem" }} />
      {[
        ["N-01 · depth",      "0–80 cm",  "ok"],
        ["N-01 · moisture",   "62.4 %",   "ok"],
        ["N-01 · compaction", "LOW",       "ok"],
        ["N-02 · moisture",   "58.1 %",   "ok"],
        ["N-03 · compaction", "MED",       "warn"],
        ["N-04 · temp",       "18.3 °C",  "ok"],
      ].map(([k, v, s]) => (
        <div key={k} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", color: "var(--t2)" }}>
          <span>{k}</span>
          <span style={{ color: s === "warn" ? "#f59e0b" : "var(--g1)", fontWeight: 500 }}>{v}</span>
        </div>
      ))}
      <div style={{ height: ".4rem" }} />
      <div style={{ color: "var(--t3)" }}>
        Next scan in 1.8 s
        <span style={{ display: "inline-block", width: 7, height: 12, background: "var(--g0)", opacity: .8, animation: "cur .9s step-end infinite", verticalAlign: "middle", marginLeft: 2, borderRadius: 1 }} />
      </div>
      <style jsx>{`@keyframes cur{0%,100%{opacity:.8}50%{opacity:0}}`}</style>
    </div>
  );
}

function MeshGraphic() {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", maxWidth: 230 }} xmlns="http://www.w3.org/2000/svg">
      <g stroke="rgba(52,211,153,.14)" strokeWidth=".6">
        <line x1="100" y1="100" x2="100" y2="28" /><line x1="100" y1="100" x2="163" y2="64" />
        <line x1="100" y1="100" x2="163" y2="136" /><line x1="100" y1="100" x2="100" y2="172" />
        <line x1="100" y1="100" x2="37" y2="136" /><line x1="100" y1="100" x2="37" y2="64" />
        <line x1="100" y1="28" x2="163" y2="64" /><line x1="163" y1="64" x2="163" y2="136" />
        <line x1="163" y1="136" x2="100" y2="172" /><line x1="100" y1="172" x2="37" y2="136" />
        <line x1="37" y1="136" x2="37" y2="64" /><line x1="37" y1="64" x2="100" y2="28" />
      </g>
      <circle cx="100" cy="100" r="44" stroke="rgba(52,211,153,.06)" strokeWidth=".5" fill="none" />
      <circle cx="100" cy="100" r="78" stroke="rgba(52,211,153,.04)" strokeWidth=".5" strokeDasharray="2 6" fill="none">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="30s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="6" fill="#10b981" />
      <circle cx="100" cy="100" fill="none" stroke="rgba(16,185,129,.3)" strokeWidth=".5">
        <animate attributeName="r" from="10" to="32" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" from=".6" to="0" dur="3s" repeatCount="indefinite" />
      </circle>
      <g fill="#34d399">
        <circle cx="100" cy="28" r="3.5" /><circle cx="163" cy="64" r="3.5" />
        <circle cx="163" cy="136" r="3.5" /><circle cx="100" cy="172" r="3.5" />
        <circle cx="37" cy="136" r="3.5" /><circle cx="37" cy="64" r="3.5" />
      </g>
      <g fill="rgba(255,255,255,.22)" fontSize="6" fontFamily="monospace" textAnchor="middle">
        <text x="100" y="20">N-01</text><text x="176" y="62">N-02</text>
        <text x="176" y="146">N-03</text><text x="100" y="186">N-04</text>
        <text x="24" y="146">N-05</text><text x="24" y="62">N-06</text>
      </g>
    </svg>
  );
}