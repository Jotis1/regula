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
- **Sitio:** la marca va antes del mensaje y flota a la derecha (`float-right`) en una caja de una línea de alto (`h-[1lh]`), así que queda centrada con la primera línea a cualquier tamaño de texto. Al flotar, solo la primera línea del mensaje le deja sitio y las demás ocupan todo el ancho. El botón es `flow-root` para contener el float. La marca siempre ocupa su sitio, aunque esté oculta, para que el texto no baile al pasar por encima.
- **Sin recortes:** la lista es un flex en columna anclado abajo. Los botones llevan `shrink-0`: con `overflow` distinto de `visible`, un elemento flex puede encogerse por debajo de su contenido, y en la ventana deslizante, en cuanto no cabían todos, se cortaba el texto de cada mensaje. La raya del elegido se recorta con `overflow-clip`, que no cambia eso.
- *Alternativa*: un tooltip «Destacar». Se rechaza porque no sale en táctil y tarda en salir.

### D2. El elegido, como en `CodeSnippet`

- La raya de 2px en `fg-brand-primary` de las líneas de `CodeSnippet`, sobre un fondo de marca.
- **El fondo es `bg-brand-primary` al 15 %, no `bg-brand-primary_alt`.** Las piezas de stream van siempre en oscuro, y ahí `bg-brand-primary_alt` es `#171717`, el mismo gris que el fondo del chat (`bg-primary_alt`): solo se vería la raya. Al 15 %, la marca tiñe la fila como `bg-brand-primary_alt` tiñe las líneas de `CodeSnippet` en claro.
- **La raya va en un pseudoelemento** (`before:`), no en una sombra como en `CodeSnippet`, porque el anillo de foco también es una sombra y la taparía.
- **Al pasar por encima** de los demás, el fondo pasa a `bg-secondary_hover`: `bg-primary_hover` también es `#171717` en oscuro y no se veía.
- Las filas dejan `border-l-2`: la raya es un pseudoelemento y no ocupa sitio, así que las filas siguen alineadas entre sí.
- Al pasar por encima del elegido, el fondo no cambia.

### D3. Nombre accesible

- El botón lleva `aria-label` con `strings.chatSelectName(acción, usuario, texto)`: «Destacar el mensaje de lucia_88: ¿Has mirado detrás del cuadro?».
- `usuario` es el texto de `user` (`keyText`, como en las claves). Si `user` es un nodo sin texto, queda «Destacar el mensaje: …».
- El nombre no cambia al elegirlo: el estado lo dice `aria-pressed`, como en cualquier botón de alternar.

### D4. `labels`

- `labels?: Partial<ChatBoxLabels>`, con `select` («Destacar») y `selected` («Destacado»). `select` también entra en el nombre accesible.

### D5. `CodeSnippet`: el destacado, de borde a borde

- Con líneas destacadas, `<code>` pasa a `block w-max min-w-full`: mide lo que su línea más larga y, como poco, el bloque.
- Cada línea destacada cubre su ancho más los rellenos del bloque a los dos lados: `-ml-5 pl-5` y, a la derecha, el de los botones (`-mr-14 pr-14`, o `-mr-20 pr-20` con `onExpand`). Así el fondo llega al borde del área que se desplaza aunque la línea no quepa.
- Sin líneas destacadas no cambia nada.

### D6. `/changelog/`

- `changeBlocks` lleva las listas como árbol, por la sangría de cada `- `, a cualquier profundidad. Una entrada que empieza por una lista ya no deja el guion en un párrafo.
- El texto pasa por `inline` (el de las piezas de composición), que pinta `código` y **negrita**. `inline` aparta el código antes de buscar la negrita, para que una negrita con código dentro se pinte y los asteriscos de dentro del código no cuenten.

## Risks / Trade-offs

- [La marca quita ancho al mensaje] → Unos 100px con texto y unos 24 en táctil, solo con `onSelect`. El overlay no cambia.
- [El nombre accesible del elegido dice «Destacar» y la marca, «Destacado»] → Es el patrón de un botón de alternar: el nombre es la acción y `aria-pressed` el estado.

## Migration Plan

Retrocompatible. Sin `onSelect`, el HTML es el mismo (lo comprueba un test con `renderToString`). Quien use `onSelect` ve la marca y el aspecto del elegido sin tocar nada.
