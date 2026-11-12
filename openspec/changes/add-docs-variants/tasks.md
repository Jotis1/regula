# Tasks

Una variante por grupo, cada uno con sus tests, su ficha, su control en el ejemplo interactivo y, si cambia el ejemplo, sus capturas miradas en claro y oscuro. Cada grupo acaba en un commit. Comandos: `bun run --cwd packages/react test`, `bunx biome ci .`, `bunx turbo run typecheck build`, `bun run --cwd packages/react check:size`, `bun run --cwd apps/docs check:js` y los e2e de `apps/docs`.

## 1. `HeaderNav` a ancho completo

- [x] 1.1 `fullWidth` (design D1). Tests: sin la prop el HTML es el de antes; con ella, las dos filas y la fila móvil sin `max-w`.

## 2. `Tabs` como enlaces

- [x] 2.1 `href` en `TabItem` (design D2). Tests: todos con `href` pinta `<nav>` con enlaces y sin `role="tab"`; `aria-current` `location` con ancla y `page` sin ella; en vertical a 390 px sigue siendo una lista; mezcla de elementos con y sin `href` avisa en desarrollo y pinta `tablist`; sin `href`, el HTML de antes.

## 3. `Carousel` en tira

- [x] 3.1 `type="strip"` y `slideWidth` (design D3). Tests: lista con nombre, `scroll-snap`, sin flechas, puntos sin `onChange`; e2e a 390 px con el JavaScript desactivado (se desplaza y se detiene). Ejemplo interactivo con las dos formas.

## 4. `Toggle` con `aria-label`

- [x] 4.1 `aria-label` y `aria-labelledby` (design D4). Tests: nombre accesible sin `label`; con los dos, manda `aria-label`.

## 5. Acompañante de la etiqueta

- [x] 5.1 `labelAside` en `internal/field.tsx` y en `Toggle` (design D5). Tests en los siete componentes: se pinta al final de la fila, fuera del `<label>`; un clic en un botón de dentro no enfoca el campo ni abre el desplegable; sin la prop, el HTML de antes.

## 6. `CodeSnippet` con líneas destacadas

- [x] 6.1 `highlight` en las props y en cada pestaña (design D6). Tests: las líneas marcadas llevan fondo y raya; un texto oculto por bloque de líneas seguidas; cambiar de pestaña usa el `highlight` de la pestaña.

## 7. `CommandMenu` con texto inicial

- [x] 7.1 `defaultQuery` (design D7). Tests: el buscador se abre con el texto, filtra y llama a `onQueryChange` una vez al abrir.

## 8. `Slideout` desde abajo

- [x] 8.1 `side="bottom"` (design D8). Tests: foco atrapado, Escape, X y clic fuera; alto máximo del 85 %; asa decorativa con `aria-hidden`; movimiento reducido. E2E a 390 px.

## 9. Cierre

- [x] 9.1 Changeset `minor` de `@jotis-me/react`. `check:size`, `check:js` y el e2e completo de `apps/docs` con Firefox y WebKit.

## Workflow follow-up

- Archivar antes de empezar `redesign-docs-site-v2`.
- Tras publicar la versión: sincronizar el artefacto.
