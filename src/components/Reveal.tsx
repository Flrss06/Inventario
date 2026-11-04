import { useEffect, useRef, type ReactNode } from 'react';

/** Hace aparecer su contenido con una animación suave cuando entra en pantalla. */
export function Reveal({ children, retraso = 0, className = '' }: { children: ReactNode; retraso?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entrada]) => {
                if (entrada.isIntersecting) {
                    el.classList.add('visible');
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className={`revelar ${className}`} style={{ transitionDelay: `${retraso}ms` }}>
            {children}
        </div>
    );
}
