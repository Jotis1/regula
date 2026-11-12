---

name: BackgroundPattern
description: "Fondo decorativo detrás de cabeceras, estados vacíos o tarjetas de bienvenida: rejillas o figuras concéntricas con desvanecido."
interactive: false
---

**Props.** `pattern` (`grid` · `grid-dot` · `grid-check` · `tech-grid` · `circles` · `squares`; `tech-grid` es la matriz de puntos de 12 px, 8 en `sm`, que aparecen y se apagan al azar con `seed`), `size` (`sm` · `md` · `lg`: celda de 80/96 px en rejillas; 336/480/768 px en concéntricos), `mask` (`radial` · `radial-down` · `radial-up` · `linear-down` · `linear-up` · `none`), `width`/`height` (área de la rejilla, 1536×960 por defecto), `seed` (reparto de casillas en `grid-check`).

**Visual.** Líneas `border-secondary` de 1px; puntos `utility-neutral-300` cada 32 px; casillas `bg-secondary`. Ocupa todo su contenedor (`position: absolute; inset: 0`), así que el padre necesita `position: relative` y el contenido, su propio `position: relative` para quedar encima.

**Reglas.** Decoración, no información: lleva `aria-hidden`. Uno por vista, y nunca detrás de tablas o texto largo.

**Detalles.** Funciona sin JavaScript. El mismo `seed` da siempre las mismas casillas, también entre servidor y navegador.

**Diferencia con la vista previa de la guía.** Bajo cada muestra, el nombre del patrón sale aquí en Geist Mono, la fuente de código de la guía; en la vista previa salía con el monospace del navegador. Es solo el pie del ejemplo, no el componente.
