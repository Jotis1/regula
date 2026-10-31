Barra encima de una tabla o lista: vista rápida, búsqueda, botón de filtros y filtros activos.

**Props.** `segments` + `defaultSegment` / `segmentValue` / `onSegment` (un `ButtonGroup`), `search` o `onSearch(texto)`, `searchPlaceholder`, `onOpenFilters`, `activeFilters` [{`label`}], `onRemoveFilter(i)`, `onClear`, `extra` (p. ej. un `DatePicker`).

**Reglas.** Los filtros aplicados se ven siempre, como `Tag` con su X, y hay un "Limpiar todo". El botón Filtros muestra cuántos hay activos. Los filtros avanzados se abren en un `Slideout`, no en un modal.
