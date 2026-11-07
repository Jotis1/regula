# Design

## Context

Ver proposal.md (Why). Estado actual que condiciona el diseño:

- **Las cards** están en `apps/docs/src/pages/components/index.astro`. Cada una es un `<a>` con:
  - un recuadro 16/10 (`aspect-[16/10]`, `p-4`) con dos `<img>`, una para claro y otra para oscuro, con `loading="lazy"`;
  - el nombre y la descripción debajo.

  El fondo del recuadro es el color de la esquina de la captura.
- **Las fotos** salen de `src/lib/previews.ts`. Recorta con `sharp` el margen de `e2e/visual/approved/<Nombre>-<tema>.png`, deja 24px de borde y lo sirve a 720px de ancho como máximo en `src/pages/components/previews/[file].webp.ts`. Si falta una PNG, el build falla.
- **El registro visual:**
  - `src/visual/registry.ts` (`visualExamples`) tiene un ejemplo por componente, con varias variantes a la vez;
  - `src/visual/cards.ts` tiene su alto (`CARD_HEIGHTS`) y los que van siempre en oscuro (`DARK_PREVIEWS`);
  - los ejemplos se diseñan para un ancho de 800px (`VIEWPORT_WIDTH`, que este cambio mueve a `cards.ts`);
  - `VisualExample.tsx` pinta el ejemplo por nombre: en `/visual/<slug>/` es una isla `client:load`, y en la página de cada componente, `client:visible`.
- **El tema** se aplica con la clase `dark-mode` sobre `<html>`. Los tokens funcionan igual con esa clase en cualquier contenedor, y así pintan su raíz los componentes de Stream.
- **Scaena** (`components/studio/OverlaySources.tsx`):
  - `Scaled` pinta la pieza dentro de un `div` con `overflow-hidden` y tamaño fijo, y la encoge con `transform: scale()`;
  - cada pieza lleva sus propios datos de ejemplo, no un ejemplo compartido;
  - el recuadro tiene un fondo de cuadros (`CHECKER`, con `--bg-secondary`) que indica transparencia.
- **`StreamStage`** (lo usan `StreamScene` y `ChannelBanner`) mide su contenedor con un efecto y es invisible hasta tener la medida, salvo que reciba una `scale` fija.
- `sharp` solo lo usa `src/lib/previews.ts`. La web no usa `astro:assets`.

## Goals / Non-Goals

**Goals:**
- Que cada card enseñe el componente en su forma más característica, con el componente real, sin capturas ni JavaScript, legible a tamaño de miniatura.
- Que la página no empeore: ni accesibilidad, ni teclado, ni rendimiento medible.

**Non-Goals:**
- Hacer interactivas las vistas previas: para eso está la página del componente.
- Cambiar los ejemplos del registro, que comparte la paridad visual.
- Tocar las capturas aprobadas o los tests visuales.

## Decisions

### D1. La muestra se pinta en el servidor, sin isla
`index.astro` pinta la muestra de cada componente sin directiva `client:*`. Astro la renderiza con React en el build y no envía JavaScript. Lo que los componentes hacen en efectos (el `indeterminate` de `Checkbox`, medidas…) no se ejecuta. Por eso la muestra se elige para que no dependa de ello (D7).
*Alternativa:* `client:visible`. Se descarta: 78 islas en una página que solo enseña miniaturas.

### D2. Una muestra característica por componente, no el ejemplo entero
Decisión del usuario tras la prueba de seis cards: el ejemplo del registro enseña muchas variantes a la vez y en miniatura no se lee. La card enseña una sola muestra con lo más característico del componente: un `Button` primario con icono, un `Input` con etiqueta y valor, unas filas de `Table`…

- **Dónde:** `src/visual/thumbnails.tsx` define `THUMBNAILS[name]` = `{ render, scale? }`. `render` devuelve la muestra con datos de ejemplo propios, como las piezas de Scaena. El ejemplo del registro no se toca.
- **Tamaño:** el escenario mide `PREVIEW_BOX` = 288×180 (16/10), que cabe en la card más estrecha (una columna a 390px y tres en `xl`). La muestra va centrada a su tamaño natural; `scale` (opcional, menor que 1) la encoge desde el centro cuando es más grande que el escenario (`Table`, `CalendarView`, escenas de Stream…). No se mide nada en el navegador.
- **Sin muestra:** un componente nuevo que aún no la tenga enseña su ejemplo entero, a 800px y encogido para caber (`thumbOf` en `src/visual/thumbs.ts`). Así el build nunca falla por eso. Un test exige muestra para todos los del catálogo, igual que exige ficha y captura.

*Alternativas:*
- Encuadrar una zona del ejemplo del registro (la primera versión de este design, con `THUMBS` y zonas calculadas de las capturas). Se descarta: el ejemplo junta variantes y estados, y la zona solo recorta el montón.
- Medir el contenido con JS para recortar solo. Se descarta por D1.

### D3. La vista previa va fuera del enlace
Botones, campos y enlaces dentro de un `<a>` son HTML no válido, aunque estén inertes. Así que la card pasa a ser:

- **Contenedor:** el `<li>`, con `relative`.
- **Vista previa:** un `div` con `inert`, `aria-hidden="true"`, `pointer-events-none` y `data-pagefind-ignore`.
- **Enlace:** debajo, el `<a>` con el nombre y la descripción. Su `after:absolute after:inset-0` cubre toda la card, así que un clic en cualquier parte, también en la vista previa, abre la página del componente.

El nombre accesible del enlace sigue siendo el nombre y la descripción. El foco y el hover se pintan en el `<li>` con `has-[a:focus-visible]` y `has-[a:hover]`, con el mismo aspecto de hoy.
*Alternativa:* dejarla dentro del `<a>` con `inert`. Se descarta por el HTML no válido y porque algunos lectores siguen leyendo contenido inerte dentro de enlaces.

### D4. Tema, Stream y fondo de cuadros
- **Tema:** el recuadro usa el fondo de la página (`bg-primary`), que cambia solo con el tema. Si el componente está en `DARK_PREVIEWS`, el recuadro lleva la clase `dark-mode` y va en oscuro en los dos temas.
- **Fondo de cuadros:** todo el recuadro lleva un damero sutil, el `CHECKER` de Scaena: cuadros de 8px en `--bg-secondary` sobre `bg-primary`. Indica que alrededor del componente no hay nada, como en un editor. Petición del usuario. Va con tokens, así que sigue el tema, y su contraste es bajo a propósito para no competir con el componente.

### D5. Rendimiento y movimiento
- **Pintado:** cada escenario lleva `content-visibility: auto` con `contain-intrinsic-size: 288px 180px`, así que las cards fuera de pantalla no se maquetan ni se pintan.
- **Movimiento:** se eligen muestras quietas. Si un componente se anima solo (spinners, entradas de Stream), la muestra lo enseña en un estado estable.
- **Medición:** antes y después, de dos formas, porque Lighthouse no se puede ejecutar en esta máquina. En local, `scripts/measure-page.ts` mide el peso del HTML y de lo que pide la página, los nodos del DOM y los tiempos de maquetación, de estilos y de tareas, con emulación móvil. En el CI, `/components/` se añade a las `url` de `lighthouserc.json` (con el mismo umbral de 0,9 que las demás), y un primer commit de la PR con solo eso da la nota de Lighthouse antes del cambio. Se acepta el cambio si la aserción de `lhci` (mediana de tres pasadas) sigue pasando, si la ejecución representativa no empeora y si la medida local no empeora sin razón. Decisión del usuario.

### D6. Lo que se quita
- **Ficheros:** `src/lib/previews.ts`, `src/pages/components/previews/[file].webp.ts` y `test/previews.test.ts`.
- **Dependencia:** `sharp` de `apps/docs/package.json` (y su rastro en `bun.lock`).
- **e2e:** el de las cards de `e2e/components.spec.ts` se reescribe para las vistas previas: en vivo, inertes, tema y clic.

El README de `apps/docs` deja de decir que las fotos del índice salen de las capturas.

### D7. Lo que solo se ve con JavaScript
`StreamStage` (`StreamScene` y `ChannelBanner`) es invisible hasta medir su contenedor, y sin JavaScript no mide. En la prueba de las 78 cards con el ejemplo entero fueron las dos únicas que salieron en blanco. Con muestras propias, su muestra les pasa una `scale` fija, que `StreamStage` ya admite y con la que no mide nada.
- **Red:** un e2e comprueba que ninguna vista previa sale vacía. Un componente nuevo que dependa de un efecto no pasa desapercibido.

*Alternativas* (de la primera versión): una regla CSS que forzaba el lienzo visible con una escala de `THUMBS` (acoplada a las clases internas de `StreamStage`); hidratar esas dos; y cambiar `StreamStage` en el paquete. Las tres sobran con la `scale` de la muestra.

## Risks / Trade-offs

- **[78 muestras que mantener]** Un componente que cambia de API puede romper su muestra → la muestra usa el paquete con sus tipos (`astro check` y el build fallan si no compila). El test de catálogo exige una muestra por componente.
- **[La muestra no es el ejemplo que compara la paridad visual]** → La muestra usa el componente real del paquete, así que su aspecto es el que ya vigila la paridad. Solo cambian los datos y la variante.
- **[Ids repetidos]** Las muestras usan `useId` → Un e2e comprueba que `/components/` no repite ningún id. Lo hizo saltar `Dropdown` con `defaultOpen`: su panel en línea iba dentro de `MenuTrigger` y cada opción recibía las props del botón (también su `id`). Se arregló en el paquete (decisión del usuario): el panel va fuera de `MenuTrigger`, y etiqueta, descripción y atajo van en sus huecos de React Aria, con un test de SSR y un changeset *patch*.
- **[DOM grande]** → Las muestras son mucho más pequeñas que los ejemplos enteros (una variante en lugar de todas), más `content-visibility` (D5) y la medida antes y después.
- **[Card más estrecha que 288px]** → A 390px la card mide unos 326px de ancho útil. Por debajo, el escenario se recorta por los lados (`overflow-hidden`), sin romper la card.

## Migration Plan

1. **Prueba** con seis componentes de tipos distintos: Button (pequeño), Input (formulario), Table (ancho), DatePicker (capa abierta), StreamAlert (oscuro y animado) y StreamScene (1920). Se revisa con la persona usuaria antes de seguir. La primera versión (ejemplo entero encuadrado) se revisó así, y de esa revisión salieron D2 y el fondo de cuadros de D4.
2. Las 78 muestras, la limpieza de D6 y los tests.
3. PR con la medida de D5 y las capturas de la página en claro y en oscuro.

Vuelta atrás: revertir la PR. Las capturas aprobadas no se tocan, así que el recorte con `sharp` vuelve a funcionar tal cual.
