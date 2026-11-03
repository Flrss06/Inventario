// Catálogo de giros, plantillas y planes.
// Para agregar un giro nuevo basta con añadir una entrada a TIPOS:
// el registro y el panel leen todo de aquí.

function enDias(n) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Apartados que puede tener un panel. "size" indica si ocupa todo el ancho o la mitad.
const WIDGETS = {
    kpis: { titulo: 'Resumen', icono: 'bi-speedometer2', size: 'full' },
    tabla: { titulo: 'Inventario', icono: 'bi-table', size: 'full' },
    tarjetas: { titulo: 'Catálogo', icono: 'bi-grid-3x3-gap', size: 'full' },
    tallas: { titulo: 'Existencias por talla', icono: 'bi-rulers', size: 'full' },
    alertas: { titulo: 'Alertas', icono: 'bi-bell', size: 'half' },
    bajoStock: { titulo: 'Por resurtir', icono: 'bi-graph-down-arrow', size: 'half' },
    categorias: { titulo: 'Existencias', icono: 'bi-bar-chart', size: 'half' },
    caducidad: { titulo: 'Caducidades', icono: 'bi-calendar-x', size: 'half' },
};

const TIPOS = {
    comida: {
        nombre: 'Alimentos y restaurantes',
        icono: 'bi-egg-fried',
        color: '#208b0b',
        descripcion: 'Restaurantes, cafeterías, comedores y abarrotes.',
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
    },

    ropa: {
        nombre: 'Ropa y boutiques',
        icono: 'bi-bag-heart',
        color: '#c026d3',
        descripcion: 'Tiendas de ropa, boutiques y accesorios.',
        minimo: 2,
        agruparPor: 'categoria',
        subtitulo: ['talla', 'color'],
        buscar: 'Buscar prenda, talla o color...',
        kpis: ['unidades', 'modelos', 'agotados', 'valor'],
        etiquetas: { unidades: 'Prendas en stock', modelos: 'Prendas distintas', agotados: 'Tallas agotadas' },
        campos: [
            { key: 'nombre', label: 'Prenda', type: 'text', required: true },
            { key: 'categoria', label: 'Categoría', type: 'select', options: ['Playeras', 'Pantalones', 'Vestidos', 'Chamarras', 'Accesorios'] },
            { key: 'talla', label: 'Talla', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'Unitalla'], required: true },
            { key: 'color', label: 'Color', type: 'text' },
            { key: 'temporada', label: 'Temporada', type: 'select', options: ['Primavera-Verano', 'Otoño-Invierno', 'Todo el año'] },
            { key: 'cantidad', label: 'Cantidad', type: 'number', required: true },
            { key: 'precio', label: 'Precio de venta', type: 'money' },
            { key: 'minimo', label: 'Stock mínimo', type: 'number', tabla: false },
        ],
        ejemplos: () => [
            { nombre: 'Playera básica', categoria: 'Playeras', talla: 'S', color: 'Blanco', temporada: 'Todo el año', cantidad: 12, precio: 199 },
            { nombre: 'Playera básica', categoria: 'Playeras', talla: 'M', color: 'Blanco', temporada: 'Todo el año', cantidad: 2, precio: 199 },
            { nombre: 'Playera básica', categoria: 'Playeras', talla: 'L', color: 'Blanco', temporada: 'Todo el año', cantidad: 0, precio: 199 },
            { nombre: 'Jeans slim', categoria: 'Pantalones', talla: 'M', color: 'Azul', temporada: 'Todo el año', cantidad: 8, precio: 549 },
            { nombre: 'Jeans slim', categoria: 'Pantalones', talla: 'L', color: 'Azul', temporada: 'Todo el año', cantidad: 3, precio: 549 },
            { nombre: 'Vestido floral', categoria: 'Vestidos', talla: 'S', color: 'Rosa', temporada: 'Primavera-Verano', cantidad: 5, precio: 699 },
            { nombre: 'Vestido floral', categoria: 'Vestidos', talla: 'M', color: 'Rosa', temporada: 'Primavera-Verano', cantidad: 1, precio: 699 },
            { nombre: 'Chamarra de mezclilla', categoria: 'Chamarras', talla: 'M', color: 'Azul', temporada: 'Otoño-Invierno', cantidad: 4, precio: 899 },
            { nombre: 'Chamarra de mezclilla', categoria: 'Chamarras', talla: 'L', color: 'Azul', temporada: 'Otoño-Invierno', cantidad: 6, precio: 899 },
            { nombre: 'Gorra bordada', categoria: 'Accesorios', talla: 'Unitalla', color: 'Negro', temporada: 'Todo el año', cantidad: 15, precio: 249 },
        ],
        plantillas: {
            a: {
                nombre: 'Tienda por tallas',
                descripcion: 'Matriz de prendas por talla para detectar huecos antes de que se agoten.',
                layout: 'sidebar',
                widgets: [{ w: 'kpis' }, { w: 'tallas' }, { w: 'alertas' }, { w: 'categorias' }, { w: 'tabla' }],
            },
            b: {
                nombre: 'Catálogo',
                descripcion: 'Tus prendas como en vitrina, con existencias por temporada.',
                layout: 'topbar',
                widgets: [{ w: 'kpis' }, { w: 'tarjetas' }, { w: 'bajoStock' }, { w: 'categorias', por: 'temporada' }],
            },
        },
    },

    calzado: {
        nombre: 'Tenis y calzado',
        icono: 'bi-person-walking',
        color: '#ea580c',
        descripcion: 'Zapaterías, tiendas de tenis y sneakers.',
        minimo: 1,
        agruparPor: 'marca',
        subtitulo: ['marca', 'talla', 'color'],
        buscar: 'Buscar modelo, marca o talla...',
        kpis: ['unidades', 'modelos', 'agotados', 'valor'],
        etiquetas: { unidades: 'Pares en stock', modelos: 'Modelos distintos', agotados: 'Tallas agotadas' },
        campos: [
            { key: 'nombre', label: 'Modelo', type: 'text', required: true },
            { key: 'marca', label: 'Marca', type: 'text' },
            { key: 'categoria', label: 'Estilo', type: 'select', options: ['Running', 'Casual', 'Basketball', 'Skate', 'Formal'] },
            { key: 'talla', label: 'Talla (MX)', type: 'select', options: ['23', '24', '25', '26', '27', '28', '29'], required: true },
            { key: 'color', label: 'Color', type: 'text' },
            { key: 'cantidad', label: 'Pares', type: 'number', required: true },
            { key: 'precio', label: 'Precio de venta', type: 'money' },
            { key: 'minimo', label: 'Stock mínimo', type: 'number', tabla: false },
        ],
        ejemplos: () => [
            { nombre: 'Runner Pro', marca: 'Veloz', categoria: 'Running', talla: '25', color: 'Negro', cantidad: 5, precio: 1899 },
            { nombre: 'Runner Pro', marca: 'Veloz', categoria: 'Running', talla: '26', color: 'Negro', cantidad: 2, precio: 1899 },
            { nombre: 'Runner Pro', marca: 'Veloz', categoria: 'Running', talla: '27', color: 'Negro', cantidad: 0, precio: 1899 },
            { nombre: 'Street Classic', marca: 'Urbano', categoria: 'Casual', talla: '24', color: 'Blanco', cantidad: 6, precio: 1299 },
            { nombre: 'Street Classic', marca: 'Urbano', categoria: 'Casual', talla: '26', color: 'Blanco', cantidad: 4, precio: 1299 },
            { nombre: 'Street Classic', marca: 'Urbano', categoria: 'Casual', talla: '28', color: 'Blanco', cantidad: 1, precio: 1299 },
            { nombre: 'Court High', marca: 'Apex', categoria: 'Basketball', talla: '27', color: 'Rojo', cantidad: 3, precio: 2299 },
            { nombre: 'Court High', marca: 'Apex', categoria: 'Basketball', talla: '28', color: 'Rojo', cantidad: 2, precio: 2299 },
            { nombre: 'Skate Low', marca: 'Urbano', categoria: 'Skate', talla: '25', color: 'Gris', cantidad: 7, precio: 999 },
        ],
        plantillas: {
            a: {
                nombre: 'Piso de venta',
                descripcion: 'Pares por modelo y talla, con lo que hay que resurtir.',
                layout: 'sidebar',
                widgets: [{ w: 'kpis' }, { w: 'tallas' }, { w: 'bajoStock' }, { w: 'categorias' }, { w: 'tabla' }],
            },
            b: {
                nombre: 'Vitrina',
                descripcion: 'Tus modelos en tarjetas y existencias por estilo.',
                layout: 'topbar',
                widgets: [{ w: 'kpis' }, { w: 'tarjetas' }, { w: 'alertas' }, { w: 'categorias', por: 'categoria' }],
            },
        },
    },

    refacciones: {
        nombre: 'Refacciones',
        icono: 'bi-wrench-adjustable',
        color: '#2563eb',
        descripcion: 'Refaccionarias, autopartes y talleres.',
        minimo: 3,
        agruparPor: 'categoria',
        subtitulo: ['numParte', 'vehiculo'],
        buscar: 'Buscar no. de parte o vehículo...',
        kpis: ['productos', 'bajoStock', 'agotados', 'valor'],
        etiquetas: { productos: 'Piezas registradas', agotados: 'Piezas agotadas' },
        campos: [
            { key: 'nombre', label: 'Pieza', type: 'text', required: true },
            { key: 'numParte', label: 'No. de parte', type: 'text' },
            { key: 'categoria', label: 'Sistema', type: 'select', options: ['Frenos', 'Motor', 'Suspensión', 'Eléctrico', 'Filtros'] },
            { key: 'vehiculo', label: 'Compatible con', type: 'text' },
            { key: 'ubicacion', label: 'Estante', type: 'text' },
            { key: 'cantidad', label: 'Cantidad', type: 'number', required: true },
            { key: 'minimo', label: 'Stock mínimo', type: 'number', tabla: false },
            { key: 'precio', label: 'Precio', type: 'money' },
        ],
        ejemplos: () => [
            { nombre: 'Balatas delanteras', numParte: 'BD-2210', categoria: 'Frenos', vehiculo: 'Nissan Versa 2015-2020', ubicacion: 'A-01', cantidad: 8, minimo: 4, precio: 650 },
            { nombre: 'Filtro de aceite', numParte: 'FA-118', categoria: 'Filtros', vehiculo: 'VW Jetta A4', ubicacion: 'B-03', cantidad: 25, minimo: 10, precio: 95 },
            { nombre: 'Bujía de iridio', numParte: 'BJ-77', categoria: 'Eléctrico', vehiculo: 'Chevrolet Aveo', ubicacion: 'C-02', cantidad: 3, minimo: 8, precio: 180 },
            { nombre: 'Amortiguador trasero', numParte: 'AM-450', categoria: 'Suspensión', vehiculo: 'Nissan Versa 2015-2020', ubicacion: 'A-04', cantidad: 2, minimo: 2, precio: 1150 },
            { nombre: 'Bomba de agua', numParte: 'BA-300', categoria: 'Motor', vehiculo: 'VW Jetta A4', ubicacion: 'D-01', cantidad: 0, minimo: 2, precio: 980 },
            { nombre: 'Filtro de aire', numParte: 'FAI-21', categoria: 'Filtros', vehiculo: 'Chevrolet Aveo', ubicacion: 'B-03', cantidad: 14, minimo: 6, precio: 140 },
            { nombre: 'Disco de freno', numParte: 'DF-510', categoria: 'Frenos', vehiculo: 'VW Jetta A4', ubicacion: 'A-02', cantidad: 6, minimo: 4, precio: 720 },
        ],
        plantillas: {
            a: {
                nombre: 'Mostrador',
                descripcion: 'Búsqueda rápida por número de parte o vehículo para atender al cliente.',
                layout: 'sidebar',
                widgets: [{ w: 'kpis' }, { w: 'tabla' }, { w: 'alertas' }, { w: 'categorias', por: 'vehiculo' }],
            },
            b: {
                nombre: 'Almacén por ubicación',
                descripcion: 'Existencias por estante y piezas por resurtir.',
                layout: 'topbar',
                widgets: [{ w: 'kpis' }, { w: 'categorias', por: 'ubicacion' }, { w: 'bajoStock' }, { w: 'tarjetas' }],
            },
        },
    },

    general: {
        nombre: 'Otro tipo de negocio',
        icono: 'bi-shop',
        color: '#0f766e',
        descripcion: 'Papelerías, ferreterías, farmacias y tiendas en general.',
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
                widgets: [{ w: 'kpis' }, { w: 'alertas' }, { w: 'categorias' }, { w: 'tabla' }],
            },
            b: {
                nombre: 'Visual',
                descripcion: 'Productos en tarjetas, lo que falta resurtir y existencias por proveedor.',
                layout: 'topbar',
                widgets: [{ w: 'kpis' }, { w: 'tarjetas' }, { w: 'bajoStock' }, { w: 'categorias', por: 'proveedor' }],
            },
        },
    },
};

// Precios de ejemplo: ajústalos aquí y en la sección de planes de index.html.
const PLANES = [
    {
        id: 'gratis',
        nombre: 'Gratis',
        precio: '$0',
        periodo: 'para siempre',
        cambiosMes: 0,
        incluye: ['2 plantillas listas para tu giro', 'Inventario, alertas y reportes base', 'Cambia de plantilla cuando quieras'],
    },
    {
        id: 'pro',
        nombre: 'Pro',
        precio: '$149',
        periodo: 'MXN / mes',
        cambiosMes: 3,
        destacado: true,
        incluye: ['Todo lo del plan Gratis', 'Pide hasta 3 cambios pequeños al mes', 'Agrega campos o apartados a tu plantilla'],
    },
    {
        id: 'medida',
        nombre: 'A tu medida',
        precio: 'Desde $499',
        periodo: 'MXN / mes',
        cambiosMes: null,
        incluye: ['Todo lo del plan Pro', 'Dashboard diseñado a tu gusto', 'Cambios sin límite y atención prioritaria'],
    },
];

// Miniatura de una plantilla para el registro: muestra su acomodo, no sus datos.
function vistaPrevia(plantilla) {
    const bloques = plantilla.widgets.map(s => `<span class="pv-b ${WIDGETS[s.w].size}"></span>`).join('');
    return `<span class="pv pv-${plantilla.layout}" aria-hidden="true"><span class="pv-nav"></span><span class="pv-body">${bloques}</span></span>`;
}
