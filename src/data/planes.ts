import type { Plan, PlanId } from '@/types';

// Precios de ejemplo: ajústalos aquí y se actualizan en el inicio y en el panel.
export const PLANES: Plan[] = [
    {
        id: 'gratis',
        nombre: 'Gratis',
        precio: '$0',
        periodo: 'para siempre',
        cambiosMes: 0,
        incluye: ['2 plantillas listas para tu giro', 'Inventario, alertas y reportes base', 'Cambia de plantilla cuando quieras'],
    },
    {
        id: 'pro',
        nombre: 'Pro',
        precio: '$149',
        periodo: 'MXN / mes',
        cambiosMes: 3,
        destacado: true,
        incluye: ['Todo lo del plan Gratis', 'Pide hasta 3 cambios pequeños al mes', 'Agrega campos o apartados a tu plantilla'],
    },
    {
        id: 'medida',
        nombre: 'A tu medida',
        precio: 'Desde $499',
        periodo: 'MXN / mes',
        cambiosMes: null,
        incluye: ['Todo lo del plan Pro', 'Dashboard diseñado a tu gusto', 'Cambios sin límite y atención prioritaria'],
    },
];

export const planDe = (id: PlanId) => PLANES.find(p => p.id === id) ?? PLANES[0];
