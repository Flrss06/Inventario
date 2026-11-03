import type { FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Field, claseInput } from '@/components/ui/Field';
import { planDe } from '@/data/planes';
import { fecha } from '@/lib/format';
import { useDashboard } from '../context/DashboardContext';

const TIPOS_CAMBIO = ['Agregar un campo al inventario', 'Agregar un apartado al panel', 'Nuevo reporte o gráfica', 'Cambiar colores o textos', 'Otro'];

/** Pedir un cambio a la plantilla. Solo se abre con plan Pro o A tu medida. */
export function SolicitudModal({ aviso }: { aviso?: string }) {
    const { negocio, agregarSolicitud, abrir, cerrar } = useDashboard();
    const plan = planDe(negocio.plan);

    const mes = new Date().toISOString().slice(0, 7);
    const usadas = negocio.solicitudes.filter(s => s.fecha.startsWith(mes)).length;
    const sinCupo = plan.cambiosMes !== null && usadas >= plan.cambiosMes;
    const opciones = plan.id === 'medida' ? ['Rediseño completo del panel', ...TIPOS_CAMBIO] : TIPOS_CAMBIO;
    const cupo = plan.cambiosMes === null ? 'cambios sin límite' : `llevas ${usadas} de ${plan.cambiosMes} cambios este mes`;

    // Por ahora la solicitud se guarda con el negocio. Con backend, aquí se enviaría al equipo.
    function enviar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        agregarSolicitud(String(f.get('tipo')), String(f.get('detalle')).trim());
        abrir({ tipo: 'solicitud', aviso: 'Recibimos tu solicitud. Te avisaremos cuando esté lista.' });
    }

    return (
        <Modal titulo="Solicitar cambio" onCerrar={cerrar}>
            <p className="text-sm text-muted">Plan {plan.nombre}: {cupo}.</p>

            {aviso && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-accent/10 px-3.5 py-2.5 font-semibold text-accent">
                    <i className="bi bi-check-circle-fill" /> {aviso}
                </div>
            )}

            {sinCupo ? (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    <span>Ya usaste tus {plan.cambiosMes} cambios de este mes.</span>
                    <Button tamano="sm" onClick={() => abrir({ tipo: 'planes' })}>Ver plan A tu medida</Button>
                </div>
            ) : (
                <form onSubmit={enviar} className="mt-5">
                    <Field label="¿Qué quieres cambiar?">
                        <select name="tipo" required className={claseInput}>
                            {opciones.map(o => <option key={o}>{o}</option>)}
                        </select>
                    </Field>
                    <Field label="Descríbelo">
                        <textarea
                            name="detalle"
                            required
                            rows={3}
                            placeholder="Ej. Quiero una columna de proveedor y un reporte semanal de ventas."
                            className={claseInput}
                        />
                    </Field>
                    <div className="flex justify-end gap-3">
                        <Button variante="secondary" onClick={cerrar}>Cancelar</Button>
                        <Button type="submit">Enviar solicitud</Button>
                    </div>
                </form>
            )}

            {negocio.solicitudes.length > 0 && (
                <>
                    <h3 className="mt-8 mb-3 font-bold text-ink">Tus solicitudes</h3>
                    <ul className="flex flex-col gap-2.5">
                        {[...negocio.solicitudes].reverse().map(s => (
                            <li key={s.fecha} className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3 text-sm">
                                <div>
                                    <strong className="text-ink">{s.tipo}</strong>
                                    <p>{s.detalle}</p>
                                    <small className="text-muted">{fecha(s.fecha.slice(0, 10))}</small>
                                </div>
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold whitespace-nowrap text-amber-700">{s.estado}</span>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </Modal>
    );
}
