import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { PlantillaId } from '@/types';
import { ErrorBox } from '@/components/ui/Field';
import { clasesBoton } from '@/components/ui/Button';
import { esGiro, giroDe } from '@/giros';
import { nuevoId } from '@/lib/format';
import { crearCuenta, existeCuenta } from '@/services/db';
import { AuthLayout } from './components/AuthLayout';
import { StepCuenta, type DatosCuenta } from './components/StepCuenta';
import { StepNegocio, type DatosNegocio } from './components/StepNegocio';
import { StepPlantilla } from './components/StepPlantilla';

const PASOS = ['1. Tu cuenta', '2. Tu negocio', '3. Tu plantilla'];

export function RegisterPage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const tipoInicial = params.get('tipo');

    const [paso, setPaso] = useState(0);
    const [cuenta, setCuenta] = useState<DatosCuenta>();
    const [negocio, setNegocio] = useState<DatosNegocio>();
    const [error, setError] = useState('');

    function irA(n: number) {
        setError('');
        setPaso(n);
    }

    function guardarCuenta(datos: DatosCuenta) {
        if (existeCuenta(datos.correo)) {
            setError('Ya existe una cuenta con ese correo. Inicia sesión para entrar a tu panel.');
            return;
        }
        setCuenta(datos);
        irA(1);
    }

    function guardarNegocio(datos: DatosNegocio) {
        setNegocio(datos);
        irA(2);
    }

    async function finalizar(plantilla: PlantillaId) {
        if (!cuenta || !negocio) return;
        const ok = await crearCuenta({
            ...cuenta,
            negocio: {
                nombre: negocio.empresa,
                descripcion: negocio.descripcion,
                tipo: negocio.tipo,
                plantilla,
                plan: 'gratis',
                solicitudes: [],
                creado: new Date().toISOString(),
            },
            // Productos de ejemplo para que el panel no aparezca vacío la primera vez.
            items: giroDe(negocio.tipo).ejemplos().map(i => ({ ...i, id: nuevoId(), ejemplo: true })),
        });
        if (!ok) {
            setError('Tu navegador no permite guardar datos. Revisa que no estés en una ventana privada.');
            return;
        }
        navigate('/panel');
    }

    return (
        <AuthLayout
            ancho="amplio"
            titulo="Crea tu cuenta gratis"
            subtitulo="En 3 pasos tendrás un panel de inventario hecho para tu tipo de negocio."
            accion={<Link to="/login" className={clasesBoton({ variante: 'ghost' })}>Ya tengo cuenta</Link>}
        >
            <ol className="mt-6 mb-8 flex gap-2">
                {PASOS.map((texto, i) => (
                    <li
                        key={texto}
                        className={`flex-1 border-t-4 pt-2 text-xs font-semibold sm:text-sm ${i <= paso ? 'border-primary text-ink' : 'border-slate-200 text-muted'}`}
                    >
                        {texto}
                    </li>
                ))}
            </ol>

            {error && <ErrorBox>{error}</ErrorBox>}

            {paso === 0 && <StepCuenta inicial={cuenta} onListo={guardarCuenta} />}
            {paso === 1 && (
                <StepNegocio
                    inicial={negocio ?? { tipo: esGiro(tipoInicial) ? tipoInicial : undefined }}
                    onListo={guardarNegocio}
                    onAtras={() => irA(0)}
                />
            )}
            {paso === 2 && negocio && <StepPlantilla giro={giroDe(negocio.tipo)} onListo={finalizar} onAtras={() => irA(1)} />}
        </AuthLayout>
    );
}
