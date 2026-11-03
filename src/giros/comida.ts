import type { Giro } from '@/types';
import { enDias } from '@/lib/format';

export const comida: Giro = {
    id: 'comida',
    nombre: 'Alimentos y restaurantes',
    lema: 'Caducidades, lotes y mermas bajo control.',
    descripcion: 'Restaurantes, cafeterías, comedores y abarrotes.',
    icono: 'bi-egg-fried',
    color: '#208b0b',
    caducidad: true,
    minimo: 5,
    agruparPor: 'categoria',
    subtitulo: ['categoria', 'lote'],
    buscar: 'Buscar producto, categoría o lote...',
    kpis: ['unidades', 'porCaducar', 'caducados', 'valor'],
    etiquetas: { unidades: 'Unidades en almacén' },
    campos: [
        { key: 'nombre', label: 'Producto', type: 'text', required: true },
        { key: 'categoria', label: 'Categoría', type: 'select', options: ['Lácteos', 'Carnes', 'Frutas y verduras', 'Abarrotes', 'Bebidas'] },
        { key: 'cantidad', label: 'Cantidad', type: 'number', required: true },
        { key: 'unidad', label: 'Unidad', type: 'select', options: ['kg', 'L', 'pz', 'caja'], tabla: false },
        { key: 'caducidad', label: 'Caducidad', type: 'date' },
        { key: 'lote', label: 'Lote', type: 'text' },
        { key: 'precio', label: 'Costo unitario', type: 'money' },
        { key: 'minimo', label: 'Stock mínimo', type: 'number', tabla: false },
    ],
    ejemplos: () => [
        { nombre: 'Leche entera', categoria: 'Lácteos', cantidad: 24, unidad: 'L', caducidad: enDias(3), lote: 'L-0412', precio: 26, minimo: 10 },
        { nombre: 'Queso panela', categoria: 'Lácteos', cantidad: 6, unidad: 'kg', caducidad: enDias(9), lote: 'Q-118', precio: 120, minimo: 4 },
        { nombre: 'Pechuga de pollo', categoria: 'Carnes', cantidad: 15, unidad: 'kg', caducidad: enDias(2), lote: 'P-221', precio: 98, minimo: 8 },
        { nombre: 'Carne molida', categoria: 'Carnes', cantidad: 4, unidad: 'kg', caducidad: enDias(-1), lote: 'C-090', precio: 135, minimo: 6 },
        { nombre: 'Jitomate', categoria: 'Frutas y verduras', cantidad: 18, unidad: 'kg', caducidad: enDias(5), lote: 'J-310', precio: 22, minimo: 10 },
        { nombre: 'Arroz', categoria: 'Abarrotes', cantidad: 40, unidad: 'kg', caducidad: enDias(240), lote: 'A-501', precio: 28, minimo: 15 },
        { nombre: 'Aceite vegetal', categoria: 'Abarrotes', cantidad: 3, unidad: 'L', caducidad: enDias(180), lote: 'AC-77', precio: 45, minimo: 6 },
        { nombre: 'Agua natural 1 L', categoria: 'Bebidas', cantidad: 60, unidad: 'pz', caducidad: enDias(300), lote: 'B-12', precio: 9, minimo: 24 },
    ],
    plantillas: {
        a: {
            nombre: 'Cocina al día',
            descripcion: 'Enfocada en caducidades: ves primero lo que hay que usar o desechar.',
            layout: 'sidebar',
            widgets: [{ w: 'kpis' }, { w: 'caducidad' }, { w: 'alertas' }, { w: 'tabla' }],
        },
        b: {
            nombre: 'Almacén visual',
            descripcion: 'Tarjetas por producto y existencias por categoría para revisar de un vistazo.',
            layout: 'topbar',
            widgets: [{ w: 'kpis' }, { w: 'categorias' }, { w: 'bajoStock' }, { w: 'tarjetas' }],
        },
    },
};
