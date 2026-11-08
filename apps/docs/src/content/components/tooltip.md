---

name: Tooltip
description: "Burbuja oscura que explica un control al pasar el ratón o al enfocarlo."
interactive: true
astroNote: "El disparador tiene que ser un componente React (como `Button`), no HTML de la página Astro: pon `Tooltip` y su botón juntos en un `.tsx` y úsalo con `client:load`."
---

**Props.** `title`, `text` (segunda línea en `tooltip-supporting-text`), `children` (el elemento que lo dispara), `open` (forzarlo visible), `placement` (`top` por defecto · `bottom` · `left` · `right`: el lado del control en el que sale) y `arrow` (`center` por defecto · `start` · `end`, a 12px de la esquina de la burbuja · `false`, sin flecha). Fondo `bg-primary-solid`, `radius-lg`, `shadow-lg`, flecha de 6px.

**No.** Nada imprescindible dentro de un tooltip: en móvil no hay hover.

**Comportamiento.** Aparece en el lado de `placement` (por defecto encima del control, centrado) y a 10px, al pasar el ratón (tras 300 ms) o al llegar con el teclado; Escape lo cierra sin mover el foco. El control queda descrito por el texto del tooltip (`aria-describedby`). Si no cabe en su lado, se pone en el contrario. Con `arrow="start"` o `"end"` la burbuja se alinea con la esquina del control, para que la flecha le apunte.

**El disparador.** Tiene que poder recibir el foco y pasar `ref` y props al DOM, como `Button`. Un botón solo icono necesita además su `label`: el tooltip lo describe, no le da nombre.

**Detalles.** `open` lo deja fijo en línea sobre el control (así se ve en esta página).
