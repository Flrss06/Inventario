import { diasPara } from '@/lib/format';
import { useDashboard } from '../context/DashboardContext';
import { SinProductos } from '../components/Estados';
import { WidgetCard } from '../components/WidgetCard';
import type { WidgetProps } from './tipos';

const RANGOS = [
    { texto: 'Caducados', estilo: 'border-red-500 bg-red-50', entra: (d: number) => d < 0 },
    { texto: 'Hoy a 3 días', estilo: 'border-red-500 bg-red-50', entra: (d: number) => d >= 0 && d <= 3 },
    { texto: '4 a 7 días', estilo: 'border-amber-500 bg-amber-50', entra: (d: number) => d >= 4 && d <= 7 },
    { texto: '8 a 30 días', estilo: 'border-accent bg-slate-50', entra: (d: number) => d >= 8 && d <= 30 },
    { texto: 'Más de 30 días', estilo: 'border-accent bg-slate-50', entra: (d: number) => d > 30 },
];

/** Productos agrupados por qué tan pronto caducan. */
export function CaducidadWidget({ seccion }: WidgetProps) {
    const { items } = useDashboard();
    const conFecha = items.flatMap(i => (typeof i.caducidad === 'string' && i.caducidad ? [{ item: i, dias: diasPara(i.caducidad) }] : []));

    return (
        <WidgetCard seccion={seccion}>
            {conFecha.length === 0 ? (
                <SinProductos mensaje="Agrega fechas de caducidad para ver este apartado." />
            ) : (
                <div className="grid gap-2.5">
                    {RANGOS.map(rango => {
                        const grupo = conFecha.filter(c => rango.entra(c.dias));
                        const nombres = grupo.slice(0, 3).map(c => c.item.nombre).join(', ') + (grupo.length > 3 ? ` y ${grupo.length - 3} más` : '');
                        return (
                            <div
                                key={rango.texto}
                                className={`flex items-center gap-3.5 rounded-lg border-l-4 px-3.5 py-2.5 text-sm ${grupo.length ? rango.estilo : 'border-slate-300 bg-slate-50'}`}
                            >
                                <b className="min-w-[2ch] text-center text-2xl text-ink">{grupo.length}</b>
                                <div>
                                    {rango.texto}
                                    <small className="block text-muted">{nombres || 'Ninguno'}</small>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </WidgetCard>
    );
}
