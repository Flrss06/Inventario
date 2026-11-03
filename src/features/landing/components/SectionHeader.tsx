export function SectionHeader({ titulo, texto }: { titulo: string; texto: string }) {
    return (
        <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-ink">{titulo}</h2>
            <p className="text-muted">{texto}</p>
        </div>
    );
}
