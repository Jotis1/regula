---

name: Slider
description: "Control deslizante para un valor dentro de un rango."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `min`, `max`, `value` / `defaultValue`, `onChange(n)`, `aria-label`. Pista `bg-quaternary`, relleno `fg-brand-primary`, mando `slider-handle-bg` con borde `slider-handle-border` y `shadow-md`.

**Teclado.** Flechas, Inicio y Fin.

**Diferencia con la vista previa de la guía.** Como el `range` nativo de la guía, el control es `inline-block` y se apoya en la línea base; con el interlineado de esta web queda 1px más abajo.
