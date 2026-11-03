import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { claseInput } from '@/components/ui/Field';

export function ContactSection() {
    const [enviado, setEnviado] = useState(false);

    // Todavía no hay a dónde mandar el mensaje; cuando exista backend se conecta aquí.
    function enviar(e: FormEvent) {
        e.preventDefault();
        setEnviado(true);
    }

    return (
        <section id="contacto" className="mx-auto max-w-xl scroll-mt-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xl">
                <h2 className="mb-2 text-2xl font-bold text-ink">¿Quieres un panel a tu medida?</h2>
                <p className="mb-6 text-muted">Déjanos tus datos y te contactamos para entender lo que necesita tu negocio.</p>

                {enviado ? (
                    <p className="font-semibold text-accent">
                        <i className="bi bi-check-circle-fill" /> ¡Gracias! Te contactaremos pronto.
                    </p>
                ) : (
                    <form onSubmit={enviar} className="flex flex-col gap-4">
                        <input className={claseInput} type="text" placeholder="Tu nombre o empresa" aria-label="Tu nombre o empresa" required />
                        <input className={claseInput} type="email" placeholder="Correo electrónico" aria-label="Correo electrónico" required />
                        <Button type="submit" bloque>Quiero que me contacten</Button>
                    </form>
                )}
            </div>
        </section>
    );
}
