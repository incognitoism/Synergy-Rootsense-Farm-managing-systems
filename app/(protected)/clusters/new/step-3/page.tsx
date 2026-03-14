"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
//import LiquidGlass from "@/components/LiquidGlass";

const PLANS = {
    starter: { id: "starter", name: "Starter", desc: "Up to 10 nodes • Basic Edge", price: 99 },
    pro: { id: "pro", name: "Professional", desc: "Up to 50 nodes • Intelligence+", price: 249 },
    enterprise: { id: "enterprise", name: "Enterprise", desc: "Unlimited nodes • Quantum Mesh", price: 899 },
};

export default function StepThreePage() {
    const router = useRouter();

    // --- State ---
    const [billingFreq, setBillingFreq] = useState<"monthly" | "annual">("annual");
    const [selectedPlan, setSelectedPlan] = useState<keyof typeof PLANS>("pro");
    const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");

    // Form fields
    const [form, setForm] = useState({
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
        upiId: "",
    });

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [missingSteps, setMissingSteps] = useState<number[]>([]);

    const clearError = (field: string) => {
        setErrors((prev: any) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
        setSubmitError(null);
    };

    // Check localStorage integrity on mount
    useEffect(() => {
        const missing: number[] = [];
        const step1 = localStorage.getItem("cluster_step_1");
        const step2 = localStorage.getItem("cluster_step_2");
        if (!step1 || step1 === "{}") missing.push(1);
        if (!step2 || step2 === "{}") missing.push(2);
        setMissingSteps(missing);
    }, []);

    // --- Calculations ---
    const planDetails = PLANS[selectedPlan];
    const monthlyRate = billingFreq === "annual" ? Math.round(planDetails.price * 0.9) : planDetails.price;
    const billedAmount = billingFreq === "annual" ? monthlyRate * 12 : monthlyRate;

    // --- Validation ---
    const validateForm = (): boolean => {
        const newErrors: any = {};

        if (paymentMethod === "card") {
            if (!form.cardName.trim()) newErrors.cardName = "Cardholder name is required.";
            if (!form.cardNumber || form.cardNumber.length !== 16) newErrors.cardNumber = "Card number must be 16 digits.";
            if (!form.expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
                newErrors.expiry = "Enter a valid expiry date (MM/YY).";
            } else {
                const [mm, yy] = form.expiry.split("/").map(Number);
                const now = new Date();
                const expDate = new Date(2000 + yy, mm);
                if (expDate <= now) newErrors.expiry = "Card has expired.";
            }
            if (!form.cvv || form.cvv.length < 3) newErrors.cvv = "CVV must be 3-4 digits.";
        } else {
            if (!form.upiId || !/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(form.upiId)) {
                newErrors.upiId = "Enter a valid UPI ID (e.g. name@upi).";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- Handlers ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConfirmed) return;
        setSubmitError(null);

        if (missingSteps.length > 0) {
            setSubmitError(`Please complete Step ${missingSteps.join(" and Step ")} first.`);
            return;
        }

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const step1 = JSON.parse(localStorage.getItem("cluster_step_1") || "{}");
            const step2 = JSON.parse(localStorage.getItem("cluster_step_2") || "{}");

            const payload = {
                ...step1,
                ...step2,

                billing_frequency: billingFreq,
                selected_plan: selectedPlan,
                payment_method: paymentMethod,

                card_last4: form.cardNumber?.slice(-4) || null,
                upi_id: form.upiId || null,

                status: "pending_approval"
            };

            const res = await fetch("/api/clusters/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setSubmitError(data.error || "Failed to create cluster. Please try again.");
                return;
            }

            const clusterId = data.clusterId;

            // Clean up localStorage
            localStorage.removeItem("cluster_step_1");
            localStorage.removeItem("cluster_step_2");

            router.push(`/clusters/${clusterId}`);

        } catch (error) {
            console.error(error);
            setSubmitError("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page">
            {/* Ambient Glows */}
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>



            {/* Note: Wrapper is wider here to support the 2-column layout */}
            <div className="content-wrapper slide-up">

                <div className="header-section">
                    <ProgressBar currentStep={3} totalSteps={3} />
                    <h1 className="main-title">Finalize & Submit</h1>
                    <p className="sub-title">Review your plan and link a billing method. You will not be charged today.</p>
                </div>

                <form onSubmit={handleSubmit} className="checkout-layout stagger-in">

                    {/* --- LEFT COLUMN: Form --- */}
                    <div className="left-column">

                        {/* 1. Billing Frequency */}
                        <Section title="Billing Cycle">
                            <div className="segmented-control">
                                <div className={`sliding-bg ${billingFreq}`} />
                                <button
                                    type="button"
                                    className={`segment-btn ${billingFreq === "monthly" ? "active" : ""}`}
                                    onClick={() => setBillingFreq("monthly")}
                                >
                                    Monthly
                                </button>
                                <button
                                    type="button"
                                    className={`segment-btn ${billingFreq === "annual" ? "active" : ""}`}
                                    onClick={() => setBillingFreq("annual")}
                                >
                                    Annually <span className="discount-badge">Save 10%</span>
                                </button>
                            </div>
                        </Section>

                        {/* 2. Plan Selection */}
                        <Section title="Select Plan">
                            <div className="plans-grid">
                                {Object.values(PLANS).map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`plan-card ${selectedPlan === plan.id ? "selected" : ""}`}
                                        onClick={() => setSelectedPlan(plan.id as keyof typeof PLANS)}
                                    >
                                        <div className="plan-header">
                                            <h4 className="plan-name">{plan.name}</h4>
                                            {selectedPlan === plan.id && (
                                                <div className="check-circle">✓</div>
                                            )}
                                        </div>
                                        <p className="plan-desc">{plan.desc}</p>
                                        <div className="plan-price">
                                            <span className="currency">$</span>
                                            <span className="amount">
                                                {billingFreq === "annual" ? Math.round(plan.price * 0.9) : plan.price}
                                            </span>
                                            <span className="period">/mo</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* 3. Payment Method */}
                        <Section title="Preferred Billing Method">
                            <div className="payment-tabs">
                                <button
                                    type="button"
                                    className={`pay-tab ${paymentMethod === "card" ? "active" : ""}`}
                                    onClick={() => { setPaymentMethod("card"); setErrors({}); }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                                    Credit / Debit Card
                                </button>
                                <button
                                    type="button"
                                    className={`pay-tab ${paymentMethod === "upi" ? "active" : ""}`}
                                    onClick={() => { setPaymentMethod("upi"); setErrors({}); }}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M7 7h10v10H7z"></path></svg>
                                    UPI
                                </button>
                            </div>

                            <div className="payment-form">
                                {paymentMethod === "card" ? (
                                    <div className="card-inputs">
                                        <Input
                                            label="Name on Card"
                                            placeholder="e.g. Jane Doe"
                                            value={form.cardName}
                                            onChange={(v: string) => { setForm({ ...form, cardName: v }); clearError("cardName"); }}
                                            error={errors.cardName}
                                        />
                                        <Input
                                            label="Card Number"
                                            placeholder="0000 0000 0000 0000"
                                            value={form.cardNumber}
                                            onChange={(v: string) => { setForm({ ...form, cardNumber: v.replace(/\D/g, '').substring(0, 16) }); clearError("cardNumber"); }}
                                            error={errors.cardNumber}
                                        />
                                        <div className="grid-2">
                                            <Input
                                                label="Expiry Date"
                                                placeholder="MM/YY"
                                                value={form.expiry}
                                                onChange={(v: string) => {
                                                    let cleaned = v.replace(/[^\d/]/g, '');
                                                    // Auto-insert / after MM
                                                    if (cleaned.length === 2 && !cleaned.includes('/') && form.expiry.length < cleaned.length) {
                                                        cleaned = cleaned + '/';
                                                    }
                                                    if (cleaned.length <= 5) {
                                                        setForm({ ...form, expiry: cleaned });
                                                        clearError("expiry");
                                                    }
                                                }}
                                                error={errors.expiry}
                                            />
                                            <Input
                                                label="CVV"
                                                placeholder="123"
                                                type="password"
                                                value={form.cvv}
                                                onChange={(v: string) => { setForm({ ...form, cvv: v.replace(/\D/g, '').substring(0, 4) }); clearError("cvv"); }}
                                                error={errors.cvv}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="upi-inputs">
                                        <Input
                                            label="UPI ID / VPA"
                                            placeholder="e.g. username@bank"
                                            value={form.upiId}
                                            onChange={(v: string) => { setForm({ ...form, upiId: v }); clearError("upiId"); }}
                                            error={errors.upiId}
                                        />
                                    </div>
                                )}
                            </div>


                            {/* Payment Logos */}
                            <div className="payment-logos">
                                {/* Visa */}
                                <svg className="logo-svg" width="38" height="24" viewBox="0 0 48 32" fill="currentColor">
                                    <path d="M18.7 8.5L16.2 23h-4.3l2.6-14.5h4.2zm11.2 0c-1.1-.4-2.8-.8-4.8-.8-5.3 0-9 2.8-9.1 6.8-.1 2.9 2.5 4.5 4.4 5.5 2 1 2.6 1.6 2.6 2.5 0 1.4-1.7 2-3.3 2-2.1 0-3.3-.4-4.6-1l-.6 3.1c1.2.6 3.3 1.1 5.5 1.1 5.7 0 9.4-2.8 9.5-7.1 0-2.4-1.4-4.1-4.2-5.4-1.8-.9-2.9-1.5-2.9-2.4 0-.8.9-1.7 3.2-1.7 1.7-.1 3 .4 4 l.6-2.6zM45 8.5h-3.3c-1 0-1.8.3-2.3 1.2l-6.6 13.3h4.5s.7-2.1.9-2.7h5.5c.2.8.5 2.7.5 2.7H48L45 8.5zm-3.6 8.5l1.7-4.7 1 4.7h-2.7zM9.4 8.5L6.6 18.5 5.6 9.8C5.4 8.9 4.8 8.5 3.9 8.5H.1L0 9.1c.8.2 1.7.5 2.3.8 1.1.5 1.4.9 1.6 1.7l3.2 11.4h4.6l6.8-14.5H9.4z" />
                                </svg>

                                {/* Mastercard */}
                                <svg className="logo-svg" width="38" height="24" viewBox="0 0 48 32" fill="currentColor">
                                    <circle cx="16" cy="16" r="10" fillOpacity="0.6" />
                                    <circle cx="32" cy="16" r="10" fillOpacity="0.8" />
                                </svg>

                                {/* Amex */}
                                <svg className="logo-svg" width="38" height="24" viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <rect x="2" y="4" width="44" height="24" rx="4" />
                                    <text x="24" y="21" fontSize="12" fontWeight="900" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="sans-serif">AMEX</text>
                                </svg>

                                {/* UPI */}
                                <svg className="logo-svg" width="38" height="24" viewBox="0 0 48 32" fill="currentColor">
                                    <path d="M10 8v9.4c0 2.8 2 4.6 4.6 4.6s4.6-1.8 4.6-4.6V8h-3v9.4c0 1.1-.7 1.8-1.6 1.8s-1.6-.7-1.6-1.8V8h-3zm13 0v14h3v-4.5h3.6c2.8 0 4.9-1.9 4.9-4.7 0-2.8-2.1-4.8-4.9-4.8H23zm3 2.5h2.6c1.3 0 2.2.8 2.2 2.3 0 1.4-.9 2.2-2.2 2.2H26v-4.5zM37 8v14h3V8h-3z" />
                                </svg>
                            </div>
                        </Section>
                    </div>

                    {/* --- RIGHT COLUMN: Sticky Summary --- */}
                    <div className="right-column">
                        <div className="summary-card">
                            <h3 className="summary-title">Deployment Summary</h3>

                            <div className="summary-line">
                                <span className="sl-label">Plan</span>
                                <span className="sl-value font-medium">{planDetails.name}</span>
                            </div>
                            <div className="summary-line">
                                <span className="sl-label">Billing Cycle</span>
                                <span className="sl-value capitalize">{billingFreq}</span>
                            </div>

                            <div className="divider" />

                            <div className="summary-line total-line">
                                <span className="sl-label">Estimated Rate</span>
                                <div className="total-price-box">
                                    <span className="sl-value large">${billedAmount}</span>
                                    <span className="sl-period">/{billingFreq === "annual" ? "yr" : "mo"}</span>
                                </div>
                            </div>

                            {/* Informational Alert Box */}
                            <div className="info-alert">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="info-icon"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                <p><strong>Manual Approval Required.</strong> Your cluster configuration will be reviewed by our engineering team. Payment will only be processed after final approval and provisioning.</p>
                            </div>

                            {missingSteps.length > 0 && (
                                <div className="error-alert">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                    <p><strong>Incomplete Steps.</strong> Please complete {missingSteps.map(s => <button key={s} type="button" className="step-link" onClick={() => router.push(`/clusters/new/step-${s}`)}>Step {s}</button>)} before submitting.</p>
                                </div>
                            )}

                            {submitError && (
                                <div className="error-alert">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                    <p>{submitError}</p>
                                </div>
                            )}

                            <label className="agreement-checkbox">
                                <input
                                    type="checkbox"
                                    className="custom-checkbox"
                                    checked={isConfirmed}
                                    onChange={(e) => setIsConfirmed(e.target.checked)}
                                />
                                <span>I confirm the information provided across all steps is accurate.</span>
                            </label>

                            <button
                                type="submit"
                                className={`submit-btn ${!isConfirmed || missingSteps.length > 0 ? "disabled" : ""}`}
                                disabled={!isConfirmed || isSubmitting || missingSteps.length > 0}
                            >
                                {isSubmitting ? "Processing..." : (
                                    <>
                                        Submit for Approval
                                        {isConfirmed && missingSteps.length === 0 ? <span className="arrow">→</span> : <span className="lock">🔒</span>}
                                    </>
                                )}
                            </button>
                        </div>

                        <button type="button" onClick={() => router.back()} className="back-btn-mobile">
                            ← Back to Configuration
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 6rem 1rem 6rem 1rem;
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
          top: -10%; left: -10%; animation: breathe 12s ease-in-out infinite alternate;
        }
        .glow-2 {
          width: 600px; height: 600px;
          background: linear-gradient(to right, #0ea5e9, #14b8a6);
          bottom: -10%; right: -5%; animation: breathe 15s ease-in-out infinite alternate-reverse;
        }
        @keyframes breathe { 0% { transform: scale(1); } 100% { transform: scale(1.05); } }

        /* --- Layout --- */
        .content-wrapper { width: 100%; max-width: 1040px; position: relative; z-index: 2; }
        .slide-up { animation: slideUpFade 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        .header-section { margin-bottom: 3rem; text-align: left; }
        .main-title { font-size: 2.2rem; font-weight: 800; color: #1e293b; margin: 1.5rem 0 0.5rem 0; letter-spacing: -0.03em; }
        .sub-title { font-size: 1.05rem; color: #64748b; margin: 0; font-weight: 500; max-width: 600px; }

        /* The 2-Column Grid */
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 3rem;
          align-items: start;
        }
        .left-column { display: flex; flex-direction: column; gap: 3rem; }
        .right-column { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 1rem; }
        
        @media (max-width: 900px) { 
          .checkout-layout { grid-template-columns: 1fr; gap: 2rem; }
          .right-column { position: static; order: -1; } /* Bring summary to top on mobile */
        }

        /* --- Segmented Control --- */
        .segmented-control {
          position: relative; display: flex; background: rgba(241, 245, 249, 0.8);
          backdrop-filter: blur(8px); border-radius: 16px; padding: 0.35rem; width: 100%;
          border: 1px solid #e2e8f0; max-width: 400px;
        }
        .sliding-bg {
          position: absolute; top: 0.35rem; bottom: 0.35rem; width: calc(50% - 0.35rem);
          background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .sliding-bg.monthly { transform: translateX(0); }
        .sliding-bg.annual { transform: translateX(100%); }
        .segment-btn {
          flex: 1; position: relative; z-index: 2; background: none; border: none;
          padding: 0.8rem 0; font-size: 0.95rem; font-weight: 600; color: #64748b;
          cursor: pointer; transition: color 0.3s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .segment-btn.active { color: #0f172a; }
        .discount-badge { background: #10b981; color: white; font-size: 0.65rem; padding: 0.15rem 0.4rem; border-radius: 6px; font-weight: 700; text-transform: uppercase;}

        /* --- Plan Cards --- */
        .plans-grid { display: flex; flex-direction: column; gap: 1rem; }
        .plan-card {
          padding: 1.25rem 1.5rem; border-radius: 16px; border: 2px solid #e2e8f0;
          background: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.2s ease;
          display: flex; flex-direction: column; gap: 0.25rem; position: relative;
        }
        .plan-card:hover { border-color: #cbd5e1; background: rgba(255,255,255,0.9); }
        .plan-card.selected {
          border-color: #4f46e5; background: #ffffff;
          box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.1);
        }
        .plan-header { display: flex; justify-content: space-between; align-items: center; }
        .plan-name { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0; }
        .check-circle { width: 20px; height: 20px; background: #4f46e5; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; }
        .plan-desc { font-size: 0.85rem; color: #64748b; margin: 0 0 0.5rem 0; }
        .plan-price { display: flex; align-items: baseline; gap: 0.1rem; }
        .currency { font-size: 1rem; font-weight: 600; color: #0f172a; }
        .amount { font-size: 1.5rem; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; }
        .period { font-size: 0.9rem; color: #64748b; font-weight: 500; margin-left: 0.2rem; }

        /* --- Payment Tabs & Form --- */
        .payment-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;}
        .pay-tab {
          display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem;
          border-radius: 10px; border: 1px solid transparent; background: transparent;
          font-size: 0.9rem; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s;
        }
        .pay-tab:hover { background: #f8fafc; color: #334155; }
        .pay-tab.active { background: #f1f5f9; border-color: #cbd5e1; color: #0f172a; }
        
        .payment-form { display: flex; flex-direction: column; gap: 1rem; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        
        .payment-logos { display: flex; gap: 0.5rem; margin-top: 1.5rem; }
        .logo-pill { font-size: 0.75rem; font-weight: 700; color: #64748b; border: 1px solid #e2e8f0; padding: 0.3rem 0.6rem; border-radius: 6px; background: white; }

        /* --- Summary Card (Right Column) --- */
        .summary-card {
          background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.8); border-radius: 20px; padding: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.02);
          display: flex; flex-direction: column; gap: 1.25rem;
        }
        .summary-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 0.5rem 0; letter-spacing: -0.01em; }
        .summary-line { display: flex; justify-content: space-between; align-items: center; }
        .sl-label { font-size: 0.9rem; color: #64748b; font-weight: 500; }
        .sl-value { font-size: 0.9rem; color: #1e293b; }
        .font-medium { font-weight: 600; }
        .capitalize { text-transform: capitalize; }
        .divider { height: 1px; background: #e2e8f0; margin: 0.5rem 0; }
        
        .total-line { align-items: flex-end; }
        .total-price-box { display: flex; align-items: baseline; gap: 0.1rem; }
        .sl-value.large { font-size: 2rem; font-weight: 800; letter-spacing: -0.04em; }
        .sl-period { font-size: 1rem; color: #64748b; font-weight: 500; margin-left: 0.2rem;}

        /* Alert Box */
        .info-alert {
          display: flex; gap: 0.75rem; background: rgba(79, 70, 229, 0.05);
          border: 1px solid rgba(79, 70, 229, 0.15); border-radius: 12px; padding: 1rem;
          margin-top: 0.5rem;
        }
        .info-icon { color: #4f46e5; flex-shrink: 0; margin-top: 0.1rem; }
        .info-alert p { margin: 0; font-size: 0.8rem; color: #334155; line-height: 1.5; }
        .info-alert strong { color: #4f46e5; }

        /* Error Alert Box */
        .error-alert {
          display: flex; gap: 0.75rem; background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 1rem;
        }
        .error-alert svg { color: #ef4444; flex-shrink: 0; margin-top: 0.1rem; }
        .error-alert p { margin: 0; font-size: 0.8rem; color: #334155; line-height: 1.5; }
        .error-alert strong { color: #ef4444; }
        .step-link {
          background: none; border: none; color: #4f46e5; font-weight: 600; cursor: pointer;
          text-decoration: underline; font-size: 0.8rem; padding: 0; margin: 0 0.15rem;
        }
        .step-link:hover { color: #3730a3; }

        /* Checkbox & Submit */
        .agreement-checkbox { display: flex; gap: 0.75rem; align-items: flex-start; margin: 1rem 0; cursor: pointer; }
        .custom-checkbox { margin-top: 0.15rem; width: 1.1rem; height: 1.1rem; accent-color: #4f46e5; cursor: pointer; }
        .agreement-checkbox span { font-size: 0.85rem; color: #475569; line-height: 1.4; }
        
        .submit-btn {
          width: 100%; padding: 1.1rem; border-radius: 12px; border: none;
          background: #1e293b; color: white; font-size: 1.05rem; font-weight: 700;
          cursor: pointer; transition: all 0.3s ease; display: flex; justify-content: center; align-items: center; gap: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(30, 41, 59, 0.2);
        }
        .submit-btn:hover { background: #0f172a; transform: translateY(-2px); box-shadow: 0 15px 25px -5px rgba(30, 41, 59, 0.3); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn.disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; transform: none; }
        .arrow, .lock { transition: transform 0.2s; font-size: 1.1rem; }
        .submit-btn:hover:not(.disabled) .arrow { transform: translateX(4px); }

        .back-btn-mobile { background: none; border: none; font-size: 0.9rem; font-weight: 600; color: #64748b; cursor: pointer; text-align: left; padding: 0.5rem 0; transition: color 0.2s;}
        .back-btn-mobile:hover { color: #0f172a; }
      `}</style>
        </div>
    );
}

/* --- Reusable Components --- */

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
        .section-content { display: flex; flex-direction: column; gap: 1rem; }
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
        .input-group { display: flex; flex-direction: column; gap: 0.4rem; width: 100%; }
        .input-label { font-size: 0.85rem; font-weight: 600; color: #475569; display: flex; justify-content: space-between; }
        .error-badge { color: #ef4444; font-weight: 500; font-size: 0.78rem; }
        .input-field {
          width: 100%; padding: 0.8rem 1rem; border-radius: 10px;
          border: 1px solid #cbd5e1; background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px); font-size: 0.95rem; color: #0f172a; transition: all 0.2s ease;
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