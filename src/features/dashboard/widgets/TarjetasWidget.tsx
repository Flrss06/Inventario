import { useState } from 'react';
import { dinero, estaVacio } from '@/lib/format';
import { useDashboard } from '../context/DashboardContext';
import { alertasDe, filtrarItems, subtituloDe } from '../lib/inventario';
import { AlertChips } from '../components/AlertChips';
import { FiltrosInventario, ordenarItems, type Orden } from '../components/FiltrosInventario';
import { HerramientasInventario } from '../components/HerramientasInventario';
import { ItemActions } from '../components/ItemActions';
import { QuantityStepper } from '../components/QuantityStepper';
import { SinProductos } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

const EN_RESUMEN = 4;

export function TarjetasWidget(props: WidgetProps) {
    const { giro, items } = useDashboard();
    const [busqueda, setBusqueda] = useState('');
    const [grupo, setGrupo] = useState<string | null>(null);
    const [orden, setOrden] = useState<Orden>('nombre');
    const detalle = props.modo === 'detalle';

    const filtrados = filtrarItems(items, giro, busqueda).filter(i => !grupo || String(i[giro.agruparPor] || 'Sin dato') === grupo);
    const visibles = detalle ? ordenarItems(filtrados, orden, giro) : ordenarItems(items, 'urgencia', giro).slice(0, EN_RESUMEN);

    return (
        <WidgetCard
            {...props}
            herramientas={detalle ? <HerramientasInventario busqueda={busqueda} onBusqueda={setBusqueda} /> : undefined}
            verTodo={items.length > EN_RESUMEN ? `Ver los ${items.length} productos` : undefined}
        >
            {items.length === 0 ? (
                <SinProductos />
            ) : (
                <>
                    {detalle && <FiltrosInventario grupo={grupo} onGrupo={setGrupo} orden={orden} onOrden={setOrden} />}
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
                        {visibles.map((item, i) => (
                            <article
                                key={item.id}
                                style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                                className="relative flex animate-entrada flex-col gap-1 overflow-hidden rounded-2xl border border-slate-200 p-4 transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
                            >
                                <span className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-accent to-accent/40" />
                                <div className="absolute top-2.5 right-1.5">
                                    <ItemActions item={item} />
                                </div>
                                <h4 className="pr-16 font-bold text-ink">{item.nombre}</h4>
                                <p className="text-sm text-muted">{subtituloDe(item, giro) || ' '}</p>
                                <AlertChips alertas={alertasDe(item, giro)} />
                                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                                    <span className="font-extrabold text-ink">{estaVacio(item.precio) ? '' : dinero(item.precio)}</span>
                                    <QuantityStepper item={item} />
                                </div>
                            </article>
                        ))}
                        {visibles.length === 0 && <p className="col-span-full py-6 text-center text-muted">Nada coincide con tu búsqueda.</p>}
                    </div>
                </>
            )}
        </WidgetCard>
    );
}
