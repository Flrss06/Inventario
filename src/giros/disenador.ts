// Diseñador local de paneles: se usa cuando la IA no está disponible.
// Reconoce algunos tipos de negocio por palabras clave y arma campos, ejemplos y plantillas.

import type { Campo, Cuestionario, GiroGuardado, ItemDatos, WidgetSpec } from '@/types';
import { enDias } from '@/lib/format';
import { CAMPOS_OPCIONALES, normalizarGiro } from './personalizado';
import { restaurante } from './restaurante';

interface Nicho {
    palabras: string[];
    /** Si el negocio usa sus productos como insumos en vez de venderlos. */
    salida?: 'consumo';
    nombre: string;
    icono: string;
    color: string;
    agruparPor: string;
    subtitulo: string[];
    campos: Campo[];
    ejemplos: () => ItemDatos[];
}

const NICHOS: Nicho[] = [
    {
        palabras: ['restaurant', 'taquer', 'cafeter', 'fonda', 'cocina', 'comedor', 'pizzer', 'loncher', 'marisquer', 'food truck', 'antojit'],
        salida: 'consumo',
        nombre: 'Cocina',
        icono: 'bi-cup-hot',
        color: restaurante.color,
        agruparPor: 'categoria',
        subtitulo: restaurante.subtitulo,
        campos: restaurante.campos.filter(c => !['nombre', 'cantidad', 'precio', 'minimo'].includes(c.key)),
        ejemplos: restaurante.ejemplos,
    },
    {
        palabras: ['videojuego', 'juegos', 'consola', 'gamer', 'gaming'],
        nombre: 'Videojuegos',
        icono: 'bi-controller',
        color: '#6c47ff',
        agruparPor: 'plataforma',
        subtitulo: ['plataforma', 'condicion'],
        campos: [
            { key: 'plataforma', label: 'Plataforma', type: 'select', options: ['PS5', 'PS4', 'Xbox Series', 'Nintendo Switch', 'PC'] },
            { key: 'categoria', label: 'Tipo', type: 'select', options: ['Juego', 'Consola', 'Control', 'Accesorio'] },
            { key: 'condicion', label: 'Condición', type: 'select', options: ['Nuevo', 'Seminuevo', 'Usado'] },
        ],
        ejemplos: () => [
            { nombre: 'Mario Kart 8 Deluxe', plataforma: 'Nintendo Switch', categoria: 'Juego', condicion: 'Nuevo', cantidad: 6, precio: 1299, minimo: 3 },
            { nombre: 'Spider-Man 2', plataforma: 'PS5', categoria: 'Juego', condicion: 'Nuevo', cantidad: 4, precio: 1399, minimo: 2 },
            { nombre: 'Halo Infinite', plataforma: 'Xbox Series', categoria: 'Juego', condicion: 'Seminuevo', cantidad: 0, precio: 499, minimo: 1 },
            { nombre: 'Control DualSense', plataforma: 'PS5', categoria: 'Control', condicion: 'Nuevo', cantidad: 3, precio: 1599, minimo: 2 },
            { nombre: 'Nintendo Switch OLED', plataforma: 'Nintendo Switch', categoria: 'Consola', condicion: 'Nuevo', cantidad: 2, precio: 7499, minimo: 1 },
            { nombre: 'Minecraft', plataforma: 'Nintendo Switch', categoria: 'Juego', condicion: 'Nuevo', cantidad: 10, precio: 699, minimo: 3 },
            { nombre: 'Audífonos gamer', plataforma: 'PC', categoria: 'Accesorio', condicion: 'Nuevo', cantidad: 5, precio: 899, minimo: 2 },
            { nombre: 'Zelda: Tears of the Kingdom', plataforma: 'Nintendo Switch', categoria: 'Juego', condicion: 'Usado', cantidad: 1, precio: 899, minimo: 1 },
        ],
    },
    {
        palabras: ['farmacia', 'medicamento', 'botica', 'medicina'],
        nombre: 'Farmacia',
        icono: 'bi-capsule',
        color: '#10b981',
        agruparPor: 'categoria',
        subtitulo: ['marca', 'lote'],
        campos: [
            { key: 'categoria', label: 'Categoría', type: 'select', options: ['Analgésicos', 'Antibióticos', 'Vitaminas', 'Higiene', 'Curación'] },
            { key: 'marca', label: 'Laboratorio', type: 'text' },
            { key: 'caducidad', label: 'Caducidad', type: 'date' },
            { key: 'lote', label: 'Lote', type: 'text' },
        ],
        ejemplos: () => [
            { nombre: 'Paracetamol 500 mg', categoria: 'Analgésicos', marca: 'Genérico', caducidad: enDias(200), lote: 'PA-221', cantidad: 40, precio: 35, minimo: 15 },
            { nombre: 'Ibuprofeno 400 mg', categoria: 'Analgésicos', marca: 'Genérico', caducidad: enDias(20), lote: 'IB-118', cantidad: 8, precio: 48, minimo: 10 },
            { nombre: 'Amoxicilina 500 mg', categoria: 'Antibióticos', marca: 'Genérico', caducidad: enDias(90), lote: 'AM-404', cantidad: 12, precio: 120, minimo: 5 },
            { nombre: 'Vitamina C 1 g', categoria: 'Vitaminas', marca: 'Genérico', caducidad: enDias(5), lote: 'VC-009', cantidad: 6, precio: 89, minimo: 5 },
            { nombre: 'Gasas estériles', categoria: 'Curación', marca: 'Genérico', caducidad: enDias(500), lote: 'GS-33', cantidad: 0, precio: 25, minimo: 10 },
            { nombre: 'Gel antibacterial', categoria: 'Higiene', marca: 'Genérico', caducidad: enDias(300), lote: 'GA-71', cantidad: 25, precio: 45, minimo: 8 },
        ],
    },
    {
        palabras: ['ferreter', 'tornill', 'herramienta', 'tlapaler'],
        nombre: 'Ferretería',
        icono: 'bi-hammer',
        color: '#f97316',
        agruparPor: 'categoria',
        subtitulo: ['marca', 'ubicacion'],
        campos: [
            { key: 'categoria', label: 'Categoría', type: 'select', options: ['Herramientas', 'Tornillería', 'Eléctrico', 'Plomería', 'Pintura'] },
            { key: 'marca', label: 'Marca', type: 'text' },
            { key: 'ubicacion', label: 'Pasillo', type: 'text' },
        ],
        ejemplos: () => [
            { nombre: 'Martillo de uña 16 oz', categoria: 'Herramientas', marca: 'Truper', ubicacion: 'P1', cantidad: 8, precio: 189, minimo: 3 },
            { nombre: 'Tornillo para madera 1" (100 pzas)', categoria: 'Tornillería', marca: 'Genérico', ubicacion: 'P2', cantidad: 30, precio: 65, minimo: 10 },
            { nombre: 'Cinta de aislar', categoria: 'Eléctrico', marca: '3M', ubicacion: 'P3', cantidad: 2, precio: 22, minimo: 10 },
            { nombre: 'Llave de paso 1/2"', categoria: 'Plomería', marca: 'Coflex', ubicacion: 'P4', cantidad: 6, precio: 145, minimo: 3 },
            { nombre: 'Pintura vinílica blanca 4 L', categoria: 'Pintura', marca: 'Comex', ubicacion: 'P5', cantidad: 0, precio: 459, minimo: 2 },
            { nombre: 'Desarmador de cruz', categoria: 'Herramientas', marca: 'Truper', ubicacion: 'P1', cantidad: 15, precio: 59, minimo: 5 },
        ],
    },
    {
        palabras: ['celular', 'telefon', 'electronic', 'gadget', 'computo', 'cómputo'],
        nombre: 'Electrónica y celulares',
        icono: 'bi-phone',
        color: '#0ea5e9',
        agruparPor: 'categoria',
        subtitulo: ['marca', 'modelo'],
        campos: [
            { key: 'categoria', label: 'Categoría', type: 'select', options: ['Celulares', 'Accesorios', 'Audio', 'Cargadores', 'Cómputo'] },
            { key: 'marca', label: 'Marca', type: 'text' },
            { key: 'modelo', label: 'Modelo', type: 'text' },
            { key: 'condicion', label: 'Condición', type: 'select', options: ['Nuevo', 'Seminuevo', 'Usado'] },
        ],
        ejemplos: () => [
            { nombre: 'Smartphone gama media', categoria: 'Celulares', marca: 'Samsung', modelo: 'A55', condicion: 'Nuevo', cantidad: 4, precio: 7999, minimo: 2 },
            { nombre: 'Funda de silicón', categoria: 'Accesorios', marca: 'Genérico', modelo: 'Universal', condicion: 'Nuevo', cantidad: 40, precio: 149, minimo: 10 },
            { nombre: 'Audífonos inalámbricos', categoria: 'Audio', marca: 'JBL', modelo: 'Tune', condicion: 'Nuevo', cantidad: 2, precio: 1299, minimo: 3 },
            { nombre: 'Cargador USB-C 25W', categoria: 'Cargadores', marca: 'Samsung', modelo: 'EP-T2510', condicion: 'Nuevo', cantidad: 0, precio: 399, minimo: 5 },
            { nombre: 'iPhone 13 seminuevo', categoria: 'Celulares', marca: 'Apple', modelo: '13', condicion: 'Seminuevo', cantidad: 1, precio: 8499, minimo: 1 },
        ],
    },
    {
        palabras: ['libro', 'librer', 'editorial'],
        nombre: 'Librería',
        icono: 'bi-book',
        color: '#ca8a04',
        agruparPor: 'categoria',
        subtitulo: ['marca', 'categoria'],
        campos: [
            { key: 'marca', label: 'Autor', type: 'text' },
            { key: 'categoria', label: 'Género', type: 'select', options: ['Novela', 'Infantil', 'Ciencia', 'Autoayuda', 'Historia'] },
            { key: 'sku', label: 'ISBN', type: 'text' },
        ],
        ejemplos: () => [
            { nombre: 'Cien años de soledad', marca: 'Gabriel García Márquez', categoria: 'Novela', sku: '978-0307474728', cantidad: 5, precio: 389, minimo: 2 },
            { nombre: 'El principito', marca: 'Antoine de Saint-Exupéry', categoria: 'Infantil', sku: '978-6070735311', cantidad: 12, precio: 199, minimo: 4 },
            { nombre: 'Breve historia del tiempo', marca: 'Stephen Hawking', categoria: 'Ciencia', sku: '978-8498925128', cantidad: 1, precio: 329, minimo: 2 },
            { nombre: 'Hábitos atómicos', marca: 'James Clear', categoria: 'Autoayuda', sku: '978-6075696686', cantidad: 0, precio: 349, minimo: 3 },
        ],
    },
    {
        palabras: ['cosmet', 'maquilla', 'belleza', 'perfum', 'skincare'],
        nombre: 'Belleza y cosméticos',
        icono: 'bi-brush',
        color: '#e11d48',
        agruparPor: 'categoria',
        subtitulo: ['marca', 'color'],
        campos: [
            { key: 'categoria', label: 'Categoría', type: 'select', options: ['Maquillaje', 'Cuidado de la piel', 'Perfumes', 'Cabello', 'Uñas'] },
            { key: 'marca', label: 'Marca', type: 'text' },
            { key: 'color', label: 'Tono', type: 'text' },
            { key: 'caducidad', label: 'Caducidad', type: 'date' },
        ],
        ejemplos: () => [
            { nombre: 'Base líquida', categoria: 'Maquillaje', marca: 'Maybelline', color: 'Beige 120', caducidad: enDias(400), cantidad: 6, precio: 259, minimo: 3 },
            { nombre: 'Protector solar FPS 50', categoria: 'Cuidado de la piel', marca: 'La Roche-Posay', color: '—', caducidad: enDias(25), cantidad: 3, precio: 459, minimo: 4 },
            { nombre: 'Labial mate', categoria: 'Maquillaje', marca: 'NYX', color: 'Rojo', caducidad: enDias(600), cantidad: 14, precio: 189, minimo: 5 },
            { nombre: 'Shampoo reparador', categoria: 'Cabello', marca: 'Pantene', color: '—', caducidad: enDias(700), cantidad: 0, precio: 99, minimo: 6 },
        ],
    },
    {
        palabras: ['mascota', 'veterinar', 'perro', 'gato', 'pet'],
        nombre: 'Mascotas',
        icono: 'bi-heart-pulse',
        color: '#14b8a6',
        agruparPor: 'categoria',
        subtitulo: ['especie', 'marca'],
        campos: [
            { key: 'categoria', label: 'Categoría', type: 'select', options: ['Alimento', 'Juguetes', 'Higiene', 'Accesorios', 'Medicamento'] },
            { key: 'especie', label: 'Especie', type: 'select', options: ['Perro', 'Gato', 'Ave', 'Otro'] },
            { key: 'marca', label: 'Marca', type: 'text' },
            { key: 'caducidad', label: 'Caducidad', type: 'date' },
        ],
        ejemplos: () => [
            { nombre: 'Croquetas adulto 10 kg', categoria: 'Alimento', especie: 'Perro', marca: 'Pro Plan', caducidad: enDias(180), cantidad: 7, precio: 1199, minimo: 3 },
            { nombre: 'Arena para gato 10 kg', categoria: 'Higiene', especie: 'Gato', marca: 'Genérico', caducidad: '', cantidad: 2, precio: 249, minimo: 4 },
            { nombre: 'Pelota de hule', categoria: 'Juguetes', especie: 'Perro', marca: 'Kong', caducidad: '', cantidad: 12, precio: 159, minimo: 4 },
            { nombre: 'Alimento húmedo (lata)', categoria: 'Alimento', especie: 'Gato', marca: 'Whiskas', caducidad: enDias(6), cantidad: 24, precio: 32, minimo: 12 },
        ],
    },
];

function buscarNicho(texto: string) {
    const t = texto.toLowerCase();
    return NICHOS.find(n => n.palabras.some(p => t.includes(p)));
}

function plantillas(c: Cuestionario, claves: Set<string>, agruparPor: string) {
    const prio = new Set(c.prioridades);
    const mitades: WidgetSpec[] = [];
    if (prio.has('stock') || !c.prioridades.length) mitades.push({ w: 'bajoStock' });
    if (prio.has('caducidad') && claves.has('caducidad')) mitades.push({ w: 'caducidad' });
    if (prio.has('ubicacion') && claves.has('ubicacion')) mitades.push({ w: 'categorias', por: 'ubicacion' });
    mitades.push({ w: 'alertas' });
    if (!mitades.some(m => m.w === 'categorias')) mitades.push({ w: 'categorias' });
    if (mitades.length % 2) mitades.pop();

    const conTallas = prio.has('tallas') && claves.has('talla');
    return {
        a: {
            nombre: 'Operativa',
            descripcion: 'Tabla completa, alertas y lo que necesitas resurtir.',
            widgets: [{ w: 'kpis' }, ...(prio.has('ventas') ? [{ w: 'ventas' }] : []), ...mitades, ...(conTallas ? [{ w: 'tallas' }] : []), { w: 'tabla' }],
        },
        b: {
            nombre: 'Visual',
            descripcion: 'Tus productos en tarjetas y tus ventas de un vistazo.',
            widgets: [{ w: 'kpis' }, { w: 'tarjetas' }, { w: 'ventas' }, { w: 'bajoStock' }, { w: 'categorias', por: agruparPor }],
        },
    };
}

export function disenarLocal(c: Cuestionario): GiroGuardado {
    const nicho = buscarNicho(c.queVende);
    const elegidos = CAMPOS_OPCIONALES.filter(o => c.datos.includes(o.key)).map(({ descripcion: _, ...campo }) => campo);
    if (c.canal !== 'fisica' && !elegidos.some(e => e.key === 'sku')) elegidos.push({ key: 'sku', label: 'SKU / Código', type: 'text' });

    // Los campos del nicho van primero; los que eligió el cliente se agregan si no están.
    const usaInsumos = (nicho?.salida ?? c.salida) === 'consumo';
    const campos: Campo[] = [{ key: 'nombre', label: usaInsumos ? 'Insumo' : 'Producto', type: 'text', required: true }, ...(nicho?.campos ?? [])];
    for (const e of elegidos) if (!campos.some(c => c.key === e.key)) campos.push(e);
    if (!campos.some(c => c.key === 'categoria')) campos.splice(1, 0, { key: 'categoria', label: 'Categoría', type: 'text' });
    campos.push({ key: 'cantidad', label: 'Cantidad', type: 'number', required: true }, { key: 'precio', label: 'Precio', type: 'money' }, { key: 'minimo', label: 'Stock mínimo', type: 'number', tabla: false });

    const claves = new Set(campos.map(c => c.key));
    const agruparPor = nicho?.agruparPor ?? 'categoria';
    const queVende = c.queVende.trim();

    return normalizarGiro(
        {
            nombre: nicho?.nombre ?? queVende.slice(0, 40),
            lema: `Panel para ${queVende.toLowerCase()}.`,
            descripcion: queVende,
            icono: nicho?.icono ?? 'bi-shop',
            color: nicho?.color,
            minimo: 3,
            agruparPor,
            subtitulo: nicho?.subtitulo ?? [agruparPor],
            buscar: usaInsumos ? 'Buscar insumo...' : 'Buscar producto...',
            salida: nicho?.salida ?? c.salida,
            kpis: ['productos', 'unidades', claves.has('caducidad') ? 'porCaducar' : 'bajoStock', 'valor'],
            campos,
            ejemplos: nicho?.ejemplos() ?? [
                { nombre: 'Producto de ejemplo A', categoria: 'General', cantidad: 12, precio: 150, minimo: 4 },
                { nombre: 'Producto de ejemplo B', categoria: 'General', cantidad: 3, precio: 320, minimo: 4 },
                { nombre: 'Producto de ejemplo C', categoria: 'Especial', cantidad: 0, precio: 89, minimo: 2 },
                { nombre: 'Producto de ejemplo D', categoria: 'Especial', cantidad: 25, precio: 45, minimo: 8 },
            ],
            plantillas: plantillas(c, claves, agruparPor),
        },
        { nombre: queVende || 'Mi negocio' },
    );
}
