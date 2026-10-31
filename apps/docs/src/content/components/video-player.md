---

name: VideoPlayer
description: "Reproductor de vídeo 16:9 con botón central, barra de controles, tiempo, volumen y pantalla completa."
interactive: true
---

**Props.** `src`, `poster`, `duration` (si no hay `src`, para maquetas). Esquinas `radius-xl`; controles blancos sobre degradado negro.

**Excepción de color.** Los controles van en blanco y negro fijos en ambos temas: están sobre el vídeo, no sobre la interfaz, y deben leerse sobre cualquier imagen.

**Accesibilidad.** El botón grande del centro es un atajo para el ratón: con teclado se usa el de la barra, que hace lo mismo, y así un lector de pantalla no oye dos "Reproducir". La barra de posición se lee como "1:05 de 4:12".

**Ampliación sobre la guía.** `labels` sustituye sus textos (Reproducir, Pausa, Posición, Silenciar, Activar sonido, Pantalla completa y el de la posición).
