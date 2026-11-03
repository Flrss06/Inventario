// Registro de giros. Para agregar uno nuevo:
// 1. Crea su archivo en esta carpeta (copia uno existente como base).
// 2. Agrega su id a GiroId en src/types/index.ts.
// 3. Impórtalo aquí abajo.
// El inicio, el registro y el panel lo toman automáticamente.

import type { Giro, GiroId } from '@/types';
import { comida } from './comida';
import { ropa } from './ropa';
import { calzado } from './calzado';
import { refacciones } from './refacciones';
import { general } from './general';

export const GIROS: Record<GiroId, Giro> = { comida, ropa, calzado, refacciones, general };

export const LISTA_GIROS = Object.values(GIROS);

export function giroDe(id: string | null | undefined): Giro {
    return GIROS[id as GiroId] ?? GIROS.general;
}

export const esGiro = (id: string | null | undefined): id is GiroId => Boolean(id && id in GIROS);
