---

name: Tag
description: "Chip neutro para filtros aplicados, etiquetas editables o selecciones múltiples."
interactive: false
astroNote: "Con `onRemove` necesita una función: envuélvelo en un `.tsx` y úsalo como isla `client:load`."
---

**Props.** `size` (`sm` · `md` · `lg`), `count`, `dot`, `flag` (bandera de 13px delante, como `FlagSpainCircle` de `@jotis-me/icons/flags`), `avatar` (16px delante: URL de una foto o un nodo), `checkable` con `checked`/`defaultChecked` y `onCheckedChange` (casilla delante; `name` y `value` para formularios), `onRemove`, texto en `children`. Fondo `bg-primary`, borde `border-primary`, `radius-md`.

**Casilla.** Con `checkable`, el tag entero es la etiqueta de una casilla nativa: se marca con un clic en el texto o con Espacio, y el texto es su nombre accesible. La casilla mide 14, 16 o 18px según `size`, como el Figma, y la X sigue siendo un botón aparte. Funciona sin hidratar; `onCheckedChange` sí necesita isla.

**Badge o Tag.** Badge informa de un estado y lo pone el sistema; Tag lo pone o lo quita el usuario.
