import { num } from '@/lib/format';
import { useDashboard } from '../context/DashboardContext';
import { cantidadDe } from '../lib/inventario';
import { Barra } from '../components/Barra';
import { SinProductos } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

/** Suma de existencias agrupadas por un campo (categoría, marca, estante...). */
export function CategoriasWidget({ seccion }: WidgetProps) {
    const { giro, items } = useDashboard();
    const por = seccion.spec.por ?? giro.agruparPor;

    const grupos = new Map<string, number>();
    for (const item of items) {
        const clave = String(item[por] || 'Sin dato');
        grupos.set(clave, (grupos.get(clave) ?? 0) + cantidadDe(item));
    }
    const filas = [...grupos].sort((a, b) => b[1] - a[1]);
    const maximo = Math.max(...filas.map(f => f[1]), 1);

    return (
        <WidgetCard seccion={seccion}>
            {filas.length === 0 ? (
                <SinProductos />
            ) : (
                <div className="flex flex-col gap-3.5">
                    {filas.map(([clave, total]) => (
                        <Barra key={clave} etiqueta={clave} valor={<strong className="text-ink">{num(total)}</strong>} porcentaje={Math.round((total / maximo) * 100)} />
                    ))}
                </div>
            )}
        </WidgetCard>
    );
}
