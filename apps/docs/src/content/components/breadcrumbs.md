---

name: Breadcrumbs
description: "Ruta de navegación encima del título de página."
interactive: false
---

**Props.** `items` [{`label`, `href`?, `icon`?}]. El primero puede ser solo un icono (`home-line`). El último es la página actual, en `text-brand-secondary`, sin enlace.

**Accesibilidad.** Va en un `<nav>` llamado "Migas de pan" (se cambia con `aria-label`), la página actual lleva `aria-current="page"` y los separadores quedan fuera del árbol accesible. Si un elemento es solo icono, su `label` sigue ahí para lectores de pantalla.

**Sin enlace.** Un elemento sin `href` que no es el último se pinta como texto: la guía lo enlazaba a `#`, que no lleva a ninguna parte.
