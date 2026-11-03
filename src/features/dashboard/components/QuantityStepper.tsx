import type { Item } from '@/types';
import { num } from '@/lib/format';
import { useDashboard } from '../context/DashboardContext';
import { cantidadDe } from '../lib/inventario';

const claseBoton = 'size-7 cursor-pointer bg-slate-50 text-base hover:bg-accent/10 hover:text-accent';

export function QuantityStepper({ item }: { item: Item }) {
    const { cambiarCantidad } = useDashboard();
    return (
        <span className="inline-flex items-center overflow-hidden rounded-md border border-slate-200 bg-white">
            <button type="button" className={claseBoton} onClick={() => cambiarCantidad(item.id, -1)} aria-label={`Quitar uno de ${item.nombre}`}>−</button>
            <span className="min-w-14 px-1.5 text-center text-sm font-bold whitespace-nowrap">
                {num(cantidadDe(item))}
                {item.unidad && <small className="ml-1 font-medium text-muted">{String(item.unidad)}</small>}
            </span>
            <button type="button" className={claseBoton} onClick={() => cambiarCantidad(item.id, 1)} aria-label={`Agregar uno de ${item.nombre}`}>+</button>
        </span>
    );
}
