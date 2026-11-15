---

name: ChatBox
description: "Chat del directo para overlay: lista de mensajes con insignias y nombre en color, anclada abajo y desvanecida arriba."
interactive: false
---

**Props.** `messages` (`{ user, text, tone?, badges?, id?, selectable? }`), `width` (420 por defecto), `height` (520), `translucent`, `fade` (por defecto activo), `animate`, `onSelect`, `selectedId`, `aria-label`.

**Cuándo usarlo.** En OBS, como fuente de navegador. Los mensajes van a 20/30px, pensados para leerse sobre vídeo a 1080p. El nombre usa la escala `utility-<tono>-700` (`tone`: `brand`, `sky`, `emerald`, `pink`, `purple`, `orange`, `indigo`, `neutral`), siempre en semibold y seguido de dos puntos, así que el color no es lo único que lo distingue del texto.

**Translúcido.** `translucent` mezcla el fondo con transparencia y le aplica `backdrop-blur-lg`. Si el navegador no soporta `color-mix`, se queda en sólido. En OBS antiguo, usa el sólido.

**Movimiento.** Con `animate`, solo el último mensaje entra (250 ms). El resto no se mueve.

**Enlaces.** Las direcciones que empiezan por `http://`, `https://` o `www.` se ven subrayadas y en el color de marca, sin la puntuación del final («mira https://jotis.me.» marca `https://jotis.me`). Se marcan pero no se pulsan: en OBS no hay clic, y abrir lo que escribe cualquiera del público es una puerta al phishing. Siguen siendo texto plano. `jotis.me` sin `www.` ni protocolo no se marca, para no confundir «v1.2» con una dirección.

**Nombre e insignias.** Las insignias, el nombre y los dos puntos van siempre juntos en la misma línea, con las insignias centradas en altura con el nombre. Un mensaje largo parte después del nombre.

**Seleccionable.** Con `onSelect`, cada mensaje con `id` es un botón que llama a `onSelect` con el mensaje; el de `selectedId` lleva `aria-pressed`, fondo activo y borde índigo. `selectable: false` deja fuera uno concreto (un bot). Sin `onSelect`, el chat es de solo lectura, como en un overlay.

**Evita.** Pasar de 12 mensajes visibles. Nombres con colores libres: usa los tonos del sistema, o el chat parecerá una caja de rotuladores. Pintar `text` como HTML: es texto plano.

**Mensajes que se conservan.** Cada mensaje se reconoce por su `id` o, si no lo tiene, por usuario y texto. En una ventana deslizante (entra uno y sale el más antiguo) solo se monta y se anima el nuevo.

**Ampliaciones sobre la guía.** `onSelect`, `selectedId` y `selectable`, para elegir un mensaje desde un panel de control (destacarlo en pantalla, por ejemplo), y los enlaces marcados.

**Diferencias con la guía.** `text` es texto (`string`), no un nodo: llega del público. Los dos puntos tras el nombre son texto real y no un adorno de CSS, para que los lea cualquier lector de pantalla. El translúcido mezcla el color en `oklab` (la guía, en `srgb`): al mezclar con transparente sale el mismo color.

**Accesibilidad.** Es un registro (`role="log"`, `aria-live="polite"`) llamado "Chat del directo" (se cambia con `aria-label`).
