# Kiubo

Plataforma de inventario que se adapta al tipo de negocio. El usuario elige su giro (restaurante, abarrotes, ropa, tenis, refacciones u otro) y recibe un panel con dos plantillas hechas para ese giro. Si su negocio no está en la lista, contesta un cuestionario corto y la IA le diseña un panel a la medida.

Un **Asistente IA** analiza el inventario y las ventas de los últimos 30 días. Con eso dice qué comprar y cuánto, qué se vende más, qué no se mueve y qué conviene poner en promoción.

El plan Gratis incluye las plantillas base y el asistente. Los cambios a la medida se cobran con los planes Pro y A tu medida.

Hecho con **React + TypeScript + Tailwind CSS** sobre Vite. La IA usa **Claude** (API de Anthropic).

## Cómo correrlo

Necesitas [Node.js](https://nodejs.org) 20 o más reciente.

```bash
npm install      # solo la primera vez o cuando cambie package.json
npm run dev      # abre http://localhost:5173
```

| Comando | Para qué sirve |
| --- | --- |
| `npm run typecheck` | Revisa errores de TypeScript sin compilar |
| `npm run build` | Revisa tipos y genera la versión final en `dist/` |
| `npm run preview` | Sirve la versión de `dist/` (incluye los endpoints de IA) |

### Activar la IA de Claude (opcional)

1. Crea una clave en [console.anthropic.com](https://console.anthropic.com).
2. Copia `.env.example` como `.env.local` y pega la clave en `ANTHROPIC_API_KEY`.
3. Reinicia `npm run dev`.

Sin clave, todo funciona igual: el reporte y el diseño de paneles usan el análisis local (`src/features/dashboard/lib/analisis.ts` y `src/giros/disenador.ts`). Con clave, Claude escribe el reporte y diseña los paneles a la medida.

La clave **solo vive en el servidor** (`server/ia/`) y nunca llega al navegador. Cada reporte o diseño es una llamada a la API con costo. **Nunca subas `.env.local` a git**; ya está en el `.gitignore`.

> Por ahora no hay base de datos: las cuentas, el inventario y las ventas se guardan en el navegador (localStorage). Todo eso está en un solo archivo, `src/services/db.ts`, para cambiarlo fácil cuando tengamos backend.

## Estructura

```
server/ia/                 Endpoints de IA (/api/ia/reporte y /api/ia/disenar) que llaman a Claude
src/
├── main.tsx, App.tsx      Arranque y rutas: /, /login, /registro, /panel/*
├── index.css              Paleta de Kiubo, animaciones y utilidades
├── types/                 Tipos compartidos (Giro, Item, Movimiento, Negocio...)
├── services/
│   ├── db.ts              Guardar y leer datos (hoy localStorage, mañana el backend)
│   └── ia.ts              Llamadas del navegador a /api/ia (con respaldo local)
├── lib/                   Formato de dinero y fechas; historial de ventas de ejemplo
├── data/                  Planes y precios; datos de cada apartado del panel (título, icono, ruta)
├── giros/                 Un archivo por tipo de negocio
│   ├── restaurante.ts  abarrotes.ts  ropa.ts  calzado.ts  refacciones.ts  general.ts
│   ├── vocabulario.ts     Cómo habla cada giro: una tienda "vende", un restaurante "usa" insumos
│   ├── personalizado.ts   Opciones del cuestionario y validación de paneles diseñados
│   ├── disenador.ts       Diseñador local de paneles (sin IA)
│   └── index.ts           Lista de giros registrados
├── components/            Piezas compartidas: Logo, Reveal (animación al hacer scroll), PlanCard, ui/...
└── features/              Una carpeta por área
    ├── landing/           Página de inicio (cada sección en su archivo)
    ├── auth/              Login y registro por pasos
    ├── disenador/         Cuestionario + "La IA está diseñando..." + vista del diseño
    └── dashboard/         Panel del negocio
        ├── DashboardPage.tsx   Arma la plantilla y las rutas del panel
        ├── pages/              Resumen, página de cada sección y Asistente IA
        ├── context/            Estado del panel (useDashboard)
        ├── lib/                Reglas de inventario, indicadores y análisis de ventas
        ├── layouts/            Barra lateral (plantillas "a") y barra superior (plantillas "b")
        ├── widgets/            Un archivo por apartado, cada uno con vista "resumen" y "detalle"
        ├── components/         Piezas del panel: gráfica, botones +/−, chips, tarjeta del asistente...
        └── modals/             Ventanas: producto, planes, solicitar cambio, diseñar con IA
```

En `@/` se importa desde `src/`. Por ejemplo: `import { GIROS } from '@/giros'`.

### Rutas del panel

- `/panel`: Resumen. Indicadores, tarjeta del asistente y una vista corta de cada sección.
- `/panel/<sección>`: página propia de cada apartado, con más detalle. Por ejemplo `/panel/inventario`, `/panel/ventas` y `/panel/resurtir`.
- `/panel/ia`: Asistente IA, con recomendaciones, reporte, lista de compra y lo que no se mueve.

## Cómo repartirse el trabajo

Cada área vive en su propia carpeta, así que varias personas pueden trabajar al mismo tiempo sin tocar los mismos archivos:

| Si trabajas en... | Tus archivos |
| --- | --- |
| Página de inicio | `src/features/landing/` |
| Login y registro | `src/features/auth/` |
| Cuestionario y diseño con IA | `src/features/disenador/`, `src/giros/disenador.ts` |
| Un giro (campos, ejemplos, plantillas) | `src/giros/<giro>.ts` |
| Un apartado del panel | `src/features/dashboard/widgets/<Apartado>.tsx` |
| Asistente IA (análisis y reporte) | `src/features/dashboard/lib/analisis.ts`, `pages/AsistentePage.tsx`, `server/ia/` |
| Ventanas del panel | `src/features/dashboard/modals/` |
| Diseño del panel | `src/features/dashboard/layouts/` |
| Backend / base de datos | `src/services/db.ts` |
| Planes y precios | `src/data/planes.ts` |

### Archivos compartidos

Estos archivos los usa todo el equipo. Si necesitas cambiarlos, avisa en el grupo y haz un cambio pequeño y rápido de integrar:

- `src/types/index.ts`
- `src/giros/index.ts` y `src/giros/personalizado.ts`
- `src/features/dashboard/widgets/index.ts` y `src/data/widgets.ts`
- `src/features/dashboard/context/`
- `src/components/` y `src/index.css`
- `src/App.tsx`
- `package.json` y `package-lock.json`: instala paquetes solo con `npm install <paquete>`; nunca edites el lock a mano.

### Flujo con Git

1. Antes de empezar, actualiza `main`: `git checkout main` y luego `git pull`.
2. Crea una rama para tu tarea: `git checkout -b inicio/nueva-seccion`.
3. Haz commits pequeños y seguido.
4. Antes de subir, corre `npm run build` para confirmar que compila.
5. Sube tu rama (`git push -u origin <rama>`) y abre un Pull Request hacia `main`.
6. Ramas cortas, de uno o dos días: entre menos tiempo vivan, menos conflictos habrá.

## Tareas comunes

**Agregar un giro nuevo**
1. Copia `src/giros/general.ts` como base (por ejemplo `src/giros/farmacia.ts`) y ajusta campos, ejemplos y plantillas. Si el negocio **usa** sus productos en vez de venderlos (restaurante, taller, salón), ponle `vocabulario: CONSUMO`.
2. Agrega su id a `GiroId` en `src/types/index.ts`.
3. Impórtalo en `src/giros/index.ts`.

**Agregar un apartado al panel**
1. Crea el componente en `src/features/dashboard/widgets/`. Recibe `{ seccion, modo }`, usa `useDashboard()` y se envuelve en `<WidgetCard>`. En `modo === 'resumen'` muestra poco; en `'detalle'`, todo.
2. Agrega su id a `WidgetId` en `src/types/index.ts` y sus datos (título, icono, ancho, ruta) en `src/data/widgets.ts`.
3. Regístralo en `src/features/dashboard/widgets/index.ts` y en `WIDGET_IDS` de `src/giros/personalizado.ts`, para que la IA también pueda usarlo.
4. Úsalo en la plantilla de algún giro: `{ w: 'miApartado' }`.

**Textos de ventas o consumo**
Nunca escribas "vendes" o "ventas" fijo en el panel: usa `vocabularioDe(giro)` (`src/giros/vocabulario.ts`). Así un restaurante ve "Consumo", "Lo que más usas" y "Pide", y una tienda ve "Ventas", "Lo que más vendes" y "Compra".

**Colores**
Usa las clases de la marca: `text-ink` (títulos), `text-body`, `text-muted`, `bg-page`, `bg-noche` (fondos oscuros) y `bg-primary` (violeta de Kiubo). Para el color del giro activo usa `accent`: `bg-accent`, `text-accent`, `bg-accent/10` y `border-accent`. Para texto con degradado usa la clase `texto-marca`.

## Lo que falta

- **Backend**: las cuentas, el inventario y las ventas solo se guardan en el navegador de cada persona. Las solicitudes de cambio todavía no le llegan al equipo.
- **IA en producción**: los endpoints de `server/ia/` corren dentro de Vite (`npm run dev` / `npm run preview`). Para publicar hay que moverlos a un servidor o a una función serverless (Vercel, Netlify...).
- **Cobros**: la suscripción es de demostración; no se cobra nada. Se conecta en `src/features/dashboard/modals/PlanesModal.tsx`.
- **Formulario de contacto** del inicio: todavía no envía los datos a ningún lado.
