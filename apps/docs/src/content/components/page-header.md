---

name: PageHeader
description: "Cabecera de página de app: migas, título, descripción, acciones y línea inferior."
interactive: false
---

**Props.** `breadcrumbs`, `title`, `description`, `actions`, `children` (p. ej. `Tabs`), `divider`. Título `display-sm-semibold` (30/38, Bricolage Grotesque); descripción `text-md-regular` en `text-tertiary`. La acción principal va la última, a la derecha.

**Detalles.** Funciona sin JavaScript. Es un `<header>` con el título en `<h1>`: uno por página. Las migas son un `Breadcrumbs`. La línea inferior sale por defecto; `divider={false}` la quita.
