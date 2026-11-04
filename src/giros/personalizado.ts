// Giros a la medida: catálogo de opciones del cuestionario y validación del diseño.
// Este archivo también lo usa el servidor (server/ia), así que solo importa con rutas relativas.

import type { Campo, GiroGuardado, ItemDatos, KpiId, Plantilla, Prioridad, WidgetId } from '../types';
import { CONSUMO, VENTA } from './vocabulario';

/** Datos extra que el cliente puede pedir registrar de cada producto. */
export const CAMPOS_OPCIONALES: (Campo & { descripcion: string })[] = [
    { key: 'categoria', label: 'Categoría', type: 'text', descripcion: 'Para agrupar productos' },
    { key: 'marca', label: 'Marca', type: 'text', descripcion: 'Fabricante o marca' },
    { key: 'modelo', label: 'Modelo', type: 'text', descripcion: 'Versión o modelo específico' },
    { key: 'sku', label: 'SKU / Código', type: 'text', descripcion: 'Código de barras o interno' },
    { key: 'proveedor', label: 'Proveedor', type: 'text', descripcion: 'A quién se lo compras' },
    { key: 'ubicacion', label: 'Ubicación', type: 'text', descripcion: 'Estante, pasillo o bodega' },
    { key: 'condicion', label: 'Condición', type: 'select', options: ['Nuevo', 'Seminuevo', 'Usado'], descripcion: 'Nuevo o usado' },
    { key: 'talla', label: 'Talla', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'Unitalla'], descripcion: 'Para ropa o calzado' },
    { key: 'color', label: 'Color', type: 'text', descripcion: 'Variante de color' },
    { key: 'caducidad', label: 'Caducidad', type: 'date', descripcion: 'Fecha de vencimiento' },
    { key: 'lote', label: 'Lote', type: 'text', descripcion: 'Número de lote' },
    { key: 'numSerie', label: 'No. de serie', type: 'text', descripcion: 'Para equipos o garantías' },
];

export const PRIORIDADES: { id: Prioridad; label: string; icono: string }[] = [
    { id: 'stock', label: 'No quedarme sin mercancía', icono: 'bi-box-seam' },
    { id: 'ventas', label: 'Saber qué se vende más', icono: 'bi-graph-up-arrow' },
    { id: 'caducidad', label: 'Controlar caducidades', icono: 'bi-calendar-x' },
    { id: 'tallas', label: 'Controlar tallas o variantes', icono: 'bi-rulers' },
    { id: 'ubicacion', label: 'Saber dónde está cada cosa', icono: 'bi-geo-alt' },
];

export const ICONOS_PERMITIDOS = [
    'bi-shop', 'bi-controller', 'bi-capsule', 'bi-hammer', 'bi-phone', 'bi-book', 'bi-brush', 'bi-heart-pulse',
    'bi-basket', 'bi-gem', 'bi-flower1', 'bi-bicycle', 'bi-cup-hot', 'bi-laptop', 'bi-music-note-beamed', 'bi-gift',
    'bi-palette', 'bi-tools', 'bi-bag', 'bi-box-seam',
];

export const COLORES_PERMITIDOS = ['#6c47ff', '#0ea5e9', '#10b981', '#f97316', '#e11d48', '#8b5cf6', '#14b8a6', '#d946ef', '#2563eb', '#ca8a04'];

export const WIDGET_IDS: WidgetId[] = ['kpis', 'tabla', 'tarjetas', 'tallas', 'alertas', 'bajoStock', 'categorias', 'caducidad', 'ventas'];
export const KPI_IDS: KpiId[] = ['unidades', 'productos', 'modelos', 'bajoStock', 'agotados', 'porCaducar', 'caducados', 'valor'];

const TIPOS_CAMPO = ['text', 'number', 'money', 'date', 'select'] as const;

const texto = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * Revisa y corrige un diseño de giro (venga de la IA o de otro lado) para que el panel
 * siempre pueda dibujarlo: campos obligatorios, apartados válidos, plantillas completas.
 */
export function normalizarGiro(raw: unknown, respaldo: { nombre: string }): GiroGuardado {
    const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;

    // Campos: sin duplicados, tipos válidos y siempre con nombre, cantidad, precio y mínimo.
    const campos: Campo[] = [];
    const vistos = new Set<string>();
    for (const c of Array.isArray(r.campos) ? r.campos : []) {
        const campo = c as Record<string, unknown>;
        const key = texto(campo.key, 30).replace(/[^a-zA-Z0-9]/g, '');
        if (!key || vistos.has(key)) continue;
        const type = TIPOS_CAMPO.includes(campo.type as never) ? (campo.type as Campo['type']) : 'text';
        const options = Array.isArray(campo.options) ? campo.options.map(o => texto(o, 40)).filter(Boolean).slice(0, 12) : undefined;
        vistos.add(key);
        campos.push({
            key,
            label: texto(campo.label, 30) || key,
            type: type === 'select' && !options?.length ? 'text' : type,
            ...(type === 'select' && options?.length ? { options } : {}),
            ...(campo.required ? { required: true } : {}),
            ...(campo.tabla === false ? { tabla: false } : {}),
        });
    }
    const asegurar = (campo: Campo, posicion: number) => {
        const existente = campos.findIndex(c => c.key === campo.key);
        if (existente >= 0) campos[existente] = { ...campos[existente], type: campo.type, required: campo.required ?? campos[existente].required };
        else campos.splice(Math.min(posicion, campos.length), 0, campo);
    };
    asegurar({ key: 'nombre', label: 'Producto', type: 'text', required: true }, 0);
    asegurar({ key: 'cantidad', label: 'Cantidad', type: 'number', required: true }, campos.length);
    asegurar({ key: 'precio', label: 'Precio', type: 'money' }, campos.length);
    asegurar({ key: 'minimo', label: 'Stock mínimo', type: 'number', tabla: false }, campos.length);
    const claves = new Set(campos.map(c => c.key));

    const caducidad = claves.has('caducidad');
    const tieneTalla = campos.some(c => c.key === 'talla' && c.options?.length);
    const agruparPor = claves.has(texto(r.agruparPor, 30)) ? texto(r.agruparPor, 30) : (campos.find(c => !['nombre', 'cantidad', 'precio', 'minimo'].includes(c.key))?.key ?? 'nombre');

    const widgetValido = (w: unknown): w is WidgetId =>
        WIDGET_IDS.includes(w as WidgetId) && (w !== 'caducidad' || caducidad) && (w !== 'tallas' || tieneTalla);

    const plantilla = (p: unknown, layout: Plantilla['layout'], nombre: string): Plantilla => {
        const pr = (p && typeof p === 'object' ? p : {}) as Record<string, unknown>;
        const widgets: Plantilla['widgets'] = [];
        for (const w of Array.isArray(pr.widgets) ? pr.widgets : []) {
            const spec = (typeof w === 'string' ? { w } : w) as Record<string, unknown>;
            if (!widgetValido(spec.w) || widgets.some(x => x.w === spec.w)) continue;
            const por = texto(spec.por, 30);
            widgets.push({ w: spec.w as WidgetId, ...(spec.w === 'categorias' && claves.has(por) ? { por } : {}) });
        }
        // Siempre empieza con el resumen y tiene dónde ver y agregar productos.
        if (!widgets.some(w => w.w === 'kpis')) widgets.unshift({ w: 'kpis' });
        else widgets.unshift(...widgets.splice(widgets.findIndex(w => w.w === 'kpis'), 1));
        if (!widgets.some(w => w.w === 'tabla' || w.w === 'tarjetas')) widgets.push({ w: layout === 'sidebar' ? 'tabla' : 'tarjetas' });
        return { nombre: texto(pr.nombre, 30) || nombre, descripcion: texto(pr.descripcion, 140) || 'Diseñada para tu negocio.', layout, widgets };
    };
    const plantillas = (r.plantillas && typeof r.plantillas === 'object' ? r.plantillas : {}) as Record<string, unknown>;

    const kpis = (Array.isArray(r.kpis) ? r.kpis : [])
        .filter((k): k is KpiId => KPI_IDS.includes(k as KpiId) && (caducidad || (k !== 'porCaducar' && k !== 'caducados')))
        .filter((k, i, arr) => arr.indexOf(k) === i)
        .slice(0, 4);
    for (const k of ['productos', 'unidades', 'bajoStock', 'valor'] as KpiId[]) if (kpis.length < 4 && !kpis.includes(k)) kpis.push(k);

    const ejemplos: ItemDatos[] = (Array.isArray(r.ejemplos) ? r.ejemplos : []).slice(0, 12).flatMap(e => {
        const er = (e && typeof e === 'object' ? e : {}) as Record<string, unknown>;
        const nombre = texto(er.nombre, 60);
        if (!nombre) return [];
        const item: ItemDatos = { nombre, cantidad: Math.max(0, Math.round(Number(er.cantidad) || 0)) };
        for (const c of campos) {
            if (c.key === 'nombre' || c.key === 'cantidad' || er[c.key] == null || er[c.key] === '') continue;
            item[c.key] = c.type === 'number' || c.type === 'money' ? Math.max(0, Number(er[c.key]) || 0) : texto(er[c.key], 60);
        }
        return [item];
    });

    const subtitulo = (Array.isArray(r.subtitulo) ? r.subtitulo : []).map(s => texto(s, 30)).filter(s => claves.has(s) && s !== 'nombre').slice(0, 3);
    const color = texto(r.color, 9);

    return {
        nombre: texto(r.nombre, 40) || respaldo.nombre,
        lema: texto(r.lema, 90) || 'Panel diseñado a la medida.',
        descripcion: texto(r.descripcion, 120) || respaldo.nombre,
        icono: ICONOS_PERMITIDOS.includes(texto(r.icono, 40)) ? texto(r.icono, 40) : 'bi-shop',
        // "consumo" = usa sus productos como insumos (restaurante, taller); si no, los vende.
        vocabulario: r.salida === 'consumo' || (r.vocabulario as { tipo?: string } | undefined)?.tipo === 'consumo' ? CONSUMO : VENTA,
        color: /^#[0-9a-f]{6}$/i.test(color) ? color : COLORES_PERMITIDOS[0],
        caducidad,
        minimo: Math.min(100, Math.max(1, Math.round(Number(r.minimo) || 3))),
        agruparPor,
        subtitulo: subtitulo.length ? subtitulo : [agruparPor].filter(k => k !== 'nombre'),
        buscar: texto(r.buscar, 60) || 'Buscar producto...',
        kpis,
        etiquetas: {},
        campos,
        ejemplos,
        plantillas: {
            a: plantilla(plantillas.a, 'sidebar', 'Operativa'),
            b: plantilla(plantillas.b, 'topbar', 'Visual'),
        },
    };
}
