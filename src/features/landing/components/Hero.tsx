import { ButtonLink, clasesBoton } from '@/components/ui/Button';
import { LISTA_GIROS } from '@/giros';

export function Hero() {
    const stats = [
        { valor: String(LISTA_GIROS.length), texto: 'Giros de negocio listos' },
        { valor: '2', texto: 'Plantillas por giro' },
        { valor: '$0', texto: 'Para empezar' },
    ];

    return (
        <header className="bg-gradient-to-b from-white to-page px-6 pt-16 pb-12 text-center">
            <div className="mx-auto max-w-3xl">
                <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-bold text-accent">
                    <i className="bi bi-shield-check" /> Inventario para cualquier negocio
                </span>
                <h1 className="mb-4 text-4xl leading-tight font-extrabold text-ink sm:text-5xl">
                    Un inventario que se adapta <span className="text-accent">a tu negocio.</span>
                </h1>
                <p className="mb-8 text-lg text-muted">
                    Dinos qué vendes y te damos un panel listo para tu giro: comida, ropa, tenis, refacciones y más. Gratis desde el primer día.
                </p>

                <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
                    <ButtonLink to="/registro" tamano="lg">
                        Crear mi cuenta gratis <i className="bi bi-arrow-right" />
                    </ButtonLink>
                    <a href="#planes" className={clasesBoton({ variante: 'secondary', tamano: 'lg' })}>Ver planes</a>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                    {stats.map(s => (
                        <div key={s.texto} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                            <h3 className="text-3xl font-extrabold text-accent">{s.valor}</h3>
                            <p className="text-sm">{s.texto}</p>
                        </div>
                    ))}
                </div>
            </div>
        </header>
    );
}
