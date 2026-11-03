import { useState } from 'react';
import { dinero, estaVacio } from '@/lib/format';
import { useDashboard } from '../context/DashboardContext';
import { alertasDe, filtrarItems, subtituloDe } from '../lib/inventario';
import { AlertChips } from '../components/AlertChips';
import { HerramientasInventario } from '../components/HerramientasInventario';
import { ItemActions } from '../components/ItemActions';
import { QuantityStepper } from '../components/QuantityStepper';
import { SinProductos } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

export function TarjetasWidget({ seccion }: WidgetProps) {
    const { giro, items } = useDashboard();
    const [busqueda, setBusqueda] = useState('');
    const visibles = filtrarItems(items, giro, busqueda);

    return (
        <WidgetCard seccion={seccion} herramientas={<HerramientasInventario busqueda={busqueda} onBusqueda={setBusqueda} />}>
            {items.length === 0 ? (
                <SinProductos />
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                    {visibles.map(item => (
                        <article key={item.id} className="relative flex flex-col gap-1 rounded-2xl border border-t-4 border-slate-200 border-t-accent p-4">
                            <div className="absolute top-2 right-1.5">
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
                    {visibles.length === 0 && <p className="col-span-full py-6 text-center text-muted">Nada coincide con “{busqueda}”.</p>}
                </div>
            )}
        </WidgetCard>
    );
}
