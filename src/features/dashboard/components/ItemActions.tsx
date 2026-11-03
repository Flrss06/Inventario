import type { Item } from '@/types';
import { useDashboard } from '../context/DashboardContext';

const claseIcono = 'grid size-8 cursor-pointer place-items-center rounded-md text-muted';

export function ItemActions({ item }: { item: Item }) {
    const { abrir, borrarItem } = useDashboard();

    function borrar() {
        if (confirm(`¿Borrar "${item.nombre}" del inventario?`)) borrarItem(item.id);
    }

    return (
        <span className="inline-flex">
            <button type="button" onClick={() => abrir({ tipo: 'item', item })} aria-label={`Editar ${item.nombre}`} className={`${claseIcono} hover:bg-slate-100 hover:text-ink`}>
                <i className="bi bi-pencil" />
            </button>
            <button type="button" onClick={borrar} aria-label={`Borrar ${item.nombre}`} className={`${claseIcono} hover:bg-red-100 hover:text-red-700`}>
                <i className="bi bi-trash" />
            </button>
        </span>
    );
}
