import { Button } from '@/components/ui/Button';
import { useDashboard } from '../context/DashboardContext';

/** Para negocios de "Otro tipo": invita a que la IA diseñe un panel a su medida. */
export function DisenarBanner() {
    const { negocio, abrir } = useDashboard();
    if (negocio.tipo !== 'general' || negocio.giroPersonalizado) return null;

    return (
        <div className="relative mb-6 flex animate-entrada flex-wrap items-center justify-between gap-4 overflow-hidden rounded-3xl border border-violet-200 bg-linear-to-r from-violet-50 via-white to-cyan-50 p-5">
            <div className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-violet-500 to-cyan-400 text-2xl text-white shadow-lg shadow-violet-500/30">
                    <i className="bi bi-magic" />
                </span>
                <div>
                    <strong className="block text-ink">Este es un panel genérico. ¿Lo hacemos a tu medida?</strong>
                    <span className="text-sm text-muted">Responde 5 preguntas sobre lo que vendes y la IA diseña los campos, apartados y ejemplos para tu negocio. Es gratis.</span>
                </div>
            </div>
            <Button onClick={() => abrir({ tipo: 'disenar' })}>
                <i className="bi bi-stars" /> Diseñar mi panel con IA
            </Button>
        </div>
    );
}
