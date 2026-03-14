"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { createClient } from "@supabase/supabase-js";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ═══════════════════════════════════════════════════════════════
   VOLUMETRIC ANALYTICS — 100% DATABASE DRIVEN + PDF EXPORT
   Aesthetic: Liquid Glass, Cinematic Load-in, Scientific LiDAR
   ═══════════════════════════════════════════════════════════════ */

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RootAnalyticsPage() {
    const params = useParams();
    const clusterId = params.id as string || "C-Alpha-1";
    const reportRef = useRef<HTMLDivElement>(null);

    // Dynamic State
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const [scanData, setScanData] = useState<any>(null);
    const [sectors, setSectors] = useState<any[]>([]);
    const [depthProfile, setDepthProfile] = useState<any[]>([]);
    const [pointCloud, setPointCloud] = useState<{ positions: Float32Array, colors: Float32Array } | null>(null);

    const [activeSectorId, setActiveSectorId] = useState<number | null>(null);

    // ─── DATA FETCHING ──────────────────────────────────────────
    useEffect(() => {
        async function fetchSystemData() {
            setIsLoading(true);
            try {
                // 1. Fetch latest Scan Baseline
                const { data: scan } = await supabase
                    .from('volumetric_scans')
                    .select('*')
                    .eq('cluster_id', clusterId)
                    .order('recorded_at', { ascending: false })
                    .limit(1)
                    .single();

                if (!scan) throw new Error("No scan data found.");
                setScanData(scan);

                // 2. Fetch related Sector Nodes
                const { data: sectorData } = await supabase
                    .from('sector_telemetry')
                    .select('*')
                    .eq('scan_id', scan.id)
                    .order('sector_number', { ascending: true });

                if (sectorData && sectorData.length > 0) {
                    setSectors(sectorData);
                    setActiveSectorId(sectorData[0].sector_number);
                }

                // 3. Fetch related Depth Profile Data
                const { data: depthData } = await supabase
                    .from('depth_profiles')
                    .select('*')
                    .eq('scan_id', scan.id)
                    .order('sort_order', { ascending: true });

                if (depthData) setDepthProfile(depthData);

                // 4. Fetch the massive Spatial Payload (14M+ events) from bucket URL
                try {
                    const res = await fetch(scan.spatial_payload_url);
                    const rawCloud = await res.json();
                    setPointCloud({
                        positions: new Float32Array(rawCloud.positions),
                        colors: new Float32Array(rawCloud.colors)
                    });
                } catch (spatialErr) {
                    console.error("Spatial payload fetch failed, ensure URL is accessible.", spatialErr);
                }

            } catch (error) {
                console.error("Database sync failed:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchSystemData();
    }, [clusterId]);

    // ─── PDF GENERATION PARSER ──────────────────────────────────
    const exportToPDF = async () => {
        if (!reportRef.current) return;
        setIsGeneratingPDF(true);

        try {
            // Parse the DOM into a canvas (captures CSS glassmorphism and charts)
            const canvas = await html2canvas(reportRef.current, {
                scale: 2, // High resolution
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff"
            });

            const imgData = canvas.toDataURL('image/png');

            // Calculate PDF dimensions (A4 size)
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Volumetric_Report_${clusterId}_${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error("PDF Generation failed:", error);
            alert("Failed to generate PDF report.");
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (isLoading) {
        return (
            <div className="loader-screen">
                <div className="spinner" />
                <p>Synchronizing Volumetric Database...</p>
                <style jsx>{`.loader-screen { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; font-family: sans-serif; color: #86868b; } .spinner { width: 40px; height: 40px; border: 3px solid rgba(0,0,0,0.1); border-top-color: #1d1d1f; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const activeSector = sectors.find(s => s.sector_number === activeSectorId) || null;

    return (
        <div className="dashboard-layout">
            <header className="dash-header">
                <div>
                    <h1 className="dash-title">Volumetric Point Cloud <span className="dim-text">/{clusterId}</span></h1>
                    <p className="dash-subtitle">Systemic CAD reconstruction & structural defect analysis</p>
                </div>

                <div className="cluster-actions">
                    <button onClick={exportToPDF} disabled={isGeneratingPDF} className="action-btn">
                        {isGeneratingPDF ? "Parsing Report..." : "Download PDF Report"}
                    </button>
                    <Link href={`/clusters/${clusterId}`} className="action-btn secondary">
                        ← Dashboard
                    </Link>
                </div>
            </header>

            {/* This ref wraps the exact area that will be parsed into the PDF */}
            <div ref={reportRef} className="bento-grid pdf-container">

                {/* 3D VIEWER */}
                <div className="glass-tile col-span-8" style={{ height: '650px', padding: 0, overflow: 'hidden' }}>
                    <div className="viewer-overlay">
                        <WidgetHeader title="Interactive Spatial Array" />
                        <div className="viewer-controls">
                            <span className="badge">LIDAR INVERSION</span>
                            <span className="badge active">THERMAL MATRIX</span>
                        </div>
                    </div>

                    {pointCloud ? (
                        <Canvas camera={{ position: [0, 2, 8], fov: 45 }} gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}>
                            {/* preserveDrawingBuffer is required for html2canvas to capture the WebGL context */}
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} />
                            <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.8} />

                            <AnimatedPointCloud positions={pointCloud.positions} colors={pointCloud.colors} />

                            {/* Dynamically map nodes from the DB */}
                            {sectors.map((sector) => (
                                <SectorNode
                                    key={sector.id}
                                    position={[sector.pos_x, sector.pos_y, sector.pos_z]}
                                    onClick={() => setActiveSectorId(sector.sector_number)}
                                    active={activeSectorId === sector.sector_number}
                                    color={sector.health_score < 60 ? "#ef4444" : sector.health_score < 80 ? "#f59e0b" : "#10b981"}
                                />
                            ))}
                        </Canvas>
                    ) : (
                        <div className="loader-overlay"><div className="spinner" /> Awaiting Spatial Payload...</div>
                    )}
                </div>

                {/* DYNAMIC SECTOR PANEL */}
                <div className="glass-tile col-span-4" style={{ height: '650px' }}>
                    <SectorDetails sector={activeSector} />
                </div>

                {/* BOTTOM CHARTS & KPIs */}
                <div className="glass-tile col-span-3"><MicroKPI title="Total Events Rendered" value={scanData?.total_events ? `${(scanData.total_events / 1000000).toFixed(1)}M` : "--"} unit="pts" /></div>
                <div className="glass-tile col-span-3"><MicroKPI title="Structural Discontinuities" value={scanData?.discontinuities_count ?? "--"} unit="voids" alert={scanData?.discontinuities_count > 0} /></div>
                <div className="glass-tile col-span-3"><MicroKPI title="Shear Zone Stress" value={scanData?.shear_zone_stress ?? "--"} unit="kPa" alert={scanData?.shear_zone_stress > 80} /></div>
                <div className="glass-tile col-span-3"><MicroKPI title="Matrix Integrity" value={scanData?.structural_integrity ?? "--"} unit="%" /></div>

                <div className="glass-tile col-span-12" style={{ height: '360px' }}>
                    <DepthProfileChart data={depthProfile} />
                </div>
            </div>

            <style jsx>{`
                .dashboard-layout { padding: 3rem 4rem; background: #ffffff; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; color: #1d1d1f; }
                .dash-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(0,0,0,0.05); }
                .dash-title { font-size: 2.5rem; font-weight: 600; color: #1d1d1f; letter-spacing: -0.03em; margin: 0 0 0.5rem 0; }
                .dim-text { color: #86868b; font-weight: 400; }
                .dash-subtitle { font-size: 1rem; color: #86868b; margin: 0; font-weight: 400; }
                
                .cluster-actions { display: flex; gap: 10px; margin-top: 12px; }
                .action-btn { background: #1d1d1f; color: white; padding: 10px 16px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: transform 0.2s; }
                .action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
                .action-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
                .action-btn.secondary { background: rgba(0,0,0,0.04); color: #1d1d1f; border: 1px solid rgba(0,0,0,0.05); }
                
                .pdf-container { background: #ffffff; padding: 1rem; border-radius: 32px; }
                .bento-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; }

                /* ── Liquid Glass Tiles ── */
                .glass-tile {
                    background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(40px) saturate(140%); -webkit-backdrop-filter: blur(40px) saturate(140%);
                    border: 1px solid rgba(255, 255, 255, 1); border-bottom: 1px solid rgba(0, 0, 0, 0.04); border-radius: 28px; padding: 1.8rem;
                    position: relative; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.04), inset 0 2px 4px rgba(255,255,255,1);
                    display: flex; flex-direction: column;
                }

                .viewer-overlay { position: absolute; top: 1.5rem; left: 1.5rem; right: 1.5rem; z-index: 10; display: flex; justify-content: space-between; pointer-events: none; }
                .viewer-controls { display: flex; gap: 8px; }
                .badge { background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); color: white; padding: 6px 12px; border-radius: 10px; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; pointer-events: auto; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); }
                .badge.active { background: #1d1d1f; box-shadow: 0 4px 12px rgba(0,0,0,0.2); border-color: transparent; }
                
                .loader-overlay { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #86868b; font-weight: 500; }
                .spinner { width: 30px; height: 30px; border: 2px solid rgba(0,0,0,0.1); border-top-color: #1d1d1f; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
                @keyframes spin { to { transform: rotate(360deg); } }

                .col-span-12 { grid-column: span 12; } .col-span-8 { grid-column: span 8; } .col-span-6 { grid-column: span 6; } .col-span-4 { grid-column: span 4; } .col-span-3 { grid-column: span 3; }
                @media (max-width: 1200px) { .col-span-4, .col-span-8 { grid-column: span 12; } .col-span-3 { grid-column: span 6; } }
            `}</style>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   3D & UI COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function AnimatedPointCloud({ positions, colors }: { positions: Float32Array; colors: Float32Array }) {
    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (pointsRef.current) {
            // Subtle breathing/rotation effect
            pointsRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
        }
    });

    return (
        <Points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" count={colors.length / 3} args={[colors, 3]} />
            </bufferGeometry>
            <PointMaterial vertexColors size={0.04} sizeAttenuation transparent opacity={0.8} />
        </Points>
    );
}

function SectorNode({ position, onClick, active, color }: { position: [number, number, number]; onClick: () => void; active: boolean; color: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (active && meshRef.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.15;
            meshRef.current.scale.set(scale, scale, scale);
        } else if (meshRef.current) {
            meshRef.current.scale.set(1, 1, 1);
        }
    });

    return (
        <Sphere ref={meshRef} args={[0.2, 32, 32]} position={position} onClick={onClick}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}>
            <meshStandardMaterial color={active ? '#ffffff' : color} emissive={color} emissiveIntensity={active ? 2 : 0.5} transparent opacity={0.9} />
            {active && (
                <Sphere args={[0.3, 16, 16]}>
                    <meshBasicMaterial color={color} transparent opacity={0.2} wireframe />
                </Sphere>
            )}
        </Sphere>
    );
}

const WidgetHeader = ({ title }: { title: string }) => (
    <>
        <h2 className="widget-title">{title}</h2>
        <style jsx>{` .widget-title { font-size: 1rem; font-weight: 600; color: #1d1d1f; margin: 0 0 1rem 0; letter-spacing: -0.01em; display: flex; align-items: center; gap: 8px; pointer-events: auto; } .widget-title::before { content: ""; display: block; width: 4px; height: 14px; background: #1d1d1f; border-radius: 2px; } `}</style>
    </>
);

function SectorDetails({ sector }: { sector: any }) {
    if (!sector) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center', color: '#86868b' }}>
                <p>Select a node to view telemetry.</p>
            </div>
        );
    }

    // Dynamic color coding based on health score pulled from DB
    const bgClass = sector.health_score < 60 ? 'rgba(239,68,68,0.1)' : sector.health_score < 80 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)';
    const textClass = sector.health_score < 60 ? '#ef4444' : sector.health_score < 80 ? '#f59e0b' : '#10b981';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title={`Node ${sector.sector_number} Telemetry`} />

            <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#86868b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>Zone Classification</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 600, color: '#1d1d1f', marginTop: '4px' }}>{sector.zone_classification}</div>
                <div style={{ display: 'inline-block', marginTop: '12px', padding: '6px 12px', background: bgClass, color: textClass, borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                    {sector.status_label}
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#86868b', fontSize: '0.95rem', fontWeight: 500 }}>Structural Integrity</span>
                    <span style={{ color: '#1d1d1f', fontSize: '1.05rem', fontWeight: 600 }}>{sector.health_score}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#86868b', fontSize: '0.95rem', fontWeight: 500 }}>Depth Horizon</span>
                    <span style={{ color: '#1d1d1f', fontSize: '1.05rem', fontWeight: 600 }}>{sector.depth_horizon}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ color: '#86868b', fontSize: '0.95rem', fontWeight: 500 }}>Defect Cocktail Flag</span>
                    <span style={{ color: '#1d1d1f', fontSize: '0.95rem', fontWeight: 400, lineHeight: 1.5 }}>
                        {sector.defect_cocktail_flag || "Nominal parameters."}
                    </span>
                </div>
            </div>
        </div>
    );
}

function MicroKPI({ title, value, unit, alert = false }: any) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{title}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 500, color: alert ? '#ef4444' : '#1d1d1f', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</span>
                <span style={{ fontSize: '1rem', color: '#86868b', fontWeight: 500 }}>{unit}</span>
            </div>
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', padding: '12px', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: '#86868b', fontWeight: 600 }}>DEPTH: {label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: entry.color }}>
                        {entry.name}: {Number(entry.value).toFixed(1)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

function DepthProfileChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) return <div style={{ padding: '2rem', color: '#86868b' }}>Awaiting Depth Profile Data...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <WidgetHeader title="Subsurface Depth Profile (VWC vs. Density)" />
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                        <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="depth_label" tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#86868b' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" name="Moisture VWC" dataKey="moisture_vwc" stroke="#3b82f6" strokeWidth={2} fill="url(#colorMoisture)" />
                    <Area type="monotone" name="Soil Density" dataKey="soil_density" stroke="#f59e0b" strokeWidth={2} fill="url(#colorDensity)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}