import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Item, Movimiento, Negocio } from '@/types';
import { giroDeNegocio } from '@/giros';
import { nuevoId } from '@/lib/format';
import { historialDeEjemplo } from '@/lib/historial';
import { cargarItems, cargarMovimientos, cerrarSesion, guardarItems, guardarMovimientos, guardarNegocio } from '@/services/db';
import { analizar } from '../lib/analisis';
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
    const [movimientos, setMovimientos] = useState<Movimiento[]>(() => cargarMovimientos(correo));
    const [modal, setModal] = useState<ModalAbierto>(null);

    // Cada cambio se guarda solo; los componentes no tienen que acordarse de guardar.
    useEffect(() => {
        guardarNegocio(correo, negocio);
    }, [correo, negocio]);

    useEffect(() => {
        guardarItems(correo, items);
    }, [correo, items]);

    useEffect(() => {
        guardarMovimientos(correo, movimientos);
    }, [correo, movimientos]);

    const giro = useMemo(() => giroDeNegocio(negocio), [negocio]);
    const analisis = useMemo(() => analizar(items, movimientos, giro), [items, movimientos, giro]);

    function cambiarCantidad(id: string, delta: number) {
        const item = items.find(i => i.id === id);
        if (!item || (delta < 0 && cantidadDe(item) === 0)) return;
        setItems(prev => prev.map(i => (i.id === id ? { ...i, cantidad: Math.max(0, cantidadDe(i) + delta) } : i)));
        setMovimientos(prev => [
            ...prev,
            { id: nuevoId(), itemId: id, tipo: delta < 0 ? 'venta' : 'entrada', cantidad: Math.abs(delta), fecha: new Date().toISOString() },
        ]);
    }

    const valor: DashboardValor = {
        correo,
        negocio,
        giro,
        plantilla: giro.plantillas[negocio.plantilla] ?? giro.plantillas.a,
        items,
        movimientos,
        analisis,
        modal,
        abrir: setModal,
        cerrar: () => setModal(null),

        guardarItem: (datos, id) =>
            setItems(prev => (id ? prev.map(i => (i.id === id ? { ...i, ...datos } : i)) : [{ ...datos, id: nuevoId() }, ...prev])),
        cambiarCantidad,
        borrarItem: id => setItems(prev => prev.filter(i => i.id !== id)),
        borrarEjemplos: () => {
            const ejemplos = new Set(items.filter(i => i.ejemplo).map(i => i.id));
            setItems(prev => prev.filter(i => !i.ejemplo));
            setMovimientos(prev => prev.filter(m => !ejemplos.has(m.itemId)));
        },

        cambiarPlantilla: plantilla => setNegocio(n => ({ ...n, plantilla })),
        cambiarPlan: plan => setNegocio(n => ({ ...n, plan })),
        agregarSolicitud: (tipo, detalle) =>
            setNegocio(n => ({
                ...n,
                solicitudes: [...n.solicitudes, { fecha: new Date().toISOString(), tipo, detalle, estado: 'Pendiente' }],
            })),

        aplicarDiseno: (giroNuevo, plantilla) => {
            setNegocio(n => ({ ...n, giroPersonalizado: giroNuevo, plantilla }));
            if (items.every(i => i.ejemplo)) {
                const nuevos = giroNuevo.ejemplos.map(e => ({ ...e, id: nuevoId(), ejemplo: true }));
                setItems(nuevos);
                setMovimientos(historialDeEjemplo(nuevos));
            }
        },

        salir: () => {
            cerrarSesion();
            navigate('/');
        },
    };

    return <DashboardContext.Provider value={valor}>{children}</DashboardContext.Provider>;
}
