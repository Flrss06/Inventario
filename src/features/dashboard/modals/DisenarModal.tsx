import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Cuestionario } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CuestionarioForm } from '@/features/disenador/CuestionarioForm';
import { Generando } from '@/features/disenador/Generando';
import { VistaDiseno } from '@/features/disenador/VistaDiseno';
import { disenarPanel, type Diseno } from '@/features/disenador/disenarPanel';
import { useDashboard } from '../context/DashboardContext';

/** Cuestionario → la IA diseña → el cliente elige plantilla y se aplica a su panel. */
export function DisenarModal() {
    const { negocio, items, aplicarDiseno, cerrar } = useDashboard();
    const navigate = useNavigate();
    const [cuestionario, setCuestionario] = useState<Cuestionario>();
    const [diseno, setDiseno] = useState<Diseno | 'cargando'>();

    async function disenar(c: Cuestionario) {
        setCuestionario(c);
        setDiseno('cargando');
        setDiseno(await disenarPanel(c));
    }

    return (
        <Modal titulo="Diseña tu panel con IA" onCerrar={cerrar}>
            {diseno === undefined && (
                <>
                    <p className="mb-5 text-sm text-muted">Cuéntanos de tu negocio y armamos un panel con los datos y apartados que de verdad necesitas.</p>
                    <CuestionarioForm
                        inicial={cuestionario ?? { queVende: negocio.descripcion }}
                        onListo={disenar}
                        secundario={<Button variante="secondary" onClick={cerrar}>Cancelar</Button>}
                    />
                </>
            )}
            {diseno === 'cargando' && <Generando />}
            {diseno && diseno !== 'cargando' && (
                <>
                    {items.some(i => !i.ejemplo) && (
                        <p className="my-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            <i className="bi bi-info-circle" /> Tus productos se conservan; los campos nuevos aparecerán vacíos para que los completes.
                        </p>
                    )}
                    <div className="mt-4">
                        <VistaDiseno
                            diseno={diseno}
                            textoBoton="Usar este panel"
                            onElegir={plantilla => {
                                aplicarDiseno(diseno.giro, plantilla);
                                cerrar();
                                navigate('/panel');
                            }}
                            secundario={<Button variante="secondary" onClick={() => setDiseno(undefined)}><i className="bi bi-arrow-left" /> Cambiar respuestas</Button>}
                        />
                    </div>
                </>
            )}
        </Modal>
    );
}
