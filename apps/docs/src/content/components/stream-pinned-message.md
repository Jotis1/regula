---

name: StreamPinnedMessage
description: "Un mensaje del chat destacado en pantalla, con su autor, sus insignias y su texto."
interactive: false
---

**Props.** `message` (como en `ChatBox`: `{ user, text, tone?, badges?, id? }`), `labels` (`pinned`, «Mensaje destacado» por defecto), `width` (420 por defecto), `state` (`enter` o `exit`).

**Cuándo usarla.** Para enseñar en pantalla el mensaje al que se está respondiendo. Lleva el rótulo con una chincheta y debajo la misma fila que `ChatBox` (insignias, nombre en su tono y texto, con los enlaces marcados), a 20px.

**Detalle.** `text` es texto plano: llega del público y nunca se pinta como HTML. Twitch admite 500 caracteres, que no caben: el texto se corta a cuatro líneas.

**Evita.** Destacar mensajes sin leerlos antes. Dejarlo puesto toda la partida: quítalo cuando ya se haya respondido.

**Ampliaciones sobre la guía.** Es una pieza nueva de la familia.
