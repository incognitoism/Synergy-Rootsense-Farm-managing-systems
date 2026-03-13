import Header from "../components/Header";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";

export default function Capabilities() {
    return (
        <>
            <Header />
            <ParticleBackground />
            <main className="pt-32 pb-20">
                <div className="container">
                    <h1 className="text-5xl font-light mb-12 tracking-tight">Instrument Specifications</h1>

                    <section className="mb-20">
                        <p className="text-xl leading-relaxed max-w-3xl mb-12">
                            Our primary capability is non-invasive density contrast imaging. By utilizing the
                            constant flux of cosmic ray muons, we generate volumetric data of massive structures
                            without a single bore hole.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-2xl font-light mb-4 text-[var(--color-accent)]">Series V: Muon Telescopes</h3>
                                <p className="text-gray-400 mb-6 font-light">High-mobility distinct units for variable geometry deployment.</p>
                                <table className="w-full text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-[var(--color-line)]">
                                            <td className="py-3 text-sm text-gray-500">Angular Resolution</td>
                                            <td className="py-3 font-mono">15 mrad</td>
                                        </tr>
                                        <tr className="border-b border-[var(--color-line)]">
                                            <td className="py-3 text-sm text-gray-500">Effective Area</td>
                                            <td className="py-3 font-mono">2 m² / unit</td>
                                        </tr>
                                        <tr className="border-b border-[var(--color-line)]">
                                            <td className="py-3 text-sm text-gray-500">Power Draw</td>
                                            <td className="py-3 font-mono">45W (Solar Compatible)</td>
                                        </tr>
                                        <tr className="border-b border-[var(--color-line)]">
                                            <td className="py-3 text-sm text-gray-500">Depth Penetration</td>
                                            <td className="py-3 font-mono">~ 2 km w.e.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h3 className="text-2xl font-light mb-4 text-[var(--color-accent)]">Series G: Gravimeters</h3>
                                <p className="text-gray-400 mb-6 font-light">Micro-gravity fluctuation sensing for void detection.</p>
                                <table className="w-full text-left border-collapse">
                                    <tbody>
                                        <tr className="border-b border-[var(--color-line)]">
                                            <td className="py-3 text-sm text-gray-500">Sensitivity</td>
                                            <td className="py-3 font-mono">1 µGal</td>
                                        </tr>
                                        <tr className="border-b border-[var(--color-line)]">
                                            <td className="py-3 text-sm text-gray-500">Drift</td>
                                            <td className="py-3 font-mono">&lt; 5 µGal / day</td>
                                        </tr>
                                        <tr className="border-b border-[var(--color-line)]">
                                            <td className="py-3 text-sm text-gray-500">Sampling Rate</td>
                                            <td className="py-3 font-mono">1 Hz - 100 Hz</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
