import { Button } from '@/components/ui/Button';
import { useDashboard } from '../context/DashboardContext';

export function EjemplosBanner() {
    const { items, borrarEjemplos } = useDashboard();
    if (!items.some(i => i.ejemplo)) return null;

    return (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <span>
                <i className="bi bi-lightbulb" /> Cargamos productos de ejemplo para que veas cómo funciona tu plantilla.
            </span>
            <Button
                variante="secondary"
                tamano="sm"
                onClick={() => confirm('¿Borrar todos los productos de ejemplo?') && borrarEjemplos()}
            >
                Borrar ejemplos
            </Button>
        </div>
    );
}
