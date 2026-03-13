"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
//import LiquidGlass from "@/components/LiquidGlass";

type Status = "loading" | "pending" | "approved" | "rejected";

export default function ClusterApprovalPage() {
    const router = useRouter();
    const params = useParams();
    const clusterId = params.id as string;

    const [status, setStatus] = useState<Status>("loading");
    const [clusterName, setClusterName] = useState<string>("");
    // Track if we've already redirected to prevent multiple pushes
    const [hasRedirected, setHasRedirected] = useState(false);

    // Fetch cluster status wrapped in useCallback for proper dependency tracking
    const fetchStatus = useCallback(async () => {
        try {
            const res = await fetch(`/api/clusters/status?id=${clusterId}`);

            if (!res.ok) {
                // Handle non-200 responses gracefully
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            setClusterName(data.farm_name || "Your Cluster");

            if (data.status === "approved") {
                setStatus("approved");

                // Only set the timeout if we haven't already started the redirect process
                if (!hasRedirected) {
                    setHasRedirected(true);
                    setTimeout(() => {
                        router.push(`/clusters/${clusterId}/dashboard`);
                    }, 2500); // Slightly longer to let the success animation play
                }
            } else if (data.status === "rejected") {
                setStatus("rejected");
            } else {
                // Ensure we don't accidentally fall back to loading if it's pending
                setStatus("pending");
            }
        } catch (err) {
            console.error("Failed to fetch cluster status:", err);
            // In a real app, you might want a retry state or an error toast here
        }
    }, [clusterId, router, hasRedirected]); // Include dependencies

    useEffect(() => {
        // Initial fetch
        fetchStatus();

        // Only set up the polling interval if we are NOT approved or rejected
        // No need to keep pinging the server if we already have a final state
        let interval: NodeJS.Timeout;
        if (status === "loading" || status === "pending") {
            interval = setInterval(fetchStatus, 8000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [fetchStatus, status]); // Re-evaluate when status changes

    return (
        <div className="page">
            {/* Added ambient glows to match the design language of previous steps */}
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>


            <div className="card">
                {status === "loading" && (
                    <div className="fade-in">
                        <div className="spinner"></div>
                        <h2 className="loading-title">Checking Deployment Status</h2>
                        <p className="loading-text">Establishing secure connection to provisioning matrix...</p>
                    </div>
                )}

                {status === "pending" && (
                    <div className="fade-in">
                        <div className="pulse-container">
                            <div className="pulse-ring"></div>
                            <div className="pulse-ring delay"></div> {/* Added second ring for deeper effect */}
                            <div className="shield">
                                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    <path className="scanning-line" d="M8 12h8"></path> {/* Added scanning animation */}
                                </svg>
                            </div>
                        </div>

                        <h1>{clusterName}</h1>
                        <p className="subtitle">Verification in Progress</p>

                        <p className="description">
                            Your infrastructure parameters and node topology are currently
                            under engineering validation. Once approved, your cluster will be provisioned automatically.
                        </p>

                        <div className="status-badge pending">
                            <span className="dot pulse"></span>
                            Pending Approval
                        </div>

                        <div className="eta">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'text-bottom' }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            Expected Review Time: <strong>24 – 48 Business Hours</strong>
                        </div>
                    </div>
                )}

                {status === "approved" && (
                    <div className="fade-in success-state">
                        <div className="success-circle scale-in">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h1 className="text-emerald">Cluster Provisioned</h1>
                        <p className="description">
                            Engineering validation complete. Generating dashboard and establishing initial node telemetry...
                        </p>

                        {/* Fake loading bar for smooth transition UX */}
                        <div className="redirect-loader">
                            <div className="redirect-bar"></div>
                        </div>
                    </div>
                )}

                {status === "rejected" && (
                    <div className="fade-in error-state">
                        <div className="rejected-circle shake">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </div>
                        <h1 className="text-rose">Approval Rejected</h1>
                        <p className="description">
                            Our engineering team identified inconsistencies in your deployment topology. Please review your submission parameters.
                        </p>

                        <button
                            className="primary-btn mt-6"
                            onClick={() =>
                                router.push(`/clusters/new/step-1?id=${clusterId}`)
                            }
                        >
                            Edit & Resubmit Configuration
                            <span className="arrow ml-2">→</span>
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
          padding: 2rem 1rem;
        }

        /* Ambient Glows to match Step 1-3 */
        .ambient-glow {
          position: absolute; border-radius: 50%; filter: blur(140px);
          opacity: 0.2; z-index: 0; pointer-events: none;
        }
        .glow-1 {
          width: 600px; height: 600px; background: #4f46e5;
          top: 10%; left: 10%; animation: breathe 8s ease-in-out infinite alternate;
        }
        .glow-2 {
          width: 500px; height: 500px; background: #0ea5e9;
          bottom: 10%; right: 10%; animation: breathe 10s ease-in-out infinite alternate-reverse;
        }
        @keyframes breathe { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }

        .card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 540px;
          padding: 3.5rem 2.5rem;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          box-shadow:
            0 40px 80px -20px rgba(0, 0, 0, 0.12),
            inset 0 0 0 1px rgba(255, 255, 255, 0.6);
          text-align: center;
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .fade-in { animation: fadeIn 0.4s ease forwards; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 1rem 0 0.3rem 0;
          letter-spacing: -0.03em;
        }

        .text-emerald { color: #059669; }
        .text-rose { color: #e11d48; }

        .subtitle {
          font-size: 1.05rem;
          font-weight: 600;
          color: #4f46e5;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .description {
          font-size: 1rem;
          color: #475569;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .status-badge {
          padding: 0.6rem 1.4rem;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.85rem;
          margin: 1.5rem auto 1rem auto;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: 0.02em;
        }

        .pending {
          background: #fffbeb;
          color: #d97706;
          border: 1px solid #fde68a;
        }
        
        .dot {
          width: 8px; height: 8px; border-radius: 50%; background: currentColor;
        }
        .dot.pulse { animation: dotPulse 1.5s infinite; }
        @keyframes dotPulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

        .eta {
          font-size: 0.85rem;
          color: #64748b;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          background: rgba(241, 245, 249, 0.7);
          border-radius: 12px;
        }

        .primary-btn {
          margin-top: 1.5rem;
          padding: 1.1rem 2rem;
          border-radius: 16px;
          border: none;
          background: #0f172a;
          color: white;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.2);
        }

        .primary-btn:hover {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.3);
        }
        .primary-btn:active { transform: translateY(0); }
        .arrow { transition: transform 0.2s; display: inline-block; margin-left: 8px;}
        .primary-btn:hover .arrow { transform: translateX(4px); }

        /* --- Animations & Icons --- */
        .pulse-container {
          position: relative; width: 84px; height: 84px;
          margin: 0 auto 1.5rem auto; display: flex; align-items: center; justify-content: center;
        }

        .shield {
          width: 64px; height: 64px; background: #4f46e5; border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 2; box-shadow: 0 15px 30px -10px rgba(79, 70, 229, 0.6);
        }
        
        .scanning-line { animation: scan 2s ease-in-out infinite alternate; }
        @keyframes scan { 0% { transform: translateY(-4px); } 100% { transform: translateY(6px); } }

        .pulse-ring {
          position: absolute; inset: -10px; border-radius: 30px;
          background: rgba(79, 70, 229, 0.2); animation: ringPulse 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
        }
        .pulse-ring.delay { animation-delay: 1.25s; }

        @keyframes ringPulse {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .success-circle, .rejected-circle {
          width: 80px; height: 80px; border-radius: 50%; display: flex;
          align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;
        }

        .success-circle {
          background: #10b981; color: white; box-shadow: 0 15px 30px -10px rgba(16, 185, 129, 0.5);
        }
        
        .scale-in { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes scaleIn { 0% { transform: scale(0); } 100% { transform: scale(1); } }

        .rejected-circle {
          background: #e11d48; color: white; box-shadow: 0 15px 30px -10px rgba(225, 29, 72, 0.5);
        }
        
        .shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        /* Loading UI */
        .spinner {
          width: 48px; height: 48px; border: 4px solid #e2e8f0;
          border-top: 4px solid #4f46e5; border-radius: 50%;
          animation: spin 1s linear infinite; margin: 0 auto 1.5rem auto;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .loading-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
        .loading-text { font-size: 0.95rem; color: #64748b; }
        
        /* Success Redirect UI */
        .redirect-loader {
           width: 200px; height: 6px; background: #e2e8f0; border-radius: 3px;
           margin: 2rem auto 0 auto; overflow: hidden; position: relative;
        }
        .redirect-bar {
           position: absolute; top: 0; left: 0; height: 100%; background: #10b981;
           animation: fillBar 2.5s ease forwards;
        }
        @keyframes fillBar { 0% { width: 0%; } 100% { width: 100%; } }

      `}</style>
        </div>
    );
}