import type { ReactNode } from 'react';

const COLORES = {
    normal: 'bg-accent',
    media: 'bg-amber-500',
    alta: 'bg-red-500',
};

/** Fila con etiqueta, valor y barra de progreso. */
export function Barra({ etiqueta, valor, porcentaje, nivel = 'normal' }: { etiqueta: ReactNode; valor: ReactNode; porcentaje: number; nivel?: keyof typeof COLORES }) {
    return (
        <div>
            <div className="mb-1 flex justify-between gap-4 text-sm">
                <span>{etiqueta}</span>
                <span className="shrink-0">{valor}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${COLORES[nivel]}`} style={{ width: `${Math.max(porcentaje, 2)}%` }} />
            </div>
        </div>
    );
}
