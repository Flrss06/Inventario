# Ecostock

Plataforma de inventario que se adapta al tipo de negocio. Al registrarse, el usuario elige su giro (comida, ropa, tenis, refacciones u otro) y recibe un panel con dos plantillas hechas para ese giro. Es gratis con las plantillas base; los cambios a la medida se cobran con los planes Pro y A tu medida.

Hecho con **React + TypeScript + Tailwind CSS**, usando Vite.

## Cómo correrlo

Necesitas [Node.js](https://nodejs.org) 20 o más reciente.

```bash
npm install      # solo la primera vez o cuando cambie package.json
npm run dev      # abre http://localhost:5173
```

Otros comandos:

| Comando | Para qué sirve |
| --- | --- |
| `npm run typecheck` | Revisa errores de TypeScript sin compilar |
| `npm run build` | Revisa tipos y genera la versión final en `dist/` |
| `npm run preview` | Sirve la versión de `dist/` para probarla |

> Por ahora no hay servidor: las cuentas y el inventario se guardan en el navegador (localStorage). Todo eso está en un solo archivo, `src/services/db.ts`, para cambiarlo fácil cuando tengamos backend.

## Estructura

```
src/
├── main.tsx, App.tsx      Arranque de la app y rutas (/, /login, /registro, /panel)
├── index.css              Tailwind y colores de la marca
├── types/                 Tipos compartidos (Giro, Item, Negocio, Plan...)
├── services/db.ts         Guardar y leer datos (hoy localStorage, mañana el backend)
├── lib/format.ts          Formato de dinero, números y fechas
├── data/                  Planes y precios; datos de cada apartado del panel
├── giros/                 Un archivo por tipo de negocio
│   ├── comida.ts  ropa.ts  calzado.ts  refacciones.ts  general.ts
│   └── index.ts           Lista de giros registrados
├── components/            Piezas compartidas por todas las pantallas
│   ├── ui/                Button, Field, Modal
│   ├── Logo.tsx
│   └── PlanCard.tsx
└── features/              Una carpeta por pantalla
    ├── landing/           Página de inicio (cada sección en su archivo)
    ├── auth/              Login y registro en 3 pasos
    └── dashboard/         Panel del negocio
        ├── DashboardPage.tsx   Arma la plantilla elegida
        ├── context/            Estado del panel (useDashboard)
        ├── lib/                Reglas de inventario e indicadores
        ├── layouts/            Barra lateral (plantillas "a") y barra superior (plantillas "b")
        ├── widgets/            Un archivo por apartado: tabla, tarjetas, alertas, tallas...
        ├── components/         Piezas del panel: encabezado, botones +/−, chips de alerta...
        └── modals/             Ventanas: agregar producto, planes, solicitar cambio
```

En `@/` se importa desde `src/`. Por ejemplo: `import { GIROS } from '@/giros'`.

## Cómo repartirse el trabajo

Cada área vive en su propia carpeta, así que dos personas pueden trabajar al mismo tiempo sin tocar los mismos archivos:

| Si trabajas en... | Tus archivos |
| --- | --- |
| Página de inicio | `src/features/landing/` |
| Login y registro | `src/features/auth/` |
| Un giro (campos, ejemplos, plantillas) | `src/giros/<giro>.ts` |
| Un apartado del panel | `src/features/dashboard/widgets/<Apartado>.tsx` |
| Ventanas del panel | `src/features/dashboard/modals/` |
| Diseño del panel | `src/features/dashboard/layouts/` |
| Backend / base de datos | `src/services/db.ts` |
| Planes y precios | `src/data/planes.ts` |

### Archivos compartidos

Estos archivos los usa todo el equipo. Si necesitas cambiarlos, avisa en el grupo y haz un cambio pequeño y rápido de integrar:

- `src/types/index.ts`
- `src/giros/index.ts`
- `src/features/dashboard/widgets/index.ts` y `src/data/widgets.ts`
- `src/components/ui/`
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
1. Copia `src/giros/general.ts` como base (por ejemplo `src/giros/farmacia.ts`) y ajusta campos, ejemplos y plantillas.
2. Agrega su id a `GiroId` en `src/types/index.ts`.
3. Impórtalo en `src/giros/index.ts`.

El inicio, el registro y el panel lo muestran solos.

**Agregar un apartado al panel**
1. Crea el componente en `src/features/dashboard/widgets/`. Recibe `{ seccion }`, usa `useDashboard()` para los datos y se envuelve en `<WidgetCard>`.
2. Agrega su id a `WidgetId` en `src/types/index.ts` y sus datos (título, icono, ancho) en `src/data/widgets.ts`.
3. Regístralo en `src/features/dashboard/widgets/index.ts`.
4. Úsalo en la plantilla de algún giro: `{ w: 'miApartado' }`.

**Colores**
Usa las clases de Tailwind de la marca: `text-ink` (títulos), `text-body`, `text-muted`, `bg-page`, `bg-primary`. Para el color del giro activo usa `accent`: `bg-accent`, `text-accent`, `bg-accent/10`, `border-accent`.

## Lo que falta

- **Backend**: las cuentas, el inventario y las solicitudes solo se guardan en el navegador de cada persona. Las solicitudes de cambio todavía no le llegan al equipo.
- **Cobros**: la suscripción es de demostración; no se cobra nada. Se conecta en `src/features/dashboard/modals/PlanesModal.tsx`.
- **Formulario de contacto** del inicio: todavía no envía los datos a ningún lado.
