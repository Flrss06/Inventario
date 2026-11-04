// Registro de giros. Para agregar uno nuevo:
// 1. Crea su archivo en esta carpeta (copia uno existente como base).
//    Si el negocio USA sus productos en vez de venderlos, ponle vocabulario: CONSUMO.
// 2. Agrega su id a GiroId en src/types/index.ts.
// 3. Impórtalo aquí abajo.
// El inicio, el registro y el panel lo toman automáticamente.

import type { Giro, GiroId, Negocio } from '@/types';
import { restaurante } from './restaurante';
import { abarrotes } from './abarrotes';
import { ropa } from './ropa';
import { calzado } from './calzado';
import { refacciones } from './refacciones';
import { general } from './general';

export const GIROS: Record<GiroId, Giro> = { restaurante, abarrotes, ropa, calzado, refacciones, general };

export const LISTA_GIROS = Object.values(GIROS);

// Ids que existieron antes. "comida" juntaba restaurantes y abarrotes; sus datos de ejemplo eran de abarrotes.
const ANTERIORES: Record<string, GiroId> = { comida: 'abarrotes' };

export function giroDe(id: string | null | undefined): Giro {
    return GIROS[(ANTERIORES[id ?? ''] ?? id) as GiroId] ?? GIROS.general;
}

/** El giro con el que se arma el panel: el diseñado a la medida si existe, o el del catálogo. */
export function giroDeNegocio(negocio: Pick<Negocio, 'tipo' | 'giroPersonalizado'>): Giro {
    const propio = negocio.giroPersonalizado;
    if (propio) return { ...propio, id: 'general', ejemplos: () => propio.ejemplos };
    return giroDe(negocio.tipo);
}

export const esGiro = (id: string | null | undefined): id is GiroId => Boolean(id && id in GIROS);
