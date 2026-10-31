---

name: ChartLegend
description: "Leyenda de series con un punto de color y el nombre."
interactive: false
---

**Props.** `series` [{`name`, `color`?}], `vertical`. Las gráficas la incluyen solas cuando hay más de una serie.

**Cuándo usarla sola.** Cuando una leyenda sirve a varias gráficas o va en otro sitio de la tarjeta. Pasa las series en el mismo orden que la gráfica para que los colores coincidan.

**Tercera serie en oscuro.** La guía pide leyenda siempre con tres series o más: en oscuro la tercera serie (`utility-brand-200`) queda oscura sobre el fondo y el color solo no basta para distinguirla.

**Detalles.** Funciona sin JavaScript. Es una lista: los lectores de pantalla dicen cuántas series hay. Los puntos son decorativos; lo que cuenta es el nombre.
