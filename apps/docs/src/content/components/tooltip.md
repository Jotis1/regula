---

name: Tooltip
description: "Burbuja oscura que explica un control al pasar el ratón o al enfocarlo."
interactive: true
astroNote: "El disparador tiene que ser un componente React (como `Button`), no HTML de la página Astro: pon `Tooltip` y su botón juntos en un `.tsx` y úsalo con `client:load`."
---

**Props.** `title`, `text` (segunda línea en `tooltip-supporting-text`), `children` (el elemento que lo dispara), `open` (forzarlo visible). Fondo `bg-primary-solid`, `radius-lg`, `shadow-lg`, flecha centrada abajo.

**No.** Nada imprescindible dentro de un tooltip: en móvil no hay hover.

**Comportamiento.** Aparece encima del control, centrado y a 10px, al pasar el ratón (tras 300 ms) o al llegar con el teclado; Escape lo cierra sin mover el foco. El control queda descrito por el texto del tooltip (`aria-describedby`). Si no cabe arriba, se pone debajo.

**El disparador.** Tiene que poder recibir el foco y pasar `ref` y props al DOM, como `Button`. Un botón solo icono necesita además su `label`: el tooltip lo describe, no le da nombre.

**Detalles.** `open` lo deja fijo en línea sobre el control (así se ve en esta página).
