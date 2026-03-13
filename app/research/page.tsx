
"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";

export default function Research() {
    return (
        <>
            <Header />

            {/* Background visuals stay global */}
            <ParticleBackground />

            {/* PAGE OFFSET — RESPECTS HEADER HEIGHT */}
            <div className="page-offset">
                <main className="research-page">
                    <div className="container">

                        {/* ================= INTRO ================= */}
                        <section className="research-hero">
                            <span className="research-eyebrow">
                                Research Overview
                            </span>

                            <h1 className="research-title">
                                The Physics of Structural Insight
                            </h1>

                            <p className="research-intro">
                                Vega Labs applies fundamental particle physics to the analysis of
                                large-scale structures and geological formations. Our research
                                emphasizes non-invasive techniques for understanding internal
                                density variation where conventional inspection methods are
                                insufficient.
                            </p>
                        </section>

                        {/* ================= CONTENT GRID ================= */}
                        <section className="research-grid">

                            {/* -------- MAIN CONTENT -------- */}
                            <div className="research-main">
                                <h2>Volumetric Density Analysis</h2>

                                <p>
                                    Traditional structural assessment techniques often depend on
                                    surface observation, localized sampling, or indirect inference.
                                    Vega Labs research explores volumetric approaches that infer
                                    internal material distribution through naturally occurring
                                    particle flux.
                                </p>

                                <p>
                                    By observing how particles traverse matter from multiple angles,
                                    relative density differences can be estimated throughout an
                                    entire structure. These observations are accumulated over time
                                    and reconstructed into three-dimensional density models.
                                </p>

                                <div className="research-figure">
                                    <span>Conceptual Density Reconstruction Model</span>
                                </div>

                                <h3>Applications in the Built Environment</h3>

                                <p>
                                    Current research efforts focus on civil infrastructure,
                                    subsurface mapping, and long-term structural monitoring.
                                    Emphasis is placed on early identification of internal
                                    anomalies and material inconsistencies without invasive access
                                    or operational disruption.
                                </p>
                            </div>

                            {/* -------- SIDEBAR -------- */}
                            <aside className="research-sidebar">
                                <h4>Selected Publications</h4>

                                <ul>
                                    <li>
                                        <strong>Journal of Applied Physics — 2025</strong>
                                        <span>
                                            Particle-based methods for non-invasive density estimation
                                            in large structures
                                        </span>
                                    </li>

                                    <li>
                                        <strong>
                                            Structural Health Monitoring Review — 2024
                                        </strong>
                                        <span>
                                            Advances in volumetric analysis for infrastructure
                                            assessment
                                        </span>
                                    </li>
                                </ul>
                            </aside>
                        </section>
                    </div>
                </main>
            </div>

            <Footer />

            {/* ================= PAGE-LOCAL CSS ================= */}
            <style jsx>{`
        /* ---------- HEADER OFFSET ---------- */
        .page-offset {
          padding-top: var(--header-height, 96px);
          position: relative;
          z-index: 1;
        }

        /* ---------- PAGE ---------- */
        .research-page {
          padding: 5rem 0 6rem;
        }

        /* ---------- HERO ---------- */
        .research-hero {
          max-width: 760px;
          margin-bottom: 4rem;
        }

        .research-eyebrow {
          display: inline-block;
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--color-text-tertiary);
          border-bottom: 1px solid var(--color-accent);
          padding-bottom: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .research-title {
          font-size: 3rem;
          font-weight: 300;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
        }

        .research-intro {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--color-text-secondary);
        }

        /* ---------- GRID ---------- */
        .research-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 4rem;
        }

        /* ---------- MAIN ---------- */
        .research-main h2 {
          font-size: 1.6rem;
          font-weight: 400;
          margin-bottom: 1rem;
        }

        .research-main h3 {
          font-size: 1.3rem;
          font-weight: 400;
          margin: 2.5rem 0 1rem;
        }

        .research-main p {
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--color-text-secondary);
          margin-bottom: 1.4rem;
        }

        .research-figure {
          height: 260px;
          margin: 2.5rem 0 3rem;
          border: 1px solid var(--color-line);
          background: rgba(15, 94, 215, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .research-figure span {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-text-tertiary);
        }

        /* ---------- SIDEBAR ---------- */
        .research-sidebar {
          border-left: 1px solid var(--color-line);
          padding-left: 2rem;
        }

        .research-sidebar h4 {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-text-tertiary);
          margin-bottom: 1.5rem;
        }

        .research-sidebar ul {
          list-style: none;
          padding: 0;
          display: grid;
          gap: 1.5rem;
        }

        .research-sidebar li strong {
          display: block;
          font-size: 0.9rem;
          color: var(--color-accent);
          margin-bottom: 0.25rem;
        }

        .research-sidebar li span {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        /* ---------- RESPONSIVE ---------- */
        @media (max-width: 900px) {
          .research-grid {
            grid-template-columns: 1fr;
          }

          .research-sidebar {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--color-line);
            padding-top: 2rem;
          }
        }
      `}</style>
        </>
    );
}
