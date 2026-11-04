// Cliente de Claude compartido por los endpoints de IA.
// La clave se lee de ANTHROPIC_API_KEY (archivo .env.local) y nunca llega al navegador.

import Anthropic from '@anthropic-ai/sdk';

export const MODELO = 'claude-opus-5-5';

/** La IA no está configurada (sin clave) o no pudo responder; el navegador usa el análisis local. */
export class IANoDisponible extends Error {}

let cliente: Anthropic | null = null;

function obtenerCliente() {
    if (!cliente) {
        try {
            cliente = new Anthropic();
        } catch {
            throw new IANoDisponible('Falta configurar ANTHROPIC_API_KEY');
        }
    }
    return cliente;
}

interface Pedido {
    system: string;
    mensaje: string;
    esfuerzo: 'low' | 'medium' | 'high';
    /** JSON Schema: si se pasa, Claude responde JSON que lo cumple. */
    esquema?: Record<string, unknown>;
}

export async function pedirAClaude({ system, mensaje, esfuerzo, esquema }: Pedido): Promise<string> {
    let respuesta: Anthropic.Beta.BetaMessage;
    try {
        respuesta = await obtenerCliente().beta.messages.create({
            model: MODELO,
            max_tokens: 16000,
            // Si un filtro de seguridad rechaza la petición por error, la API la reintenta con otro modelo.
            betas: ['server-side-fallback-2026-07-01'],
            fallbacks: 'default',
            system,
            messages: [{ role: 'user', content: mensaje }],
            output_config: { effort: esfuerzo, ...(esquema ? { format: { type: 'json_schema', schema: esquema } } : {}) },
        });
    } catch (error) {
        if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
            throw new IANoDisponible('La clave de Anthropic no es válida');
        }
        // Sin conexión, o el SDK no encontró credenciales: no es un error de la API, la IA simplemente no está disponible.
        if (!(error instanceof Anthropic.APIError) || error.status === undefined) {
            throw new IANoDisponible(error instanceof Error ? error.message : 'IA no disponible');
        }
        throw error;
    }

    if (respuesta.stop_reason === 'refusal') throw new IANoDisponible('Claude no pudo responder esta petición');
    const texto = respuesta.content.flatMap(b => (b.type === 'text' ? [b.text] : [])).join('');
    if (!texto) throw new IANoDisponible('Respuesta vacía');
    return texto;
}
