import type { ReactNode } from 'react';

/** Convierte **negritas** en <strong>. */
function enLinea(texto: string): ReactNode[] {
    return texto.split(/(\*\*[^*]+\*\*)/g).map((parte, i) =>
        parte.startsWith('**') && parte.endsWith('**') ? <strong key={i} className="text-ink">{parte.slice(2, -2)}</strong> : parte,
    );
}

/** Muestra el reporte del asistente: títulos con "## ", viñetas con "- " y párrafos. */
export function TextoIA({ texto }: { texto: string }) {
    const bloques: ReactNode[] = [];
    let vinetas: string[] = [];

    const cerrarLista = () => {
        if (!vinetas.length) return;
        bloques.push(
            <ul key={`ul-${bloques.length}`} className="mb-4 flex flex-col gap-1.5">
                {vinetas.map((v, i) => (
                    <li key={i} className="flex gap-2">
                        <i className="bi bi-dot -mx-1 text-xl leading-5 text-accent" />
                        <span>{enLinea(v)}</span>
                    </li>
                ))}
            </ul>,
        );
        vinetas = [];
    };

    for (const linea of texto.split('\n').map(l => l.trim())) {
        if (!linea) continue;
        if (/^[-*•]\s+/.test(linea)) {
            vinetas.push(linea.replace(/^[-*•]\s+/, ''));
            continue;
        }
        cerrarLista();
        if (linea.startsWith('#')) {
            bloques.push(<h4 key={bloques.length} className="mt-5 mb-2 font-bold text-ink first:mt-0">{linea.replace(/^#+\s*/, '')}</h4>);
        } else {
            bloques.push(<p key={bloques.length} className="mb-3">{enLinea(linea)}</p>);
        }
    }
    cerrarLista();

    return <div className="text-sm leading-relaxed">{bloques}</div>;
}
