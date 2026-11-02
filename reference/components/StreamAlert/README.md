Alerta de un evento del directo (seguidor, suscripción, renovación, regalo, raid, bits o donación) en una tarjeta de 480px.

**Props.** `type` (`follow`, `sub`, `resub`, `gift`, `raid`, `bits`, `donation`), `user` (obligatorio), `amount`, `months`, `tier`, `message`, `detail` (sustituye al texto por defecto), `label`, `icon`, `state` (`enter` o `exit`).

**Cuándo usarla.** En OBS, como fuente de navegador con fondo transparente, de una en una y en cola. El icono va en `bg-brand-solid` para todos los tipos: el tipo lo dicen la etiqueta y el icono, no el color. Los textos por defecto llevan la voz de la suite; si el evento merece algo mejor, pásalo en `detail`.

**Movimiento.** `state="enter"` entra con fundido y 8px de subida en 250 ms; `state="exit"` sale en 200 ms. Con `prefers-reduced-motion` solo hay fundido. Es la única animación de la tarjeta.

**Evita.** Más de una alerta a la vez. Un color por tipo de evento. Signos de exclamación, salvo que el evento sea realmente bueno. Mensajes de espectadores sin moderar: `message` se pinta tal cual.
