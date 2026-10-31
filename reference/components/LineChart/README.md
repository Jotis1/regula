Gráfica de líneas para la evolución de una o varias series en el tiempo.

**Props.** `labels`, `series` [{`name`, `data`, `color`?}], `format(v)` (eje y tooltip), `area` (relleno suave bajo la primera serie), `legend`, `width`/`height` (proporción del SVG, se escala al ancho), `aria-label`.

**Colores.** Por orden: `utility-brand-600`, `utility-brand-400`, `utility-brand-200`, `utility-sky-500`, `utility-pink-500`, `utility-neutral-400`, igual que las series del archivo (la marca primero, en degradado). Rejilla `border-tertiary`; ejes `text-xs` en `text-tertiary`.

**Reglas.** Máximo 4 series. Si hay que comparar valores exactos, una tabla. Escala desde cero.
