---

name: HelpIcon
description: "Icono de ayuda de 16px que abre un tooltip al pasar el ratón o enfocarlo, junto a una etiqueta o un campo."
interactive: true
astroNote: "El tooltip necesita JavaScript: úsalo en una isla con `client:load`."
---

**Cuándo usarlo.** Junto a una etiqueta, un título o un campo, para explicar en una o dos líneas qué es o qué incluye. Si la explicación es imprescindible para rellenar el campo, ponla en su `hint`: un tooltip no se ve en móvil.

**Props.** `title` (primera línea del tooltip), `text` (segunda línea, en `tooltip-supporting-text`), `placement` (`top` por defecto · `bottom` · `left` · `right`: el lado del icono en el que sale), `arrow` (`center` por defecto · `start` · `end` · `false`), `label` (nombre del botón si `title` no es texto) y `open` (visible siempre, para vistas previas).

**Visual.** Un botón con el icono `help-circle` de 16px en `fg-quaternary` (`fg-quaternary_hover` al pasar el ratón) y el cursor de ayuda. El tooltip es el de `Tooltip`: burbuja `bg-primary-solid`, `radius-lg`, flecha de 6px que apunta al icono.

**Comportamiento.** Al pasar el ratón (tras 300 ms) o llegar con el teclado, abre el tooltip en el lado de `placement`; Escape lo cierra sin mover el foco. Si no cabe, se pone en el lado contrario.

**Accesibilidad.** Es un `<button>` con el nombre «Ayuda: <título>», así que entra en el orden de Tab y un lector de pantalla anuncia para qué sirve; el tooltip lo describe (`aria-describedby`). El foco lleva el anillo de foco.
