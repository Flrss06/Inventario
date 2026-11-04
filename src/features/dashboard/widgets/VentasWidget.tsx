import { dinero, num } from '@/lib/format';
import { mayuscula, vocabularioDe } from '@/giros/vocabulario';
import { useDashboard } from '../context/DashboardContext';
import { subtituloDe } from '../lib/inventario';
import { Barra } from '../components/Barra';
import { GraficaBarras } from '../components/GraficaBarras';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

function Dato({ valor, texto }: { valor: string; texto: string }) {
    return (
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <strong className="block text-xl text-ink">{valor}</strong>
            <span className="text-xs text-muted">{texto}</span>
        </div>
    );
}

/**
 * Salidas de los últimos días: ventas en una tienda, consumo de insumos en un restaurante.
 * Muestra lo que más sale y lo que no se mueve; los textos salen del vocabulario del giro.
 */
export function VentasWidget(props: WidgetProps) {
    const { analisis, giro, items, movimientos } = useDashboard();
    const v = vocabularioDe(giro);
    const detalle = props.modo === 'detalle';
    const dias = detalle ? analisis.ventasPorDia : analisis.ventasPorDia.slice(-14);
    const maxTop = Math.max(...analisis.top.map(p => p.vendidos30), 1);
    const tendencia = analisis.tendencia;
    const nombres = new Map(items.map(i => [i.id, i]));
    const recientes = [...movimientos].reverse().filter(m => nombres.has(m.itemId)).slice(0, 12);
    const unidad = (id: string) => {
        const u = nombres.get(id)?.unidad;
        return typeof u === 'string' && u ? ` ${u}` : '';
    };

    if (!analisis.unidadesVendidas30) {
        return (
            <WidgetCard {...props}>
                <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-8 text-center text-sm text-muted">
                    <i className="bi bi-graph-up-arrow mb-2 block text-3xl text-slate-300" />
                    Todavía no hay movimientos registrados. {v.instruccion} Aquí verás qué {v.reflexivo} más.
                </div>
            </WidgetCard>
        );
    }

    return (
        <WidgetCard {...props}>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <div>
                    <div className="mb-4 grid grid-cols-3 gap-3">
                        <Dato valor={num(analisis.unidadesVendidas30)} texto={`${v.unidadesHechas} (30 días)`} />
                        <Dato valor={dinero(analisis.ingresos30)} texto={`${v.monto} (30 días)`} />
                        <Dato
                            valor={tendencia === null ? '—' : `${tendencia > 0 ? '▲' : tendencia < 0 ? '▼' : ''} ${Math.abs(tendencia)}%`}
                            texto="vs. semana anterior"
                        />
                    </div>
                    <GraficaBarras datos={dias} alto={detalle ? 200 : 130} titulo={`${mayuscula(v.unidadesHechas)} por día, últimos ${dias.length} días`} />
                </div>

                <div>
                    <h4 className="mb-3 text-sm font-bold text-ink">Lo que más {v.presente}</h4>
                    <div className="flex flex-col gap-3">
                        {analisis.top.slice(0, detalle ? 5 : 3).map((p, i) => (
                            <Barra
                                key={p.item.id}
                                etiqueta={<><span className="mr-1.5 font-bold text-muted">{i + 1}.</span><strong className="text-ink">{p.item.nombre}</strong></>}
                                valor={`${num(p.vendidos30)}${unidad(p.item.id)} ${v.hechos}`}
                                porcentaje={(p.vendidos30 / maxTop) * 100}
                            />
                        ))}
                    </div>
                    {analisis.estancados.length > 0 && (
                        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                            <i className="bi bi-hourglass" /> {analisis.estancados.length}{' '}
                            {analisis.estancados.length === 1 ? `${v.producto} no ${v.reflexivo}` : `${v.productos} no ${v.reflexivoPlural}`} desde hace 30 días.
                        </p>
                    )}
                </div>
            </div>

            {detalle && (
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div>
                        <h4 className="mb-3 font-bold text-ink">Sin movimiento en 30 días</h4>
                        {analisis.estancados.length === 0 ? (
                            <p className="text-sm text-muted">Todo tu inventario se está moviendo. 🎉</p>
                        ) : (
                            <ul className="divide-y divide-slate-100 text-sm">
                                {analisis.estancados.map(p => (
                                    <li key={p.item.id} className="flex justify-between gap-3 py-2.5">
                                        <span><strong className="text-ink">{p.item.nombre}</strong> <span className="text-muted">{subtituloDe(p.item, giro)}</span></span>
                                        <span className="shrink-0 text-muted">{num(p.stock)}{unidad(p.item.id)} en stock</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div>
                        <h4 className="mb-3 font-bold text-ink">Últimos movimientos</h4>
                        <ul className="divide-y divide-slate-100 text-sm">
                            {recientes.map(m => (
                                <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                                    <span className="flex items-center gap-2.5">
                                        <i className={`bi ${m.tipo === 'venta' ? 'bi-arrow-up-right text-accent' : 'bi-arrow-down-left text-sky-600'}`} />
                                        <span>
                                            <strong className="text-ink">{nombres.get(m.itemId)?.nombre}</strong>{' '}
                                            <span className="text-muted">{m.tipo === 'venta' ? v.salida : 'entrada'} de {num(m.cantidad)}{unidad(m.itemId)}</span>
                                        </span>
                                    </span>
                                    <span className="shrink-0 text-xs text-muted">
                                        {new Date(m.fecha).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </WidgetCard>
    );
}
