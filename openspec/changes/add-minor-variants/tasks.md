# Tasks

Cada grupo trae sus propios tests, su página y sus capturas, y acaba en un commit. La referencia visual de cada pieza es su nodo del Figma (tabla del Context de design.md): antes de escribir, `get_design_context` del nodo (con la skill `figma-design-to-code`) para medidas, radios y estados, traducidos a los tokens semánticos. Las capturas nuevas se miran en claro y oscuro antes de aprobarlas. Comandos: `bun run --cwd packages/react test`, `bun run --cwd packages/icons test`, `bunx biome ci .`, `bunx turbo run typecheck build`, `bun run --cwd packages/react check:size`, `bun run --cwd apps/docs check:js` y los e2e de `apps/docs`.

## 1. `Spinner` con estilos

- [x] 1.1 Añadir `variant` a `Spinner` (design D5) mirando los nodos `1192:607`, `1196:283` y `1192:633`. Tests: sin `variant` el HTML es el de antes; `line-spinner` no pinta la pista; `dot-circle` pinta dieciséis puntos que se desvanecen; los tres giran más despacio con movimiento reducido y anuncian «Cargando…». Ejemplo de la página con los tres estilos y los cuatro tamaños, ficha actualizada y capturas vueltas a aprobar tras mirarlas.

## 2. `ButtonUtility`

- [x] 2.1 Crear `ButtonUtility` (design D4) mirando el nodo `8003:526508` y sus estados. Tests: nombre accesible desde `label`, tooltip con ese texto al enfocar con Tab y al pasar el ratón, `tooltip={false}` sin tooltip, `disabled` sin tooltip ni respuesta, `href` pinta un enlace, anillo de foco con teclado. Límite en `size-budget.json`. Página en «Acciones» con ficha, ejemplo (los dos tamaños y jerarquías, en una barra de herramientas), muestra, fragmento y capturas aprobadas.

## 3. `BadgeGroup`

- [x] 3.1 Crear `BadgeGroup` (design D2) mirando el nodo `1046:8088`. Tests: badge delante y detrás, `pill` y `modern`, cinco colores, `md` y `lg`; con `href` es un enlace con la flecha y con `onClick` un botón; sin acción no es interactivo ni lleva flecha; el nombre accesible incluye el badge y el mensaje. Límite en `size-budget.json`. Página en «Etiquetas e identidad» con ficha, ejemplo, muestra, fragmento y capturas aprobadas, comparadas con el Figma.

## 4. `SectionLabel`

- [x] 4.1 Crear `SectionLabel` (design D3) mirando el nodo `5013:376534`, con el texto «obligatorio» en `defaultStrings`. Tests: `h3` por defecto y `as`; asterisco con `aria-hidden` y texto para lectores con `required`; `HelpIcon` con `help`; acciones debajo; `sm` y `md`. Límite en `size-budget.json`. Página en «Estructura de página» con ficha, ejemplo (los dos tamaños, con y sin acciones, junto a unos campos de ajustes), muestra, fragmento y capturas aprobadas.

## 5. Logos de terceros en `@jotis-me/icons`

- [x] 5.1 Escribir `packages/icons/scripts/import-logos.ts` (design D7) y exportar con él del Figma los sets «App icons» (`6452:229238`), «Integration icon» (`12464:573740`) y «Social icon» (`1457:244804`) a `assets/logos/<set>/`, con sus variantes grises. Test que compara los nombres guardados con la lista esperada de cada set (232, 16 y 34) y que cada SVG tiene `viewBox`, ids únicos y, en los grises monocromos, `currentColor`. Mirar una muestra de cada set en una página de prueba en claro y oscuro.
- [ ] 5.2 Generar los componentes y los SVG de `@jotis-me/icons/logos` (design D7) con la entrada nueva en `exports`. Tests: la entrada principal no exporta logos; `title` da `role="img"` y sin él `aria-hidden`; un import suelto empaquetado con esbuild no contiene otro logo; `publint` y `attw` (`check:package`) pasan. Medir el tarball con `scripts/pack.ts` antes y después y anotarlo. Changeset `minor` de `@jotis-me/icons`.
- [ ] 5.3 Añadir los logos a `/icons/` (design D8): selector «Iconos / Logos», filtro por set, panel con color y gris y código de `@jotis-me/icons/logos`, y la nota de marcas. E2E en `e2e/icons.spec.ts`: buscar «github», elegir el social y comprobar el import copiado. Verificar con `check:js` que `/icons/` no supera su límite.

## 6. `EmptyState` con cabeceras

- [ ] 6.1 Añadir `media`, `illustration`, `items` y `size` a `EmptyState` (design D6), empezando por las cabeceras dibujadas: ilustraciones (`1182:1085`), archivo (`4980:382754`), carpeta (`9239:545816`) y carpeta translúcida (`11284:2621`), con los SVG en `src/internal/empty-media/` y colores de tokens. Tests: sin props nuevas el HTML es el de antes; cada cabecera se pinta con `aria-hidden`; `md` y `lg` cambian el tamaño del título. Mirar cada una en claro y oscuro junto al nodo y anotar en `NOTAS.md` las diferencias aceptadas.
- [ ] 6.2 Añadir las cabeceras de usuarios en círculos (`11284:582775`), usuarios en fila (`11290:589736`) e integraciones (`11293:590923`) con `items` y su icono central. Tests: los `items` se pintan en sus posiciones y con la máscara de desvanecido; sin `items`, solo el fondo y el icono; `@jotis-me/react` no importa nada de `@jotis-me/icons/logos` (búsqueda en `dist`). Actualizar el límite de `EmptyState` en `size-budget.json` si hace falta.
- [ ] 6.3 Ejemplo de la página con las ocho cabeceras (usuarios con `Avatar` de iniciales, integraciones con logos de `@jotis-me/icons/logos`), ficha actualizada, muestra y capturas de `EmptyState` vueltas a aprobar tras mirarlas en claro y oscuro.

## 7. Cierre

- [ ] 7.1 Changeset `minor` de `@jotis-me/react` con los tres componentes y las variantes. Verificar el catálogo en 94 (`apps/docs` `test/catalog.test.ts`), el artefacto (`bun run artifact:build` y `bun test` y `test:e2e` en `scripts/artifact`) con el grupo de assets «Marcas» (design D8), `check:size`, `check:js` y el e2e completo de `apps/docs` con Firefox y WebKit.

## Workflow follow-up

- Archivar `trim-docs-js` primero y después este cambio.
- Después de publicar la versión: sincronizar el artefacto (tres componentes nuevos y el grupo «Marcas» con todos los logos, en tandas de 25).
