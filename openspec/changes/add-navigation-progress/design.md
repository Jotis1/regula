# Design

## Context

- Mismo flujo que la fase 1 (`archive/2026-11-07-add-form-variants`): cada componente nuevo lleva su ejemplo en `apps/docs/src/visual/registry.ts`, su muestra en `thumbnails.tsx`, su fragmento, su página, su grupo en `catalog.ts` y sus dos capturas aprobadas, capturadas en Windows y miradas antes de aprobarlas. El test de catálogo falla si falta algo.
- El Figma usa la paleta de Tailwind v3, no los tokens: de él se toman forma, medidas y estados, y el color se traduce al token semántico. Cuando el Figma y la spec no coinciden, se construye como el Figma y se actualiza la spec (regla del usuario).
- Lo que ya hay y se reutiliza: `Tabs` (React Aria, tipos `underline`, `button-brand`, `button-gray` y `button-border`), `Tooltip` (React Aria, siempre arriba con la flecha centrada), `Dropdown` (menú de React Aria con elección única), `Slideout` (panel lateral con foco atrapado), `FeaturedIcon`, `Select`, `Button` y `Icon`. Las clases de la burbuja están en `internal/bubble.ts`.
- `promote-docs-pieces` modifica el mismo requisito de catálogo: este cambio se archiva después.

Nodos del Figma («Yoruverse UI v8.0», `WybK3J9Wu3crF84nKwrN1z`):

| Pieza | Nodos |
| --- | --- |
| ProgressSteps | Marcador `1138:23`, paso `1138:1954`, iconos centrados `1141:76669`, iconos con texto `1254:144290`, texto con línea `1139:79465`, mínimos `1139:79149`, mínimos unidos `1139:79128` |
| ProgressCircle | `1084:2717` |
| PaginationDots | Punto `1111:1`, grupo `1111:38` |
| Carousel | Flecha `1253:164`, carrusel `1253:237` |
| HeaderNav | `1207:1678` (Simple `1208:104342`, Dual-tier `1208:101427`, Tabs `11910:608084`, Centered `11910:613771`, menús móviles `1208:104358`, `1208:101749`, `11910:613336`, `11910:613804`), elemento de navegación `1152:89220`, desplegable `1152:90366`, botón de menú `1161:14070`, botón de cabecera `1165:736` |
| ContextMenu | `11547:540792`, elemento de menú `11546:537565`, marca de la izquierda `11546:538631` |
| HelpIcon | `1054:13` |
| Tabs | Pestaña `43:2412`, verticales `1397:9880`, horizontales `1118:69893` |
| Tooltip | `1052:489` |
| Select | `3281:377673` (abierto `7953:158048`, con foco `7953:158036`), opción del menú `3281:380429` |

## Goals / Non-Goals

**Goals:**
- Las siete piezas y las ampliaciones de `Tabs` y `Tooltip`, como el Figma, con tokens semánticos y en los dos temas.
- Todo se pinta en el servidor. El JavaScript solo para lo que se mueve o se abre (carrusel, menús, panel móvil, tooltips).
- Nada de lo existente cambia: las capturas de `Tabs`, `Tooltip`, `Dropdown` y `Pagination` se mantienen salvo donde el ejemplo enseñe lo nuevo.

**Non-Goals:**
- Las variantes de `Pagination` «Card», las «featured cards», la tarjeta de cuenta y los tipos nuevos de `SidebarNav`.
- Pasar diapositivas solo (autoplay): el Figma no lo pide y es una barrera de accesibilidad.
- Fotos de ejemplo: el carrusel del ejemplo y del artefacto usa diapositivas hechas con componentes, sin assets nuevos.

## Decisions

### D1. Grupos del catálogo
`ProgressSteps` y `ProgressCircle` van en «Avisos y carga», junto a `ProgressBar`. `PaginationDots`, `HeaderNav` y `ContextMenu` van en «Navegación», junto a `Pagination`, `Dropdown` y `CommandMenu`. `Carousel` va en «Contenido y medios», junto a `VideoPlayer`. `HelpIcon` va en «Capas», junto a `Tooltip`. No hay grupos nuevos: el test de catálogo exige 11 en Componentes.

### D2. `ProgressSteps`
- **Props:** `steps` (`{ title, description?, icon? }[]`), `current` (índice del actual, desde 0; los anteriores están completos), `type` (`"icons-centered"`, `"icons-text"`, `"text-line"`, `"minimal"`, `"minimal-connected"`), `marker` (`"check"`, `"number"` o `"featured"`, que usa el `icon` de cada paso), `size` (`sm`, `md`), `orientation` (`horizontal`, `vertical`) y `labels` (texto del estado para lectores, «Paso 3 de 4»).
- **Semántica:** una `<ol>`; cada paso lleva su estado en texto solo para lectores («completo», «actual», «pendiente») y el actual `aria-current="step"`. Los marcadores y líneas son decorativos.
- **Variantes del Figma:** el Figma da en móvil la versión vertical de cada tipo; aquí es `orientation`, que elige quien lo usa. `icons-text` es siempre vertical.

### D3. `ProgressCircle`
Un SVG con dos trazos: la pista (`border-secondary`) y el arco (`fg-brand-primary`), con `stroke-dasharray` para el valor y extremos redondeados. `shape` es `circle` o `half`. Los tamaños (`xxs` 64, `xs` 160, `sm` 200, `md` 240 y `lg` 280) y los grosores salen del nodo `1084:2717`. En `xxs` la etiqueta va debajo; en el resto, encima del valor, dentro del círculo. `role="progressbar"` con `aria-valuenow`, `aria-valuemin`, `aria-valuemax` y el nombre de la etiqueta (o `aria-label`).

### D4. `PaginationDots` y `Carousel`
- **`PaginationDots`:** `total`, `current` (desde 1), `onChange?`, `variant` (`dot`, `line`), `size` (`md`, `lg`), `framed`. Sin `onChange` es un `div` con el texto «n de N» solo para lectores; con él, un grupo de botones «Ir a la página n de N» con `aria-current` en la actual.
- **`Carousel`:** `slides` (`ReactNode[]`), `aria-label`, `size` (`md`, `lg`: flechas de 36 o 44px y puntos `md` o `lg`), `index` / `defaultIndex` / `onChange`, `labels`. La pista se mueve con `transform`, con transición que se quita con `prefers-reduced-motion`. Las diapositivas que no se ven llevan `inert` y `aria-hidden`. Deslizar se hace con eventos de puntero y un umbral de 48px; las flechas del teclado funcionan con el foco dentro del carrusel. Las flechas de los lados se deshabilitan en los extremos: no da la vuelta.
  - *Alternativa:* `scroll-snap` nativo. Es más fluido al deslizar, pero sincronizar el índice con el desplazamiento y quitar del árbol las diapositivas ocultas es frágil. Se descarta.

### D5. `HeaderNav`
- **Props:** `type` (`simple`, `dual-tier`, `tabs`, `centered`), `brand`, `items` (`{ label, href, current?, badge?, children? }[]`, donde `children` son las subsecciones), `actions` (botones e iconos de la derecha), `account` (lo que va en la esquina: un `Dropdown` con `AvatarLabel`, un botón…), `mobile` (`{ search?, footerItems?, footer? }` para el panel), `labels`.
- **Escritorio y móvil sin JavaScript para el diseño:** las dos versiones van en el HTML y la CSS elige por el ancho de la propia cabecera, con una consulta de contenedor de 1024px (`@5xl`): a pantalla completa es el `lg` de la página, y la vista previa de la web puede enseñar una cabecera de escritorio dentro de una caja de 1280px encogida, que con `lg` (ancho de la ventana) nunca se vería. El panel móvil es `Slideout` desde la izquierda (gana `side`: `right` por defecto, como hoy, o `left`; su captura no cambia), con la navegación hecha como la de `SidebarNav` (los elementos con subsecciones son botones `aria-expanded` que despliegan su lista).
- **Segunda fila:** en `dual-tier`, `tabs` y `centered`, las subsecciones de la sección actual van en una segunda `<nav>` con su propio nombre. En `tabs` se pintan como pestañas `underline`, pero son enlaces con `aria-current="page"`, no un `tablist`: navegan, no cambian un panel.

### D6. `ContextMenu`
- **Apertura:** un contenedor que escucha `contextmenu` (cancela el del navegador y guarda el punto del puntero) y, con el foco dentro, Mayús+F10 y la tecla de menú. El `Popover` de React Aria se ancla a un elemento invisible que se coloca en ese punto (o en la esquina de la zona, con teclado).
- **Opciones:** `items` como en `Dropdown` (`icon`, `label`, `shortcut`, `danger`, `onSelect`, `{ divider }`) más `items` anidados para un submenú (`SubmenuTrigger` de React Aria) y secciones con elección: `{ section, selection: "multiple" | "single", selected, onSelectionChange, items }`, que pintan el check (múltiple) o el punto (única) del Figma.
- **Sin duplicar:** el pintado de las opciones (clases, huecos de etiqueta y atajo, icono, check) pasa a un módulo interno que comparten `Dropdown` y `ContextMenu`. La captura de `Dropdown` no debe cambiar.

### D7. `Tooltip` con posición y `HelpIcon`
- **`Tooltip`:** `placement` (`top` por defecto, `bottom`, `left`, `right`) y `arrow` (`center` por defecto, `start`, `end` o `false`). Con React Aria se pasan como `placement` y desplazando el `OverlayArrow`; en `open` (vista previa), con las clases de flecha de `internal/bubble.ts`, que gana las de izquierda y derecha. Sin las props, el HTML es el de hoy.
- **`HelpIcon`:** un `Tooltip` con un botón de icono `help-circle` de 16px en `fg-quaternary` (hover `fg-quaternary_hover`), nombre «Ayuda: <título>», y `placement` y `arrow` pasados al tooltip. `open` para vistas previas.

### D8. `Tabs` verticales
`orientation` (`horizontal` por defecto o `vertical`) va al `Tabs` de React Aria, que ya da ↑ y ↓. Los tipos ganan `button-minimal` (los dos sentidos) y `line` (raya de 2px a la izquierda en `fg-brand-primary` para la actual; en horizontal se pinta como `underline`). En vertical y por debajo de `lg`, la lista de pestañas se oculta y se pinta el `Select` del paquete (con el menú del Figma, D9) con las mismas opciones, enlazado al mismo estado. Las dos versiones van en el HTML; la que está oculta con `display: none` no cuenta para los lectores.

### D9. `Select` con el menú del Figma (petición del usuario)
Hoy `Select` es un `<select>` nativo dentro del marco de los campos (`internal/field.tsx`, `nativeClasses`), y `Input` pinta otros dos nativos para `leadingSelect` y `trailingSelect`. Al abrirse sale el menú del sistema.
- **Componente:** el `Select` de React Aria (`Select`, `Button`, `SelectValue`, `Popover`, `ListBox`), que ya usa `MultiSelect` para su lista. El campo conserva el marco, los tamaños (`sm`, `md`, `lg`), la etiqueta, la pista y el error de `FieldShell`. React Aria pinta un `<select>` oculto con `name`, así que el formulario sigue enviando el valor.
- **Opciones:** `options` admite `string` o `{ value, label, supporting?, icon?, avatar?, dot?, disabled? }`, como el `_Select menu item` (Default, Icon leading, Avatar leading, Dot leading). El campo enseña la opción elegida con su icono, avatar o punto y su texto de apoyo en `text-tertiary` («Olivia Rhye @olivia»). La lista es un `Popover` del ancho del campo, con `radius-lg`, `shadow-lg` y filo `border-secondary_alt`; la opción bajo el ratón o el teclado en `bg-primary_hover`; la elegida con un check de 20px en `fg-brand-primary` a la derecha; altura máxima con desplazamiento, como el Figma.
- **API:** se mantienen `value`, `defaultValue`, `name`, `disabled`, `placeholder` y `size`. `onChange` pasa a recibir el valor (`string`) en lugar del evento del `<select>`. **Es un cambio que rompe** para quien leía `event.target.value`: va en el changeset, y se buscan y cambian los usos del repo (ejemplos de la web, `Playground`, `Pagination` si lo usa).
- **Desplegables de `Input`:** `leadingSelect` y `trailingSelect` pasan a la misma lista (componente interno compartido con `Select`), sin marco propio, como hoy.
- **Fuera:** los tipos «Search» y «Tags» del Figma. Para varias opciones ya está `MultiSelect`.

### D10. Foco de los campos sin anillo exterior (petición del usuario)
En `internal/field.tsx`, `CONTROL` y `CONTROL_ERROR` pintan con `focus-within` el borde interior de 2px (`border-brand` o `border-error`) y con `has-[:focus-visible]` le suman `var(--focus-ring-shadow)` (2px de hueco y 4px de anillo): con teclado se ven dos bordes. El Figma (`Select` con foco, `7953:158036`, y los campos de `Inputs`) solo dibuja el borde de 2px. Se quita el `has-[:focus-visible]` de los dos, y el foco de los campos queda igual con ratón y con teclado. El resto de controles (`Button`, pestañas, casillas…) siguen con su anillo. Afecta a todos los que usan el marco: `Input`, `Select`, `Textarea`, `NumberInput`, `TagInput`, `MultiSelect` y `VerificationCodeInput` (este, revisar sus casillas). Se cambian las fichas que dicen «con teclado se suma además el anillo» (`input.md` y las que lo repitan) y los tests que comprueban el anillo en un campo.

### D11. Listas en el historial de cambios (petición del usuario)
`src/lib/changelog.ts` ya guarda el texto de cada entrada con sus listas anidadas (quita la sangría de dos espacios). El fallo está en `src/pages/changelog.astro`: parte el texto por líneas en blanco y pinta cada trozo como un `<p>` con `InlineCode`, que solo entiende código en línea, así que las líneas `- …` salen como texto corrido. Se añade a `changelog.ts` una función que divide el texto en bloques (`{ type: "p", text }` o `{ type: "ul", items }`, con las líneas que empiezan por `- `) y la página pinta cada bloque: `<p>` o `<ul>` con un `<li>` por elemento, los dos con `InlineCode`. Test unitario en `test/changelog.test.ts` con la entrada de la 0.4.0 y un e2e que cuenta los `li`. Los changesets de este cambio y de `promote-docs-pieces` también llevan listas: se verán bien en la próxima versión.

## Risks / Trade-offs

- [`Select` deja de ser nativo] → Se pierde el selector del sistema en móvil y `onChange` cambia de forma (cambio que rompe, declarado). A cambio, el menú es el del Figma en todos los navegadores. React Aria cubre teclado, búsqueda por letra y lectores de pantalla; se prueba también en Firefox y WebKit (proyecto `cross-browser` de Playwright).

- [Es el cambio más grande hasta ahora] → Las tareas van por pieza, cada una con sus tests, su página y sus capturas, y un commit por pieza. Se puede revisar y parar entre piezas.
- [Anclar el menú contextual al puntero] → Se prueba en e2e con un clic derecho real en Chromium, también cerca de los bordes de la ventana (React Aria lo voltea).
- [Deslizar en jsdom] → Los tests unitarios mandan eventos de puntero; el e2e lo prueba con la emulación táctil de Chromium.
- [Dos versiones en el HTML (cabecera y pestañas verticales)] → Más HTML, pero sin salto al cargar ni JavaScript para el diseño. Lo mide el Lighthouse del CI.
- [Muchas capturas] → Catorce nuevas (siete por dos temas) más las de `Tabs` y `Tooltip` si cambian sus ejemplos; se miran todas.

## Migration Plan

Sin migración: todo son componentes nuevos y props nuevas con el comportamiento de hoy por defecto. Se archiva después de `promote-docs-pieces`.
