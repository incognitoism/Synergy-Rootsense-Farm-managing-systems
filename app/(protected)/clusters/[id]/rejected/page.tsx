"use client";

import { useRouter, useParams } from "next/navigation";
import LiquidGlass from "@/app/components/LiquidGlass";

export default function RejectedClusterPage() {
    const router = useRouter();
    const params = useParams();
    const clusterId = params.id as string;

    return (
        <div className="page">
            <LiquidGlass />

            <div className="content slide-up">
                <div className="status-card">

                    {/* Animated Rejected Icon */}
                    <div className="icon-wrapper">
                        <div className="pulse-ring"></div>
                        <div className="icon-circle">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                    </div>

                    <h1 className="title">Cluster Verification Failed</h1>

                    <p className="subtitle">
                        We were unable to approve this deployment configuration.
                        Please review the details below and resubmit.
                    </p>

                    {/* Rejection Details Box */}
                    <div className="reason-box">
                        <h4>Possible Reasons</h4>
                        <ul>
                            <li>Identity verification mismatch</li>
                            <li>Incomplete farm configuration data</li>
                            <li>Unsupported mesh density for selected compute tier</li>
                            <li>Billing verification failure</li>
                        </ul>
                    </div>

                    <div className="divider"></div>

                    {/* Actions */}
                    <div className="actions">
                        <button
                            className="primary-btn"
                            onClick={() =>
                                router.push(`/clusters/new/step-1?edit=${clusterId}`)
                            }
                        >
                            Edit & Resubmit
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => router.push("/support")}
                        >
                            Contact Engineering
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .content {
          width: 100%;
          max-width: 540px;
          position: relative;
          z-index: 2;
        }

        .status-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(40px);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          text-align: center;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.1),
            inset 0 0 0 1px rgba(255,255,255,0.6);
        }

        .slide-up {
          animation: slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .icon-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem auto;
        }

        .icon-circle {
          width: 64px;
          height: 64px;
          background: #ef4444;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
          position: relative;
          z-index: 2;
          box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.4);
        }

        .pulse-ring {
          position: absolute;
          inset: -10px;
          border-radius: 30px;
          background: rgba(239, 68, 68, 0.2);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }

        .subtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .reason-box {
          text-align: left;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.15);
          padding: 1.25rem;
          border-radius: 16px;
          margin-bottom: 2rem;
        }

        .reason-box h4 {
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #991b1b;
        }

        .reason-box ul {
          margin: 0;
          padding-left: 1rem;
          color: #7f1d1d;
          font-size: 0.85rem;
        }

        .reason-box li {
          margin-bottom: 0.4rem;
        }

        .divider {
          height: 1px;
          background: #e2e8f0;
          margin-bottom: 1.5rem;
        }

        .actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .primary-btn {
          padding: 1rem;
          border-radius: 12px;
          border: none;
          background: #1e293b;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .primary-btn:hover {
          background: #0f172a;
          transform: translateY(-1px);
        }

        .secondary-btn {
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid transparent;
          background: transparent;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
        }

        .secondary-btn:hover {
          background: rgba(0,0,0,0.03);
          color: #0f172a;
        }
      `}</style>
        </div>
    );
}
