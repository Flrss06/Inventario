import type { Plantilla } from '@/types';
import { WIDGET_META } from '@/data/widgets';

/** Miniatura de una plantilla: muestra su acomodo, no sus datos. */
export function PlantillaPreview({ plantilla }: { plantilla: Plantilla }) {
    const lateral = plantilla.layout === 'sidebar';
    return (
        <span aria-hidden className={`mb-2 flex h-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${lateral ? 'flex-row' : 'flex-col'}`}>
            <span className={lateral ? 'w-1/5 shrink-0 bg-ink' : 'h-3.5 shrink-0 bg-accent'} />
            <span className="grid flex-1 grid-cols-2 content-start gap-1.5 p-1.5">
                {plantilla.widgets.map((s, i) => (
                    <span key={i} className={`h-5 rounded-sm border-l-[3px] border-accent bg-white ${WIDGET_META[s.w].ancho === 'full' ? 'col-span-2' : ''}`} />
                ))}
            </span>
        </span>
    );
}
