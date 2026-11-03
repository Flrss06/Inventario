// Reglas de inventario que dependen del giro: mínimos, alertas, búsqueda.

import type { Giro, Item } from '@/types';
import { diasPara, estaVacio, num } from '@/lib/format';

export type Nivel = 'alta' | 'media';

export interface Alerta {
    nivel: Nivel;
    texto: string;
}

export const cantidadDe = (i: Item) => Number(i.cantidad) || 0;

export const minimoDe = (i: Item, giro: Giro) => (estaVacio(i.minimo) ? giro.minimo : Number(i.minimo));

export const subtituloDe = (i: Item, giro: Giro) => giro.subtitulo.map(k => i[k]).filter(Boolean).join(' · ');

export const campoDe = (giro: Giro, key: string) => giro.campos.find(c => c.key === key);

export function alertasDe(i: Item, giro: Giro): Alerta[] {
    const alertas: Alerta[] = [];
    const cant = cantidadDe(i);
    if (cant === 0) alertas.push({ nivel: 'alta', texto: 'Agotado' });
    else if (cant <= minimoDe(i, giro)) alertas.push({ nivel: 'media', texto: `Quedan ${num(cant)}` });

    if (giro.caducidad && typeof i.caducidad === 'string' && i.caducidad) {
        const d = diasPara(i.caducidad);
        if (d < 0) alertas.push({ nivel: 'alta', texto: `Caducó hace ${-d} ${d === -1 ? 'día' : 'días'}` });
        else if (d === 0) alertas.push({ nivel: 'alta', texto: 'Caduca hoy' });
        else if (d <= 7) alertas.push({ nivel: d <= 3 ? 'alta' : 'media', texto: `Caduca en ${d} ${d === 1 ? 'día' : 'días'}` });
    }
    return alertas;
}

export function filtrarItems(items: Item[], giro: Giro, busqueda: string) {
    const q = busqueda.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => giro.campos.map(c => i[c.key] ?? '').join(' ').toLowerCase().includes(q));
}
