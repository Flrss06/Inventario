// Tipos compartidos por toda la app. Si cambias algo aquí, avisa al equipo:
// lo usan los giros, el registro y el panel.

export type GiroId = 'restaurante' | 'abarrotes' | 'ropa' | 'calzado' | 'refacciones' | 'general';

/** Palabras que usa el panel: una tienda "vende" productos, un restaurante "usa" insumos. Ver src/giros/vocabulario.ts. */
export interface Vocabulario {
    tipo: 'venta' | 'consumo';
    producto: string;
    productos: string;
    /** Lo que registra el botón −: "venta" o "uso". */
    salida: string;
    /** Título de la sección: "Ventas" o "Consumo". */
    salidas: string;
    hechos: string;
    /** "unidades vendidas" o "unidades usadas". */
    unidadesHechas: string;
    presente: string;
    pasado: string;
    reflexivo: string;
    reflexivoPlural: string;
    monto: string;
    comprar: string;
    instruccion: string;
    subio: string;
    bajo: string;
    consejoEstancado: string;
    tituloCaducidad: string;
    consejoCaducidad: string;
}
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
    | 'caducidad'
    | 'ventas';

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
    /** Si no se indica, el giro "vende" (VENTA). */
    vocabulario?: Vocabulario;
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

/** Giro diseñado a la medida (por la IA o el diseñador local). Se guarda con el negocio. */
export type GiroGuardado = Omit<Giro, 'id' | 'ejemplos'> & { ejemplos: ItemDatos[] };

/** Respuestas del cuestionario para negocios que no están en la lista. */
export interface Cuestionario {
    queVende: string;
    canal: 'fisica' | 'online' | 'ambas';
    /** "venta" si vende los productos tal cual; "consumo" si los usa para preparar o dar un servicio. */
    salida: 'venta' | 'consumo';
    /** Claves de CAMPOS_OPCIONALES que el cliente quiere registrar. */
    datos: string[];
    /** Lo que más le importa controlar. */
    prioridades: Prioridad[];
}

export type Prioridad = 'stock' | 'ventas' | 'caducidad' | 'tallas' | 'ubicacion';

/** Una venta (salida) o una entrada de mercancía. La IA los usa para saber qué se vende. */
export interface Movimiento {
    id: string;
    itemId: string;
    tipo: 'venta' | 'entrada';
    cantidad: number;
    fecha: string;
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
    /** Si existe, reemplaza la configuración del giro "general". */
    giroPersonalizado?: GiroGuardado;
}

export interface Usuario {
    nombre: string;
    pass: string;
}
