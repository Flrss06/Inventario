import type { WidgetId } from '@/types';

// Datos de cada apartado del panel. Los componentes viven en
// src/features/dashboard/widgets; esto se separa para que el registro
// pueda dibujar la miniatura de una plantilla sin cargar el panel.
// "ruta" es la dirección de su página: /panel/<ruta>.
export const WIDGET_META: Record<WidgetId, { titulo: string; icono: string; ancho: 'full' | 'half'; ruta: string }> = {
    kpis: { titulo: 'Resumen', icono: 'bi-speedometer2', ancho: 'full', ruta: '' },
    tabla: { titulo: 'Inventario', icono: 'bi-table', ancho: 'full', ruta: 'inventario' },
    tarjetas: { titulo: 'Catálogo', icono: 'bi-grid-3x3-gap', ancho: 'full', ruta: 'catalogo' },
    tallas: { titulo: 'Existencias por talla', icono: 'bi-rulers', ancho: 'full', ruta: 'tallas' },
    ventas: { titulo: 'Ventas', icono: 'bi-graph-up-arrow', ancho: 'full', ruta: 'ventas' },
    alertas: { titulo: 'Alertas', icono: 'bi-bell', ancho: 'half', ruta: 'alertas' },
    bajoStock: { titulo: 'Por resurtir', icono: 'bi-cart-plus', ancho: 'half', ruta: 'resurtir' },
    categorias: { titulo: 'Existencias', icono: 'bi-bar-chart', ancho: 'half', ruta: 'existencias' },
    caducidad: { titulo: 'Caducidades', icono: 'bi-calendar-x', ancho: 'half', ruta: 'caducidades' },
};
