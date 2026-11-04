import { createContext, useContext } from 'react';
import type { Giro, GiroGuardado, Item, ItemDatos, Movimiento, Negocio, PlanId, Plantilla, PlantillaId } from '@/types';
import type { Analisis } from '../lib/analisis';

/** Qué ventana está abierta en el panel (null = ninguna). */
export type ModalAbierto =
    | { tipo: 'item'; item?: Item }
    | { tipo: 'planes'; motivo?: string; despues?: 'solicitud' }
    | { tipo: 'solicitud'; aviso?: string }
    | { tipo: 'disenar' }
    | null;

export interface DashboardValor {
    correo: string;
    negocio: Negocio;
    giro: Giro;
    plantilla: Plantilla;
    items: Item[];
    movimientos: Movimiento[];
    /** Qué comprar, qué se vende, qué no: se recalcula cuando cambian productos o ventas. */
    analisis: Analisis;
    modal: ModalAbierto;
    abrir: (modal: Exclude<ModalAbierto, null>) => void;
    cerrar: () => void;
    guardarItem: (datos: ItemDatos, id?: string) => void;
    /** −1 registra una venta, +1 una entrada de mercancía. */
    cambiarCantidad: (id: string, delta: number) => void;
    borrarItem: (id: string) => void;
    borrarEjemplos: () => void;
    cambiarPlantilla: (id: PlantillaId) => void;
    cambiarPlan: (id: PlanId) => void;
    agregarSolicitud: (tipo: string, detalle: string) => void;
    /** Usa un panel diseñado a la medida. Si solo había ejemplos, los cambia por los nuevos. */
    aplicarDiseno: (giro: GiroGuardado, plantilla: PlantillaId) => void;
    salir: () => void;
}

export const DashboardContext = createContext<DashboardValor | null>(null);

/** Datos y acciones del panel. Úsalo en cualquier componente dentro del panel. */
export function useDashboard() {
    const valor = useContext(DashboardContext);
    if (!valor) throw new Error('useDashboard debe usarse dentro de <DashboardProvider>');
    return valor;
}
