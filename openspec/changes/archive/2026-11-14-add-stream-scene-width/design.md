# Design

## Context

- `StreamScene` pasa `width={1920} height={1080}` fijos a `StreamStage`, que ya escala por `width`: con `scale`, el contenedor mide `width × scale`; sin él, `aspectRatio` y la escala medida salen de `width` y `height`.
- La cuadrícula es `absolute inset-0` con la máscara `radial-gradient(ellipse 70% 65% at 50% 50%)` (`streamGrid`), el pie es `absolute right-20 bottom-14 left-20` y el bloque central `inset-[0_0_128px_0]` con `px-[240px]` y contenido centrado.
- `HeaderNav` pinta dos filas: escritorio (`@max-5xl:hidden`) con `actions` y móvil (`@5xl:hidden`) con la marca y el botón de menú o `mobileBar`. `actions` solo existe en la de escritorio.
- `ProgressSteps` con `onChange` mete marcador, título y descripción en el botón; el nombre es el título (`aria-labelledby`) y la descripción va en `aria-describedby`, así que el texto visible no coincide con el nombre.

## Goals / Non-Goals

**Goals:**
- Sin las props nuevas, el HTML de los tres componentes no cambia (en `ProgressSteps`, sin `onChange`).
- Escenas a 21:9 sin tocar nada más del componente.

**Non-Goals:**
- Altos distintos de 1080 o anchos por debajo de 1920 en `StreamScene`.
- Una página a tamaño real en 21:9 (`/full/` sigue a 1920).

## Decisions

### D1. `width` en `StreamScene`
`width?: number`, normalizado con `canvasWidth`: si es un entero de al menos 1920 se usa; si no (decimal, menor, `NaN`, infinito), 1920. Se pasa a `StreamStage` en lugar del 1920 fijo. Nada más cambia: la cuadrícula y el pie se estiran solos y el bloque central sigue centrado con el mismo relleno. Sin `width`, el HTML es idéntico byte a byte al de antes (comprobado con `renderToString` de las cuatro variantes, con y sin `scale`).

### D2. La máscara de la cuadrícula se queda en porcentajes
Con `70% 65%`, a 2580 la elipse mide 1806×702 en vez de 1344×702: se ensancha con el lienzo y el desvanecido llega a los bordes en la misma proporción que a 1920. Las celdas siguen cuadradas (su tamaño va en px). Con radios fijos centrados (1344×702 px), la rejilla se apagaría antes de los laterales y quedarían dos franjas vacías, justo lo contrario de lo que se busca. Revisado en las capturas a 3440×1440 con el contraste subido: no se ve estirada.

### D3. Ejemplo en 21:9 en la ficha
Bloque «En 21:9» bajo el ejemplo interactivo de `StreamScene` (`WideScene.astro`), con la escena real a `width={2580}` ajustada a la columna y su código para 3440×1440. La escena va en su propia isla (`WideSceneCanvas`) que la importa por nombre, como `CodeSnippetIsland`, para no llevarse el índice del paquete al JS de la página.

### D4. Capturas a 3440×1440
Página de prueba `/visual/stream-scene-wide/` con las cuatro variantes (`width={2580}`, `scale={4/3}`, cuenta atrás en pausa) y un e2e que comprueba 3440×1440, el pie a 80 px lógicos (106,67 px reales) de cada borde y el titular centrado, y compara con capturas aprobadas a tamaño real (`e2e/visual/approved-wide/StreamSceneWide-<variante>-dark.png`, fuera de `approved/`, que solo admite una por componente del catálogo y tema). `APPROVE_WIDE=1` las regenera.

### D5. `mobileActions` en `HeaderNav`
Una prop y no un cambio por defecto: pintar `actions` en móvil sin pedirlo cambiaría el HTML de quien ya lo usa y podría no caber (acciones con texto). Con `mobileActions`, la fila móvil lleva marca, `actions` y el botón de menú (o `mobileBar`) en un grupo `flex-none`. `actions` se pinta dos veces en el HTML, como ya pasa con la marca: la ficha avisa de no poner `id` fijos.

### D6. Descripción fuera del botón en `ProgressSteps`
Con `onChange`, el botón lleva solo marcador y título; la descripción va justo después del botón, dentro de un envoltorio `flex flex-col` que ocupa el sitio del botón, y sigue enlazada con `aria-describedby`. En horizontal queda centrada bajo el título; en `text-line`, bajo el título; en vertical, sangrada hasta la columna del título. En vertical el botón mide lo que el marcador (32 px en `md`), así que la descripción queda unos px más abajo que sin `onChange`; se acepta para que el anillo de foco rodee entero al marcador. Los tipos mínimos no tenían descripción visible y no cambian. `label-content-name-mismatch` es una regla experimental de axe que no corre por defecto y en jsdom no evalúa nada: se comprueba en Playwright pidiéndola por nombre (`/visual/progress-steps-nav/`).

## Risks / Trade-offs

- [La descripción ya no es parte del área pulsable] → El marcador y el título bastan como objetivo; es lo que pide WCAG 2.5.3.
- [`actions` duplicado en el HTML con `mobileActions`] → Documentado en la ficha y en el JSDoc.
