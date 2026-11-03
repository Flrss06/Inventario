import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

type Variante = 'primary' | 'secondary' | 'ghost';
type Tamano = 'sm' | 'md' | 'lg';

interface Estilo {
    variante?: Variante;
    tamano?: Tamano;
    bloque?: boolean;
}

const VARIANTES: Record<Variante, string> = {
    primary: 'bg-accent text-white hover:-translate-y-0.5 hover:brightness-90 hover:shadow-lg hover:shadow-accent/25',
    secondary: 'border border-slate-300 bg-white text-ink hover:bg-slate-100',
    ghost: 'text-body hover:text-accent',
};

const TAMANOS: Record<Tamano, string> = {
    sm: 'px-3.5 py-2 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-[0.95rem] rounded-lg',
    lg: 'px-7 py-3.5 text-base rounded-2xl',
};

/** Clases de botón, por si necesitas aplicarlas a un <a> u otro elemento. */
export function clasesBoton({ variante = 'primary', tamano = 'md', bloque = false }: Estilo = {}) {
    return [
        'inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0',
        VARIANTES[variante],
        TAMANOS[tamano],
        bloque ? 'w-full' : '',
    ].join(' ');
}

export function Button({ variante, tamano, bloque, className = '', type = 'button', ...props }: Estilo & ButtonHTMLAttributes<HTMLButtonElement>) {
    return <button type={type} className={`${clasesBoton({ variante, tamano, bloque })} ${className}`} {...props} />;
}

export function ButtonLink({ variante, tamano, bloque, className = '', ...props }: Estilo & LinkProps) {
    return <Link className={`${clasesBoton({ variante, tamano, bloque })} ${className}`} {...props} />;
}
