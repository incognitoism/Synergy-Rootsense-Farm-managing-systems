"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
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
                <div className="spinner"></div>
                <p className="loading-text">Initializing {clusterId} Volumetric Analysis...</p>
                <style jsx>{`
          .system-loading { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f5f5f7; color: #1d1d1f; font-family: -apple-system, sans-serif; }
          .spinner { width: 40px; height: 40px; border: 2px solid rgba(0, 0, 0, 0.1); border-top-color: #1d1d1f; border-radius: 50%; animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite; margin-bottom: 1.5rem; }
          .loading-text { font-size: 0.9rem; font-weight: 500; letter-spacing: 0.02em; color: #86868b; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <header className="dash-header">
                <div>
                    <h1 className="dash-title">Cluster Interface <span className="dim-text">/{clusterId}</span></h1>
                    <p className="dash-subtitle">Real-time volumetric inversion & telemetry</p>
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

            <div className="bento-grid">
                <div className="glass-tile col-span-12">
                    <AIInsights data={data} />
                </div>

                <div className="glass-tile col-span-6" style={{ height: '340px' }}><MoistureChart data={data} /></div>
                <div className="glass-tile col-span-6" style={{ height: '340px' }}><TemperatureChart data={data} /></div>

                <div className="glass-tile col-span-4" style={{ height: '340px' }}><SectorMap data={data} type="moisture" /></div>
                <div className="glass-tile col-span-4" style={{ height: '340px' }}><NodeGrid data={data} /></div>
                <div className="glass-tile col-span-4" style={{ height: '340px' }}><DeviceHealth data={data} /></div>

                <div className="glass-tile col-span-3"><MicroKPI title="Current Soil pH" value={data[0]?.soil_ph || 0} unit="pH" /></div>
                <div className="glass-tile col-span-3"><MicroKPI title="Air Temperature" value={data[0]?.air_temperature || 0} unit="°C" /></div>
                <div className="glass-tile col-span-3"><MicroKPI title="Avg Moisture" value={Math.round(data.reduce((acc, d) => acc + d.soil_moisture, 0) / data.length) || 0} unit="%" /></div>
                <div className="glass-tile col-span-3"><MicroKPI title="Cluster Status" value={data[0]?.cluster_status || "OK"} unit="" isText /></div>

                <div className="glass-tile col-span-6" style={{ height: '340px' }}><AirVsSoilChart data={data} /></div>
                <div className="glass-tile col-span-6" style={{ height: '340px' }}><DiseaseRiskChart data={data} /></div>

                <div className="glass-tile col-span-4" style={{ height: '340px' }}><SectorMap data={data} type="ph" /></div>
                <div className="glass-tile col-span-4" style={{ height: '340px' }}><SignalDistribution data={data} /></div>
                <div className="glass-tile col-span-4" style={{ height: '340px' }}><HealthRadial data={data} /></div>

                <div className="glass-tile col-span-4" style={{ height: '340px' }}><LowBatteryNodes data={data} /></div>
                <div className="glass-tile col-span-4" style={{ height: '340px' }}><HighRiskSectors data={data} /></div>
                <div className="glass-tile col-span-4" style={{ height: '340px' }}><RecentAlerts data={data} /></div>

                <div className="glass-tile col-span-6" style={{ height: '340px' }}><MoistureVsTempScatter data={data} /></div>
                <div className="glass-tile col-span-6" style={{ height: '340px' }}><SignalTrendChart data={data} /></div>

                <div className="glass-tile col-span-3"><MicroKPI title="Packets Synced" value={data.length} unit="rows" /></div>
                <div className="glass-tile col-span-3"><MicroKPI title="Network Quality" value={Math.round(data.reduce((acc, d) => acc + d.signal_strength, 0) / data.length) || 0} unit="dBm" /></div>
                <div className="glass-tile col-span-3"><MicroKPI title="Peak Air Temp" value={Math.max(...data.map(d => d.air_temperature))} unit="°C" /></div>
                <div className="glass-tile col-span-3"><MicroKPI title="Lowest Battery" value={Math.min(...data.map(d => d.battery_level))} unit="%" /></div>

                <div className="glass-tile col-span-8" style={{ height: '340px' }}><SectorAveragesTable data={data} /></div>
                <div className="glass-tile col-span-4" style={{ height: '340px' }}><ActionRequiredPanel data={data} /></div>
            </div>

            <style jsx>{`
        .dashboard-layout { padding: 3rem 4rem; background: #f5f5f7; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif; color: #1d1d1f; }
        .dash-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); }
        .dash-title { font-size: 2.5rem; font-weight: 600; color: #1d1d1f; letter-spacing: -0.03em; margin: 0 0 0.5rem 0; }
        .dim-text { color: #86868b; font-weight: 400; }
        .dash-subtitle { font-size: 1rem; color: #86868b; margin: 0; font-weight: 400; }
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

// --- SHARED COMPONENTS ---
const WidgetHeader = ({ title }: { title: string }) => (
    <>
        <h2 className="widget-title">{title}</h2>
        <style jsx>{` .widget-title { font-size: 0.95rem; font-weight: 600; color: #1d1d1f; margin: 0 0 1rem 0; letter-spacing: -0.01em; display: flex; align-items: center; gap: 8px; } .widget-title::before { content: ""; display: block; width: 4px; height: 14px; background: #1d1d1f; border-radius: 2px; opacity: 0.8; } `}</style>
    </>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', padding: '12px', border: '1px solid rgba(0, 0, 0, 0.05)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', color: '#1d1d1f' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#86868b' }}>{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>{entry.name}: {entry.value}</p>
                ))}
            </div>
        );
    }
    return null;
};

// --- WIDGET IMPLEMENTATIONS ---

/* 1. AI INSIGHTS */
function AIInsights({ data }: { data: MetricRow[] }) {
    const latest = data[0] || {};
    return (
        <div className="ai-container">
            <div className="ai-header"><WidgetHeader title="Vega Insight Engine" /><span className="ai-badge">V-2.4 ACTIVE</span></div>
            <div className="ai-grid">
                <div className="metric-box"><span className="m-label">AI Health Score</span><span className="m-val">{latest.ai_health_score || 98}<span className="unit">/100</span></span></div>
                <div className="metric-box"><span className="m-label">Disease Risk Index</span><span className="m-val">{latest.disease_risk_score || 1.2}<span className="unit">%</span></span></div>
                <div className="ai-status"><div className="status-title">DIRECTIVE</div><div className="status-msg">{latest.cluster_status || "Optimal conditions."}</div></div>
            </div>
            <style jsx>{`
        .ai-container { display: flex; flex-direction: column; } .ai-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .ai-badge { background: rgba(0, 0, 0, 0.05); border: 1px solid rgba(0, 0, 0, 0.05); color: #1d1d1f; font-size: 0.7rem; padding: 4px 10px; border-radius: 12px; font-weight: 600; letter-spacing: 0.05em; }
        .ai-grid { display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 1.5rem; margin-top: 0.5rem; } .metric-box { padding: 1rem 0; }
        .m-label { display: block; font-size: 0.8rem; color: #86868b; margin-bottom: 0.5rem; font-weight: 500; }
        .m-val { font-size: 3.5rem; font-weight: 500; line-height: 1; display: flex; align-items: baseline; gap: 4px; letter-spacing: -0.04em;}
        .unit { font-size: 1.2rem; color: #86868b; font-weight: 400; }
        .ai-status { padding: 1.5rem; background: rgba(0,0,0,0.02); border-radius: 16px; border: 1px solid rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: center; }
        .status-title { font-size: 0.75rem; color: #86868b; font-weight: 600; letter-spacing: 0.1em; margin-bottom: 0.5rem; } .status-msg { font-size: 1.1rem; color: #1d1d1f; line-height: 1.5; font-weight: 400; }
        @media (max-width: 1024px) { .ai-grid { grid-template-columns: 1fr 1fr; } .ai-status { grid-column: span 2; } }
      `}</style>
        </div>
    );
}

/* 2 & 3. MACRO AREA CHARTS */
function MoistureChart({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Volumetric Water Content" />
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1d1d1f" stopOpacity={0.15} /><stop offset="95%" stopColor="#1d1d1f" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="recorded_at" hide /><YAxis tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="soil_moisture" stroke="#1d1d1f" strokeWidth={2} fillOpacity={1} fill="url(#g1)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function TemperatureChart({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Soil Thermal Dynamics" />
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#86868b" stopOpacity={0.15} /><stop offset="95%" stopColor="#86868b" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="recorded_at" hide /><YAxis tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="soil_temperature" stroke="#86868b" strokeWidth={2} fillOpacity={1} fill="url(#g2)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

/* 4 & 11. SECTOR HEATMAPS (Reusable) */
function SectorMap({ data, type }: { data: MetricRow[], type: 'moisture' | 'ph' }) {
    const uniqueSectors = useMemo(() => Array.from(new Map(data.map(d => [d.sector_number, d])).values()).slice(0, 15), [data]);
    return (
        <div className="w-wrap">
            <WidgetHeader title={type === 'moisture' ? "Moisture Map" : "Soil pH Map"} />
            <div className="s-cont">
                <div className="grid">
                    {uniqueSectors.map((d: any, i: number) => {
                        const val = type === 'moisture' ? d.soil_moisture : d.soil_ph;
                        const intensity = type === 'moisture' ? Math.max(0.02, val / 100) : Math.max(0.02, val / 14);
                        return (
                            <div key={i} className="cell" style={{ background: `rgba(0, 0, 0, ${intensity * 0.15})` }}>
                                <span className="lbl">SEC {d.sector_number}</span><span className="val">{val}{type === 'moisture' ? '%' : ''}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <style jsx>{`
        .w-wrap { display: flex; flex-direction: column; height: 100%; } .s-cont { flex: 1; overflow-y: auto; padding-right: 8px; margin-right: -8px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding-bottom: 10px; }
        .cell { border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.2rem 0; border: 1px solid rgba(0, 0, 0, 0.04); }
        .lbl { font-size: 0.65rem; font-weight: 600; color: #86868b; margin-bottom: 4px; } .val { font-size: 1.2rem; font-weight: 500; color: #1d1d1f; }
      `}</style>
        </div>
    );
}

/* MICRO KPI (Used in Rows 4 & 9) */
function MicroKPI({ title, value, unit, isText = false }: any) {
    return (
        <div className="kpi-box">
            <span className="kpi-title">{title}</span>
            <div className="kpi-val-container">
                <span className="kpi-val" style={{ fontSize: isText ? '1.8rem' : '2.5rem' }}>{value}</span>
                {unit && <span className="kpi-unit">{unit}</span>}
            </div>
            <style jsx>{`
        .kpi-box { display: flex; flex-direction: column; justify-content: center; height: 100%; }
        .kpi-title { font-size: 0.8rem; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .kpi-val-container { display: flex; align-items: baseline; gap: 4px; }
        .kpi-val { font-weight: 500; color: #1d1d1f; letter-spacing: -0.03em; line-height: 1; }
        .kpi-unit { font-size: 1rem; color: #86868b; font-weight: 500; }
      `}</style>
        </div>
    );
}

/* 5 & 14 & 15. DENSE LISTS (Nodes, Health, Alerts) */
function NodeGrid({ data }: { data: MetricRow[] }) {
    const nodes = useMemo(() => Array.from(new Map(data.map(d => [d.node_id, d])).values()).slice(0, 8), [data]);
    return (
        <div style={{ display: 'flex', flexDir: 'column', height: '100%' }}>
            <WidgetHeader title="Node Telemetry" />
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', marginRight: '-8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', paddingBottom: '10px' }}>
                    {nodes.map((n: any, i: number) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.04)', padding: '1rem', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                <strong style={{ fontSize: '0.85rem', color: '#1d1d1f' }}>{n.node_id}</strong>
                                <span style={{ fontSize: '0.7rem', color: '#86868b', background: 'rgba(0,0,0,0.04)', padding: '2px 6px', borderRadius: '6px' }}>{n.signal_strength} dBm</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '2px', marginBottom: '0.5rem' }}>
                                <div style={{ height: '100%', width: `${n.battery_level}%`, background: n.battery_level > 20 ? '#1d1d1f' : '#86868b', borderRadius: '2px' }}></div>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.7rem', color: '#86868b', fontWeight: 500 }}>PWR: {n.battery_level}%</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DeviceHealth({ data }: { data: MetricRow[] }) {
    const nodes = useMemo(() => Array.from(new Map(data.map(d => [d.node_id, d])).values()).slice(0, 8), [data]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Hardware Log" />
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', marginRight: '-8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '10px' }}>
                    {nodes.map((d: any, i: number) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '12px', background: 'rgba(255,255,255,0.3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ color: '#1d1d1f', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.03)' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect></svg>
                                </div>
                                <div><div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1d1d1f' }}>{d.node_id}</div><div style={{ fontSize: '0.7rem', color: '#86868b' }}>Sec {d.sector_number}</div></div>
                            </div>
                            <div style={{ fontWeight: 500, color: '#1d1d1f', fontSize: '1rem' }}>{d.battery_level}%</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function LowBatteryNodes({ data }: { data: MetricRow[] }) {
    const sorted = [...data].sort((a, b) => a.battery_level - b.battery_level).slice(0, 6);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Critical Power" />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {sorted.map((d, i) => (
                    <div key={i} style={{ padding: '10px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{d.node_id}</span>
                        <span style={{ fontSize: '0.85rem', color: '#86868b' }}>{d.battery_level}%</span>
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
            <WidgetHeader title="High Risk Sectors" />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {sorted.map((d, i) => (
                    <div key={i} style={{ padding: '10px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Sector {d.sector_number}</span>
                        <span style={{ fontSize: '0.85rem', color: '#1d1d1f', fontWeight: 600 }}>{d.disease_risk_score}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RecentAlerts({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="System Events" />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {data.slice(0, 5).map((d, i) => (
                    <div key={i} style={{ padding: '10px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ fontSize: '0.75rem', color: '#86868b', marginBottom: '4px' }}>{new Date(d.recorded_at).toLocaleTimeString()} - Sec {d.sector_number}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{d.cluster_status}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* COMPLEX CHARTS (Dual-Line, Scatter, Bar) */
function AirVsSoilChart({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Air vs Soil Temp (°C)" />
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="recorded_at" hide /><YAxis tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="air_temperature" stroke="#1d1d1f" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="soil_temperature" stroke="#86868b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function DiseaseRiskChart({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Disease Risk Progression (%)" />
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs><linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1d1d1f" stopOpacity={0.1} /><stop offset="95%" stopColor="#1d1d1f" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="recorded_at" hide /><YAxis tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} /><Tooltip content={<CustomTooltip />} />
                    <Area type="step" dataKey="disease_risk_score" stroke="#1d1d1f" strokeWidth={2} fillOpacity={1} fill="url(#g3)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function MoistureVsTempScatter({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Moisture vs Soil Temp" />
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                    <XAxis type="number" dataKey="soil_moisture" name="Moisture" tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} />
                    <YAxis type="number" dataKey="soil_temperature" name="Temp" tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} />
                    <ZAxis range={[30, 100]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                    <Scatter name="Sectors" data={data} fill="#1d1d1f" opacity={0.5} />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}

function SignalTrendChart({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Network Signal Trend" />
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="recorded_at" hide /><YAxis tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} domain={[-100, 0]} /><Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="signal_strength" stroke="#86868b" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function SignalDistribution({ data }: { data: MetricRow[] }) {
    const nodes = useMemo(() => Array.from(new Map(data.map(d => [d.node_id, d])).values()).slice(0, 6), [data]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Signal by Node (dBm)" />
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nodes} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide domain={[-120, 0]} />
                    <YAxis dataKey="node_id" type="category" tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} width={60} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="signal_strength" fill="#1d1d1f" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

/* RADIAL GAUGE (Pure CSS for crisp glass UI) */
function HealthRadial({ data }: { data: MetricRow[] }) {
    const score = data[0]?.ai_health_score || 0;
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
            <div style={{ width: '100%' }}><WidgetHeader title="Overall Health Index" /></div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{
                    width: '140px', height: '140px', borderRadius: '50%',
                    background: `conic-gradient(#1d1d1f ${score}%, rgba(0,0,0,0.05) ${score}%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 600, color: '#1d1d1f', lineHeight: 1 }}>{score}</span>
                        <span style={{ fontSize: '0.7rem', color: '#86868b', fontWeight: 600 }}>INDEX</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* TABLES & PANELS */
function SectorAveragesTable({ data }: { data: MetricRow[] }) {
    const sectors = useMemo(() => Array.from(new Map(data.map(d => [d.sector_number, d])).values()).slice(0, 5), [data]);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Sector Macro Averages" />
            <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', color: '#86868b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                            <th style={{ padding: '8px 4px' }}>Sector</th><th style={{ padding: '8px 4px' }}>Moisture</th><th style={{ padding: '8px 4px' }}>Temp</th><th style={{ padding: '8px 4px' }}>pH</th><th style={{ padding: '8px 4px' }}>Risk</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sectors.map((s, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)', fontSize: '0.85rem' }}>
                                <td style={{ padding: '12px 4px', fontWeight: 500 }}>Sec {s.sector_number}</td>
                                <td style={{ padding: '12px 4px' }}>{s.soil_moisture}%</td>
                                <td style={{ padding: '12px 4px' }}>{s.soil_temperature}°C</td>
                                <td style={{ padding: '12px 4px' }}>{s.soil_ph}</td>
                                <td style={{ padding: '12px 4px', fontWeight: 600 }}>{s.disease_risk_score}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ActionRequiredPanel({ data }: { data: MetricRow[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(0,0,0,0.03)', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1d1d1f', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action Required</h3>
            <p style={{ fontSize: '0.9rem', color: '#86868b', lineHeight: 1.5, flex: 1 }}>
                System operating normally. Continue monitoring Sector {data[0]?.sector_number || 1} for moisture variance. Ensure Node {data[0]?.node_id || 'X'} maintains battery above 20%.
            </p>
            <button style={{ background: '#1d1d1f', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>Acknowledge</button>
        </div>
    );
}