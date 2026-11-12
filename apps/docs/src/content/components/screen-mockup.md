---

name: ScreenMockup
description: "Maqueta de pantalla para enseñar una captura o una interfaz: pantalla 3:2 con filo oscuro o marco moderno."
interactive: false
---

**Props.** `variant` (`3-2`, por defecto · `modern`), `size` (`3-2`: `xs` 342 · `sm` 480 · `md` 640 · `lg` 768 · `xl` 1024 · `2xl` 1216 de ancho máximo), `breakpoint` (`modern`: `desktop` 3:2 · `mobile`), `shadow` (`3-2`), `src` + `alt` o `children`.

**Visual.** Las del Figma: `Screen mockup 3:2` (`1293:158480`), pantalla 3:2 con radio de 8 y filo de 4 px en `bg-primary-solid` sobre la sombra `shadow-2xl`; `Modern screen mockup` (`8268:120483`), tres capas (borde `border-secondary_alt` y `shadow-lg`, sombra interior y el marco `utility-neutral-200` de radio 24). Se encogen con el contenedor.

**Uso.** En portadas y páginas de producto, con una captura (`src` y `alt`) o con componentes dentro (como el ejemplo, encogidos con `ScaledPreview`). Para un navegador con su barra, `BrowserFrame`.

**Accesibilidad.** El marco es decorativo: con `src`, la imagen y su `alt` es lo único que anuncian los lectores. Con `children`, se lee lo que pongas.
