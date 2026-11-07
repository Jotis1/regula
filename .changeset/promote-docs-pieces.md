---
"@jotis-me/react": minor
---

Seis piezas de la web de documentación pasan al paquete, y el catálogo crece de 78 a 84 componentes:

- `TransparencyGrid`: fondo de damero que indica transparencia y sigue el tema, en cuadros de 8 o 16px.
- `ScaledPreview`: pinta una pieza a su ancho real y la encoge para que quepa en una caja, sin JavaScript.
- `Kbd`: tecla o atajo con dos variantes, `menu` (la de los atajos de Dropdown y CommandMenu, que ya existía privada) y `field` (la pista «Ctrl K» de un campo de búsqueda).
- `LinkCard`: card cuyo enlace cubre toda su superficie, con una vista previa opcional inerte y fuera del enlace.
- `Pager`: navegación «Anterior y siguiente» al final de una página.
- `CopyTooltip` y el hook `useCopy`: copiar al portapapeles con una burbuja «Copiado», como la de `Tooltip`, junto al elemento pulsado. `CodeSnippet` conserva su propia confirmación.
