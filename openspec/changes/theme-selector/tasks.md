# Tasks

## 1. Icono de pantalla en `@jotis-me/icons`

- [x] 1.1 Buscar en la página Icons de Figma (`WybK3J9Wu3crF84nKwrN1z`, MCP de Figma con el plugin `figma@claude-plugins-official`) el icono de pantalla de la familia de línea, anotar su nombre y su trazo (24×24, 2px, sin relleno). Si no está o el MCP no responde, parar y pedírselo al usuario (design D3). Verificar con una captura del nodo de Figma.
- [x] 1.2 Añadirlo a `packages/icons/src/data/icons.ts` con el nombre de Figma, regenerar `components.generated.tsx` (`bun run scripts/generate.ts`) y verificar con los tests del paquete (`bun run --cwd packages/icons test`) que el SVG usa `currentColor`, mide 24×24 y que los 81 originales siguen ahí.
- [x] 1.3 Cambiar «81» por «82» donde se cuenta el set (README de `@jotis-me/icons`, iconografía de la web y guía del artefacto, `grep -rn "81 icono\|los 81"`) y verificar que la galería `/icons/` enseña 82 en el e2e `icons.spec.ts`. Changeset `minor` de `@jotis-me/icons`.

## 2. Selección única en `Dropdown`

- [x] 2.1 Añadir `value` a `DropdownAction` y `selectedValue` / `onSelectionChange` a `DropdownProps` (design D1), con el check a la derecha en la opción elegida. Verificar con tests en `packages/react/test/menus.test.tsx`: los tres escenarios de «Menú con una opción elegida» (`menuitemradio` + `aria-checked`, elegir con teclado avisa con el valor y cierra devolviendo el foco, sin elección siguen `menuitem` + `onSelect`).
- [x] 2.2 Documentar las props nuevas en la ficha `apps/docs/src/content/components/dropdown.md` y añadir a sus ejemplos (`src/visual/examples`) un menú con opción elegida. Aprobar la captura nueva de Dropdown en claro y oscuro solo si cambia el ejemplo (`e2e/visual.spec.ts`) y verificar que la tabla de props de `/components/dropdown/` muestra `selectedValue` y `onSelectionChange`.
- [x] 2.3 Changeset `minor` de `@jotis-me/react` y verificar `bunx turbo run typecheck test build` en verde.

## 3. Selector de tema en la cabecera

- [x] 3.1 Hacer que `ThemeScript.astro` y `setTheme()` (`src/lib/theme.ts`) pongan `data-tema="sistema|claro|oscuro"` en `<html>` (design D2). Verificar en el e2e de tema que el atributo está antes de `<body>`, con el mismo truco de `recordThemeAtBody`.
- [x] 3.2 Crear `src/components/ThemeMenu.tsx` (isla `client:idle`): disparador con los tres iconos, visibles según `data-tema`, y nombre «Tema: <elección>», más `Dropdown` con Sistema / Claro / Oscuro y `selectedValue` de `themeChoice()`, escuchando `onThemeChange`. Sustituir `ThemeToggle.astro` en `SiteHeader.astro` y borrarlo. Verificar con una captura de la cabecera en claro y oscuro, con el menú abierto, a 1440 y 390px.
- [x] 3.3 Actualizar `e2e/theme.spec.ts` a los escenarios de «Tema claro y oscuro»: recordar oscuro sin parpadeo, volver a Sistema en escritorio y seguir un cambio del sistema sin recargar (`emulateMedia`), el botón con el icono y el nombre de lo elegido, y la misma elección en el menú móvil a 390px. Verificar que pasa junto con `header.spec.ts`, `mobile.spec.ts` y `a11y.spec.ts`.
- [x] 3.4 Cambiar el disparador por el botón propio del `Dropdown` (secundario, con texto y flecha), con las tres etiquetas (icono y nombre) visibles según `data-tema` y «Tema: » solo para lectores de pantalla (design D2, cambio pedido por el usuario). Verificar con capturas de la cabecera a 1440 y 390px en claro y oscuro, sin desplazamiento horizontal a 390px, y con los e2e de tema, cabecera y móvil adaptados al botón con texto.

## 4. Integración

- [x] 4.1 Pasar `bunx biome ci .`, `bunx turbo run typecheck test build`, el e2e completo de la web y los tests del artefacto (`bun test ./test` y `bun run test:e2e` en `scripts/artifact`, que llevan el icono nuevo como asset), y verificar que todo queda en verde.

## Workflow follow-up

- Va en la misma PR que `fix/review-comments` y los otros cambios de esta tanda. Lighthouse lo mide el CI.
- Después de publicar la versión: sincronizar el artefacto (un asset nuevo que subir: el icono de pantalla) y archivar el cambio.
