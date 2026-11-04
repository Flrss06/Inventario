import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { GirosSection } from './components/GirosSection';
import { IASection } from './components/IASection';
import { HowItWorks } from './components/HowItWorks';
import { PricingSection } from './components/PricingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export function LandingPage() {
    useEffect(() => {
        document.title = 'Kiubo | El inventario que se adapta a tu negocio';
    }, []);

    return (
        <>
            <Navbar />
            <Hero />
            <main>
                <div className="mx-auto max-w-6xl px-6">
                    <GirosSection />
                </div>
                <IASection />
                <div className="mx-auto max-w-6xl px-6">
                    <HowItWorks />
                    <PricingSection />
                    <ContactSection />
                </div>
            </main>
            <Footer />
        </>
    );
}
