---

name: StreamPoll
description: "Encuesta o predicción del directo con el avance de cada opción, el tiempo que queda y el resultado."
interactive: false
---

**Props.** `variant` (`poll` o `prediction`), `title`, `options` (`{ id, label, votes, users? }`, de 2 a 10), `seconds` (lo que queda), `state` (`active`, `locked` o `ended`), `winnerId`, `labels`, `width` (420 por defecto), `motion` (`enter` o `exit`).

**Cuándo usarla.** En el overlay, mientras dura la votación y unos segundos después para enseñar el resultado. Cada opción lleva su porcentaje y su cifra (votos en una encuesta, puntos en una predicción) y una barra de 8px en `bg-brand-solid`. En una predicción va también cuánta gente ha apostado. Bloqueada, dice «Votación cerrada»; terminada, la ganadora lleva el check, las demás barras bajan al 40 % y el pie dice «Ha ganado…».

**Tiempo.** `seconds` son los segundos que quedan, en m:ss («Quedan 0:42»). La pieza no lleva reloj: quien la usa le pasa la cifra al día. Así se pinta igual en el servidor y en cualquier PC, tenga la hora que tenga.

**Accesibilidad.** Los porcentajes y las cifras van en texto y las barras son decorativas (`aria-hidden`). El tiempo es un `role="timer"` con `aria-live="off"`, como `StreamCountdown`. La ganadora se anuncia también en texto.

**Evita.** Más de cinco opciones en una encuesta: no se leen de un vistazo sobre el juego. Dejar el resultado en pantalla más de unos segundos.

**Ampliaciones sobre la guía.** Es una pieza nueva de la familia, para las encuestas y predicciones de Twitch. Como `state` es el estado de la votación, la entrada y la salida van en `motion`, y no en `state` como en el resto de la familia.
