"use client";

import { useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";

export default function About() {

    /* ── scroll reveal ── */
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
            { threshold: 0.1 }
        );
        document.querySelectorAll(".r").forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    /* ── card 3D tilt ── */
    useEffect(() => {
        const cards = document.querySelectorAll<HTMLElement>(".leader-card");
        cards.forEach((card) => {
            const onMove = (e: MouseEvent) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / rect.width;
                const dy = (e.clientY - cy) / rect.height;
                card.style.transform = `perspective(600px) rotateY(${dx * 10}deg) rotateX(${-dy * 8}deg) translateY(-4px)`;
            };
            const onLeave = () => {
                card.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0px)";
            };
            card.addEventListener("mousemove", onMove);
            card.addEventListener("mouseleave", onLeave);
        });
    }, []);

    /* ── form input focus glow ── */
    useEffect(() => {
        const inputs = document.querySelectorAll<HTMLElement>("input, textarea, select");
        inputs.forEach((el) => {
            el.addEventListener("focus", () => el.classList.add("focused"));
            el.addEventListener("blur", () => el.classList.remove("focused"));
        });
    }, []);

    return (
        <>
            <Header />
            <ParticleBackground />

            <div className="page-offset">
                <main className="about-page">
                    <div className="container">

                        {/* ── HERO ── */}
                        <section className="about-hero">
                            <div className="hero-glow" />
                            <div className="hero-glow hero-glow-2" />

                            <span className="eyebrow li a1">
                                <span className="eyebrow-dot" />
                                About Vega Labs
                            </span>

                            <h1 className="hero-h1 li a2">
                                Institutional<br />
                                <span className="grad">Memory</span>
                            </h1>

                            <p className="hero-p li a3">
                                Vega Labs is a research-driven laboratory focused on applying
                                particle physics to structural and environmental analysis. Our
                                work bridges fundamental science and the built environment,
                                enabling insight without disruption.
                            </p>
                        </section>

                        {/* ── MISSION ── */}
                        <section className="about-section r">
                            <div className="section-label">
                                <span className="sec-tag">01</span>
                                <h2>Our Mission</h2>
                            </div>
                            <div className="section-body">
                                <p>
                                    Vega Labs exists to expand the limits of non-invasive structural
                                    understanding. By adapting high-energy particle detection
                                    techniques to civil and geophysical domains, we provide
                                    volumetric insight where traditional inspection methods fall
                                    short.
                                </p>
                                <p>
                                    Our mandate is research-first: develop reliable measurement
                                    methodologies, validate them rigorously, and deploy them only
                                    where they serve long-term structural safety and planning.
                                </p>
                            </div>
                        </section>

                        {/* ── LEADERSHIP ── */}
                        <section className="about-section r d1">
                            <div className="section-label">
                                <span className="sec-tag">02</span>
                                <h2>Leadership</h2>
                            </div>

                            <div className="leadership-grid">
                                {[
                                    { name: "Dr. Aris Thorne",  role: "Director of Research",     bg: "Applied Physics",               initials: "AT", delay: "" },
                                    { name: "Elena Varas",      role: "Chief Systems Architect",  bg: "Civil Engineering",             initials: "EV", delay: "d1" },
                                    { name: "Sowan Kai",        role: "Head of Sensor Arrays",    bg: "Experimental Instrumentation",  initials: "SK", delay: "d2" },
                                ].map((person, i) => (
                                    <div key={i} className={`leader-card r ${person.delay}`}>
                                        <div className="card-glow" />
                                        <div className="avatar">
                                            <span className="avatar-initials">{person.initials}</span>
                                            <div className="avatar-ring" />
                                        </div>
                                        <h3>{person.name}</h3>
                                        <span className="role">{person.role}</span>
                                        <span className="background">{person.bg}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ── CONTACT ── */}
                        <section className="about-section r d2">
                            <div className="section-label">
                                <span className="sec-tag">03</span>
                                <h2>Contact the Research Directorate</h2>
                            </div>
                            <p className="section-intro">
                                For research collaboration, institutional inquiries, or
                                technical discussions, please provide the details below. All
                                submissions are reviewed by the appropriate research group.
                            </p>

                            <form className="contact-form">
                                <div className="row">
                                    <div className="field">
                                        <label>Full name</label>
                                        <input type="text" placeholder="Name" />
                                    </div>
                                    <div className="field">
                                        <label>Organization</label>
                                        <input type="text" placeholder="Institution / Company" />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="field">
                                        <label>Email address</label>
                                        <input type="email" placeholder="name@organization.org" />
                                    </div>
                                    <div className="field">
                                        <label>Area of interest</label>
                                        <select>
                                            <option>Structural analysis</option>
                                            <option>Geophysical research</option>
                                            <option>Infrastructure monitoring</option>
                                            <option>Academic collaboration</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="field">
                                    <label>Inquiry details</label>
                                    <textarea placeholder="Describe your research context or technical inquiry..." />
                                </div>

                                <button type="submit" className="submit-btn">
                                    <span className="btn-label">Submit inquiry</span>
                                    <span className="btn-arrow">→</span>
                                    <span className="btn-shine" />
                                </button>
                            </form>
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
                    --g0:   #10b981; --g1: #34d399; --g2: #6ee7b7;
                    --ga:   rgba(16,185,129,.07); --gb: rgba(16,185,129,.14);
                    --font: 'Instrument Sans', -apple-system, sans-serif;
                    --mono: 'JetBrains Mono', monospace;
                }

                html, body { background: var(--bg) !important; color: var(--t0); }

                /* ── REVEAL ── */
                .r { opacity:0; transform:translateY(24px); transition:opacity .9s cubic-bezier(.25,1,.5,1), transform .9s cubic-bezier(.25,1,.5,1); }
                .r.in { opacity:1; transform:translateY(0); }
                .d1{transition-delay:.12s} .d2{transition-delay:.25s} .d3{transition-delay:.38s}

                /* ── LOAD-IN ── */
                .li { opacity:0; transform:translateY(18px); animation:ri .85s cubic-bezier(.25,1,.5,1) forwards; }
                @keyframes ri { to { opacity:1; transform:translateY(0); } }
                .a1{animation-delay:.12s} .a2{animation-delay:.27s} .a3{animation-delay:.42s}

                /* ── PAGE ── */
                .page-offset { padding-top: var(--header-height, 96px); position: relative; z-index:1; background: var(--bg); }
                .about-page { padding: 0 0 7rem; min-height: 100vh; background: var(--bg); }
                .container { max-width: 1100px; margin: 0 auto; padding: 0 2.5rem; }

                /* ── HERO ── */
                .about-hero {
                    padding: 5rem 0 4.5rem;
                    border-bottom: 1px solid var(--b0);
                    margin-bottom: 5rem;
                    position: relative; overflow: hidden;
                }
                .about-hero::after {
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
                    top: auto; bottom: -80px; left: auto; right: -60px;
                    width: 400px; height: 400px; animation-delay: -5s;
                    background: radial-gradient(ellipse, rgba(16,185,129,.04), transparent 65%);
                }
                @keyframes floatGlow {
                    0%   { transform:translate(0,0) scale(.9); opacity:.6; }
                    50%  { transform:translate(25px,-15px) scale(1.05); }
                    100% { transform:translate(-10px,10px) scale(1.1); opacity:1; }
                }

                /* EYEBROW */
                .eyebrow {
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

                .hero-h1 {
                    font-size: clamp(2.8rem, 5.5vw, 4.5rem); font-weight: 700;
                    letter-spacing: -.055em; line-height: 1.03;
                    color: var(--t0); margin-bottom: 1.5rem; max-width: 640px;
                }
                .grad {
                    background: linear-gradient(118deg, #fff 0%, #a7f3d0 45%, #34d399 75%, #059669 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                }
                .hero-p { font-size: 1.08rem; line-height: 1.78; color: var(--t1); max-width: 600px; }

                /* ── SECTIONS ── */
                .about-section {
                    padding: 4rem 0;
                    border-bottom: 1px solid var(--b0);
                    display: grid;
                    grid-template-columns: 220px 1fr;
                    gap: 4rem;
                    align-items: start;
                }
                .about-section:last-child { border-bottom: none; }

                .section-label { padding-top: .2rem; }
                .sec-tag {
                    font-family: var(--mono); font-size: .65rem; font-weight: 500;
                    letter-spacing: .1em; text-transform: uppercase; color: var(--g0);
                    display: block; margin-bottom: .6rem;
                }
                .about-section h2 {
                    font-size: 1.5rem; font-weight: 700; letter-spacing: -.04em;
                    color: var(--t0); line-height: 1.2;
                }

                .section-body p,
                .about-section > p { font-size: .97rem; line-height: 1.87; color: var(--t1); margin-bottom: 1.25rem; }
                .about-section > p:last-of-type { margin-bottom: 0; }
                .section-intro { font-size: .97rem; line-height: 1.87; color: var(--t1); margin-bottom: 2rem; grid-column: 2; }

                /* leadership grid spans both columns */
                .leadership-grid {
                    grid-column: 1 / -1;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.25px;
                    background: var(--b0);
                    border: 1px solid var(--b1);
                    border-radius: 18px;
                    overflow: hidden;
                    margin-top: -2rem;
                }

                /* ── LEADER CARD ── */
                .leader-card {
                    background: var(--s2);
                    padding: 2.25rem;
                    position: relative; overflow: hidden;
                    transition: background .2s, transform .25s cubic-bezier(.25,1,.5,1);
                    transform-style: preserve-3d;
                    cursor: default;
                }
                .leader-card:hover { background: var(--s3); }
                .leader-card::after {
                    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(16,185,129,.18), transparent);
                }
                .card-glow {
                    position: absolute; top: -40px; right: -40px;
                    width: 200px; height: 200px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(16,185,129,.06), transparent 65%);
                    pointer-events: none;
                    animation: floatGlow 8s ease-in-out infinite alternate;
                }

                /* AVATAR */
                .avatar {
                    width: 56px; height: 56px; border-radius: 14px;
                    background: var(--ga); border: 1px solid rgba(16,185,129,.2);
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 1.25rem; position: relative;
                    transition: background .2s, border-color .2s;
                }
                .leader-card:hover .avatar { background: var(--gb); border-color: rgba(16,185,129,.3); }
                .avatar-initials {
                    font-family: var(--mono); font-size: .78rem; font-weight: 500;
                    color: var(--g1); letter-spacing: .05em;
                }
                .avatar-ring {
                    position: absolute; inset: -4px; border-radius: 18px;
                    border: 1px solid rgba(16,185,129,.1);
                    animation: ringPulse 3s ease infinite;
                }
                @keyframes ringPulse {
                    0%,100% { opacity: .5; transform: scale(1); }
                    50%     { opacity: 1; transform: scale(1.04); }
                }

                .leader-card h3 {
                    font-size: 1.05rem; font-weight: 700; letter-spacing: -.025em;
                    color: var(--t0); margin-bottom: .3rem;
                }
                .role {
                    display: block; font-size: .82rem; font-weight: 500;
                    color: var(--g1); margin-bottom: .3rem;
                }
                .background {
                    font-family: var(--mono); font-size: .65rem; letter-spacing: .07em;
                    text-transform: uppercase; color: var(--t3);
                }

                /* ── CONTACT FORM ── */
                .contact-form {
                    display: flex; flex-direction: column; gap: 1.25rem;
                    grid-column: 2;
                }
                .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .field { display: flex; flex-direction: column; gap: .45rem; }

                label {
                    font-family: var(--mono); font-size: .62rem; font-weight: 500;
                    letter-spacing: .1em; text-transform: uppercase; color: var(--t3);
                }

                input, textarea, select {
                    padding: .8rem 1rem;
                    background: var(--s3); color: var(--t0);
                    border: 1px solid var(--b1); border-radius: 9px;
                    font-family: var(--font); font-size: .9rem;
                    outline: none;
                    transition: border-color .2s, box-shadow .2s, background .2s;
                    -webkit-appearance: none;
                }
                input::placeholder, textarea::placeholder { color: var(--t3); }
                textarea { min-height: 140px; resize: vertical; }
                select { cursor: pointer; }
                select option { background: var(--s3); color: var(--t0); }

                input:focus, textarea:focus, select:focus,
                input.focused, textarea.focused, select.focused {
                    border-color: rgba(16,185,129,.4);
                    background: var(--s2);
                    box-shadow: 0 0 0 3px rgba(16,185,129,.08), 0 0 20px -8px rgba(16,185,129,.15);
                }

                /* SUBMIT BUTTON */
                .submit-btn {
                    align-self: flex-start;
                    display: inline-flex; align-items: center; gap: .6rem;
                    padding: .8rem 1.75rem;
                    background: var(--g0); color: #fff;
                    border: none; border-radius: 9px;
                    font-family: var(--font); font-size: .9rem; font-weight: 600;
                    cursor: pointer; position: relative; overflow: hidden;
                    transition: opacity .2s, transform .2s, box-shadow .2s;
                    letter-spacing: -.01em; margin-top: .5rem;
                }
                .submit-btn:hover {
                    opacity: .9; transform: translateY(-2px);
                    box-shadow: 0 10px 28px -8px rgba(16,185,129,.45);
                }
                .submit-btn:active { transform: scale(.97); }
                .btn-arrow { transition: transform .2s; }
                .submit-btn:hover .btn-arrow { transform: translateX(4px); }
                .btn-label { position: relative; z-index: 1; }
                .btn-shine {
                    position: absolute; top: 0; left: -75%; width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,.25), transparent);
                    transform: skewX(-20deg);
                    animation: shine 3.5s ease-in-out infinite;
                }
                @keyframes shine { 0%,70%{left:-75%} 100%{left:130%} }

                /* ── RESPONSIVE ── */
                @media (max-width: 900px) {
                    .about-section { grid-template-columns: 1fr; gap: 1.5rem; }
                    .leadership-grid { grid-template-columns: 1fr; grid-column: 1; }
                    .contact-form { grid-column: 1; }
                    .section-intro { grid-column: 1; }
                    .row { grid-template-columns: 1fr; }
                }
                @media (max-width: 560px) {
                    .hero-h1 { font-size: 2.4rem; }
                    .container { padding: 0 1.5rem; }
                    .about-hero { padding: 3rem 0; }
                }
            `}</style>
        </>
    );
}