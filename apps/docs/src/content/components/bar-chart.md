---

name: BarChart
description: "Gráfica de barras, apiladas por defecto, para comparar cantidades por periodo o categoría."
interactive: false
---

**Props.** `labels`, `series`, `stacked` (`true` por defecto; `false` para agrupadas), `format(v)`, `legend`, `width`/`height`. Barras de 32px máx. con esquinas de 4px arriba.

**Uso.** Gasto por categoría y mes. Mismos colores de serie que `LineChart`.

**Tercera serie en oscuro.** En oscuro la escala de marca se invierte: la tercera serie (`utility-brand-200`) queda oscura sobre el fondo oscuro. Con tres series o más, deja siempre la leyenda (sale sola desde dos series) y, si hace falta, dale a esa serie un `color` propio.

**Accesibilidad.** El dibujo es una imagen con nombre: pasa en `aria-label` qué cuenta la gráfica; por defecto dice "Gráfica de barras". Cada barra lleva su valor en un título que se ve al pasar el ratón.

**Detalles.** Funciona sin JavaScript, también con `format` en Astro. Apiladas, solo la barra de arriba lleva las esquinas redondeadas.
