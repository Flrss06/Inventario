import { createContext, useContext } from 'react';
import type { Giro, Item, ItemDatos, Negocio, PlanId, Plantilla, PlantillaId } from '@/types';

/** Qué ventana está abierta en el panel (null = ninguna). */
export type ModalAbierto =
    | { tipo: 'item'; item?: Item }
    | { tipo: 'planes'; motivo?: string; despues?: 'solicitud' }
    | { tipo: 'solicitud'; aviso?: string }
    | null;

export interface DashboardValor {
    correo: string;
    negocio: Negocio;
    giro: Giro;
    plantilla: Plantilla;
    items: Item[];
    modal: ModalAbierto;
    abrir: (modal: Exclude<ModalAbierto, null>) => void;
    cerrar: () => void;
    guardarItem: (datos: ItemDatos, id?: string) => void;
    cambiarCantidad: (id: string, delta: number) => void;
    borrarItem: (id: string) => void;
    borrarEjemplos: () => void;
    cambiarPlantilla: (id: PlantillaId) => void;
    cambiarPlan: (id: PlanId) => void;
    agregarSolicitud: (tipo: string, detalle: string) => void;
    salir: () => void;
}

export const DashboardContext = createContext<DashboardValor | null>(null);

/** Datos y acciones del panel. Úsalo en cualquier componente dentro del panel. */
export function useDashboard() {
    const valor = useContext(DashboardContext);
    if (!valor) throw new Error('useDashboard debe usarse dentro de <DashboardProvider>');
    return valor;
}
