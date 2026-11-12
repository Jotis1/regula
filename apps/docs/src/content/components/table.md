---

name: Table
description: "Tabla de datos en tarjeta con cabecera, columnas, pie opcional, los tipos de celda del Figma, orden, selección y filas alternas."
interactive: true
---

**Props.** `columns` [{`key`, `label`, `primary`, `align`, `render(row)`, `type`, `sortable`, `sortValue(row)`, `help`}], `sort` / `defaultSort` / `onSortChange`, `selection` (`checkbox` · `radio` · `toggle`), `selectedKeys` / `defaultSelectedKeys` / `onSelectionChange`, `striped`, `labels`, `rows`, `title`, `count`, `description`, `actions`, `footer` (p. ej. `Pagination`), `size` (`md` filas de 72px · `sm` 56px).

**Tipos de celda.** Los del Figma (`Table cell`, `1222:107305`): con `type`, el valor de la columna toma una forma y la tabla pinta la plantilla. `text` (texto o título y subtítulo), `avatar`, `file` (icono de `FileIcon`, de `@untitledui/file-icons`), `payment` (logo de `@jotis-me/assets/payments`), `badge`, `badges` (con «+N»), `trend` (valor y cambio en verde o rojo, con flecha), `avatar-group`, `select` (desplegable nativo con el punto de la opción), `progress`, `rating` (estrellas, con «4,5 de 5» para lectores), `actions` (botones de texto), `action-icons` (botones de icono con nombre) y `menu` (tres puntos, o el nodo que pases). `render` sigue mandando sobre `type`.

**Orden, ayuda y selección.** Una columna `sortable` tiene un botón en la cabecera y `aria-sort` (`none`, `ascending`, `descending`); la tabla ordena las filas (texto en castellano y números como números) y avisa con `onSortChange`. `help` pone un `HelpIcon` junto al título. `selection` añade una primera columna: casilla con la de cabecera (marca todas las visibles y se queda a medias si solo hay algunas), radio (una sola fila) o interruptor. `striped` pinta las filas alternas.

**Reglas del archivo.** Mínima: nada que no sea dato. Una columna principal, la primera, en `text-primary` medium; el resto en `text-tertiary`. Las filas se separan con una línea `border-secondary`. La cabecera de columnas va en `bg-secondary`, `text-xs-semibold`, `text-quaternary`. Las acciones (buscar, exportar, seleccionar) deben verse sin buscarlas. Números a la derecha.

**Detalles.** Funciona sin JavaScript (Server Component en Next, sin directiva en Astro). La tabla se llama como su título (`aria-labelledby`). Si es más ancha que su tarjeta, se desplaza en horizontal dentro de una caja que recibe el foco, así que también se recorre con el teclado. Cada fila usa `row.id` como clave, o su posición si no tiene.
