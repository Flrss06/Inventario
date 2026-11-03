import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { LISTA_GIROS } from '@/giros';
import { SectionHeader } from './SectionHeader';

export function GirosSection() {
    return (
        <section className="mb-16">
            <SectionHeader titulo="Un panel distinto para cada tipo de negocio" texto="Los campos, alertas y reportes cambian según lo que vendes." />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {LISTA_GIROS.map(giro => (
                    <Link
                        key={giro.id}
                        to={`/registro?tipo=${giro.id}`}
                        style={{ '--accent': giro.color } as CSSProperties}
                        className="block rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="mb-4 grid size-12 place-items-center rounded-lg bg-accent/10 text-2xl text-accent">
                            <i className={`bi ${giro.icono}`} />
                        </div>
                        <h3 className="mb-2 text-lg font-bold text-ink">{giro.nombre}</h3>
                        <p className="text-sm text-muted">{giro.lema}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-accent">
                            Empezar <i className="bi bi-arrow-right" />
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
