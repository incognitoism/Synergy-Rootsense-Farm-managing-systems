"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
//import LiquidGlass from "@/app/components/LiquidGlass";

export default function StepTwoPage() {
    const router = useRouter();

    const [mode, setMode] = useState<"auto" | "custom">("auto");
    const [showAdvanced, setShowAdvanced] = useState(false);

    const [form, setForm] = useState({
        farmName: "",
        landArea: "",
        areaUnit: "acres",
        cropType: "",
        farmType: "",

        soilType: "",
        irrigationType: "",
        climateCategory: "",

        connectivityType: "",
        powerAvailability: "",

        dataModules: [] as string[],
        reportingInterval: "15 minutes",

        sensorNodes: "",
        meshDensity: "standard",
        processingType: "hybrid",
        redundancyLevel: "basic",
        concurrentDevices: "",

        // Compute Tier Selection
        computeTier: "standard", // starter, standard, advanced

        // Advanced
        apiAccess: false,
        thirdPartyIntegrations: "",
        historicalData: false,
    });

    const [errors, setErrors] = useState<any>({});

    const clearError = (field: string) => {
        setErrors((prev: any) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    // --- Auto-Calculated Metrics (Derived State) ---
    const autoMetrics = useMemo(() => {
        const area = parseFloat(form.landArea) || 0;
        const multiplier = form.areaUnit === "hectares" ? 2.47 : 1;
        const effectiveAcres = area * multiplier;

        // Dummy logic for smart calculation based on farm size
        const nodes = effectiveAcres > 0 ? Math.max(5, Math.ceil(effectiveAcres * 3.5)) : 42;
        const density = effectiveAcres > 50 ? "High Precision" : "Standard";
        const dataGB = Math.max(1, Math.ceil(nodes * 0.85)); // Roughly 0.85GB per node/month

        return {
            nodes,
            density,
            dataGB,
        };
    }, [form.landArea, form.areaUnit]);

    const handleModuleToggle = (module: string) => {
        setForm(prev => {
            const exists = prev.dataModules.includes(module);
            const updated = exists
                ? prev.dataModules.filter(m => m !== module)
                : [...prev.dataModules, module];
            if (updated.length > 0) clearError("dataModules");
            return { ...prev, dataModules: updated };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let newErrors: any = {};

        if (!form.farmName) newErrors.farmName = "Farm Name is required.";
        if (!form.landArea) {
            newErrors.landArea = "Land Area is required.";
        } else if (parseFloat(form.landArea) <= 0) {
            newErrors.landArea = "Land Area must be a positive number.";
        }
        if (!form.cropType) newErrors.cropType = "Crop type is required.";
        if (!form.farmType) newErrors.farmType = "Farm Infrastructure is required.";
        if (!form.soilType) newErrors.soilType = "Soil Type is required.";
        if (!form.irrigationType) newErrors.irrigationType = "Irrigation System is required.";
        if (!form.connectivityType) newErrors.connectivityType = "Connectivity Type is required.";
        if (!form.powerAvailability) newErrors.powerAvailability = "Power Availability is required.";
        if (form.dataModules.length === 0) newErrors.dataModules = "Select at least one monitoring module.";
        if (mode === "custom" && !form.sensorNodes) {
            newErrors.sensorNodes = "Sensor node count is required in custom mode.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstErrorKey = Object.keys(newErrors)[0];
            const el = document.querySelector(`[data-field="${firstErrorKey}"]`);
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        localStorage.setItem("cluster_step_2", JSON.stringify({ ...form, mode }));
        router.push("/clusters/new/step-3");
    };

    return (
        <div className="page">
            {/* Ambient Glows */}
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>


            <div className="content-wrapper slide-up">

                <div className="header-section">
                    <ProgressBar currentStep={2} totalSteps={3} />
                    <h1 className="main-title">Cluster Deployment</h1>
                    <p className="sub-title">Configuration · Step 2 of 3</p>
                </div>

                <form onSubmit={handleSubmit} className="form stagger-in">

                    <div className="mode-toggle-wrapper">
                        <label className="section-title">Provisioning Mode</label>
                        <div className="segmented-control">
                            <div className={`sliding-bg ${mode}`} />
                            <button
                                type="button"
                                className={`segment-btn ${mode === "auto" ? "active" : ""}`}
                                onClick={() => setMode("auto")}
                            >
                                <span className="icon">✨</span> Auto-Optimized <span className="badge">Rec</span>
                            </button>
                            <button
                                type="button"
                                className={`segment-btn ${mode === "custom" ? "active" : ""}`}
                                onClick={() => setMode("custom")}
                            >
                                <span className="icon"></span>CUSTOM
                            </button>
                        </div>
                        <p className="mode-description">
                            {mode === "auto"
                                ? "Synergy will automatically calculate optimal node density and mesh topology based on your farm size and crop type."
                                : "Full manual control over sensor counts, topology, and redundancy thresholds."}
                        </p>
                    </div>

                    {/* --- Compute Tier Selector --- */}
                    <Section title="Processing & Compute Tier">
                        <div className="tier-grid">
                            <TierCard
                                title="CORE"
                                desc="TIER 1"
                                gradient="linear-gradient(135deg, #0ea5e9, #2563eb)"
                                selected={form.computeTier === "starter"}
                                onClick={() => setForm({ ...form, computeTier: "starter" })}
                            />
                            <TierCard
                                title="PRO"
                                desc="TIER 2"
                                gradient="linear-gradient(135deg, #8b5cf6, #d946ef)"
                                selected={form.computeTier === "standard"}
                                onClick={() => setForm({ ...form, computeTier: "standard" })}
                                popular
                            />
                            <TierCard
                                title="ULTRA"
                                desc="TIER 3"
                                gradient="linear-gradient(135deg, #f43f5e, #f97316)"
                                selected={form.computeTier === "advanced"}
                                onClick={() => setForm({ ...form, computeTier: "advanced" })}
                            />
                        </div>
                    </Section>

                    {/* --- Farm Profile --- */}
                    <Section title="Farm Profile">
                        <Input
                            label="Farm Name"
                            placeholder="e.g. Valley View Orchards"
                            value={form.farmName}
                            onChange={(v: string) => { setForm({ ...form, farmName: v }); clearError("farmName"); }}
                            error={errors.farmName}
                            dataField="farmName"
                        />
                        <div className="grid-2-asym">
                            <Input
                                label="Total Land Area"
                                type="number"
                                placeholder="0.00"
                                value={form.landArea}
                                onChange={(v: string) => { setForm({ ...form, landArea: v }); clearError("landArea"); }}
                                error={errors.landArea}
                                dataField="landArea"
                            />
                            <Select
                                label="Unit"
                                value={form.areaUnit}
                                onChange={(v: string) => setForm({ ...form, areaUnit: v })}
                                noPlaceholder
                                options={[
                                    { value: "acres", label: "Acres" },
                                    { value: "hectares", label: "Hectares" },
                                ]}
                            />
                        </div>
                        <div className="grid-2">
                            <Select
                                label="Primary Crop Type"
                                value={form.cropType}
                                onChange={(v: string) => { setForm({ ...form, cropType: v }); clearError("cropType"); }}
                                error={errors.cropType}
                                dataField="cropType"
                                options={[
                                    { value: "rice", label: "Rice" },
                                    { value: "wheat", label: "Wheat" },
                                    { value: "cotton", label: "Cotton" },
                                    { value: "sugarcane", label: "Sugarcane" },
                                    { value: "vegetables", label: "Vegetables" },
                                    { value: "fruits", label: "Fruits / Orchard" },
                                    { value: "hydroponic", label: "Hydroponic Crops" },
                                    { value: "mixed", label: "Mixed / Other" },
                                ]}
                            />
                            <Select
                                label="Farm Infrastructure"
                                value={form.farmType}
                                onChange={(v: string) => { setForm({ ...form, farmType: v }); clearError("farmType"); }}
                                error={errors.farmType}
                                dataField="farmType"
                                options={[
                                    { value: "open", label: "Open Field" },
                                    { value: "greenhouse", label: "Greenhouse" },
                                    { value: "hydroponic", label: "Hydroponic Setup" },
                                    { value: "vertical", label: "Vertical Farming" },
                                    { value: "mixed", label: "Mixed Infrastructure" },
                                ]}
                            />
                        </div>
                    </Section>

                    {/* --- Environmental Context & Connectivity --- */}
                    <div className="grid-2">
                        <Section title="Environment Context">
                            <Select
                                label="Soil Type"
                                value={form.soilType}
                                onChange={(v: string) => { setForm({ ...form, soilType: v }); clearError("soilType"); }}
                                error={errors.soilType}
                                dataField="soilType"
                                options={[
                                    { value: "loamy", label: "Loamy" },
                                    { value: "clay", label: "Clay" },
                                    { value: "sandy", label: "Sandy" },
                                    { value: "mixed", label: "Mixed" },
                                    { value: "unknown", label: "Unknown / Hydro" },
                                ]}
                            />
                            <div style={{ height: "1rem" }}></div>
                            <Select
                                label="Irrigation System"
                                value={form.irrigationType}
                                onChange={(v: string) => { setForm({ ...form, irrigationType: v }); clearError("irrigationType"); }}
                                error={errors.irrigationType}
                                dataField="irrigationType"
                                options={[
                                    { value: "drip", label: "Drip Irrigation" },
                                    { value: "sprinkler", label: "Sprinklers" },
                                    { value: "flood", label: "Flood" },
                                    { value: "hydro", label: "Hydro Circulation" },
                                    { value: "manual", label: "Manual" },
                                ]}
                            />
                        </Section>

                        <Section title="Power & Telemetry">
                            <Select
                                label="Connectivity Type"
                                value={form.connectivityType}
                                onChange={(v: string) => { setForm({ ...form, connectivityType: v }); clearError("connectivityType"); }}
                                error={errors.connectivityType}
                                dataField="connectivityType"
                                options={[
                                    { value: "wifi", label: "WiFi" },
                                    { value: "lora", label: "LoRaWAN" },
                                    { value: "cellular", label: "Cellular (4G/5G)" },
                                    { value: "satellite", label: "Satellite" },
                                    { value: "hybrid", label: "Hybrid / Mesh" },
                                ]}
                            />
                            <div style={{ height: "1rem" }}></div>
                            <Select
                                label="Power Availability"
                                value={form.powerAvailability}
                                onChange={(v: string) => { setForm({ ...form, powerAvailability: v }); clearError("powerAvailability"); }}
                                error={errors.powerAvailability}
                                dataField="powerAvailability"
                                options={[
                                    { value: "grid", label: "Continuous Grid" },
                                    { value: "solar", label: "Solar / Off-grid" },
                                    { value: "hybrid", label: "Hybrid" },
                                    { value: "unstable", label: "Unstable / Intermittent" },
                                ]}
                            />
                        </Section>
                    </div>

                    {/* --- Data Preferences --- */}
                    <Section title="Monitoring & Telemetry Modules">
                        {errors.dataModules && <div data-field="dataModules" className="module-error">{errors.dataModules}</div>}
                        <div className="checkbox-grid">
                            {[
                                "Soil Moisture", "Soil Density", "pH Monitoring",
                                "Temperature", "Humidity", "Nutrient Profiling",
                                "Root Depth Mapping", "Weather Integration",
                                "Irrigation Automation", "Crop Yield Analytics"
                            ].map(module => (
                                <label key={module} className={`glass-checkbox ${form.dataModules.includes(module) ? 'active' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={form.dataModules.includes(module)}
                                        onChange={() => handleModuleToggle(module)}
                                    />
                                    <span className="cb-icon">{form.dataModules.includes(module) ? '✓' : '+'}</span>
                                    <span className="cb-label">{module}</span>
                                </label>
                            ))}
                        </div>
                        <div style={{ marginTop: "1.5rem" }}>
                            <Select
                                label="Data Reporting Interval"
                                value={form.reportingInterval}
                                onChange={(v: string) => setForm({ ...form, reportingInterval: v })}
                                options={[
                                    { value: "5m", label: "Every 5 minutes (Intensive)" },
                                    { value: "15m", label: "Every 15 minutes (Standard)" },
                                    { value: "30m", label: "Every 30 minutes" },
                                    { value: "hourly", label: "Hourly" },
                                    { value: "daily", label: "Daily Summary" },
                                ]}
                            />
                        </div>
                    </Section>

                    {/* --- AUTO OR CUSTOM CONDITIONAL RENDERING --- */}
                    {mode === "auto" ? (
                        <div className="auto-metrics-panel slide-up">
                            <h4 className="panel-title">Auto-Calculated Deployment</h4>
                            <p className="panel-desc">Based on your {form.landArea || "0"} {form.areaUnit} configuration.</p>

                            <div className="metrics-grid">
                                <div className="metric-box">
                                    <span className="m-label">Est. Sensor Nodes</span>
                                    <span className="m-value">{autoMetrics.nodes}</span>
                                </div>
                                <div className="metric-box">
                                    <span className="m-label">Mesh Density</span>
                                    <span className="m-value">{autoMetrics.density}</span>
                                </div>
                                <div className="metric-box">
                                    <span className="m-label">Est. Monthly Data</span>
                                    <span className="m-value">{autoMetrics.dataGB} <span className="text-sm text-gray-400">GB</span></span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="custom-overrides slide-up">
                            <Section title="Manual Deployment Overrides">
                                <div className="grid-2">
                                    <Input
                                        label="Target Number of Sensor Nodes"
                                        type="number"
                                        value={form.sensorNodes}
                                        onChange={(v: string) => { setForm({ ...form, sensorNodes: v }); clearError("sensorNodes"); }}
                                        error={errors.sensorNodes}
                                        dataField="sensorNodes"
                                    />
                                    <Select
                                        label="Mesh Density"
                                        value={form.meshDensity}
                                        onChange={(v: string) => setForm({ ...form, meshDensity: v })}
                                        options={[
                                            { value: "low", label: "Low Density" },
                                            { value: "standard", label: "Standard Density" },
                                            { value: "high", label: "High Precision (Dense)" },
                                        ]}
                                    />
                                </div>
                                <div className="grid-2">
                                    <Select
                                        label="Central Processing Type"
                                        value={form.processingType}
                                        onChange={(v: string) => setForm({ ...form, processingType: v })}
                                        options={[
                                            { value: "onsite", label: "On-site Edge Only" },
                                            { value: "cloud", label: "Cloud-Connected" },
                                            { value: "hybrid", label: "Hybrid (Edge + Cloud)" },
                                        ]}
                                    />
                                    <Select
                                        label="Redundancy Level"
                                        value={form.redundancyLevel}
                                        onChange={(v: string) => setForm({ ...form, redundancyLevel: v })}
                                        options={[
                                            { value: "none", label: "None (Single Point)" },
                                            { value: "basic", label: "Basic Failover" },
                                            { value: "full", label: "Full Redundancy (Active-Active)" },
                                        ]}
                                    />
                                </div>
                            </Section>
                        </div>
                    )}

                    {/* --- Optional Advanced Settings --- */}
                    <div className="advanced-section">
                        <button
                            type="button"
                            className="toggle-advanced-btn"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                            Advanced API & Integration Settings {showAdvanced ? "▲" : "▼"}
                        </button>

                        {showAdvanced && (
                            <div className="advanced-content slide-up">
                                <label className="agreement label-hover" style={{ marginBottom: "1rem" }}>
                                    <input
                                        type="checkbox"
                                        className="custom-checkbox"
                                        checked={form.apiAccess}
                                        onChange={(e) => setForm({ ...form, apiAccess: e.target.checked })}
                                    />
                                    <span>Enable Developer API Access (Keys generated in Dashboard)</span>
                                </label>
                                <label className="agreement label-hover" style={{ marginBottom: "1.5rem" }}>
                                    <input
                                        type="checkbox"
                                        className="custom-checkbox"
                                        checked={form.historicalData}
                                        onChange={(e) => setForm({ ...form, historicalData: e.target.checked })}
                                    />
                                    <span>Import Historical Farm Data upon initialization</span>
                                </label>
                                <Input
                                    label="Third-Party ERP/Software Integrations (Optional)"
                                    placeholder="e.g. John Deere Operations Center, SAP..."
                                    value={form.thirdPartyIntegrations}
                                    onChange={(v: string) => setForm({ ...form, thirdPartyIntegrations: v })}
                                />
                            </div>
                        )}
                    </div>

                    {/* --- Footer Buttons --- */}
                    <div className="footer-actions multi-btn">
                        <button type="button" onClick={() => router.back()} className="secondary-btn">
                            ← Back
                        </button>
                        <button type="submit" className="primary-btn">
                            Review & Launch Cluster <span className="arrow">→</span>
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 4rem 1rem 6rem 1rem;
          background: #ffffff;
          position: relative;
          overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* --- Ambient Glows --- */
        .ambient-glow {
          position: absolute; border-radius: 50%; filter: blur(130px);
          opacity: 0.25; z-index: 0; pointer-events: none;
        }
        .glow-1 {
          width: 700px; height: 700px;
          background: linear-gradient(to right, #6366f1, #a855f7);
          top: -20%; left: -15%; animation: breathe 12s ease-in-out infinite alternate;
        }
        .glow-2 {
          width: 600px; height: 600px;
          background: linear-gradient(to right, #0ea5e9, #14b8a6);
          bottom: -15%; right: -10%; animation: breathe 15s ease-in-out infinite alternate-reverse;
        }
        @keyframes breathe { 0% { transform: scale(1); } 100% { transform: scale(1.05); } }

        /* --- Layout --- */
        .content-wrapper { width: 100%; max-width: 680px; position: relative; z-index: 2; }
        .slide-up { animation: slideUpFade 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        .header-section { margin-bottom: 3rem; text-align: left; }
        .main-title { font-size: 2.2rem; font-weight: 800; color: #1e293b; margin: 1.5rem 0 0.5rem 0; letter-spacing: -0.03em; }
        .sub-title { font-size: 1.05rem; color: #64748b; margin: 0; font-weight: 500; }

        .form { display: flex; flex-direction: column; gap: 3rem; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .grid-2-asym { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        @media (max-width: 640px) { 
          .grid-2, .grid-2-asym { grid-template-columns: 1fr; gap: 1.5rem; } 
          .tier-grid { grid-template-columns: 1fr !important; }
        }

        /* --- Segmented Control --- */
        .mode-toggle-wrapper { display: flex; flex-direction: column; gap: 0.75rem; }
        .segmented-control {
          position: relative; display: flex; background: rgba(241, 245, 249, 0.8);
          backdrop-filter: blur(8px); border-radius: 16px; padding: 0.35rem; width: 100%;
          border: 1px solid #e2e8f0;
        }
        .sliding-bg {
          position: absolute; top: 0.35rem; bottom: 0.35rem; width: calc(50% - 0.35rem);
          background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .sliding-bg.auto { transform: translateX(0); }
        .sliding-bg.custom { transform: translateX(100%); }
        .segment-btn {
          flex: 1; position: relative; z-index: 2; background: none; border: none;
          padding: 0.8rem 0; font-size: 0.95rem; font-weight: 600; color: #64748b;
          cursor: pointer; transition: color 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .segment-btn.active { color: #0f172a; }
        .badge { background: #818cf8; color: white; font-size: 0.65rem; padding: 0.15rem 0.4rem; border-radius: 6px; font-weight: 700; text-transform: uppercase;}
        .mode-description { font-size: 0.85rem; color: #64748b; line-height: 1.4; padding: 0 0.5rem; }

        /* --- Tier Grid --- */
        .tier-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }

        /* --- Module Error --- */
        .module-error { color: #ef4444; font-size: 0.85rem; font-weight: 500; margin-bottom: 0.5rem; }

        /* --- Glass Checkbox Grid --- */
        .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .glass-checkbox {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.5); border: 1px solid #cbd5e1;
          border-radius: 12px; cursor: pointer; transition: all 0.2s ease;
        }
        .glass-checkbox input { display: none; }
        .glass-checkbox:hover { background: rgba(255,255,255,0.8); border-color: #94a3b8; }
        .glass-checkbox.active {
          background: #ffffff; border-color: #4f46e5;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.08);
        }
        .cb-icon {
          width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;
          border-radius: 6px; background: #f1f5f9; color: #64748b; font-size: 0.8rem; font-weight: bold;
          transition: all 0.2s;
        }
        .glass-checkbox.active .cb-icon { background: #4f46e5; color: white; }
        .cb-label { font-size: 0.85rem; font-weight: 600; color: #334155; }

        /* --- Auto Panel --- */
        .auto-metrics-panel {
          background: linear-gradient(135deg, rgba(248,250,252,0.9), rgba(255,255,255,0.9));
          border: 1px solid rgba(79,70,229,0.2); border-radius: 16px; padding: 1.5rem;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); position: relative; overflow: hidden;
        }
        .auto-metrics-panel::before {
          content: ''; position: absolute; top:0; left:0; right:0; height: 4px;
          background: linear-gradient(to right, #6366f1, #a855f7);
        }
        .panel-title { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0 0 0.2rem 0; }
        .panel-desc { font-size: 0.85rem; color: #64748b; margin: 0 0 1.5rem 0; }
        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .metric-box { display: flex; flex-direction: column; gap: 0.3rem; }
        .m-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 600; }
        .m-value { font-size: 1.5rem; font-weight: 800; color: #0f172a; }

        /* --- Advanced Toggle --- */
        .advanced-section { border-top: 1px solid #e2e8f0; padding-top: 1.5rem; }
        .toggle-advanced-btn {
          background: none; border: none; font-size: 0.9rem; font-weight: 600; color: #64748b;
          cursor: pointer; display: flex; align-items: center; gap: 0.5rem; padding: 0;
          transition: color 0.2s;
        }
        .toggle-advanced-btn:hover { color: #0f172a; }
        .advanced-content { margin-top: 1.5rem; padding: 1.5rem; background: rgba(248,250,252,0.5); border-radius: 12px; border: 1px dashed #cbd5e1; }

        /* --- Footer --- */
        .footer-actions { margin-top: 1rem; padding-top: 2rem; border-top: 1px solid rgba(0,0,0,0.06); }
        .multi-btn { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        
        .agreement { display: flex; gap: 0.75rem; font-size: 0.9rem; color: #475569; align-items: flex-start; cursor: pointer; padding: 0.5rem; border-radius: 8px; transition: background 0.2s; }
        .label-hover:hover { background: rgba(0,0,0,0.02); }
        .custom-checkbox { marginTop: 0.2rem; width: 1.1rem; height: 1.1rem; accent-color: #4f46e5; cursor: pointer; }

        .secondary-btn {
          padding: 1rem 1.5rem; border-radius: 12px; border: 1px solid #cbd5e1;
          background: white; color: #334155; font-size: 1rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s ease;
        }
        .secondary-btn:hover { background: #f8fafc; border-color: #94a3b8; }
        
        .primary-btn {
          padding: 1rem 2rem; border-radius: 12px; border: none; background: #1e293b; color: white;
          font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease;
          display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .primary-btn:hover { background: #334155; transform: translateY(-1px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .primary-btn:active { transform: translateY(0px); }
        .arrow { transition: transform 0.2s ease; }
        .primary-btn:hover .arrow { transform: translateX(3px); }
      `}</style>
        </div>
    );
}

/* --- Sub-Components --- */

function TierCard({ title, desc, gradient, selected, onClick, popular }: any) {
    return (
        <div className={`tier-card ${selected ? 'selected' : ''}`} onClick={onClick}>
            {popular && <div className="popular-badge">Most Popular</div>}
            <div className="tier-gradient-text" style={{ backgroundImage: gradient }}>{title}</div>
            <p className="tier-desc">{desc}</p>

            <style jsx>{`
        .tier-card {
          position: relative; padding: 1.5rem 1.2rem; border-radius: 16px;
          background: rgba(255,255,255,0.6); border: 2px solid #e2e8f0;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          display: flex; flex-direction: column; gap: 0.5rem; overflow: hidden;
        }
        .tier-card:hover { border-color: #cbd5e1; transform: translateY(-2px); background: rgba(255,255,255,0.9); }
        .tier-card.selected {
          border-color: transparent; background: #ffffff;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08), inset 0 0 0 2px #4f46e5;
        }
        .popular-badge {
          position: absolute; top: 0; right: 0; background: #4f46e5; color: white;
          font-size: 0.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
          padding: 0.25rem 0.6rem; border-bottom-left-radius: 12px;
        }
        .tier-gradient-text {
          font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em;
          background-size: 200% auto; color: transparent; background-clip: text; -webkit-background-clip: text;
          animation: shine 4s linear infinite;
        }
        @keyframes shine { to { background-position: 200% center; } }
        .tier-desc { font-size: 0.8rem; color: #64748b; line-height: 1.4; margin: 0; }
      `}</style>
        </div>
    );
}

function ProgressBar({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
    return (
        <div className="progress-bar-container">
            {steps.map((step) => (
                <div key={step} className={`progress-segment ${step <= currentStep ? 'active' : ''} ${step === currentStep ? 'current' : ''}`}></div>
            ))}
            <style jsx>{`
        .progress-bar-container { display: flex; gap: 0.5rem; width: 100%; max-width: 240px; margin-bottom: 1rem; }
        .progress-segment { height: 6px; flex: 1; background: #e2e8f0; border-radius: 3px; transition: all 0.4s ease; }
        .progress-segment.active { background: #818cf8; }
        .progress-segment.current { background: #4f46e5; box-shadow: 0 0 10px rgba(79, 70, 229, 0.4); }
      `}</style>
        </div>
    );
}

function Section({ title, children }: any) {
    return (
        <div>
            <h3 className="section-title">{title}</h3>
            <div className="section-content">{children}</div>
            <style jsx>{`
        .section-title {
          font-size: 0.8rem; font-weight: 800; letter-spacing: 0.05em;
          text-transform: uppercase; color: #475569; margin-bottom: 1.25rem;
        }
        .section-content { display: flex; flex-direction: column; gap: 1.5rem; }
      `}</style>
        </div>
    );
}

function Input({ label, value, onChange, type = "text", placeholder, error, dataField }: any) {
    return (
        <div className="input-group" data-field={dataField}>
            <label className="input-label">
                {label} {error && <span className="error-badge">• {error}</span>}
            </label>
            <input
                type={type} value={value} placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className={`input-field ${error ? "has-error" : ""}`}
            />
            <style jsx>{`
        .input-group { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
        .input-label { font-size: 0.9rem; font-weight: 600; color: #334155; display: flex; justify-content: space-between; }
        .error-badge { color: #ef4444; font-weight: 500; font-size: 0.8rem;}
        .input-field {
          width: 100%; padding: 0.9rem 1rem; border-radius: 10px;
          border: 1px solid #cbd5e1; background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px); font-size: 1rem; color: #0f172a; transition: all 0.2s ease;
        }
        .input-field::placeholder { color: #94a3b8; }
        .input-field:hover { border-color: #94a3b8; background: #fff; }
        .input-field:focus { border-color: #4f46e5; background: #fff; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); outline: none;}
        .has-error { border-color: #ef4444; background: #fff5f5; }
      `}</style>
        </div>
    );
}

function Select({ label, value, onChange, options, error, dataField, noPlaceholder }: any) {
    return (
        <div className="input-group" data-field={dataField}>
            <label className="input-label">
                {label} {error && <span className="error-badge">• {error}</span>}
            </label>
            <div className="select-wrapper">
                <select value={value} onChange={(e) => onChange(e.target.value)} className={`input-field select-field ${error ? "has-error" : ""}`}>
                    {!noPlaceholder && <option value="" disabled>Select option...</option>}
                    {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="select-arrow">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
            </div>
            <style jsx>{`
        .input-group { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
        .input-label { font-size: 0.9rem; font-weight: 600; color: #334155; display: flex; justify-content: space-between; }
        .error-badge { color: #ef4444; font-weight: 500; font-size: 0.8rem; }
        .select-wrapper { position: relative; }
        .input-field {
          width: 100%; padding: 0.9rem 1rem; border-radius: 10px;
          border: 1px solid #cbd5e1; background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px); font-size: 1rem; color: #0f172a;
          transition: all 0.2s ease; appearance: none; cursor: pointer;
        }
        .input-field:hover { border-color: #94a3b8; background: #fff; }
        .input-field:focus { border-color: #4f46e5; background: #fff; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); outline: none;}
        .has-error { border-color: #ef4444; background: #fff5f5; }
        .select-arrow { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); pointer-events: none; display: flex; }
      `}</style>
        </div>
    );
}