import { num } from '@/lib/format';
import { useDashboard } from '../context/DashboardContext';
import { campoDe, cantidadDe, minimoDe } from '../lib/inventario';
import { SinProductos } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

const EN_RESUMEN = 4;

const CELDA = {
    stock: 'bg-accent/10 text-accent font-bold',
    poco: 'bg-amber-100 text-amber-700 font-bold',
    agotado: 'bg-red-100 text-red-700 font-bold',
    nada: 'text-slate-400',
};

function Celda({ tipo, children }: { tipo: keyof typeof CELDA; children: string }) {
    return <span className={`inline-block min-w-8 rounded-md px-1.5 py-0.5 text-center ${CELDA[tipo]}`}>{children}</span>;
}

/** Matriz modelo × talla. Requiere que el giro tenga un campo "talla" con opciones. */
export function TallasWidget(props: WidgetProps) {
    const { giro, items } = useDashboard();
    const detalle = props.modo === 'detalle';
    const tallas = campoDe(giro, 'talla')?.options ?? [];
    const todos = [...new Set(items.map(i => i.nombre))];
    const modelos = detalle ? todos : todos.slice(0, EN_RESUMEN);
    const total = (filtro: (i: (typeof items)[number]) => boolean) => items.filter(filtro).reduce((s, i) => s + cantidadDe(i), 0);
    const th = 'border-b border-slate-200 px-3 py-2.5 text-xs font-semibold text-muted uppercase';

    return (
        <WidgetCard {...props} verTodo={todos.length > EN_RESUMEN ? `Ver los ${todos.length} modelos` : undefined}>
            {todos.length === 0 ? (
                <SinProductos />
            ) : (
                <>
                    <div className="-mx-2 overflow-x-auto px-2">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr>
                                    <th className={`${th} text-left`}>{campoDe(giro, 'nombre')?.label}</th>
                                    {tallas.map(t => <th key={t} className={`${th} text-center`}>{t}</th>)}
                                    {detalle && <th className={`${th} text-right`}>Total</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {modelos.map(modelo => (
                                    <tr key={modelo}>
                                        <td className="border-b border-slate-100 px-3 py-3 font-bold text-ink">{modelo}</td>
                                        {tallas.map(talla => {
                                            const deTalla = items.filter(i => i.nombre === modelo && String(i.talla) === talla);
                                            const cant = deTalla.reduce((s, i) => s + cantidadDe(i), 0);
                                            const tipo = !deTalla.length ? 'nada' : cant === 0 ? 'agotado' : cant <= minimoDe(deTalla[0], giro) ? 'poco' : 'stock';
                                            return (
                                                <td key={talla} className="border-b border-slate-100 px-3 py-3 text-center">
                                                    <Celda tipo={tipo}>{deTalla.length ? num(cant) : '—'}</Celda>
                                                </td>
                                            );
                                        })}
                                        {detalle && <td className="border-b border-slate-100 px-3 py-3 text-right font-bold text-ink">{num(total(i => i.nombre === modelo))}</td>}
                                    </tr>
                                ))}
                                {detalle && (
                                    <tr className="bg-slate-50">
                                        <td className="px-3 py-3 font-bold text-ink">Total por talla</td>
                                        {tallas.map(t => <td key={t} className="px-3 py-3 text-center font-semibold">{num(total(i => String(i.talla) === t))}</td>)}
                                        <td className="px-3 py-3 text-right font-extrabold text-ink">{num(total(() => true))}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                        <span><Celda tipo="stock">4</Celda> en stock</span>
                        <span><Celda tipo="poco">1</Celda> poco</span>
                        <span><Celda tipo="agotado">0</Celda> agotado</span>
                        <span><Celda tipo="nada">—</Celda> no la manejas</span>
                    </p>
                </>
            )}
        </WidgetCard>
    );
}
