"use client";

import Link from "next/link";
import Header from "../components/Header";
import ParticleBackground from "../components/ParticleBackground";
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";


export default function SignupPage() {
    return (
        <>
            <Header />
            <ParticleBackground />

            {/* PAGE OFFSET */}
            <div className="page-offset">
                <main className="signup-page">
                    <section className="signup-shell">

                        {/* LEFT — CONTEXT */}
                        <div className="signup-left enter">
                            <span className="eyebrow">Vega Labs Access</span>
                            <h1>
                                Research Access<br />
                                Request
                            </h1>
                            <p>
                                Access to Vega Labs systems is granted to verified researchers,
                                engineers, and institutional partners. All requests are reviewed
                                for alignment with ongoing research programs.
                            </p>

                            <div className="synergy-note">
                                Operated under <strong>Synergy Subsystems</strong>
                            </div>
                        </div>

                        {/* RIGHT — FORM */}
                        <div className="signup-right enter delay">
                            <h2>Request Access</h2>
                            <p className="subtitle">
                                Submit your institutional details for review.
                            </p>

                            <form>
                                <div className="row">
                                    <div>
                                        <label>First name</label>
                                        <input type="text" placeholder="Aris" />
                                    </div>
                                    <div>
                                        <label>Last name</label>
                                        <input type="text" placeholder="Thorne" />
                                    </div>
                                </div>

                                <label>Institutional email</label>
                                <input type="email" placeholder="researcher@institute.org" />

                                <button type="submit">
                                    <RegisterLink>Submit request</RegisterLink>
                                </button>
                            </form>

                            <div className="divider">
                                <span>or</span>
                            </div>

                            <div className="alt-buttons">
                                <button>Google</button>
                                <button>Apple</button>
                            </div>

                            <Link href="/login" className="back-link">
                                ← Return to sign in
                            </Link>
                        </div>
                    </section>
                </main>
            </div>

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

        * {
          transition: color 0.5s ease, background-color 0.5s ease, border-color 0.5s ease;
        }

        /* OFFSET */
        .page-offset {
          padding-top: var(--header-height, 96px);
        }

        /* PAGE */
        .signup-page {
          min-height: calc(100vh - var(--header-height, 96px));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: var(--bg);
        }

        .signup-shell {
          width: 100%;
          max-width: 1100px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--panel);
          border: 1px solid var(--line);
        }

        /* LEFT */
        .signup-left {
          padding: 4.5rem;
          background: #050505;
          color: white;
        }

        .eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #9fb3d9;
          border-bottom: 1px solid var(--accent);
          padding-bottom: 0.5rem;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .signup-left h1 {
          font-size: 2.6rem;
          font-weight: 400;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .signup-left p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #cdd8f0;
          max-width: 420px;
        }

        .synergy-note {
          margin-top: 2.5rem;
          font-size: 0.75rem;
          color: #9fb3d9;
        }

        /* RIGHT */
        .signup-right {
          padding: 5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .signup-right h2 {
          font-size: 2rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          font-size: 0.85rem;
          color: var(--muted);
          margin-bottom: 2rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
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
        }

        input {
          padding: 0.8rem;
          border: 1px solid var(--line);
          background: transparent;
          font-size: 0.9rem;
        }

        input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }

        button[type="submit"] {
          margin-top: 1.5rem;
          padding: 0.85rem;
          background: var(--accent);
          color: white;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
        }

        button:hover {
          filter: brightness(1.05);
        }

        .divider {
          margin: 2rem 0;
          text-align: center;
          font-size: 0.7rem;
          color: var(--muted);
          position: relative;
        }

        .divider::before,
        .divider::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 40%;
          height: 1px;
          background: var(--line);
        }

        .divider::before { left: 0; }
        .divider::after { right: 0; }

        .alt-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .alt-buttons button {
          padding: 0.6rem;
          border: 1px solid var(--line);
          background: transparent;
          cursor: pointer;
        }

        .alt-buttons button:hover {
          border-color: var(--accent);
        }

        .back-link {
          margin-top: 2rem;
          font-size: 0.75rem;
          text-align: center;
          color: var(--muted);
        }

        .back-link:hover {
          color: var(--accent);
        }

        /* ANIMATION */
        .enter {
          opacity: 0;
          transform: translateY(24px);
          animation: enter 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .delay {
          animation-delay: 0.3s;
        }

        @keyframes enter {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .signup-shell {
            grid-template-columns: 1fr;
          }
          .signup-left {
            display: none;
          }
        }
      `}</style>
        </>
    );
}
