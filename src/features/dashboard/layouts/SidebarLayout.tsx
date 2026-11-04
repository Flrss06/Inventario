import { NavLink } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { planDe } from '@/data/planes';
import { useDashboard } from '../context/DashboardContext';
import { enlacesDe } from './navegacion';
import type { LayoutProps } from './tipos';

/** Diseño con barra lateral oscura (lo usan las plantillas "a"). */
export function SidebarLayout({ secciones, children }: LayoutProps) {
    const { correo, negocio, abrir, salir } = useDashboard();
    const plan = planDe(negocio.plan);

    return (
        <div className="grid min-h-screen grid-cols-[minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="relative flex flex-col gap-4 overflow-hidden bg-noche px-4 py-6 text-slate-300 lg:sticky lg:top-0 lg:h-screen lg:gap-7 lg:overflow-y-auto">
                {/* Brillo de color del giro detrás del menú */}
                <span className="pointer-events-none absolute -top-24 -left-20 size-64 rounded-full bg-accent/25 blur-3xl" />

                <Logo claro className="relative px-2" />

                <nav aria-label="Secciones" className="relative flex gap-1 overflow-x-auto lg:flex-col">
                    {enlacesDe(secciones).map(e => (
                        <NavLink
                            key={e.to}
                            to={e.to}
                            end={e.exacto}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition ${
                                    isActive
                                        ? 'bg-white/10 text-white shadow-inner'
                                        : e.destacado
                                          ? 'text-white hover:bg-white/10'
                                          : 'hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <i className={`bi ${e.icono} ${isActive || e.destacado ? 'text-accent' : ''} ${e.destacado ? 'texto-marca' : ''}`} />
                                    {e.titulo}
                                    {isActive && <span className="ml-auto hidden size-1.5 rounded-full bg-accent lg:block" />}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="relative rounded-2xl border border-white/10 bg-white/5 p-4 text-sm lg:mt-auto">
                    <span className="text-xs tracking-wide text-slate-400 uppercase">Tu plan</span>
                    <strong className="mb-3 block text-lg text-white">{plan.nombre}</strong>
                    <Button tamano="sm" bloque onClick={() => abrir({ tipo: 'planes' })}>
                        {plan.id === 'gratis' ? <><i className="bi bi-rocket-takeoff" /> Mejorar plan</> : 'Ver planes'}
                    </Button>
                </div>

                <div className="relative flex items-center justify-between gap-2 px-2 text-xs">
                    <span className="truncate" title={correo}>{correo}</span>
                    <button type="button" onClick={salir} className="shrink-0 cursor-pointer rounded-md px-2 py-1 hover:bg-white/10 hover:text-white">
                        <i className="bi bi-box-arrow-right" /> Salir
                    </button>
                </div>
            </aside>

            <main className="mx-auto w-full max-w-6xl min-w-0 p-4 sm:p-8">{children}</main>
        </div>
    );
}
