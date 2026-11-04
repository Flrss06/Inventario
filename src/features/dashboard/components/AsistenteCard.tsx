import { Link } from 'react-router-dom';
import { dinero } from '@/lib/format';
import { vocabularioDe } from '@/giros/vocabulario';
import { useDashboard } from '../context/DashboardContext';
import { Recomendaciones } from './Recomendaciones';

/** Tarjeta del resumen con lo más importante que detectó el asistente. */
export function AsistenteCard() {
    const { analisis, giro } = useDashboard();
    const v = vocabularioDe(giro);

    return (
        <section className="relative overflow-hidden rounded-3xl bg-noche p-5 text-slate-300 sm:p-6 lg:col-span-2">
            <span className="pointer-events-none absolute -top-20 -right-10 size-72 rounded-full bg-accent/30 blur-3xl" />
            <span className="pointer-events-none absolute -bottom-24 left-1/3 size-60 rounded-full bg-cyan-400/15 blur-3xl" />

            <header className="relative mb-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-linear-to-br from-violet-500 to-cyan-400 text-xl text-white shadow-lg shadow-violet-500/30">
                        <i className="bi bi-stars" />
                    </span>
                    <div>
                        <h3 className="text-lg font-bold text-white">Asistente IA</h3>
                        <p className="text-xs">
                            {analisis.comprar.length
                                ? `${analisis.comprar.length} ${v.productos} por reponer · inversión aprox. ${dinero(analisis.costoCompraSugerida)}`
                                : `Revisé tu inventario y tus movimientos de los últimos 30 días`}
                        </p>
                    </div>
                </div>
                <Link
                    to="/panel/ia"
                    className="rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                    Ver reporte completo <i className="bi bi-arrow-right" />
                </Link>
            </header>

            <div className="relative">
                <Recomendaciones lista={analisis.recomendaciones.slice(0, 3)} columnas={3} />
            </div>
        </section>
    );
}
