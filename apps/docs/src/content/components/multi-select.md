---

name: MultiSelect
description: "Selector de varias opciones con buscador y casillas; el campo resume lo elegido."
interactive: true
astroNote: "Abrir la lista, buscar y elegir necesitan JavaScript: úsalo en una isla con `client:load`. `onChange` y `summary` son funciones, así que envuélvelo en un `.tsx`."
---

**Cuándo usarlo.** Elegir varias opciones de una lista conocida, sobre todo si es larga: equipos, categorías, cuentas. Para una sola opción de una lista corta, `Select`; para texto libre del usuario, `TagInput`.

**Props.** `label`, `required`, `hint`, `error` (como `Input`), `options` (`string` o `{ value, label, supporting }`), `value` / `defaultValue` (`string[]`), `onChange(values)`, `placeholder`, `summary(elegidas)` («1 elegido» / «n elegidos» por defecto), `summarySupporting(elegidas)` (apoyo tras el resumen, como «16 usuarios»), `size` (`sm` 36px · `md` 40 · `lg` 44), `disabled`, `name` (valores separados por comas), `defaultOpen` (abierto de inicio y en línea, para vistas previas) y los textos `searchLabel`, `emptyTitle`, `emptyDescription`, `clearSearchLabel`, `resetLabel`, `selectAllLabel`.

**Comportamiento.** El campo es un botón con el marco de `Input`: sin nada elegido enseña el placeholder y, con algo elegido, el resumen en `text-primary` y su apoyo en `text-tertiary`. Al abrirlo sale la lista bajo el campo, con el buscador arriba (no distingue tildes: «mar» encuentra «Márketing»), las opciones con su casilla y su apoyo, y un pie con «Restablecer» (quita todo) y «Elegir todo». Elegir no cierra la lista ni vacía la búsqueda. Sin resultados, «Sin resultados», «Prueba con otra palabra.» y un botón «Borrar búsqueda».

**Teclado.** Enter, Espacio o flecha abajo abren la lista con el foco en el buscador; las flechas recorren las opciones y Enter las marca o desmarca; Tab llega al pie; Escape cierra sin tocar la selección y devuelve el foco al campo.

**Estados.** Los del marco de `Input`; abierto, el borde pasa a 2px `border-brand`. Opción bajo el ratón o el teclado en `bg-primary_hover`; casilla marcada en `bg-brand-solid`.

**Reglas.** Etiqueta siempre visible. Si un resumen numérico no basta para saber qué hay elegido, da en `summary` los nombres (por ejemplo, los dos primeros y «y 3 más»).
