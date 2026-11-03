import { PlanCard } from '@/components/PlanCard';
import { ButtonLink, clasesBoton } from '@/components/ui/Button';
import { PLANES } from '@/data/planes';
import { SectionHeader } from './SectionHeader';

export function PricingSection() {
    return (
        <section id="planes" className="mb-16 scroll-mt-24">
            <SectionHeader
                titulo="Gratis para empezar, a tu medida cuando lo necesites"
                texto="Las plantillas base son gratis para siempre. Pagas solo por los cambios."
            />

            <div className="grid gap-5 md:grid-cols-3">
                {PLANES.map(plan => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        accion={
                            plan.id === 'medida' ? (
                                <a href="#contacto" className={clasesBoton({ variante: 'secondary', bloque: true })}>Hablar con nosotros</a>
                            ) : (
                                <ButtonLink to="/registro" bloque variante={plan.destacado ? 'primary' : 'secondary'}>
                                    {plan.id === 'gratis' ? 'Empezar gratis' : 'Empezar'}
                                </ButtonLink>
                            )
                        }
                    />
                ))}
            </div>
        </section>
    );
}
