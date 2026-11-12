---

name: RadarChart
description: "Gráfica de radar: una serie por polígono sobre ejes que salen del centro."
interactive: false
---

**Props.** `axes` (los ejes, desde arriba en el sentido de las agujas del reloj), `series` [{`name`, `data` (un valor por eje), `color`?}], `max` (por defecto, un techo redondo), `levels` (5), `legend` (`"bottom"`, por defecto con dos series o más · `"right"` · `false`), `format(v)` y `aria-label`.

**Visual.** La del Figma (`Radar chart`, `1084:7362`), en un lienzo de 392 × 372 que se escala al ancho: rejilla de polígonos y rayos en `border-tertiary`, ejes en `text-sm` `text-tertiary`, la escala en pastillas `utility-neutral-50` sobre el eje de arriba, y cada serie con el borde de 2 px y el relleno al 16 %. Colores por defecto `utility-brand-600`, `utility-sky-500` y `utility-pink-500`, como el Figma.

**Uso.** Para comparar pocas series (hasta cinco) en varios ejes de la misma escala: actividad por día, puntuaciones por área. Con muchos ejes o valores exactos, una `Table` o una `BarChart`.

**Accesibilidad.** El dibujo es una imagen con nombre (`aria-label`, por defecto «Gráfica de radar») y los valores van en una tabla solo para lectores: un eje por fila y una serie por columna. Cada polígono lleva el nombre de su serie al pasar el ratón. Funciona sin JavaScript.
