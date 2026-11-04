// Análisis del inventario a partir de las ventas de los últimos 30 días.
// Decide qué comprar (y cuánto), qué se vende más, qué no se mueve y qué sobra.
// Es la base del Asistente IA: funciona sin conexión y sus números se mandan a Claude para el reporte.

import type { Giro, Item, Movimiento } from '@/types';
import { diasPara, num } from '@/lib/format';
import { cantidadDe, minimoDe } from './inventario';
import { mayuscula, vocabularioDe } from '@/giros/vocabulario';

export type EstadoProducto = 'comprar' | 'promocion' | 'estancado' | 'exceso' | 'ok';

export interface ProductoAnalizado {
    item: Item;
    stock: number;
    minimo: number;
    vendidos30: number;
    vendidos7: number;
    ventaDiaria: number;
    /** Días que alcanza el stock al ritmo actual; null si no se vende. */
    diasCobertura: number | null;
    estado: EstadoProducto;
    /** Unidades sugeridas para comprar (0 si no hace falta). */
    sugerido: number;
    motivo: string;
}

export interface Recomendacion {
    nivel: 'alta' | 'media' | 'info';
    icono: string;
    titulo: string;
    detalle: string;
}

export interface Analisis {
    productos: ProductoAnalizado[];
    comprar: ProductoAnalizado[];
    top: ProductoAnalizado[];
    estancados: ProductoAnalizado[];
    exceso: ProductoAnalizado[];
    promocion: ProductoAnalizado[];
    unidadesVendidas30: number;
    ingresos30: number;
    costoCompraSugerida: number;
    /** Variación de unidades vendidas: últimos 7 días contra los 7 anteriores (en %). */
    tendencia: number | null;
    ventasPorDia: { fecha: string; unidades: number }[];
    recomendaciones: Recomendacion[];
}

const DIA = 86400000;
const COBERTURA_OBJETIVO = 30;
const COBERTURA_MINIMA = 10;
const COBERTURA_EXCESO = 90;

const precioDe = (i: Item) => Number(i.precio) || 0;
const nombres = (lista: ProductoAnalizado[], max = 3) =>
    lista.slice(0, max).map(p => p.item.nombre).join(', ') + (lista.length > max ? ` y ${lista.length - max} más` : '');

function claveDia(fecha: Date) {
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

function analizarProducto(item: Item, ventas: Movimiento[], giro: Giro, ahora: number, hayHistorial: boolean): ProductoAnalizado {
    const stock = cantidadDe(item);
    const minimo = minimoDe(item, giro);
    const propias = ventas.filter(m => m.itemId === item.id);
    const vendidos30 = propias.reduce((s, m) => s + m.cantidad, 0);
    const vendidos7 = propias.filter(m => ahora - new Date(m.fecha).getTime() <= 7 * DIA).reduce((s, m) => s + m.cantidad, 0);
    const ventaDiaria = vendidos30 / 30;
    const diasCobertura = ventaDiaria > 0 ? stock / ventaDiaria : null;
    const objetivo = Math.max(minimo * 2, Math.ceil(ventaDiaria * COBERTURA_OBJETIVO));
    const caducaEn = giro.caducidad && typeof item.caducidad === 'string' && item.caducidad ? diasPara(item.caducidad) : null;

    const base = { item, stock, minimo, vendidos30, vendidos7, ventaDiaria, diasCobertura };
    const v = vocabularioDe(giro);
    const unidad = typeof item.unidad === 'string' && item.unidad ? ` ${item.unidad}` : '';
    const porSemana = num(Math.round(ventaDiaria * 7 * 10) / 10) + unidad;

    // Sin ventas registradas todavía no podemos saber qué se mueve: solo cuidamos mínimos.
    if (!hayHistorial) {
        return stock <= minimo
            ? { ...base, estado: 'comprar', sugerido: Math.max(1, minimo * 2 - stock), motivo: stock === 0 ? 'Está agotado.' : 'Está en su stock mínimo.' }
            : { ...base, estado: 'ok', sugerido: 0, motivo: 'Nivel sano.' };
    }
    if (stock === 0 && vendidos30 === 0) {
        return { ...base, estado: 'comprar', sugerido: minimo, motivo: `Agotado y no ${v.reflexivo} desde hace 30 días: decide si vale la pena resurtir.` };
    }
    if (vendidos30 > 0 && (stock <= minimo || (diasCobertura !== null && diasCobertura < COBERTURA_MINIMA))) {
        const motivo = stock === 0
            ? `Agotado y ${v.presente} unos ${porSemana} por semana.`
            : `Te alcanza para unos ${Math.max(1, Math.floor(diasCobertura ?? 0))} días al ritmo actual.`;
        return { ...base, estado: 'comprar', sugerido: Math.max(1, objetivo - stock), motivo };
    }
    if (caducaEn !== null && caducaEn >= 0 && caducaEn <= 21 && stock > 0 && (diasCobertura === null || diasCobertura > caducaEn)) {
        return { ...base, estado: 'promocion', sugerido: 0, motivo: `Caduca en ${caducaEn} días y al ritmo actual no ${v.reflexivo} a tiempo.` };
    }
    if (vendidos30 === 0 && stock > 0) {
        return { ...base, estado: 'estancado', sugerido: 0, motivo: `No ${v.reflexivo} desde hace 30 días; tienes ${num(stock)}${unidad} parados.` };
    }
    if (diasCobertura !== null && diasCobertura > COBERTURA_EXCESO) {
        return { ...base, estado: 'exceso', sugerido: 0, motivo: `Tienes para ${num(Math.round(diasCobertura))} días: ${v.comprar.toLowerCase()} menos la próxima vez.` };
    }
    if (stock <= minimo) {
        return { ...base, estado: 'comprar', sugerido: Math.max(1, objetivo - stock), motivo: 'Está en su stock mínimo.' };
    }
    return { ...base, estado: 'ok', sugerido: 0, motivo: 'Nivel sano.' };
}

export function analizar(items: Item[], movimientos: Movimiento[], giro: Giro, ahora = Date.now()): Analisis {
    const ventas = movimientos.filter(m => m.tipo === 'venta' && ahora - new Date(m.fecha).getTime() <= 30 * DIA);
    const hayHistorial = ventas.length > 0;
    const productos = items.map(i => analizarProducto(i, ventas, giro, ahora, hayHistorial));

    const comprar = productos
        .filter(p => p.estado === 'comprar')
        .sort((a, b) => (a.diasCobertura ?? (a.stock === 0 ? -1 : 999)) - (b.diasCobertura ?? (b.stock === 0 ? -1 : 999)));
    const top = productos.filter(p => p.vendidos30 > 0).sort((a, b) => b.vendidos30 - a.vendidos30).slice(0, 5);
    const estancados = productos.filter(p => p.estado === 'estancado').sort((a, b) => b.stock * precioDe(b.item) - a.stock * precioDe(a.item));
    const exceso = productos.filter(p => p.estado === 'exceso');
    const promocion = productos.filter(p => p.estado === 'promocion');

    const vigentes = new Set(items.map(i => i.id));
    const precios = new Map(items.map(i => [i.id, precioDe(i)]));
    const ventasVigentes = ventas.filter(m => vigentes.has(m.itemId));
    const unidadesVendidas30 = ventasVigentes.reduce((s, m) => s + m.cantidad, 0);
    const ingresos30 = ventasVigentes.reduce((s, m) => s + m.cantidad * (precios.get(m.itemId) ?? 0), 0);
    const costoCompraSugerida = comprar.reduce((s, p) => s + p.sugerido * precioDe(p.item), 0);

    const ultimos7 = ventasVigentes.filter(m => ahora - new Date(m.fecha).getTime() <= 7 * DIA).reduce((s, m) => s + m.cantidad, 0);
    const previos7 = ventasVigentes
        .filter(m => {
            const edad = ahora - new Date(m.fecha).getTime();
            return edad > 7 * DIA && edad <= 14 * DIA;
        })
        .reduce((s, m) => s + m.cantidad, 0);
    const tendencia = previos7 > 0 ? Math.round(((ultimos7 - previos7) / previos7) * 100) : null;

    const porDia = new Map<string, number>();
    for (let d = 29; d >= 0; d--) porDia.set(claveDia(new Date(ahora - d * DIA)), 0);
    for (const m of ventasVigentes) {
        const clave = claveDia(new Date(m.fecha));
        if (porDia.has(clave)) porDia.set(clave, (porDia.get(clave) ?? 0) + m.cantidad);
    }
    const ventasPorDia = [...porDia].map(([fecha, unidades]) => ({ fecha, unidades }));

    // Los textos salen del vocabulario del giro: una tienda "vende" y "compra"; un restaurante "usa" y "pide".
    const v = vocabularioDe(giro);
    const cuantos = (n: number) => `${n} ${n === 1 ? v.producto : v.productos}`;
    const recomendaciones: Recomendacion[] = [];
    if (comprar.length) {
        recomendaciones.push({
            nivel: 'alta',
            icono: 'bi-cart-plus',
            titulo: `${v.comprar} ${cuantos(comprar.length)} pronto`,
            detalle: `${nombres(comprar)}. Revisa la lista sugerida con las cantidades.`,
        });
    }
    if (promocion.length) {
        recomendaciones.push({
            nivel: 'alta',
            icono: v.tipo === 'consumo' ? 'bi-fire' : 'bi-percent',
            titulo: v.tituloCaducidad,
            detalle: `${nombres(promocion)} ${promocion.length === 1 ? 'caduca' : 'caducan'} pronto y al ritmo actual no ${promocion.length === 1 ? v.reflexivo : v.reflexivoPlural} a tiempo.`,
        });
    }
    if (top[0]) {
        const unidad = typeof top[0].item.unidad === 'string' && top[0].item.unidad ? ` ${top[0].item.unidad}` : '';
        recomendaciones.push({
            nivel: 'info',
            icono: 'bi-trophy',
            titulo: `${top[0].item.nombre} es lo que más ${v.presente}`,
            detalle: `${mayuscula(v.pasado)} ${num(top[0].vendidos30)}${unidad} en 30 días. Que nunca te falte${top[1] ? `, igual que ${top[1].item.nombre}` : ''}.`,
        });
    }
    if (estancados.length) {
        recomendaciones.push({
            nivel: 'media',
            icono: 'bi-hourglass',
            titulo: `${cuantos(estancados.length)} no ${estancados.length === 1 ? v.reflexivo : v.reflexivoPlural}`,
            detalle: `${nombres(estancados)}. ${v.consejoEstancado}`,
        });
    }
    if (exceso.length) {
        recomendaciones.push({
            nivel: 'media',
            icono: 'bi-box-arrow-down',
            titulo: 'Tienes más de lo que necesitas',
            detalle: `${nombres(exceso)}: ${v.comprar.toLowerCase()} menos la próxima vez para no tener dinero parado.`,
        });
    }
    if (tendencia !== null && Math.abs(tendencia) >= 15) {
        recomendaciones.push({
            nivel: 'info',
            icono: tendencia > 0 ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow',
            titulo: tendencia > 0 ? `${v.subio} ${tendencia}%` : `${v.bajo} ${Math.abs(tendencia)}%`,
            detalle: 'Comparando los últimos 7 días contra la semana anterior.',
        });
    }
    if (!hayHistorial && items.length) {
        recomendaciones.push({
            nivel: 'info',
            icono: 'bi-lightbulb',
            titulo: `Registra cada ${v.salida} para recibir mejores consejos`,
            detalle: `${v.instruccion} Con eso sabremos qué ${v.reflexivo} más y qué no se mueve.`,
        });
    }
    if (!recomendaciones.length) {
        recomendaciones.push({ nivel: 'info', icono: 'bi-emoji-smile', titulo: 'Tu inventario está sano', detalle: 'No hay nada urgente por ahora. Sigue registrando tus movimientos para mejores sugerencias.' });
    }

    return {
        productos,
        comprar,
        top,
        estancados,
        exceso,
        promocion,
        unidadesVendidas30,
        ingresos30,
        costoCompraSugerida,
        tendencia,
        ventasPorDia,
        recomendaciones,
    };
}
