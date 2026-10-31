---

name: ColorPicker
description: "Selector de color con área de saturación y brillo, barra de tono, campo hexadecimal y muestras guardadas."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `defaultValue` (hex), `onChange(hex)`, `swatches` (lista de hex), `swatchesLabel`. Panel de 320px `radius-2xl` con `shadow-xl`; mandos blancos de 20px. Funciona con ratón, táctil y flechas del teclado.

**Límites.** Solo color sólido en hex. Los degradados, la subida de imagen y los modelos RGB/HSL del archivo no están.

**Teclado.** El área es un control de dos ejes: izquierda y derecha cambian la saturación, arriba y abajo el brillo. En la barra de tono, izquierda y derecha. El campo hex solo avisa cuando el color está completo.
