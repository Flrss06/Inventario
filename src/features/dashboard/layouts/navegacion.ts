import { WIDGET_META } from '@/data/widgets';
import type { Seccion } from '../widgets/tipos';

export interface EnlaceNav {
    to: string;
    titulo: string;
    icono: string;
    /** Solo activo en la ruta exacta (para "Resumen"). */
    exacto?: boolean;
    destacado?: boolean;
}

/** Menú del panel: Resumen, una página por apartado de la plantilla y el Asistente IA. */
export function enlacesDe(secciones: Seccion[]): EnlaceNav[] {
    return [
        { to: '/panel', titulo: 'Resumen', icono: WIDGET_META.kpis.icono, exacto: true },
        ...secciones.map(s => ({ to: s.ruta, titulo: s.titulo, icono: WIDGET_META[s.spec.w].icono })),
        { to: '/panel/ia', titulo: 'Asistente IA', icono: 'bi-stars', destacado: true },
    ];
}
