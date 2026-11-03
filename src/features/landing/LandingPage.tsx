import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { GirosSection } from './components/GirosSection';
import { HowItWorks } from './components/HowItWorks';
import { PricingSection } from './components/PricingSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export function LandingPage() {
    return (
        <>
            <Navbar />
            <Hero />
            <main className="mx-auto max-w-5xl px-6 py-12">
                <GirosSection />
                <HowItWorks />
                <PricingSection />
                <ContactSection />
            </main>
            <Footer />
        </>
    );
}
