---

name: MarketingNav
description: "Cabecera de una web de marketing con menús desplegables o a todo el ancho, flotante o no, y menú móvil."
interactive: true
---

**Props.** `brand`, `items` [{`label`, `href`? o `panel` {`columns`, `header`?, `aside`?, `footer`?}}], `actions`, `menu` (`dropdown` · `full-width`), `type` (las catorce disposiciones del Figma), `floating`, `mobileLinks`, `labels` y `previewItem` (un menú abierto en línea, para vistas previas). Plantillas para los paneles: `NavMenu.Section` (columna con título), `NavMenu.Item` (icono suelto o en caja, título, descripción y etiqueta; o solo el título, como enlace corto) y `NavMenu.Card` (imagen arriba o a la izquierda, título, texto y acciones).

**Tipos.** Desplegables (`Dropdown header navigation`, `1288:26576`): `simple`, `featured-card`, `simple-with-footer`, `2-col-with-links-and-footer`, `simple-2-col`, `featured-posts` y `simple-2-col-with-footer`. A todo el ancho (`Full-width header navigation`, `1287:2392`): `2-col-with-sidebar`, `4-col-slim-with-footer`, `3-col-with-sidebar`, `blog-posts-with-footer`, `4-col-with-footer`, `blog-posts-with-sidebar` y `2-col-with-links`. Con `floating`, los «Floating …» del Figma: los veinte tipos. El tipo da el ancho del desplegable (336, 640, 768 u 800) y dónde va la columna aparte; las columnas que pasas se reparten a partes iguales.

**Visual.** La del Figma: cabecera de 72 px con la marca, los apartados en `text-md` seminegrita `text-secondary` y las acciones; el desplegable con radio 12 y `shadow-lg`, la columna aparte y el pie en `bg-secondary`; a todo el ancho, el panel ocupa la cabecera entera con el contenido a 1280. Flotante, en una caja de radio 16 con borde. Por debajo de 1024 px de ancho de la cabecera (consulta de contenedor), el botón de menú abre el menú móvil: los apartados, cada menú desplegable en una caja, los enlaces del pie en dos columnas y las acciones a todo el ancho.

**Uso.** La cabecera de la web pública. Para la de una app, `HeaderNav`.

**Accesibilidad.** Una `nav` con nombre («Principal»). Cada menú es un botón con su diálogo en un popover de React Aria: se abre con Enter o Espacio, el foco entra en el panel y Escape lo cierra y lo devuelve al botón. En el menú móvil, cada apartado con menú es un botón con `aria-expanded`.
