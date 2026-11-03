import type { Alerta } from '../lib/inventario';

const COLORES = {
    alta: 'bg-red-100 text-red-700',
    media: 'bg-amber-100 text-amber-700',
};

export function AlertChips({ alertas }: { alertas: Alerta[] }) {
    if (!alertas.length) return null;
    return (
        <div>
            {alertas.map(a => (
                <span key={a.texto} className={`mt-1 mr-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold whitespace-nowrap ${COLORES[a.nivel]}`}>
                    {a.texto}
                </span>
            ))}
        </div>
    );
}
