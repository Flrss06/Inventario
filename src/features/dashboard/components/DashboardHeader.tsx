import type { PlantillaId } from '@/types';
import { Button } from '@/components/ui/Button';
import { useDashboard } from '../context/DashboardContext';

export function DashboardHeader() {
    const { negocio, giro, abrir, cambiarPlantilla } = useDashboard();

    function solicitarCambio() {
        if (negocio.plan === 'gratis') {
            abrir({
                tipo: 'planes',
                motivo: 'Las plantillas base son gratis. Para pedir cambios a tu plantilla necesitas un plan de pago.',
                despues: 'solicitud',
            });
        } else {
            abrir({ tipo: 'solicitud' });
        }
    }

    return (
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
            <div>
                <div className="mb-2.5 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                        <i className={`bi ${giro.icono}`} /> {giro.nombre}
                    </span>
                    {negocio.giroPersonalizado && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-violet-500 to-cyan-400 px-3 py-1 text-xs font-bold text-white">
                            <i className="bi bi-stars" /> Panel hecho a tu medida
                        </span>
                    )}
                </div>
                <h1 className="text-3xl leading-tight font-extrabold tracking-tight text-ink sm:text-4xl">{negocio.nombre}</h1>
                {negocio.descripcion && <p className="max-w-xl text-muted">{negocio.descripcion}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div role="group" aria-label="Plantilla" className="inline-flex max-w-full overflow-x-auto rounded-lg bg-slate-200 p-1">
                    {(Object.entries(giro.plantillas) as [PlantillaId, typeof giro.plantillas.a][]).map(([id, p]) => {
                        const activa = id === negocio.plantilla;
                        return (
                            <button
                                key={id}
                                type="button"
                                aria-pressed={activa}
                                onClick={() => cambiarPlantilla(id)}
                                className={`cursor-pointer rounded-md px-3.5 py-1.5 text-sm font-semibold ${activa ? 'bg-white text-ink shadow-sm' : 'text-muted'}`}
                            >
                                {p.nombre}
                            </button>
                        );
                    })}
                </div>
                <Button onClick={solicitarCambio}>
                    <i className="bi bi-magic" /> Solicitar cambio
                </Button>
            </div>
        </div>
    );
}
