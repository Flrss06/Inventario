import type { CSSProperties, ReactNode } from 'react';

interface Props {
    name: string;
    value: string;
    color: string;
    defaultChecked?: boolean;
    required?: boolean;
    children: ReactNode;
}

/** Tarjeta seleccionable que funciona como un radio button. */
export function OpcionCard({ name, value, color, defaultChecked, required, children }: Props) {
    return (
        <label
            style={{ '--accent': color } as CSSProperties}
            className="relative flex cursor-pointer flex-col gap-1 rounded-2xl border-2 border-slate-200 p-4 transition hover:border-slate-300 has-checked:border-accent has-checked:bg-accent/5 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
        >
            <input type="radio" name={name} value={value} defaultChecked={defaultChecked} required={required} className="absolute top-4 right-4 opacity-0" />
            {children}
        </label>
    );
}
