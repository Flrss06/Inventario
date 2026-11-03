import type { PlanId } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PlanCard } from '@/components/PlanCard';
import { PLANES } from '@/data/planes';
import { useDashboard } from '../context/DashboardContext';

interface Props {
    motivo?: string;
    /** Si venía de "Solicitar cambio", al suscribirse se abre directo el formulario. */
    despues?: 'solicitud';
}

export function PlanesModal({ motivo, despues }: Props) {
    const { negocio, cambiarPlan, abrir, cerrar } = useDashboard();

    // Versión de demostración: aquí es donde se conectaría el cobro (Stripe, Mercado Pago...).
    function elegir(id: PlanId) {
        cambiarPlan(id);
        if (id !== 'gratis' && despues === 'solicitud') abrir({ tipo: 'solicitud' });
        else cerrar();
    }

    return (
        <Modal titulo="Planes" onCerrar={cerrar}>
            <p className="text-sm text-muted">{motivo ?? 'Las plantillas base son gratis para siempre. Paga solo si quieres cambios.'}</p>
            <div className="my-6 grid gap-5 md:grid-cols-3">
                {PLANES.map(plan => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        accion={
                            plan.id === negocio.plan ? (
                                <Button variante="secondary" bloque disabled>Tu plan actual</Button>
                            ) : (
                                <Button variante={plan.id === 'gratis' ? 'secondary' : 'primary'} bloque onClick={() => elegir(plan.id)}>
                                    {plan.id === 'gratis' ? 'Cambiar a Gratis' : 'Suscribirme'}
                                </Button>
                            )
                        }
                    />
                ))}
            </div>
            <p className="flex items-center gap-1.5 text-xs text-muted">
                <i className="bi bi-info-circle" /> Versión de demostración: al suscribirte no se hace ningún cobro.
            </p>
        </Modal>
    );
}
