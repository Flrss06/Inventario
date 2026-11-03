// Utilidades compartidas: guardado en el navegador, sesión y ayudas para texto.
// Mientras no haya servidor, todo vive en localStorage de este navegador.

const PREFIJO = 'ecostock.';

const Store = {
    get(clave, porDefecto = null) {
        try {
            const valor = localStorage.getItem(PREFIJO + clave);
            return valor === null ? porDefecto : JSON.parse(valor);
        } catch {
            return porDefecto;
        }
    },
    set(clave, valor) {
        try {
            localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
            return true;
        } catch {
            return false;
        }
    },
    sesion() {
        return this.get('sesion');
    },
    iniciarSesion(correo) {
        return this.set('sesion', correo);
    },
    cerrarSesion() {
        try { localStorage.removeItem(PREFIJO + 'sesion'); } catch { }
    },
};

// No guardamos contraseñas en texto plano, aunque sea una demo.
async function hashPass(texto) {
    if (window.crypto?.subtle) {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
        return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 5381;
    for (const c of texto) h = ((h << 5) + h + c.codePointAt(0)) | 0;
    return 'x' + (h >>> 0).toString(16);
}

function nuevoId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function esc(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
