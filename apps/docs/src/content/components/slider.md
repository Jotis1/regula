---

name: Slider
description: "Control deslizante para un valor dentro de un rango."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `min`, `max`, `step`, `value` / `defaultValue`, `onChange(n)`, `aria-label`, `label` (`bottom` · `top-floating`), `formatValue(n)` y `range`. Pista `bg-quaternary`, relleno `fg-brand-primary`, mando `slider-handle-bg` con borde `slider-handle-border` y `shadow-md`.

**Teclado.** Flechas, Inicio y Fin.

**Rango.** Con `range` hay dos mandos y el valor es `[mínimo, máximo]` (`value`, `defaultValue` y `onChange` lo llevan así). El relleno va entre los dos, cada mando se maneja por separado con el teclado (Tab pasa del uno al otro) y el mínimo nunca pasa del máximo. Cada uno tiene su nombre accesible, «Mínimo» y «Máximo» por defecto (`thumbLabels`).

**Etiqueta.** `label="bottom"` escribe el valor de cada mando debajo de él (16px medium) y `label="top-floating"` lo pone en una burbuja encima (`bg-primary_alt`, `shadow-lg`, 12px semibold); `formatValue` decide cómo se escribe, por ejemplo con el signo de porcentaje detrás. El texto es decorativo: lo que anuncian los lectores es el valor numérico del mando. Con etiqueta, el componente reserva el hueco que ocupa.

**Diferencia con la vista previa de la guía.** Como el `range` nativo de la guía, el control es `inline-block` y se apoya en la línea base; con el interlineado de esta web queda 1px más abajo.
