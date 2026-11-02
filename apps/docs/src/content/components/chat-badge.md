---

name: ChatBadge
description: "Insignia cuadrada de chat para el rol del usuario: streamer, moderador, VIP, suscriptor o bits."
interactive: false
---

**Props.** `kind` (`broadcaster`, `mod`, `vip`, `sub`, `bits`), `size` (px, 20 por defecto; 18 como mínimo en chat), `title` (sustituye al texto accesible).

**Cuándo usarla.** Delante del nombre en `ChatBox` y en cualquier lista de usuarios. Cada tipo tiene su tono y su icono, así que el rol no depende solo del color. Los tonos son las escalas `utility-*` en oscuro (fondo `-50`, borde `-200`, icono `-700`), la misma receta que `Badge`.

**Emotes.** El sistema no dibuja emotes: son arte del canal. Twitch los pide en 28, 56 y 112 px; las insignias de suscriptor en 18, 36 y 72 px. Prepáralos a esos tamaños y pruébalos sobre el fondo de `ChatBox`, que es el real.

**Evita.** Más de tres insignias por mensaje. Tonos nuevos sin pasar por `utility-*`.

**Diferencias con la guía.** La insignia lleva su propia raíz oscura (`dark-mode`): en la guía no la tenía y, fuera de `ChatBox` y sobre una página clara, salía con los tonos claros.

**Accesibilidad.** Es una imagen con nombre ("Moderador", "VIP"…), que también sale al pasar el ratón (`title`).
