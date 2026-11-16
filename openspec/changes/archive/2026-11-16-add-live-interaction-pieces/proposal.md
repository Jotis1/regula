# Proposal

## Why

Scaena va a dejar que el chat intervenga en pantalla durante el directo: encuestas y predicciones de Twitch, contadores de muertes y sustos, un mensaje del chat destacado, un medidor que sube cuando el chat escribe una palabra y alertas de canjes de puntos de canal. La familia Stream no tiene ninguna de esas piezas, y Scaena no se inventa componentes: lo que falta se añade aquí (cambio `live-interaction` de Scaena, decisión 1).

## What Changes

- **`StreamPoll`**: encuesta o predicción, con su título, sus opciones y el avance de cada una, el tiempo que queda, el estado (en marcha, cerrada o terminada) y la opción ganadora.
- **`StreamCounter`**: uno o dos contadores en horizontal («Muertes 37 · Sustos 12»).
- **`StreamPinnedMessage`**: un mensaje del chat destacado, con autor, tono, insignias y texto plano.
- **`StreamMeter`**: una barra de 0 a 100 sin cifras, con su texto y un estado de lleno.
- **`redemption`** en `StreamEventType`: el canje de puntos de canal, con su icono y su texto por defecto, para `StreamAlert` y `StreamEvents`.
- **`ChatBox` seleccionable**: `onSelect` y `selectedId`, y `selectable` en cada mensaje. Sin `onSelect`, `ChatBox` sigue igual.
- **Arreglos de `ChatBox`** (y de `StreamPinnedMessage`, que comparte la fila del mensaje):
  - Los enlaces del texto se ven como enlaces. Hoy se pierden entre el resto del texto.
  - Con un mensaje largo, las insignias (moderador, streamer, sub…) se quedan en una línea y el nombre baja a la siguiente. Las insignias y el nombre tienen que ir siempre juntos, en la misma línea y con las insignias centradas en altura con el nombre.
  - En la web, el control «Animar último mensaje» del ejemplo no enseña nada, porque el chat del ejemplo no recibe mensajes. Con `animate`, el ejemplo pasa a recibir un mensaje nuevo cada pocos segundos.
- La ficha, el ejemplo interactivo y las capturas de las cuatro piezas nuevas en la web.
- Fuera de alcance:
  - Crear o votar encuestas: las piezas solo enseñan.
  - Más de dos contadores.
  - Cifras en el medidor.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `component-library`:
  - El catálogo crece con `StreamPoll`, `StreamCounter`, `StreamPinnedMessage` y `StreamMeter`.
  - Hay un tipo de evento nuevo, `redemption`.
  - `ChatBox` admite mensajes seleccionables, marca los enlaces y mantiene juntos las insignias y el nombre.
- `docs-site`: la ficha de `ChatBox` enseña el chat seleccionable y su ejemplo recibe mensajes cuando se anima.

## Impact

- `packages/react`: cuatro componentes nuevos y cambios retrocompatibles en `StreamEventType`, `StreamAlert`, `StreamEvents` y `ChatBox`; textos por defecto en `strings.ts`; tests. Changeset `minor` (0.9.0).
- **Capturas de `ChatBox`:** los enlaces y la fila de insignias cambian su aspecto a propósito, así que sus capturas aprobadas se sustituyen en el PR.
- `apps/docs`: cuatro páginas con su ficha y su ejemplo interactivo, capturas en oscuro de las cuatro y regresión visual del resto sin cambios.
- Artefacto: el catálogo y las fichas nuevas.
- Scaena sube `@jotis-me/react` a `^0.9.0` en su tarea 1.3.
