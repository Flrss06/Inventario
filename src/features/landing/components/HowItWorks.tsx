import { Reveal } from '@/components/Reveal';
import { SectionHeader } from './SectionHeader';

const PASOS = [
    { icono: 'bi-shop', titulo: 'Cuéntanos de tu empresa', texto: 'Nombre, a qué se dedica y qué tipo de negocio es.' },
    { icono: 'bi-layout-wtf', titulo: 'Elige tu plantilla', texto: 'Dos diseños para tu giro (o uno hecho por la IA). Cambia entre ellos cuando quieras.' },
    { icono: 'bi-stars', titulo: 'Deja que la IA te ayude', texto: 'Registra ventas con un clic y recibe consejos de qué comprar y qué no.' },
];

export function HowItWorks() {
    return (
        <section className="py-24">
            <Reveal>
                <SectionHeader etiqueta="Así de fácil" titulo="Tu panel listo en 2 minutos" texto="Sin instalar nada ni configurar hojas de cálculo." />
            </Reveal>

            <div className="relative grid gap-6 md:grid-cols-3">
                <span className="pointer-events-none absolute top-10 right-[16%] left-[16%] hidden h-0.5 bg-linear-to-r from-primary/0 via-primary/40 to-primary/0 md:block" />
                {PASOS.map((paso, i) => (
                    <Reveal key={paso.titulo} retraso={i * 120}>
                        <div className="relative text-center">
                            <span className="relative mx-auto mb-5 grid size-20 place-items-center rounded-3xl border border-slate-200 bg-white text-3xl text-primary shadow-lg shadow-primary/10">
                                <i className={`bi ${paso.icono}`} />
                                <span className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full bg-linear-to-br from-primary to-cyan-400 text-xs font-extrabold text-white">{i + 1}</span>
                            </span>
                            <h3 className="mb-1.5 text-lg font-bold text-ink">{paso.titulo}</h3>
                            <p className="mx-auto max-w-xs text-sm text-muted">{paso.texto}</p>
                        </div>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
