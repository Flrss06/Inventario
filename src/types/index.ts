// Tipos compartidos por toda la app. Si cambias algo aquí, avisa al equipo:
// lo usan los giros, el registro y el panel.

export type GiroId = 'comida' | 'ropa' | 'calzado' | 'refacciones' | 'general';
export type PlantillaId = 'a' | 'b';
export type PlanId = 'gratis' | 'pro' | 'medida';
export type Layout = 'sidebar' | 'topbar';

export type WidgetId =
    | 'kpis'
    | 'tabla'
    | 'tarjetas'
    | 'tallas'
    | 'alertas'
    | 'bajoStock'
    | 'categorias'
    | 'caducidad';

export type KpiId =
    | 'unidades'
    | 'productos'
    | 'modelos'
    | 'bajoStock'
    | 'agotados'
    | 'porCaducar'
    | 'caducados'
    | 'valor';

export type TipoCampo = 'text' | 'number' | 'money' | 'date' | 'select';

export interface Campo {
    key: string;
    label: string;
    type: TipoCampo;
    options?: string[];
    required?: boolean;
    /** false = solo aparece en el formulario, no como columna de la tabla. */
    tabla?: boolean;
}

export interface WidgetSpec {
    w: WidgetId;
    /** Para "categorias": campo por el que se agrupa. */
    por?: string;
    titulo?: string;
}

export interface Plantilla {
    nombre: string;
    descripcion: string;
    layout: Layout;
    widgets: WidgetSpec[];
}

export type ValorCampo = string | number | undefined;

export interface ItemDatos {
    nombre: string;
    cantidad: number;
    [campo: string]: ValorCampo | boolean;
}

export type Item = ItemDatos & {
    id: string;
    ejemplo?: boolean;
};

export interface Giro {
    id: GiroId;
    nombre: string;
    /** Frase corta para la página de inicio. */
    lema: string;
    descripcion: string;
    icono: string;
    color: string;
    caducidad?: boolean;
    minimo: number;
    agruparPor: string;
    subtitulo: string[];
    buscar: string;
    kpis: KpiId[];
    etiquetas?: Partial<Record<KpiId, string>>;
    campos: Campo[];
    ejemplos: () => ItemDatos[];
    plantillas: Record<PlantillaId, Plantilla>;
}

export interface Plan {
    id: PlanId;
    nombre: string;
    precio: string;
    periodo: string;
    /** null = sin límite. */
    cambiosMes: number | null;
    destacado?: boolean;
    incluye: string[];
}

export interface Solicitud {
    fecha: string;
    tipo: string;
    detalle: string;
    estado: 'Pendiente' | 'En proceso' | 'Lista';
}

export interface Negocio {
    nombre: string;
    descripcion: string;
    tipo: GiroId;
    plantilla: PlantillaId;
    plan: PlanId;
    solicitudes: Solicitud[];
    creado: string;
}

export interface Usuario {
    nombre: string;
    pass: string;
}
