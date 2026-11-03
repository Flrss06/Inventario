import type { ReactNode } from 'react';
import type { Seccion } from '../widgets/tipos';

export interface LayoutProps {
    secciones: Seccion[];
    children: ReactNode;
}
