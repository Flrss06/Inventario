import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
    titulo: string;
    onCerrar: () => void;
    children: ReactNode;
}

/** Ventana modal nativa (<dialog>). Se abre al montarse; para cerrarla, deja de renderizarla. */
export function Modal({ titulo, onCerrar, children }: Props) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (dialog && !dialog.open) dialog.showModal();
    }, []);

    return (
        <dialog
            ref={ref}
            onClose={onCerrar}
            onClick={e => e.target === ref.current && onCerrar()}
            className="m-auto w-[calc(100%-2rem)] max-w-3xl bg-transparent backdrop:bg-slate-900/55"
        >
            <div className="relative max-h-[calc(100vh-4rem)] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8">
                <button
                    type="button"
                    onClick={onCerrar}
                    aria-label="Cerrar"
                    className="absolute top-4 right-4 grid size-8 cursor-pointer place-items-center rounded-md text-muted hover:bg-slate-100 hover:text-ink"
                >
                    <i className="bi bi-x-lg" />
                </button>
                <h2 className="mb-1 pr-10 text-2xl font-bold text-ink">{titulo}</h2>
                {children}
            </div>
        </dialog>
    );
}
