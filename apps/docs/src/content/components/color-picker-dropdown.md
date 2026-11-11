---

name: ColorPickerDropdown
description: "Selector de color en un desplegable: seis disparadores que abren el ColorPicker en un popover."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `trigger` (`swatch-sm` · `swatch-md` · `swatch-button`, por defecto · `swatch-button-link` · `hex-input` · `select`), `value`/`defaultValue` (hex), `alpha`/`defaultAlpha`, `onChange(hex, alpha)`, `label` («Color»), `pickerProps` (las del `ColorPicker` del panel: `swatches`, `onAddSwatch`, `defaultModel`…) e `isOpen`/`onOpenChange`.

**Visual.** La del Figma (`Color picker dropdown`, `12424:15898`): muestras de 20 y 28, el botón secundario con muestra, texto y chevron, la versión enlace sin borde, el campo con la muestra, el hex y la opacidad separados, y el campo con etiqueta. El panel es el `ColorPicker` `solid` con sus pestañas (sólido, degradado, imagen) y su X, a 8 px del disparador y alineado a la derecha.

**Uso.** Donde el color es un ajuste más de un formulario o una barra de herramientas y no merece ocupar sitio abierto. Si se elige color a menudo, el `ColorPicker` a la vista.

**Accesibilidad.** El disparador es un botón con nombre y valor («Color: #7F56D9»; en `select`, la etiqueta y el valor). El panel es un diálogo con el mismo nombre en un popover de React Aria: Escape o la X lo cierran y el foco vuelve al disparador. Necesita JavaScript para abrirse.
