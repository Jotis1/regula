---

name: StreamGoal
description: "Barra de meta del directo (seguidores, suscripciones, donaciones) con el avance, lo que falta y el porcentaje."
interactive: false
---

**Props.** `label`, `current`, `goal`, `unit` (opcional, se añade a las cifras), `width` (420 por defecto), `labels`.

**Cuándo usarla.** En el overlay, una por meta y no más de dos a la vez. La barra mide 14px, con el relleno en `bg-brand-solid` sobre `bg-quaternary`, y crece con una transición de 300 ms cuando `current` cambia. Las cifras usan formato español (`1.284`) y números tabulares. Al llegar a la meta, el pie cambia a "Meta conseguida. Toca poner otra." y la barra se queda llena.

**Accesibilidad.** Lleva `role="progressbar"` con `aria-valuenow` acotado a la meta, y el porcentaje va también en texto. La barra se llama como `label`, aunque no sea texto. Con `prefers-reduced-motion` la barra salta sin transición.

**Evita.** Metas imposibles que se queden en 0 % semanas. Usar el relleno de otro color al completarla: el índigo es el único acento.

**Ampliaciones sobre la guía.** `labels` sustituye los textos del pie: `done` y `remaining(cifra)`, que recibe lo que falta con su unidad ("716", "40 €").
