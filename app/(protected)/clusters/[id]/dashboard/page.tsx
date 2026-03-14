"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
    LineChart, Line, BarChart, Bar, ScatterChart, Scatter, ZAxis
} from "recharts";

type MetricRow = {
    id: string;
    cluster_id: string;
    sector_number: number;
    node_id: string;
    soil_moisture: number;
    soil_temperature: number;
    soil_ph: number;
    air_temperature: number;
    battery_level: number;
    signal_strength: number;
    ai_health_score: number;
    disease_risk_score: number;
    cluster_status: string;
    recorded_at: string;
};

export default function ClusterDashboard() {
    const params = useParams();
    const clusterId = params.id as string || "C-Alpha-1";

    const [data, setData] = useState<MetricRow[]>([]);
    const [lastSync, setLastSync] = useState<Date | null>(null);

    const fetchLive = async () => {
        try {
            const res = await fetch(`/api/clusters/live?id=${clusterId}`);
            const json = await res.json();
            if (json.data) {
                setData(json.data);
                setLastSync(new Date());
            }
        } catch (e) {
            console.warn("Telemetry uplink failed. Retrying...");
        }
    };

    useEffect(() => {
        fetchLive();
        const interval = setInterval(fetchLive, 5000);
        return () => clearInterval(interval);
    }, [clusterId]);

    if (!data || data.length === 0) {
        return (
            <div className="system-loading">
                <div className="spinner" />
                <p className="loading-text">Initializing {clusterId} Volumetric Analysis...</p>
                <style jsx>{`
                    .system-loading {
                        height: 100vh; display: flex; flex-direction: column;
                        align-items: center; justify-content: center;
                        background: #080807; color: #f0f0ec;
                        font-family: 'Instrument Sans', -apple-system, sans-serif; gap: 1.25rem;
                    }
                    .spinner {
                        width: 36px; height: 36px;
                        border: 2px solid rgba(255,255,255,.08);
                        border-top-color: #10b981;
                        border-radius: 50%; animation: spin 0.8s linear infinite;
                    }
                    .loading-text { font-size: 0.85rem; color: rgba(240,240,236,.35); letter-spacing: .04em; font-family: 'JetBrains Mono', monospace; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">

            {/* ── HEADER ── */}
            <header className="dash-header">
                <div className="dash-header-left">
                    <div className="dash-eyebrow">
                        <span className="live-dot" />
                        Uplink Active
                    </div>
                    <h1 className="dash-title">
                        Cluster Interface
                        <span className="dash-id">/{clusterId}</span>
                    </h1>
                    <p className="dash-subtitle">Real-time volumetric inversion & telemetry</p>
                </div>
                <div className="cluster-actions">

                    <Link href={`/clusters/${clusterId}/ai`} className="action-btn">
                        View AI Analytics
                    </Link>

                    <Link href={`/clusters/${clusterId}/root`} className="action-btn">
                        Root Analytics
                    </Link>

                    <Link href={`/clusters/${clusterId}/devices`} className="action-btn secondary">
                        Device Diagnostics
                    </Link>




                </div>
                <div className="dash-status">
                    <div className="status-indicator">
                        <span className="live-dot"></span> Uplink Active
                    </div>
                    <div className="sync-time">
                        Last sync: {lastSync ? lastSync.toLocaleTimeString() : '...'}
                    </div>

                </div>
            </header>

            {/* ── BENTO GRID ── */}
            <div className="bento-grid">

                {/* AI Insights — full width */}
                <div className="tile span-12">
                    <AIInsights data={data} />
                </div>

                {/* Charts row */}
                <div className="tile span-6 h340"><MoistureChart data={data} /></div>
                <div className="tile span-6 h340"><TemperatureChart data={data} /></div>

                {/* Maps + nodes row */}
                <div className="tile span-4 h340"><SectorMap data={data} type="moisture" /></div>
                <div className="tile span-4 h340"><NodeGrid data={data} /></div>
                <div className="tile span-4 h340"><DeviceHealth data={data} /></div>

                {/* KPI row */}
                <div className="tile span-3"><MicroKPI title="Soil pH" value={data[0]?.soil_ph || 0} unit="pH" /></div>
                <div className="tile span-3"><MicroKPI title="Air Temperature" value={data[0]?.air_temperature || 0} unit="°C" /></div>
                <div className="tile span-3"><MicroKPI title="Avg Moisture" value={Math.round(data.reduce((a, d) => a + d.soil_moisture, 0) / data.length) || 0} unit="%" /></div>
                <div className="tile span-3"><MicroKPI title="Cluster Status" value={data[0]?.cluster_status || "OK"} unit="" isText /></div>

                {/* Dual charts */}
                <div className="tile span-6 h340"><AirVsSoilChart data={data} /></div>
                <div className="tile span-6 h340"><DiseaseRiskChart data={data} /></div>

                {/* Third maps row */}
                <div className="tile span-4 h340"><SectorMap data={data} type="ph" /></div>
                <div className="tile span-4 h340"><SignalDistribution data={data} /></div>
                <div className="tile span-4 h340"><HealthRadial data={data} /></div>

                {/* Alert rows */}
                <div className="tile span-4 h340"><LowBatteryNodes data={data} /></div>
                <div className="tile span-4 h340"><HighRiskSectors data={data} /></div>
                <div className="tile span-4 h340"><RecentAlerts data={data} /></div>

                {/* Scatter + signal */}
                <div className="tile span-6 h340"><MoistureVsTempScatter data={data} /></div>
                <div className="tile span-6 h340"><SignalTrendChart data={data} /></div>

                {/* Bottom KPIs */}
                <div className="tile span-3"><MicroKPI title="Packets Synced" value={data.length} unit="rows" /></div>
                <div className="tile span-3"><MicroKPI title="Network Quality" value={Math.round(data.reduce((a, d) => a + d.signal_strength, 0) / data.length) || 0} unit="dBm" /></div>
                <div className="tile span-3"><MicroKPI title="Peak Air Temp" value={Math.max(...data.map(d => d.air_temperature))} unit="°C" /></div>
                <div className="tile span-3"><MicroKPI title="Lowest Battery" value={Math.min(...data.map(d => d.battery_level))} unit="%" /></div>

                {/* Table + action */}
                <div className="tile span-8 h340"><SectorAveragesTable data={data} /></div>
                <div className="tile span-4 h340"><ActionRequiredPanel data={data} /></div>

            </div>

            <style jsx>{`
        .dashboard-layout { padding: 3rem 4rem; background: #f5f5f7; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif; color: #1d1d1f; }
        .dash-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .dash-title { font-size: 2.5rem; font-weight: 600; color: #1d1d1f; letter-spacing: -0.03em; margin: 0 0 0.5rem 0; }
        .dim-text { color: #86868b; font-weight: 400; }
        .dash-subtitle { font-size: 1rem; color: #86868b; margin: 0; font-weight: 400; }
        .cluster-actions { display: flex; gap: 10px; margin-top: 12px; }
        .action-btn { background: #1d1d1f; color: white; padding: 8px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; text-decoration: none; }
        .action-btn.secondary { background: rgba(0,0,0,0.05); color: #1d1d1f; }
        .dash-status { text-align: right; }
        .status-indicator { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(0, 0, 0, 0.05); color: #1d1d1f; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .live-dot { width: 6px; height: 6px; background: #1d1d1f; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
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

/* ── SHARED ── */
const WT = ({ title }: { title: string }) => (
    <h2 className="widget-title">{title}</h2>
);

const DarkTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#1a1a18', border: '1px solid rgba(255,255,255,.1)',
            borderRadius: 10, padding: '10px 14px',
            fontFamily: "'Instrument Sans', sans-serif", fontSize: '.82rem', color: '#f0f0ec',
        }}>
            {label && <p style={{ marginBottom: 6, color: 'rgba(240,240,236,.4)', fontSize: '.72rem' }}>{label}</p>}
            {payload.map((e: any, i: number) => (
                <p key={i} style={{ margin: 0, fontWeight: 600 }}>
                    <span style={{ color: 'rgba(240,240,236,.5)', fontWeight: 400, marginRight: 6 }}>{e.name}:</span>
                    {e.value}
                </p>
            ))}
        </div>
    );
};

/* ── AI INSIGHTS ── */
function AIInsights({ data }: { data: MetricRow[] }) {
    const latest = data[0] || {};
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <WT title="Vega Insight Engine" />
                <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: '.62rem', fontWeight: 500,
                    letterSpacing: '.08em', color: '#34d399',
                    padding: '.22rem .6rem', background: 'rgba(16,185,129,.08)',
                    border: '1px solid rgba(16,185,129,.18)', borderRadius: 5,
                }}>V-2.4 ACTIVE</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '2rem', alignItems: 'center' }}>
                <div>
                    <span style={{ display: 'block', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(240,240,236,.3)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '.6rem' }}>AI Health Score</span>
                    <span style={{ fontSize: '3.8rem', fontWeight: 700, letterSpacing: '-.06em', color: '#34d399', lineHeight: 1 }}>
                        {latest.ai_health_score || 98}
                        <span style={{ fontSize: '1.1rem', color: 'rgba(52,211,153,.4)', fontWeight: 400 }}>/100</span>
                    </span>
                </div>
                <div>
                    <span style={{ display: 'block', fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(240,240,236,.3)', letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: '.6rem' }}>Disease Risk Index</span>
                    <span style={{ fontSize: '3.8rem', fontWeight: 700, letterSpacing: '-.06em', color: '#f0f0ec', lineHeight: 1 }}>
                        {latest.disease_risk_score || 1.2}
                        <span style={{ fontSize: '1.1rem', color: 'rgba(240,240,236,.3)', fontWeight: 400 }}>%</span>
                    </span>
                </div>
                <div style={{
                    padding: '1.5rem', background: 'rgba(255,255,255,.03)',
                    border: '1px solid rgba(255,255,255,.06)', borderRadius: 12,
                }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: 'rgba(240,240,236,.3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: '.6rem' }}>DIRECTIVE</div>
                    <div style={{ fontSize: '1rem', color: '#f0f0ec', lineHeight: 1.55, fontWeight: 400 }}>
                        {latest.cluster_status || "Optimal conditions. All sensors nominal."}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── CHARTS ── */
function MoistureChart({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="Volumetric Water Content" />
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,.04)" />
                    <XAxis dataKey="recorded_at" hide />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(240,240,236,.3)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<DarkTooltip />} />
                    <Area type="monotone" dataKey="soil_moisture" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#mg)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function TemperatureChart({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="Soil Thermal Dynamics" />
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,.04)" />
                    <XAxis dataKey="recorded_at" hide />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(240,240,236,.3)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<DarkTooltip />} />
                    <Area type="monotone" dataKey="soil_temperature" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#tg)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function AirVsSoilChart({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="Air vs Soil Temp (°C)" />
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,.04)" />
                    <XAxis dataKey="recorded_at" hide />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(240,240,236,.3)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<DarkTooltip />} />
                    <Line type="monotone" dataKey="air_temperature" stroke="#f0f0ec" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="soil_temperature" stroke="rgba(240,240,236,.3)" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function DiseaseRiskChart({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="Disease Risk Progression (%)" />
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,.04)" />
                    <XAxis dataKey="recorded_at" hide />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(240,240,236,.3)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<DarkTooltip />} />
                    <Area type="step" dataKey="disease_risk_score" stroke="#ef4444" strokeWidth={1.5} fillOpacity={1} fill="url(#rg)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function SignalTrendChart({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="Network Signal Trend" />
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,.04)" />
                    <XAxis dataKey="recorded_at" hide />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(240,240,236,.3)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} domain={[-100, 0]} />
                    <Tooltip content={<DarkTooltip />} />
                    <Line type="monotone" dataKey="signal_strength" stroke="#34d399" strokeWidth={1.5} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function SignalDistribution({ data }: { data: MetricRow[] }) {
    const nodes = useMemo(() => Array.from(new Map(data.map(d => [d.node_id, d])).values()).slice(0, 6), [data]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="Signal by Node (dBm)" />
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nodes} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide domain={[-120, 0]} />
                    <YAxis dataKey="node_id" type="category" tick={{ fontSize: 10, fill: 'rgba(240,240,236,.3)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="signal_strength" fill="#10b981" radius={[0, 4, 4, 0]} barSize={10} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function MoistureVsTempScatter({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="Moisture vs Soil Temp" />
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
                    <XAxis type="number" dataKey="soil_moisture" name="Moisture" tick={{ fontSize: 11, fill: 'rgba(240,240,236,.3)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                    <YAxis type="number" dataKey="soil_temperature" name="Temp" tick={{ fontSize: 11, fill: 'rgba(240,240,236,.3)', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                    <ZAxis range={[30, 100]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,.1)' }} content={<DarkTooltip />} />
                    <Scatter name="Sectors" data={data} fill="#10b981" opacity={0.45} />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}

/* ── SECTOR MAP ── */
function SectorMap({ data, type }: { data: MetricRow[], type: 'moisture' | 'ph' }) {
    const sectors = useMemo(() => Array.from(new Map(data.map(d => [d.sector_number, d])).values()).slice(0, 15), [data]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title={type === 'moisture' ? "Moisture Map" : "Soil pH Map"} />
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                    {sectors.map((d: any, i: number) => {
                        const val = type === 'moisture' ? d.soil_moisture : d.soil_ph;
                        const pct = type === 'moisture' ? val / 100 : val / 14;
                        return (
                            <div key={i} style={{
                                borderRadius: 10, padding: '1rem .5rem',
                                background: `rgba(16,185,129,${Math.max(.04, pct * .18)})`,
                                border: `1px solid rgba(16,185,129,${Math.max(.06, pct * .25)})`,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            }}>
                                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', color: 'rgba(240,240,236,.3)', letterSpacing: '.06em', textTransform: 'uppercase' }}>S{d.sector_number}</span>
                                <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-.03em', color: '#f0f0ec' }}>{val}{type === 'moisture' ? '%' : ''}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ── MICRO KPI ── */
function MicroKPI({ title, value, unit, isText = false }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: '.4rem' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 500, color: 'rgba(240,240,236,.3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{title}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                <span style={{ fontSize: isText ? '1.6rem' : '2.4rem', fontWeight: 700, letterSpacing: '-.05em', color: '#f0f0ec', lineHeight: 1 }}>{value}</span>
                {unit && <span style={{ fontSize: '.9rem', color: 'rgba(240,240,236,.3)', fontWeight: 400 }}>{unit}</span>}
            </div>
        </div>
    );
}

/* ── NODE GRID ── */
function NodeGrid({ data }: { data: MetricRow[] }) {
    const nodes = useMemo(() => Array.from(new Map(data.map(d => [d.node_id, d])).values()).slice(0, 8), [data]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="Node Telemetry" />
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {nodes.map((n: any, i: number) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 10, padding: '.85rem 1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.6rem' }}>
                            <strong style={{ fontSize: '.82rem', color: '#f0f0ec', fontWeight: 600 }}>{n.node_id}</strong>
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: 'rgba(240,240,236,.35)', background: 'rgba(255,255,255,.05)', padding: '2px 7px', borderRadius: 5 }}>{n.signal_strength} dBm</span>
                        </div>
                        <div style={{ height: 3, background: 'rgba(255,255,255,.06)', borderRadius: 2, marginBottom: '.45rem' }}>
                            <div style={{ height: '100%', width: `${n.battery_level}%`, background: n.battery_level > 20 ? '#10b981' : '#ef4444', borderRadius: 2, transition: 'width .4s' }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: 'rgba(240,240,236,.3)' }}>PWR {n.battery_level}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── DEVICE HEALTH ── */
function DeviceHealth({ data }: { data: MetricRow[] }) {
    const nodes = useMemo(() => Array.from(new Map(data.map(d => [d.node_id, d])).values()).slice(0, 8), [data]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="Hardware Log" />
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 7 }}>
                {nodes.map((d: any, i: number) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.7rem .85rem', border: '1px solid rgba(255,255,255,.06)', borderRadius: 9, background: 'rgba(255,255,255,.02)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /></svg>
                            </div>
                            <div>
                                <div style={{ fontSize: '.82rem', fontWeight: 600, color: '#f0f0ec' }}>{d.node_id}</div>
                                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(240,240,236,.3)' }}>SEC {d.sector_number}</div>
                            </div>
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 500, color: d.battery_level > 20 ? '#34d399' : '#ef4444', fontSize: '.85rem' }}>{d.battery_level}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── HEALTH RADIAL ── */
function HealthRadial({ data }: { data: MetricRow[] }) {
    const score = data[0]?.ai_health_score || 0;
    const r = 54; const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
            <div style={{ width: '100%' }}><WT title="Overall Health Index" /></div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: 140, height: 140 }}>
                    <svg width="140" height="140" viewBox="0 0 140 140">
                        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="8" />
                        <circle cx="70" cy="70" r={r} fill="none" stroke="#10b981" strokeWidth="8"
                            strokeDasharray={`${dash} ${circ - dash}`}
                            strokeLinecap="round"
                            transform="rotate(-90 70 70)"
                            style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,.5))' }}
                        />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-.06em', color: '#f0f0ec', lineHeight: 1 }}>{score}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem', color: 'rgba(240,240,236,.3)', letterSpacing: '.08em', marginTop: 2 }}>INDEX</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── LIST WIDGETS ── */
function LowBatteryNodes({ data }: { data: MetricRow[] }) {
    const sorted = [...data].sort((a, b) => a.battery_level - b.battery_level).slice(0, 6);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="Critical Power" />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {sorted.map((d, i) => (
                    <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '.85rem', fontWeight: 500, color: '#f0f0ec' }}>{d.node_id}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: d.battery_level < 20 ? '#ef4444' : '#34d399', fontWeight: 600 }}>{d.battery_level}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HighRiskSectors({ data }: { data: MetricRow[] }) {
    const sorted = [...data].sort((a, b) => b.disease_risk_score - a.disease_risk_score).slice(0, 6);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="High Risk Sectors" />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {sorted.map((d, i) => (
                    <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '.85rem', fontWeight: 500, color: '#f0f0ec' }}>Sector {d.sector_number}</span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: d.disease_risk_score > 5 ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>{d.disease_risk_score}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RecentAlerts({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="System Events" />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {data.slice(0, 5).map((d, i) => (
                    <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: 'rgba(240,240,236,.3)', marginBottom: 4 }}>
                            {new Date(d.recorded_at).toLocaleTimeString()} · SEC {d.sector_number}
                        </div>
                        <div style={{ fontSize: '.85rem', fontWeight: 500, color: '#f0f0ec' }}>{d.cluster_status}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── TABLE ── */
function SectorAveragesTable({ data }: { data: MetricRow[] }) {
    const sectors = useMemo(() => Array.from(new Map(data.map(d => [d.sector_number, d])).values()).slice(0, 5), [data]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WT title="Sector Macro Averages" />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                            {['Sector', 'Moisture', 'Temp', 'pH', 'Risk'].map(h => (
                                <th key={h} style={{ padding: '8px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', color: 'rgba(240,240,236,.3)', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 500 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sectors.map((s, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                                <td style={{ padding: '12px 8px', fontSize: '.85rem', fontWeight: 600, color: '#f0f0ec' }}>Sec {s.sector_number}</td>
                                <td style={{ padding: '12px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: '#34d399' }}>{s.soil_moisture}%</td>
                                <td style={{ padding: '12px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: 'rgba(240,240,236,.6)' }}>{s.soil_temperature}°C</td>
                                <td style={{ padding: '12px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', color: 'rgba(240,240,236,.6)' }}>{s.soil_ph}</td>
                                <td style={{ padding: '12px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: '.82rem', fontWeight: 600, color: s.disease_risk_score > 5 ? '#ef4444' : '#f59e0b' }}>{s.disease_risk_score}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ── ACTION PANEL ── */
function ActionRequiredPanel({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(16,185,129,.04)', border: '1px solid rgba(16,185,129,.12)', borderRadius: 12, padding: '1.25rem', gap: '1rem' }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.62rem', fontWeight: 500, color: '#10b981', letterSpacing: '.1em', textTransform: 'uppercase' }}>Action Required</div>
            <p style={{ fontSize: '.88rem', color: 'rgba(240,240,236,.55)', lineHeight: 1.65, flex: 1 }}>
                System operating normally. Continue monitoring Sector {data[0]?.sector_number || 1} for moisture variance. Ensure Node {data[0]?.node_id || 'X'} maintains battery above 20%.
            </p>
            <button style={{
                background: '#10b981', color: '#fff', border: 'none',
                padding: '.65rem', borderRadius: 8,
                fontFamily: "'Instrument Sans', sans-serif", fontSize: '.85rem', fontWeight: 600,
                cursor: 'pointer', transition: 'opacity .2s',
            }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
                Acknowledge
            </button>
        </div>
    );
}