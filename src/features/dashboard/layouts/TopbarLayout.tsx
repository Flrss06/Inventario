import { NavLink } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { planDe } from '@/data/planes';
import { useDashboard } from '../context/DashboardContext';
import { enlacesDe } from './navegacion';
import type { LayoutProps } from './tipos';

/** Diseño con barra superior clara (lo usan las plantillas "b"). */
export function TopbarLayout({ secciones, children }: LayoutProps) {
    const { negocio, abrir, salir } = useDashboard();
    const plan = planDe(negocio.plan);

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-accent via-accent/50 to-transparent" />
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
                    <Logo />
                    <nav aria-label="Secciones" className="order-3 flex basis-full gap-1 overflow-x-auto md:order-none md:flex-1 md:basis-auto">
                        {enlacesDe(secciones).map(e => (
                            <NavLink
                                key={e.to}
                                to={e.to}
                                end={e.exacto}
                                className={({ isActive }) =>
                                    `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold whitespace-nowrap transition ${
                                        isActive ? 'bg-accent text-white shadow-md shadow-accent/30' : 'hover:bg-accent/10 hover:text-accent'
                                    }`
                                }
                            >
                                <i className={`bi ${e.icono}`} /> {e.titulo}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="ml-auto flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => abrir({ tipo: 'planes' })}
                            className="cursor-pointer rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-bold whitespace-nowrap text-accent transition hover:bg-accent/20"
                        >
                            Plan {plan.nombre}
                        </button>
                        <Button variante="secondary" tamano="sm" onClick={salir}>Salir</Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-6xl p-4 sm:p-8">{children}</main>
        </>
    );
}
