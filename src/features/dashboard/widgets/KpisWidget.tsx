import type { KpiId } from '@/types';
import { vocabularioDe } from '@/giros/vocabulario';
import { useDashboard } from '../context/DashboardContext';
import { KPIS } from '../lib/kpis';
import type { WidgetProps } from './tipos';

const ICONO = {
    normal: 'bg-accent/10 text-accent',
    warn: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
};

// Nombres por defecto para negocios que usan insumos (si el giro no trae los suyos).
const ETIQUETAS_CONSUMO: Partial<Record<KpiId, string>> = {
    productos: 'Insumos registrados',
    bajoStock: 'Insumos por pedir',
    agotados: 'Insumos agotados',
    valor: 'Valor en almacén',
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
        <section id={seccion.id} className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:col-span-2 xl:grid-cols-4">
            {giro.kpis.map((id, i) => {
                const kpi = KPIS[id];
                const valor = kpi.calc(items, giro);
                const tono = kpi.tono && typeof valor === 'number' && valor > 0 ? kpi.tono : 'normal';
                return (
                    <div
                        key={id}
                        style={{ animationDelay: `${i * 70}ms` }}
                        className={`flex animate-entrada gap-3.5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                            vertical ? `flex-col border-t-4 ${BORDE[tono]}` : 'items-center'
                        }`}
                    >
                        <i className={`bi ${kpi.icono} grid size-12 shrink-0 place-items-center rounded-2xl text-xl ${ICONO[tono]}`} />
                        <div>
                            <strong className="block text-2xl leading-tight font-extrabold text-ink">{valor}</strong>
                            <span className="text-sm text-muted">{giro.etiquetas?.[id] ?? (vocabularioDe(giro).tipo === 'consumo' ? ETIQUETAS_CONSUMO[id] : undefined) ?? kpi.label}</span>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}
