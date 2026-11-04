import { useState } from 'react';
import { num } from '@/lib/format';
import { useDashboard } from '../context/DashboardContext';
import { alertasDe, cantidadDe, minimoDe, subtituloDe } from '../lib/inventario';
import { ItemActions } from '../components/ItemActions';
import { QuantityStepper } from '../components/QuantityStepper';
import { TodoBien } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

const EN_RESUMEN = 4;
type Filtro = 'todas' | 'alta' | 'media';

export function AlertasWidget(props: WidgetProps) {
    const { giro, items } = useDashboard();
    const [filtro, setFiltro] = useState<Filtro>('todas');
    const detalle = props.modo === 'detalle';

    const alertas = items
        .flatMap(item => alertasDe(item, giro).map(a => ({ ...a, item })))
        .sort((a, b) => (a.nivel === 'alta' ? 0 : 1) - (b.nivel === 'alta' ? 0 : 1));
    const filtradas = alertas.filter(a => filtro === 'todas' || a.nivel === filtro);
    const visibles = detalle ? filtradas : alertas.slice(0, EN_RESUMEN);
    const cuenta = (n: Filtro) => (n === 'todas' ? alertas.length : alertas.filter(a => a.nivel === n).length);

    return (
        <WidgetCard {...props} verTodo={alertas.length > EN_RESUMEN ? `Ver las ${alertas.length} alertas` : undefined}>
            {alertas.length === 0 ? (
                <TodoBien mensaje="Todo en orden, no hay alertas." />
            ) : (
                <>
                    {detalle && (
                        <div className="mb-5 inline-flex rounded-xl bg-slate-100 p-1" role="group" aria-label="Filtrar alertas">
                            {(['todas', 'alta', 'media'] as Filtro[]).map(f => (
                                <button
                                    key={f}
                                    type="button"
                                    aria-pressed={filtro === f}
                                    onClick={() => setFiltro(f)}
                                    className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${filtro === f ? 'bg-white text-ink shadow-sm' : 'text-muted'}`}
                                >
                                    {{ todas: 'Todas', alta: 'Urgentes', media: 'Avisos' }[f]} <span className="ml-1 text-xs text-muted">{cuenta(f)}</span>
                                </button>
                            ))}
                        </div>
                    )}
                    <ul className={detalle ? 'divide-y divide-slate-100' : 'flex flex-col gap-3'}>
                        {visibles.map(a => (
                            <li key={a.item.id + a.texto} className={`flex items-start gap-3 text-sm ${detalle ? 'py-3.5' : ''}`}>
                                <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${a.nivel === 'alta' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                    <i className={`bi ${a.nivel === 'alta' ? 'bi-exclamation-octagon' : 'bi-exclamation-triangle'}`} />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <strong className="text-ink">{a.item.nombre}</strong> <span className="text-muted">{subtituloDe(a.item, giro)}</span>
                                    <div>{a.texto}{detalle && <span className="text-muted"> · mínimo {num(minimoDe(a.item, giro))}, tienes {num(cantidadDe(a.item))}</span>}</div>
                                </div>
                                {detalle && (
                                    <div className="flex shrink-0 items-center gap-1">
                                        <QuantityStepper item={a.item} />
                                        <ItemActions item={a.item} />
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </WidgetCard>
    );
}
