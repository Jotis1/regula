---

name: StreamCounter
description: "Uno o dos contadores del directo en una fila, como las muertes y los sustos de una partida."
interactive: false
---

**Props.** `items` (`{ label, value }`, uno o dos), `width` (sin él, lo que mida el contenido), `state` (`enter` o `exit`).

**Cuándo usarla.** En un rincón del overlay de juego, siempre a la vista. El texto va en `text-tertiary` y la cifra en `text-display-xs`, tabular y en formato español (`1.284`). Con dos, una raya `border-secondary` los separa.

**Movimiento.** Al cambiar una cifra, solo esa cifra entra con un fundido de 250 ms, sin desplazarse: cambia a menudo y un salto distrae del juego.

**Evita.** Más de dos contadores: a partir del tercero no se pintan. Contadores que nadie mira: si no cambia en toda la partida, sobra.

**Detalle.** Un valor que no sea un entero de 0 o más se pinta como 0. Cada contador es un par `<dt>`/`<dd>` dentro de un `<dl>`, y no es una región viva: un lector de pantalla no lee cada cambio.

**Ampliaciones sobre la guía.** Es una pieza nueva de la familia.
