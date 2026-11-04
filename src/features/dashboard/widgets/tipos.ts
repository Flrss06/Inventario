import type { WidgetSpec } from '@/types';

/** Un apartado ya ubicado en el panel: su título, su página (/panel/<ruta>) y su configuración. */
export interface Seccion {
    id: string;
    titulo: string;
    ruta: string;
    spec: WidgetSpec;
}

export interface WidgetProps {
    seccion: Seccion;
    /** "resumen" = vista corta en la página principal; "detalle" = su propia página con todo. */
    modo: 'resumen' | 'detalle';
}
