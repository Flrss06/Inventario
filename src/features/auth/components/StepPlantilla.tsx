import type { FormEvent } from 'react';
import type { Giro, PlantillaId } from '@/types';
import { Button } from '@/components/ui/Button';
import { OpcionCard } from '@/components/OpcionCard';
import { PlantillaPreview } from '@/components/PlantillaPreview';

interface Props {
    giro: Giro;
    onListo: (plantilla: PlantillaId) => void;
    onAtras: () => void;
}

export function StepPlantilla({ giro, onListo, onAtras }: Props) {
    function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onListo(new FormData(e.currentTarget).get('plantilla') as PlantillaId);
    }

    return (
        <form onSubmit={enviar} className="animate-entrada">
            <p className="text-sm text-muted">
                Preparamos dos plantillas para tu giro. Puedes cambiar entre ellas cuando quieras desde tu panel.
            </p>
            <div className="my-4 mb-6 grid gap-3 sm:grid-cols-2">
                {Object.entries(giro.plantillas).map(([id, plantilla], i) => (
                    <OpcionCard key={id} name="plantilla" value={id} color={giro.color} defaultChecked={i === 0}>
                        <PlantillaPreview plantilla={plantilla} />
                        <strong className="text-ink">{plantilla.nombre}</strong>
                        <small className="text-xs leading-snug text-muted">{plantilla.descripcion}</small>
                    </OpcionCard>
                ))}
            </div>

            <div className="flex justify-between gap-3">
                <Button variante="secondary" onClick={onAtras}><i className="bi bi-arrow-left" /> Atrás</Button>
                <Button type="submit">Entrar a mi panel <i className="bi bi-arrow-right" /></Button>
            </div>
        </form>
    );
}
