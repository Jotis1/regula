---

name: LineChart
description: "Gráfica de líneas para la evolución de una o varias series en el tiempo."
interactive: false
---

**Props.** `labels`, `series` [{`name`, `data`, `color`?}], `format(v)` (eje y tooltip), `area` (relleno suave bajo la primera serie), `legend` (`true`/`"top"` encima, `"right"` en columna a la derecha, `false` ninguna), `width`/`height` (proporción del SVG, se escala al ancho), `axisLabels` {`x`, `y`} (títulos de los ejes), `aria-label`.

**Leyenda y títulos.** Los del Figma (`Line and bar chart`, `1062:46989`): la leyenda va encima (`top`, por defecto con dos series o más) o a la derecha (`right`, en columna), y `axisLabels` pinta el título del eje vertical girado a la izquierda y el del horizontal bajo las etiquetas. Sin ellos, el dibujo es el de siempre.

**Colores.** Por orden: `utility-brand-600`, `utility-brand-400`, `utility-brand-200`, `utility-sky-500`, `utility-pink-500`, `utility-neutral-400`, igual que las series del archivo (la marca primero, en degradado). Rejilla `border-tertiary`; ejes `text-xs` en `text-tertiary`.

**Marcador.** `marker` {`index`, `series`?, `type`?, `value`?, `label`?} pinta el `ChartMarker` del Figma sobre un punto: la línea hasta el eje y la burbuja con el valor y la etiqueta.

**Reglas.** Máximo 4 series. Si hay que comparar valores exactos, una tabla. Escala desde cero.

**Tercera serie en oscuro.** En oscuro la escala de marca se invierte, como en el archivo: `utility-brand-200` queda oscura sobre el fondo oscuro y la tercera línea casi no se ve. Con tres series o más, deja siempre la leyenda (sale sola desde dos series) y, si la tercera importa, dale un `color` propio de más contraste, como `var(--utility-sky-500)`.

**Accesibilidad.** El dibujo es una imagen con nombre: pasa en `aria-label` qué cuenta la gráfica ("Gastos de noviembre a octubre"); por defecto dice "Gráfica de líneas". Cada punto lleva su valor en un título que se ve al pasar el ratón. Si los valores exactos importan, acompáñala de una `Table`.

**Detalles.** Funciona sin JavaScript, también con `format` en Astro. Para cifras, usa `formatNumber` o `formatCurrency` del paquete: `toLocaleString("es-ES")` no agrupa los números de cuatro cifras ("1500 €").
