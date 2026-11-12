# Tasks

Cada componente trae sus tests, su página (ficha, ejemplo, muestra, fragmento, arranque del ejemplo interactivo, capturas aprobadas y capturas WebP de su card, miradas en claro y oscuro) y su límite en `size-budget.json`, y acaba en un commit. La referencia visual es el lienzo del rediseño. Comandos: `bun run --cwd packages/react test`, `bunx biome ci .`, `bunx turbo run typecheck build`, `bun run --cwd packages/react check:size`, `bun run --cwd apps/docs check:js` y los e2e de `apps/docs`.

## 1. `Disclosure`

- [ ] 1.1 Crear `Disclosure` (design D4). Tests: `<details>` y `<summary>`, `defaultOpen`, `aside` a la derecha, `sm` y `md`, `divider`; e2e con el JavaScript desactivado. Página en «Estructura de página».

## 2. `ExampleCard`

- [ ] 2.1 Crear `ExampleCard` (design D5) con los cuatro textos en `defaultStrings`. Tests: `<figure>` y `<figcaption>`, badge con palabra e icono por veredicto, `grid={false}` sin damero, `minHeight`. Página en «Fondos y maquetas».

## 3. `IconTile`

- [ ] 3.1 Crear `IconTile` (design D6). Tests: botón con `aria-pressed`, enlace con `href`, nombre completo accesible aunque se recorte, filo de 2 px elegido, tres tamaños. Página en «Etiquetas e identidad».

## 4. `TokenSwatch`

- [ ] 4.1 Crear `TokenSwatch` (design D7). Tests: las dos muestras con su valor en cualquier tema de página, filo distinguible en cada una, `row` y `card`, copiar con `CopyTooltip` y su aviso de error. Página en «Etiquetas e identidad».

## 5. `Spotlight`

- [ ] 5.1 Crear `Spotlight` (design D3). Tests: sin `active` solo el contenido; con `active` anillo, nota con `aria-describedby` y `aria-live`; cuatro posiciones; movimiento reducido. Página en «Capas».

## 6. `CompareSlider`

- [ ] 6.1 Crear `CompareSlider` (design D2) con «Antes» y «Después» en `defaultStrings`. Tests: recorte por valor, `onChange`, flechas, Re Pág, Av Pág, Inicio y Fin, nombre y valor anunciados, capa tapada con `aria-hidden` e `inert`, pintura en el servidor en `defaultValue`. E2E con ratón y teclado. Página en «Contenido y medios», con un ejemplo de claro y oscuro hecho con `light-mode` (de `unblock-docs-redesign`).

## 7. Cierre

- [ ] 7.1 Changeset `minor` de `@jotis-me/react`. Test de catálogo con los seis nuevos, `check:size`, `check:js`, artefacto (`bun run artifact:build` y los tests de `scripts/artifact`) y el e2e completo de `apps/docs`.

## Workflow follow-up

- Archivar antes de empezar `redesign-docs-site-v2`.
- Tras publicar la versión: sincronizar el artefacto con los seis componentes.
