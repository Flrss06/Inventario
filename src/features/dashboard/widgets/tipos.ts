import type { WidgetSpec } from '@/types';

/** Un apartado ya ubicado en la página: su id para el menú, su título y su configuración. */
export interface Seccion {
    id: string;
    titulo: string;
    spec: WidgetSpec;
}

export interface WidgetProps {
    seccion: Seccion;
}
