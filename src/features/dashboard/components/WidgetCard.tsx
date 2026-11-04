import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { WIDGET_META } from '@/data/widgets';
import type { WidgetProps } from '../widgets/tipos';

interface Props extends WidgetProps {
    herramientas?: ReactNode;
    /** Texto del enlace al pie en modo resumen, p. ej. "Ver los 24 productos". */
    verTodo?: string;
    children: ReactNode;
}

/**
 * Marco común de cada apartado.
 * En el resumen muestra el título como enlace a su página; en el detalle la página ya tiene título.
 */
export function WidgetCard({ seccion, modo, herramientas, verTodo, children }: Props) {
    const meta = WIDGET_META[seccion.spec.w];
    const resumen = modo === 'resumen';

    return (
        <section
            id={seccion.id}
            className={`group/card min-w-0 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 sm:p-6 ${
                resumen ? `hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 ${meta.ancho === 'full' ? 'lg:col-span-2' : ''}` : ''
            }`}
        >
            {(resumen || herramientas) && (
                <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    {resumen ? (
                        <Link to={seccion.ruta} className="flex items-center gap-2.5 text-lg font-bold text-ink">
                            <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent transition group-hover/card:scale-110">
                                <i className={`bi ${meta.icono}`} />
                            </span>
                            {seccion.titulo}
                        </Link>
                    ) : (
                        <span />
                    )}
                    {herramientas ?? (
                        resumen && (
                            <Link to={seccion.ruta} className="text-sm font-semibold text-accent opacity-80 transition hover:opacity-100">
                                Ver detalle <i className="bi bi-arrow-right" />
                            </Link>
                        )
                    )}
                </header>
            )}
            {children}
            {resumen && verTodo && (
                <Link to={seccion.ruta} className="mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/10">
                    {verTodo} <i className="bi bi-arrow-right" />
                </Link>
            )}
        </section>
    );
}
