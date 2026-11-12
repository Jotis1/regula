---

name: MetricCard
description: "Tarjeta con una cifra clave, su tendencia y el periodo de comparación."
interactive: false
astroNote: "Con `onMenu` necesita una función: envuélvelo en un `.tsx` y úsalo como isla `client:load`."
---

**Props.** `label`, `value`, `change`, `trend` (`up` · `down`), `period`, `menu`, `icon` / `iconStyle`, `chart` / `chartStyle`, `changeBadge`, `footer`. Valor en Bricolage Grotesque 36/44 semibold; tendencia en `text-success-primary` / `text-error-primary` siempre con flecha, nunca solo color.

**Icono y gráfica.** Los tipos del Figma (`Metric item`, `1560:266217`). `iconStyle`: `featured` (círculo de color encima), `featured-inline` (círculo de marca junto al título), `modern` (cuadro con filo encima) y `modern-inline` (junto a la etiqueta y la cifra). `chart` es una lista de números que pinta una mini gráfica sin ejes en el color de la tendencia, decorativa para lectores (la cifra y el cambio ya lo dicen); `chartStyle`: `sparkline` (a la derecha de la cifra), `area` (a la derecha, con el icono en el título), `line` (a todo el ancho) y `header` (como `line`, con el título en una banda gris). `changeBadge` pinta el cambio como insignia y `footer` añade un pie bajo una raya («Ver informe» o ajustes y un botón).

**Detalles.** Funciona sin JavaScript. La tendencia lleva su flecha y, para lectores de pantalla, "Sube" o "Baja" delante de la cifra.

**Ampliaciones sobre la guía.** En la guía el botón de tres puntos no hacía nada: aquí `onMenu` recibe el clic y `menuLabel` cambia su nombre ("Más opciones"). `menu` también admite un nodo, como un `Dropdown` con su propio `trigger`.
