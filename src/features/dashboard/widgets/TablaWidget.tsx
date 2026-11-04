import { useState } from 'react';
import type { Campo, Item } from '@/types';
import { dinero, estaVacio, fecha } from '@/lib/format';
import { vocabularioDe } from '@/giros/vocabulario';
import { useDashboard } from '../context/DashboardContext';
import { alertasDe, cantidadDe, filtrarItems } from '../lib/inventario';
import { AlertChips } from '../components/AlertChips';
import { FiltrosInventario, ordenarItems, type Orden } from '../components/FiltrosInventario';
import { HerramientasInventario } from '../components/HerramientasInventario';
import { ItemActions } from '../components/ItemActions';
import { QuantityStepper } from '../components/QuantityStepper';
import { SinProductos } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

const EN_RESUMEN = 5;

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

export function TablaWidget(props: WidgetProps) {
    const { giro, items } = useDashboard();
    const [busqueda, setBusqueda] = useState('');
    const [grupo, setGrupo] = useState<string | null>(null);
    const [orden, setOrden] = useState<Orden>('urgencia');
    const detalle = props.modo === 'detalle';
    const columnas = giro.campos.filter(c => c.tabla !== false);

    // En el resumen mostramos primero lo que necesita atención.
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
                    <div className="-mx-2 overflow-x-auto px-2">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr>
                                    {columnas.map(c => (
                                        <th key={c.key} className="border-b border-slate-200 px-3 py-2.5 text-left text-xs font-semibold tracking-wide whitespace-nowrap text-muted uppercase">
                                            {c.label}
                                        </th>
                                    ))}
                                    <th className="border-b border-slate-200"><span className="sr-only">Acciones</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibles.map(item => (
                                    <tr key={item.id} className="transition hover:bg-accent/[0.03]">
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
                        {visibles.length === 0 && <p className="py-6 text-center text-muted">Nada coincide con tu búsqueda.</p>}
                    </div>
                    {detalle && (
                        <p className="mt-4 text-xs text-muted">
                            {visibles.length} de {items.length} productos · {visibles.reduce((s, i) => s + cantidadDe(i), 0).toLocaleString('es-MX')} unidades.
                            Usa <b>−</b> para registrar cada {vocabularioDe(giro).salida} y <b>+</b> cuando te llegue mercancía.
                        </p>
                    )}
                </>
            )}
        </WidgetCard>
    );
}
