import { useDashboard } from '../context/DashboardContext';
import { KPIS } from '../lib/kpis';
import type { WidgetProps } from './tipos';

const ICONO = {
    normal: 'bg-accent/10 text-accent',
    warn: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
};

const BORDE = {
    normal: 'border-t-accent',
    warn: 'border-t-amber-500',
    danger: 'border-t-red-500',
};

/** Fila de indicadores. No lleva marco: cada indicador es su propia tarjeta. */
export function KpisWidget({ seccion }: WidgetProps) {
    const { giro, items, plantilla } = useDashboard();
    const vertical = plantilla.layout === 'topbar';

    return (
        <section id={seccion.id} className="grid scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:col-span-2 xl:grid-cols-4">
            {giro.kpis.map(id => {
                const kpi = KPIS[id];
                const valor = kpi.calc(items, giro);
                const tono = kpi.tono && typeof valor === 'number' && valor > 0 ? kpi.tono : 'normal';
                return (
                    <div
                        key={id}
                        className={`flex gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${
                            vertical ? `flex-col border-t-4 ${BORDE[tono]}` : 'items-center'
                        }`}
                    >
                        <i className={`bi ${kpi.icono} grid size-11 shrink-0 place-items-center rounded-lg text-xl ${ICONO[tono]}`} />
                        <div>
                            <strong className="block text-2xl leading-tight text-ink">{valor}</strong>
                            <span className="text-sm text-muted">{giro.etiquetas?.[id] ?? kpi.label}</span>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
