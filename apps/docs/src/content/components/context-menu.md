---

name: ContextMenu
description: "Menú que se abre con el botón derecho o con el teclado sobre una zona, con atajos, iconos, opciones marcadas y submenús."
interactive: true
astroNote: "Abrir el menú necesita JavaScript: úsalo en una isla con `client:load`. Las opciones llevan funciones y la zona es un nodo React, así que va en un `.tsx`."
---

**Cuándo usarlo.** Acciones secundarias de un elemento sobre el que el usuario ya está: una fila, una tarjeta, un archivo, un lienzo. Nunca como único camino a una acción: el botón derecho no existe en móvil, así que cada acción tiene que estar también a la vista (un `Dropdown` con «Más opciones» es el complemento habitual).

**Props.** `items`, `children` (la zona sobre la que se abre), `aria-label` (nombre del menú), `defaultOpen` y `previewAt` (para vistas previas abiertas). Cada opción de `items` es una acción `{ label, icon?, shortcut?, danger?, disabled?, onSelect?, textValue? }`, un submenú (la misma forma con `items`), un grupo con elección `{ section, selection, selected, onSelectionChange, items }` o un separador `{ divider: true }`.

**Apertura.** Con el botón derecho se abre en el punto del puntero y se cancela el menú del navegador; con teclado, Mayús+F10 o la tecla de menú, bajo el elemento enfocado de la zona (o en su esquina). Si no cabe junto al borde de la ventana, se voltea.

**Visual.** El panel y las opciones son los de `Dropdown`: panel `bg-primary_alt` con `radius-lg`, `shadow-lg` y filo `border-secondary_alt`; opciones de 14px medium con el icono de 16px en `fg-quaternary`, el atajo a la derecha y `bg-primary_hover` con el ratón o el teclado. Los submenús llevan un chevron a la derecha y la opción que los abre queda resaltada. En un grupo con `selection="multiple"`, las marcadas llevan un check de 16px en `fg-brand-primary` a la izquierda; con `selection="single"`, la elegida lleva un punto de 8px en `fg-success-primary`. Las no marcadas reservan el mismo hueco para que las etiquetas queden alineadas.

**Teclado.** Al abrirse, el foco va a la primera opción; las flechas recorren las opciones, → abre un submenú y ← lo cierra, Enter elige y cierra, y Escape cierra y devuelve el foco a la zona. Elegir en un grupo de varias opciones no cierra el menú.

**Accesibilidad.** Es un `role="menu"` con nombre; las opciones de un grupo son `menuitemcheckbox` (varias) o `menuitemradio` (una) con `aria-checked`, así que la marca se anuncia, y cada grupo lleva su nombre. Las opciones con submenú llevan `aria-haspopup`.

**Detalles.** La zona es un `div` que recibe el foco por programa (no entra en el orden de Tab). Con `defaultOpen` el menú se pinta en línea, sin tomar el foco ni bloquear la página, como en esta página.
