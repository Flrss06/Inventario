import type { Giro } from '@/types';
import { enDias } from '@/lib/format';

// Tiendas que venden productos por pieza: abarrotes, misceláneas, minisúpers.
export const abarrotes: Giro = {
    id: 'abarrotes',
    nombre: 'Abarrotes y tiendas',
    lema: 'Lo que más vendes, lo que se acaba y lo que está por caducar.',
    descripcion: 'Tiendas de abarrotes, misceláneas, minisúpers y tiendas de conveniencia.',
    icono: 'bi-basket',
    color: '#208b0b',
    caducidad: true,
    minimo: 5,
    agruparPor: 'categoria',
    subtitulo: ['categoria', 'marca'],
    buscar: 'Buscar producto, marca o código...',
    kpis: ['productos', 'bajoStock', 'porCaducar', 'valor'],
    etiquetas: { productos: 'Productos en tienda', bajoStock: 'Por resurtir' },
    campos: [
        { key: 'nombre', label: 'Producto', type: 'text', required: true },
        { key: 'marca', label: 'Marca', type: 'text' },
        { key: 'categoria', label: 'Categoría', type: 'select', options: ['Lácteos y huevo', 'Bebidas', 'Panadería', 'Abarrotes', 'Botanas y dulces', 'Limpieza e higiene'] },
        { key: 'sku', label: 'Código de barras', type: 'text', tabla: false },
        { key: 'cantidad', label: 'Piezas', type: 'number', required: true },
        { key: 'caducidad', label: 'Caducidad', type: 'date' },
        { key: 'precio', label: 'Precio de venta', type: 'money' },
        { key: 'minimo', label: 'Stock mínimo', type: 'number', tabla: false },
    ],
    ejemplos: () => [
        { nombre: 'Leche entera 1 L', marca: 'Lala', categoria: 'Lácteos y huevo', cantidad: 18, caducidad: enDias(6), precio: 28, minimo: 12 },
        { nombre: 'Huevo blanco 12 pzas', marca: 'San Juan', categoria: 'Lácteos y huevo', cantidad: 6, caducidad: enDias(15), precio: 52, minimo: 8 },
        { nombre: 'Refresco de cola 600 ml', marca: 'Coca-Cola', categoria: 'Bebidas', cantidad: 36, caducidad: enDias(120), precio: 20, minimo: 24 },
        { nombre: 'Agua natural 1 L', marca: 'Bonafont', categoria: 'Bebidas', cantidad: 20, caducidad: enDias(300), precio: 14, minimo: 12 },
        { nombre: 'Pan de caja grande', marca: 'Bimbo', categoria: 'Panadería', cantidad: 4, caducidad: enDias(3), precio: 55, minimo: 5 },
        { nombre: 'Arroz 1 kg', marca: 'Verde Valle', categoria: 'Abarrotes', cantidad: 10, caducidad: enDias(240), precio: 32, minimo: 6 },
        { nombre: 'Frijol negro 1 kg', marca: 'La Costeña', categoria: 'Abarrotes', cantidad: 0, caducidad: enDias(200), precio: 38, minimo: 5 },
        { nombre: 'Papas fritas 45 g', marca: 'Sabritas', categoria: 'Botanas y dulces', cantidad: 25, caducidad: enDias(60), precio: 19, minimo: 15 },
        { nombre: 'Papel higiénico 4 rollos', marca: 'Pétalo', categoria: 'Limpieza e higiene', cantidad: 8, caducidad: '', precio: 42, minimo: 6 },
        { nombre: 'Jabón de tocador', marca: 'Zest', categoria: 'Limpieza e higiene', cantidad: 12, caducidad: '', precio: 18, minimo: 6 },
    ],
    plantillas: {
        a: {
            nombre: 'Mostrador',
            descripcion: 'Lo que se vende, lo que se acaba y lo que está por caducar, con tu inventario completo.',
            layout: 'sidebar',
            widgets: [{ w: 'kpis' }, { w: 'ventas' }, { w: 'bajoStock' }, { w: 'caducidad' }, { w: 'tabla' }],
        },
        b: {
            nombre: 'Anaquel visual',
            descripcion: 'Tus productos en tarjetas y tus existencias por categoría.',
            layout: 'topbar',
            widgets: [{ w: 'kpis' }, { w: 'ventas' }, { w: 'tarjetas' }, { w: 'alertas' }, { w: 'categorias' }],
        },
    },
};
