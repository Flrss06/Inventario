import type { Giro } from '@/types';

export const refacciones: Giro = {
    id: 'refacciones',
    nombre: 'Refacciones',
    lema: 'Búsqueda por número de parte y vehículo compatible.',
    descripcion: 'Refaccionarias, autopartes y talleres.',
    icono: 'bi-wrench-adjustable',
    color: '#2563eb',
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
            widgets: [{ w: 'kpis' }, { w: 'ventas' }, { w: 'tabla' }, { w: 'alertas' }, { w: 'categorias', por: 'vehiculo' }],
        },
        b: {
            nombre: 'Almacén por ubicación',
            descripcion: 'Existencias por estante y piezas por resurtir.',
            layout: 'topbar',
            widgets: [{ w: 'kpis' }, { w: 'ventas' }, { w: 'categorias', por: 'ubicacion' }, { w: 'bajoStock' }, { w: 'tarjetas' }],
        },
    },
};
