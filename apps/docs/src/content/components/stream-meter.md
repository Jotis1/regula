---

name: StreamMeter
description: "Barra de 0 a 100 sin cifras para lo que el chat hace subir y bajar, con un estado de lleno."
interactive: false
---

**Props.** `label`, `value` (de 0 a 100), `full`, `width` (420 por defecto), `state` (`enter` o `exit`).

**Cuándo usarla.** Para algo que el chat empuja entre todos, como un nivel de miedo que sube cuando escriben «AAAH». La barra mide 14px, como la de `StreamGoal`, y sigue a `value` con una transición de 300 ms. No lleva cifras: importa cuánto falta para llenarla, no el número.

**Lleno.** Con `full`, un anillo índigo rodea la tarjeta con un fundido de 250 ms y se va igual. Es la única marca: sin pulsos ni repeticiones. Con `prefers-reduced-motion` sigue siendo un fundido, porque solo cambia la opacidad.

**Detalle.** `value` se acota entre 0 y 100, y `NaN` cuenta como 0. Lleva `role="meter"` con `aria-valuemin`, `aria-valuemax` y `aria-valuenow`, y se llama como `label`.

**Evita.** Usarla para una meta con objetivo: eso es `StreamGoal`. Dejarla en pantalla a 0: quítala cuando no haya nada que medir.

**Ampliaciones sobre la guía.** Es una pieza nueva de la familia.
