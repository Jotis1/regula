---
"@jotis-me/react": minor
---

`ChatBox` seleccionable dice qué hace el clic. Con `onSelect`, cada mensaje lleva a la derecha la chincheta con «Destacar»: con ratón sale al pasar por encima o con el foco, y en táctil se ve siempre la chincheta sola. El elegido lleva la raya de las líneas destacadas de `CodeSnippet` sobre un fondo de marca, y la marca «Destacado». El nombre accesible de cada mensaje empieza por la acción («Destacar el mensaje de lucia_88: …»). Los textos se cambian con la prop nueva `labels` (`select` y `selected`). Sin `onSelect`, `ChatBox` no cambia.
