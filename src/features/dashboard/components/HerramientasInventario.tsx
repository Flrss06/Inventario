import { Button } from '@/components/ui/Button';
import { useDashboard } from '../context/DashboardContext';

/** Buscador + botón "Agregar" que comparten la tabla y el catálogo. */
export function HerramientasInventario({ busqueda, onBusqueda }: { busqueda: string; onBusqueda: (q: string) => void }) {
    const { giro, abrir } = useDashboard();
    return (
        <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">
            <input
                type="search"
                value={busqueda}
                onChange={e => onBusqueda(e.target.value)}
                placeholder={giro.buscar}
                aria-label="Buscar en el inventario"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-accent sm:w-64"
            />
            <Button tamano="sm" onClick={() => abrir({ tipo: 'item' })}>
                <i className="bi bi-plus-lg" /> Agregar
            </Button>
        </div>
    );
}
