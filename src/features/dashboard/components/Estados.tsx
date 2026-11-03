import { Button } from '@/components/ui/Button';
import { useDashboard } from '../context/DashboardContext';

/** Cuando un apartado no tiene nada que mostrar. */
export function SinProductos({ mensaje = 'Aún no tienes productos registrados.' }: { mensaje?: string }) {
    const { abrir } = useDashboard();
    return (
        <div className="px-4 py-8 text-center text-muted">
            <i className="bi bi-inbox mb-2 block text-3xl text-slate-300" />
            <p className="mb-4">{mensaje}</p>
            <Button tamano="sm" onClick={() => abrir({ tipo: 'item' })}>
                <i className="bi bi-plus-lg" /> Agregar producto
            </Button>
        </div>
    );
}

export function TodoBien({ mensaje }: { mensaje: string }) {
    return (
        <p className="flex items-center gap-2 py-4 font-semibold text-accent">
            <i className="bi bi-check-circle-fill" /> {mensaje}
        </p>
    );
}
