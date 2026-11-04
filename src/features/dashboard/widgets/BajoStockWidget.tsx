import { useState } from 'react';
import type { Item } from '@/types';
import { Link } from 'react-router-dom';
import { dinero, num } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { mayuscula, vocabularioDe } from '@/giros/vocabulario';
import { useDashboard } from '../context/DashboardContext';
import { subtituloDe } from '../lib/inventario';
import { Barra } from '../components/Barra';
import { TodoBien } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

const EN_RESUMEN = 4;

const unidadDe = (item: Item) => (typeof item.unidad === 'string' && item.unidad ? ` ${item.unidad}` : '');

/** Lista de compra: lo que hay que resurtir y cuánto, según el análisis de ventas. */
export function BajoStockWidget(props: WidgetProps) {
    const { giro, analisis } = useDashboard();
    const [copiado, setCopiado] = useState(false);
    const v = vocabularioDe(giro);
    const lista = analisis.comprar;
    const detalle = props.modo === 'detalle';

    function copiar() {
        const texto = lista.map(p => `- ${p.item.nombre}${subtituloDe(p.item, giro) ? ` (${subtituloDe(p.item, giro)})` : ''}: ${p.sugerido}`).join('\n');
        void navigator.clipboard?.writeText(`Lista de pedido\n${texto}`).then(() => {
            setCopiado(true);
            setTimeout(() => setCopiado(false), 2000);
        });
    }

    return (
        <WidgetCard
            {...props}
            herramientas={detalle && lista.length > 0 ? <Button variante="secondary" tamano="sm" onClick={copiar}><i className={`bi ${copiado ? 'bi-check2' : 'bi-clipboard'}`} /> {copiado ? 'Copiada' : 'Copiar lista'}</Button> : undefined}
            verTodo={lista.length > EN_RESUMEN ? `Ver la lista completa (${lista.length})` : undefined}
        >
            {lista.length === 0 ? (
                <TodoBien mensaje="Tienes suficiente de todo." />
            ) : detalle ? (
                <>
                    <div className="-mx-2 overflow-x-auto px-2">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="text-left text-xs tracking-wide text-muted uppercase">
                                    <th className="border-b border-slate-200 px-3 py-2.5">{mayuscula(v.producto)}</th>
                                    <th className="border-b border-slate-200 px-3 py-2.5 text-right">Tienes</th>
                                    <th className="border-b border-slate-200 px-3 py-2.5 text-right">{mayuscula(v.presente)} / semana</th>
                                    <th className="border-b border-slate-200 px-3 py-2.5 text-right">{v.comprar}</th>
                                    <th className="border-b border-slate-200 px-3 py-2.5 text-right">Aprox.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map(p => (
                                    <tr key={p.item.id}>
                                        <td className="border-b border-slate-100 px-3 py-3">
                                            <strong className="text-ink">{p.item.nombre}</strong>
                                            <div className="text-xs text-muted">{p.motivo}</div>
                                        </td>
                                        <td className={`border-b border-slate-100 px-3 py-3 text-right font-semibold ${p.stock === 0 ? 'text-red-700' : 'text-amber-700'}`}>{num(p.stock)}{unidadDe(p.item)}</td>
                                        <td className="border-b border-slate-100 px-3 py-3 text-right">{num(Math.round(p.ventaDiaria * 7 * 10) / 10)}</td>
                                        <td className="border-b border-slate-100 px-3 py-3 text-right"><span className="rounded-full bg-accent/10 px-2.5 py-1 font-bold whitespace-nowrap text-accent">+{num(p.sugerido)}{unidadDe(p.item)}</span></td>
                                        <td className="border-b border-slate-100 px-3 py-3 text-right text-muted">{dinero(p.sugerido * (Number(p.item.precio) || 0))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                        <span>Inversión aproximada (con el precio que registraste): <strong className="text-ink">{dinero(analisis.costoCompraSugerida)}</strong></span>
                        <Link to="/panel/ia" className="font-semibold text-accent">Ver reporte del asistente <i className="bi bi-arrow-right" /></Link>
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-3.5">
                    {lista.slice(0, EN_RESUMEN).map(p => (
                        <Barra
                            key={p.item.id}
                            etiqueta={<><strong className="text-ink">{p.item.nombre}</strong> <span className="text-muted">{subtituloDe(p.item, giro)}</span></>}
                            valor={<>{v.comprar.toLowerCase()} <strong className="text-ink">+{num(p.sugerido)}{unidadDe(p.item)}</strong></>}
                            porcentaje={Math.min(100, (p.stock / Math.max(p.minimo * 2, 1)) * 100)}
                            nivel={p.stock === 0 ? 'alta' : 'media'}
                        />
                    ))}
                </div>
            )}
        </WidgetCard>
    );
}
