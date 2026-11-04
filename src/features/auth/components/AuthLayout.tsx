import type { ReactNode } from 'react';
import { Logo, LogoCubo } from '@/components/Logo';

interface Props {
    titulo: string;
    subtitulo: string;
    /** Botón o enlace que va arriba a la derecha. */
    accion: ReactNode;
    ancho?: 'normal' | 'amplio';
    children: ReactNode;
}

const BENEFICIOS = [
    { icono: 'bi-grid-1x2', texto: 'Un panel hecho para tu tipo de negocio' },
    { icono: 'bi-stars', texto: 'Asistente IA que te dice qué comprar' },
    { icono: 'bi-graph-up-arrow', texto: 'Sabe qué se vende y qué no se mueve' },
    { icono: 'bi-gift', texto: 'Gratis con las plantillas base' },
];

/** Registro e inicio de sesión: panel de marca a la izquierda y formulario a la derecha. */
export function AuthLayout({ titulo, subtitulo, accion, ancho = 'normal', children }: Props) {
    return (
        <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <aside className="relative hidden overflow-hidden bg-noche p-12 text-slate-300 lg:flex lg:flex-col">
                <span className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-primary/40 blur-3xl" />
                <span className="pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-cyan-400/20 blur-3xl" />
                <LogoCubo className="pointer-events-none absolute right-10 bottom-24 size-40 animate-flotar opacity-20" />
                <LogoCubo className="pointer-events-none absolute top-40 right-28 size-16 animate-flotar opacity-30 [animation-delay:-3s]" />

                <Logo claro className="relative" />
                <div className="relative my-auto">
                    <h2 className="mb-4 text-4xl leading-tight font-extrabold text-white">
                        Tu inventario, <span className="texto-marca">a tu medida.</span>
                    </h2>
                    <p className="mb-8 max-w-sm">Kiubo se adapta a lo que vendes: comida, ropa, tenis, refacciones o lo que sea.</p>
                    <ul className="flex flex-col gap-3.5">
                        {BENEFICIOS.map((b, i) => (
                            <li key={b.texto} style={{ animationDelay: `${200 + i * 100}ms` }} className="flex animate-entrada items-center gap-3">
                                <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-white"><i className={`bi ${b.icono}`} /></span>
                                {b.texto}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            <div className="flex flex-col">
                <nav className="flex items-center justify-between px-6 py-5 sm:px-10">
                    <span className="lg:invisible"><Logo /></span>
                    {accion}
                </nav>
                <main className="flex flex-1 justify-center px-4 pb-12 sm:px-10">
                    <div className={`w-full animate-entrada ${ancho === 'amplio' ? 'max-w-2xl' : 'max-w-md'} lg:mt-6`}>
                        <h1 className="mb-1 text-3xl font-extrabold text-ink">{titulo}</h1>
                        <p className="text-muted">{subtitulo}</p>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
