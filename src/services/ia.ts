// Llamadas del navegador a los endpoints de IA (server/ia).
// Si la IA no está configurada o falla, regresan null y la app usa el análisis local.

import type { Cuestionario, GiroGuardado, Vocabulario } from '@/types';
import type { Analisis, ProductoAnalizado } from '@/features/dashboard/lib/analisis';
import { normalizarGiro } from '@/giros/personalizado';

async function post<T>(ruta: string, cuerpo: unknown): Promise<T | null> {
    try {
        const res = await fetch(`/api/ia/${ruta}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cuerpo),
        });
        return res.ok ? ((await res.json()) as T) : null;
    } catch {
        return null;
    }
}

const resumirProducto = (p: ProductoAnalizado) => ({
    nombre: p.item.nombre,
    stock: p.stock,
    minimo: p.minimo,
    salidas30dias: p.vendidos30,
    unidad: typeof p.item.unidad === 'string' ? p.item.unidad : undefined,
    diasQueAlcanza: p.diasCobertura === null ? null : Math.round(p.diasCobertura),
    comprarSugerido: p.sugerido,
    precio: Number(p.item.precio) || 0,
    motivo: p.motivo,
});

/** Reporte escrito por Claude. Solo mandamos números ya calculados, nunca datos de la cuenta. */
export async function reporteConIA(negocio: string, giro: string, a: Analisis, v: Vocabulario) {
    const r = await post<{ texto: string }>('reporte', {
        negocio,
        giro,
        // "venta": el negocio vende sus productos. "consumo": los usa como insumos (p. ej. un restaurante).
        tipoDeSalida: v.tipo,
        totales: {
            productos: a.productos.length,
            unidadesQueSalieron30dias: a.unidadesVendidas30,
            montoDeLoQueSalio30dias: Math.round(a.ingresos30),
            inversionSugeridaEnCompras: Math.round(a.costoCompraSugerida),
            tendenciaSemanalPorciento: a.tendencia,
        },
        comprar: a.comprar.slice(0, 15).map(resumirProducto),
        masSalida: a.top.map(resumirProducto),
        sinMovimiento: a.estancados.slice(0, 10).map(resumirProducto),
        exceso: a.exceso.slice(0, 10).map(resumirProducto),
        enRiesgoDeCaducar: a.promocion.slice(0, 10).map(resumirProducto),
    });
    return r?.texto ?? null;
}

/** Panel diseñado por Claude a partir del cuestionario. Se vuelve a validar aquí por seguridad. */
export async function disenarConIA(c: Cuestionario): Promise<GiroGuardado | null> {
    const r = await post<{ giro: unknown }>('disenar', c);
    return r ? normalizarGiro(r.giro, { nombre: c.queVende }) : null;
}
