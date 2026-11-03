// Inicio de sesión contra las cuentas guardadas en este navegador.

if (Store.sesion() && Store.get('negocio:' + Store.sesion())) {
    location.replace('dashboard.html');
}

const form = document.getElementById('login');
const error = document.getElementById('error');

form.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(form);
    const correo = String(f.get('correo')).trim().toLowerCase();
    const cuenta = Store.get('usuarios', {})[correo];
    if (!cuenta || cuenta.pass !== await hashPass(String(f.get('pass')))) {
        error.textContent = 'Correo o contraseña incorrectos.';
        error.hidden = false;
        return;
    }
    Store.iniciarSesion(correo);
    location.href = 'dashboard.html';
});
