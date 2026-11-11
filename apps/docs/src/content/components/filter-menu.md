---

name: FilterMenu
description: "Botón «Filtros» con el número de filtros activos que abre un menú para añadirlos, quitarlos y aplicarlos."
interactive: true
astroNote: "`onApply` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `fields` [{`value`, `label`, `options`?}], `operators` [{`value`, `label`}], `value`/`defaultValue` (los filtros aplicados: [{`field`, `operator`, `value`}], con `value` texto o lista), `onApply(rules)`, `align` (`start` · `end`), `disabled` y `labels`.

**Visual.** La del Figma (`Filters dropdown menu`, `12232:366410`): el botón secundario con `filter-lines`, «Filtros», el número en una pastilla y el chevron, con fondo `bg-secondary` si hay filtros. El menú, de 624 px (o el ancho de la pantalla menos 32), tiene una fila por filtro (campo y operador de 160 px, el valor y la X) y, al pie, «Añadir filtro», «Limpiar todo» y «Aplicar filtros». Sin filtros, «No hay filtros» con su explicación y «Añadir filtro». Si un campo tiene `options`, su valor se elige en un `MultiSelect` con búsqueda, «Restablecer» y «Seleccionar todo», que resume «2 elegidos · 16 usuarios».

**Uso.** Encima de una tabla o una lista, junto a la búsqueda. Con muchos filtros o en móvil, `FilterPanel` en un `Slideout`.

**Accesibilidad.** El botón dice cuántos filtros hay activos («Filtros, 3 filtros activos»). El menú es un diálogo en un popover de React Aria: Escape lo cierra sin aplicar y el foco vuelve al botón. Cada control de cada fila tiene nombre propio («Campo del filtro 2», «Quitar el filtro 2»). Solo se aplican las filas con campo y valor.
