import { useEffect, useState } from 'react';
import { LogoCubo } from '@/components/Logo';

const MENSAJES = [
    'Entendiendo tu negocio…',
    'Eligiendo qué datos guardar de cada producto…',
    'Acomodando los apartados de tu panel…',
    'Creando productos de ejemplo…',
];

/** Animación mientras la IA diseña el panel. */
export function Generando() {
    const [paso, setPaso] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setPaso(p => (p + 1) % MENSAJES.length), 1100);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="flex flex-col items-center px-4 py-12 text-center" role="status" aria-live="polite">
            <div className="relative mb-8">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
                <span className="relative grid size-24 place-items-center rounded-full bg-linear-to-br from-accent/15 to-cyan-400/15">
                    <LogoCubo className="size-12 animate-girar" />
                </span>
            </div>
            <p className="mb-1 text-lg font-bold text-ink">La IA está diseñando tu panel</p>
            <p key={paso} className="animate-entrada text-sm text-muted">{MENSAJES[paso]}</p>
        </div>
    );
}
