// Acceso a datos. Por ahora todo vive en localStorage del navegador.
// Cuando exista un backend (Firebase, Supabase, API propia...), solo hay que
// reemplazar las funciones de este archivo; el resto de la app no cambia.

import type { Item, Movimiento, Negocio, Usuario } from '@/types';

const PREFIJO = 'kiubo.';
const PREFIJO_ANTERIOR = 'ecostock.';

// Una sola vez: pasa los datos guardados con el nombre anterior al nuevo, para no perder cuentas.
try {
    for (const clave of Object.keys(localStorage)) {
        if (!clave.startsWith(PREFIJO_ANTERIOR)) continue;
        const nueva = PREFIJO + clave.slice(PREFIJO_ANTERIOR.length);
        if (localStorage.getItem(nueva) === null) localStorage.setItem(nueva, localStorage.getItem(clave) ?? '');
        localStorage.removeItem(clave);
    }
} catch {
    // Sin acceso a localStorage no hay nada que migrar.
}

function leer<T>(clave: string, porDefecto: T): T {
    try {
        const valor = localStorage.getItem(PREFIJO + clave);
        return valor === null ? porDefecto : (JSON.parse(valor) as T);
    } catch {
        return porDefecto;
    }
}

function escribir(clave: string, valor: unknown): boolean {
    try {
        localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
        return true;
    } catch {
        return false;
    }
}

export const normalizarCorreo = (correo: string) => correo.trim().toLowerCase();

// No guardamos contraseñas en texto plano, aunque sea una demo.
async function hashPass(texto: string) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ---------- Cuentas y sesión ---------- */

export function existeCuenta(correo: string) {
    return Boolean(leer<Record<string, Usuario>>('usuarios', {})[normalizarCorreo(correo)]);
}

export async function verificarCredenciales(correo: string, pass: string) {
    const cuenta = leer<Record<string, Usuario>>('usuarios', {})[normalizarCorreo(correo)];
    return Boolean(cuenta) && cuenta.pass === (await hashPass(pass));
}

export async function crearCuenta(datos: {
    nombre: string;
    correo: string;
    pass: string;
    negocio: Negocio;
    items: Item[];
    movimientos: Movimiento[];
}) {
    const correo = normalizarCorreo(datos.correo);
    const usuarios = leer<Record<string, Usuario>>('usuarios', {});
    usuarios[correo] = { nombre: datos.nombre, pass: await hashPass(datos.pass) };
    return escribir('usuarios', usuarios)
        && guardarNegocio(correo, datos.negocio)
        && guardarItems(correo, datos.items)
        && guardarMovimientos(correo, datos.movimientos)
        && iniciarSesion(correo);
}

export const sesionActual = () => leer<string | null>('sesion', null);
export const iniciarSesion = (correo: string) => escribir('sesion', normalizarCorreo(correo));

export function cerrarSesion() {
    try {
        localStorage.removeItem(PREFIJO + 'sesion');
    } catch {
        // Sin acceso a localStorage no hay sesión que cerrar.
    }
}

/* ---------- Negocio e inventario ---------- */

export const cargarNegocio = (correo: string) => leer<Negocio | null>(`negocio:${correo}`, null);
export const guardarNegocio = (correo: string, negocio: Negocio) => escribir(`negocio:${correo}`, negocio);

export const cargarItems = (correo: string) => leer<Item[]>(`items:${correo}`, []);
export const guardarItems = (correo: string, items: Item[]) => escribir(`items:${correo}`, items);

// Solo guardamos los últimos 90 días de movimientos para no llenar el almacenamiento del navegador.
export const cargarMovimientos = (correo: string) => leer<Movimiento[]>(`movimientos:${correo}`, []);
export function guardarMovimientos(correo: string, movimientos: Movimiento[]) {
    const limite = Date.now() - 90 * 86400000;
    return escribir(`movimientos:${correo}`, movimientos.filter(m => new Date(m.fecha).getTime() >= limite));
}
