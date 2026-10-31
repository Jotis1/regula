Tabla de datos en tarjeta con cabecera, columnas y pie opcional.

**Props.** `columns` [{`key`, `label`, `primary`, `align`, `render(row)`}], `rows`, `title`, `count`, `description`, `actions`, `footer` (p. ej. `Pagination`), `size` (`md` filas de 72px · `sm` 56px).

**Reglas del archivo.** Mínima: nada que no sea dato. Una columna principal, la primera, en `text-primary` medium; el resto en `text-tertiary`. Las filas se separan con una línea `border-secondary`. La cabecera de columnas va en `bg-secondary`, `text-xs-semibold`, `text-quaternary`. Las acciones (buscar, exportar, seleccionar) deben verse sin buscarlas. Números a la derecha.
