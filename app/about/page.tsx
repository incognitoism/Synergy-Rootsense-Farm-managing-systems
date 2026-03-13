"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";

export default function About() {
    return (
        <>
            <Header />
            <ParticleBackground />

            {/* PAGE OFFSET */}
            <div className="page-offset">
                <main className="about-page">
                    <div className="container">

                        {/* ================= HERO ================= */}
                        <section className="about-hero enter">
                            <span className="eyebrow">About Vega Labs</span>
                            <h1>Institutional Memory</h1>
                            <p>
                                Vega Labs is a research-driven laboratory focused on applying
                                particle physics to structural and environmental analysis. Our
                                work bridges fundamental science and the built environment,
                                enabling insight without disruption.
                            </p>
                        </section>

                        {/* ================= MISSION ================= */}
                        <section className="about-section reveal">
                            <h2>Our Mission</h2>
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
                        </section>

                        {/* ================= LEADERSHIP ================= */}
                        <section className="about-section reveal">
                            <h2>Leadership</h2>

                            <div className="leadership-grid">
                                {[
                                    { name: "Dr. Aris Thorne", role: "Director of Research", bg: "Applied Physics" },
                                    { name: "Elena Varas", role: "Chief Systems Architect", bg: "Civil Engineering" },
                                    { name: "Sowan Kai", role: "Head of Sensor Arrays", bg: "Experimental Instrumentation" }
                                ].map((person, i) => (
                                    <div key={i} className="leader-card">
                                        <div className="avatar">Photo</div>
                                        <h3>{person.name}</h3>
                                        <span className="role">{person.role}</span>
                                        <span className="background">{person.bg}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ================= CONTACT ================= */}
                        <section className="about-section reveal">
                            <h2>Contact the Research Directorate</h2>
                            <p className="section-intro">
                                For research collaboration, institutional inquiries, or
                                technical discussions, please provide the details below. All
                                submissions are reviewed by the appropriate research group.
                            </p>

                            <form className="contact-form">
                                <div className="row">
                                    <div>
                                        <label>Full name</label>
                                        <input type="text" placeholder="Name" />
                                    </div>
                                    <div>
                                        <label>Organization</label>
                                        <input type="text" placeholder="Institution / Company" />
                                    </div>
                                </div>

                                <div className="row">
                                    <div>
                                        <label>Email address</label>
                                        <input type="email" placeholder="name@organization.org" />
                                    </div>
                                    <div>
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

                                <div>
                                    <label>Inquiry details</label>
                                    <textarea
                                        placeholder="Describe your research context or technical inquiry..."
                                    />
                                </div>

                                <button type="submit">
                                    Submit inquiry
                                </button>
                            </form>
                        </section>
                    </div>
                </main>
            </div>

            <Footer />

            {/* ================= EMBEDDED CSS ================= */}
            <style jsx>{`
        :root {
          --bg: #e9eef4;
          --panel: #ffffff;
          --text: #020617;
          --muted: #334155;
          --line: #b6c2d1;
          --accent: #0b5ed7;
          --accent-soft: rgba(11, 94, 215, 0.18);
        }

        .page-offset {
          padding-top: var(--header-height, 96px);
        }

        .about-page {
          background: var(--bg);
          padding: 5rem 0 7rem;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* HERO */
        .about-hero {
          max-width: 760px;
          margin-bottom: 5rem;
        }

        .eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--muted);
          border-bottom: 1px solid var(--accent);
          padding-bottom: 0.5rem;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .about-hero h1 {
          font-size: 3rem;
          font-weight: 300;
          margin-bottom: 1.5rem;
        }

        .about-hero p {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--muted);
        }

        /* SECTIONS */
        .about-section {
          margin-bottom: 5rem;
        }

        .about-section h2 {
          font-size: 1.8rem;
          font-weight: 400;
          margin-bottom: 1.5rem;
        }

        .about-section p {
          max-width: 760px;
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--muted);
          margin-bottom: 1.2rem;
        }

        .section-intro {
          margin-bottom: 2rem;
        }

        /* LEADERSHIP */
        .leadership-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
        }

        .leader-card {
          border: 1px solid var(--line);
          padding: 2rem;
          background: var(--panel);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .leader-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .avatar {
          width: 64px;
          height: 64px;
          border: 1px solid var(--line);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: var(--muted);
          margin-bottom: 1rem;
        }

        .leader-card h3 {
          font-size: 1.05rem;
          margin-bottom: 0.3rem;
        }

        .role {
          display: block;
          font-size: 0.85rem;
          color: var(--accent);
          margin-bottom: 0.3rem;
        }

        .background {
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
        }

        /* FORM */
        .contact-form {
          max-width: 760px;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label {
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.3rem;
          display: block;
        }

        input, textarea, select {
          padding: 0.8rem;
          border: 1px solid var(--line);
          background: transparent;
          font-size: 0.9rem;
        }

        textarea {
          min-height: 140px;
          resize: vertical;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }

        button {
          margin-top: 1.5rem;
          align-self: flex-start;
          padding: 0.85rem 2rem;
          background: var(--accent);
          color: white;
          border: none;
          cursor: pointer;
        }

        button:hover {
          filter: brightness(1.05);
        }

        /* ANIMATIONS */
        .enter {
          opacity: 0;
          transform: translateY(24px);
          animation: enter 1s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        .reveal {
          animation: enter 1s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        @keyframes enter {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </>
    );
}
