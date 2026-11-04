import { DashboardHeader } from '../components/DashboardHeader';
import { DisenarBanner } from '../components/DisenarBanner';
import { EjemplosBanner } from '../components/EjemplosBanner';
import { AsistenteCard } from '../components/AsistenteCard';
import { WIDGETS } from '../widgets';
import { KpisWidget } from '../widgets/KpisWidget';
import type { Seccion } from '../widgets/tipos';

/** Página principal del panel: un poco de todo, con enlace a cada sección. */
export function ResumenPage({ secciones }: { secciones: Seccion[] }) {
    return (
        <>
            <DashboardHeader />
            <DisenarBanner />
            <EjemplosBanner />
            <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2">
                <KpisWidget seccion={{ id: 'resumen', titulo: 'Resumen', ruta: '/panel', spec: { w: 'kpis' } }} modo="resumen" />
                <AsistenteCard />
                {secciones.map(seccion => {
                    const Widget = WIDGETS[seccion.spec.w];
                    return <Widget key={seccion.id} seccion={seccion} modo="resumen" />;
                })}
            </div>
        </>
    );
}
