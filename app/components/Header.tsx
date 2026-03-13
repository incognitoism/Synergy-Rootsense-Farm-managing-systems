'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useTheme } from './ThemeContext';

const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="header">
            <div className="container header-content" style={{ maxWidth: '100%', paddingLeft: '2rem', paddingRight: '2rem' }}>
                <Link href="/" className="logo">
                    <Image
                        src="/assets/images/rootsense.png"
                        alt="Vega Labs Logo"
                        width={360} // Intrinsic
                        height={350} // Intrinsic
                        style={{
                            width: '280px', // Display size
                            height: 'auto',
                            // filter: theme === 'dark' ? 'invert(0)' : 'invert(1) hue-rotate(180deg)',
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

