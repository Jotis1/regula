---

name: VideoPlayer
description: "Reproductor de vídeo 16:9 con botón central, barra de controles, tiempo, volumen y pantalla completa."
interactive: true
---

**Props.** `src`, `poster`, `duration` (si no hay `src`, para maquetas). Esquinas `radius-xl`; controles blancos sobre degradado negro.

**Excepción de color.** Los controles van en blanco y negro fijos en ambos temas: están sobre el vídeo, no sobre la interfaz, y deben leerse sobre cualquier imagen.

**Accesibilidad.** El botón grande del centro es un atajo para el ratón: con teclado se usa el de la barra, que hace lo mismo, y así un lector de pantalla no oye dos "Reproducir". La barra de posición se lee como "1:05 de 4:12".

**Ampliación sobre la guía.** `labels` sustituye sus textos (Reproducir, Pausa, Posición, Silenciar, Activar sonido, Pantalla completa y el de la posición).

**Tamaños (`size`).** Los del Figma, que cambian la barra de acciones; los botones llevan 8px de relleno e iconos de 16:
- `sm` (320 × 180): reproducir, volumen y pantalla completa, sin barra de progreso. Esquinas `radius-lg`.
- `md` (560 × 315): reproducir, tiempo transcurrido, progreso, tiempo que queda (`-08:24`), volumen y pantalla completa. Esquinas `radius-lg`.
- `lg` (720 × 405): como `md`, con un control de volumen deslizante y el botón de velocidad (1x, 1.25x, 1.5x, 2x, 0.5x). Esquinas `radius-xl`.

**Sin tamaño.** Sin `size`, el reproductor de siempre. El ancho lo pone quien lo usa: el alto sigue la proporción 16:9. `labels` acepta también `volume` y `speed`.
