'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

const Header = () => {
    return (
        <header className="header">
            <div className="container header-content" style={{ maxWidth: '100%', paddingLeft: '2rem', paddingRight: '2rem' }}>
                <Link href="/" className="logo">
                    <Image
                        src="/assets/images/rootsense.png"
                        alt="Vega Labs Logo"
                        width={360}
                        height={350}
                        style={{
                            width: '280px',
                            height: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-tertiary)', fontWeight: 400, marginLeft: 16, letterSpacing: '0.05em', lineHeight: '1.4' }} className="hidden md:inline">
                        A Synergy Subsystems<br />Laboratory
                    </span>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <nav className="nav">
                        <ul>
                            <li><Link href="/research">Research</Link></li>
                            <li><Link href="/capabilities">Capabilities</Link></li>
                            <li><Link href="/about">About</Link></li>
                        </ul>
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link href="/login" className="btn-primary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                            Client Login
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;