import { useState } from 'react';
import type { Campo, Item } from '@/types';
import { dinero, estaVacio, fecha } from '@/lib/format';
import { useDashboard } from '../context/DashboardContext';
import { alertasDe, filtrarItems } from '../lib/inventario';
import { AlertChips } from '../components/AlertChips';
import { HerramientasInventario } from '../components/HerramientasInventario';
import { ItemActions } from '../components/ItemActions';
import { QuantityStepper } from '../components/QuantityStepper';
import { SinProductos } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

function Celda({ campo, item }: { campo: Campo; item: Item }) {
    const { giro } = useDashboard();
    const v = item[campo.key];
    if (campo.key === 'nombre') {
        return (
            <>
                <strong className="text-ink">{item.nombre}</strong>
                <AlertChips alertas={alertasDe(item, giro)} />
            </>
        );
    }
    if (campo.key === 'cantidad') return <QuantityStepper item={item} />;
    if (estaVacio(v)) return <span className="text-muted">—</span>;
    if (campo.type === 'money') return dinero(v);
    if (campo.type === 'date') return fecha(String(v));
    return String(v);
}

export function TablaWidget({ seccion }: WidgetProps) {
    const { giro, items } = useDashboard();
    const [busqueda, setBusqueda] = useState('');
    const columnas = giro.campos.filter(c => c.tabla !== false);
    const visibles = filtrarItems(items, giro, busqueda);

    return (
        <WidgetCard seccion={seccion} herramientas={<HerramientasInventario busqueda={busqueda} onBusqueda={setBusqueda} />}>
            {items.length === 0 ? (
                <SinProductos />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                {columnas.map(c => (
                                    <th key={c.key} className="border-b border-slate-200 px-3 py-2.5 text-left text-xs tracking-wide whitespace-nowrap text-muted uppercase">
                                        {c.label}
                                    </th>
                                ))}
                                <th className="border-b border-slate-200"><span className="sr-only">Acciones</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibles.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    {columnas.map(c => (
                                        <td key={c.key} className="border-b border-slate-100 px-3 py-3 align-middle">
                                            <Celda campo={c} item={item} />
                                        </td>
                                    ))}
                                    <td className="border-b border-slate-100 text-right whitespace-nowrap">
                                        <ItemActions item={item} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visibles.length === 0 && <p className="py-6 text-center text-muted">Nada coincide con “{busqueda}”.</p>}
                </div>
            )}
        </WidgetCard>
    );
}
