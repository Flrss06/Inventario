import type { Giro } from '@/types';

export const general: Giro = {
    id: 'general',
    nombre: 'Otro tipo de negocio',
    lema: '¿Vendes otra cosa? La IA diseña un panel a tu medida.',
    descripcion: '¿Vendes otra cosa? Contesta 5 preguntas y la IA diseña tu panel.',
    icono: 'bi-shop',
    color: '#6c47ff',
    minimo: 5,
    agruparPor: 'categoria',
    subtitulo: ['sku', 'categoria'],
    buscar: 'Buscar producto, SKU o categoría...',
    kpis: ['productos', 'unidades', 'bajoStock', 'valor'],
    etiquetas: { unidades: 'Unidades en stock' },
    campos: [
        { key: 'nombre', label: 'Producto', type: 'text', required: true },
        { key: 'sku', label: 'SKU / Código', type: 'text' },
        { key: 'categoria', label: 'Categoría', type: 'text' },
        { key: 'proveedor', label: 'Proveedor', type: 'text' },
        { key: 'cantidad', label: 'Cantidad', type: 'number', required: true },
        { key: 'minimo', label: 'Stock mínimo', type: 'number' },
        { key: 'precio', label: 'Precio', type: 'money' },
    ],
    ejemplos: () => [
        { nombre: 'Cuaderno profesional', sku: 'PAP-001', categoria: 'Papelería', proveedor: 'Distribuidora Norte', cantidad: 40, minimo: 10, precio: 45 },
        { nombre: 'Pluma azul (caja 12)', sku: 'PAP-014', categoria: 'Papelería', proveedor: 'Distribuidora Norte', cantidad: 4, minimo: 5, precio: 72 },
        { nombre: 'Cinta adhesiva', sku: 'OFI-102', categoria: 'Oficina', proveedor: 'Suministros MX', cantidad: 18, minimo: 6, precio: 25 },
        { nombre: 'Foco LED 9W', sku: 'FER-210', categoria: 'Ferretería', proveedor: 'Iluminación Centro', cantidad: 0, minimo: 8, precio: 39 },
        { nombre: 'Pilas AA (4 pzas)', sku: 'ELE-033', categoria: 'Electrónica', proveedor: 'Suministros MX', cantidad: 22, minimo: 10, precio: 85 },
        { nombre: 'Gel antibacterial 500 ml', sku: 'HIG-008', categoria: 'Higiene', proveedor: 'Distribuidora Norte', cantidad: 7, minimo: 6, precio: 58 },
    ],
    plantillas: {
        a: {
            nombre: 'Clásica',
            descripcion: 'Tabla completa con alertas y existencias por categoría.',
            layout: 'sidebar',
            widgets: [{ w: 'kpis' }, { w: 'ventas' }, { w: 'alertas' }, { w: 'categorias' }, { w: 'tabla' }],
        },
        b: {
            nombre: 'Visual',
            descripcion: 'Productos en tarjetas, lo que falta resurtir y existencias por proveedor.',
            layout: 'topbar',
            widgets: [{ w: 'kpis' }, { w: 'ventas' }, { w: 'tarjetas' }, { w: 'bajoStock' }, { w: 'categorias', por: 'proveedor' }],
        },
    },
};
