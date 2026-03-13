'use client';

import Header from '../components/Header';
import {
    RegisterLink,
    LoginLink
} from "@kinde-oss/kinde-auth-nextjs/components";

export default function LoginPage() {
    return (
        <>
            <Header />

            <main className="auth-page">
                {/* Soft ambient background glow */}
                <div className="page-ambient-glow"></div>

                <div className="auth-container">

                    {/* LEFT PANEL: The Immersive Context */}
                    <div className="auth-context">
                        {/* Single, sophisticated breathing emerald glow */}
                        <div className="emerald-core"></div>
                        <div className="glass-diffuser"></div>

                        <div className="context-inner">
                            <span className="system-label fade-in delay-1">
                                Node Network · Secure Uplink
                            </span>

                            <h1 className="fade-in delay-2">
                                Subsurface <br />
                                Telemetry.
                            </h1>

                            <p className="fade-in delay-3">
                                Access the volumetric inversion dashboard. Monitor soil
                                structure, density shifts, and moisture gradients across
                                your active clusters in real time.
                            </p>

                            <div className="meta fade-in delay-4">
                                Vega Labs · Core Architecture
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Stark, Minimalist Form */}
                    <div className="auth-form">
                        <div className="form-box fade-in delay-2">
                            <h2>Platform Access</h2>
                            <p className="subtitle">
                                Authenticate to interface with your cluster.
                            </p>

                            <div className="button-stack">
                                {/* Primary Login */}
                                <LoginLink className="primary-btn">
                                    Sign In
                                    <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </LoginLink>

                                {/* Synergy SSO */}
                                <LoginLink
                                    authUrlParams={{
                                        connection_id: "synergy-account"
                                    }}
                                    className="synergy-btn"
                                >
                                    <div className="synergy-icon">
                                        {/* Custom clean geometric icon */}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                            <polyline points="2 17 12 22 22 17"></polyline>
                                            <polyline points="2 12 12 17 22 12"></polyline>
                                        </svg>
                                    </div>
                                    Continue with Synergy
                                </LoginLink>

                                <div className="divider">
                                    <span>or</span>
                                </div>

                                {/* Register */}
                                <RegisterLink className="secondary-btn">
                                    Provision New Account
                                </RegisterLink>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fbfbfd; /* Apple off-white */
          padding: 6rem 2rem;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
          overflow: hidden;
        }

        /* ================= SUBTLE PAGE GLOW ================= */
        .page-ambient-glow {
          position: absolute;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.03) 0%, transparent 70%);
          top: -20%;
          right: -10%;
          border-radius: 50%;
          pointer-events: none;
        }

        /* ================= AUTH CONTAINER ================= */
        .auth-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1080px;
          min-height: 600px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          
          /* Pristine white card */
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 
            0 40px 80px -20px rgba(0, 0, 0, 0.08),
            0 10px 30px -5px rgba(0, 0, 0, 0.04),
            0 0 0 1px rgba(0, 0, 0, 0.02);
            
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px) scale(0.98);
          animation: scaleUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes scaleUpFade {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ================= LEFT PANEL (THE "DARK ROOM") ================= */
        .auth-context {
          padding: 5rem 4rem;
          position: relative;
          display: flex;
          align-items: center;
          background: #0a0a0c; /* Deep, rich black/slate */
          overflow: hidden;
        }

        /* Single, massive breathing emerald core */
        .emerald-core {
          position: absolute;
          width: 600px;
          height: 600px;
          background: #10b981;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          filter: blur(120px);
          opacity: 0.15;
          animation: slowBreathe 8s ease-in-out infinite alternate;
        }

        @keyframes slowBreathe {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.1; }
          100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.25; }
        }

        /* Diffuser to blend the light perfectly */
        .glass-diffuser {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top left, rgba(255,255,255,0.03) 0%, transparent 50%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 1;
        }

        .context-inner {
          position: relative;
          z-index: 2;
          max-width: 420px;
        }

        /* Staggered Apple-style text reveal */
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.4s; }
        .delay-4 { animation-delay: 0.5s; }

        @keyframes slideUpFade {
          to { opacity: 1; transform: translateY(0); }
        }

        .system-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 2rem;
          display: inline-block;
          color: #10b981; /* Emerald accent */
        }

        .auth-context h1 {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 1.5rem;
          color: #ffffff;
        }

        .auth-context p {
          font-size: 1.05rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
        }

        .meta {
          margin-top: 4rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* ================= RIGHT PANEL (THE FORM) ================= */
        .auth-form {
          padding: 5rem 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
        }

        .form-box {
          width: 100%;
          max-width: 360px;
        }

        .form-box h2 {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          margin-bottom: 0.5rem;
          color: #1d1d1f; /* Apple dark charcoal */
        }

        .subtitle {
          font-size: 1rem;
          color: #86868b;
          margin-bottom: 3rem;
          font-weight: 400;
        }

        .button-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* --- PRIMARY BUTTON --- */
        .primary-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #1d1d1f; 
          color: #ffffff;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .primary-btn:hover {
          background: #333336;
          transform: scale(1.02);
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15);
        }

        .arrow { transition: transform 0.3s ease; }
        .primary-btn:hover .arrow { transform: translateX(4px); }

        /* --- SYNERGY BUTTON --- */
        .synergy-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #ffffff;
          border: 1px solid #d2d2d7;
          color: #1d1d1f;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .synergy-icon {
          color: #10b981; /* Changed to Emerald */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .synergy-btn:hover {
          background: #fbfbfd;
          border-color: #86868b;
        }

        /* --- DIVIDER --- */
        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1rem 0;
        }

        .divider::before, .divider::after {
          content: ''; flex: 1; border-bottom: 1px solid #e5e5ea;
        }

        .divider span {
          padding: 0 1rem; color: #86868b; font-size: 0.85rem; font-weight: 500;
        }

        /* --- SECONDARY BUTTON --- */
        .secondary-btn {
          display: block;
          text-align: center;
          padding: 1rem;
          background: transparent;
          border: none;
          color: #10b981; /* Changed to Emerald */
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 12px;
          transition: background 0.2s ease;
        }

        .secondary-btn:hover { background: rgba(16, 185, 129, 0.05); }

        /* ================= RESPONSIVE ================= */
        @media (max-width: 900px) {
          .auth-container {
            grid-template-columns: 1fr;
            max-width: 440px;
            min-height: auto;
          }
          .auth-context { display: none; }
          .auth-form { padding: 4rem 2rem; }
        }
      `}</style>
        </>
    );
}