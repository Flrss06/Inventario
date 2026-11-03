// Formato de números, dinero y fechas, más utilidades pequeñas.

export const dinero = (n: unknown) =>
    Number(n || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

export const num = (n: unknown) => Number(n || 0).toLocaleString('es-MX');

export const estaVacio = (v: unknown) => v === '' || v == null;

export function fecha(iso?: string) {
    if (!iso) return '—';
    return new Date(iso + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Días que faltan para una fecha (negativo si ya pasó). */
export function diasPara(iso: string) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return Math.round((new Date(iso + 'T00:00:00').getTime() - hoy.getTime()) / 86400000);
}

/** Fecha en formato AAAA-MM-DD a n días de hoy. */
export function enDias(n: number) {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function nuevoId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
