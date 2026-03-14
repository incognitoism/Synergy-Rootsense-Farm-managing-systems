'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <header className={`sr-header ${scrolled ? 'scrolled' : ''}`}>
                <div className="sr-header-inner">

                    {/* LEFT — LOGO */}
                    <Link href="/" className="sr-logo">
                        <Image
                            src="/assets/images/rootsense.png"
                            alt="Vega Labs Logo"
                            width={360}
                            height={350}
                            style={{
                                width: '280px',
                                height: 'auto',
                                objectFit: 'contain',
                                filter: 'brightness(0) invert(1)',
                            }}
                        />
                        <span className="sr-logo-sub">
                            A Synergy Subsystems<br />Laboratory
                        </span>
                    </Link>

                    {/* RIGHT — NAV + CTA */}
                    <div className="sr-right">
                        <nav className="sr-nav">
                            <Link href="/research">Research</Link>
                            <Link href="/capabilities">Capabilities</Link>
                            <Link href="/about">About</Link>
                        </nav>

                        <Link href="/login" className="sr-btn">
                            <span className="sr-btn-shine" />
                            Client Login
                        </Link>
                    </div>

                </div>
            </header>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

                :root {
                    --header-height: 68px;
                    --bg:   #080807;
                    --b0:   rgba(255,255,255,.05);
                    --b1:   rgba(255,255,255,.09);
                    --t0:   #f0f0ec;
                    --t2:   rgba(240,240,236,.35);
                    --t3:   rgba(240,240,236,.15);
                    --g0:   #10b981;
                    --font: 'Instrument Sans', -apple-system, sans-serif;
                    --mono: 'JetBrains Mono', monospace;
                }

                /* ── HEADER SHELL ── */
                .sr-header {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    z-index: 1000;
                    height: var(--header-height);
                    background: rgba(8,8,7,.82);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border-bottom: 1px solid var(--b0);
                    transition: background .3s, border-color .3s, box-shadow .3s;
                }
                .sr-header.scrolled {
                    background: rgba(8,8,7,.96);
                    border-bottom-color: var(--b1);
                    box-shadow: 0 8px 32px -8px rgba(0,0,0,.55);
                }

                /* ── INNER — strict left/right layout ── */
                .sr-header-inner {
                    width: 100%;
                    max-width: 1240px;
                    margin: 0 auto;
                    padding: 0 2.5rem;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1.5rem;
                }

                /* ── LOGO (always left) ── */
                .sr-logo {
                    display: flex;
                    align-items: center;
                    gap: .85rem;
                    text-decoration: none;
                    flex-shrink: 0;
                    /* ensure it never centers */
                    margin-right: auto;
                }
                .sr-logo-sub {
                    font-family: var(--mono);
                    font-size: .58rem;
                    color: var(--t3);
                    font-weight: 400;
                    letter-spacing: .04em;
                    line-height: 1.5;
                    white-space: nowrap;
                }
                @media (max-width: 860px) {
                    .sr-logo-sub { display: none; }
                }

                /* ── RIGHT GROUP (always right) ── */
                .sr-right {
                    display: flex;
                    align-items: center;
                    gap: 2.25rem;
                    flex-shrink: 0;
                }

                /* ── NAV LINKS ── */
                .sr-nav {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                }
                .sr-nav a {
                    font-family: var(--font);
                    font-size: .82rem;
                    font-weight: 500;
                    color: var(--t2);
                    text-decoration: none;
                    letter-spacing: .02em;
                    white-space: nowrap;
                    position: relative;
                    transition: color .2s;
                }
                .sr-nav a::after {
                    content: '';
                    position: absolute;
                    bottom: -3px; left: 0; right: 0;
                    height: 1px;
                    background: var(--g0);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform .25s cubic-bezier(.25,1,.5,1);
                }
                .sr-nav a:hover { color: var(--t0); }
                .sr-nav a:hover::after { transform: scaleX(1); }

                @media (max-width: 640px) {
                    .sr-nav { display: none; }
                }

                /* ── LOGIN BUTTON ── */
                .sr-btn {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    padding: .46rem 1.15rem;
                    background: var(--g0);
                    color: #fff;
                    border-radius: 8px;
                    font-family: var(--font);
                    font-size: .82rem;
                    font-weight: 600;
                    text-decoration: none;
                    letter-spacing: -.01em;
                    white-space: nowrap;
                    overflow: hidden;
                    transition: opacity .2s, transform .2s, box-shadow .2s;
                    flex-shrink: 0;
                }
                .sr-btn:hover {
                    opacity: .88;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px -6px rgba(16,185,129,.5);
                }
                .sr-btn:active { transform: scale(.97); }

                /* shine sweep */
                .sr-btn-shine {
                    position: absolute;
                    top: 0; left: -75%;
                    width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
                    transform: skewX(-20deg);
                    animation: hdrShine 4s ease-in-out infinite;
                }
                @keyframes hdrShine {
                    0%,65% { left: -75%; }
                    100%   { left: 130%; }
                }

                /* ── MOBILE ── */
                @media (max-width: 480px) {
                    .sr-header-inner { padding: 0 1.25rem; }
                }
            `}</style>
        </>
    );
};

export default Header;