Menú de comandos (⌘K) para saltar entre apps de la suite y lanzar acciones escribiendo.

**Props.** `open`, `onClose`, `groups` [{`label`, `items`: [{`icon`, `label`, `description`, `shortcut`, `keywords`, `onSelect`}]}], `placeholder`, `emptyText`, `contained`.

**Comportamiento.** Filtra mientras escribes (por etiqueta, descripción y `keywords`), ↑ ↓ para moverse, ↵ para ejecutar, Esc para cerrar. Panel de 640px `radius-xl`, `shadow-xl`, a 160px del borde superior.

**Reglas.** Mismo contenido en todas las apps de la suite: primero apps, luego acciones de la app actual. Atajo global ⌘K / Ctrl K. No sustituye a la navegación visible: es un atajo.
