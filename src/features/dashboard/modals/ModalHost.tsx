import { useDashboard } from '../context/DashboardContext';
import { ItemFormModal } from './ItemFormModal';
import { PlanesModal } from './PlanesModal';
import { SolicitudModal } from './SolicitudModal';

/** Muestra la ventana que esté abierta en el panel. */
export function ModalHost() {
    const { modal, negocio } = useDashboard();
    if (!modal) return null;

    switch (modal.tipo) {
        case 'item':
            return <ItemFormModal item={modal.item} />;
        case 'planes':
            return <PlanesModal motivo={modal.motivo} despues={modal.despues} />;
        case 'solicitud':
            // La key limpia el formulario después de enviar una solicitud.
            return <SolicitudModal key={negocio.solicitudes.length} aviso={modal.aviso} />;
    }
}
