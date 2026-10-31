# Notas de traspaso

Lo que no cabe en las casillas de `tasks.md` ni en `design.md`. Léelo antes de seguir con `/opsx:apply`.

## Estado (31 oct 2026)

57 de 63 tareas. Hechos los grupos 1 a 12, la 13.1 y la 13.2. Lo siguiente: 13.3 (CI y publicación en GitHub Actions). De aquí en adelante hay acciones fuera del repo (GitHub, Vercel, DNS, npm): pedir confirmación al usuario antes de cada una.

Decisiones de la 11.3 (ya anotadas en sus páginas): títulos con encabezado real (PageHeader `<h1>`, SectionHeader `<h2>`, CardHeader e InlineCTA `<h3>`; en el bundle los dos últimos eran `div`); CardHeader admite `menuLabel` y `menu` como nodo, igual que MetricCard; línea común en `internal/line.tsx`. Paridad 0,000 % en las seis; mutación (gap 8→32px en ContentDivider) vista por el comparador pero bajo el 2 % (ojo: la vista previa no usa `dual` ni se nota el relleno de `fill`, así que esas mutaciones no se detectan). Axe con contraste real sobre sus páginas `/visual/` en claro y oscuro: sin fallos.

Decisiones de la 11.4 (ya anotadas en sus páginas):
- BackgroundPattern: sin `"use client"` (usa `useId`, válido en servidor, para el id del patrón de puntos). Máscaras con `black`/`transparent` en `style` (solo cuenta el alfa).
- BrowserFrame: los iconos de navegación son decorativos (es una maqueta); se ocultan por debajo de 560px de ventana, como el bundle.
- CreditCard: ampliación `aria-label` (por defecto resume los datos; el texto por defecto tiene que poder sustituirse). Si `company` no es texto, no entra en la etiqueta.
- VideoPlayer: `"use client"`. El botón central es un atajo de ratón (`tabIndex=-1`, `aria-hidden`): con teclado se usa el de la barra, que es el mismo control y así no hay dos "Reproducir". La posición lleva `aria-valuetext` ("1:05 de 4:12"). Ampliación `labels` (todos sus textos).
- **Corrección de la referencia de BackgroundPattern** (`REFERENCE_FIXES`): el `<code>` del pie de cada muestra salía en el monospace del navegador (línea de 21px en vez de 20) y bajaba la segunda fila (1,7 % en oscuro). Solo afecta al pie de la vista previa. Recapturada solo BackgroundPattern.
- Paridad: BackgroundPattern 0,000 % (mutación sin máscara en una muestra: el comparador la ve, 0,2 %), BrowserFrame 0,000 %, CreditCard 0,000 %, VideoPlayer 0,01 %. Axe con contraste real en sus páginas `/visual/`: solo la excepción documentada de `text-success-primary` con icono (la tendencia de MetricCard dentro del marco).

## Cómo se porta cada componente

1. Leer su ficha (`reference/components/<Nombre>/README.md`), su vista previa (`preview.html`), sus tipos en `reference/components/index.d.ts` y su implementación en `bundle.js` / `bundle.css`. Las clases `.jm-*` se traducen a utilidades de tokens (ver `packages/react/src/components/Button.tsx` como modelo).
2. Componente en `packages/react/src/components/<Nombre>.tsx`; `"use client"` solo si tiene estado o efectos. Exportarlo en `src/index.ts`.
3. Tests en `packages/react/test/`: props, estados, teclado y `expectAccessibleInThemes` (axe en claro y oscuro).
4. Paridad visual: portar `preview.html` a JSX en `apps/docs/src/visual/examples/` y registrarlo en `apps/docs/src/visual/registry.ts`. El test `apps/docs/e2e/visual.spec.ts` lo compara solo con la referencia (`e2e/visual/reference/<Nombre>-{light,dark}.png`): mismo tamaño y menos del 2 % de píxeles distintos. Si un 0,000 % parece sospechoso, haz una prueba de mutación (cambia una clase y comprueba que falla).
5. Animaciones: los `@keyframes` `spin` y `pulse` de Tailwind con el tiempo de la guía en valor arbitrario (`motion-safe:animate-[pulse_1.4s_ease-in-out_infinite]`); Tailwind solo emite los keyframes que se usan. `prefers-reduced-motion` se comprueba con CSS real en `apps/docs/e2e/motion.spec.ts`.
6. Colores: `bun run check:colors` en `packages/react`. Excepciones: ficheros enteros en `ALLOWED` (AppIcon, CreditCard, BrowserFrame, VideoPlayer) o una línea con `// color-fijo: <motivo de la guía>` encima.
7. Página de la web: `apps/docs/src/content/components/<slug>.md` (frontmatter `name`, `description`, `interactive`, `astroNote` opcional, `source` si los tipos no están en `packages/react/src/components/<Nombre>.tsx`; cuerpo = la ficha sin su primera línea) y su uso en `apps/docs/src/lib/snippets.ts`. Los ejemplos salen solos del registro visual. Defaults de props con tipos unión: `@default` en el JSDoc (react-docgen no los ve en la desestructuración). `e2e/components.spec.ts` y `e2e/a11y.spec.ts` recogen las páginas nuevas sin tocarlos.

## Pendientes sueltos

- **Campos de formulario:** `internal/field.tsx` (`FieldShell`, `controlClasses`, `describedBy`) es la base común de Input, Textarea y Select; úsala en los demás campos (DatePicker, ColorPicker, MessageInput…). Foco: la ficha pide el borde de 2px `border-brand` y el spec además el anillo de la guía, así que con teclado (`has-[:focus-visible]`) se suman los dos; en error, `border-error` + `focus-ring-error-shadow`. Sin jest-dom: los tests usan `getAttribute` y `document.activeElement`.
- **Casillas e interruptores:** `internal/choice.tsx` reúne la caja, el punto y los textos. Checkbox y Radio son `<input>` nativos (estilo con `peer-*` y `group-has-[:checked]`); RadioGroup y Toggle van sobre React Aria (estilo con `group-data-selected`, `group-data-focus-visible`…). Decisión del usuario, anotada en design §5.
- **Servidor de la web en los tests:** `playwright.config.ts` reutiliza lo que haya en el puerto 4321. Si tienes `astro dev` abierto, los tests corren contra dev, donde Tailwind solo genera las clases de los módulos ya cargados (sin JS faltan reglas). Para verificar contra el build real, cierra dev o usa una config temporal con `astro preview` en otro puerto.
- **Umbral del 2 % en la paridad:** pixelmatch además tolera grises cercanos (`bg-tertiary` → `bg-quaternary` en claro da 0 %), y el umbral deja pasar desplazamientos pequeños (una mutación de 6px de padding en Textarea dio 0,4 %). Revisa también las capturas a ojo, no solo el resultado del test.

- **Badge `modern` (diferencia aceptada):** la ficha dice "blanca con sombra" y así está portado (`bg-primary`, `text-secondary`). En la vista previa de la guía sale con fondo y texto del color porque en `bundle.css` la regla `.jm-c-*` va después de `.jm-badge-modern` y la pisa. Manda la ficha (design.md §7); la paridad pasa igual (< 2 %). Anotado en la página de Badge.
- **Diferencias aceptadas de la 8.3 (ya anotadas en sus páginas):** FileUpload muestra "12,5 KB" donde la guía dice "13 KB" (usa `formatBytes` con un decimal, igual que el resto). Slider es `inline-block` como el range nativo; en la paridad queda 1px más abajo por el interlineado del preflight de la web (0,8–1,5 %).
- **DatePicker (8.4), decisiones (ya anotadas en su página):**
  - Va sobre `Calendar`/`RangeCalendar` de React Aria (con `@internationalized/date`) dentro de un `Popover` + `Dialog`; inline es un `<fieldset>` con nombre. El "hoy" lo pinta el componente desde la prop `today`, no desde el reloj de React Aria.
  - Un preset sin `end` en modo rango es un rango de un día, así que se puede aplicar ("Hoy"). En el bundle dejaba Aplicar desactivado; la ficha no dice nada.
  - En rango, mientras solo hay el primer clic, el pie sigue mostrando el rango anterior: React Aria no expone el ancla. El calendario sí marca el día.
  - Las celdas de fuera del mes las pinta React Aria; se ocultan con `hidden` (fuera también del árbol accesible).
  - Pendiente de mirar a ojo: el modo con disparador (popover). La paridad solo cubre el inline de la vista previa; los tests sí cubren apertura, teclado, Escape y foco de vuelta.
- **Decisiones de la 8.5 (ya anotadas en sus páginas):**
  - ColorPicker va sobre `ColorArea` y `ColorSlider` de React Aria (ratón, táctil y flechas; cada eje es un slider con nombre en castellano). Los colores fijos (mando blanco, filo negro al 10 %, valor inicial) llevan `// color-fijo:`. Paridad 0,000 %, comprobada con una mutación (1 %).
  - TextEditor: la etiqueta es un `<span>` que nombra el área con `aria-labelledby` (un `contentEditable` no admite `<label for>`). El recuento usa `innerText`, como la guía, así que los saltos entre bloques cuentan. El texto de `maxLength` pasa a ser "421 caracteres restantes", como en la vista previa (antes el diccionario decía "Quedan N caracteres"). Probado en Chromium real: negrita y recuento.
  - MessageInput: Enter no envía mientras hay un método de entrada (IME) a medias; acepta `attachLabel` y `aria-label`.
- **Decisiones de la 9.1 (ya anotadas en sus páginas):**
  - Tabs: prop opcional `children: (id) => ReactNode` para el panel activo (ampliación sobre la guía, design §5); sin ella no hay `aria-controls`. Tamaño por defecto `sm`, como el bundle. En `underline`, la pestaña activa con foco de teclado suma el subrayado y el anillo (en el bundle el subrayado tapaba el anillo).
  - Breadcrumbs: un elemento sin `href` que no es el último se pinta como texto, no como `<a href="#">` (el bundle); el de solo icono lleva su `label` en `sr-only` (en el bundle el enlace quedaba sin nombre). Acepta `aria-label` (por defecto "Migas de pan").
  - Pagination: cada número se llama "Página N"; `labels` sustituye Anterior, Siguiente, "Paginación" y ese nombre. Pulsar la página actual no avisa. El recorte copia el del bundle (en la 3 de 10 sale `1 2 3 … 8 9 10`).
  - Paridad 0,000 % en las tres; la prueba de mutación (gap 12→32px en Tabs) dio 0,5 %: el comparador ve el cambio, pero cae bajo el umbral del 2 %.
- **Decisiones de la 9.2 (ya anotadas en sus páginas):**
  - Dropdown (design §5): con ratón React Aria enfoca el menú y con teclado (Enter, espacio, flechas) el primer o el último ítem. `aria-haspopup="true"` (equivale a `menu`). Ampliaciones: `onOpenChange` (sin él, `open` controlado no sirve de nada) y `textValue` por ítem para la búsqueda por teclado cuando `label` no es texto. El `trigger` propio tiene que pasar `ref` y props al DOM. Probado en Chromium real con un spec temporal: teclado, Escape, foco de vuelta y clic fuera.
  - SidebarNav: sin `href` el ítem se pinta como texto (como Breadcrumbs). Ampliaciones: `onLogout` (en el bundle el botón de salir no hacía nada) y `labels` (nav "Principal", "Buscar", "Cerrar sesión").
  - FilterBar: `labels` (Vista, Buscar, Filtros, Limpiar todo); el botón se llama "Filtros 2" con filtros activos. SidebarNav y FilterBar no llevan `"use client"`.
  - `Button` ahora es `forwardRef` (lo pide `Pressable`); los ejemplos Next y Astro siguen pasando.
  - Paridad 0,000 % en las tres.
- **Decisiones de la 9.3 (ya anotadas en sus páginas):**
  - CommandMenu: `ModalOverlay` + `Modal` + `Dialog` de React Aria (foco atrapado, Escape, clic fuera, foco de vuelta) y lista propia con `role="combobox"` + `aria-activedescendant`, como el bundle: el primer resultado está activo sin escribir y Enter lo ejecuta (el `Autocomplete` de React Aria no marca ninguno hasta escribir). Sin resultados se pinta un `role="status"` en lugar de un listbox vacío. `contained` pinta un `div role="dialog"` sin atrapar el foco (vistas previas). La lista se desplaza sola sin mover la página. `labels` sustituye sus textos. El atajo ⌘K global no es del componente (13.1). El input conserva el relleno del navegador que tiene en la guía (`px-0.5 py-px`): sin él la paridad daba 1,7 %.
  - TreeView: `Tree` de React Aria (`role="treegrid"`). Clic, Enter o espacio eligen la fila y abren o cierran la carpeta (también si ya estaba elegida, como el bundle); las flechas mueven el foco sin elegir, y → ← abren y cierran. La selección va por el `onPress` de cada fila, porque en modo `toggle` React Aria deja de llamar a `onAction` en cuanto hay algo elegido. Al entrar con Tab el foco va a la fila elegida. Ampliación: `textValue` por elemento.
  - Piezas comunes nuevas: `internal/kbd.tsx` (también en Dropdown) y `internal/overlay.ts` (fondo `bg-overlay/70` + desenfoque de 16px; para Modal y Slideout en la 10.1).
  - Paridad 0,000 % en las dos. Probado en Chromium real con un spec temporal (ya borrado): flechas, filtro, estado vacío, ratón y foco del árbol. Ojo: en las páginas `/visual/` un Tab antes de hidratar la isla deja el foco en el contenedor del HTML de servidor; hay que esperar a `astro-island:not([ssr])`.
  - En una pasada completa de Playwright falló una vez el axe de `/components/checkbox/` (claro); no se repitió ni suelto ni en la pasada siguiente. Vigilarlo.
- **Cambios de la 9.4:**
  - Dropdown con `defaultOpen` pinta el panel en línea bajo el botón (posición absoluta, como la guía); al abrirlo el usuario va al popover de React Aria. En la página, el popover flotante se daba la vuelta, se recortaba a la ventana y se cerraba al desplazar (design §5).
  - TreeView envuelve el `Tree` en un `div` (recibe `className` y `max-w-[280px]`): React Aria deja una `<template>` y marcadores ocultos junto al árbol, y la isla quedaba sin un primer hijo visible.
  - `CodeTabs.astro`: el `<pre>` es enfocable (`tabindex=0`, nombre "Código para …", anillo interior), porque axe (`scrollable-region-focusable`) lo pide cuando una línea no cabe y el bloque se desplaza.
- **Decisiones de la 10.1 (ya anotadas en sus páginas):**
  - Modal y Slideout comparten `internal/layer.tsx`: sobre la página, `ModalOverlay` + `Modal` (solo coloca, `contents`) + `Dialog` (el panel, con las clases); con `contained`, un `div role="dialog"` no modal dentro del contenedor, sin atrapar el foco (Escape en el panel y clic en el fondo siguen cerrando). Nombre por el título (`aria-labelledby`) y descripción (`aria-describedby`).
  - Sin `onClose` no hay X y ni Escape ni el clic fuera cierran (un aviso que obliga a decidir). `open` vale `true` por defecto, como el bundle (`open={false}` no pinta nada).
  - `destructive` solo pone el icono en `error`; los botones los pasa quien usa el modal.
  - `examples/next/app/interactivo` ya tiene el Modal que piden design §10 y el spec (página de servidor + envoltorio de cliente `borrar-gasto.tsx` para el estado). Su test comprueba en Chromium foco atrapado, Escape, foco de vuelta, página bloqueada (`overflow: hidden`) y el fondo al 70 % con `blur(16px)`, sin avisos en consola.
  - Paridad: Modal 0,000 %, Slideout 0,01 %.
- **Decisiones de la 10.2 (ya anotadas en sus páginas):**
  - Tooltip: `TooltipTrigger` + `Focusable` + `Tooltip` + `OverlayArrow` de React Aria (ratón con 300 ms de retraso, foco con teclado, Escape, `aria-describedby`); el hijo tiene que pasar `ref` y props al DOM, como `Button`. Con `open` (forzado, vistas previas) se pinta en línea sobre el disparador, como Dropdown. En jsdom el ratón no lo abre (React Aria necesita eventos de puntero reales): el ratón se probó en Chromium con una página temporal (10px por encima y centrado; ojo: un `hover()` de Playwright en una página recién abierta salta de golpe y React Aria lo ignora; con un movimiento en pasos funciona).
  - Alert: sin `"use client"`; `status`, o `alert` si es error; icono por color; la X se llama "Descartar" (`closeLabel`). Notification comparte el cuerpo (`alertBody` en Alert.tsx).
  - Notification: `autoClose` (6000 ms por defecto, `false` para quitarlo; ampliación decidida con el usuario): solo con `onClose` y sin `actions`; el tiempo se para con el ratón encima o el foco dentro. La colocación abajo a la derecha y el apilado son de la app.
  - Banner: icono como el bundle (48px, `modern`/`light`; decisión del usuario, design §7). `<section aria-label>` (región), cuenta atrás `role="timer"` con su texto en `aria-label`, formulario de correo con `Input` `type="email"` obligatorio. En ≤720px se apila y oculta el icono (comprobado con captura a 600px). `closeLabel` cambia "Cerrar aviso".
  - Paridad 0,000 % en las cuatro.
- **10.3:** EmptyState sin `"use client"`, título en `<h3>` como el bundle, icono por defecto `search-lg`. Paridad 0,000 %.
- **10.4:** la página de Modal recoge la regla "una acción principal por modal". Banner en `brand`: las unidades de la cuenta atrás pasan a `text-primary_on-brand` (con `text-tertiary_on-brand` sobre la celda daban 4,40:1 y axe lo marcaba; decisión del usuario, anotada en la página). Tooltip lleva `astroNote`: su disparador tiene que ser un componente React.
- **Decisiones de la 11.1 (ya anotadas en sus páginas):**
  - Table: sin `"use client"`. La tabla se llama como el título (`aria-labelledby`). El desplazamiento horizontal va en una caja interior enfocable (`tabIndex=0`, región con el título) para que una tabla ancha se pueda recorrer con teclado; la tarjeta exterior recorta las esquinas. Por fuera, igual que la guía. Clave de fila: `row.id` o el índice.
  - MetricCard: sin `"use client"`; la tendencia lleva flecha y un "Sube"/"Baja" solo para lectores de pantalla. Ampliaciones: `menu` admite también un nodo (un `Dropdown` con `trigger`), `onMenu` y `menuLabel` ("Más opciones"); en la guía el botón no hacía nada.
  - ActivityFeed: sin `"use client"`; `<ol>`; el punto de "sin leer" lleva el texto en `sr-only` (en el bundle era un `aria-label` en un `span`).
  - Paridad 0,000 % en las tres.
- **Decisiones de la 11.2 (ya anotadas en sus páginas):**
  - Message: sin `"use client"`; los puntos de "escribiendo" llevan "Escribiendo" en `sr-only` y solo se animan con movimiento (`motion-safe`).
  - CalendarView: una `<table>` de verdad (cabeceras Lu…Do, una fila por semana) en lugar del `div role="grid"` sin filas del bundle, que es ARIA no válido. Cada día lleva su fecha completa para lectores de pantalla ("jueves, 29 de octubre, hoy"); con `onSelectDate`, el número es un botón (teclado) y la celda entera responde al clic. El mes se anuncia al cambiarlo (`aria-live`). Los chips usan las clases de `Badge` (`COLOR` exportado internamente desde Badge.tsx).
  - CodeSnippet: pestañas con flechas y `tabpanel`; el `<pre>` es enfocable (desplazamiento con teclado); "Copiado" también se anuncia (`aria-live`). El resaltado es el de la guía (`highlight` en CodeSnippet.tsx).
  - **Corrección de la referencia de CodeSnippet:** en la vista previa de la guía el `<code>` no heredaba Geist Mono del `<pre>` (salía el monospace del navegador) y la paridad daba 2,5 % en oscuro. La ficha pide Geist Mono, así que `e2e/visual/reference.ts` tiene ahora `REFERENCE_FIXES` (CSS por componente, solo para fallos de la vista previa que contradicen su ficha) y se recapturó solo CodeSnippet. Comprobado antes: con esa corrección, nuestro componente daba 0,000 % frente a la guía.
  - Paridad: Message 0,000 %, CalendarView 0,05 %, CodeSnippet 0,000 % (con la referencia corregida).
- **Axe y la hidratación (`e2e/a11y.spec.ts`):** el fallo intermitente de la 9.3 (Checkbox) y otro igual en ColorPicker (`label` en un id de React Aria) eran axe pasando mientras se hidrataba una isla. El test espera ahora a que se hidraten las islas a la vista (mirando la caja de sus hijos: `astro-island` es `display: contents` y mide 0). Una pasada con el equipo muy cargado (14 min en vez de 1,4) dio un tiempo agotado dentro de axe, no una infracción.
- **Ojo con `astro dev` abierto:** en la 10.1 apareció uno en el 4321 a mitad de la tarea y las capturas salieron con la barra de herramientas de dev. Para verificar contra el build sin cerrarlo: una config temporal de Playwright con `astro preview` en el 4322 y `reuseExistingServer: false`.
- **Ejemplos y texto largo de la web:** las reglas `.prose …` de `global.css` llevan `:not(.not-prose *)`; el contenedor de ejemplos es `.not-prose`. Sin eso, las tablas, listas y párrafos de los componentes (calendario de DatePicker, listas de TextEditor) cogían el estilo de la web. Lo vigila un test de `e2e/components.spec.ts`.
- **Excepciones de contraste en axe (`e2e/a11y.spec.ts`):** solo las de la guía para `text-success-primary` / `text-warning-primary` y solo si el elemento lleva un icono dentro ("Completado" de FileUpload). Si una página nueva falla por contraste con otro token, no es excepción.
- **Textos nuevos sustituibles:** `FileUpload`, `DatePicker` y `TextEditor` aceptan `labels` (objeto parcial con todos sus textos); `Badge`/`Tag` aceptan `removeLabel` y `Avatar` `statusLabel` (no están en `index.d.ts`; los pide el requisito de textos sustituibles).
- **Notas de uso de tokens**: traducidas en `packages/tokens/src/tokens.json` con `packages/tokens/scripts/translate-usage.ts`. Si se reimporta `tokens.json`, volver a pasar ese script.
- **Banner con cuenta atrás y CalendarView/DatePicker**: sus vistas previas fijan la fecha (`now`, `today`); al portarlos, la paridad visual depende de respetar esas props.

- **Clases montadas en tiempo de ejecución:** Tailwind solo genera las clases que ve escritas en el código. Una clase compuesta en tiempo de ejecución (`text-${size}`) solo existe si otro módulo la usa (en dev, uno ya cargado). Las muestras de tipografía y sombras de la web se pintan por eso con los valores del token en `style` (tamaño, interlineado y peso; `var(--shadow-…)`), y `e2e/tokens.spec.ts` lo comprueba.

- **11.5 y contraste:** el axe de la web (CSS real) encontró dos colores de la guía bajo 4,5:1 que jsdom no podía ver. Decisión del usuario (design §7): comentarios de CodeSnippet en `utility-green-700` y "N más…" de CalendarView en `text-quaternary`. Ojo en los grupos que quedan: pasa axe con contraste (la página o `/visual/`) en la misma tarea en que portas el componente, no solo en la de las páginas.
- **Varios `<h1>` en una página de componente:** el ejemplo de PageHeader pinta el suyo; `e2e/components.spec.ts` comprueba el primero.

- **Decisiones de la 12.1 (ya anotadas en sus páginas):**
  - Las gráficas son de servidor (sin `"use client"`): los valores van en `<title>` de SVG, sin estado. `format` funciona también en Astro sin isla.
  - Leyenda automática desde dos series, como el bundle y la ficha de ChartLegend; cumple la spec ("con tres o más") y la guía ("con tres o más, siempre"). `legend` la fuerza o la quita. PieChart la lleva siempre salvo `legend={false}`.
  - ChartLegend es una lista (`<ul>`); en el bundle eran `span` sueltos.
  - Ojo con `toLocaleString("es-ES")`: no agrupa números de cuatro cifras ("1500"). La vista previa de la guía lo usa así; en las apps, usa `formatNumber`/`formatCurrency` del paquete, que fuerzan la agrupación.
  - Paridad 0,000 % en las cuatro. El relleno del área (marca al 8 %) cae dentro de la tolerancia de color del comparador: una mutación sin área dio 0 %; quitar la leyenda sí falla. El área se comprobó a ojo.

- **Búsqueda de la web (13.1):** `src/search/SiteSearch.tsx` (isla `client:idle` en la cabecera de `Base.astro`) une el índice propio `/search-index.json` (páginas, componentes, tokens e iconos; lógica en `src/search/entries.ts`, con tests en `test/search.test.ts`) y el texto completo de Pagefind (`astro build && pagefind --site dist`; solo indexa `<main data-pagefind-body>`, sin los ejemplos vivos, que llevan `data-pagefind-ignore`). En `astro dev` no hay índice de Pagefind: la búsqueda funciona solo con el índice propio. Un icono lleva a `/icons/?icono=<nombre>`, que lo filtra y lo elige. CommandMenu gana `onQueryChange` y `filter={false}` (ampliación, anotada en su página), y su etiqueta ya no se parte en dos líneas.
- **Tests con la isla en el layout:** `test/component-page.test.ts` necesita el renderer de React en el contenedor (`loadRenderers([getContainerRenderer()])`).
- **Intermitentes con el equipo muy cargado** (pasada de 20 min): la búsqueda con Pagefind (ahora con 15 s de margen) y el axe de `/foundations/brand/` (claro). Ambos pasan 5 de 5 repetidos; vigilarlos en CI.

- **Changesets (13.2):** `@changesets/cli` 3 (config 4) en la raíz; `.changeset/config.json` con los tres paquetes en `fixed`, privados sin versionar y `format: false` (Biome no está entre sus formateadores). Changeset inicial `.changeset/primera-version.md` (`minor` → 0.1.0). Scripts `bun run changeset` y `bun run version-packages` (no `version`: chocaría con el hook de npm). `changeset version` no tiene modo en seco: se probó en una copia de los `package.json` **con `bun.lock`** (sin él no detecta los workspaces de Bun): 0.0.0 → 0.1.0 en los tres, privados sin tocar, `workspace:*` conservado, CHANGELOG creado; y un `patch` solo en tokens sube los tres (modo fixed). `changeset status` falla mientras `main` no tenga commits. Los títulos del CHANGELOG ("Minor Changes", "Updated dependencies") los pone Changesets en inglés; las entradas van en castellano.

## Verificación completa

```sh
bunx biome ci .
bunx turbo run build typecheck test
cd apps/docs && bunx playwright test          # web: funcional, axe y paridad visual
cd examples/next && bunx playwright test      # tras su build
cd examples/astro && bunx playwright test     # tras su build
```

## Entorno (Windows + Git Bash)

- Argumentos que empiezan por `/` (rutas de la web): anteponer `MSYS_NO_PATHCONV=1`.
- Código con expresiones regulares: escribirlo con el editor, no con `sed` ni `node -e` (se comen las barras).
- Sin Python; Bun instala cada paquete aislado (resolver dependencias con `require.resolve`).
- `apps/docs` usa TypeScript 6 porque `astro check` no admite el 7.

## Reimportar la guía

Ver `scripts/import-artifact/README.md`. La copia actual está en `reference/` (versión en `reference/VERSION`).
