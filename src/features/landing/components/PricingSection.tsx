import { PlanCard } from '@/components/PlanCard';
import { Reveal } from '@/components/Reveal';
import { ButtonLink, clasesBoton } from '@/components/ui/Button';
import { PLANES } from '@/data/planes';
import { SectionHeader } from './SectionHeader';

export function PricingSection() {
    return (
        <section id="planes" className="scroll-mt-24 py-24">
            <Reveal>
                <SectionHeader
                    etiqueta="Planes"
                    titulo="Gratis para empezar, a tu medida cuando lo necesites"
                    texto="Las plantillas base y el asistente son gratis para siempre. Pagas solo por los cambios a tu medida."
                />
            </Reveal>

            <div className="grid items-stretch gap-5 md:grid-cols-3">
                {PLANES.map((plan, i) => (
                    <Reveal key={plan.id} retraso={i * 100} className="h-full">
                        <PlanCard
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
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
