# Proposal

## Why

El pie de la web dice «Esta web está hecha con ellas», pero la cabecera, la barra lateral, el pie y la portada están hechos a mano: solo usan `AppIcon` y `Kbd`. Las páginas de componente enseñan mal los componentes:

- En `/components/`, 54 muestras se pintan encogidas con `scale` (0,4–0,8) y otras 6 con `ScaledPreview`. `Alert`, `Banner`, `Table`, `CalendarView` y las gráficas quedan con texto de 6–7 px, que no se lee.
- El playground solo existe en 62 de los 121 componentes y solo mueve uniones de cadenas y booleanos.
- «Variantes y estados» es una galería fija pensada para la paridad con la guía, no para enseñar.
- El playground carga el paquete entero en cada página (380 kB gzip, el límite más alto del repo).
- Los anchos no siguen la regla de layout: el contenido va a 1440 y el pie a 1280.

## What Changes

- **Ancho:** la barra lateral queda fuera del contenedor. Cabecera, contenido (con su índice derecho) y pie usan el contenedor de la guía (`container-max-width-desktop`, 1280).
- **Muestras del índice a tamaño real:** cada card enseña una pieza del componente sin encoger. Si no cabe, se recorta con un fundido en el borde. Un test prohíbe `scale < 1` en las muestras.
- **Ejemplo interactivo completo, en los 121 componentes, que sustituye a «Variantes y estados» (BREAKING para la estructura de la página):**
  - Controles para números, iconos y contenido con valores preparados (avatar, insignia, imagen, lista), además de los desplegables y los interruptores.
  - Atajos con los tipos del Figma, que ponen varias props de una vez.
  - Las props incompatibles se desactivan y dicen por qué. Las reglas se declaran por componente y se prueban.
  - `disabled`, `error` y `loading` como controles.
  - Código en vivo.
  - Cada página carga solo el código de su componente.
- **La web montada con el paquete:**
  - La cabecera, la barra lateral y el pie se montan con los componentes del paquete (`HeaderNav`, `SidebarNav` y `Footer`). La búsqueda ya usa `CommandMenu`.
  - La portada usa los componentes del paquete que encajen.
  - Si un componente no basta, se mejora el componente (con su changeset), no se rehace a mano.
- Las páginas `/visual/` y sus capturas siguen como referencia de la paridad visual, sin cambios. El código de la sección «Código» de cada página se queda.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `docs-site`:
  - «Página por componente» cambia los ejemplos de variantes por el ejemplo interactivo.
  - «Playground de componente» pasa a cubrir todos los componentes, con todos los tipos de control, atajos, reglas de incompatibilidad, estados y carga por componente.
  - «Vista previa en vivo en las cards del índice» exige tamaño real.
  - «La web sigue el propio sistema» exige montar la estructura con los componentes del paquete y el ancho del contenedor.
  - «JavaScript solo de lo que se usa» baja el límite de las páginas de componente.

## Impact

- **`apps/docs`:**
  - `layouts/Base.astro` y `layouts/ComponentPage.astro`.
  - `SiteHeader`, `SideNav`, `SiteFooter`, `MobileMenu` y `pages/index.astro`.
  - `components/Playground.tsx`, `lib/playground.ts` y `lib/playground-components.ts` (pasa a carga por componente).
  - `visual/thumbnails.tsx` y `LivePreview.astro`.
  - `js-budget.json`, los e2e de página, playground e índice, y las capturas aprobadas de las páginas que cambian de estructura.
- **`packages/react`:** solo si `HeaderNav`, `SidebarNav` o `Footer` no bastan para la web. Retrocompatible, con su changeset.
- **Artefacto (`scripts/artifact`):** no cambia. Sigue usando los ejemplos del registro.
- **Paso previo:** `complete-figma-coverage` se cierra antes (PR y archivo). Este cambio sale de `main` después.
