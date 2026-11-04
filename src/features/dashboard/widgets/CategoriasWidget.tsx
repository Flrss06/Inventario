import { dinero, num } from '@/lib/format';
import { mayuscula, vocabularioDe } from '@/giros/vocabulario';
import { useDashboard } from '../context/DashboardContext';
import { cantidadDe, campoDe } from '../lib/inventario';
import { Barra } from '../components/Barra';
import { SinProductos } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

const EN_RESUMEN = 5;

/** Existencias agrupadas por un campo (categoría, marca, estante...). */
export function CategoriasWidget(props: WidgetProps) {
    const { giro, items, analisis } = useDashboard();
    const por = props.seccion.spec.por ?? giro.agruparPor;
    const detalle = props.modo === 'detalle';
    const vendidos = new Map(analisis.productos.map(p => [p.item.id, p.vendidos30]));

    const grupos = new Map<string, { productos: number; unidades: number; valor: number; vendidos: number }>();
    for (const item of items) {
        const clave = String(item[por] || 'Sin dato');
        const g = grupos.get(clave) ?? { productos: 0, unidades: 0, valor: 0, vendidos: 0 };
        g.productos += 1;
        g.unidades += cantidadDe(item);
        g.valor += cantidadDe(item) * (Number(item.precio) || 0);
        g.vendidos += vendidos.get(item.id) ?? 0;
        grupos.set(clave, g);
    }
    const filas = [...grupos].sort((a, b) => b[1].unidades - a[1].unidades);
    const maximo = Math.max(...filas.map(f => f[1].unidades), 1);
    const totalValor = filas.reduce((s, f) => s + f[1].valor, 0) || 1;

    return (
        <WidgetCard {...props} verTodo={filas.length > EN_RESUMEN ? `Ver los ${filas.length} grupos` : undefined}>
            {filas.length === 0 ? (
                <SinProductos />
            ) : detalle ? (
                <div className="-mx-2 overflow-x-auto px-2">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="text-left text-xs tracking-wide text-muted uppercase">
                                <th className="border-b border-slate-200 px-3 py-2.5">{campoDe(giro, por)?.label ?? 'Grupo'}</th>
                                <th className="w-2/5 border-b border-slate-200 px-3 py-2.5">Unidades</th>
                                <th className="border-b border-slate-200 px-3 py-2.5 text-right">Productos</th>
                                <th className="border-b border-slate-200 px-3 py-2.5 text-right">{mayuscula(vocabularioDe(giro).hechos)} (30 d)</th>
                                <th className="border-b border-slate-200 px-3 py-2.5 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filas.map(([clave, g]) => (
                                <tr key={clave}>
                                    <td className="border-b border-slate-100 px-3 py-3 font-semibold text-ink">{clave}</td>
                                    <td className="border-b border-slate-100 px-3 py-3">
                                        <Barra etiqueta="" valor={<strong className="text-ink">{num(g.unidades)}</strong>} porcentaje={(g.unidades / maximo) * 100} />
                                    </td>
                                    <td className="border-b border-slate-100 px-3 py-3 text-right">{num(g.productos)}</td>
                                    <td className="border-b border-slate-100 px-3 py-3 text-right">{num(g.vendidos)}</td>
                                    <td className="border-b border-slate-100 px-3 py-3 text-right">
                                        {dinero(g.valor)} <span className="text-xs text-muted">({Math.round((g.valor / totalValor) * 100)}%)</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col gap-3.5">
                    {filas.slice(0, EN_RESUMEN).map(([clave, g]) => (
                        <Barra key={clave} etiqueta={clave} valor={<strong className="text-ink">{num(g.unidades)}</strong>} porcentaje={(g.unidades / maximo) * 100} />
                    ))}
                </div>
            )}
        </WidgetCard>
    );
}
