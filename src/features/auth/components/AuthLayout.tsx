import type { ReactNode } from 'react';
import { Logo } from '@/components/Logo';

interface Props {
    titulo: string;
    subtitulo: string;
    /** Botón o enlace que va en la esquina de la barra superior. */
    accion: ReactNode;
    ancho?: 'normal' | 'amplio';
    children: ReactNode;
}

export function AuthLayout({ titulo, subtitulo, accion, ancho = 'normal', children }: Props) {
    return (
        <div className="min-h-screen">
            <nav className="border-b border-slate-200 bg-white py-4">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
                    <Logo />
                    {accion}
                </div>
            </nav>
            <main className="flex justify-center px-4 py-12">
                <div className={`w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10 ${ancho === 'amplio' ? 'max-w-3xl' : 'max-w-md'}`}>
                    <h1 className="mb-1 text-2xl font-bold text-ink">{titulo}</h1>
                    <p className="text-sm text-muted">{subtitulo}</p>
                    {children}
                </div>
            </main>
        </div>
    );
}
