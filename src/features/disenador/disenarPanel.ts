import type { Cuestionario, GiroGuardado } from '@/types';
import { disenarLocal } from '@/giros/disenador';
import { disenarConIA } from '@/services/ia';

export interface Diseno {
    giro: GiroGuardado;
    /** "ia" si lo diseñó Claude, "local" si se usó el diseñador sin conexión. */
    fuente: 'ia' | 'local';
}

const esperar = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Pide el diseño a la IA; si no está disponible, usa el diseñador local. */
export async function disenarPanel(c: Cuestionario): Promise<Diseno> {
    // Una pausa mínima para que la animación de "diseñando" se alcance a ver.
    const [deIA] = await Promise.all([disenarConIA(c), esperar(1800)]);
    return deIA ? { giro: deIA, fuente: 'ia' } : { giro: disenarLocal(c), fuente: 'local' };
}
