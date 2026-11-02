Escena completa de 1920×1080 para los momentos sin juego: empezando, pausa, final del directo y offline.

**Props.** `variant` (`starting`, `brb`, `ending`, `offline`), `title`, `subtitle` (`false` lo oculta), `badge`, `seconds` o `target` (cuenta atrás, solo en `starting` y `brb`), `now` (hora fija, para pruebas), `paused`, `countdownLabel`, `channel`, `next` (línea central del pie), `handle`, `scale`.

**Cuándo usarla.** Como fuente de navegador a pantalla completa en OBS, una escena por variante. Sin `scale` se ajusta al ancho disponible (en OBS, a 1920, queda 1:1); con `scale` mide `1920 × scale`. Los textos por defecto llevan una broma seca por escena y ninguna más.

**Composición.** Fondo en `bg-primary` con rejilla de `border-secondary` desvanecida hacia los bordes, insignia de estado, titular en Bricolage Grotesque y pie con canal, próxima fecha y enlace. La cuenta atrás va en Geist con cifras tabulares, no en Bricolage, para que no baile al cambiar de segundo.

**Evita.** Meter más de una información de horario en el pie. Cambiar el titular a más de 24 caracteres: a 152px, dos líneas ya ocupan media pantalla. Usar el índigo en más sitios que el punto de la insignia.
