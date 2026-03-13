"use client";

import {
    MouseEvent as ReactMouseEvent,
    useRef,
    useEffect,
    useState,
} from "react";
import Header from "../../components/LoginHeader";
import { useRouter } from "next/navigation";

/* ── Types ─────────────────────────────────────────────────── */
type Cluster = {
    id: string;
    farm_name: string;
    crop_type: string;
    approval_status: string;
    connectivity_type: string;
    created_at: string;
};

/* ── Helpers ───────────────────────────────────────────────── */
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> =
{
    optimal: { label: "Healthy", color: "#1a8c3f", bg: "#e8f5ec" },
    warning: { label: "Attention", color: "#b45309", bg: "#fef3c7" },
    pending: { label: "Pending", color: "#6b7280", bg: "#f3f4f6" },
    approved: { label: "Approved", color: "#1a8c3f", bg: "#e8f5ec" },
};

function relativeTime(dateStr: string) {
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = now - then;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

/* ── Component ─────────────────────────────────────────────── */
export default function Page() {
    const pageRef = useRef<HTMLElement>(null);
    const router = useRouter();

    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClusters = async () => {
            try {
                const res = await fetch("/api/clusters/list");
                const data = await res.json();
                if (res.ok) setClusters(data.clusters || []);
                else console.error(data.error);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchClusters();
    }, []);

    const handleMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
        if (!pageRef.current) return;
        const rect = pageRef.current.getBoundingClientRect();
        pageRef.current.style.setProperty(
            "--mx",
            `${e.clientX - rect.left}px`
        );
        pageRef.current.style.setProperty(
            "--my",
            `${e.clientY - rect.top}px`
        );
    };

    const statusInfo = (status: string) =>
        STATUS_MAP[status?.toLowerCase()] ?? STATUS_MAP.pending;

    return (
        <div className="shell">
            <Header />

            <main
                className="page"
                ref={pageRef}
                onMouseMove={handleMouseMove}
            >
                {/* ── Top Bar ────────────────────────────────────── */}
                <section className="topbar">
                    <div className="topbar-left">
                        <h1 className="page-title">Clusters</h1>
                        <p className="page-sub">
                            Manage and provision your research environments.
                        </p>
                    </div>

                    <div className="topbar-right">
                        <div className="pill">
                            <span className="pulse" />
                            <span className="pill-text">
                                {clusters.length} active
                            </span>
                        </div>

                        <button
                            className="btn-primary"
                            onClick={() => router.push("/clusters/new/step-1")}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            New Cluster
                        </button>
                    </div>
                </section>

                {/* ── Empty / Loading States ─────────────────────── */}
                {loading && (
                    <div className="state-msg">
                        <div className="loader" />
                        <p>Loading clusters…</p>
                    </div>
                )}

                {!loading && clusters.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="6" width="20" height="12" rx="2" />
                                <line x1="6" y1="10" x2="6" y2="14" />
                                <line x1="10" y1="10" x2="10" y2="14" />
                                <line x1="14" y1="10" x2="14" y2="14" />
                            </svg>
                        </div>
                        <h2>No clusters yet</h2>
                        <p>Deploy your first research cluster to get started.</p>
                        <button
                            className="btn-primary"
                            onClick={() => router.push("/clusters/new/step-1")}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Deploy Cluster
                        </button>
                    </div>
                )}

                {/* ── Cluster Grid ───────────────────────────────── */}
                {!loading && clusters.length > 0 && (
                    <section className="grid">
                        {clusters.map((c, i) => {
                            const s = statusInfo(c.approval_status);
                            return (
                                <article
                                    key={c.id}
                                    className="card"
                                    style={{ animationDelay: `${i * 60}ms` }}
                                    onClick={() => router.push(`/clusters/${c.id}`)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    {/* Accent stripe */}
                                    <div
                                        className="card-stripe"
                                        style={{ background: s.color }}
                                    />

                                    <div className="card-body">
                                        <div className="card-row-top">
                                            <span
                                                className="badge"
                                                style={{ color: s.color, background: s.bg }}
                                            >
                                                {s.label}
                                            </span>
                                            <span className="meta-time">
                                                {c.created_at ? relativeTime(c.created_at) : "—"}
                                            </span>
                                        </div>

                                        <h3 className="card-name">
                                            {c.farm_name || "Untitled Cluster"}
                                        </h3>

                                        <div className="card-meta">
                                            <div className="meta-item">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                </svg>
                                                <span>{c.crop_type || "—"}</span>
                                            </div>
                                            <div className="meta-item">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                                                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                                                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                                                    <line x1="12" y1="20" x2="12.01" y2="20" />
                                                </svg>
                                                <span>{c.connectivity_type || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-foot">
                                        <button
                                            className="btn-ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/clusters/${c.id}/settings`);
                                            }}
                                        >
                                            Settings
                                        </button>
                                        <span className="card-arrow">→</span>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </main>

            {/* ── Styles ───────────────────────────────────────── */}
            <style jsx>{`
        /* ╔══════════════════════════════════════╗
           ║  DUAL-COLOR PALETTE                  ║
           ║  Ink (#111)  ·  Stone (#f5f5f3)      ║
           ╚══════════════════════════════════════╝ */

        :root {
          --ink: #111110;
          --ink-50: rgba(17, 17, 16, 0.5);
          --ink-30: rgba(17, 17, 16, 0.3);
          --ink-12: rgba(17, 17, 16, 0.12);
          --ink-06: rgba(17, 17, 16, 0.06);
          --ink-03: rgba(17, 17, 16, 0.03);
          --stone: #f5f5f3;
          --card: #ffffff;
          --radius: 14px;
          --font: "Instrument Sans", "SF Pro Display", -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        @import url("https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap");

        /* ── Shell ────────────────────────────── */
        .shell {
          font-family: var(--font);
          -webkit-font-smoothing: antialiased;
          background: var(--stone);
          color: var(--ink);
          min-height: 100vh;
        }

        /* ── Page ─────────────────────────────── */
        .page {
          max-width: 1120px;
          margin: 0 auto;
          padding: 7rem 2rem 4rem;
        }

        /* ── Top Bar ──────────────────────────── */
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--ink-06);
          animation: fadeUp 0.5s ease both;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 1.1;
        }

        .page-sub {
          margin-top: 0.35rem;
          font-size: 0.925rem;
          color: var(--ink-50);
          font-weight: 400;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }

        /* ── Pill ─────────────────────────────── */
        .pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.85rem;
          background: var(--card);
          border: 1px solid var(--ink-06);
          border-radius: 100px;
        }

        .pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          animation: pulse 2s ease infinite;
        }

        .pill-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--ink-50);
          letter-spacing: 0.01em;
        }

        /* ── Primary Button ───────────────────── */
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1.15rem;
          background: var(--ink);
          color: var(--stone);
          border: none;
          border-radius: 10px;
          font-family: var(--font);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .btn-primary:hover {
          opacity: 0.82;
          transform: translateY(-1px);
        }

        .btn-primary:active {
          transform: scale(0.97);
        }

        /* ── Grid ─────────────────────────────── */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
        }

        /* ── Card ─────────────────────────────── */
        .card {
          position: relative;
          background: var(--card);
          border: 1px solid var(--ink-06);
          border-radius: var(--radius);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          overflow: hidden;
          transition: box-shadow 0.25s ease, transform 0.25s ease,
            border-color 0.25s ease;
          animation: fadeUp 0.45s ease both;
        }

        .card:hover {
          border-color: var(--ink-12);
          box-shadow: 0 8px 30px -8px rgba(17, 17, 16, 0.09),
            0 2px 8px -2px rgba(17, 17, 16, 0.04);
          transform: translateY(-2px);
        }

        .card:active {
          transform: translateY(0);
        }

        /* Accent stripe */
        .card-stripe {
          height: 3px;
          width: 100%;
          flex-shrink: 0;
        }

        /* Card body */
        .card-body {
          padding: 1.25rem 1.35rem 0.75rem;
          flex: 1;
        }

        .card-row-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .badge {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
        }

        .meta-time {
          font-size: 0.75rem;
          color: var(--ink-30);
          font-weight: 500;
        }

        .card-name {
          font-size: 1.05rem;
          font-weight: 650;
          letter-spacing: -0.02em;
          margin-bottom: 0.85rem;
          color: var(--ink);
        }

        .card-meta {
          display: flex;
          gap: 1.1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--ink-50);
          font-weight: 500;
        }

        .meta-item svg {
          opacity: 0.45;
          flex-shrink: 0;
        }

        /* Card foot */
        .card-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1.35rem;
          border-top: 1px solid var(--ink-03);
          margin-top: auto;
        }

        .btn-ghost {
          background: none;
          border: 1px solid var(--ink-06);
          border-radius: 8px;
          padding: 0.3rem 0.7rem;
          font-family: var(--font);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--ink-50);
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
        }

        .btn-ghost:hover {
          color: var(--ink);
          border-color: var(--ink-12);
        }

        .card-arrow {
          font-size: 1rem;
          color: var(--ink-30);
          transition: transform 0.2s, color 0.2s;
        }

        .card:hover .card-arrow {
          transform: translateX(3px);
          color: var(--ink);
        }

        /* ── Empty / Loading States ───────────── */
        .state-msg {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 6rem 2rem;
          animation: fadeUp 0.5s ease both;
        }

        .state-msg p {
          color: var(--ink-30);
          font-size: 0.9rem;
        }

        .loader {
          width: 28px;
          height: 28px;
          border: 2.5px solid var(--ink-06);
          border-top-color: var(--ink);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 5rem 2rem;
          animation: fadeUp 0.5s ease both;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card);
          border: 1px solid var(--ink-06);
          border-radius: 20px;
          color: var(--ink-30);
          margin-bottom: 1.5rem;
        }

        .empty-state h2 {
          font-size: 1.15rem;
          font-weight: 650;
          letter-spacing: -0.02em;
          margin-bottom: 0.35rem;
        }

        .empty-state p {
          color: var(--ink-50);
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        /* ── Animations ───────────────────────── */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.35);
          }
          50% {
            box-shadow: 0 0 0 5px rgba(34, 197, 94, 0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ── Responsive ───────────────────────── */
        @media (max-width: 640px) {
          .page {
            padding: 5.5rem 1.25rem 2rem;
          }

          .topbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .topbar-right {
            width: 100%;
            justify-content: space-between;
          }

          .grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .page-title {
            font-size: 1.4rem;
          }
        }
      `}</style>
        </div>
    );
}