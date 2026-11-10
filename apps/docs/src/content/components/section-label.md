---

name: SectionLabel
description: "Título de una sección de ajustes con su texto de apoyo, marca de obligatorio, ayuda y acciones."
interactive: true
astroNote: "Sin `help` se pinta en el servidor, sin isla. Con `help`, el tooltip necesita JavaScript: úsalo en una isla con `client:load`."
---

**Cuándo usarlo.** En páginas de ajustes y formularios largos, en la columna de la izquierda, junto a los campos de cada sección: dice qué se ajusta ahí. Para la cabecera de una sección de contenido con acciones a la derecha, `SectionHeader`.

**Props.** `title`, `description` (una línea en `text-tertiary`), `required` (asterisco de marca), `help` (texto del icono de ayuda junto al título), `actions` (normalmente `Button` `link-gray` y `link-color` de tamaño `sm`, debajo del texto), `size` (`sm` por defecto, título y apoyo de 14 · `md`, de 16) y `as` (`h3` por defecto · `h2` · `h4`).

**Visual.** Título seminegrita en `text-secondary`; asterisco en `text-brand-tertiary`; icono de ayuda de 16px en `fg-quaternary`; apoyo en `text-tertiary`; acciones a 12px por debajo, separadas 8px.

**Accesibilidad.** El título es un encabezado (`h3` por defecto: elige el nivel que le toque en la página). El asterisco está oculto para lectores de pantalla y en su lugar dicen «obligatorio». El icono de ayuda es un botón «Ayuda: <título>» que abre su texto en un tooltip.
