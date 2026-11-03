import type { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, claseInput } from '@/components/ui/Field';

export interface DatosCuenta {
    nombre: string;
    correo: string;
    pass: string;
}

export function StepCuenta({ inicial, onListo }: { inicial?: DatosCuenta; onListo: (datos: DatosCuenta) => void }) {
    function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        onListo({ nombre: String(f.get('nombre')).trim(), correo: String(f.get('correo')).trim(), pass: String(f.get('pass')) });
    }

    return (
        <form onSubmit={enviar}>
            <Field label="Tu nombre">
                <input name="nombre" type="text" autoComplete="name" required autoFocus defaultValue={inicial?.nombre} className={claseInput} />
            </Field>
            <Field label="Correo electrónico">
                <input name="correo" type="email" autoComplete="email" required defaultValue={inicial?.correo} className={claseInput} />
            </Field>
            <Field label="Contraseña">
                <input name="pass" type="password" minLength={6} autoComplete="new-password" required defaultValue={inicial?.pass} className={claseInput} />
            </Field>
            <div className="mt-2 flex justify-end">
                <Button type="submit">Continuar <i className="bi bi-arrow-right" /></Button>
            </div>
        </form>
    );
}
