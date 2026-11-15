---
"@jotis-me/react": minor
---

- Cuatro piezas de Stream para que el chat intervenga en pantalla:
  - `StreamPoll`: encuesta o predicción, con el avance de cada opción, el tiempo que queda (`seconds`) y el resultado.
  - `StreamCounter`: uno o dos contadores en fila.
  - `StreamPinnedMessage`: un mensaje del chat destacado.
  - `StreamMeter`: una barra de 0 a 100 sin cifras, con estado de lleno.
- `redemption`, el canje de puntos de canal, en `StreamEventType`, con `reward` en `StreamAlert` y en `StreamEvents`.
- `ChatBox`:
  - `onSelect` y `selectedId`, y `selectable` en cada mensaje, para elegir mensajes desde un panel de control.
  - Los enlaces del texto (`http://`, `https://` o `www.`) se ven subrayados y en el color de marca, sin poderse pulsar.
  - Las insignias, el nombre y los dos puntos van siempre en la misma línea, con las insignias centradas en altura con el nombre. Un mensaje largo parte después del nombre, no entre las insignias y el nombre ni a mitad de una palabra.
