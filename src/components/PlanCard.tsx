import type { ReactNode } from 'react';
import type { Plan } from '@/types';

/** Tarjeta de un plan. Se usa en el inicio y en la ventana de planes del panel. */
export function PlanCard({ plan, accion }: { plan: Plan; accion: ReactNode }) {
    return (
        <div
            className={`relative flex flex-col gap-4 rounded-2xl bg-white p-6 ${
                plan.destacado ? 'border-2 border-accent shadow-xl' : 'border border-slate-200'
            }`}
        >
            {plan.destacado && (
                <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-white">Más popular</span>
            )}
            <h3 className="text-lg font-bold text-ink">{plan.nombre}</h3>
            <div className="text-3xl leading-none font-extrabold text-ink">
                {plan.precio} <small className="text-sm font-medium text-muted">{plan.periodo}</small>
            </div>
            <ul className="flex flex-1 flex-col gap-2 text-sm">
                {plan.incluye.map(punto => (
                    <li key={punto}>
                        <i className="bi bi-check2 mr-1.5 text-accent" />
                        {punto}
                    </li>
                ))}
            </ul>
            {accion}
        </div>
    );
}
