import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { dinero, num } from '@/lib/format';
import { reporteConIA } from '@/services/ia';
import { vocabularioDe } from '@/giros/vocabulario';
import { useDashboard } from '../context/DashboardContext';
import { reporteLocal } from '../lib/reporteLocal';
import { Recomendaciones } from '../components/Recomendaciones';
import { TextoIA } from '../components/TextoIA';
import { BajoStockWidget } from '../widgets/BajoStockWidget';
import type { ProductoAnalizado } from '../lib/analisis';

type Reporte = { texto: string; fuente: 'ia' | 'local' } | 'cargando' | null;

function Lista({ titulo, icono, vacio, productos, valor }: { titulo: string; icono: string; vacio: string; productos: ProductoAnalizado[]; valor: (p: ProductoAnalizado) => string }) {
    return (
        <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-ink"><i className={`bi ${icono} text-accent`} /> {titulo}</h3>
            {productos.length === 0 ? (
                <p className="text-sm text-muted">{vacio}</p>
            ) : (
                <ul className="divide-y divide-slate-100 text-sm">
                    {productos.slice(0, 6).map(p => (
                        <li key={p.item.id} className="py-2.5">
                            <div className="flex justify-between gap-3">
                                <strong className="text-ink">{p.item.nombre}</strong>
                                <span className="shrink-0 font-semibold">{valor(p)}</span>
                            </div>
                            <span className="text-xs text-muted">{p.motivo}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

/** Asistente IA: recomendaciones, reporte escrito y lista de compra. */
export function AsistentePage() {
    const { negocio, giro, analisis } = useDashboard();
    const [reporte, setReporte] = useState<Reporte>(null);
    const v = vocabularioDe(giro);

    async function generar() {
        setReporte('cargando');
        const texto = await reporteConIA(negocio.nombre, giro.nombre, analisis, v);
        setReporte(texto ? { texto, fuente: 'ia' } : { texto: reporteLocal(negocio.nombre, analisis, v), fuente: 'local' });
    }

    return (
        <>
            <header className="relative mb-6 overflow-hidden rounded-3xl bg-noche p-6 text-slate-300 sm:p-8">
                <span className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-accent/30 blur-3xl" />
                <span className="pointer-events-none absolute -bottom-28 left-10 size-72 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="relative flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                            <i className="bi bi-stars" /> Asistente IA
                        </span>
                        <h1 className="mb-2 text-3xl font-extrabold text-white sm:text-4xl">Tu inventario, explicado</h1>
                        <p className="max-w-xl">Analizo lo que tienes y lo que {v.pasado} en los últimos 30 días para decirte qué {v.comprar === 'Pide' ? 'pedir' : 'comprar'}, qué {v.reflexivo} más y qué conviene reducir.</p>
                    </div>
                    <Button tamano="lg" onClick={generar} disabled={reporte === 'cargando'}>
                        <i className={`bi ${reporte === 'cargando' ? 'bi-arrow-repeat animate-spin' : 'bi-file-earmark-text'}`} />
                        {reporte && reporte !== 'cargando' ? 'Volver a generar' : 'Generar reporte'}
                    </Button>
                </div>

                <div className="relative mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { v: num(analisis.unidadesVendidas30), t: v.unidadesHechas },
                        { v: dinero(analisis.ingresos30), t: v.monto },
                        { v: num(analisis.comprar.length), t: 'por reponer' },
                        { v: num(analisis.estancados.length), t: 'sin moverse' },
                    ].map(d => (
                        <div key={d.t} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                            <strong className="block text-xl text-white">{d.v}</strong>
                            <span className="text-xs">{d.t} (30 días)</span>
                        </div>
                    ))}
                </div>
            </header>

            {reporte && (
                <section className="mb-6 animate-entrada rounded-3xl border border-violet-200 bg-linear-to-br from-violet-50/60 to-white p-6 shadow-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="flex items-center gap-2 text-lg font-bold text-ink"><i className="bi bi-file-earmark-text text-accent" /> Reporte</h2>
                        {reporte !== 'cargando' && (
                            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-muted shadow-sm">
                                {reporte.fuente === 'ia' ? <><i className="bi bi-stars text-accent" /> Escrito por Claude</> : 'Generado automáticamente'}
                            </span>
                        )}
                    </div>
                    {reporte === 'cargando' ? (
                        <div className="flex flex-col gap-2.5" aria-label="Generando reporte">
                            {[90, 75, 82, 60, 70].map((w, i) => (
                                <span key={i} className="h-3.5 animate-pulse rounded-full bg-violet-100" style={{ width: `${w}%` }} />
                            ))}
                        </div>
                    ) : (
                        <TextoIA texto={reporte.texto} />
                    )}
                </section>
            )}

            <h2 className="mb-3 text-lg font-bold text-ink">Recomendaciones</h2>
            <div className="mb-8">
                <Recomendaciones lista={analisis.recomendaciones} />
            </div>

            <div className="mb-8">
                <h2 className="mb-3 text-lg font-bold text-ink">{v.comprar === 'Pide' ? 'Pedido sugerido' : 'Lista de compra sugerida'}</h2>
                <BajoStockWidget seccion={{ id: 'ia-compra', titulo: 'Lista sugerida', ruta: '/panel/resurtir', spec: { w: 'bajoStock' } }} modo="detalle" />
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
                <Lista titulo={`Lo que más ${v.presente}`} icono="bi-trophy" vacio="Aún no hay movimientos registrados." productos={analisis.top} valor={p => `${num(p.vendidos30)} ${v.hechos}`} />
                <Lista titulo="Lo que no se mueve" icono="bi-hourglass" vacio="Todo tu inventario se está moviendo." productos={[...analisis.estancados, ...analisis.exceso]} valor={p => `${num(p.stock)} en stock`} />
                <Lista titulo={v.tituloCaducidad} icono="bi-lightning-charge" vacio="Nada en riesgo de caducar." productos={analisis.promocion} valor={p => `${num(p.stock)} en stock`} />
            </div>
        </>
    );
}
