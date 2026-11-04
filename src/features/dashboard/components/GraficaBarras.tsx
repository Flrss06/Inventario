import { useState } from 'react';
import { num } from '@/lib/format';

interface Punto {
    fecha: string;
    unidades: number;
}

const etiquetaDia = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });

/**
 * Gráfica de barras de una sola serie (unidades que salieron por día).
 * Barras delgadas con punta redondeada sobre la línea base, etiqueta al pasar el mouse
 * y una tabla oculta para lectores de pantalla.
 */
export function GraficaBarras({ datos, alto = 160, titulo }: { datos: Punto[]; alto?: number; titulo: string }) {
    const [activo, setActivo] = useState<number | null>(null);
    const maximo = Math.max(...datos.map(d => d.unidades), 1);
    const punto = activo !== null ? datos[activo] : null;

    return (
        <figure className="relative">
            <div className="mb-2 flex items-baseline justify-between text-xs text-muted">
                <span>máx. {num(maximo)} por día</span>
                <span className="h-4 font-semibold text-ink">
                    {punto ? `${etiquetaDia(punto.fecha)}: ${num(punto.unidades)} ${punto.unidades === 1 ? 'unidad' : 'unidades'}` : ''}
                </span>
            </div>

            <div
                className="flex items-end gap-[2px] border-b border-slate-200"
                style={{ height: alto }}
                onMouseLeave={() => setActivo(null)}
                aria-hidden
            >
                {datos.map((d, i) => (
                    <div
                        key={d.fecha}
                        onMouseEnter={() => setActivo(i)}
                        className="flex h-full flex-1 cursor-default items-end"
                    >
                        <div
                            className={`w-full rounded-t-[4px] transition-all duration-500 ${activo === i ? 'bg-accent' : activo === null ? 'bg-accent/80' : 'bg-accent/35'}`}
                            style={{ height: d.unidades ? `${Math.max((d.unidades / maximo) * 100, 3)}%` : 0 }}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-1.5 flex justify-between text-[11px] text-muted" aria-hidden>
                <span>{etiquetaDia(datos[0]?.fecha ?? '')}</span>
                <span>{etiquetaDia(datos[Math.floor(datos.length / 2)]?.fecha ?? '')}</span>
                <span>Hoy</span>
            </div>

            <table className="sr-only">
                <caption>{titulo}</caption>
                <thead>
                    <tr><th>Día</th><th>Unidades</th></tr>
                </thead>
                <tbody>
                    {datos.map(d => (
                        <tr key={d.fecha}><td>{etiquetaDia(d.fecha)}</td><td>{d.unidades}</td></tr>
                    ))}
                </tbody>
            </table>
        </figure>
    );
}
