---

name: Table
description: "Tabla de datos en tarjeta con cabecera, columnas y pie opcional."
interactive: false
---

**Props.** `columns` [{`key`, `label`, `primary`, `align`, `render(row)`}], `rows`, `title`, `count`, `description`, `actions`, `footer` (p. ej. `Pagination`), `size` (`md` filas de 72px · `sm` 56px).

**Reglas del archivo.** Mínima: nada que no sea dato. Una columna principal, la primera, en `text-primary` medium; el resto en `text-tertiary`. Las filas se separan con una línea `border-secondary`. La cabecera de columnas va en `bg-secondary`, `text-xs-semibold`, `text-quaternary`. Las acciones (buscar, exportar, seleccionar) deben verse sin buscarlas. Números a la derecha.

**Detalles.** Funciona sin JavaScript (Server Component en Next, sin directiva en Astro). La tabla se llama como su título (`aria-labelledby`). Si es más ancha que su tarjeta, se desplaza en horizontal dentro de una caja que recibe el foco, así que también se recorre con el teclado. Cada fila usa `row.id` como clave, o su posición si no tiene.
