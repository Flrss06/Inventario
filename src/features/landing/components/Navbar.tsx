import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { ButtonLink } from '@/components/ui/Button';

/** Barra superior: transparente sobre el hero y blanca al hacer scroll. */
export function Navbar() {
    const [scroll, setScroll] = useState(false);

    useEffect(() => {
        const alMover = () => setScroll(window.scrollY > 40);
        alMover();
        window.addEventListener('scroll', alMover, { passive: true });
        return () => window.removeEventListener('scroll', alMover);
    }, []);

    return (
        <nav className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${scroll ? 'border-b border-slate-200/70 bg-white/80 py-3 shadow-sm backdrop-blur-xl' : 'py-5'}`}>
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6">
                <Logo claro={!scroll} />
                <div className={`hidden items-center gap-7 text-sm font-semibold md:flex ${scroll ? 'text-body' : 'text-slate-300'}`}>
                    <a href="#giros" className="transition hover:text-primary">Giros</a>
                    <a href="#ia" className="transition hover:text-primary">Asistente IA</a>
                    <a href="#planes" className="transition hover:text-primary">Planes</a>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/login" className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${scroll ? 'text-body hover:text-primary' : 'text-white hover:text-cyan-300'}`}>
                        Iniciar sesión
                    </Link>
                    <ButtonLink to="/registro" tamano="sm">Empezar gratis</ButtonLink>
                </div>
            </div>
        </nav>
    );
}
