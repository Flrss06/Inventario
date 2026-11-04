import { Link, Navigate, useParams } from 'react-router-dom';
import type { Vocabulario, WidgetId } from '@/types';
import { WIDGET_META } from '@/data/widgets';
import { vocabularioDe } from '@/giros/vocabulario';
import { useDashboard } from '../context/DashboardContext';
import { WIDGETS } from '../widgets';
import type { Seccion } from '../widgets/tipos';

const descripciones = (v: Vocabulario): Partial<Record<WidgetId, string>> => ({
    tabla: `Todos tus ${v.productos}. Filtra, ordena y registra cada ${v.salida} (−) o entrada (+).`,
    tarjetas: `Todos tus ${v.productos} en tarjetas.`,
    tallas: 'Existencias de cada modelo por talla, con totales.',
    ventas: `Lo que ${v.pasado} en los últimos 30 días, lo que más ${v.presente} y lo que no se mueve.`,
    alertas: 'Productos agotados, con poco stock o por caducar.',
    bajoStock: `Lo que hay que reponer y cuánto, según lo que ${v.presente} cada semana.`,
    categorias: `Cuánto tienes de cada grupo, cuánto vale y cuánto ${v.reflexivo} al mes.`,
    caducidad: `Todo lo que tiene fecha de caducidad, de lo más urgente a lo más lejano.`,
});

/** Página propia de un apartado, con su vista detallada. */
export function SeccionPage({ secciones }: { secciones: Seccion[] }) {
    const { ruta } = useParams();
    const { giro } = useDashboard();
    const seccion = secciones.find(s => s.ruta === `/panel/${ruta}`);
    if (!seccion) return <Navigate to="/panel" replace />;

    const Widget = WIDGETS[seccion.spec.w];
    return (
        <>
            <nav aria-label="Ruta" className="mb-3 text-sm text-muted">
                <Link to="/panel" className="hover:text-accent">Resumen</Link>
                <i className="bi bi-chevron-right mx-1.5 text-xs" />
                <span className="text-ink">{seccion.titulo}</span>
            </nav>
            <header className="mb-6 flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-accent text-2xl text-white shadow-lg shadow-accent/30">
                    <i className={`bi ${WIDGET_META[seccion.spec.w].icono}`} />
                </span>
                <div>
                    <h1 className="text-3xl font-extrabold text-ink">{seccion.titulo}</h1>
                    <p className="text-muted">{descripciones(vocabularioDe(giro))[seccion.spec.w]}</p>
                </div>
            </header>
            <Widget seccion={seccion} modo="detalle" />
        </>
    );
}
