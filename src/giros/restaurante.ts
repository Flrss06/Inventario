import type { Giro } from '@/types';
import { enDias } from '@/lib/format';
import { CONSUMO } from './vocabulario';

// Un restaurante no vende sus insumos: los USA para cocinar. Por eso habla de consumo, no de ventas.
export const restaurante: Giro = {
    id: 'restaurante',
    nombre: 'Restaurantes y cafeterías',
    lema: 'Insumos, caducidades y pedidos a proveedores bajo control.',
    descripcion: 'Restaurantes, cafeterías, taquerías, fondas y comedores.',
    icono: 'bi-cup-hot',
    color: '#ea580c',
    vocabulario: CONSUMO,
    caducidad: true,
    minimo: 3,
    agruparPor: 'categoria',
    subtitulo: ['categoria', 'proveedor'],
    buscar: 'Buscar insumo, categoría o proveedor...',
    kpis: ['productos', 'bajoStock', 'porCaducar', 'valor'],
    etiquetas: { productos: 'Insumos registrados', bajoStock: 'Insumos por pedir', valor: 'Valor en almacén' },
    campos: [
        { key: 'nombre', label: 'Insumo', type: 'text', required: true },
        { key: 'categoria', label: 'Categoría', type: 'select', options: ['Proteínas', 'Lácteos', 'Frutas y verduras', 'Abarrotes secos', 'Bebidas', 'Desechables', 'Limpieza'] },
        { key: 'cantidad', label: 'Cantidad', type: 'number', required: true },
        { key: 'unidad', label: 'Unidad', type: 'select', options: ['kg', 'g', 'L', 'pz', 'caja', 'bolsa', 'paquete'], tabla: false },
        { key: 'caducidad', label: 'Caducidad', type: 'date' },
        { key: 'proveedor', label: 'Proveedor', type: 'text' },
        { key: 'precio', label: 'Costo unitario', type: 'money' },
        { key: 'minimo', label: 'Stock mínimo', type: 'number', tabla: false },
    ],
    ejemplos: () => [
        { nombre: 'Pechuga de pollo', categoria: 'Proteínas', cantidad: 8, unidad: 'kg', caducidad: enDias(2), proveedor: 'Pollería San Juan', precio: 98, minimo: 5 },
        { nombre: 'Carne molida de res', categoria: 'Proteínas', cantidad: 3, unidad: 'kg', caducidad: enDias(1), proveedor: 'Carnicería El Toro', precio: 135, minimo: 4 },
        { nombre: 'Queso manchego', categoria: 'Lácteos', cantidad: 4, unidad: 'kg', caducidad: enDias(12), proveedor: 'Lácteos del Valle', precio: 160, minimo: 2 },
        { nombre: 'Crema', categoria: 'Lácteos', cantidad: 2, unidad: 'L', caducidad: enDias(-1), proveedor: 'Lácteos del Valle', precio: 52, minimo: 3 },
        { nombre: 'Jitomate', categoria: 'Frutas y verduras', cantidad: 10, unidad: 'kg', caducidad: enDias(4), proveedor: 'Central de abasto', precio: 22, minimo: 6 },
        { nombre: 'Aguacate', categoria: 'Frutas y verduras', cantidad: 6, unidad: 'kg', caducidad: enDias(3), proveedor: 'Central de abasto', precio: 65, minimo: 4 },
        { nombre: 'Tortillas de maíz', categoria: 'Abarrotes secos', cantidad: 15, unidad: 'kg', caducidad: enDias(2), proveedor: 'Tortillería La Güera', precio: 24, minimo: 10 },
        { nombre: 'Aceite para freír', categoria: 'Abarrotes secos', cantidad: 18, unidad: 'L', caducidad: enDias(200), proveedor: 'Distribuidora Norte', precio: 42, minimo: 8 },
        { nombre: 'Café en grano', categoria: 'Bebidas', cantidad: 5, unidad: 'kg', caducidad: enDias(120), proveedor: 'Café de Altura', precio: 280, minimo: 2 },
        { nombre: 'Vasos desechables 12 oz', categoria: 'Desechables', cantidad: 2, unidad: 'paquete', caducidad: '', proveedor: 'Distribuidora Norte', precio: 85, minimo: 4 },
    ],
    plantillas: {
        a: {
            nombre: 'Cocina al día',
            descripcion: 'Lo que hay que usar primero, lo que se acaba y lo que hay que pedir hoy.',
            layout: 'sidebar',
            widgets: [{ w: 'kpis' }, { w: 'ventas' }, { w: 'caducidad' }, { w: 'bajoStock', titulo: 'Por pedir' }, { w: 'tabla', titulo: 'Insumos' }],
        },
        b: {
            nombre: 'Almacén y proveedores',
            descripcion: 'Tus pedidos agrupados por proveedor y tus insumos en tarjetas.',
            layout: 'topbar',
            widgets: [{ w: 'kpis' }, { w: 'bajoStock', titulo: 'Por pedir' }, { w: 'categorias', por: 'proveedor' }, { w: 'ventas' }, { w: 'caducidad' }, { w: 'alertas' }, { w: 'tarjetas', titulo: 'Insumos' }],
        },
    },
};
