---

name: Pagination
description: "Paginación con Anterior/Siguiente y números, separada de la tabla por una línea."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvela en un `.tsx` y úsala con `client:load`."
---

**Props.** `total` (páginas), `page` / `defaultPage`, `onChange(n)`. Con más de 7 páginas recorta con "…". Separada de la tabla por una línea `border-secondary`.

**Accesibilidad.** Va en un `<nav>` llamado "Paginación"; la página actual lleva `aria-current="page"` y cada número se anuncia como "Página N". Anterior se desactiva en la primera y Siguiente en la última. Pulsar la página actual no avisa.

**Recorte.** Hasta 7 páginas se ven todas. Con más, cerca de los extremos se muestran `1 2 3 … 8 9 10`, y en medio `1 … 4 5 6 … 10`.

**Textos.** `labels` cambia "Anterior", "Siguiente", el nombre de la navegación y el de cada número.
