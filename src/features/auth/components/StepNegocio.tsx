import type { FormEvent } from 'react';
import type { GiroId } from '@/types';
import { Button } from '@/components/ui/Button';
import { Field, claseInput } from '@/components/ui/Field';
import { LISTA_GIROS } from '@/giros';
import { OpcionCard } from './OpcionCard';

export interface DatosNegocio {
    empresa: string;
    descripcion: string;
    tipo: GiroId;
}

interface Props {
    inicial?: Partial<DatosNegocio>;
    onListo: (datos: DatosNegocio) => void;
    onAtras: () => void;
}

export function StepNegocio({ inicial, onListo, onAtras }: Props) {
    function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        onListo({
            empresa: String(f.get('empresa')).trim(),
            descripcion: String(f.get('descripcion')).trim(),
            tipo: f.get('tipo') as GiroId,
        });
    }

    return (
        <form onSubmit={enviar}>
            <Field label="Nombre de tu empresa">
                <input name="empresa" type="text" autoComplete="organization" required autoFocus defaultValue={inicial?.empresa} className={claseInput} />
            </Field>
            <Field label="¿Qué hace tu negocio?">
                <textarea
                    name="descripcion"
                    rows={3}
                    defaultValue={inicial?.descripcion}
                    placeholder="Ej. Vendemos tenis deportivos y casuales en el centro de la ciudad."
                    className={claseInput}
                />
            </Field>

            <p className="mb-2.5 text-sm font-semibold text-ink">¿Qué tipo de negocio es?</p>
            <div className="mb-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {LISTA_GIROS.map(giro => (
                    <OpcionCard key={giro.id} name="tipo" value={giro.id} color={giro.color} required defaultChecked={giro.id === inicial?.tipo}>
                        <i className={`bi ${giro.icono} text-2xl text-accent`} />
                        <strong className="text-ink">{giro.nombre}</strong>
                        <small className="text-xs leading-snug text-muted">{giro.descripcion}</small>
                    </OpcionCard>
                ))}
            </div>

            <div className="flex justify-between gap-3">
                <Button variante="secondary" onClick={onAtras}><i className="bi bi-arrow-left" /> Atrás</Button>
                <Button type="submit">Continuar <i className="bi bi-arrow-right" /></Button>
            </div>
        </form>
    );
}
