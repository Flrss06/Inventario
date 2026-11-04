import { diasPara, fecha, num } from '@/lib/format';
import { vocabularioDe } from '@/giros/vocabulario';
import { useDashboard } from '../context/DashboardContext';
import { cantidadDe, subtituloDe } from '../lib/inventario';
import { SinProductos } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

const RANGOS = [
    { texto: 'Caducados', estilo: 'border-red-500 bg-red-50', entra: (d: number) => d < 0 },
    { texto: 'Hoy a 3 días', estilo: 'border-red-500 bg-red-50', entra: (d: number) => d >= 0 && d <= 3 },
    { texto: '4 a 7 días', estilo: 'border-amber-500 bg-amber-50', entra: (d: number) => d >= 4 && d <= 7 },
    { texto: '8 a 30 días', estilo: 'border-accent bg-slate-50', entra: (d: number) => d >= 8 && d <= 30 },
    { texto: 'Más de 30 días', estilo: 'border-accent bg-slate-50', entra: (d: number) => d > 30 },
];

function insignia(dias: number) {
    if (dias < 0) return { texto: `Caducó hace ${-dias} d`, clase: 'bg-red-100 text-red-700' };
    if (dias === 0) return { texto: 'Hoy', clase: 'bg-red-100 text-red-700' };
    if (dias <= 7) return { texto: `${dias} d`, clase: dias <= 3 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700' };
    return { texto: `${dias} d`, clase: 'bg-accent/10 text-accent' };
}

/** Productos agrupados por qué tan pronto caducan. */
export function CaducidadWidget(props: WidgetProps) {
    const { giro, items, analisis } = useDashboard();
    const promocion = new Set(analisis.promocion.map(p => p.item.id));
    const conFecha = items
        .flatMap(i => (typeof i.caducidad === 'string' && i.caducidad ? [{ item: i, dias: diasPara(i.caducidad) }] : []))
        .sort((a, b) => a.dias - b.dias);

    return (
        <WidgetCard {...props}>
            {conFecha.length === 0 ? (
                <SinProductos mensaje="Agrega fechas de caducidad para ver este apartado." />
            ) : (
                <>
                    <div className={`grid gap-2.5 ${props.modo === 'detalle' ? 'sm:grid-cols-5' : ''}`}>
                        {RANGOS.map(rango => {
                            const grupo = conFecha.filter(c => rango.entra(c.dias));
                            const nombres = grupo.slice(0, 3).map(c => c.item.nombre).join(', ') + (grupo.length > 3 ? ` y ${grupo.length - 3} más` : '');
                            return (
                                <div
                                    key={rango.texto}
                                    className={`flex items-center gap-3.5 rounded-xl border-l-4 px-3.5 py-2.5 text-sm ${grupo.length ? rango.estilo : 'border-slate-300 bg-slate-50'}`}
                                >
                                    <b className="min-w-[2ch] text-center text-2xl text-ink">{grupo.length}</b>
                                    <div className="min-w-0">
                                        {rango.texto}
                                        {props.modo === 'resumen' && <small className="block truncate text-muted">{nombres || 'Ninguno'}</small>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {props.modo === 'detalle' && (
                        <ul className="mt-6 divide-y divide-slate-100 text-sm">
                            {conFecha.map(({ item, dias }) => {
                                const b = insignia(dias);
                                return (
                                    <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                                        <div className="min-w-0">
                                            <strong className="text-ink">{item.nombre}</strong> <span className="text-muted">{subtituloDe(item, giro)}</span>
                                            <div className="text-xs text-muted">
                                                Caduca el {fecha(String(item.caducidad))} · {num(cantidadDe(item))} en stock
                                                {promocion.has(item.id) && <span className="ml-2 font-semibold text-amber-700"><i className="bi bi-lightning-charge" /> {vocabularioDe(giro).consejoCaducidad}</span>}
                                            </div>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${b.clase}`}>{b.texto}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </>
            )}
        </WidgetCard>
    );
}
