// Registro en 3 pasos: cuenta, datos del negocio y elección de plantilla.

const pasos = [...document.querySelectorAll('.paso')];
const marcas = [...document.querySelectorAll('.pasos-nav li')];
const error = document.getElementById('error');
const datos = {};

function irA(n) {
    pasos.forEach((p, i) => p.hidden = i !== n);
    marcas.forEach((m, i) => {
        m.classList.toggle('activo', i === n);
        m.classList.toggle('hecho', i < n);
    });
    error.hidden = true;
    pasos[n].querySelector('input:not([type=radio]), textarea')?.focus();
}

function mostrarError(msg) {
    error.textContent = msg;
    error.hidden = false;
}

// Si viene desde una tarjeta de giro del inicio (register.html?tipo=ropa), lo dejamos marcado.
const tipoInicial = new URLSearchParams(location.search).get('tipo');
document.getElementById('tipos').innerHTML = Object.entries(TIPOS).map(([id, t]) => `
    <label class="opcion" style="--c:${t.color}">
        <input type="radio" name="tipo" value="${id}" required ${id === tipoInicial ? 'checked' : ''}>
        <i class="bi ${t.icono}"></i>
        <strong>${t.nombre}</strong>
        <small>${t.descripcion}</small>
    </label>`).join('');

function pintarPlantillas() {
    const t = TIPOS[datos.tipo];
    document.getElementById('plantillas').innerHTML = Object.entries(t.plantillas).map(([id, p], i) => `
        <label class="opcion" style="--c:${t.color}">
            <input type="radio" name="plantilla" value="${id}" ${i === 0 ? 'checked' : ''}>
            ${vistaPrevia(p)}
            <strong>${p.nombre}</strong>
            <small>${p.descripcion}</small>
        </label>`).join('');
}

pasos[0].addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const correo = String(f.get('correo')).trim().toLowerCase();
    if (Store.get('usuarios', {})[correo]) {
        return mostrarError('Ya existe una cuenta con ese correo. Inicia sesión para entrar a tu panel.');
    }
    Object.assign(datos, { nombre: String(f.get('nombre')).trim(), correo, pass: f.get('pass') });
    irA(1);
});

pasos[1].addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    Object.assign(datos, {
        empresa: String(f.get('empresa')).trim(),
        descripcion: String(f.get('descripcion')).trim(),
        tipo: f.get('tipo'),
    });
    pintarPlantillas();
    irA(2);
});

pasos[2].addEventListener('submit', async e => {
    e.preventDefault();
    const plantilla = new FormData(e.target).get('plantilla');
    const usuarios = Store.get('usuarios', {});
    usuarios[datos.correo] = { nombre: datos.nombre, pass: await hashPass(datos.pass) };

    const negocio = {
        nombre: datos.empresa,
        descripcion: datos.descripcion,
        tipo: datos.tipo,
        plantilla,
        plan: 'gratis',
        solicitudes: [],
        creado: new Date().toISOString(),
    };
    // Cargamos productos de ejemplo para que el panel no aparezca vacío la primera vez.
    const ejemplos = TIPOS[datos.tipo].ejemplos().map(i => ({ ...i, id: nuevoId(), ejemplo: true }));

    const ok = Store.set('usuarios', usuarios)
        && Store.set('negocio:' + datos.correo, negocio)
        && Store.set('items:' + datos.correo, ejemplos)
        && Store.iniciarSesion(datos.correo);
    if (!ok) return mostrarError('Tu navegador no permite guardar datos. Revisa que no estés en una ventana privada.');
    location.href = 'dashboard.html';
});

document.querySelectorAll('[data-atras]').forEach(b => {
    b.addEventListener('click', () => irA(pasos.indexOf(b.closest('.paso')) - 1));
});

irA(0);
