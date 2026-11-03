import type { FormEvent } from 'react';
import type { Campo, Item, ItemDatos, ValorCampo } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field, claseInput } from '@/components/ui/Field';
import { useDashboard } from '../context/DashboardContext';

const esNumerico = (c: Campo) => c.type === 'number' || c.type === 'money';

function Entrada({ campo, valor, minimo }: { campo: Campo; valor: unknown; minimo: number }) {
    const defaultValue = valor == null ? '' : String(valor);
    if (campo.type === 'select') {
        return (
            <select name={campo.key} required={campo.required} defaultValue={defaultValue} className={claseInput}>
                <option value="">Selecciona...</option>
                {campo.options?.map(o => <option key={o}>{o}</option>)}
            </select>
        );
    }
    return (
        <input
            name={campo.key}
            type={esNumerico(campo) ? 'number' : campo.type}
            min={esNumerico(campo) ? 0 : undefined}
            step={campo.type === 'money' ? '0.01' : esNumerico(campo) ? 'any' : undefined}
            placeholder={campo.key === 'minimo' ? String(minimo) : undefined}
            required={campo.required}
            defaultValue={defaultValue}
            className={claseInput}
        />
    );
}

/** Formulario para agregar o editar un producto. Los campos salen del giro. */
export function ItemFormModal({ item }: { item?: Item }) {
    const { giro, guardarItem, cerrar } = useDashboard();

    function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const datos: Record<string, ValorCampo> = {};
        for (const campo of giro.campos) {
            const crudo = String(f.get(campo.key) ?? '').trim();
            datos[campo.key] = esNumerico(campo) && crudo !== '' ? Number(crudo) : crudo;
        }
        guardarItem(datos as ItemDatos, item?.id);
        cerrar();
    }

    return (
        <Modal titulo={item ? 'Editar producto' : 'Agregar producto'} onCerrar={cerrar}>
            <form onSubmit={enviar} className="mt-5 grid gap-x-4 sm:grid-cols-2">
                {giro.campos.map(campo => (
                    <Field key={campo.key} label={`${campo.label}${campo.required ? ' *' : ''}`}>
                        <Entrada campo={campo} valor={item?.[campo.key]} minimo={giro.minimo} />
                    </Field>
                ))}
                <div className="flex justify-end gap-3 sm:col-span-2">
                    <Button variante="secondary" onClick={cerrar}>Cancelar</Button>
                    <Button type="submit">Guardar</Button>
                </div>
            </form>
        </Modal>
    );
}
