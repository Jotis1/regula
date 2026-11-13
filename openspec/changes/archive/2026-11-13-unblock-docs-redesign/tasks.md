# Tasks

Cada grupo trae sus tests, su ficha y su ejemplo interactivo, y acaba en un commit. Comandos: `bun run --cwd packages/tokens test`, `bun run --cwd packages/react test`, `bunx biome ci .`, `bunx turbo run typecheck build`, `bun run --cwd packages/react check:size`, `bun run --cwd apps/docs check:js` y los e2e de `apps/docs`.

## 1. `.light-mode` en los tokens

- [x] 1.1 Escribir el bloque `.light-mode` en `tokensCss` (design D2) y la variante `dark` nueva en `themeCss`. Tests: el bloque tiene, para cada token que cambia entre temas, el valor de `:root`; una utilidad `dark:` compilada con Tailwind se aplica dentro de `.dark-mode` y no dentro de `.dark-mode .light-mode`.
- [x] 1.2 Añadir `[data-theme="light"]` en `scripts/artifact/src/sheet.ts` y su test. Una línea en el README de la guía (Color): qué es `light-mode`, para qué sirve y que no se anida dos veces.
- [x] 1.3 Nota en la página de color de la web con un ejemplo de claro dentro de oscuro. Changeset `minor` de `@jotis-me/tokens`.

## 2. `SidebarNav` con submenús nativos

- [x] 2.1 Añadir `disclosure` (design D1) a los tipos `simple`, `sections-dividers` y `sections-subheadings`. Tests: sin la prop el HTML es el de antes; con `"native"` cada elemento con `children` es un `<details>` abierto si lleva `defaultOpen` o contiene el activo; en `dual-tier` y `slim` se ignora. E2E con el JavaScript desactivado: el grupo se abre y se cierra y el activo se ve.
- [x] 2.2 Ficha (cuándo usar cada modo, que el filtro lo pone quien lo usa) y control en el ejemplo interactivo.

## 3. `ProgressSteps` navegable

- [x] 3.1 Añadir `onChange` y `children` (design D3). Tests: sin las props el HTML es el de antes; con `onChange` cada paso es un botón con el título como nombre y llama con su índice; con `children` el contenido va en el actual en vertical y bajo la lista en horizontal, con `aria-live="polite"`; Enter y Espacio funcionan; los cinco tipos.
- [x] 3.2 Ficha, ejemplo interactivo con un asistente de tres pasos y capturas del ejemplo nuevo, mirado en claro y oscuro antes de aprobarlo. Límite en `size-budget.json` si crece.

## 4. Cierre

- [x] 4.1 Changeset `minor` de `@jotis-me/react`. `check:size`, `check:js` y el e2e completo de `apps/docs`.

## Workflow follow-up

- Archivar este cambio antes de empezar `redesign-docs-site-v2`.
- Tras publicar la versión: sincronizar el artefacto (hoja con `.light-mode` y fichas de `SidebarNav` y `ProgressSteps`).
