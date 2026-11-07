# Tasks

## 1. `Kbd` público con dos variantes

- [x] 1.1 Mover `packages/react/src/internal/kbd.tsx` a `src/components/Kbd.tsx` con `variant: "menu" | "field"` (design D1), exportarlo desde `src/index.ts` y hacer que Dropdown y CommandMenu usen `<Kbd>`. Verificar con un test de las dos variantes (`kbd`, clases de cada una) y con que las capturas de Dropdown y CommandMenu siguen pasando sin reaprobarlas.
- [x] 1.2 Página de `Kbd` (ficha, ejemplo con las dos variantes, muestra para la card, fragmento de código y grupo «Etiquetas e identidad»), con sus capturas aprobadas en claro y oscuro tras mirarlas. Verificar con `catalog-sync.test.ts` y `e2e/components.spec.ts`.
- [x] 1.3 Sustituir los cuatro `kbd` a mano de la web (`SideNav.astro` ×2, `SiteSearch.tsx`, `pages/index.astro`) por `<Kbd variant="field">`. Verificar que `header.spec.ts`, `docnav.spec.ts` y `home.spec.ts` pasan y que una captura de la búsqueda de la cabecera se ve igual.

## 2. `Pager`

- [x] 2.1 Crear `Pager` (design D1) con sus textos en `defaultStrings` y tests: solo siguiente, los dos, ninguno (no pinta nada) y nombre de la navegación. Verificar con `bun run test` en `packages/react`.
- [x] 2.2 Sustituir `Pager.astro` por `Pager` en `ComponentPage.astro` y en las páginas de fundamentos, borrar `Pager.astro` y la clase `PAGER` si queda sin uso. Página de `Pager` con capturas aprobadas, grupo «Navegación». Verificar con el test «Button: … anterior/siguiente» de `components.spec.ts` y `foundations.spec.ts`.

## 3. `LinkCard`

- [ ] 3.1 Antes de nada, comprobar que Astro pasa un componente `.astro` como *slot* `preview` a un componente de React sin isla, ya pintado y sin JavaScript (design, riesgos). Si no funciona, parar y proponer la alternativa antes de seguir.
- [ ] 3.2 Crear `LinkCard` (design D1) con tests: el nombre accesible del enlace es título + descripción, y la vista previa es inerte y `aria-hidden`. Verificar con `bun run test`.
- [ ] 3.3 Usar `LinkCard` en `pages/components/index.astro`. Página de `LinkCard` con capturas aprobadas, grupo «Estructura de página». Verificar con los tests de `/components/` de `components.spec.ts` (toda la card lleva al enlace, vista previa inerte, nombre de la card).

## 4. `TransparencyGrid`

- [ ] 4.1 Crear `TransparencyGrid` (`size` `sm` y `md`) con tests: los colores siguen el tema y no aporta nada al árbol de accesibilidad. Verificar con `bun run test`.
- [ ] 4.2 Usarlo en `LivePreview.astro` (`sm`) y en el ejemplo de CamFrame (`md`). Volver a aprobar la captura de CamFrame tras mirarla (cambio buscado, design D1); las de las cards no cambian. Página de `TransparencyGrid` con capturas, grupo «Fondos y maquetas». Verificar con el test del damero de `components.spec.ts` y `visual.spec.ts`.

## 5. `ScaledPreview`

- [ ] 5.1 Crear `ScaledPreview` (design D1) con tests de los dos escenarios: 1920 en 360×202 da 0,1875 sin desbordar, y `scale={0.5}` recorta en la caja. Verificar con `bun run test`, también con `renderToString`, para comprobar que funciona sin JavaScript.
- [ ] 5.2 Página de `ScaledPreview` con un `StreamScene` encogido como ejemplo, capturas aprobadas y grupo «Fondos y maquetas». Verificar con `catalog-sync.test.ts` y `components.spec.ts`.

## 6. `useCopy` y `CopyTooltip`

- [ ] 6.1 Sacar las clases de la burbuja de `Tooltip` a un módulo interno y crear `copy`, `useCopy` y `CopyTooltip` (con `copyAttribute`), con tests: copia y burbuja `role="status"` que dice solo «Copiado» (también con un valor largo) sobre el ancla, debajo si no cabe arriba, portapapeles que falla, el aviso se va solo y `CodeSnippet` no muestra burbuja. Verificar con `bun run test`.
- [ ] 6.2 Sustituir `CopyToast.astro` por `CopyTooltip copyAttribute="data-copy"` en una isla de `Base.astro` y borrar `CopyToast.astro`. Verificar con un e2e que copia desde una tabla de tokens (HTML estático) y desde la galería de iconos (isla) y ve la burbuja «Copiado» sobre el botón pulsado en los dos casos; capturas de los dos casos en claro y oscuro. Actualizar `e2e/tokens.spec.ts`, que hoy espera «Copiado: bg-brand-solid» (sigue comprobando que el portapapeles tiene el valor).
- [ ] 6.3 Página de `CopyTooltip` (ficha con `useCopy`), capturas aprobadas y grupo «Capas». Verificar que la captura de `Tooltip` no cambia al compartir sus clases. Verificar con `catalog-sync.test.ts`.

## 7. Integración

- [ ] 7.1 Changeset `minor` de `@jotis-me/react` con las seis piezas. Pasar `bunx biome ci .`, `bunx turbo run typecheck test build`, el e2e completo de la web y los tests del artefacto (84 componentes), y verificar que todo queda en verde.

## Workflow follow-up

- Va en la misma PR que `fix/review-comments` y `theme-selector`.
- Después de publicar la versión: sincronizar el artefacto (seis componentes nuevos, sin assets) y archivar el cambio.
