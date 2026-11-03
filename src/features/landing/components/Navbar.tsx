import { Logo } from '@/components/Logo';
import { ButtonLink } from '@/components/ui/Button';

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white py-4">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
                <Logo />
                <div className="flex items-center gap-2">
                    <ButtonLink to="/login" variante="ghost">Iniciar sesión</ButtonLink>
                    <ButtonLink to="/registro">Registrarse</ButtonLink>
                </div>
            </div>
        </nav>
    );
}
