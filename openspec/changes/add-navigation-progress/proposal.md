# Proposal

## Why

Es la fase 2 del inventario del Figma «Yoruverse UI v8.0» (6 de noviembre de 2026): navegación y progreso. Las apps de la suite necesitan una cabecera de navegación, pasos de un proceso, un indicador circular de progreso, un carrusel, un menú contextual y un icono de ayuda, y hoy no los tiene `@jotis-me/react`. Cada app acabaría haciéndolos a mano. Las pestañas existen, pero les faltan la orientación vertical y dos tipos que dibuja el Figma.

## What Changes

- **`ProgressSteps`** (nuevo): pasos de un proceso con su estado (completo, actual, pendiente), en los cinco tipos del Figma: iconos centrados, iconos con texto (en columna), texto con línea, iconos mínimos e iconos mínimos unidos. Admite marca de check, número o icono destacado, tamaños `sm` y `md`, y orientación horizontal y vertical.
- **`ProgressCircle`** (nuevo): progreso en círculo o semicírculo, con su valor y una etiqueta, en los tamaños `xxs` a `lg`.
- **`PaginationDots`** (nuevo): puntos o rayas que dicen en qué diapositiva estás, en `md` y `lg`, con o sin marco.
- **`Carousel`** (nuevo): pasa diapositivas con flechas, puntos, teclado y deslizar el dedo, en `md` y `lg`.
- **`HeaderNav`** (nuevo): cabecera de una app en los cuatro tipos del Figma (Simple, Dual-tier, Tabs y Centered), con marca, secciones, acciones y cuenta, y su menú móvil a pantalla completa con buscador, navegación con desplegables, enlaces de pie y cuenta.
- **`ContextMenu`** (nuevo): menú que se abre con el botón derecho o con el teclado sobre una zona, con atajos, iconos, opciones marcadas (check o punto), separadores y submenús.
- **`HelpIcon`** (nuevo): el icono de ayuda (16px) que abre un tooltip al pasar el ratón o enfocarlo.
- **`Tabs`**: orientación vertical, que en móvil pasa a un desplegable, y los tipos `button-minimal` y `line` (este último, solo vertical).
- **`Tooltip`**: posición (arriba, abajo, izquierda, derecha) y alineación de la flecha, o sin flecha, como dibuja el Figma. Hoy solo va arriba y centrado. Sin las props nuevas, igual que ahora.
- **`Slideout`**: `side` para abrir desde la izquierda, como el menú móvil del Figma. Por defecto, desde la derecha como ahora.
- **`Select`** (petición del usuario): el desplegable deja de ser el menú nativo del navegador y pasa a ser el del Figma: una lista bajo el campo con texto de apoyo por opción, icono, avatar o punto delante, y check de marca en la elegida. Lo usan también los desplegables de `Input` (`leadingSelect`, `trailingSelect`) y las pestañas verticales en móvil.
- **Foco de los campos** (petición del usuario): con el foco, los campos (`Input`, `Select`, `Textarea`, `NumberInput`, `TagInput`, `MultiSelect`, `VerificationCodeInput`) llevan solo el borde de 2px de marca, como el Figma, sin el anillo de foco exterior que hoy se suma con teclado y se ve como un borde doble.
- **Historial de cambios** (petición del usuario): `/changelog/` pinta las listas de una entrada como listas. Hoy la entrada de la 0.4.0 (una lista de componentes y otra de variantes) sale como texto corrido con los guiones.
- El catálogo pasa de 84 a 91 componentes, cada uno con página, ficha, ejemplo y capturas aprobadas.
- Fuera de alcance (fase 3 u otro cambio): los tipos «Search» (buscador dentro del campo) y «Tags» del `Select` del Figma, las variantes de `Pagination` tipo «Card», las «featured cards» y la tarjeta de cuenta de la navegación lateral, y `SidebarNav` en sus tipos «Dual-tier», «Slim» y por secciones.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `component-library`: el catálogo crece con siete componentes, `Tabs` y `Tooltip` ganan variantes, `Select` usa el menú del Figma, el foco de los campos deja de llevar anillo exterior, y hay requisitos nuevos para cada pieza.
- `docs-site`: el historial de cambios pinta las listas de cada entrada.

## Impact

- `packages/react`: siete componentes nuevos, cambios retrocompatibles en `Tabs` y `Tooltip`, textos nuevos en `defaultStrings` y tests. Changeset `minor`. Usa piezas de React Aria que ya trae el paquete (`Menu` con submenús, `Tabs`, `Tooltip`), sin dependencias nuevas.
- `apps/docs`: siete páginas, ejemplos, muestras para las cards, fragmentos y capturas aprobadas, y capturas nuevas de `Tabs` y `Tooltip` si cambian sus ejemplos. Un grupo nuevo de catálogo para el progreso si hace falta (design).
- Artefacto: siete componentes más en la próxima sincronización. El `Carousel` necesita imágenes de ejemplo (design).
- Orden: este cambio modifica el mismo requisito de catálogo que `promote-docs-pieces`, así que se archiva después de él.
