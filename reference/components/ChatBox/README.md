Chat del directo para overlay: lista de mensajes con insignias y nombre en color, anclada abajo y desvanecida arriba.

**Props.** `messages` (`{ user, text, tone?, badges?, id? }`), `width` (420 por defecto), `height` (520), `translucent`, `fade` (por defecto activo), `animate`, `aria-label`.

**Cuándo usarlo.** En OBS, como fuente de navegador. Los mensajes van a 20/30px, pensados para leerse sobre vídeo a 1080p. El nombre usa la escala `utility-<tono>-700` (`tone`: `brand`, `sky`, `emerald`, `pink`, `purple`, `neutral`...), siempre en semibold y seguido de dos puntos, así que el color no es lo único que lo distingue del texto.

**Translúcido.** `translucent` mezcla el fondo con transparencia y le aplica `backdrop-blur-lg`. Si el navegador no soporta `color-mix`, se queda en sólido. En OBS antiguo, usa el sólido.

**Movimiento.** Con `animate`, solo el último mensaje entra (250 ms). El resto no se mueve.

**Evita.** Pasar de 12 mensajes visibles. Nombres con colores libres: usa los tonos del sistema, o el chat parecerá una caja de rotuladores. Pintar `text` como HTML: es texto plano.
