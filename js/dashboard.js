// Panel del negocio: arma la plantilla elegida según el giro y maneja el inventario.

const correo = Store.sesion();
const negocio = correo ? Store.get('negocio:' + correo) : null;
const tipo = negocio ? (TIPOS[negocio.tipo] || TIPOS.general) : null;
let items = negocio ? Store.get('items:' + correo, []) : [];

const app = document.getElementById('app');
const modal = document.getElementById('modal');
let trasElegirPlan = null;

function guardar() {
    Store.set('negocio:' + correo, negocio);
    Store.set('items:' + correo, items);
}

/* ---------- Ayudas ---------- */

const dinero = n => Number(n || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
const num = n => Number(n || 0).toLocaleString('es-MX');
const vacioCampo = v => v === '' || v == null;

function fecha(iso) {
    return iso ? new Date(iso + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
}

function diasPara(iso) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return Math.round((new Date(iso + 'T00:00:00') - hoy) / 86400000);
}

const cantidadDe = i => Number(i.cantidad) || 0;
const minimoDe = i => vacioCampo(i.minimo) ? tipo.minimo : Number(i.minimo);
const subtitulo = i => tipo.subtitulo.map(k => i[k]).filter(Boolean).join(' · ');
const campo = key => tipo.campos.find(c => c.key === key);
const planActual = () => PLANES.find(p => p.id === negocio.plan) || PLANES[0];

function alertasDe(i) {
    const out = [];
    const cant = cantidadDe(i);
    if (cant === 0) out.push({ nivel: 'alta', texto: 'Agotado' });
    else if (cant <= minimoDe(i)) out.push({ nivel: 'media', texto: `Quedan ${num(cant)}` });
    if (tipo.caducidad && i.caducidad) {
        const d = diasPara(i.caducidad);
        if (d < 0) out.push({ nivel: 'alta', texto: `Caducó hace ${-d} ${d === -1 ? 'día' : 'días'}` });
        else if (d === 0) out.push({ nivel: 'alta', texto: 'Caduca hoy' });
        else if (d <= 7) out.push({ nivel: d <= 3 ? 'alta' : 'media', texto: `Caduca en ${d} ${d === 1 ? 'día' : 'días'}` });
    }
    return out;
}

const chips = alertas => alertas.map(a => `<span class="chip ${a.nivel}">${esc(a.texto)}</span>`).join('');
const todoBien = msg => `<p class="ok"><i class="bi bi-check-circle-fill"></i> ${msg}</p>`;

function vacio(msg = 'Aún no tienes productos registrados.') {
    return `<div class="vacio"><i class="bi bi-inbox"></i><p>${msg}</p><button class="btn btn-primary btn-sm" data-action="agregar"><i class="bi bi-plus-lg"></i> Agregar producto</button></div>`;
}

/* ---------- Indicadores ---------- */

const KPIS = {
    unidades: { label: 'Unidades', icono: 'bi-boxes', calc: () => num(items.reduce((s, i) => s + cantidadDe(i), 0)) },
    productos: { label: 'Productos registrados', icono: 'bi-tags', calc: () => num(items.length) },
    modelos: { label: 'Modelos distintos', icono: 'bi-collection', calc: () => num(new Set(items.map(i => i.nombre)).size) },
    bajoStock: { label: 'Con poco stock', icono: 'bi-exclamation-triangle', tono: 'warn', calc: () => items.filter(i => cantidadDe(i) > 0 && cantidadDe(i) <= minimoDe(i)).length },
    agotados: { label: 'Agotados', icono: 'bi-x-octagon', tono: 'danger', calc: () => items.filter(i => cantidadDe(i) === 0).length },
    porCaducar: { label: 'Caducan en 7 días', icono: 'bi-hourglass-split', tono: 'warn', calc: () => items.filter(i => i.caducidad && diasPara(i.caducidad) >= 0 && diasPara(i.caducidad) <= 7).length },
    caducados: { label: 'Caducados', icono: 'bi-calendar-x', tono: 'danger', calc: () => items.filter(i => i.caducidad && diasPara(i.caducidad) < 0).length },
    valor: { label: 'Valor del inventario', icono: 'bi-cash-stack', calc: () => dinero(items.reduce((s, i) => s + cantidadDe(i) * (Number(i.precio) || 0), 0)) },
};

/* ---------- Apartados del panel ---------- */

function textoBusqueda(i) {
    return esc(tipo.campos.map(c => i[c.key] ?? '').join(' ').toLowerCase());
}

function contador(i) {
    return `<span class="qty">
        <button data-action="restar" data-id="${esc(i.id)}" aria-label="Quitar uno">−</button>
        <span>${num(cantidadDe(i))}${i.unidad ? ` <small>${esc(i.unidad)}</small>` : ''}</span>
        <button data-action="sumar" data-id="${esc(i.id)}" aria-label="Agregar uno">+</button>
    </span>`;
}

function botonesItem(i) {
    return `<button class="icon-btn" data-action="editar" data-id="${esc(i.id)}" aria-label="Editar ${esc(i.nombre)}"><i class="bi bi-pencil"></i></button>`
        + `<button class="icon-btn danger" data-action="borrar" data-id="${esc(i.id)}" aria-label="Borrar ${esc(i.nombre)}"><i class="bi bi-trash"></i></button>`;
}

function celda(c, i) {
    const v = i[c.key];
    if (c.key === 'nombre') return `<strong>${esc(v)}</strong><div>${chips(alertasDe(i))}</div>`;
    if (c.key === 'cantidad') return contador(i);
    if (vacioCampo(v)) return '<span class="muted">—</span>';
    if (c.type === 'money') return dinero(v);
    if (c.type === 'date') return fecha(v);
    return esc(v);
}

function vistaKpis() {
    return `<div class="kpis">${tipo.kpis.map(id => {
        const k = KPIS[id];
        const v = k.calc();
        const tono = k.tono && typeof v === 'number' && v > 0 ? k.tono : '';
        return `<div class="kpi ${tono}"><i class="bi ${k.icono}"></i><div><strong>${v}</strong><span>${esc(tipo.etiquetas?.[id] || k.label)}</span></div></div>`;
    }).join('')}</div>`;
}

function vistaTabla() {
    if (!items.length) return vacio();
    const cols = tipo.campos.filter(c => c.tabla !== false);
    const filas = items.map(i => `<tr data-texto="${textoBusqueda(i)}">
        ${cols.map(c => `<td>${celda(c, i)}</td>`).join('')}
        <td class="acciones">${botonesItem(i)}</td>
    </tr>`).join('');
    return `<div class="table-wrap"><table>
        <thead><tr>${cols.map(c => `<th>${esc(c.label)}</th>`).join('')}<th><span class="sr-only">Acciones</span></th></tr></thead>
        <tbody>${filas}</tbody>
    </table></div>`;
}

function vistaTarjetas() {
    if (!items.length) return vacio();
    return `<div class="cards">${items.map(i => `
        <article class="item-card" data-texto="${textoBusqueda(i)}">
            <div class="acc">${botonesItem(i)}</div>
            <h4>${esc(i.nombre)}</h4>
            <p class="muted">${esc(subtitulo(i)) || '&nbsp;'}</p>
            <div>${chips(alertasDe(i))}</div>
            <div class="item-bottom">
                <span class="precio">${vacioCampo(i.precio) ? '' : dinero(i.precio)}</span>
                ${contador(i)}
            </div>
        </article>`).join('')}</div>`;
}

function vistaAlertas() {
    const lista = items
        .flatMap(i => alertasDe(i).map(a => ({ ...a, i })))
        .sort((a, b) => (a.nivel === 'alta' ? 0 : 1) - (b.nivel === 'alta' ? 0 : 1));
    if (!lista.length) return todoBien('Todo en orden, no hay alertas.');
    const max = 6;
    return `<ul class="lista">${lista.slice(0, max).map(a => `
        <li><span class="dot ${a.nivel}"></span><div>
            <strong>${esc(a.i.nombre)}</strong> <span class="muted">${esc(subtitulo(a.i))}</span>
            <div>${esc(a.texto)}</div>
        </div></li>`).join('')}</ul>
        ${lista.length > max ? `<p class="muted mas">y ${lista.length - max} alertas más</p>` : ''}`;
}

function vistaBajoStock() {
    const proporcion = i => cantidadDe(i) / (minimoDe(i) || 1);
    const lista = items
        .filter(i => cantidadDe(i) <= minimoDe(i) * 2)
        .sort((a, b) => proporcion(a) - proporcion(b))
        .slice(0, 6);
    if (!lista.length) return todoBien('Tienes suficiente de todo.');
    return `<div class="barras">${lista.map(i => {
        const cant = cantidadDe(i);
        const min = minimoDe(i);
        const pct = Math.min(100, Math.round(cant / ((min || 1) * 2) * 100));
        const nivel = cant === 0 ? 'alta' : cant <= min ? 'media' : '';
        return `<div>
            <div class="barra-top"><span><strong>${esc(i.nombre)}</strong> <span class="muted">${esc(subtitulo(i))}</span></span><span>${num(cant)} / mín. ${num(min)}</span></div>
            <div class="barra ${nivel}"><div style="width:${Math.max(pct, 2)}%"></div></div>
        </div>`;
    }).join('')}</div>`;
}

function vistaCategorias(s) {
    const por = s.por || tipo.agruparPor;
    const grupos = {};
    for (const i of items) {
        const k = i[por] || 'Sin dato';
        grupos[k] = (grupos[k] || 0) + cantidadDe(i);
    }
    const filas = Object.entries(grupos).sort((a, b) => b[1] - a[1]);
    if (!filas.length) return vacio();
    const max = Math.max(...filas.map(f => f[1]), 1);
    return `<div class="barras">${filas.map(([k, v]) => `<div>
        <div class="barra-top"><span>${esc(k)}</span><strong>${num(v)}</strong></div>
        <div class="barra"><div style="width:${Math.max(Math.round(v / max * 100), 2)}%"></div></div>
    </div>`).join('')}</div>`;
}

const RANGOS_CADUCIDAD = [
    { texto: 'Caducados', nivel: 'alta', entra: d => d < 0 },
    { texto: 'Hoy a 3 días', nivel: 'alta', entra: d => d >= 0 && d <= 3 },
    { texto: '4 a 7 días', nivel: 'media', entra: d => d >= 4 && d <= 7 },
    { texto: '8 a 30 días', nivel: 'ok', entra: d => d >= 8 && d <= 30 },
    { texto: 'Más de 30 días', nivel: 'ok', entra: d => d > 30 },
];

function vistaCaducidad() {
    const conFecha = items.filter(i => i.caducidad);
    if (!conFecha.length) return vacio('Agrega fechas de caducidad para ver este apartado.');
    return `<div class="buckets">${RANGOS_CADUCIDAD.map(r => {
        const grupo = conFecha.filter(i => r.entra(diasPara(i.caducidad)));
        const nombres = grupo.slice(0, 3).map(i => i.nombre).join(', ') + (grupo.length > 3 ? ` y ${grupo.length - 3} más` : '');
        return `<div class="bucket ${grupo.length ? r.nivel : ''}"><b>${grupo.length}</b><div>${r.texto}<small>${esc(nombres) || 'Ninguno'}</small></div></div>`;
    }).join('')}</div>`;
}

function vistaTallas() {
    const tallas = campo('talla').options;
    const modelos = [...new Set(items.map(i => i.nombre))];
    if (!modelos.length) return vacio();
    const filas = modelos.map(m => {
        const celdas = tallas.map(t => {
            const deTalla = items.filter(i => i.nombre === m && String(i.talla) === t);
            if (!deTalla.length) return '<td><span class="celda nada">—</span></td>';
            const cant = deTalla.reduce((s, i) => s + cantidadDe(i), 0);
            const nivel = cant === 0 ? 'cero' : cant <= minimoDe(deTalla[0]) ? 'media' : '';
            return `<td><span class="celda ${nivel}">${num(cant)}</span></td>`;
        }).join('');
        return `<tr><td><strong>${esc(m)}</strong></td>${celdas}</tr>`;
    }).join('');
    return `<div class="table-wrap"><table class="matriz">
        <thead><tr><th>${esc(campo('nombre').label)}</th>${tallas.map(t => `<th>${esc(t)}</th>`).join('')}</tr></thead>
        <tbody>${filas}</tbody>
    </table></div>
    <p class="leyenda"><span class="celda">4</span> en stock <span class="celda media">1</span> poco <span class="celda cero">0</span> agotado <span class="celda nada">—</span> no la manejas</p>`;
}

const VISTAS = {
    kpis: vistaKpis,
    tabla: vistaTabla,
    tarjetas: vistaTarjetas,
    alertas: vistaAlertas,
    bajoStock: vistaBajoStock,
    categorias: vistaCategorias,
    caducidad: vistaCaducidad,
    tallas: vistaTallas,
};

function tituloDe(s) {
    if (s.w === 'categorias') return 'Por ' + campo(s.por || tipo.agruparPor).label.toLowerCase();
    return WIDGETS[s.w].titulo;
}

function widget(s) {
    const def = WIDGETS[s.w];
    const herramientas = s.w === 'tabla' || s.w === 'tarjetas'
        ? `<div class="w-tools">
            <input type="search" data-buscar placeholder="${esc(tipo.buscar)}" aria-label="Buscar en el inventario">
            <button class="btn btn-primary btn-sm" data-action="agregar"><i class="bi bi-plus-lg"></i> Agregar</button>
        </div>`
        : '';
    const cabeza = s.w === 'kpis' ? '' : `<header class="w-head"><h3><i class="bi ${def.icono}"></i> ${esc(s.titulo)}</h3>${herramientas}</header>`;
    return `<section class="widget ${def.size} w-${s.w}" id="${s.id}">${cabeza}${VISTAS[s.w](s)}</section>`;
}

/* ---------- Estructura de la página ---------- */

function cabecera() {
    const botones = Object.entries(tipo.plantillas).map(([id, p]) => {
        const activa = id === negocio.plantilla;
        return `<button data-action="plantilla" data-id="${id}" class="${activa ? 'activo' : ''}" aria-pressed="${activa}">${esc(p.nombre)}</button>`;
    }).join('');
    return `<div class="dash-head">
        <div>
            <span class="tipo-badge"><i class="bi ${tipo.icono}"></i> ${esc(tipo.nombre)}</span>
            <h1>${esc(negocio.nombre)}</h1>
            ${negocio.descripcion ? `<p>${esc(negocio.descripcion)}</p>` : ''}
        </div>
        <div class="head-actions">
            <div class="switch" role="group" aria-label="Plantilla">${botones}</div>
            <button class="btn btn-primary" data-action="solicitar"><i class="bi bi-magic"></i> Solicitar cambio</button>
        </div>
    </div>`;
}

function bannerEjemplos() {
    if (!items.some(i => i.ejemplo)) return '';
    return `<div class="banner">
        <span><i class="bi bi-lightbulb"></i> Cargamos productos de ejemplo para que veas cómo funciona tu plantilla.</span>
        <button class="btn btn-secondary btn-sm" data-action="borrar-ejemplos">Borrar ejemplos</button>
    </div>`;
}

function render() {
    // Conservamos lo escrito en los buscadores entre redibujados.
    const busquedas = [...app.querySelectorAll('[data-buscar]')].map(el => [el.closest('.widget').id, el.value]);

    const plantilla = tipo.plantillas[negocio.plantilla] || tipo.plantillas.a;
    const specs = plantilla.widgets.map((s, n) => ({ ...s, id: `w-${n}`, titulo: s.titulo || tituloDe(s) }));
    const nav = specs.map(s => `<a href="#${s.id}"><i class="bi ${WIDGETS[s.w].icono}"></i> ${esc(s.titulo)}</a>`).join('');
    const plan = planActual();
    const marca = '<a href="index.html" class="brand-logo"><i class="bi bi-box-seam-fill"></i> Ecostock</a>';
    const contenido = `<main class="dash-main">${cabecera()}${bannerEjemplos()}<div class="widgets">${specs.map(widget).join('')}</div></main>`;

    app.className = `shell layout-${plantilla.layout}`;
    app.innerHTML = plantilla.layout === 'sidebar'
        ? `<aside class="side">
            ${marca}
            <nav class="side-nav" aria-label="Secciones">${nav}</nav>
            <div class="plan-box">
                <span>Tu plan</span>
                <strong>${plan.nombre}</strong>
                <button class="btn btn-primary btn-sm btn-block" data-action="planes">${plan.id === 'gratis' ? 'Mejorar plan' : 'Ver planes'}</button>
            </div>
            <div class="side-user"><span>${esc(correo)}</span><button class="link-btn" data-action="salir">Salir</button></div>
        </aside>${contenido}`
        : `<header class="topbar"><div class="topbar-in">
            ${marca}
            <nav class="top-nav" aria-label="Secciones">${nav}</nav>
            <div class="top-right">
                <button class="plan-chip" data-action="planes">Plan ${plan.nombre}</button>
                <button class="btn btn-secondary btn-sm" data-action="salir">Salir</button>
            </div>
        </div></header>${contenido}`;

    for (const [id, valor] of busquedas) {
        const input = document.querySelector(`#${id} [data-buscar]`);
        if (input && valor) {
            input.value = valor;
            filtrar(input);
        }
    }
}

function filtrar(input) {
    const q = input.value.trim().toLowerCase();
    input.closest('.widget').querySelectorAll('[data-texto]').forEach(el => {
        el.hidden = Boolean(q) && !el.dataset.texto.includes(q);
    });
}

/* ---------- Ventanas (productos, planes y solicitudes) ---------- */

function abrirModal(html) {
    modal.innerHTML = `<div class="modal-card">
        <button class="icon-btn modal-close" data-cerrar aria-label="Cerrar"><i class="bi bi-x-lg"></i></button>
        ${html}
    </div>`;
    if (!modal.open) modal.showModal();
}

function entrada(c, valor) {
    const v = valor ?? '';
    const req = c.required ? 'required' : '';
    if (c.type === 'select') {
        return `<select name="${c.key}" ${req}><option value="">Selecciona...</option>${c.options.map(o => `<option ${String(o) === String(v) ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    }
    if (c.type === 'number' || c.type === 'money') {
        const extra = c.type === 'money' ? 'step="0.01"' : 'step="any"';
        const ph = c.key === 'minimo' ? `placeholder="${tipo.minimo}"` : '';
        return `<input name="${c.key}" type="number" min="0" ${extra} ${ph} value="${esc(v)}" ${req}>`;
    }
    return `<input name="${c.key}" type="${c.type}" value="${esc(v)}" ${req}>`;
}

function abrirFormulario(item) {
    const v = item || {};
    const campos = tipo.campos.map(c => `<label class="field"><span>${esc(c.label)}${c.required ? ' *' : ''}</span>${entrada(c, v[c.key])}</label>`).join('');
    abrirModal(`<h2>${item ? 'Editar' : 'Agregar'} producto</h2>
        <form data-form="item" data-id="${item ? esc(item.id) : ''}" class="form-grid">
            ${campos}
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" data-cerrar>Cancelar</button>
                <button class="btn btn-primary">Guardar</button>
            </div>
        </form>`);
}

function guardarItem(form) {
    const datos = Object.fromEntries(new FormData(form));
    for (const c of tipo.campos) {
        if (typeof datos[c.key] === 'string') datos[c.key] = datos[c.key].trim();
        if ((c.type === 'number' || c.type === 'money') && datos[c.key] !== '') datos[c.key] = Number(datos[c.key]);
    }
    const existente = items.find(i => i.id === form.dataset.id);
    if (existente) Object.assign(existente, datos);
    else items.unshift({ id: nuevoId(), ...datos });
    guardar();
    modal.close();
    render();
}

function tarjetaPlan(p) {
    const boton = p.id === negocio.plan
        ? '<button class="btn btn-secondary btn-block" disabled>Tu plan actual</button>'
        : `<button class="btn ${p.id === 'gratis' ? 'btn-secondary' : 'btn-primary'} btn-block" data-action="elegir-plan" data-id="${p.id}">${p.id === 'gratis' ? 'Cambiar a Gratis' : 'Suscribirme'}</button>`;
    return `<div class="plan ${p.destacado ? 'destacado' : ''}">
        ${p.destacado ? '<span class="plan-tag">Más popular</span>' : ''}
        <h3>${p.nombre}</h3>
        <div class="plan-precio">${p.precio} <small>${p.periodo}</small></div>
        <ul>${p.incluye.map(x => `<li><i class="bi bi-check2"></i> ${x}</li>`).join('')}</ul>
        ${boton}
    </div>`;
}

function abrirPlanes(motivo, despues = null) {
    trasElegirPlan = despues;
    abrirModal(`<h2>Planes</h2>
        <p class="muted">${esc(motivo || 'Las plantillas base son gratis para siempre. Paga solo si quieres cambios.')}</p>
        <div class="planes">${PLANES.map(tarjetaPlan).join('')}</div>
        <p class="nota"><i class="bi bi-info-circle"></i> Versión de demostración: al suscribirte no se hace ningún cobro.</p>`);
}

function elegirPlan(id) {
    negocio.plan = id;
    guardar();
    render();
    if (id !== 'gratis' && trasElegirPlan === 'solicitud') {
        trasElegirPlan = null;
        abrirSolicitud();
    } else {
        modal.close();
    }
}

const TIPOS_CAMBIO = ['Agregar un campo al inventario', 'Agregar un apartado al panel', 'Nuevo reporte o gráfica', 'Cambiar colores o textos', 'Otro'];

function abrirSolicitud(aviso) {
    const plan = planActual();
    if (plan.id === 'gratis') {
        return abrirPlanes('Las plantillas base son gratis. Para pedir cambios a tu plantilla necesitas un plan de pago.', 'solicitud');
    }
    const mes = new Date().toISOString().slice(0, 7);
    const usadas = negocio.solicitudes.filter(s => s.fecha.startsWith(mes)).length;
    const sinCupo = plan.cambiosMes !== null && usadas >= plan.cambiosMes;
    const opciones = plan.id === 'medida' ? ['Rediseño completo del panel', ...TIPOS_CAMBIO] : TIPOS_CAMBIO;
    const cupo = plan.cambiosMes === null ? 'cambios sin límite' : `llevas ${usadas} de ${plan.cambiosMes} cambios este mes`;

    const formulario = sinCupo
        ? `<div class="banner"><span>Ya usaste tus ${plan.cambiosMes} cambios de este mes.</span><button class="btn btn-primary btn-sm" data-action="planes">Ver plan A tu medida</button></div>`
        : `<form data-form="solicitud">
            <label class="field"><span>¿Qué quieres cambiar?</span>
                <select name="tipo" required>${opciones.map(o => `<option>${esc(o)}</option>`).join('')}</select>
            </label>
            <label class="field"><span>Descríbelo</span>
                <textarea name="detalle" required placeholder="Ej. Quiero una columna de proveedor y un reporte semanal de ventas."></textarea>
            </label>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" data-cerrar>Cancelar</button>
                <button class="btn btn-primary">Enviar solicitud</button>
            </div>
        </form>`;

    const historial = negocio.solicitudes.length
        ? `<h3 class="sub">Tus solicitudes</h3><ul class="historial">${[...negocio.solicitudes].reverse().map(s => `
            <li><div><strong>${esc(s.tipo)}</strong><p>${esc(s.detalle)}</p><small>${fecha(s.fecha.slice(0, 10))}</small></div>
            <span class="chip media">${esc(s.estado)}</span></li>`).join('')}</ul>`
        : '';

    abrirModal(`<h2>Solicitar cambio</h2>
        <p class="muted">Plan ${plan.nombre}: ${cupo}.</p>
        ${aviso ? `<div class="aviso-ok"><i class="bi bi-check-circle-fill"></i> ${aviso}</div>` : ''}
        ${formulario}
        ${historial}`);
}

function guardarSolicitud(form) {
    const d = Object.fromEntries(new FormData(form));
    negocio.solicitudes.push({ fecha: new Date().toISOString(), tipo: d.tipo, detalle: d.detalle.trim(), estado: 'Pendiente' });
    guardar();
    abrirSolicitud('Recibimos tu solicitud. Te avisaremos cuando esté lista.');
}

/* ---------- Eventos ---------- */

function alClic(e) {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    const id = b.dataset.id;
    const item = items.find(i => i.id === id);

    switch (b.dataset.action) {
        case 'agregar':
            return abrirFormulario();
        case 'editar':
            return abrirFormulario(item);
        case 'sumar':
        case 'restar':
            item.cantidad = Math.max(0, cantidadDe(item) + (b.dataset.action === 'sumar' ? 1 : -1));
            guardar();
            return render();
        case 'borrar':
            if (confirm(`¿Borrar "${item.nombre}" del inventario?`)) {
                items = items.filter(i => i !== item);
                guardar();
                render();
            }
            return;
        case 'borrar-ejemplos':
            if (confirm('¿Borrar todos los productos de ejemplo?')) {
                items = items.filter(i => !i.ejemplo);
                guardar();
                render();
            }
            return;
        case 'plantilla':
            negocio.plantilla = id;
            guardar();
            return render();
        case 'solicitar':
            return abrirSolicitud();
        case 'planes':
            return abrirPlanes();
        case 'elegir-plan':
            return elegirPlan(id);
        case 'salir':
            Store.cerrarSesion();
            location.href = 'index.html';
    }
}

if (!negocio) {
    Store.cerrarSesion();
    location.replace('login.html');
} else {
    negocio.solicitudes ||= [];
    document.body.style.setProperty('--accent', tipo.color);
    document.title = `${negocio.nombre} | Ecostock`;

    app.addEventListener('click', alClic);
    app.addEventListener('input', e => {
        if (e.target.matches('[data-buscar]')) filtrar(e.target);
    });
    modal.addEventListener('click', e => {
        if (e.target === modal || e.target.closest('[data-cerrar]')) return modal.close();
        alClic(e);
    });
    modal.addEventListener('submit', e => {
        e.preventDefault();
        if (e.target.dataset.form === 'item') guardarItem(e.target);
        else if (e.target.dataset.form === 'solicitud') guardarSolicitud(e.target);
    });

    render();
}
