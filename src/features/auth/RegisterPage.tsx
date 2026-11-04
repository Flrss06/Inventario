import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { Cuestionario, GiroGuardado, PlantillaId } from '@/types';
import { ErrorBox } from '@/components/ui/Field';
import { Button, clasesBoton } from '@/components/ui/Button';
import { esGiro, giroDe, giroDeNegocio } from '@/giros';
import { nuevoId } from '@/lib/format';
import { historialDeEjemplo } from '@/lib/historial';
import { crearCuenta, existeCuenta } from '@/services/db';
import { CuestionarioForm } from '@/features/disenador/CuestionarioForm';
import { Generando } from '@/features/disenador/Generando';
import { VistaDiseno } from '@/features/disenador/VistaDiseno';
import { disenarPanel, type Diseno } from '@/features/disenador/disenarPanel';
import { AuthLayout } from './components/AuthLayout';
import { StepCuenta, type DatosCuenta } from './components/StepCuenta';
import { StepNegocio, type DatosNegocio } from './components/StepNegocio';
import { StepPlantilla } from './components/StepPlantilla';

// Pasos: 0 cuenta, 1 negocio, 2 cuestionario (solo "Otro tipo de negocio"), 3 plantilla.
const CUENTA = 0;
const NEGOCIO = 1;
const CUESTIONARIO = 2;
const PLANTILLA = 3;

export function RegisterPage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const tipoInicial = params.get('tipo');

    const [paso, setPaso] = useState(CUENTA);
    const [cuenta, setCuenta] = useState<DatosCuenta>();
    const [negocio, setNegocio] = useState<DatosNegocio>();
    const [cuestionario, setCuestionario] = useState<Cuestionario>();
    const [diseno, setDiseno] = useState<Diseno | 'cargando'>();
    const [error, setError] = useState('');

    const conIA = negocio?.tipo === 'general';
    const pasos = conIA ? ['Tu cuenta', 'Tu negocio', 'Cuéntanos más', 'Tu panel'] : ['Tu cuenta', 'Tu negocio', 'Tu plantilla'];
    const indiceVisible = conIA ? paso : paso === PLANTILLA ? 2 : paso;

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
        irA(NEGOCIO);
    }

    function guardarNegocio(datos: DatosNegocio) {
        setNegocio(datos);
        irA(datos.tipo === 'general' ? CUESTIONARIO : PLANTILLA);
    }

    async function disenar(c: Cuestionario) {
        setCuestionario(c);
        setDiseno('cargando');
        irA(PLANTILLA);
        setDiseno(await disenarPanel(c));
    }

    async function finalizar(plantilla: PlantillaId, giroPersonalizado?: GiroGuardado) {
        if (!cuenta || !negocio) return;
        const datosNegocio = {
            nombre: negocio.empresa,
            descripcion: negocio.descripcion,
            tipo: negocio.tipo,
            plantilla,
            plan: 'gratis' as const,
            solicitudes: [],
            creado: new Date().toISOString(),
            ...(giroPersonalizado ? { giroPersonalizado } : {}),
        };
        // Productos y 30 días de ventas de ejemplo para que el panel y la IA tengan algo que mostrar.
        const items = giroDeNegocio(datosNegocio).ejemplos().map(i => ({ ...i, id: nuevoId(), ejemplo: true }));
        const ok = await crearCuenta({ ...cuenta, negocio: datosNegocio, items, movimientos: historialDeEjemplo(items) });
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
            subtitulo="En unos pasos tendrás un panel de inventario hecho para tu negocio."
            accion={<Link to="/login" className={clasesBoton({ variante: 'ghost' })}>Ya tengo cuenta</Link>}
        >
            <ol className="mt-6 mb-8 flex gap-2">
                {pasos.map((texto, i) => (
                    <li key={texto} className="flex-1 text-xs font-semibold sm:text-sm">
                        <span className="mb-2 block h-1.5 overflow-hidden rounded-full bg-slate-200">
                            <span className={`block h-full rounded-full bg-linear-to-r from-primary to-cyan-400 transition-all duration-500 ${i <= indiceVisible ? 'w-full' : 'w-0'}`} />
                        </span>
                        <span className={i <= indiceVisible ? 'text-ink' : 'text-muted'}>{i + 1}. {texto}</span>
                    </li>
                ))}
            </ol>

            {error && <ErrorBox>{error}</ErrorBox>}

            {paso === CUENTA && <StepCuenta inicial={cuenta} onListo={guardarCuenta} />}
            {paso === NEGOCIO && (
                <StepNegocio
                    inicial={negocio ?? { tipo: esGiro(tipoInicial) ? tipoInicial : undefined }}
                    onListo={guardarNegocio}
                    onAtras={() => irA(CUENTA)}
                />
            )}
            {paso === CUESTIONARIO && (
                <div className="animate-entrada">
                    <p className="mb-5 rounded-2xl bg-linear-to-r from-violet-50 to-cyan-50 px-4 py-3 text-sm text-body">
                        <i className="bi bi-stars text-primary" /> Cuéntanos un poco más y la IA diseñará los campos, apartados y ejemplos de tu panel.
                    </p>
                    <CuestionarioForm
                        inicial={cuestionario ?? { queVende: negocio?.descripcion }}
                        onListo={disenar}
                        secundario={<Button variante="secondary" onClick={() => irA(NEGOCIO)}><i className="bi bi-arrow-left" /> Atrás</Button>}
                    />
                </div>
            )}
            {paso === PLANTILLA && negocio && !conIA && (
                <StepPlantilla giro={giroDe(negocio.tipo)} onListo={p => void finalizar(p)} onAtras={() => irA(NEGOCIO)} />
            )}
            {paso === PLANTILLA && conIA && diseno === 'cargando' && <Generando />}
            {paso === PLANTILLA && conIA && diseno && diseno !== 'cargando' && (
                <VistaDiseno
                    diseno={diseno}
                    textoBoton="Entrar a mi panel"
                    onElegir={p => void finalizar(p, diseno.giro)}
                    secundario={<Button variante="secondary" onClick={() => irA(CUESTIONARIO)}><i className="bi bi-arrow-left" /> Cambiar respuestas</Button>}
                />
            )}
        </AuthLayout>
    );
}
