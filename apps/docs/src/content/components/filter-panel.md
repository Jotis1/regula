---

name: FilterPanel
description: "El contenido del panel de filtros para un Slideout: filas de filtros, añadir, limpiar y aplicar."
interactive: true
astroNote: "`onApply` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `fields`, `operators`, `defaultValue`, `onApply(rules)` y `labels`, como `FilterMenu`.

**Visual.** La del Figma (`Filters slideout menu`, `12232:375462`): dentro de un `Slideout` con el título «Filtros» y su descripción, cada filtro ocupa dos líneas (campo y operador; debajo, el valor y la X), con «Añadir filtro» al final y, pegados abajo, «Limpiar todo» y «Aplicar filtros». Sin filtros, «No hay filtros» y «Añadir filtro».

**Uso.** Cuando los filtros no caben en un menú: muchos filtros, valores largos o pantallas estrechas. El `Slideout` lo pones tú, con su título y su `onClose`; cierra al aplicar si quieres.

**Accesibilidad.** El `Slideout` es el diálogo con nombre; dentro, cada control tiene nombre propio y el pie sigue a la vista al desplazar. «Limpiar todo» vacía las filas y aplica sin filtros.
