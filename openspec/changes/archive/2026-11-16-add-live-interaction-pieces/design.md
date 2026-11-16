# Design

## Context

- La familia Stream comparte su base en `internal/stream.ts`:
  - Siempre en oscuro (`STREAM_ROOT`).
  - Entrada y salida con `streamMotion(state)`.
  - Cifras tabulares (`TABULAR`).
  - El tipo de evento con su icono y su etiqueta (`STREAM_EVENTS`).
  - Los textos por defecto (`streamDetail` y `streamShort`).
- `StreamGoal` es la referencia para una barra: 14 px, relleno `bg-brand-solid` sobre `bg-quaternary`, transición de 300 ms y `role="progressbar"`.
- `StreamCountdown` recibe los segundos que quedan y no lleva reloj propio. Quien lo usa le pasa la cifra al día. Así el componente se puede pintar en el servidor.
- `ChatBox` pinta como mucho 12 mensajes, de solo lectura, con `ChatMessage { user, text, tone?, badges?, id? }`.
- Scaena lo pide en su cambio `live-interaction`, con estos contratos mínimos (decisión 1): `StreamPoll`, `StreamCounter`, `StreamPinnedMessage`, `StreamMeter`, `redemption` y `ChatBox` con `onSelect` y `selectedId`.

## Goals / Non-Goals

**Goals:**
- Que las piezas nuevas sigan las reglas de la familia Stream: siempre en oscuro, la entrada y la salida comunes, cifras tabulares y el texto del público en texto plano.
- Que todas se puedan pintar en el servidor, sin relojes ni estado propio.
- Que, sin las props nuevas, `StreamAlert` y `StreamEvents` den el mismo HTML que en 0.8.1, y `ChatBox` también, salvo los dos arreglos de la fila (D7 y D8).

**Non-Goals:**
- Votar o crear encuestas desde el componente.
- Calcular el medidor o el tiempo que queda: lo hace quien usa la pieza.

## Decisions

### D1. `StreamPoll`

- **Props:**
  - `variant: "poll" | "prediction"`, `title` y `options: { id, label, votes, users? }[]`, de 2 a 10. `votes` son los votos de una encuesta o los puntos de una predicción, y `users` es cuánta gente ha apostado en una predicción.
  - `seconds?: number`, lo que queda, en m:ss («Quedan 0:42»; `StreamCountdown` usa mm:ss, pero en una cabecera pequeña sobra el cero). Quien la usa pasa la cifra al día. Sin `seconds`, no se ve el tiempo.
  - `state: "active" | "locked" | "ended"` y `winnerId?`.
  - `labels`, `width` (420 por defecto), `state` de entrada y salida (`motion`) y `className`.
- **Aspecto:**
  - Cabecera con la etiqueta («Encuesta» o «Predicción») y, a la derecha, «Quedan 0:42», o «Votación cerrada» si está bloqueada.
  - El título va debajo.
  - Una fila por opción, con su texto, su cifra y su porcentaje, y una barra de 8 px con el relleno en `bg-brand-solid` sobre `bg-quaternary`, que crece con la transición de 300 ms de `StreamGoal`.
  - En una predicción, la cifra son los puntos y debajo va la gente («38 personas»).
  - Terminada, la ganadora lleva un `CheckIcon` y su barra sigue en índigo. Las demás barras bajan al 40 % de opacidad: sobre la pista `bg-quaternary`, un relleno del mismo color no se vería. El pie dice «Ha ganado Ni loco». Sin `winnerId`, «Votación terminada».
- **Accesibilidad:** las cifras y los porcentajes van en texto y las barras llevan `aria-hidden`. El tiempo va en un `role="timer"` con `aria-live="off"`, como `StreamCountdown`.
- **Por qué `seconds` y no `endsAt`:** con una fecha, el componente necesitaría un reloj y dejaría de poderse pintar en el servidor. Además, cada PC tiene su hora. Scaena ya corrige la suya con la del servidor y pasa la cifra. Scaena debe usar `seconds` en su decisión 1.
- **Prop de movimiento:** como `state` ya es el estado de la votación, la entrada y la salida van en `motion`. Es la única pieza de la familia donde no se llama `state`, y la ficha lo avisa.

### D2. `StreamCounter`

- **Props:** `items: { label, value }[]`, `width?`, `state?` (entrada y salida, como el resto de la familia) y `className`.
  - Se pintan los dos primeros. Con más, se ignoran. Esta versión no los necesita.
  - Un valor que no es un entero de 0 o más se pinta como 0.
- **Aspecto:** una tarjeta en horizontal, con «Muertes 37 · Sustos 12». El texto va en `text-tertiary` y la cifra en `text-display-xs`, tabular y en `text-primary`.
- **Al cambiar una cifra,** solo hay un fundido de 250 ms en esa cifra (`starting:opacity-0`, con `key` en el valor). No hay desplazamiento, ni siquiera con movimiento normal, porque se cambia mucho y un salto distrae.
- **Accesibilidad:** cada contador es un par de `<dt>` y `<dd>` dentro de un `<dl>`. No es una región viva.

### D3. `StreamPinnedMessage`

- **Props:** `message: ChatMessage`, `labels.pinned` («Mensaje destacado» por defecto), `width` (420 por defecto), `state` de entrada y salida y `className`.
- **Aspecto:**
  - Arriba, un rótulo pequeño con un icono de chincheta y «Mensaje destacado».
  - Debajo, la fila del mensaje igual que en `ChatBox`: las insignias, el nombre en su tono y el texto en `text-xl`, el mismo tamaño que en el chat.
  - El texto se corta a 4 líneas con `line-clamp`. Twitch admite 500 caracteres, que no caben.
- **Texto plano,** como en `ChatBox`: `text` es `string` y nunca se pinta como HTML.
- La pieza comparte con `ChatBox` el código de la fila del mensaje (`internal/chat-line.tsx`), para que los dos sigan iguales.

### D4. `StreamMeter`

- **Props:** `label`, `value` (de 0 a 100, acotado, y `NaN` cuenta como 0), `full?`, `width` (420 por defecto), `state` de entrada y salida y `className`.
- **Aspecto:**
  - El texto va arriba y la barra de 14 px debajo, como en `StreamGoal`, pero sin cifras ni pie.
  - La barra sigue a `value` con una transición de 300 ms. Scaena la cambia cada pocos cientos de milisegundos.
- **Lleno:** con `full`, la tarjeta pasa a `border-brand` y se le pone un anillo `ring-4 ring-brand` con un fundido de 250 ms, que se quita igual. Es la única marca. No hay pulsos ni repeticiones, porque la familia no tiene animaciones decorativas, y con movimiento reducido sigue siendo un fundido.
- **Accesibilidad:** `role="meter"`, con `aria-valuemin` 0, `aria-valuemax` 100 y `aria-valuenow`, y el nombre de `label`.

### D5. El tipo `redemption`

- `StreamEventType` gana `redemption`, con el icono `Gift01` y la etiqueta «Canje de puntos».
- `StreamEventData` gana `reward?: string`, el nombre de la recompensa:
  - Texto por defecto: «Ha canjeado {reward}.». Sin `reward`, «Ha canjeado una recompensa.».
  - Línea corta: «Canje de puntos · {reward}».
- `StreamAlert` y los elementos de `StreamEvents` admiten `reward`.
- Los textos por defecto de los demás tipos no cambian.

### D6. `ChatBox` seleccionable

- **Props nuevas:** `onSelect?(message: ChatMessage)` y `selectedId?`, y en `ChatMessage`, `selectable?: boolean` (`true` por defecto).
- **Con `onSelect`:**
  - Cada mensaje seleccionable es un `<button type="button">` que ocupa la fila, con `aria-pressed` cuando su `id` es `selectedId`.
  - Al pasar por encima, la fila va en `bg-primary_hover`, y la elegida en `bg-active` con un borde izquierdo `border-brand`.
  - El foco lleva el anillo de siempre.
  - Los mensajes con `selectable: false` se pintan como hoy, sin botón.
- **Sin `onSelect`:** no hay ningún botón y el HTML es el de la fila normal, que solo cambia por D7 y D8 (comprobado con `renderToString`).
- **Mensajes sin `id`:** con `onSelect`, todos los mensajes deben llevar `id`. Uno sin él no es seleccionable. Si no, el elegido podría confundirse con otro que diga lo mismo.

### D7. Enlaces en el texto

- **Qué es un enlace:** el texto se parte en trozos con una función pura (`internal/links.ts`). Cuentan como enlace las direcciones que empiezan por `http://`, `https://` o `www.`, hasta el siguiente espacio, sin la puntuación del final (`.`, `,`, `)`, `!`, `?`). Así «mira https://jotis.me.» marca `https://jotis.me`.
- **Cómo se ven:** en `text-brand-secondary` y subrayados (`underline underline-offset-2`), en un `<span>`. No son `<a>`:
  - En OBS no se puede pulsar.
  - En el chat seleccionable, la fila entera ya es un botón, y un enlace dentro de un botón no es HTML válido.
  - Abrir con un clic lo que escribe cualquiera del público es una puerta al phishing en el Mando de Scaena.
- **Texto plano igual que antes:** los trozos son `string` y se pintan como texto. Se marcan, pero nunca se interpretan como HTML.
- **Sin falsos enlaces:** `jotis.me` sin `www.` ni protocolo no se marca. Así no se marcan cosas como «v1.2» o «ok.vale».

### D8. Insignias y nombre en la misma línea

- **Hoy:** las insignias van en un `inline-flex` con `align-[-4px]` y el nombre en un `<span>` aparte. Con `wrap-anywhere`, la línea se puede partir entre las insignias y el nombre, y con un texto largo el nombre baja a la segunda línea, separado de sus insignias.
- **Ahora:** las insignias, el nombre y los dos puntos van en un mismo `<span className="whitespace-nowrap">`, y el texto sigue después en línea, partiendo donde haga falta. El nombre de Twitch tiene como mucho 25 caracteres y cabe con tres insignias en 420 px.
- **Punto de corte:** entre el nombre y el texto no hay espacio (el hueco es el margen de los dos puntos), así que no habría dónde partir la línea y `wrap-anywhere` cortaría la primera palabra del texto por la mitad. Un `<wbr>` tras el grupo da ese punto de corte sin ocupar sitio.
- **Centrado:** las insignias van en una caja `inline-flex items-center h-[1lh] align-top`, que mide una línea de alto. Así quedan centradas en altura con el nombre, sea cual sea el tamaño del texto, sin el `-4px` a ojo.
- La misma fila la usa `StreamPinnedMessage` (D3), así que también se lleva los dos arreglos.

### D9. El ejemplo animado de la ficha

- **Hoy:** el ejemplo de `ChatBox` tiene un control para `animate` (con la etiqueta «Animar último mensaje»), pero siempre tiene los mismos dos mensajes. Como no entra ninguno nuevo, al encenderlo no pasa nada.
- **Ahora:** el ejemplo de `apps/docs/src/playground/ChatBox.tsx` envuelve el componente:
  - Con `animate`, entra un mensaje de una lista preparada cada 2,5 segundos, en ventana deslizante de 8, como en un directo.
  - Sin `animate`, el chat no se mueve.
  - Con `prefers-reduced-motion`, los mensajes siguen entrando, porque `ChatBox` ya los hace entrar solo con un fundido.
- **La lista preparada** incluye un mensaje con enlace y uno largo con tres insignias, para que se vean D7 y D8.
- **El código del ejemplo** sigue enseñando solo `<ChatBox messages={…} animate />`. El temporizador es cosa de la web, no del componente.

### D10. Textos, ficha y capturas

- **Textos:** todos van en `strings.ts` («Encuesta», «Predicción», «Quedan {m:ss}», «Votación cerrada», «Ha ganado {opción}», «Votación terminada», «{n} personas», «Mensaje destacado» y los de `redemption`) y se pueden sustituir con `labels`.
- **Fichas:** una por pieza nueva en `apps/docs/src/content/components/` y su ejemplo interactivo:
  - `StreamPoll`: elegir la variante y el estado, y mover el tiempo.
  - `StreamCounter`: sumar y restar.
  - `StreamMeter`: mover el nivel y marcar «lleno».
- **Capturas:** como las del resto de la familia, solo en oscuro, aprobadas en el PR. El resto del catálogo no cambia de captura.
- **`ChatBox`:** su ficha gana un ejemplo «Seleccionable» y explica los enlaces. Sus capturas aprobadas se sustituyen por D7 y D8. El ejemplo de la captura incluye un mensaje con enlace y uno largo con insignias.

## Risks / Trade-offs

- [`motion` en `StreamPoll` en vez de `state`, como en el resto de la familia (también `StreamCounter`, `StreamPinnedMessage` y `StreamMeter`)] → Lo dicen la ficha y el JSDoc. Llamar `status` al estado de la votación rompería el contrato que ya ha escrito Scaena, y ese estado es lo principal de la pieza.
- [Se ignoran los contadores a partir del tercero] → La ficha lo dice. Si hacen falta más, se añaden en otro cambio con su diseño.
- [La fila de mensaje compartida puede cambiar el HTML de `ChatBox`] → La prueba de `renderToString` sin `onSelect` lo vigila. Las capturas de `ChatBox` se aprueban de nuevo, una sola vez, con D7 y D8.
- [Los enlaces no se pueden pulsar] → Es a propósito (D7). Si una web los quiere pulsables, se añade una prop en otro cambio.
- [Un nombre con tres insignias no cabe en un `ChatBox` estrecho] → El grupo no se parte, así que desborda en vez de partirse. `ChatBox` ya corta lo que sobra (`overflow-hidden`), y a 420 px cabe el nombre más largo de Twitch.
