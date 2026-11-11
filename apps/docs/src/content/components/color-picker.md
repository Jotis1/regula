---

name: ColorPicker
description: "Selector de color con los doce tipos del Figma: sólido, degradado, imagen, muestras, barras y paleta, en Hex, RGB, CSS, HSL y HSB."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `defaultValue` (hex), `onChange(hex, opacidad)`, `swatches` (lista de hex), `swatchesLabel`. Con `type`: `defaultAlpha`, `model` / `defaultModel` / `onModelChange`, `onAddSwatch`, `defaultGradient` / `onGradientChange`, `onImageChange` / `onImageAdjust`, `onClose`, `source`, `docsHref`, `onReset` y `labels`. Panel `radius-2xl` con `shadow-xl`; mandos blancos de 20px. Funciona con ratón, táctil y flechas del teclado.

**Tipos.** Los doce del Figma (`Color picker`, `12423:52680`). Sin `type`, el de siempre.
- `solid`, `gradient` e `image`: el panel con las pestañas Sólido, Degradado e Imagen, abierto en esa. Sólido: área, cuentagotas (solo en los navegadores que lo tienen), tono, opacidad, modelo de color y guardados.
- `swatch`, `saved-sm`, `saved-md`, `brand` y `gray`: muestras. `brand` y `gray` traen los 600 de Tailwind si no pasas `swatches`, con `source`, `docsHref` y `onReset` en la cabecera y el pie.
- `minimal`, `hue-slider` y `transparency-slider`: barras de tono y opacidad.
- `palette`: rejilla de 18 tonos × 11 luminosidades, opacidad, modelo y guardados.

**Modelos.** `model` (`hex`, `rgb`, `css`, `hsl`, `hsb`, `_Color inputs` `12304:616891`) cambia los campos, no el color: cambiar de modelo enseña el mismo color en el otro. Cada campo avisa en cuanto lo escrito es válido; al salir vuelve al valor real. `onChange` sigue recibiendo el hex y, con `type`, la opacidad de 0 a 1.

**Degradado.** Vista previa, forma lineal o radial, invertir, barra de paradas y una fila por parada (posición, color, opacidad y quitar). Cada mando es un `slider` «Parada N»: las flechas lo mueven de 1 en 1 (con Mayúsculas, de 10 en 10), Inicio y Fin a los extremos, y Suprimir lo quita; siempre quedan dos. «Añadir» pone una parada entre la elegida y la siguiente y le pasa el foco. `onGradientChange` recibe la lista ordenada por posición.

**Imagen.** Zona para soltar con el botón «Haz clic para subir» (un `input type="file"` de imágenes), relleno (rellenar, ajustar, recortar, mosaico) y siete ajustes de -100 a 100. La vista previa aplica exposición, contraste, saturación, temperatura y matiz con filtros CSS; luces y sombras solo se avisan en `onImageAdjust`.


**Teclado.** El área es un control de dos ejes: izquierda y derecha cambian la saturación, arriba y abajo el brillo. En las barras de tono y opacidad, izquierda y derecha. La paleta es un grupo de opciones con una sola parada de tabulación: las flechas la recorren en las dos direcciones. El campo hex solo avisa cuando el color está completo.
