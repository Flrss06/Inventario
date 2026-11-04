import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '@/components/Reveal';
import { LISTA_GIROS } from '@/giros';
import { SectionHeader } from './SectionHeader';

export function GirosSection() {
    return (
        <section id="giros" className="scroll-mt-24 py-24">
            <Reveal>
                <SectionHeader etiqueta="Para cualquier negocio" titulo="Un panel distinto para cada tipo de negocio" texto="Los campos, alertas y reportes cambian según lo que vendes. Y si tu negocio es único, la IA lo diseña para ti." />
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {LISTA_GIROS.map((giro, i) => (
                    <Reveal key={giro.id} retraso={i * 80}>
                        <Link
                            to={`/registro?tipo=${giro.id}`}
                            style={{ '--accent': giro.color } as CSSProperties}
                            className={`group relative block h-full overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/15 ${
                                giro.id === 'general' ? 'border-transparent bg-noche text-slate-300' : 'border-slate-200/80 bg-white'
                            }`}
                        >
                            <span className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-accent/10 blur-2xl transition duration-500 group-hover:bg-accent/25" />
                            <div className="relative mb-5 grid size-14 place-items-center rounded-2xl bg-accent/10 text-2xl text-accent transition duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
                                <i className={`bi ${giro.id === 'general' ? 'bi-stars' : giro.icono}`} />
                            </div>
                            <h3 className={`relative mb-2 text-lg font-bold ${giro.id === 'general' ? 'text-white' : 'text-ink'}`}>
                                {giro.id === 'general' ? 'Tu negocio, sea cual sea' : giro.nombre}
                            </h3>
                            <p className={`relative mb-4 text-sm ${giro.id === 'general' ? '' : 'text-muted'}`}>{giro.lema}</p>
                            <span className="relative inline-flex items-center gap-1 text-sm font-bold text-accent">
                                Empezar <i className="bi bi-arrow-right transition group-hover:translate-x-1" />
                            </span>
                        </Link>
                    </Reveal>
                ))}
            </div>
        </section>
    );
}
