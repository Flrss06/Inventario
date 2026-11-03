import { useEffect, type CSSProperties } from 'react';
import { Navigate } from 'react-router-dom';
import { cargarNegocio, sesionActual } from '@/services/db';
import { DashboardProvider } from './context/DashboardProvider';
import { useDashboard } from './context/DashboardContext';
import { DashboardHeader } from './components/DashboardHeader';
import { EjemplosBanner } from './components/EjemplosBanner';
import { SidebarLayout } from './layouts/SidebarLayout';
import { TopbarLayout } from './layouts/TopbarLayout';
import { ModalHost } from './modals/ModalHost';
import { WIDGETS, tituloWidget } from './widgets';
import type { Seccion } from './widgets/tipos';

export function DashboardPage() {
    const correo = sesionActual();
    const negocio = correo ? cargarNegocio(correo) : null;
    if (!correo || !negocio) return <Navigate to="/login" replace />;

    return (
        <DashboardProvider correo={correo} negocioInicial={negocio}>
            <Panel />
        </DashboardProvider>
    );
}

/** Arma la plantilla elegida: diseño (lateral o superior) + sus apartados en orden. */
function Panel() {
    const { negocio, giro, plantilla } = useDashboard();

    useEffect(() => {
        document.title = `${negocio.nombre} | Ecostock`;
    }, [negocio.nombre]);

    const secciones: Seccion[] = plantilla.widgets.map((spec, n) => ({ id: `w-${n}`, spec, titulo: tituloWidget(spec, giro) }));
    const Layout = plantilla.layout === 'sidebar' ? SidebarLayout : TopbarLayout;

    return (
        <div style={{ '--accent': giro.color } as CSSProperties}>
            <Layout secciones={secciones}>
                <DashboardHeader />
                <EjemplosBanner />
                <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
                    {secciones.map(seccion => {
                        const Widget = WIDGETS[seccion.spec.w];
                        return <Widget key={seccion.id} seccion={seccion} />;
                    })}
                </div>
            </Layout>
            <ModalHost />
        </div>
    );
}
