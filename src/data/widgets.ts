import type { WidgetId } from '@/types';

// Datos de cada apartado del panel. Los componentes viven en
// src/features/dashboard/widgets; esto se separa para que el registro
// pueda dibujar la miniatura de una plantilla sin cargar el panel.
export const WIDGET_META: Record<WidgetId, { titulo: string; icono: string; ancho: 'full' | 'half' }> = {
    kpis: { titulo: 'Resumen', icono: 'bi-speedometer2', ancho: 'full' },
    tabla: { titulo: 'Inventario', icono: 'bi-table', ancho: 'full' },
    tarjetas: { titulo: 'Catálogo', icono: 'bi-grid-3x3-gap', ancho: 'full' },
    tallas: { titulo: 'Existencias por talla', icono: 'bi-rulers', ancho: 'full' },
    alertas: { titulo: 'Alertas', icono: 'bi-bell', ancho: 'half' },
    bajoStock: { titulo: 'Por resurtir', icono: 'bi-graph-down-arrow', ancho: 'half' },
    categorias: { titulo: 'Existencias', icono: 'bi-bar-chart', ancho: 'half' },
    caducidad: { titulo: 'Caducidades', icono: 'bi-calendar-x', ancho: 'half' },
};
