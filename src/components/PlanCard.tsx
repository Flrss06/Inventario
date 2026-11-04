import type { ReactNode } from 'react';
import type { Plan } from '@/types';

/** Tarjeta de un plan. Se usa en el inicio y en la ventana de planes del panel. */
export function PlanCard({ plan, accion }: { plan: Plan; accion: ReactNode }) {
    return (
        <div
            className={`relative flex h-full flex-col gap-4 rounded-3xl p-7 transition duration-300 hover:-translate-y-1 ${
                plan.destacado
                    ? 'bg-noche text-slate-300 shadow-2xl shadow-accent/25 ring-2 ring-accent'
                    : 'border border-slate-200 bg-white hover:shadow-xl'
            }`}
        >
            {plan.destacado && (
                <span className="absolute -top-3.5 left-7 rounded-full bg-linear-to-r from-accent to-cyan-400 px-3 py-1 text-xs font-bold text-white shadow-lg">Más popular</span>
            )}
            <h3 className={`text-lg font-bold ${plan.destacado ? 'text-white' : 'text-ink'}`}>{plan.nombre}</h3>
            <div className={`text-4xl leading-none font-extrabold ${plan.destacado ? 'text-white' : 'text-ink'}`}>
                {plan.precio} <small className={`text-sm font-medium ${plan.destacado ? 'text-slate-400' : 'text-muted'}`}>{plan.periodo}</small>
            </div>
            <ul className="flex flex-1 flex-col gap-2.5 text-sm">
                {plan.incluye.map(punto => (
                    <li key={punto} className="flex gap-2">
                        <i className={`bi bi-check-circle-fill ${plan.destacado ? 'text-cyan-300' : 'text-accent'}`} />
                        {punto}
                    </li>
                ))}
            </ul>
            {accion}
        </div>
    );
}
