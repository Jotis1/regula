---

name: PageHeader
description: "Cabecera de página de app: migas, título, descripción, acciones y línea inferior."
interactive: false
---

**Props.** `breadcrumbs`, `title`, `description`, `actions`, `children` (p. ej. `Tabs`), `divider`, `avatar`, `banner`, `centered`, `back`, `headingLevel`.

**Avatar y banda.** Los estilos del Figma (`Page header`, `1239:122640`). `avatar` (un `Avatar`) va junto al título; con `banner` (`true` pinta el degradado de marca, o pasa una imagen), el avatar se monta sobre el borde de la banda y las migas van a su derecha. `centered` centra todo. `back` pone un enlace «Volver» que sustituye a las migas cuando la cabecera es estrecha (por debajo de 448 px de su propio ancho). Sin estas props, la cabecera de siempre. Título `display-sm-semibold` (30/38, Bricolage Grotesque); descripción `text-md-regular` en `text-tertiary`. La acción principal va la última, a la derecha.

**Detalles.** Funciona sin JavaScript. Es un `<header>` con el título en `<h1>`: uno por página. Si la cabecera va dentro de una página que ya tiene su `<h1>` (un panel, una pestaña), `headingLevel` cambia la etiqueta sin cambiar el aspecto: `headingLevel={2}` pinta un `<h2>`. El ejemplo de esta página lo usa. Las migas son un `Breadcrumbs`. La línea inferior sale por defecto; `divider={false}` la quita.
