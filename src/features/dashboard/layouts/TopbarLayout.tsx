import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { planDe } from '@/data/planes';
import { WIDGET_META } from '@/data/widgets';
import { useDashboard } from '../context/DashboardContext';
import type { LayoutProps } from './tipos';

/** Diseño con barra superior clara (lo usan las plantillas "b"). */
export function TopbarLayout({ secciones, children }: LayoutProps) {
    const { negocio, abrir, salir } = useDashboard();
    const plan = planDe(negocio.plan);

    return (
        <>
            <header className="sticky top-0 z-40 border-b-[3px] border-accent bg-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
                    <Logo />
                    <nav aria-label="Secciones" className="order-3 flex basis-full gap-1 overflow-x-auto md:order-none md:flex-1 md:basis-auto">
                        {secciones.map(s => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap hover:bg-accent/10 hover:text-accent"
                            >
                                <i className={`bi ${WIDGET_META[s.spec.w].icono}`} /> {s.titulo}
                            </a>
                        ))}
                    </nav>
                    <div className="ml-auto flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => abrir({ tipo: 'planes' })}
                            className="cursor-pointer rounded-full bg-accent/10 px-3.5 py-1.5 text-xs font-bold whitespace-nowrap text-accent"
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
