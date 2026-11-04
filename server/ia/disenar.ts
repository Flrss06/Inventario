// Claude diseña un panel a la medida a partir del cuestionario del cliente.
// La respuesta se valida con normalizarGiro, igual que el diseño local.

import type { Cuestionario } from '../../src/types';
import { COLORES_PERMITIDOS, CAMPOS_OPCIONALES, ICONOS_PERMITIDOS, KPI_IDS, PRIORIDADES, WIDGET_IDS, normalizarGiro } from '../../src/giros/personalizado';
import { pedirAClaude } from './cliente';

const cadena = { type: 'string' };

const PLANTILLA = {
    type: 'object',
    additionalProperties: false,
    required: ['nombre', 'descripcion', 'widgets'],
    properties: {
        nombre: cadena,
        descripcion: cadena,
        widgets: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['w', 'por'],
                properties: { w: { type: 'string', enum: WIDGET_IDS }, por: cadena },
            },
        },
    },
};

const ESQUEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['nombre', 'lema', 'icono', 'color', 'minimo', 'agruparPor', 'subtitulo', 'buscar', 'kpis', 'campos', 'plantillas', 'ejemplos'],
    properties: {
        nombre: cadena,
        lema: cadena,
        icono: { type: 'string', enum: ICONOS_PERMITIDOS },
        color: { type: 'string', enum: COLORES_PERMITIDOS },
        minimo: { type: 'integer' },
        agruparPor: cadena,
        subtitulo: { type: 'array', items: cadena },
        buscar: cadena,
        kpis: { type: 'array', items: { type: 'string', enum: KPI_IDS } },
        campos: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['key', 'label', 'type', 'options', 'tabla'],
                properties: {
                    key: cadena,
                    label: cadena,
                    type: { type: 'string', enum: ['text', 'number', 'money', 'date', 'select'] },
                    options: { type: 'array', items: cadena },
                    tabla: { type: 'boolean' },
                },
            },
        },
        plantillas: { type: 'object', additionalProperties: false, required: ['a', 'b'], properties: { a: PLANTILLA, b: PLANTILLA } },
        ejemplos: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['valores'],
                properties: {
                    valores: {
                        type: 'array',
                        items: { type: 'object', additionalProperties: false, required: ['campo', 'valor'], properties: { campo: cadena, valor: cadena } },
                    },
                },
            },
        },
    },
};

const SYSTEM = `Diseñas paneles de inventario para Kiubo, una plataforma para pequeños negocios en México.
A partir del cuestionario del cliente decides qué datos registrar de cada producto y qué apartados ve en su panel.

Apartados disponibles (widgets):
- kpis: indicadores del resumen (siempre primero).
- tabla: inventario en tabla con buscador. Ideal para mostrador o muchos productos.
- tarjetas: catálogo visual en tarjetas.
- ventas: gráfica de ventas, lo más vendido y lo que no se mueve.
- alertas: agotados, poco stock y caducidades.
- bajoStock: lo que hay que resurtir.
- categorias: existencias agrupadas por un campo; pon en "por" la key del campo (en los demás apartados deja "por" vacío).
- caducidad: solo si hay un campo "caducidad" de tipo date.
- tallas: matriz modelo por talla; solo si hay un campo "talla" de tipo select con opciones.

Indicadores (kpis): elige exactamente 4. porCaducar y caducados solo si hay caducidad.

Reglas:
- Keys de campos en camelCase sin acentos. Incluye siempre nombre (text), cantidad (number), precio (money) y minimo (number, tabla=false).
- Entre 3 y 6 campos propios del giro además de esos; usa select con opciones cuando los valores sean fijos.
- La plantilla "a" es operativa (barra lateral) y la "b" es visual (barra superior); que sean distintas de verdad. Entre 4 y 6 apartados cada una.
- 6 a 8 productos de ejemplo realistas para ese negocio, con precios en pesos mexicanos; algunos con cantidad 0 o bajo su mínimo. En "valores" pon cada campo como texto (números sin símbolos).
- Si el cliente USA sus productos como insumos (restaurante, taller, salón), trátalos como insumos: incluye unidad (select kg, g, L, pz, caja...) y proveedor, nombra los campos y ejemplos como insumos, y no los trates como productos a la venta.
- Textos en español de México: nombre corto del giro, lema de una frase, placeholder del buscador.`;

function etiquetas(ids: string[], lista: { key?: string; id?: string; label: string }[]) {
    return ids.map(id => lista.find(x => (x.key ?? x.id) === id)?.label ?? id).join(', ') || 'sin preferencia';
}

export async function disenarPanel(c: Cuestionario) {
    const canal = { fisica: 'tienda física', online: 'en línea', ambas: 'tienda física y en línea' }[c.canal] ?? 'no especificado';
    const mensaje = `Cuestionario del cliente:
- Qué vende: ${c.queVende}
- Cómo vende: ${canal}
- Qué hace con sus productos: ${c.salida === 'consumo' ? 'los USA como insumos para preparar o dar un servicio (no los vende tal cual)' : 'los vende tal cual'}
- Datos que quiere registrar de cada producto: ${etiquetas(c.datos, CAMPOS_OPCIONALES)}
- Lo que más le importa controlar: ${etiquetas(c.prioridades, PRIORIDADES)}`;

    const json = await pedirAClaude({ system: SYSTEM, mensaje, esfuerzo: 'medium', esquema: ESQUEMA });
    const crudo = JSON.parse(json) as Record<string, unknown> & { ejemplos?: { valores: { campo: string; valor: string }[] }[] };
    const ejemplos = (crudo.ejemplos ?? []).map(e => Object.fromEntries(e.valores.map(v => [v.campo, v.valor])));
    return { giro: normalizarGiro({ ...crudo, ejemplos, salida: c.salida }, { nombre: c.queVende }) };
}
