---

name: FilterBar
description: "Barra encima de una tabla o lista: vista rápida, búsqueda, botón de filtros y filtros activos."
interactive: true
astroNote: "Sus avisos (`onSearch`, `onRemoveFilter`, `onClear`…) son funciones y la vista rápida necesita JavaScript: envuélvela en un `.tsx` y úsala con `client:load`."
---

**Props.** `segments` + `defaultSegment` / `segmentValue` / `onSegment` (un `ButtonGroup`), `search` o `onSearch(texto)`, `searchPlaceholder`, `onOpenFilters`, `activeFilters` [{`label`}], `onRemoveFilter(i)`, `onClear`, `extra` (p. ej. un `DatePicker`).

**Reglas.** Los filtros aplicados se ven siempre, como `Tag` con su X, y hay un "Limpiar todo". El botón Filtros muestra cuántos hay activos. Los filtros avanzados se abren en un `Slideout`, no en un modal.

**Accesibilidad.** Con filtros activos el botón se anuncia como "Filtros 2". Cada X se llama "Quitar" seguido del filtro.

**Textos.** `labels` cambia "Vista", "Buscar", "Filtros" y "Limpiar todo"; el placeholder va en `searchPlaceholder`.
