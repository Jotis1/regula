---

name: NowPlaying
description: "Tarjeta de «suena ahora» con carátula, título, artista y una línea fina de progreso."
interactive: false
---

**Props.** `title`, `artist`, `cover` (URL de imagen; si falta, icono de volumen), `progress` (de 0 a 1), `paused`, `width` (360 por defecto), `labels`.

**Cuándo usarla.** En una esquina del overlay mientras suena música. Título y artista se recortan con puntos suspensivos en una sola línea. La barra de progreso mide 3px, pegada al borde inferior, y no se anima por su cuenta: avanza cuando le llega un valor nuevo.

**Evita.** Ecualizadores o notas que bailan: el sistema no anima por decorar. Poner música sin licencia para directo: la tarjeta no lo arregla.

**Ampliaciones sobre la guía.** `labels` sustituye "Suena ahora", "En pausa" y el nombre de la barra ("Progreso de la canción").

**Accesibilidad.** La carátula es decorativa (`alt=""`): el título ya dice qué suena. La barra es un `progressbar` con nombre.
