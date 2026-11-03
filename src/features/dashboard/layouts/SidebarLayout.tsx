import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { planDe } from '@/data/planes';
import { WIDGET_META } from '@/data/widgets';
import { useDashboard } from '../context/DashboardContext';
import type { LayoutProps } from './tipos';

/** Diseño con barra lateral oscura (lo usan las plantillas "a"). */
export function SidebarLayout({ secciones, children }: LayoutProps) {
    const { correo, negocio, abrir, salir } = useDashboard();
    const plan = planDe(negocio.plan);

    return (
        <div className="grid min-h-screen grid-cols-[minmax(0,1fr)] lg:grid-cols-[250px_minmax(0,1fr)]">
            <aside className="flex flex-col gap-4 bg-ink px-4 py-6 text-slate-300 lg:sticky lg:top-0 lg:h-screen lg:gap-6 lg:overflow-y-auto">
                <Logo className="px-2 text-white [&_i]:text-accent" />

                <nav aria-label="Secciones" className="flex gap-1 overflow-x-auto lg:flex-col">
                    {secciones.map(s => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap hover:bg-white/10 hover:text-white"
                        >
                            <i className={`bi ${WIDGET_META[s.spec.w].icono}`} /> {s.titulo}
                        </a>
                    ))}
                </nav>

                <div className="rounded-2xl bg-white/5 p-4 text-sm lg:mt-auto">
                    <span>Tu plan</span>
                    <strong className="mb-3 block text-lg text-white">{plan.nombre}</strong>
                    <Button tamano="sm" bloque onClick={() => abrir({ tipo: 'planes' })}>
                        {plan.id === 'gratis' ? 'Mejorar plan' : 'Ver planes'}
                    </Button>
                </div>

                <div className="flex items-center justify-between gap-2 px-2 text-xs break-all">
                    <span>{correo}</span>
                    <button type="button" onClick={salir} className="cursor-pointer underline">Salir</button>
                </div>
            </aside>

            <main className="mx-auto w-full max-w-6xl min-w-0 p-4 sm:p-8">{children}</main>
        </div>
    );
}
