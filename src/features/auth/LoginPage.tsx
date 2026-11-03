import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button, ButtonLink } from '@/components/ui/Button';
import { ErrorBox, Field, claseInput } from '@/components/ui/Field';
import { cargarNegocio, iniciarSesion, sesionActual, verificarCredenciales } from '@/services/db';
import { AuthLayout } from './components/AuthLayout';

export function LoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const sesion = sesionActual();

    if (sesion && cargarNegocio(sesion)) return <Navigate to="/panel" replace />;

    async function entrar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const correo = String(f.get('correo'));
        if (!(await verificarCredenciales(correo, String(f.get('pass'))))) {
            setError('Correo o contraseña incorrectos.');
            return;
        }
        iniciarSesion(correo);
        navigate('/panel');
    }

    return (
        <AuthLayout
            titulo="Bienvenido de vuelta"
            subtitulo="Entra para ver el panel de tu negocio."
            accion={<ButtonLink to="/registro">Registrarse</ButtonLink>}
        >
            <form onSubmit={entrar} className="mt-6">
                {error && <ErrorBox>{error}</ErrorBox>}
                <Field label="Correo electrónico">
                    <input name="correo" type="email" autoComplete="email" required className={claseInput} />
                </Field>
                <Field label="Contraseña">
                    <input name="pass" type="password" autoComplete="current-password" required className={claseInput} />
                </Field>
                <Button type="submit" bloque>Iniciar sesión</Button>
            </form>

            <p className="mt-6 text-center text-sm">
                ¿Aún no tienes cuenta?{' '}
                <Link to="/registro" className="font-semibold text-accent">Regístrate gratis</Link>
            </p>
        </AuthLayout>
    );
}
