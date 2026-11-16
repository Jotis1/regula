# Design

## Context

`ChatBox` con `onSelect` (add-live-interaction-pieces, D6) pinta cada mensaje seleccionable como un `<button>` que ocupa la fila, con `bg-primary_hover` al pasar por encima y, el elegido, `bg-active` y `border-l-2 border-brand`. La única pista de qué hace es el texto que ponga quien lo use («Pulsa un mensaje para destacarlo»). Scaena lo usa en el Mando para destacar un mensaje en pantalla, y el usuario ha dicho que no se entiende: puede parecer que borra o banea.

## Goals / Non-Goals

**Goals:**
- Que se sepa qué hace el clic antes de hacerlo, con ratón, en táctil y con lector de pantalla.
- Que el elegido se vea como cualquier otro «destacado» del sistema.

**Non-Goals:**
- Cambiar el chat sin `onSelect`.
- Más de una acción por mensaje.

## Decisions

### D1. La marca de la acción

- **Qué es:** un `<span aria-hidden="true">` dentro del botón, a la derecha de la fila. Lleva `Pin01` a 16px y el texto en `text-sm` medium, en `text-tertiary`. Es la chincheta de `StreamPinnedMessage`, así que se ve la relación con lo que sale en pantalla.
- **Con ratón:** está oculta (`opacity-0`) y aparece al pasar por encima o con el foco (`group-hover` y `group-focus-visible`), con un fundido de 100 ms como el fondo.
- **En táctil:** con `@media (hover: none)` se ve siempre, pero solo la chincheta en `fg-quaternary`. El texto queda fuera para no robar ancho al mensaje.
- **El elegido:** la lleva siempre, con la chincheta en `fg-brand-primary` y el texto `labels.selected` en `text-brand-secondary`, también en táctil.
- **Sitio:** la fila pasa a `flex` con el mensaje en `min-w-0 flex-1` y la marca en `flex-none`, en una caja de una línea de alto (`h-[1lh]`), así que queda centrada con la primera línea a cualquier tamaño de texto. Siempre ocupa su sitio, aunque esté oculta, para que el texto no baile al pasar por encima.
- *Alternativa*: un tooltip «Destacar». Se rechaza porque no sale en táctil y tarda en salir.

### D2. El elegido, como en `CodeSnippet`

- Fondo `bg-brand-primary_alt` y la raya con `shadow-[inset_2px_0_0_var(--fg-brand-primary)]`, igual que las líneas de `CodeSnippet`.
- Las filas dejan `border-l-2`: la raya es una sombra interior y no ocupa sitio, así que las filas siguen alineadas entre sí.
- Al pasar por encima del elegido, el fondo no cambia.

### D3. Nombre accesible

- El botón lleva `aria-label` con `strings.chatSelectName(acción, usuario, texto)`: «Destacar el mensaje de lucia_88: ¿Has mirado detrás del cuadro?».
- `usuario` es el texto de `user` (`keyText`, como en las claves). Si `user` es un nodo sin texto, queda «Destacar el mensaje: …».
- El nombre no cambia al elegirlo: el estado lo dice `aria-pressed`, como en cualquier botón de alternar.

### D4. `labels`

- `labels?: Partial<ChatBoxLabels>`, con `select` («Destacar») y `selected` («Destacado»). `select` también entra en el nombre accesible.

## Risks / Trade-offs

- [La marca quita ancho al mensaje] → Unos 100px con texto y unos 24 en táctil, solo con `onSelect`. El overlay no cambia.
- [El nombre accesible del elegido dice «Destacar» y la marca, «Destacado»] → Es el patrón de un botón de alternar: el nombre es la acción y `aria-pressed` el estado.

## Migration Plan

Retrocompatible. Sin `onSelect`, el HTML es el mismo (lo comprueba un test con `renderToString`). Quien use `onSelect` ve la marca y el aspecto del elegido sin tocar nada.
