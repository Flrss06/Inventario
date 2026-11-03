import { SectionHeader } from './SectionHeader';

const PASOS = [
    { titulo: 'Cuéntanos de tu empresa', texto: 'Nombre, a qué se dedica y qué tipo de negocio es.' },
    { titulo: 'Elige tu plantilla', texto: 'Tienes dos diseños para tu giro y puedes cambiar entre ellos cuando quieras.' },
    { titulo: 'Pide cambios si los necesitas', texto: '¿Te falta un apartado? Con un plan de pago lo agregamos por ti.' },
];

export function HowItWorks() {
    return (
        <section className="mb-16">
            <SectionHeader titulo="¿Cómo funciona?" texto="En menos de dos minutos tienes tu panel funcionando." />

            <div className="grid gap-6 md:grid-cols-3">
                {PASOS.map((paso, i) => (
                    <div key={paso.titulo} className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
                        <span className="mb-4 grid size-9 place-items-center rounded-full bg-primary font-extrabold text-white">{i + 1}</span>
                        <h3 className="mb-1.5 text-lg font-bold text-ink">{paso.titulo}</h3>
                        <p className="text-sm text-muted">{paso.texto}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
