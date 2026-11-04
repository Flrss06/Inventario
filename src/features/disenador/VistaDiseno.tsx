import type { CSSProperties, FormEvent, ReactNode } from 'react';
import type { PlantillaId } from '@/types';
import { Button } from '@/components/ui/Button';
import { OpcionCard } from '@/components/OpcionCard';
import { PlantillaPreview } from '@/components/PlantillaPreview';
import type { Diseno } from './disenarPanel';

interface Props {
    diseno: Diseno;
    onElegir: (plantilla: PlantillaId) => void;
    textoBoton: string;
    secundario?: ReactNode;
}

/** Muestra el panel que se diseñó: campos, y las dos plantillas para elegir. */
export function VistaDiseno({ diseno, onElegir, textoBoton, secundario }: Props) {
    const { giro, fuente } = diseno;
    const propios = giro.campos.filter(c => !['nombre', 'cantidad', 'precio', 'minimo'].includes(c.key));

    function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onElegir(new FormData(e.currentTarget).get('plantilla') as PlantillaId);
    }

    return (
        <form onSubmit={enviar} style={{ '--accent': giro.color } as CSSProperties} className="animate-entrada">
            <div className="mb-5 flex items-start gap-4 rounded-2xl bg-linear-to-br from-accent/10 to-transparent p-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-2xl text-white shadow-lg shadow-accent/30">
                    <i className={`bi ${giro.icono}`} />
                </span>
                <div>
                    <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-accent shadow-sm">
                        <i className="bi bi-stars" /> {fuente === 'ia' ? 'Diseñado con IA' : 'Diseñado automáticamente'}
                    </span>
                    <h3 className="text-lg font-bold text-ink">{giro.nombre}</h3>
                    <p className="text-sm text-muted">{giro.lema}</p>
                </div>
            </div>

            <p className="mb-2 text-sm font-semibold text-ink">De cada producto vas a guardar:</p>
            <div className="mb-6 flex flex-wrap gap-1.5">
                {['Nombre', ...propios.map(c => c.label), 'Cantidad', 'Precio'].map(l => (
                    <span key={l} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-body">{l}</span>
                ))}
            </div>

            <p className="mb-2 text-sm font-semibold text-ink">Elige tu plantilla (puedes cambiarla después):</p>
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
                {(Object.entries(giro.plantillas) as [PlantillaId, (typeof giro.plantillas)['a']][]).map(([id, p], i) => (
                    <OpcionCard key={id} name="plantilla" value={id} color={giro.color} defaultChecked={i === 0}>
                        <PlantillaPreview plantilla={p} />
                        <strong className="text-ink">{p.nombre}</strong>
                        <small className="text-xs leading-snug text-muted">{p.descripcion}</small>
                    </OpcionCard>
                ))}
            </div>

            <div className="flex justify-between gap-3">
                {secundario ?? <span />}
                <Button type="submit">{textoBoton} <i className="bi bi-arrow-right" /></Button>
            </div>
        </form>
    );
}
