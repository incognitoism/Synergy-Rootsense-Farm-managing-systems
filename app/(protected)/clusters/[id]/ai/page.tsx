"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
    AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
    LineChart, Line, BarChart, Bar
} from "recharts";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type InsightRow = {
    id: string;
    cluster_id: string;
    sector_number: number;
    yield_prediction: number;
    disease_probability: number;
    water_stress_score: number;
    soil_health_index: number;
    ai_confidence: number;
    anomaly_detected: boolean;
    insight_summary: string;
    recommended_action: string;
    created_at: string;
};

export default function AIInsightsPage() {
    const params = useParams();
    const clusterId = params.id as string || "C-Alpha-1";

    const [data, setData] = useState<InsightRow[]>([]);
    const [lastSync, setLastSync] = useState<Date | null>(null);

    async function fetchInsights() {
        try {
            const { data: rows } = await supabase
                .from("ai_insights")
                .select("*")
                .eq("cluster_id", clusterId)
                .order("created_at", { ascending: false })
                .limit(50);

            if (rows) {
                // Reverse for charting chronological order left-to-right
                setData(rows.reverse());
                setLastSync(new Date());
            }
        } catch (e) {
            console.warn("Insight uplink failed. Retrying...");
        }
    }

    useEffect(() => {
        fetchInsights();
        const interval = setInterval(fetchInsights, 10000);
        return () => clearInterval(interval);
    }, [clusterId]);

    if (!data || data.length === 0) {
        return (
            <div className="system-loading">
                <div className="spinner"></div>
                <p className="loading-text">Initializing AI Engine for {clusterId}...</p>
                <style jsx>{`
          .system-loading { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f5f5f7; color: #1d1d1f; font-family: -apple-system, sans-serif; }
          .spinner { width: 40px; height: 40px; border: 2px solid rgba(0, 0, 0, 0.1); border-top-color: #1d1d1f; border-radius: 50%; animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; margin-bottom: 1.5rem; }
          .loading-text { font-size: 0.9rem; font-weight: 500; letter-spacing: 0.02em; color: #86868b; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
            </div>
        );
    }

    // Latest data point is now the last item in the array due to the reverse() above
    const latest = data[data.length - 1] || {};

    return (
        <div className="dashboard-layout">
            <header className="dash-header">
                <div>
                    <h1 className="dash-title">AI Insights <span className="dim-text">/{clusterId}</span></h1>
                    <p className="dash-subtitle">Machine-generated crop & volumetric intelligence</p>
                </div>

                <div className="cluster-actions">
                    <Link href={`/clusters/${clusterId}`} className="action-btn secondary">
                        Back to Live Telemetry
                    </Link>
                    <Link href={`/clusters/${clusterId}/reports`} className="action-btn">
                        Generate Report
                    </Link>
                </div>

                <div className="dash-status">
                    <div className="status-indicator">
                        <span className="live-dot"></span> Engine Active
                    </div>
                    <div className="sync-time">
                        Last inference: {lastSync ? lastSync.toLocaleTimeString() : '...'}
                    </div>
                </div>
            </header>

            <div className="bento-grid">
                {/* Top Span - Main Directive */}
                <div className="glass-tile col-span-12">
                    <MainDirective data={latest} />
                </div>

                {/* Main Macro Charts */}
                <div className="glass-tile col-span-6" style={{ height: '340px' }}><YieldTrendChart data={data} /></div>
                <div className="glass-tile col-span-6" style={{ height: '340px' }}><DiseaseTrendChart data={data} /></div>

                {/* Micro KPIs */}
                <div className="glass-tile col-span-3"><MicroKPI title="Soil Health Index" value={latest.soil_health_index || 0} unit="/100" /></div>
                <div className="glass-tile col-span-3"><MicroKPI title="Water Stress" value={latest.water_stress_score || 0} unit="%" /></div>
                <div className="glass-tile col-span-3"><MicroKPI title="Disease Prob." value={latest.disease_probability || 0} unit="%" /></div>
                <div className="glass-tile col-span-3"><MicroKPI title="AI Confidence" value={latest.ai_confidence || 0} unit="%" /></div>

                {/* Secondary Charts */}
                <div className="glass-tile col-span-6" style={{ height: '340px' }}><WaterStressChart data={data} /></div>
                <div className="glass-tile col-span-6" style={{ height: '340px' }}><HealthIndexChart data={data} /></div>

                {/* Dense Data Panels */}
                <div className="glass-tile col-span-4" style={{ height: '340px' }}><ConfidenceRadial data={latest} /></div>
                <div className="glass-tile col-span-4" style={{ height: '340px' }}><InsightLog data={data} /></div>
                <div className="glass-tile col-span-4" style={{ height: '340px' }}><AnomalyLog data={data} /></div>

                {/* Bottom Row */}
                <div className="glass-tile col-span-8" style={{ height: '340px' }}><RecentInferencesTable data={data} /></div>
                <div className="glass-tile col-span-4" style={{ height: '340px' }}><ActionPanel data={latest} /></div>
            </div>

            <style jsx>{`
                .dashboard-layout { padding: 3rem 4rem; background: #f5f5f7; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif; color: #1d1d1f; }
                .dash-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); }
                .dash-title { font-size: 2.5rem; font-weight: 600; color: #1d1d1f; letter-spacing: -0.03em; margin: 0 0 0.5rem 0; }
                .dim-text { color: #86868b; font-weight: 400; }
                .dash-subtitle { font-size: 1rem; color: #86868b; margin: 0; font-weight: 400; }
                
                .cluster-actions { display: flex; gap: 10px; margin-top: 12px; }
                .action-btn { background: #1d1d1f; color: white; padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
                .action-btn.secondary { background: rgba(0,0,0,0.05); color: #1d1d1f; }
                
                .dash-status { text-align: right; }
                .status-indicator { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(0, 0, 0, 0.05); color: #1d1d1f; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
                .live-dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 1; box-shadow: 0 0 0 0 rgba(16,185,129,0.4); } 70% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(16,185,129,0); } 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16,185,129,0); } }
                .sync-time { font-size: 0.85rem; color: #86868b; font-variant-numeric: tabular-nums; }

                .bento-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; }

                /* LIQUID GLASS TILES */
                .glass-tile {
                    background: rgba(255, 255, 255, 0.45); backdrop-filter: blur(50px) saturate(150%); -webkit-backdrop-filter: blur(50px) saturate(150%);
                    border: 1px solid rgba(255, 255, 255, 0.6); border-bottom: 1px solid rgba(0, 0, 0, 0.03); border-radius: 24px; padding: 1.5rem;
                    position: relative; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255,255,255,1);
                    display: flex; flex-direction: column;
                }
                .glass-tile::after { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 40%; background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%); pointer-events: none; z-index: 0; }
                .glass-tile > * { z-index: 1; position: relative; }

                .col-span-12 { grid-column: span 12; } .col-span-8 { grid-column: span 8; } .col-span-6 { grid-column: span 6; } .col-span-4 { grid-column: span 4; } .col-span-3 { grid-column: span 3; }
                @media (max-width: 1400px) { .col-span-3 { grid-column: span 6; } }
                @media (max-width: 1200px) { .col-span-4, .col-span-8 { grid-column: span 12; } }
                @media (max-width: 900px) { .dashboard-layout { padding: 1.5rem; } .col-span-6 { grid-column: span 12; } }

                /* Scrollbars */
                *::-webkit-scrollbar { width: 6px; } *::-webkit-scrollbar-track { background: transparent; } *::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 10px; } *::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.3); }
            `}</style>
        </div>
    );
}

// --- SHARED COMPONENTS ---
const WidgetHeader = ({ title, alert = false }: { title: string, alert?: boolean }) => (
    <>
        <h2 className="widget-title">
            {alert && <span className="alert-dot"></span>}
            {title}
        </h2>
        <style jsx>{` 
            .widget-title { font-size: 0.95rem; font-weight: 600; color: #1d1d1f; margin: 0 0 1rem 0; letter-spacing: -0.01em; display: flex; align-items: center; gap: 8px; } 
            .widget-title::before { content: ""; display: block; width: 4px; height: 14px; background: ${alert ? '#ef4444' : '#1d1d1f'}; border-radius: 2px; opacity: 0.8; } 
            .alert-dot { width: 8px; height: 8px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 8px rgba(239,68,68,0.5); }
        `}</style>
    </>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', padding: '12px', border: '1px solid rgba(0, 0, 0, 0.05)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', color: '#1d1d1f' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: '#86868b', textTransform: 'uppercase' }}>
                    {new Date(label).toLocaleTimeString()}
                </p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ margin: 0, fontWeight: 600, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: entry.color }}></span>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// --- WIDGET IMPLEMENTATIONS ---

/* 1. MAIN DIRECTIVE */
function MainDirective({ data }: { data: InsightRow }) {
    return (
        <div className="ai-container">
            <div className="ai-header">
                <WidgetHeader title="Executive Summary" />
                {data.anomaly_detected && <span className="ai-badge alert">ANOMALY DETECTED</span>}
            </div>
            <div className="ai-grid">
                <div className="insight-text">
                    <h3 className="summary-title">{data.insight_summary || "Analyzing subsurface data..."}</h3>
                    <p className="summary-action"><span className="action-label">System Directive:</span> {data.recommended_action || "Standby."}</p>
                </div>
            </div>
            <style jsx>{`
                .ai-container { display: flex; flex-direction: column; } 
                .ai-header { display: flex; justify-content: space-between; align-items: flex-start; }
                .ai-badge.alert { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #ef4444; font-size: 0.7rem; padding: 4px 10px; border-radius: 12px; font-weight: 700; letter-spacing: 0.05em; }
                .ai-grid { margin-top: 0.5rem; }
                .summary-title { font-size: 1.8rem; font-weight: 500; letter-spacing: -0.02em; color: #1d1d1f; line-height: 1.3; margin: 0 0 1rem 0; }
                .summary-action { font-size: 1.1rem; color: #1d1d1f; line-height: 1.5; margin: 0; background: rgba(0,0,0,0.03); padding: 1rem 1.5rem; border-radius: 12px; border: 1px solid rgba(0,0,0,0.04); }
                .action-label { font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #86868b; letter-spacing: 0.05em; margin-right: 8px; }
            `}</style>
        </div>
    );
}

/* MICRO KPI */
function MicroKPI({ title, value, unit }: any) {
    return (
        <div className="kpi-box">
            <span className="kpi-title">{title}</span>
            <div className="kpi-val-container">
                <span className="kpi-val">{value}</span>
                {unit && <span className="kpi-unit">{unit}</span>}
            </div>
            <style jsx>{`
                .kpi-box { display: flex; flex-direction: column; justify-content: center; height: 100%; }
                .kpi-title { font-size: 0.8rem; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
                .kpi-val-container { display: flex; align-items: baseline; gap: 4px; }
                .kpi-val { font-size: 2.5rem; font-weight: 500; color: #1d1d1f; letter-spacing: -0.03em; line-height: 1; }
                .kpi-unit { font-size: 1rem; color: #86868b; font-weight: 500; }
            `}</style>
        </div>
    );
}

/* MACRO CHARTS */
function YieldTrendChart({ data }: { data: InsightRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Yield Prediction Trend" />
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs><linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1d1d1f" stopOpacity={0.15} /><stop offset="95%" stopColor="#1d1d1f" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="created_at" hide /><YAxis tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" name="Proj. Yield" dataKey="yield_prediction" stroke="#1d1d1f" strokeWidth={2} fillOpacity={1} fill="url(#yieldGrad)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function DiseaseTrendChart({ data }: { data: InsightRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Disease Probability Assessment" />
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="created_at" hide /><YAxis tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" name="Risk %" dataKey="disease_probability" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function WaterStressChart({ data }: { data: InsightRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Volumetric Water Stress" />
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs><linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="created_at" hide /><YAxis tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} />
                    <Area type="step" name="Stress Score" dataKey="water_stress_score" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#waterGrad)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function HealthIndexChart({ data }: { data: InsightRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Soil Health Degradation/Recovery" />
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="created_at" hide /><YAxis tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} domain={[0, 100]} /><Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" name="Health Index" dataKey="soil_health_index" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

/* DENSE LISTS & PANELS */
function InsightLog({ data }: { data: InsightRow[] }) {
    // Reverse again locally to show newest top
    const logData = [...data].reverse().slice(0, 5);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Engine Log" />
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', marginRight: '-8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '10px' }}>
                    {logData.map((d, i) => (
                        <div key={i} style={{ padding: '0.75rem 1rem', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '12px', background: 'rgba(255,255,255,0.3)' }}>
                            <div style={{ fontSize: '0.7rem', color: '#86868b', marginBottom: '4px', fontWeight: 600 }}>{new Date(d.created_at).toLocaleTimeString()}</div>
                            <div style={{ fontSize: '0.85rem', color: '#1d1d1f', lineHeight: 1.4 }}>{d.insight_summary}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AnomalyLog({ data }: { data: InsightRow[] }) {
    const anomalies = [...data].filter(d => d.anomaly_detected).reverse().slice(0, 6);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Detected Anomalies" alert={anomalies.length > 0} />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {anomalies.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#86868b', fontSize: '0.85rem' }}>No recent anomalies.</div>
                ) : (
                    anomalies.map((d, i) => (
                        <div key={i} style={{ padding: '10px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ef4444' }}>Sector {d.sector_number}</div>
                                <div style={{ fontSize: '0.75rem', color: '#86868b' }}>{new Date(d.created_at).toLocaleDateString()}</div>
                            </div>
                            <span style={{ fontSize: '0.75rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>ATTN</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

/* RADIAL GAUGE */
function ConfidenceRadial({ data }: { data: InsightRow }) {
    const score = data.ai_confidence || 0;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
            <div style={{ width: '100%' }}><WidgetHeader title="Current Model Confidence" /></div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{
                    width: '140px', height: '140px', borderRadius: '50%',
                    background: `conic-gradient(#1d1d1f ${score}%, rgba(0,0,0,0.05) ${score}%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 600, color: '#1d1d1f', lineHeight: 1 }}>{score}%</span>
                        <span style={{ fontSize: '0.7rem', color: '#86868b', fontWeight: 600, marginTop: '4px' }}>ACCURACY</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* TABLE & ACTION PANEL */
function RecentInferencesTable({ data }: { data: InsightRow[] }) {
    const tableData = [...data].reverse().slice(0, 5);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Historical Inferences" />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', color: '#86868b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '8px 4px' }}>Time</th>
                            <th style={{ padding: '8px 4px' }}>Sector</th>
                            <th style={{ padding: '8px 4px' }}>Yield Proj.</th>
                            <th style={{ padding: '8px 4px' }}>Disease Risk</th>
                            <th style={{ padding: '8px 4px' }}>Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((s, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', fontSize: '0.85rem' }}>
                                <td style={{ padding: '12px 4px', color: '#86868b' }}>{new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                <td style={{ padding: '12px 4px', fontWeight: 500 }}>Sec {s.sector_number}</td>
                                <td style={{ padding: '12px 4px' }}>{s.yield_prediction}</td>
                                <td style={{ padding: '12px 4px', color: s.disease_probability > 15 ? '#ef4444' : 'inherit' }}>{s.disease_probability}%</td>
                                <td style={{ padding: '12px 4px', fontWeight: 600 }}>{s.ai_confidence}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ActionPanel({ data }: { data: InsightRow }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(0,0,0,0.03)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1d1d1f', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended Action</h3>
            <p style={{ fontSize: '0.95rem', color: '#1d1d1f', lineHeight: 1.5, flex: 1 }}>
                {data.recommended_action || "Awaiting sufficient volumetric data points to formulate a recommendation."}
            </p>
            <button style={{ background: '#1d1d1f', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                Execute Protocol
            </button>
        </div>
    );
}