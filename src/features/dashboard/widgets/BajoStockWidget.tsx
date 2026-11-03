import { num } from '@/lib/format';
import { useDashboard } from '../context/DashboardContext';
import { cantidadDe, minimoDe, subtituloDe } from '../lib/inventario';
import { Barra } from '../components/Barra';
import { TodoBien } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

/** Productos con menos del doble de su mínimo, ordenados del más urgente al menos. */
export function BajoStockWidget({ seccion }: WidgetProps) {
    const { giro, items } = useDashboard();
    const proporcion = (i: (typeof items)[number]) => cantidadDe(i) / (minimoDe(i, giro) || 1);
    const lista = items
        .filter(i => cantidadDe(i) <= minimoDe(i, giro) * 2)
        .sort((a, b) => proporcion(a) - proporcion(b))
        .slice(0, 6);

    return (
        <WidgetCard seccion={seccion}>
            {lista.length === 0 ? (
                <TodoBien mensaje="Tienes suficiente de todo." />
            ) : (
                <div className="flex flex-col gap-3.5">
                    {lista.map(item => {
                        const cant = cantidadDe(item);
                        const min = minimoDe(item, giro);
                        return (
                            <Barra
                                key={item.id}
                                etiqueta={<><strong className="text-ink">{item.nombre}</strong> <span className="text-muted">{subtituloDe(item, giro)}</span></>}
                                valor={`${num(cant)} / mín. ${num(min)}`}
                                porcentaje={Math.min(100, Math.round((cant / ((min || 1) * 2)) * 100))}
                                nivel={cant === 0 ? 'alta' : cant <= min ? 'media' : 'normal'}
                            />
                        );
                    })}
                </div>
            )}
        </WidgetCard>
    );
}
