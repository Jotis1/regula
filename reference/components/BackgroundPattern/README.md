Fondo decorativo detrás de cabeceras, estados vacíos o tarjetas de bienvenida: rejilla, rejilla de puntos, rejilla con casillas, círculos o cuadrados concéntricos, con máscara de desvanecido.

**Props.** `pattern` (`grid` · `grid-dot` · `grid-check` · `circles` · `squares`), `size` (`sm` · `md` · `lg`: celda de 80/96 px en rejillas; 336/480/768 px en concéntricos), `mask` (`radial` · `radial-down` · `radial-up` · `linear-down` · `linear-up` · `none`), `width`/`height` (área de la rejilla, 1536×960 por defecto), `seed` (reparto de casillas en `grid-check`).

**Visual.** Líneas `border-secondary` de 1px; puntos `utility-neutral-300` cada 32 px; casillas `bg-secondary`. Ocupa todo su contenedor (`position: absolute; inset: 0`), así que el padre necesita `position: relative` y el contenido, su propio `position: relative` para quedar encima.

**Reglas.** Decoración, no información: lleva `aria-hidden`. Uno por vista, y nunca detrás de tablas o texto largo.
