import { LogoCubo } from '@/components/Logo';
import { ButtonLink, clasesBoton } from '@/components/ui/Button';
import { LISTA_GIROS } from '@/giros';
import { MockupPanel } from './MockupPanel';

export function Hero() {
    return (
        <header className="relative overflow-hidden bg-noche px-6 pt-36 pb-24 text-center text-slate-300">
            {/* Fondo: manchas de color, cuadrícula y cubos flotando */}
            <span className="pointer-events-none absolute -top-40 left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-primary/35 blur-[120px]" />
            <span className="pointer-events-none absolute top-1/3 -right-40 size-96 rounded-full bg-cyan-400/20 blur-[100px]" />
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
            <LogoCubo className="pointer-events-none absolute top-32 left-[8%] hidden size-16 sm:block animate-flotar opacity-40" />
            <LogoCubo className="pointer-events-none absolute top-56 right-[10%] hidden size-10 sm:block animate-flotar opacity-30 [animation-delay:-2s]" />
            <LogoCubo className="pointer-events-none absolute bottom-40 left-[14%] size-8 animate-flotar opacity-25 [animation-delay:-4s]" />

            <div className="relative mx-auto max-w-4xl">
                <span className="mb-7 inline-flex animate-entrada items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
                    <span className="rounded-full bg-linear-to-r from-primary to-cyan-400 px-2 py-0.5 text-[11px] font-bold">Nuevo</span>
                    Asistente IA que te dice qué comprar
                </span>
                <h1 className="mb-6 animate-entrada text-[2.1rem] leading-[1.1] font-extrabold tracking-tight text-balance text-white [animation-delay:80ms] sm:text-6xl">
                    El inventario que se adapta <br className="hidden sm:block" />
                    <span className="texto-marca">a tu negocio.</span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl animate-entrada text-lg [animation-delay:160ms]">
                    Dinos qué vendes y Kiubo arma un panel hecho para ti. Su IA analiza lo que vendes o lo que usas y te avisa qué comprar, qué sale más y qué no se mueve.
                </p>

                <div className="mb-14 flex animate-entrada flex-col justify-center gap-3 [animation-delay:240ms] sm:flex-row">
                    <ButtonLink to="/registro" tamano="lg" className="shadow-xl shadow-primary/40">
                        Crear mi cuenta gratis <i className="bi bi-arrow-right" />
                    </ButtonLink>
                    <a href="#ia" className={`${clasesBoton({ variante: 'ghost', tamano: 'lg' })} border border-white/15 text-white! hover:bg-white/10`}>
                        <i className="bi bi-play-circle" /> Ver cómo funciona
                    </a>
                </div>

                <div className="mb-16 flex animate-entrada flex-wrap justify-center gap-2 [animation-delay:320ms]">
                    {LISTA_GIROS.map(g => (
                        <span key={g.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm">
                            <i className={`bi ${g.icono}`} style={{ color: g.color }} /> {g.id === 'general' ? 'y lo que vendas' : g.nombre}
                        </span>
                    ))}
                </div>
            </div>

            <div className="relative animate-entrada [animation-delay:400ms]">
                <MockupPanel />
            </div>
        </header>
    );
}
