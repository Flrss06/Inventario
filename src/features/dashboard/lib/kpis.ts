// Indicadores del resumen. Cada giro elige cuáles mostrar en su campo "kpis".

import type { Giro, Item, KpiId } from '@/types';
import { diasPara, dinero, num } from '@/lib/format';
import { cantidadDe, minimoDe } from './inventario';

interface Kpi {
    label: string;
    icono: string;
    /** Color que toma cuando el valor es mayor a 0. */
    tono?: 'warn' | 'danger';
    calc: (items: Item[], giro: Giro) => number | string;
}

const caducidad = (i: Item) => (typeof i.caducidad === 'string' && i.caducidad ? diasPara(i.caducidad) : null);

export const KPIS: Record<KpiId, Kpi> = {
    unidades: {
        label: 'Unidades',
        icono: 'bi-boxes',
        calc: items => num(items.reduce((s, i) => s + cantidadDe(i), 0)),
    },
    productos: {
        label: 'Productos registrados',
        icono: 'bi-tags',
        calc: items => num(items.length),
    },
    modelos: {
        label: 'Modelos distintos',
        icono: 'bi-collection',
        calc: items => num(new Set(items.map(i => i.nombre)).size),
    },
    bajoStock: {
        label: 'Con poco stock',
        icono: 'bi-exclamation-triangle',
        tono: 'warn',
        calc: (items, giro) => items.filter(i => cantidadDe(i) > 0 && cantidadDe(i) <= minimoDe(i, giro)).length,
    },
    agotados: {
        label: 'Agotados',
        icono: 'bi-x-octagon',
        tono: 'danger',
        calc: items => items.filter(i => cantidadDe(i) === 0).length,
    },
    porCaducar: {
        label: 'Caducan en 7 días',
        icono: 'bi-hourglass-split',
        tono: 'warn',
        calc: items => items.filter(i => {
            const d = caducidad(i);
            return d !== null && d >= 0 && d <= 7;
        }).length,
    },
    caducados: {
        label: 'Caducados',
        icono: 'bi-calendar-x',
        tono: 'danger',
        calc: items => items.filter(i => {
            const d = caducidad(i);
            return d !== null && d < 0;
        }).length,
    },
    valor: {
        label: 'Valor del inventario',
        icono: 'bi-cash-stack',
        calc: items => dinero(items.reduce((s, i) => s + cantidadDe(i) * (Number(i.precio) || 0), 0)),
    },
};
