---

name: ProgressCircle
description: "Progreso en círculo o semicírculo, con su valor y una etiqueta, de 64 a 280px."
interactive: false
---

**Cuándo usarlo.** Un porcentaje que merece protagonismo: uso de una cuota, objetivo cumplido, almacenamiento. Para un avance dentro de una lista o una fila, `ProgressBar`; para los pasos de un proceso, `ProgressSteps`.

**Props.** `value` (0–100; fuera de rango se recorta), `size` (`xxs` 64 · `xs` 160 · `sm` 200 · `md` 240 · `lg` 280; por defecto `md`), `shape` (`circle` · `half`), `label` (qué progresa), `valueText` (sustituye el «40%») y `aria-label` (nombre de la barra si no hay `label` de texto).

**Visual.** Dos trazos con extremos redondeados: la pista en `border-secondary` y el arco en `fg-brand-primary`. El grosor es una décima del diámetro (6px en `xxs`, 16 · 20 · 24 · 28 en el resto). El círculo empieza arriba y gira a la derecha; el semicírculo va de izquierda a derecha por encima, con el mismo ancho y el alto de la mitad más medio trazo. En el centro, la etiqueta (`text-sm` medium en `text-tertiary`; `text-xs` en `xs` y `sm`) sobre el valor en `font-display` semibold (`display-lg` · `display-md` · `display-sm` · `display-xs`). En `xxs` el valor va dentro (`text-sm` semibold) y la etiqueta debajo.

**Accesibilidad.** Es un `role="progressbar"` con `aria-valuenow`, `aria-valuemin` y `aria-valuemax`; el nombre sale de `label` (si es texto) o de `aria-label`. El texto que se ve queda oculto a los lectores para que no se lea dos veces.

**Detalles.** No mide nada ni usa JavaScript: el arco es un trazo SVG con `pathLength` de 100, así que se pinta igual en el servidor. Con 0 no se dibuja el arco (los extremos redondeados dejarían un punto).
