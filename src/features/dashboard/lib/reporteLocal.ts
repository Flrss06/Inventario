// Reporte escrito sin IA, con el mismo formato que el de Claude, a partir del análisis.

import type { Vocabulario } from '@/types';
import { dinero, num } from '@/lib/format';
import { mayuscula } from '@/giros/vocabulario';
import type { Analisis } from './analisis';

export function reporteLocal(negocio: string, a: Analisis, v: Vocabulario) {
    const lineas: string[] = ['## Resumen'];
    const tendencia = a.tendencia === null ? '' : a.tendencia >= 0 ? `, ${a.tendencia}% más que la semana anterior` : `, ${Math.abs(a.tendencia)}% menos que la semana anterior`;
    lineas.push(
        a.unidadesVendidas30
            ? `En los últimos 30 días ${v.pasado} **${num(a.unidadesVendidas30)} unidades** (${dinero(a.ingresos30)} ${v.monto})${tendencia}.`
            : `Todavía no hay movimientos registrados en ${negocio}. ${v.instruccion}`,
    );
    if (a.comprar.length) lineas.push(`Hay **${a.comprar.length} ${v.productos} por reponer**, con una inversión aproximada de ${dinero(a.costoCompraSugerida)}.`);

    if (a.comprar.length) {
        lineas.push(`## Qué ${v.comprar === 'Pide' ? 'pedir' : 'comprar'}`);
        for (const p of a.comprar.slice(0, 8)) {
            const unidad = typeof p.item.unidad === 'string' && p.item.unidad ? ` ${p.item.unidad}` : '';
            lineas.push(`- **${p.item.nombre}**: ${num(p.sugerido)}${unidad}. ${p.motivo}`);
        }
    }
    if (a.top.length) {
        lineas.push(`## Lo que más ${v.presente}`);
        for (const p of a.top.slice(0, 5)) lineas.push(`- **${p.item.nombre}**: ${num(p.vendidos30)} ${v.hechos} en 30 días.`);
    }
    if (a.estancados.length || a.exceso.length) {
        lineas.push('## Lo que no se mueve');
        for (const p of [...a.estancados, ...a.exceso].slice(0, 6)) lineas.push(`- **${p.item.nombre}**: ${p.motivo}`);
    }

    lineas.push('## Recomendaciones');
    for (const r of a.recomendaciones.slice(0, 4)) lineas.push(`- **${mayuscula(r.titulo)}.** ${r.detalle}`);
    return lineas.join('\n');
}
