import { useDashboard } from '../context/DashboardContext';
import { alertasDe, subtituloDe } from '../lib/inventario';
import { TodoBien } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

const MAXIMO = 6;

export function AlertasWidget({ seccion }: WidgetProps) {
    const { giro, items } = useDashboard();
    const alertas = items
        .flatMap(item => alertasDe(item, giro).map(a => ({ ...a, item })))
        .sort((a, b) => (a.nivel === 'alta' ? 0 : 1) - (b.nivel === 'alta' ? 0 : 1));

    return (
        <WidgetCard seccion={seccion}>
            {alertas.length === 0 ? (
                <TodoBien mensaje="Todo en orden, no hay alertas." />
            ) : (
                <>
                    <ul className="flex flex-col gap-3">
                        {alertas.slice(0, MAXIMO).map(a => (
                            <li key={a.item.id + a.texto} className="flex items-start gap-3 text-sm">
                                <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${a.nivel === 'alta' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                <div>
                                    <strong className="text-ink">{a.item.nombre}</strong> <span className="text-muted">{subtituloDe(a.item, giro)}</span>
                                    <div>{a.texto}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {alertas.length > MAXIMO && <p className="mt-3 text-sm text-muted">y {alertas.length - MAXIMO} alertas más</p>}
                </>
            )}
        </WidgetCard>
    );
}
