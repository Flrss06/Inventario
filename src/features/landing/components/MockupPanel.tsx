/** Vista previa decorativa del panel para el hero (no usa datos reales). */
const BARRAS = [30, 45, 38, 60, 52, 70, 48, 82, 66, 90, 74, 95, 80, 100];

export function MockupPanel() {
    return (
        <div aria-hidden className="relative mx-auto w-full max-w-4xl [perspective:1600px]">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-primary/30 backdrop-blur [transform:rotateX(14deg)] transition duration-700 hover:[transform:rotateX(4deg)]">
                <div className="overflow-hidden rounded-2xl bg-page">
                    <div className="flex items-center gap-1.5 border-b border-slate-200 bg-white px-4 py-2.5">
                        <span className="size-2.5 rounded-full bg-red-400" />
                        <span className="size-2.5 rounded-full bg-amber-400" />
                        <span className="size-2.5 rounded-full bg-emerald-400" />
                        <span className="ml-3 rounded-md bg-slate-100 px-3 py-0.5 text-[10px] text-muted">kiubo.mx/panel</span>
                    </div>
                    <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[150px_1fr]">
                        <div className="flex flex-col gap-2 bg-noche p-3">
                            {['Resumen', 'Inventario', 'Ventas', 'Alertas', 'Asistente IA'].map((t, i) => (
                                <span key={t} className={`rounded-md px-2 py-1.5 text-left text-[10px] font-semibold ${i === 0 ? 'bg-white/10 text-white' : 'text-slate-400'}`}>{t}</span>
                            ))}
                        </div>
                        <div className="flex flex-col gap-3 p-3 text-left sm:p-4">
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {[['1,284', 'unidades'], ['$84,520', 'en ventas'], ['6', 'por resurtir'], ['3', 'sin moverse']].map(([v, t]) => (
                                    <div key={t} className="rounded-xl border border-slate-200 bg-white p-2.5">
                                        <b className="block text-sm text-ink">{v}</b>
                                        <span className="text-[9px] text-muted">{t}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="grid gap-3 sm:grid-cols-[3fr_2fr]">
                                <div className="rounded-xl border border-slate-200 bg-white p-3">
                                    <span className="mb-2 block text-[10px] font-bold text-ink">Ventas por día</span>
                                    <div className="flex h-20 items-end gap-[3px]">
                                        {BARRAS.map((h, i) => (
                                            <span key={i} className="flex-1 rounded-t-[3px] bg-linear-to-t from-primary to-violet-400" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>
                                <div className="rounded-xl bg-noche p-3">
                                    <span className="mb-2 flex items-center gap-1 text-[10px] font-bold text-white"><i className="bi bi-stars text-cyan-300" /> Asistente IA</span>
                                    <p className="mb-1.5 rounded-lg bg-white/10 p-2 text-[9px] leading-snug text-slate-200">Compra 8 pares de <b className="text-white">Runner Pro</b>: se te acaban en 3 días.</p>
                                    <p className="rounded-lg bg-white/10 p-2 text-[9px] leading-snug text-slate-200"><b className="text-white">Chamarra de mezclilla</b> no se vende: ponla en promoción.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
