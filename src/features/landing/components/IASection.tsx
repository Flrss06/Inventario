import { Reveal } from '@/components/Reveal';
import { LogoCubo } from '@/components/Logo';

const FUNCIONES = [
    { icono: 'bi-cart-check', titulo: 'Te dice qué comprar', texto: 'Calcula cuánto te alcanza cada producto al ritmo que vendes y arma tu lista de compra con cantidades.' },
    { icono: 'bi-graph-up-arrow', titulo: 'Sabe qué sale y qué no', texto: 'Detecta tus productos estrella, lo que lleva semanas sin venderse y de qué tienes más de lo que necesitas.' },
    { icono: 'bi-magic', titulo: 'Diseña tu panel', texto: '¿Tu negocio no está en la lista? Contesta 5 preguntas y la IA crea los campos y apartados que necesitas.' },
];

const MENSAJES = [
    { de: 'kiubo', texto: 'Revisé tus ventas de los últimos 30 días. 3 cosas importantes:' },
    { de: 'kiubo', texto: '🛒 Compra 18 de Mario Kart 8: vendes 4 por semana y te quedan 2.' },
    { de: 'kiubo', texto: '⏳ Halo Infinite no se ha vendido en un mes. ¿Lo pones en promoción?' },
    { de: 'kiubo', texto: '📈 Tus ventas subieron 22% esta semana. ¡Bien!' },
];

export function IASection() {
    return (
        <section id="ia" className="relative scroll-mt-20 overflow-hidden bg-noche px-6 py-28 text-slate-300">
            <span className="pointer-events-none absolute -top-40 -left-40 size-[36rem] rounded-full bg-primary/25 blur-[120px]" />
            <span className="pointer-events-none absolute -right-40 -bottom-40 size-[30rem] rounded-full bg-cyan-400/15 blur-[120px]" />

            <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
                <div>
                    <Reveal>
                        <span className="mb-3 inline-flex items-center gap-1.5 text-sm font-bold tracking-wider text-cyan-300 uppercase">
                            <i className="bi bi-stars" /> Asistente IA
                        </span>
                        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
                            Como tener un experto en inventario <span className="texto-marca">todos los días.</span>
                        </h2>
                        <p className="mb-10 text-lg">Registra con un clic lo que vendes (o lo que usas, si tienes restaurante o taller) y Kiubo hace las cuentas por ti.</p>
                    </Reveal>
                    <div className="flex flex-col gap-4">
                        {FUNCIONES.map((f, i) => (
                            <Reveal key={f.titulo} retraso={i * 120}>
                                <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]">
                                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-linear-to-br from-primary to-cyan-400 text-xl text-white shadow-lg shadow-primary/30">
                                        <i className={`bi ${f.icono}`} />
                                    </span>
                                    <div>
                                        <h3 className="mb-1 font-bold text-white">{f.titulo}</h3>
                                        <p className="text-sm">{f.texto}</p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                <Reveal retraso={200}>
                    <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur">
                        <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4">
                            <span className="grid size-10 place-items-center rounded-full bg-white/10"><LogoCubo className="size-6" /></span>
                            <div>
                                <strong className="block text-white">Asistente de Kiubo</strong>
                                <span className="flex items-center gap-1.5 text-xs text-emerald-300"><span className="size-1.5 animate-pulse rounded-full bg-emerald-300" /> Analizando tu inventario</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            {MENSAJES.map((m, i) => (
                                <Reveal key={i} retraso={300 + i * 250}>
                                    <p className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3 text-sm text-slate-100">{m.texto}</p>
                                </Reveal>
                            ))}
                            <Reveal retraso={1300}>
                                <p className="ml-auto max-w-[70%] rounded-2xl rounded-tr-sm bg-linear-to-r from-primary to-violet-500 px-4 py-3 text-sm text-white">Hazme la lista de compra 🙌</p>
                            </Reveal>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
