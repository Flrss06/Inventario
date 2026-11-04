// Genera 30 días de ventas falsas para los productos de ejemplo,
// así el reporte de IA tiene algo que analizar desde el primer día.

import type { Item, Movimiento } from '@/types';
import { nuevoId } from './format';

// Qué tan rápido se vende cada producto según su posición: hay estrellas, normales y productos que no se mueven.
// Es una fracción del stock de referencia por día, para que un juego de $1,300 no "venda" lo mismo que el agua.
const RITMOS = [0.12, 0.04, 0.08, 0, 0.02, 0.06, 0.01, 0.15, 0.03, 0];

export function historialDeEjemplo(items: Item[]): Movimiento[] {
    let semilla = 17;
    const azar = () => (semilla = (semilla * 9301 + 49297) % 233280) / 233280;
    const movimientos: Movimiento[] = [];

    items.forEach((item, i) => {
        const referencia = Math.max(Number(item.cantidad) || 0, (Number(item.minimo) || 2) * 2, 3);
        const ritmo = RITMOS[i % RITMOS.length] * referencia;
        for (let dia = 30; dia >= 1; dia--) {
            const unidades = Math.floor(ritmo + azar());
            if (unidades <= 0) continue;
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - dia);
            fecha.setHours(10 + Math.floor(azar() * 9), Math.floor(azar() * 60));
            movimientos.push({ id: nuevoId() + i + dia, itemId: item.id, tipo: 'venta', cantidad: unidades, fecha: fecha.toISOString() });
        }
    });
    return movimientos;
}
