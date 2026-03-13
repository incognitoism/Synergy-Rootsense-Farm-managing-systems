"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Status = "pending" | "approved" | "rejected" | "loading";

export default function ApprovalStatusPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clusterId = searchParams.get("id");

    const [status, setStatus] = useState<Status>("loading");
    const redirectTriggered = useRef(false);

    const fetchStatus = async () => {
        if (!clusterId) return;

        try {
            const res = await fetch(`/api/clusters/status?id=${clusterId}`);
            const data = await res.json();

            if (data.status === "approved") {
                setStatus("approved");

                if (!redirectTriggered.current) {
                    redirectTriggered.current = true;

                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 3500);
                }

            } else if (data.status === "rejected") {
                setStatus("rejected");
            } else {
                setStatus("pending");
            }

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!clusterId) return;

        fetchStatus();
        const interval = setInterval(fetchStatus, 8000);

        return () => clearInterval(interval);
    }, [clusterId]);

    return (
        <div className="page">
            <div className="glow glow-1" />
            <div className="glow glow-2" />

            <div className="card">

                {status === "loading" && (
                    <>
                        <Spinner />
                        <h2>Checking Approval Status...</h2>
                    </>
                )}

                {status === "pending" && (
                    <>
                        <StatusIcon type="pending" />
                        <h1>Verification in Progress</h1>
                        <p>Your deployment is under engineering review.</p>
                        <Badge type="pending" text="Pending Approval" />
                        <p className="small">Estimated review time: 24–48 business hours.</p>
                    </>
                )}

                {status === "approved" && (
                    <>
                        <StatusIcon type="approved" />
                        <h1>Cluster Approved</h1>
                        <p>Your infrastructure has been validated successfully.</p>
                        <Badge type="approved" text="Approved" />
                        <p className="small">Redirecting to dashboard...</p>
                    </>
                )}

                {status === "rejected" && (
                    <>
                        <StatusIcon type="rejected" />
                        <h1>Verification Failed</h1>
                        <p>Please update your configuration and resubmit.</p>
                        <Badge type="rejected" text="Rejected" />

                        <button
                            className="primary-btn"
                            onClick={() => router.push("/clusters/new/step-1")}
                        >
                            Edit & Resubmit
                        </button>
                    </>
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
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(140px);
          opacity: 0.25;
          animation: breathe 8s ease-in-out infinite alternate;
        }

        .glow-1 {
          background: #4f46e5;
          top: 20%;
          left: 20%;
        }

        .glow-2 {
          background: #0ea5e9;
          bottom: 20%;
          right: 20%;
        }

        @keyframes breathe {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }

        .card {
          width: 460px;
          padding: 3rem;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(40px);
          border-radius: 28px;
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.1);
          text-align: center;
          position: relative;
          z-index: 2;
          animation: fadeIn 0.6s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h1 {
          font-size: 1.9rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          color: #0f172a;
        }

        h2 {
          font-weight: 600;
          color: #334155;
        }

        p {
          color: #64748b;
          margin-bottom: 1rem;
        }

        .small {
          font-size: 0.85rem;
          margin-top: 1rem;
        }

        .primary-btn {
          margin-top: 1.5rem;
          padding: 0.9rem 1.6rem;
          border-radius: 14px;
          border: none;
          background: #1e293b;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .primary-btn:hover {
          background: #0f172a;
          transform: translateY(-2px);
        }
      `}</style>
        </div>
    );
}

/* ---------- Sub Components ---------- */

function Spinner() {
    return (
        <div style={{ marginBottom: "1.5rem" }}>
            <div className="spinner" />
            <style jsx>{`
        .spinner {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #4f46e5;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

function Badge({ type, text }: { type: string; text: string }) {
    const colors: any = {
        pending: "#f59e0b",
        approved: "#10b981",
        rejected: "#ef4444"
    };

    return (
        <div
            style={{
                margin: "1.5rem auto",
                padding: "0.6rem 1.3rem",
                borderRadius: "999px",
                background: `${colors[type]}20`,
                color: colors[type],
                fontWeight: 600,
                width: "fit-content"
            }}
        >
            {text}
        </div>
    );
}

function StatusIcon({ type }: { type: string }) {
    const colors: any = {
        pending: "#f59e0b",
        approved: "#10b981",
        rejected: "#ef4444"
    };

    return (
        <div
            style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: `${colors[type]}20`,
                color: colors[type],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                fontSize: 28,
                fontWeight: 700
            }}
        >
            {type === "approved" ? "✓" : type === "rejected" ? "✕" : "⏳"}
        </div>
    );
}
