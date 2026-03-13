/**
 * Footer Component
 */
import React from 'react';

const Footer = () => {
    return (
        <footer className="section bg-off-white" style={{ borderTop: '1px solid var(--color-line)', padding: 'var(--spacing-lg) 0' }}>
            <div className="container">
                <div className="footer-content">
                    <div className="mb-md md:mb-0">
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>VEGA LABS</h4>
                        <p style={{ fontSize: '0.8rem', maxWidth: '300px' }}>
                            Advanced structural imaging and muon tomography.
                            <br />
                            Revealing the invisible infrastructure of the world.
                        </p>
                    </div>
                    <div className="text-right">
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                            Part of the Synergy Subsystems Network
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)', marginTop: '0.5rem' }}>
                            &copy; {new Date().getFullYear()} Vega Labs. All Rights Reserved.
                        </p>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                            <a href="#" style={{ marginRight: '1rem' }}>Privacy</a>
                            <a href="#">Legal</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
