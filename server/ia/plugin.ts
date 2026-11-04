// Endpoints de IA montados dentro del servidor de Vite (npm run dev / npm run preview):
//   POST /api/ia/reporte   -> { texto }
//   POST /api/ia/disenar   -> { giro }
// Para producción, estos mismos handlers se pueden mover a una función serverless.

import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';
import type { Cuestionario } from '../../src/types';
import { IANoDisponible } from './cliente';
import { generarReporte } from './reporte';
import { disenarPanel } from './disenar';

const LIMITE_BYTES = 200_000;

function leerJson(req: IncomingMessage): Promise<unknown> {
    return new Promise((resolve, reject) => {
        let cuerpo = '';
        req.on('data', (parte: Buffer) => {
            cuerpo += parte;
            if (cuerpo.length > LIMITE_BYTES) reject(new Error('Petición demasiado grande'));
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(cuerpo || '{}'));
            } catch {
                reject(new Error('JSON inválido'));
            }
        });
        req.on('error', reject);
    });
}

function responder(res: ServerResponse, estado: number, datos: unknown) {
    res.statusCode = estado;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(datos));
}

async function manejar(req: IncomingMessage, res: ServerResponse) {
    if (req.method !== 'POST') return responder(res, 405, { error: 'Usa POST' });
    try {
        const cuerpo = await leerJson(req);
        if (req.url === '/reporte') return responder(res, 200, await generarReporte(cuerpo));
        if (req.url === '/disenar') {
            const c = cuerpo as Cuestionario;
            if (!c?.queVende || typeof c.queVende !== 'string') return responder(res, 400, { error: 'Falta "queVende"' });
            return responder(res, 200, await disenarPanel({
                queVende: c.queVende.slice(0, 300),
                canal: c.canal,
                salida: c.salida === 'consumo' ? 'consumo' : 'venta',
                datos: Array.isArray(c.datos) ? c.datos : [],
                prioridades: Array.isArray(c.prioridades) ? c.prioridades : [],
            }));
        }
        return responder(res, 404, { error: 'Ruta no encontrada' });
    } catch (error) {
        if (error instanceof IANoDisponible) return responder(res, 503, { error: 'ia-no-disponible', detalle: error.message });
        console.error('[IA]', error);
        return responder(res, 502, { error: 'ia-error' });
    }
}

export function iaPlugin(): Plugin {
    return {
        name: 'kiubo-ia',
        configureServer(server) {
            server.middlewares.use('/api/ia', (req, res) => void manejar(req, res));
        },
        configurePreviewServer(server) {
            server.middlewares.use('/api/ia', (req, res) => void manejar(req, res));
        },
    };
}
