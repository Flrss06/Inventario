import { useState, type FormEvent } from 'react';
import { Reveal } from '@/components/Reveal';
import { LogoCubo } from '@/components/Logo';
import { Button, ButtonLink } from '@/components/ui/Button';
import { claseInput } from '@/components/ui/Field';

export function ContactSection() {
    const [enviado, setEnviado] = useState(false);

    // Todavía no hay a dónde mandar el mensaje; cuando exista backend se conecta aquí.
    function enviar(e: FormEvent) {
        e.preventDefault();
        setEnviado(true);
    }

    return (
        <section id="contacto" className="scroll-mt-24 pb-24">
            <Reveal>
                <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary via-violet-600 to-cyan-500 p-8 text-white shadow-2xl shadow-primary/30 sm:p-14">
                    <LogoCubo className="pointer-events-none absolute -right-10 -bottom-10 size-64 animate-flotar opacity-15" />
                    <div className="relative grid items-center gap-10 lg:grid-cols-2">
                        <div>
                            <h2 className="mb-3 text-3xl font-extrabold sm:text-4xl">¿Listo para ordenar tu inventario?</h2>
                            <p className="mb-6 text-lg text-white/85">Crea tu cuenta gratis en 2 minutos, o déjanos tus datos si quieres un panel a tu medida.</p>
                            <ButtonLink to="/registro" tamano="lg" variante="secondary" className="border-0! shadow-xl">
                                Empezar gratis <i className="bi bi-arrow-right" />
                            </ButtonLink>
                        </div>
                        <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                            {enviado ? (
                                <p className="py-6 text-center font-semibold">
                                    <i className="bi bi-check-circle-fill" /> ¡Gracias! Te contactaremos pronto.
                                </p>
                            ) : (
                                <form onSubmit={enviar} className="flex flex-col gap-3">
                                    <strong>¿Quieres un panel a tu medida?</strong>
                                    <input className={claseInput} type="text" placeholder="Tu nombre o empresa" aria-label="Tu nombre o empresa" required />
                                    <input className={claseInput} type="email" placeholder="Correo electrónico" aria-label="Correo electrónico" required />
                                    <Button type="submit" bloque className="bg-noche!">Quiero que me contacten</Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
