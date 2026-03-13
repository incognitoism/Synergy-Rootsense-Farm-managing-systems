"use client";

import { useState } from "react";
import Header from "@/app/components/LoginHeader";
import { useRouter } from "next/navigation";

export default function StepOnePage() {
    const router = useRouter();

    const [form, setForm] = useState({
        fullName: "",
        dob: "",
        address: "",
        govtIdType: "aadhaar",
        govtIdNumber: "",
        revenue: "",
        agreeTerms: false,
    });

    const [errors, setErrors] = useState<any>({});
    const [idPreview, setIdPreview] = useState<string | null>(null);
    const [selfPreview, setSelfPreview] = useState<string | null>(null);

    const calculateAge = (dob: string) => {
        if (!dob) return 0;
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const validateGovtId = () => {
        const patterns: any = {
            aadhaar: /^\d{12}$/,
            pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
            passport: /^[A-Z][0-9]{7}$/,
            driving: /^[A-Z]{2}[0-9]{2}[0-9]{11}$/,
        };
        return patterns[form.govtIdType]?.test(form.govtIdNumber);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let newErrors: any = {};

        if (!form.fullName) newErrors.fullName = "Name is required.";
        if (!form.dob || calculateAge(form.dob) < 22) {
            newErrors.dob = "Applicant must be 22 years or older.";
        }
        if (!validateGovtId()) {
            newErrors.govtIdNumber = "Invalid ID format based on type selected.";
        }
        if (!form.agreeTerms) {
            newErrors.agreeTerms = "You must accept the terms to proceed.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {

            localStorage.setItem("cluster_step_1", JSON.stringify(form));
            router.push("/clusters/new/step-2");
        }
    };

    return (
        <div className="page">
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>





            <div className="content-wrapper slide-up">

                {/* --- New Header Section with Progress Bar --- */}
                <div className="header-section">
                    <ProgressBar currentStep={1} totalSteps={3} />
                    <h1 className="main-title">CLUSTER CREATION USER SPECIFIC DATA COLLECTION</h1>
                    <p className="sub-title">Identity Verification · Step 1 of 3</p>
                </div>

                <form onSubmit={handleSubmit} className="form stagger-in">
                    {/* --- Identity Section --- */}
                    <Section title="Personal Details">
                        <div className="grid-2">
                            <Input
                                label="Full Name"
                                placeholder="e.g. Jane Doe"
                                value={form.fullName}
                                onChange={(v: string) => setForm({ ...form, fullName: v })}
                                error={errors.fullName}
                            />
                            <Input
                                label="Date of Birth"
                                type="date"
                                value={form.dob}
                                onChange={(v: string) => setForm({ ...form, dob: v })}
                                error={errors.dob}
                            />
                        </div>
                        <Input
                            label="Primary Registered Address"
                            placeholder="e.g. 123 Innovation Drive, Tech Park..."
                            value={form.address}
                            onChange={(v: string) => setForm({ ...form, address: v })}
                        />
                    </Section>

                    <Section title="Government ID">
                        <div className="grid-2">
                            <Select
                                label="Document Type"
                                value={form.govtIdType}
                                onChange={(v: string) => setForm({ ...form, govtIdType: v })}
                                options={[
                                    { value: "aadhaar", label: "Aadhaar" },
                                    { value: "pan", label: "PAN Card" },
                                    { value: "passport", label: "Passport" },
                                    { value: "driving", label: "Driving License" },
                                ]}
                            />
                            <Input
                                label="Document Number"
                                placeholder="Enter ID number exactly as shown"
                                value={form.govtIdNumber}
                                onChange={(v: string) =>
                                    setForm({ ...form, govtIdNumber: v.toUpperCase() })
                                }
                                error={errors.govtIdNumber}
                            />
                        </div>

                        <div className="grid-2 uploads-grid">
                            <UploadBox
                                label="Front of Government ID"
                                preview={idPreview}
                                onChange={(file: File) => setIdPreview(URL.createObjectURL(file))}
                            />
                            <UploadBox
                                label="Recent Self Photo"
                                preview={selfPreview}
                                onChange={(file: File) => setSelfPreview(URL.createObjectURL(file))}
                            />
                        </div>
                    </Section>

                    {/* --- Financial Section --- */}
                    <Section title="Financial Snapshot">
                        <Select
                            label="Current Monthly Revenue (₹ in Lacs)"
                            value={form.revenue}
                            onChange={(v: string) => setForm({ ...form, revenue: v })}
                            options={[
                                { value: "0-5", label: "Pre-revenue / 0 – 5 Lacs" },
                                { value: "5-20", label: "5 – 20 Lacs" },
                                { value: "20-50", label: "20 – 50 Lacs" },
                                { value: "50+", label: "50+ Lacs" },
                            ]}
                        />
                    </Section>

                    {/* --- Footer --- */}
                    <div className="footer-actions">
                        <label className="agreement label-hover">
                            <input
                                type="checkbox"
                                className="custom-checkbox"
                                checked={form.agreeTerms}
                                onChange={(e) =>
                                    setForm({ ...form, agreeTerms: e.target.checked })
                                }
                            />
                            <span>I confirm the details above are accurate and agree to the Terms of Service.</span>
                        </label>
                        {errors.agreeTerms && (
                            <span className="error-text">{errors.agreeTerms}</span>
                        )}

                        <div className="button-container">
                            <button type="submit" className="primary-btn">
                                Continue to Business Details <span className="arrow">→</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 4rem 1rem 6rem 1rem;
          background: #ffffff; /* Clean White Background */
          position: relative;
          overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* --- Subtler Ambient Glows --- */
        .ambient-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(130px);
          opacity: 0.25; /* Reduced opacity for cleaner look */
          z-index: 0;
          pointer-events: none;
        }
        .glow-1 {
          width: 700px; height: 700px;
          background: linear-gradient(to right, #ffffffff, #ffffffff);
          top: -20%; left: -15%;
          animation: breathe 12s ease-in-out infinite alternate;
        }
        .glow-2 {
          width: 600px; height: 600px;
          background: linear-gradient(to right, #ffffffff, #ffffffff);
          bottom: -15%; right: -10%;
          animation: breathe 15s ease-in-out infinite alternate-reverse;
        }
        @keyframes breathe {
          0% { transform: scale(1) translate(0,0); }
          100% { transform: scale(1.05) translate(20px, 20px); }
        }

        /* --- Content Wrapper --- */
        .content-wrapper {
          width: 100%;
          max-width: 680px;
          position: relative;
          z-index: 2;
        }
        .slide-up { animation: slideUpFade 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* --- New Anchored Header --- */
        .header-section {
          margin-bottom: 3rem;
          text-align: left; /* Anchored left */
        }
        .main-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #1e293b;
          margin: 1.5rem 0 0.5rem 0;
          letter-spacing: -0.03em;
        }
        .sub-title {
          font-size: 1.05rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        /* --- Form Layout --- */
        .form { display: flex; flex-direction: column; gap: 3rem; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .uploads-grid { margin-top: 0.5rem; }
        @media (max-width: 640px) { .grid-2 { grid-template-columns: 1fr; gap: 1.5rem; } }

        /* --- Footer --- */
        .footer-actions {
          margin-top: 1rem; padding-top: 2rem;
          border-top: 1px solid rgba(0,0,0,0.06);
          display: flex; flex-direction: column; gap: 1.5rem;
        }
        .agreement {
          display: flex; gap: 0.75rem; font-size: 0.9rem;
          color: #475569; align-items: flex-start; cursor: pointer;
          padding: 0.5rem; border-radius: 8px; transition: background 0.2s;
        }
        .label-hover:hover { background: rgba(0,0,0,0.02); }
        .custom-checkbox {
          marginTop: 0.2rem; width: 1.1rem; height: 1.1rem; accent-color: #4f46e5; cursor: pointer;
        }
        .error-text { color: #ef4444; font-size: 0.85rem; font-weight: 500; margin-top: -1rem; margin-left: 0.5rem;}
        
        .button-container { display: flex; justify-content: flex-start; }
        .primary-btn {
          padding: 1rem 2rem;
          border-radius: 12px; border: none;
          background: #1e293b; color: white;
          font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s ease;
          display: flex; align-items: center; gap: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .primary-btn:hover {
          background: #334155; transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .primary-btn:active { transform: translateY(0px); }
        .arrow { transition: transform 0.2s ease; }
        .primary-btn:hover .arrow { transform: translateX(3px); }
      `}</style>
        </div>
    );
}

/* --- NEW COMPONENT: Progress Bar --- */
function ProgressBar({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
    return (
        <div className="progress-bar-container">
            {steps.map((step) => (
                <div key={step} className={`progress-segment ${step <= currentStep ? 'active' : ''} ${step === currentStep ? 'current' : ''}`}></div>
            ))}
            <style jsx>{`
        .progress-bar-container {
          display: flex;
          gap: 0.5rem;
          width: 100%;
          max-width: 240px; /* keep it neat */
          margin-bottom: 1rem;
        }
        .progress-segment {
          height: 6px;
          flex: 1;
          background: #e2e8f0; /* inactive grey */
          border-radius: 3px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .progress-segment.active {
          background: #818cf8; /* subtle indigo */
        }
        .progress-segment.current {
           background: #4f46e5; /* deep indigo for current step */
           box-shadow: 0 0 10px rgba(79, 70, 229, 0.4);
        }
      `}</style>
        </div>
    );
}


/* --- Reusable Components (Glassmorphic & Professional) --- */

function Section({ title, children }: any) {
    return (
        <div>
            <h3 className="section-title">{title}</h3>
            <div className="section-content">{children}</div>
            <style jsx>{`
        .section-title {
          font-size: 0.8rem; font-weight: 800; letter-spacing: 0.05em;
          text-transform: uppercase; color: #475569;
          margin-bottom: 1.25rem;
        }
        .section-content { display: flex; flex-direction: column; gap: 1.5rem; }
      `}</style>
        </div>
    );
}

function Input({ label, value, onChange, type = "text", placeholder, error }: any) {
    return (
        <div className="input-group">
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
          backdrop-filter: blur(8px); font-size: 1rem; color: #0f172a;
          transition: all 0.2s ease;
        }
        .input-field::placeholder { color: #94a3b8; }
        .input-field:hover { border-color: #94a3b8; background: #fff; }
        .input-field:focus { border-color: #4f46e5; background: #fff; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); outline: none;}
        .has-error { border-color: #ef4444; background: #fff5f5; }
        .has-error:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1); }
      `}</style>
        </div>
    );
}

function Select({ label, value, onChange, options }: any) {
    return (
        <div className="input-group">
            <label className="input-label">{label}</label>
            <div className="select-wrapper">
                <select value={value} onChange={(e) => onChange(e.target.value)} className="input-field select-field">
                    {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="select-arrow">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
            </div>
            <style jsx>{`
        .input-group { display: flex; flex-direction: column; gap: 0.5rem; width: 100%; }
        .input-label { font-size: 0.9rem; font-weight: 600; color: #334155; }
        .select-wrapper { position: relative; }
        .input-field {
          width: 100%; padding: 0.9rem 1rem; border-radius: 10px;
          border: 1px solid #cbd5e1; background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px); font-size: 1rem; color: #0f172a;
          transition: all 0.2s ease; appearance: none; cursor: pointer;
        }
        .input-field:hover { border-color: #94a3b8; background: #fff; }
        .input-field:focus { border-color: #4f46e5; background: #fff; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); outline: none;}
        .select-arrow { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); pointer-events: none; display: flex; }
      `}</style>
        </div>
    );
}

function UploadBox({ label, preview, onChange }: any) {
    return (
        <div className="upload-wrapper">
            <label className="upload-box">
                <input type="file" accept="image/*,application/pdf" className="hidden-input" onChange={(e: any) => e.target.files[0] && onChange(e.target.files[0])} />
                {preview ? (
                    <div className="preview-container">
                        {preview.includes('application/pdf') ? <div className="pdf-preview">PDF Document Ready</div> : <img src={preview} className="preview-img" />}
                        <div className="preview-overlay">Replace</div>
                    </div>
                ) : (
                    <div className="upload-content">
                        <div className="upload-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        </div>
                        <span className="upload-text">{label}</span>
                    </div>
                )}
            </label>
            <style jsx>{`
        .upload-box {
          border: 2px dashed #cbd5e1; border-radius: 12px;
          height: 120px; display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.2s;
          position: relative; overflow: hidden;
        }
        .upload-box:hover { border-color: #818cf8; background: rgba(248, 250, 252, 0.8); }
        .hidden-input { display: none; }
        .upload-content { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
        .upload-icon { color: #64748b; transition: color 0.2s; }
        .upload-box:hover .upload-icon { color: #4f46e5; }
        .upload-text { font-size: 0.85rem; font-weight: 600; color: #475569; text-align: center;}
        .preview-container, .preview-img, .preview-overlay { position: absolute; top:0; left:0; width:100%; height:100%; object-fit:cover;}
        .preview-overlay { background: rgba(0,0,0,0.5); color: white; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; font-weight: 600; font-size: 0.9rem;}
        .preview-container:hover .preview-overlay { opacity: 1; }
        .pdf-preview { display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; background: #f1f5f9; color: #475569; font-weight: 600; font-size: 0.9rem; }
      `}</style>
        </div>
    );
}