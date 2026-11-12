---
"@jotis-me/react": patch
---

`TreeView`: el texto de apoyo (`meta`) de la fila elegida pasa de `text-quaternary` a `text-tertiary`, porque sobre el fondo de la fila elegida no llegaba a 4,5:1 de contraste en el tema claro.
