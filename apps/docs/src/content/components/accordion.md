---

name: Accordion
description: "Preguntas frecuentes que se abren y se cierran: icono a la izquierda o a la derecha, con divisor y abiertas de una en una."
interactive: true
---

**Props.** `items` [{`id`?, `title`, `content`}], `expanded`/`defaultExpanded`/`onExpandedChange` (los `id` abiertos), `single` (solo una abierta), `iconPosition` (`right` · `left`), `divider` y `headingLevel` (3).

**Visual.** La del Figma (`_FAQ item`, `1358:191490`): pregunta en `text-lg` seminegrita, el icono de más y menos en un círculo de 24 en `fg-quaternary`, la respuesta en `text-md` `text-tertiary` alineada con el texto; sin divisor, 32 entre preguntas; con él, una raya `border-secondary` y 24 arriba y abajo.

**Uso.** Las preguntas frecuentes de una página de precios o de ayuda. Respuestas cortas; si hace falta más, enlaza a la ayuda.

**Accesibilidad.** Cada pregunta es un encabezado con un botón `aria-expanded` que controla su respuesta, una región con el nombre de la pregunta. Enter y Espacio abren y cierran; las flechas arriba y abajo, Inicio y Fin mueven el foco entre preguntas. Sin JavaScript, las abiertas de inicio se ven.
