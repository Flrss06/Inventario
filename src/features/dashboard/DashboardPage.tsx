import { useEffect, type CSSProperties } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { WIDGET_META } from '@/data/widgets';
import { cargarNegocio, sesionActual } from '@/services/db';
import { DashboardProvider } from './context/DashboardProvider';
import { useDashboard } from './context/DashboardContext';
import { SidebarLayout } from './layouts/SidebarLayout';
import { TopbarLayout } from './layouts/TopbarLayout';
import { ModalHost } from './modals/ModalHost';
import { AsistentePage } from './pages/AsistentePage';
import { ResumenPage } from './pages/ResumenPage';
import { SeccionPage } from './pages/SeccionPage';
import { tituloWidget } from './widgets';
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

/** Arma la plantilla elegida: diseño (lateral o superior) y una página por apartado. */
function Panel() {
    const { negocio, giro, plantilla } = useDashboard();
    const { pathname } = useLocation();

    useEffect(() => {
        document.title = `${negocio.nombre} | Kiubo`;
    }, [negocio.nombre]);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [pathname]);

    const secciones: Seccion[] = plantilla.widgets
        .filter(spec => spec.w !== 'kpis')
        .map((spec, n) => ({ id: `w-${n}`, spec, titulo: tituloWidget(spec, giro), ruta: `/panel/${WIDGET_META[spec.w].ruta}` }));
    const Layout = plantilla.layout === 'sidebar' ? SidebarLayout : TopbarLayout;

    return (
        <div style={{ '--accent': giro.color } as CSSProperties}>
            <Layout secciones={secciones}>
                <div key={pathname} className="animate-entrada">
                    <Routes>
                        <Route index element={<ResumenPage secciones={secciones} />} />
                        <Route path="ia" element={<AsistentePage />} />
                        <Route path=":ruta" element={<SeccionPage secciones={secciones} />} />
                    </Routes>
                </div>
            </Layout>
            <ModalHost />
        </div>
    );
}
