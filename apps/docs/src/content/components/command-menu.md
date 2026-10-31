---

name: CommandMenu
description: "Menú de comandos (⌘K) para saltar entre apps de la suite y lanzar acciones escribiendo."
interactive: true
astroNote: "`onClose` y los `onSelect` son funciones y abrirlo necesita estado: envuélvelo en un `.tsx` con el atajo y úsalo con `client:load`."
---

**Props.** `open`, `onClose`, `groups` [{`label`, `items`: [{`icon`, `label`, `description`, `shortcut`, `keywords`, `onSelect`}]}], `placeholder`, `emptyText`, `contained`.

**Comportamiento.** Filtra mientras escribes (por etiqueta, descripción y `keywords`), ↑ ↓ para moverse, ↵ para ejecutar, Esc para cerrar. Panel de 640px `radius-xl`, `shadow-xl`, a 160px del borde superior.

**Reglas.** Mismo contenido en todas las apps de la suite: primero apps, luego acciones de la app actual. Atajo global ⌘K / Ctrl K. No sustituye a la navegación visible: es un atajo.

**El atajo es de la app.** El componente se abre y se cierra con `open` y `onClose`; el atajo ⌘K / Ctrl K lo registra la app.

**Accesibilidad.** Sobre toda la página es un diálogo modal: el foco no sale de él, Escape o un clic fuera lo cierran y el foco vuelve a quien lo abrió. El buscador es un `combobox` que marca la opción activa con `aria-activedescendant`; el primer resultado está activo desde el principio, así que Enter lo ejecuta sin moverse. Sin resultados se anuncia "Sin resultados".

**Vistas previas.** `contained` lo pinta dentro de su contenedor (con posición relativa) sin atrapar el foco, y `autoFocus={false}` no lleva el foco al buscador. Así está en esta página. `labels` cambia sus textos.

**Resultados de otra fuente (ampliación sobre la guía).** `onQueryChange` avisa de cada cambio del buscador y `filter={false}` pinta los grupos tal cual, sin filtrarlos: así la app puede pedir los resultados a un índice, como hace la búsqueda de esta web (Ctrl+K) con Pagefind. La etiqueta de cada opción no se parte en dos líneas: si no cabe, se recorta la descripción.
