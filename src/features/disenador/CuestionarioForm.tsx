import type { FormEvent, ReactNode } from 'react';
import type { Cuestionario, Prioridad } from '@/types';
import { Button } from '@/components/ui/Button';
import { Field, claseInput } from '@/components/ui/Field';
import { CAMPOS_OPCIONALES, PRIORIDADES } from '@/giros/personalizado';

interface Props {
    inicial?: Partial<Cuestionario>;
    onListo: (c: Cuestionario) => void;
    /** Botón "Atrás" o "Cancelar" a la izquierda. */
    secundario?: ReactNode;
}

const CANALES: { id: Cuestionario['canal']; label: string; icono: string }[] = [
    { id: 'fisica', label: 'Tienda física', icono: 'bi-shop-window' },
    { id: 'online', label: 'En línea', icono: 'bi-globe2' },
    { id: 'ambas', label: 'Las dos', icono: 'bi-arrow-left-right' },
];

const SALIDAS: { id: Cuestionario['salida']; label: string; ejemplo: string; icono: string }[] = [
    { id: 'venta', label: 'Los vendo tal cual', ejemplo: 'Tiendas: lo que compro es lo que vendo.', icono: 'bi-bag-check' },
    { id: 'consumo', label: 'Los uso para preparar o dar un servicio', ejemplo: 'Restaurantes, talleres, salones: uso insumos.', icono: 'bi-tools' },
];

const claseChip =
    'flex cursor-pointer items-center gap-2 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm transition hover:border-slate-300 has-checked:border-accent has-checked:bg-accent/5 has-checked:text-ink has-focus-visible:outline-2 has-focus-visible:outline-accent';

/** Mini cuestionario para que la IA entienda el negocio y diseñe su panel. */
export function CuestionarioForm({ inicial, onListo, secundario }: Props) {
    function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        onListo({
            queVende: String(f.get('queVende')).trim(),
            canal: (f.get('canal') as Cuestionario['canal']) ?? 'fisica',
            salida: (f.get('salida') as Cuestionario['salida']) ?? 'venta',
            datos: f.getAll('datos').map(String),
            prioridades: f.getAll('prioridades').map(String) as Prioridad[],
        });
    }

    return (
        <form onSubmit={enviar}>
            <Field label="¿Qué vendes exactamente?">
                <textarea
                    name="queVende"
                    rows={2}
                    required
                    minLength={3}
                    autoFocus
                    defaultValue={inicial?.queVende}
                    placeholder="Ej. Somos una tienda física de videojuegos: juegos nuevos y usados, consolas y controles."
                    className={claseInput}
                />
            </Field>

            <fieldset className="mb-5">
                <legend className="mb-2 text-sm font-semibold text-ink">¿Qué haces con tus productos?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                    {SALIDAS.map(s => (
                        <label key={s.id} className={`${claseChip} items-start`}>
                            <input type="radio" name="salida" value={s.id} defaultChecked={(inicial?.salida ?? 'venta') === s.id} className="sr-only" />
                            <i className={`bi ${s.icono} mt-0.5 text-accent`} />
                            <span><strong className="block text-ink">{s.label}</strong><small className="text-xs text-muted">{s.ejemplo}</small></span>
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className="mb-5">
                <legend className="mb-2 text-sm font-semibold text-ink">¿Dónde atiendes a tus clientes?</legend>
                <div className="grid grid-cols-3 gap-2">
                    {CANALES.map(c => (
                        <label key={c.id} className={`${claseChip} justify-center`}>
                            <input type="radio" name="canal" value={c.id} defaultChecked={(inicial?.canal ?? 'fisica') === c.id} className="sr-only" />
                            <i className={`bi ${c.icono} text-accent`} /> {c.label}
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className="mb-5">
                <legend className="mb-2 text-sm font-semibold text-ink">
                    ¿Qué datos quieres guardar de cada producto? <span className="font-normal text-muted">(nombre, cantidad y precio ya van incluidos)</span>
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {CAMPOS_OPCIONALES.map(c => (
                        <label key={c.key} className={claseChip} title={c.descripcion}>
                            <input type="checkbox" name="datos" value={c.key} defaultChecked={inicial?.datos?.includes(c.key)} className="sr-only" />
                            <i className="bi bi-check2-square text-accent" /> {c.label}
                        </label>
                    ))}
                </div>
            </fieldset>

            <fieldset className="mb-6">
                <legend className="mb-2 text-sm font-semibold text-ink">¿Qué es lo que más te importa controlar?</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                    {PRIORIDADES.map(p => (
                        <label key={p.id} className={claseChip}>
                            <input type="checkbox" name="prioridades" value={p.id} defaultChecked={inicial?.prioridades?.includes(p.id) ?? p.id !== 'tallas'} className="sr-only" />
                            <i className={`bi ${p.icono} text-accent`} /> {p.label}
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="flex justify-between gap-3">
                {secundario ?? <span />}
                <Button type="submit">
                    <i className="bi bi-stars" /> Diseñar mi panel
                </Button>
            </div>
        </form>
    );
}
