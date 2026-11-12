---

name: ContentDivider
description: "Separador horizontal, solo o con texto o un botón en el centro."
interactive: false
---

**Props.** `label` (+ `heading` para texto de título), `actions` o `children` (lo del centro), `variant` (`single` · `dual` · `fill`).

**Acciones.** Los tipos con botón del Figma (`Content divider`, `1252:126874`): `actions` recibe un `Button` («Añadir»), un `Button` solo icono o un `ButtonGroup` (anterior, nuevo y siguiente con iconos, o «Ver todo / Activos / Inactivos»), en cualquiera de las tres variantes. Es lo mismo que `children` con nombre; si llegan los dos, gana `actions`.

**Uso.** "o continúa con" en formularios de acceso, fechas en listas largas, "Cargar más" al final de un listado. Sin texto, es solo una línea `border-secondary`.

**Detalles.** Funciona sin JavaScript. Sin contenido es un separador para lectores de pantalla (`role="separator"`); con texto o botón, las líneas son decorativas y se lee solo lo de en medio. Si pasas `actions` o `children`, `label` no se pinta.
