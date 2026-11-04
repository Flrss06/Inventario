import { useId } from 'react';
import { Link } from 'react-router-dom';

/** El cubo de Kiubo: tres caras en violeta y cian. */
export function LogoCubo({ className = 'size-8' }: { className?: string }) {
    const id = useId();
    return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden>
            <defs>
                <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#a78bfa" />
                    <stop offset="1" stopColor="#7c5cff" />
                </linearGradient>
                <linearGradient id={`${id}-b`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#6c47ff" />
                    <stop offset="1" stopColor="#4c2ed9" />
                </linearGradient>
                <linearGradient id={`${id}-c`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#22d3ee" />
                    <stop offset="1" stopColor="#0ea5e9" />
                </linearGradient>
            </defs>
            <path d="M32 5 57 19 32 33 7 19Z" fill={`url(#${id}-a)`} />
            <path d="M7 19 32 33v26L7 45Z" fill={`url(#${id}-b)`} />
            <path d="M57 19 32 33v26l25-14Z" fill={`url(#${id}-c)`} />
            <path d="M32 33v26M7 19l25 14 25-14" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.2" />
        </svg>
    );
}

export function Logo({ claro = false, className = '' }: { claro?: boolean; className?: string }) {
    return (
        <Link to="/" className={`group flex items-center gap-2 text-2xl font-extrabold tracking-tight ${claro ? 'text-white' : 'text-ink'} ${className}`}>
            <LogoCubo className="size-8 transition duration-500 group-hover:rotate-[20deg]" />
            Kiubo
        </Link>
    );
}
