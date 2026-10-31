---

name: MetricCard
description: "Tarjeta con una cifra clave, su tendencia y el periodo de comparación."
interactive: false
astroNote: "Con `onMenu` necesita una función: envuélvelo en un `.tsx` y úsalo como isla `client:load`."
---

**Props.** `label`, `value`, `change`, `trend` (`up` · `down`), `period`, `menu`. Valor en Bricolage Grotesque 36/44 semibold; tendencia en `text-success-primary` / `text-error-primary` siempre con flecha, nunca solo color.

**Detalles.** Funciona sin JavaScript. La tendencia lleva su flecha y, para lectores de pantalla, "Sube" o "Baja" delante de la cifra.

**Ampliaciones sobre la guía.** En la guía el botón de tres puntos no hacía nada: aquí `onMenu` recibe el clic y `menuLabel` cambia su nombre ("Más opciones"). `menu` también admite un nodo, como un `Dropdown` con su propio `trigger`.
