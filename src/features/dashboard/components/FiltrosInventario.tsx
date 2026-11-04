import type { Giro, Item } from '@/types';
import { useDashboard } from '../context/DashboardContext';
import { alertasDe, cantidadDe, campoDe } from '../lib/inventario';

export type Orden = 'urgencia' | 'nombre' | 'menos' | 'mas' | 'valor';

const ORDENES: { id: Orden; label: string }[] = [
    { id: 'urgencia', label: 'Lo urgente primero' },
    { id: 'nombre', label: 'Nombre (A-Z)' },
    { id: 'menos', label: 'Menos unidades' },
    { id: 'mas', label: 'Más unidades' },
    { id: 'valor', label: 'Mayor valor' },
];

export function ordenarItems(items: Item[], orden: Orden, giro: Giro) {
    const peso = (i: Item) => alertasDe(i, giro).reduce((s, a) => s + (a.nivel === 'alta' ? 10 : 3), 0);
    const copia = [...items];
    switch (orden) {
        case 'urgencia':
            return copia.sort((a, b) => peso(b) - peso(a));
        case 'nombre':
            return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
        case 'menos':
            return copia.sort((a, b) => cantidadDe(a) - cantidadDe(b));
        case 'mas':
            return copia.sort((a, b) => cantidadDe(b) - cantidadDe(a));
        case 'valor':
            return copia.sort((a, b) => cantidadDe(b) * (Number(b.precio) || 0) - cantidadDe(a) * (Number(a.precio) || 0));
    }
}

/** Chips para filtrar por el campo de agrupación del giro y selector de orden. */
export function FiltrosInventario({ grupo, onGrupo, orden, onOrden }: { grupo: string | null; onGrupo: (g: string | null) => void; orden: Orden; onOrden: (o: Orden) => void }) {
    const { giro, items } = useDashboard();
    const grupos = [...new Set(items.map(i => String(i[giro.agruparPor] || 'Sin dato')))].sort();
    const chip = (activo: boolean) =>
        `cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${activo ? 'bg-accent text-white shadow-sm shadow-accent/30' : 'bg-slate-100 text-body hover:bg-slate-200'}`;

    return (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label={`Filtrar por ${campoDe(giro, giro.agruparPor)?.label ?? 'grupo'}`}>
                <button type="button" className={chip(grupo === null)} onClick={() => onGrupo(null)}>Todos</button>
                {grupos.map(g => (
                    <button key={g} type="button" className={chip(grupo === g)} onClick={() => onGrupo(grupo === g ? null : g)}>{g}</button>
                ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-muted">
                Ordenar
                <select value={orden} onChange={e => onOrden(e.target.value as Orden)} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-ink outline-none focus:border-accent">
                    {ORDENES.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
            </label>
        </div>
    );
}
