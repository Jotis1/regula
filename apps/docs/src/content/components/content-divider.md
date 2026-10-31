---

name: ContentDivider
description: "Separador horizontal, solo o con texto o un botón en el centro."
interactive: false
---

**Props.** `label` (+ `heading` para texto de título), `children` (un `Button` en el centro), `variant` (`single` · `dual` · `fill`).

**Uso.** "o continúa con" en formularios de acceso, fechas en listas largas, "Cargar más" al final de un listado. Sin texto, es solo una línea `border-secondary`.

**Detalles.** Funciona sin JavaScript. Sin contenido es un separador para lectores de pantalla (`role="separator"`); con texto o botón, las líneas son decorativas y se lee solo lo de en medio. Si pasas `children`, `label` no se pinta.
