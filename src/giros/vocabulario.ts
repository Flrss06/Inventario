// Cómo habla el panel según el giro. Una tienda VENDE sus productos; un restaurante USA sus insumos.
// Todo texto que hable de ventas, consumo o compras debe salir de aquí (vocabularioDe(giro)).
// Este archivo también lo usa el servidor (server/ia), así que solo importa con rutas relativas.

import type { Giro, Vocabulario } from '../types';

export const VENTA: Vocabulario = {
    tipo: 'venta',
    producto: 'producto',
    productos: 'productos',
    salida: 'venta',
    salidas: 'Ventas',
    hechos: 'vendidos',
    unidadesHechas: 'unidades vendidas',
    presente: 'vendes',
    pasado: 'vendiste',
    reflexivo: 'se vende',
    reflexivoPlural: 'se venden',
    monto: 'en ventas',
    comprar: 'Compra',
    instruccion: 'Cada vez que vendas algo, presiona el botón − del producto.',
    subio: 'Tus ventas subieron',
    bajo: 'Tus ventas bajaron',
    consejoEstancado: 'Considera una promoción, moverlos a un lugar más visible o dejar de resurtirlos.',
    tituloCaducidad: 'Haz promoción antes de que caduquen',
    consejoCaducidad: 'conviene ponerlo en promoción',
};

export const CONSUMO: Vocabulario = {
    tipo: 'consumo',
    producto: 'insumo',
    productos: 'insumos',
    salida: 'uso',
    salidas: 'Consumo',
    hechos: 'usados',
    unidadesHechas: 'unidades usadas',
    presente: 'usas',
    pasado: 'usaste',
    reflexivo: 'se usa',
    reflexivoPlural: 'se usan',
    monto: 'en insumos usados',
    comprar: 'Pide',
    instruccion: 'Cada vez que saques un insumo para cocinar o trabajar, presiona el botón − del insumo.',
    subio: 'Tu consumo subió',
    bajo: 'Tu consumo bajó',
    consejoEstancado: 'Revisa si de verdad los necesitas, úsalos en otra preparación o pide menos la próxima vez.',
    tituloCaducidad: 'Úsalos antes de que caduquen',
    consejoCaducidad: 'conviene usarlo pronto (por ejemplo, en el platillo del día)',
};

export const vocabularioDe = (giro: Pick<Giro, 'vocabulario'>) => giro.vocabulario ?? VENTA;

export const mayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);
