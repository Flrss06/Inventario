export function SectionHeader({ etiqueta, titulo, texto }: { etiqueta?: string; titulo: string; texto: string }) {
    return (
        <div className="mx-auto mb-14 max-w-2xl text-center">
            {etiqueta && <span className="mb-3 inline-block text-sm font-bold tracking-wider text-primary uppercase">{etiqueta}</span>}
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{titulo}</h2>
            <p className="text-lg text-muted">{texto}</p>
        </div>
    );
}
