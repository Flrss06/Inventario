import type { Recomendacion } from '../lib/analisis';

const ESTILO = {
    alta: 'bg-red-100 text-red-700',
    media: 'bg-amber-100 text-amber-700',
    info: 'bg-accent/10 text-accent',
};

/** Tarjetas con los consejos del asistente. */
export function Recomendaciones({ lista, columnas = 2 }: { lista: Recomendacion[]; columnas?: 1 | 2 | 3 }) {
    const grid = { 1: '', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3' }[columnas];
    return (
        <ul className={`grid gap-3 ${grid}`}>
            {lista.map((r, i) => (
                <li
                    key={r.titulo}
                    style={{ animationDelay: `${i * 80}ms` }}
                    className="flex animate-entrada gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 transition hover:shadow-md"
                >
                    <span className={`grid size-10 shrink-0 place-items-center rounded-xl text-lg ${ESTILO[r.nivel]}`}>
                        <i className={`bi ${r.icono}`} />
                    </span>
                    <div className="min-w-0 text-sm">
                        <strong className="block text-ink">{r.titulo}</strong>
                        <span className="text-muted">{r.detalle}</span>
                    </div>
                </li>
            ))}
        </ul>
    );
}
