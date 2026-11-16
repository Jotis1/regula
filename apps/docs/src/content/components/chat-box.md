---

name: ChatBox
description: "Chat del directo para overlay: lista de mensajes con insignias y nombre en color, anclada abajo y desvanecida arriba."
interactive: false
---

**Props.** `messages` (`{ user, text, tone?, badges?, id?, selectable? }`), `width` (420 por defecto), `height` (520), `translucent`, `fade` (por defecto activo), `animate`, `onSelect`, `selectedId`, `labels` (`select`, «Destacar» por defecto, y `selected`, «Destacado»), `aria-label`.

**Cuándo usarlo.** En OBS, como fuente de navegador. Los mensajes van a 20/30px, pensados para leerse sobre vídeo a 1080p. El nombre usa la escala `utility-<tono>-700` (`tone`: `brand`, `sky`, `emerald`, `pink`, `purple`, `orange`, `indigo`, `neutral`), siempre en semibold y seguido de dos puntos, así que el color no es lo único que lo distingue del texto.

**Translúcido.** `translucent` mezcla el fondo con transparencia y le aplica `backdrop-blur-lg`. Si el navegador no soporta `color-mix`, se queda en sólido. En OBS antiguo, usa el sólido.

**Movimiento.** Con `animate`, solo el último mensaje entra (250 ms). El resto no se mueve.

**Enlaces.** Las direcciones que empiezan por `http://`, `https://` o `www.` se ven subrayadas y en el color de marca, sin la puntuación del final («mira https://jotis.me.» marca `https://jotis.me`). Se marcan pero no se pulsan: en OBS no hay clic, y abrir lo que escribe cualquiera del público es una puerta al phishing. Siguen siendo texto plano. `jotis.me` sin `www.` ni protocolo no se marca, para no confundir «v1.2» con una dirección.

**Nombre e insignias.** Las insignias, el nombre y los dos puntos van siempre juntos en la misma línea, con las insignias centradas en altura con el nombre. Un mensaje largo parte después del nombre.

**Seleccionable.** Con `onSelect`, cada mensaje con `id` es un botón que llama a `onSelect` con el mensaje. `selectable: false` deja fuera uno concreto (un bot). Sin `onSelect`, el chat es de solo lectura, como en un overlay.

**Qué hace el clic.** En un panel de control, un mensaje que se puede pulsar puede hacer pensar que se borra o que se banea a su autor. Por eso cada mensaje seleccionable lleva a la derecha la chincheta de `StreamPinnedMessage` con «Destacar». Con ratón sale al pasar por encima o con el foco, y siempre ocupa su sitio, así que el texto no se mueve. En táctil, sin hover, se ve siempre la chincheta sola. El de `selectedId` lleva `aria-pressed`, la raya de 2px en `fg-brand-primary` de las líneas destacadas de `CodeSnippet` sobre un fondo de marca, y la marca «Destacado». El fondo es `bg-brand-primary` al 15 % y no `bg-brand-primary_alt`, porque el chat siempre va en oscuro y ahí ese token es el mismo gris que el chat. El nombre accesible empieza por la acción: «Destacar el mensaje de lucia_88: ¿Has mirado detrás del cuadro?». Si eliges para otra cosa, cambia los textos con `labels`.

**Evita.** Pasar de 12 mensajes visibles. Nombres con colores libres: usa los tonos del sistema, o el chat parecerá una caja de rotuladores. Pintar `text` como HTML: es texto plano.

**Mensajes que se conservan.** Cada mensaje se reconoce por su `id` o, si no lo tiene, por usuario y texto. En una ventana deslizante (entra uno y sale el más antiguo) solo se monta y se anima el nuevo.

**Ampliaciones sobre la guía.** `onSelect`, `selectedId`, `selectable` y `labels`, para elegir un mensaje desde un panel de control (destacarlo en pantalla, por ejemplo), y los enlaces marcados.

**Diferencias con la guía.** `text` es texto (`string`), no un nodo: llega del público. Los dos puntos tras el nombre son texto real y no un adorno de CSS, para que los lea cualquier lector de pantalla. El translúcido mezcla el color en `oklab` (la guía, en `srgb`): al mezclar con transparente sale el mismo color.

**Accesibilidad.** Es un registro (`role="log"`, `aria-live="polite"`) llamado "Chat del directo" (se cambia con `aria-label`).
