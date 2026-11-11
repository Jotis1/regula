---

name: FilterBar
description: "Barra encima de una tabla o lista: vista rápida, búsqueda, botón de filtros y filtros activos."
interactive: true
astroNote: "Sus avisos (`onSearch`, `onRemoveFilter`, `onClear`…) son funciones y la vista rápida necesita JavaScript: envuélvela en un `.tsx` y úsala con `client:load`."
---

**Props.** `segments` + `defaultSegment` / `segmentValue` / `onSegment` (un `ButtonGroup`), `search` o `onSearch(texto)`, `searchPlaceholder`, `onOpenFilters`, `activeFilters` [{`label`}], `onRemoveFilter(i)`, `onClear`, `extra` (p. ej. un `DatePicker`), `type`, `dates`, `fields`, `conditions` / `conditionFields` / `conditionOperators` / `onConditionsChange`, `onOpenSearch`.

**Tipos.** Los ocho del Figma (`Filters bar`, `12232:376165`), plantillas sobre las mismas props. Sin `type`, la barra de siempre. `simple` (búsqueda, `dates` y Filtros), `tabs-search` (vistas, búsqueda y Filtros), `tabs-date` (vistas, `dates` y Filtros), `date` (`extra` con los atajos de fecha y `dates`; búsqueda y Filtros), `dropdowns` (`fields` con su etiqueta y «Limpiar todo»), `dropdowns-date` (además `dates`, «Más filtros» y la lupa) y `advanced`, el constructor de condiciones (campo, operador y valor, con añadir y quitar): sin condiciones es el «inactivo» del Figma y con ellas el «activo». En una barra estrecha (container queries), Filtros queda en icono, la búsqueda ocupa el ancho y el constructor pasa a un solo botón «Filtros (N)».

**Reglas.** Los filtros aplicados se ven siempre, como `Tag` con su X, y hay un "Limpiar todo". El botón Filtros muestra cuántos hay activos. Los filtros avanzados se abren en un `Slideout`, no en un modal.

**Accesibilidad.** Con filtros activos el botón se anuncia como "Filtros 2". Cada X se llama "Quitar" seguido del filtro.

**Textos.** `labels` cambia "Vista", "Buscar", "Filtros" y "Limpiar todo"; el placeholder va en `searchPlaceholder`.
