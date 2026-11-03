import type { ReactNode } from 'react';
import { WIDGET_META } from '@/data/widgets';
import type { Seccion } from '../widgets/tipos';

/** Marco común de cada apartado: título con icono, herramientas opcionales y ancho según el tipo. */
export function WidgetCard({ seccion, herramientas, children }: { seccion: Seccion; herramientas?: ReactNode; children: ReactNode }) {
    const meta = WIDGET_META[seccion.spec.w];
    return (
        <section
            id={seccion.id}
            className={`min-w-0 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${meta.ancho === 'full' ? 'lg:col-span-2' : ''}`}
        >
            <header className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
                    <i className={`bi ${meta.icono} text-accent`} /> {seccion.titulo}
                </h3>
                {herramientas}
            </header>
            {children}
        </section>
    );
}
