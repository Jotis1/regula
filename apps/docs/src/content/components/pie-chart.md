---

name: PieChart
description: "Gráfica circular o de dónut para el reparto de un total."
interactive: false
---

**Props.** `data` [{`name`, `value`, `color`?}], `size` (200), `hole` (0–0,9; 0,6 por defecto), `center` (texto en el hueco), `format(v)`, `legend`.

**Reglas.** Cinco porciones como mucho; agrupa el resto en "Otros". Siempre con leyenda o etiquetas: el color solo no basta.

**Tercera porción en oscuro.** En oscuro la escala de marca se invierte: la tercera porción (`utility-brand-200`) queda oscura sobre el fondo oscuro. Por eso la leyenda sale siempre; quítala (`legend={false}`) solo si pones etiquetas de otra forma.

**Accesibilidad.** El dibujo es una imagen con nombre: pasa en `aria-label` qué reparte ("Gasto de octubre por categoría"); por defecto dice "Gráfica circular". Cada porción lleva su valor en un título que se ve al pasar el ratón.

**Detalles.** Funciona sin JavaScript. Con `hole={0}` es una tarta; con un solo dato, un anillo entero.
