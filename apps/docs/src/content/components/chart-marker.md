---

name: ChartMarker
description: "Marcador de gráfica: línea vertical con su punto y la burbuja del valor."
interactive: false
---

**Props.** `value` y `label` (las dos líneas de la burbuja), `type` (`line` punto hueco y línea que se desvanece · `dash` punto lleno y línea de puntos · `minimal` línea lisa y solo el valor), `height` (200), `color` (`utility-brand-600`) y `tooltip` (`true`).

**En LineChart y BarChart.** Con la prop `marker` {`index`, `series`?, `type`?, `value`?, `label`?}: la línea baja del punto (o de lo alto de la barra apilada) al eje, y la burbuja enseña su valor con `format` y la etiqueta del eje, o lo que pases. Sin `marker`, el HTML de las gráficas es el de siempre.

**Visual.** La del Figma (`Chart marker`, `8100:193259`): la burbuja es la de `Tooltip` (`bg-primary-solid`, valor en seminegrita y la segunda línea en `tooltip-supporting-text`), a 14 px sobre el punto.

**Accesibilidad.** La línea y el punto son decorativos; la burbuja es texto y se lee. El marcador es fijo: para un valor que cambia con el ratón, muévelo tú con `index`.
