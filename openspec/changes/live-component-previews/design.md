# Design

## Context

Ver proposal.md (Why). Estado actual que condiciona el diseño:

- **Las cards** están en `apps/docs/src/pages/components/index.astro`. Cada una es un `<a>` con:
  - un recuadro 16/10 (`aspect-[16/10]`, `p-4`) con dos `<img>`, una para claro y otra para oscuro, con `loading="lazy"`;
  - el nombre y la descripción debajo.

  El fondo del recuadro es el color de la esquina de la captura.
- **Las fotos** salen de `src/lib/previews.ts`. Recorta con `sharp` el margen de `e2e/visual/approved/<Nombre>-<tema>.png`, deja 24px de borde y lo sirve a 720px de ancho como máximo en `src/pages/components/previews/[file].webp.ts`. Si falta una PNG, el build falla.
- **El registro visual:**
  - `src/visual/registry.ts` (`visualExamples`) tiene un ejemplo por componente;
  - `src/visual/cards.ts` tiene su alto (`CARD_HEIGHTS`) y los que van siempre en oscuro (`DARK_PREVIEWS`);
  - los ejemplos se diseñan para un ancho de 800px (`VIEWPORT_WIDTH`, hoy en `e2e/visual/compare.ts`);
  - `VisualExample.tsx` pinta el ejemplo por nombre: en `/visual/<slug>/` es una isla `client:load`, y en la página de cada componente, `client:visible`.
- **El tema** se aplica con la clase `dark-mode` sobre `<html>`. Los tokens funcionan igual con esa clase en cualquier contenedor, y así pintan su raíz los componentes de Stream.
- **Scaena** (`components/studio/OverlaySources.tsx`, `Scaled`) pinta la pieza a su ancho real dentro de un `div` con `overflow-hidden` y tamaño fijo, y la encoge con `transform: scale()` y `origin-top-left`. Ancho, escala y recuadro están puestos a mano en cada pieza.
- `sharp` solo lo usa `src/lib/previews.ts`. La web no usa `astro:assets`.

## Goals / Non-Goals

**Goals:**
- Que la foto de cada card sea el ejemplo real, sin capturas ni JavaScript, y que se vea completo y legible en las 78 cards sin ajustar a mano más que las que lo necesiten.
- Que la página no empeore: ni accesibilidad, ni teclado, ni rendimiento medible.

**Non-Goals:**
- Hacer interactivas las vistas previas: para eso está la página del componente.
- Cambiar los ejemplos del registro, que comparte la paridad visual.
- Tocar las capturas aprobadas o los tests visuales.

## Decisions

### D1. El ejemplo se pinta en el servidor, sin isla
`index.astro` pinta `VisualExample` sin directiva `client:*`. Astro lo renderiza con React en el build y no envía JavaScript. Lo que los componentes hacen en efectos (el `indeterminate` de `Checkbox`, medidas…) no se ejecuta. Las tareas revisan las 78 cards para detectar cualquier diferencia que importe.
*Alternativa:* `client:visible`. Se descarta: 78 islas en una página que solo enseña miniaturas.

### D2. Escenario fijo y escala calculada en el build, con encuadre opcional
Cada vista previa es un escenario de tamaño fijo, `PREVIEW_BOX` = 288×180 (16/10). Cabe en la card más estrecha: una columna a 390px y tres columnas en `xl`.

- **Dentro:** el ejemplo se pinta a su ancho de diseño (800px), con `origin-top-left` y `transform: scale(s)`, centrado en el escenario como en `Scaled`.
- **Encuadre:** `src/visual/thumbs.ts` define `THUMBS[name]` = `{ x, y, width, height }`, la zona del ejemplo (en px de 800) que se enseña. Por defecto es el ejemplo entero: `{ 0, 0, 800, CARD_HEIGHTS[name] }`.
- **Escala:** `s = min(288 / width, 180 / height)`, sin pasar de 1, y el escenario desplaza `-x·s, -y·s`. Todo se calcula en el build: no hace falta medir en el navegador.
- **Ajustes a mano:** con el encuadre por defecto, los componentes pequeños (Button, Badge, Radio, Pagination…) se verían diminutos. Por eso tienen su zona en `THUMBS`, recortada al componente, igual que hoy hace `sharp` con el margen.

`VIEWPORT_WIDTH` pasa de `e2e/visual/compare.ts` a `src/visual/cards.ts`, junto a `CARD_HEIGHTS`, y el comparador lo importa de allí.

*Alternativas:*
- Medir el contenido con JS (`ResizeObserver`) para recortar solo. Se descarta por D1 (cero JS) y porque mueve la página al cargar.
- Escalar con unidades de contenedor (`calc(100cqw / 800px)`). Se descarta porque la división de longitudes no funciona en todos los navegadores que soportamos.

### D3. La vista previa va fuera del enlace
Botones, campos y enlaces dentro de un `<a>` son HTML no válido, aunque estén inertes. Así que la card pasa a ser:

- **Contenedor:** el `<li>`, con `relative`.
- **Vista previa:** un `div` con `inert`, `aria-hidden="true"` y `pointer-events-none`.
- **Enlace:** debajo, el `<a>` con el nombre y la descripción. Su `after:absolute after:inset-0` cubre toda la card, así que un clic en cualquier parte, también en la vista previa, abre la página del componente.

El nombre accesible del enlace sigue siendo el nombre y la descripción, y el foco y el hover se pintan en el `<li>` con `has-[a:focus-visible]` y `has-[a:hover]`, con el mismo aspecto de hoy.
*Alternativa:* dejarla dentro del `<a>` con `inert`. Se descarta por el HTML no válido y porque algunos lectores siguen leyendo contenido inerte dentro de enlaces.

### D4. Tema y Stream
El escenario usa el fondo de la página (`bg-primary`), que cambia solo con el tema. Si el componente está en `DARK_PREVIEWS`, el escenario lleva la clase `dark-mode`, igual que su vista previa, y va en oscuro en los dos temas.

### D5. Rendimiento y movimiento
- **Pintado:** cada escenario lleva `content-visibility: auto` con `contain-intrinsic-size: 288px 180px`, así que las cards fuera de pantalla no se maquetan ni se pintan.
- **Movimiento:** las animaciones de los componentes se dejan como están, igual que en Scaena. Si alguna card se mueve sin parar o se queda vacía por una animación de entrada, se encuadra en otra zona del ejemplo con `THUMBS`. Si con eso no basta, se decide en la revisión, sin tocar el ejemplo.
- **Medición:** antes y después, de dos formas, porque Lighthouse no se puede ejecutar en esta máquina. En local, `scripts/measure-page.ts` mide el peso del HTML y de lo que pide la página, los nodos del DOM y los tiempos de maquetación, de estilos y de tareas, con emulación móvil. En el CI, `/components/` se añade a las `url` de `lighthouserc.json` (con el mismo umbral de 0,9 que las demás), y un primer commit de la PR con solo eso da la nota de Lighthouse antes del cambio. Se acepta el cambio si la nota no baja de esa medida ni del umbral, y si la medida local no empeora sin razón. Decisión del usuario.

### D6. Lo que se quita
- **Ficheros:** `src/lib/previews.ts`, `src/pages/components/previews/[file].webp.ts` y `test/previews.test.ts`.
- **Dependencia:** `sharp` de `apps/docs/package.json` (y su rastro en `bun.lock`).
- **e2e:** el de las cards de `e2e/components.spec.ts` se reescribe para las vistas previas: en vivo, inertes, tema y clic.

El README de `apps/docs` deja de decir que las fotos del índice salen de las capturas.

### D7. Los lienzos de Stream que se miden con un efecto llevan escala fija
`StreamStage` (lo usan solo `StreamScene` y `ChannelBanner`) mide el ancho de su contenedor en un efecto y deja el contenido `invisible` hasta tener la medida, para que no se vea un instante a tamaño real. Sin JavaScript no llega a medir, y en la prueba de las 78 cards fueron las dos únicas que salieron en blanco. Decisión del usuario: no hidratarlas ni tocar el paquete.
- **Dato:** `THUMBS[name].stageScale`, la escala que tendría el lienzo en el ejemplo (ancho que ocupa entre ancho del lienzo): `StreamScene` 376/1920 (dos escenas por fila) y `ChannelBanner` 768/1200.
- **Efecto:** la vista previa pone `data-stage-scale` y `--stage-scale`, y una regla CSS global la aplica al lienzo (`[data-stage-scale] .origin-top-left.invisible`): lo muestra con esa escala.
- **Red:** es un acoplamiento a las clases internas de `StreamStage`. Un e2e comprueba que ninguna de las 78 vistas previas sale vacía y un test fija qué componentes llevan `stageScale`.

*Alternativas:* hidratar esas dos con `client:visible` (rompe «sin JavaScript» y manda JS de Stream a la página); y una escala inicial en `StreamStage` (cambia el paquete publicado y obliga a una versión antes de cerrar la web).

## Risks / Trade-offs

- **[El HTML de servidor de algún ejemplo no es el que se ve hidratado (efectos, medidas)]** → Revisión de las 78 cards en claro y oscuro (tarea). Si alguna se ve mal, se encuadra en otra zona del ejemplo con `THUMBS`.
- **[Ids repetidos o estados globales]** Los ejemplos usan `useId` y pueden abrir capas en línea (`defaultOpen`, `contained`) → Dentro de un escenario con `overflow-hidden` no se salen. La pasada de axe sobre `/components/` detecta ids duplicados.
- **[DOM grande: 78 ejemplos, algunos pesados (StreamScene a 1920, CalendarView, Table)]** → `content-visibility` (D5) y la medida antes y después. Si Lighthouse empeora, se encuadran los pesados con su zona mínima o se sustituyen por un ejemplo reducido solo para la card. Esa decisión iría a la persona usuaria.
- **[Componentes que esperan a JavaScript para verse]** → La prueba de las 78 cards encontró dos (D7). Un e2e comprueba que ninguna vista previa sale vacía, así que un componente nuevo que dependa de un efecto no pasa desapercibido.
- **[Card más estrecha que 288px]** → A 390px la card mide unos 326px de ancho útil. Por debajo, el escenario se recorta por los lados (`overflow-hidden`), sin romper la card.

## Migration Plan

1. **Prueba** con seis componentes de tipos distintos: Button (pequeño), Input (formulario), Table (ancho), DatePicker (capa abierta), StreamAlert (oscuro y animado) y StreamScene (1920). Se revisa con la persona usuaria antes de seguir.
2. Las 78 cards, `THUMBS` donde haga falta, la limpieza de D6 y los tests.
3. PR con la medida de D5 y las capturas de la página en claro y en oscuro.

Vuelta atrás: revertir la PR. Las capturas aprobadas no se tocan, así que el recorte con `sharp` vuelve a funcionar tal cual.
