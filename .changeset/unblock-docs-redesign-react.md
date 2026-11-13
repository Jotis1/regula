---
"@jotis-me/react": minor
---

- `SidebarNav`: prop `disclosure` (`"script"` por defecto, `"native"`). Con `"native"`, cada elemento con `children` de los tipos `simple`, `sections-dividers` y `sections-subheadings` es un `<details>` que se abre y se cierra sin JavaScript; en `dual-tier` y `slim` se ignora.
- `ProgressSteps`: props `onChange(index)`, que hace de cada paso un botón, y `children`, una función que pinta el contenido del paso actual (bajo su título en vertical, bajo la lista en horizontal).
