// Registro de apartados del panel. Para crear uno nuevo:
// 1. Crea su componente en esta carpeta (recibe { seccion } y usa useDashboard()).
// 2. Agrega su id a WidgetId en src/types/index.ts y sus datos en src/data/widgets.ts.
// 3. Regístralo aquí abajo y úsalo en las plantillas de los giros.

import type { ComponentType } from 'react';
import type { Giro, WidgetId, WidgetSpec } from '@/types';
import { WIDGET_META } from '@/data/widgets';
import { campoDe } from '../lib/inventario';
import { vocabularioDe } from '@/giros/vocabulario';
import type { WidgetProps } from './tipos';
import { KpisWidget } from './KpisWidget';
import { TablaWidget } from './TablaWidget';
import { TarjetasWidget } from './TarjetasWidget';
import { AlertasWidget } from './AlertasWidget';
import { BajoStockWidget } from './BajoStockWidget';
import { CategoriasWidget } from './CategoriasWidget';
import { CaducidadWidget } from './CaducidadWidget';
import { TallasWidget } from './TallasWidget';
import { VentasWidget } from './VentasWidget';

export const WIDGETS: Record<WidgetId, ComponentType<WidgetProps>> = {
    kpis: KpisWidget,
    tabla: TablaWidget,
    tarjetas: TarjetasWidget,
    alertas: AlertasWidget,
    bajoStock: BajoStockWidget,
    categorias: CategoriasWidget,
    caducidad: CaducidadWidget,
    tallas: TallasWidget,
    ventas: VentasWidget,
};

export function tituloWidget(spec: WidgetSpec, giro: Giro) {
    if (spec.titulo) return spec.titulo;
    const v = vocabularioDe(giro);
    if (spec.w === 'ventas') return v.salidas;
    // Un negocio que usa insumos los pide a proveedores; no los "resurte" para vender.
    if (v.tipo === 'consumo' && spec.w === 'bajoStock') return 'Por pedir';
    if (v.tipo === 'consumo' && (spec.w === 'tabla' || spec.w === 'tarjetas')) return 'Insumos';
    if (spec.w === 'categorias') {
        const campo = campoDe(giro, spec.por ?? giro.agruparPor);
        return campo ? `Por ${campo.label.toLowerCase()}` : WIDGET_META.categorias.titulo;
    }
    return WIDGET_META[spec.w].titulo;
}
