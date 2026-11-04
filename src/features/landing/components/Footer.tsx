import { Logo } from '@/components/Logo';

export function Footer() {
    return (
        <footer className="bg-noche px-6 py-12 text-sm text-slate-400">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
                <div>
                    <Logo claro />
                    <p className="mt-2">El inventario que se adapta a tu negocio.</p>
                </div>
                <div className="text-center sm:text-right">
                    <p>&copy; {new Date().getFullYear()} Kiubo. Todos los derechos reservados.</p>
                    <p className="mt-1">Diseñado por <strong className="text-slate-200">Chris Flores</strong></p>
                </div>
            </div>
        </footer>
    );
}
