---

name: TreeView
description: "Árbol de carpetas y archivos desplegable, con guías de nivel."
interactive: true
astroNote: "`onSelect` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `items` [{`id`, `label`, `icon`, `meta`, `children`}], `defaultOpen` (ids), `defaultSelected` / `selected`, `onSelect(item)`, `aria-label`.

**Visual.** Filas de 32px, `text-sm-semibold` en `text-tertiary`, iconos de 16px; seleccionada `bg-secondary_hover`. Sangría de 24px por nivel con línea `border-secondary`.

**Uso.** Navegación de documentos (Ornatus) o jerarquías de categorías. Más de cuatro niveles es mala señal.

**Teclado.** Al entrar con Tab el foco va a la fila elegida. Las flechas ↑ ↓ mueven el foco sin elegir, → abre y ← cierra (o sube al padre). Clic, Enter o espacio eligen la fila y abren o cierran la carpeta, también si ya estaba elegida.

**Detalles.** Sin `icon`, las carpetas llevan `folder` y los archivos `file-04`. `textValue` en un elemento da el texto para buscar con el teclado cuando `label` no es texto.
