---

name: ButtonUtility
description: "Botón pequeño de solo icono para barras de herramientas, que dice qué hace en un tooltip."
interactive: true
astroNote: "El tooltip necesita JavaScript: úsalo en una isla con `client:load`."
---

**Cuándo usarlo.** En barras de herramientas y filas con varias acciones pequeñas que se entienden por su icono: copiar, editar, descargar, borrar. Para la acción principal de una vista, un `Button`; para cerrar, `CloseButton`.

**Props.** `icon` (un icono de `@untitledui/icons`, como `Copy01`, o un nodo), `label` (obligatorio: nombre del botón y texto del tooltip), `hierarchy` (`secondary` por defecto · `tertiary`), `size` (`sm` por defecto, icono de 20 · `xs`, icono de 16), `tooltip` (`false` quita el tooltip), `tooltipPlacement` (`top` por defecto · `bottom` · `left` · `right`), `tooltipOpen` (visible siempre, para vistas previas), `disabled` y `href` (lo pinta como enlace).

**Visual.** Icono en `fg-quaternary` con 6px de relleno y `radius-sm`. `secondary` lleva fondo `bg-primary`, borde `border-primary` y `shadow-xs-skeuomorphic`; `tertiary`, sin fondo. Al pasar el ratón, fondo `bg-primary_hover` e icono `fg-quaternary_hover`. Deshabilitado, al 50 %.

**Comportamiento.** Al pasar el ratón (tras 300 ms) o llegar con el teclado abre un tooltip con `label`; Escape lo cierra. Deshabilitado no responde y no abre tooltip.

**Accesibilidad.** Es un `<button>` (o un `<a>` con `href`) con `label` como nombre accesible, así que un lector de pantalla anuncia la acción aunque no haya texto visible. El foco lleva el anillo de foco.
