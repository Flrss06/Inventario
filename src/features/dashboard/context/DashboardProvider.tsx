import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Item, Negocio } from '@/types';
import { giroDe } from '@/giros';
import { nuevoId } from '@/lib/format';
import { cargarItems, cerrarSesion, guardarItems, guardarNegocio } from '@/services/db';
import { cantidadDe } from '../lib/inventario';
import { DashboardContext, type DashboardValor, type ModalAbierto } from './DashboardContext';

interface Props {
    correo: string;
    negocioInicial: Negocio;
    children: ReactNode;
}

export function DashboardProvider({ correo, negocioInicial, children }: Props) {
    const navigate = useNavigate();
    const [negocio, setNegocio] = useState<Negocio>(() => ({ ...negocioInicial, solicitudes: negocioInicial.solicitudes ?? [] }));
    const [items, setItems] = useState<Item[]>(() => cargarItems(correo));
    const [modal, setModal] = useState<ModalAbierto>(null);

    // Cada cambio se guarda solo; los componentes no tienen que acordarse de guardar.
    useEffect(() => {
        guardarNegocio(correo, negocio);
    }, [correo, negocio]);

    useEffect(() => {
        guardarItems(correo, items);
    }, [correo, items]);

    const giro = giroDe(negocio.tipo);

    const valor: DashboardValor = {
        correo,
        negocio,
        giro,
        plantilla: giro.plantillas[negocio.plantilla] ?? giro.plantillas.a,
        items,
        modal,
        abrir: setModal,
        cerrar: () => setModal(null),

        guardarItem: (datos, id) =>
            setItems(prev => (id ? prev.map(i => (i.id === id ? { ...i, ...datos } : i)) : [{ ...datos, id: nuevoId() }, ...prev])),
        cambiarCantidad: (id, delta) =>
            setItems(prev => prev.map(i => (i.id === id ? { ...i, cantidad: Math.max(0, cantidadDe(i) + delta) } : i))),
        borrarItem: id => setItems(prev => prev.filter(i => i.id !== id)),
        borrarEjemplos: () => setItems(prev => prev.filter(i => !i.ejemplo)),

        cambiarPlantilla: plantilla => setNegocio(n => ({ ...n, plantilla })),
        cambiarPlan: plan => setNegocio(n => ({ ...n, plan })),
        agregarSolicitud: (tipo, detalle) =>
            setNegocio(n => ({
                ...n,
                solicitudes: [...n.solicitudes, { fecha: new Date().toISOString(), tipo, detalle, estado: 'Pendiente' }],
            })),

        salir: () => {
            cerrarSesion();
            navigate('/');
        },
    };

    return <DashboardContext.Provider value={valor}>{children}</DashboardContext.Provider>;
}
