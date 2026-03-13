"use client";

import { useState, useRef, useEffect } from "react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

// 1. Define the props to accept the Kinde user object
interface DashboardHeaderProps {
    user?: {
        given_name?: string | null;
        family_name?: string | null;
        email?: string | null;
        picture?: string | null;
    } | null;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 2. Format the user details securely with fallbacks
    const fullName = `${user?.given_name || ""} ${user?.family_name || ""}`.trim() || "User";
    const userEmail = user?.email || "No email provided";
    const avatarUrl = user?.picture;

    // Close the dropdown if the user clicks outside of it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="dash-header">
            {/* Left side: Brand / Logo */}
            <div className="brand">
                <div className="logo-box">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                    </svg>
                </div>
                <span className="brand-name">ROOTSENSE BY SYNERGY</span>
            </div>

            {/* Right side: Actions & Profile */}
            <div className="header-actions">
                {/* Settings Icon */}
                <button className="icon-btn" aria-label="Settings">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>

                {/* Profile Dropdown */}
                <div className="profile-wrapper" ref={dropdownRef}>
                    <button
                        className="profile-btn"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {/* 3. Render real avatar if it exists, otherwise use your SVG placeholder */}
                        <div className="avatar" style={{ overflow: "hidden" }}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="User Avatar" width="24" height="24" style={{ objectFit: "cover" }} />
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            )}
                        </div>
                        <svg className={`chevron ${isDropdownOpen ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    {/* The Floating Dropdown Menu */}
                    <div className={`dropdown-menu ${isDropdownOpen ? 'active' : ''}`}>
                        <div className="dropdown-header">
                            {/* 4. Use the dynamic name and email here */}
                            <p className="user-name">{fullName}</p>
                            <p className="user-email">{userEmail}</p>
                        </div>

                        <div className="dropdown-divider"></div>

                        <button className="dropdown-item">
                            Account Settings
                        </button>
                        <button className="dropdown-item">
                            Billing
                        </button>

                        <div className="dropdown-divider"></div>

                        {/* Kinde Logout Link styled as a dropdown item */}
                        <LogoutLink className="dropdown-item text-danger">
                            Log Out
                        </LogoutLink>
                    </div>
                </div>
            </div>

            <style jsx>{`
                /* Apple Frosted Navbar */
                .dash-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2rem;
                    z-index: 100;
                    
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(24px) saturate(180%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%);
                    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                }

                .brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .logo-box {
                    width: 32px;
                    height: 32px;
                    background: #1d1d1f;
                    color: white;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .brand-name {
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: #1d1d1f;
                    letter-spacing: -0.02em;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                /* Buttons */
                .icon-btn {
                    background: transparent;
                    border: none;
                    color: rgba(0, 0, 0, 0.6);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .icon-btn:hover {
                    background: rgba(0, 0, 0, 0.05);
                    color: rgba(0, 0, 0, 0.9);
                }

                .profile-wrapper {
                    position: relative;
                }

                .profile-btn {
                    background: rgba(0, 0, 0, 0.04);
                    border: 1px solid rgba(0, 0, 0, 0.04);
                    height: 36px;
                    padding: 0 0.5rem;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .profile-btn:hover {
                    background: rgba(0, 0, 0, 0.08);
                }

                .avatar {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #ffffff;
                    color: #1d1d1f;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .chevron {
                    color: rgba(0, 0, 0, 0.5);
                    transition: transform 0.2s ease;
                }

                .chevron.open {
                    transform: rotate(180deg);
                }

                /* Apple Popover Menu */
                .dropdown-menu {
                    position: absolute;
                    top: calc(100% + 12px);
                    right: 0;
                    width: 240px;
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(48px) saturate(200%);
                    -webkit-backdrop-filter: blur(48px) saturate(200%);
                    border-radius: 16px;
                    padding: 0.5rem;
                    
                    /* The signature Apple popover shadow */
                    box-shadow: 
                        0 12px 32px -8px rgba(0, 0, 0, 0.15),
                        0 4px 12px -4px rgba(0, 0, 0, 0.08),
                        inset 0 0 0 1px rgba(0, 0, 0, 0.06),
                        inset 0 1px 0 0 rgba(255, 255, 255, 1);
                    
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .dropdown-menu.active {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .dropdown-header {
                    padding: 0.75rem 1rem;
                }

                .user-name {
                    font-weight: 600;
                    font-size: 0.95rem;
                    color: #1d1d1f;
                    margin-bottom: 0.1rem;
                }

                .user-email {
                    font-size: 0.8rem;
                    color: rgba(0, 0, 0, 0.5);
                }

                .dropdown-divider {
                    height: 1px;
                    background: rgba(0, 0, 0, 0.06);
                    margin: 0.25rem 0;
                }

                .dropdown-item {
                    display: block;
                    width: 100%;
                    text-align: left;
                    background: transparent;
                    border: none;
                    padding: 0.5rem 1rem;
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #1d1d1f;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.15s ease;
                }

                .dropdown-item:hover {
                    background: rgba(0, 0, 0, 0.06);
                }

                /* Global class overrides for Kinde's LogoutLink inside the component */
                :global(.dropdown-item.text-danger) {
                    color: #ff3b30; /* Apple Red */
                }

                :global(.dropdown-item.text-danger:hover) {
                    background: rgba(255, 59, 48, 0.1);
                }
            `}</style>
        </header>
    );
}