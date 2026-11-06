# Tasks

## 1. Congelar la referencia

- [x] 1.1 Reimportar del artefacto "Jotis.me" la versión `1793805785-9fe2` en `reference/` (AppIcon `README.md` y `preview.html`, `assets/App icons/README.md` y los 5 `scaena-*.svg`, `GUIA.md`, `components/bundle.js`, `components/index.d.ts`, `design-system.json`) y actualizar `reference/VERSION`; verificar que el sha256 de cada fichero coincide con el de `list_files` de esa versión y que el resto de `reference/` no cambia
- [x] 1.2 Marcar `reference/` como congelada en su `README.md` (procedencia de las 74 fichas y de las capturas aprobadas, copia para deshacer, no se lee desde el código) y en el `README.md` raíz; verificar con revisión del diff

## 2. Scaena y assets dentro del paquete de iconos

- [x] 2.1 Copiar los SVG de app de la guía (incluidos los de Scaena) a `packages/icons/test/fixtures/app-icons/` y apuntar `packages/icons/test/app-icon.test.ts` y `packages/react/test/app-icon.test.tsx` a esa carpeta; verificar que los tests pasan sin cambios en el código
- [x] 2.2 Añadir `scaena` (`Sc`, `lime`) al registro de `appicon.ts` y al tipo de apps de `app-icon.ts`; verificar con tests que sus 5 variantes coinciden con los fixtures, que una app en `green` da un problema que nombra a Scaena (vecino de `lime`) además del de Pecunia, y que los tonos ya usados siguen fallando
- [x] 2.3 Mover los SVG de `reference/assets/{Hand-drawn,Patterns}` a `packages/icons/assets/{hand-drawn,patterns}/` con la tinta `#171717` ya en `currentColor`, y hacer que `scripts/assets.ts` lea de ahí; verificar que `dist/hand-drawn` y `dist/patterns` salen idénticos byte a byte a los del build anterior
- [x] 2.4 Sustituir la lectura de `reference/design-system.json` en `icons.test.tsx` y `decorations.test.ts` por la lista del propio paquete, guardar los 81 nombres originales en `packages/icons/test/fixtures/icon-names-guide.json` y añadir el test de que siguen exportándose; verificar con `bun run test` en `packages/icons`
- [x] 2.5 Añadir Scaena a la ficha de AppIcon, a la página de marca (`content/foundations/brand.md`) y al ejemplo de AppIcon de la web, con el texto de la guía `9fe2`; verificar con el build de la web y una captura de la página de marca
- [x] 2.6 Retirar `packages/icons/scripts/extract.ts` y `packages/tokens/scripts/translate-usage.ts`. Cambiar la cabecera de `packages/icons/src/data/{appicon,icons}.ts` a «Fuente; sale de la guía `9fe2` vía el antiguo extract.ts, se edita a mano». En `usage.test.ts`, retirar la comprobación de traducción respecto al original y fijar la lista de nombres de tokens, en orden, en `packages/tokens/test/fixtures/token-names.json` (D2). Verificar con `bunx turbo run build typecheck test` y con un test que falla al renombrar un token de prueba
- [x] 2.7 Añadir el changeset (minor de `@jotis-me/icons` y `@jotis-me/react` por la app nueva); verificar con `bunx changeset status`

## 3. Paridad visual con capturas aprobadas

- [x] 3.1 Llevar la altura de cada tarjeta y el tema de su vista previa al registro de ejemplos (`visual/registry.ts`) con los valores que hoy se leen de los `preview.html` de la guía. Verificar con un test permanente que el registro tiene altura para cada componente del catálogo, y con una comprobación de una sola vez (script en la PR, no en la suite) de que los 74 valores coinciden con los de la guía
- [x] 3.2 Renombrar `apps/docs/e2e/visual/reference/` a `apps/docs/e2e/visual/approved/` con `git mv` (`REFERENCE_DIR`/`referencePath` de `compare.ts` pasan a `APPROVED_DIR`/`approvedPath`; `src/lib/previews.ts` lee de la carpeta nueva). Verificar que las 148 PNG se mueven sin cambios de contenido y que la web recorta las mismas vistas previas
- [x] 3.3 Hacer que `visual.spec.ts` compare cada ejemplo con su PNG aprobada sin servir la guía, y retirar `e2e/visual/reference.ts`; verificar con la suite visual en verde y con un test que falla al borrar una PNG de prueba indicando componente y tema
- [x] 3.4 Sustituir `scripts/capture-reference.ts` por `scripts/capture-approved.ts <Nombre…> [--out <carpeta>]`, que captura el ejemplo de la web en claro y en oscuro. Añadir a `ci.yml` un job manual (`workflow_dispatch`, `windows-latest`) que lo ejecuta para los nombres pedidos y sube las PNG como artifact. Documentar el flujo de D4 en el README de la web: capturar en Windows, revisar el ejemplo en la vista previa del deploy y la PNG en el diff del PR, y en un cambio de aspecto sustituir las PNG explicando el motivo. Verificar capturando un componente existente con `--out` en una carpeta temporal y comprobando que pasa la comparación con la aprobada sin modificarla
- [x] 3.5 Pasar `e2e/foundations.spec.ts` a leer las páginas de `content/foundations/` en lugar de `reference/GUIA.md`, y retirar `scripts/split-guide.ts`; verificar con la suite e2e de fundamentos en verde

## 4. Catálogo único

- [x] 4.1 Añadir en `apps/docs` el test de catálogo: los componentes que exporta `@jotis-me/react` (exportaciones en PascalCase que son función u objeto de React, D5), `COMPONENT_GROUPS`, las páginas de `content/components/` y las PNG aprobadas son la misma lista; verificar que pasa hoy, que falla al quitar una página de prueba y que una constante de prueba en PascalCase no entra en el catálogo
- [x] 4.2 Cambiar la portada y el índice de componentes para que el recuento salga del catálogo en lugar de un 74 escrito; verificar con el e2e del índice
- [x] 4.3 Añadir a CI (job de comprobaciones) una búsqueda de rutas reales a la carpeta raíz `reference/` en `packages`, `apps` y `scripts` (`(\.\./)+reference/` y `join(` con `"reference"` que suba fuera del paquete), sin contar los comentarios de procedencia (D1). Verificar que hoy no da nada después de las secciones 2 y 3, y que falla con una lectura de prueba

## 5. Generador del artefacto

- [ ] 5.1 Crear `scripts/artifact/` con `bun run artifact:build` que escribe `dist-artifact/project/` y `manifest.json` (ruta y sha256 de cada fichero), y añadir `dist-artifact/` a `.gitignore`; verificar que corre sin red (`unshare -n` o red bloqueada en el test)
- [ ] 5.2 Generar el bundle IIFE de `@jotis-me/react` y de los ejemplos del registro con React por globales y namespace `Jotis`, con la cabecera `@ds-bundle` del catálogo; verificar con un test que abre una página con React 18 UMD y el bundle en Playwright y monta cada componente del catálogo y su `Jotis.previews.<Nombre>` sin errores en consola, y que el bundle no pasa de 6 MB ni contiene `</script` ni `<!--`
- [ ] 5.3 Compilar la hoja con Tailwind v4 desde `@jotis-me/react/styles.css`, con un `@source` de `apps/docs/src/visual/` y `[data-theme="dark"]` como alias de `.dark-mode`. Verificar en el mismo test que un `Button` primario tiene el color de `bg-brand-solid` en claro y en oscuro, y que la hoja contiene `grid-cols-[88px_repeat(5,64px)]` del ejemplo de AppIcon
- [ ] 5.4 Generar `index.d.ts` único con `dts-bundle-generator`; verificar que compila con `tsc --noEmit` y que declara todos los componentes del catálogo
- [ ] 5.5 Generar fichas, vistas previas (`@dsCard` con grupo y altura del registro), `README.md` desde los fundamentos, `tokens.json` con `meta.source`, fuentes y los grupos de assets; verificar con tests que cada componente del catálogo tiene ficha y vista previa idénticas en texto a su página, que `tokens.json` coincide con el paquete y que el total queda por debajo de los límites del tipo
- [ ] 5.6 Comparar las vistas previas generadas con las PNG aprobadas en Playwright (mismo tamaño, ambos temas); verificar que pasan todas las del catálogo con la misma tolerancia que la suite visual de la web
- [ ] 5.7 Añadir a `ci.yml` `artifact:build`, la comprobación sin red y los tests sin navegador del generador al job de comprobaciones (`ubuntu-latest`), y los tests de Playwright de 5.2, 5.3 y 5.6 al job de navegador (`windows-latest`, donde se capturaron las PNG). Verificar con un PR de prueba en verde en los dos jobs
- [ ] 5.8 Escribir `scripts/artifact/README.md` con el procedimiento de publicación (comprobar si el `lastChange` publicado apunta a la última versión de los paquetes y avisar de las que faltan, leer el índice publicado, comparar `manifest.json` con `list_files`, subir solo los assets cambiados, publicar los ficheros cambiados y el índice al final, con `"editing": "code"` y `lastChange` `GitHub - Jotis1/regula@<sha>`); verificar con revisión

## 6. Primera sincronización

- [ ] 6.1 Abrir los diseños que usan el artefacto (Scaena, Ornatus y la web de Regula) con el bundle generado en local y anotar las diferencias frente a la copia a mano, incluidas las utilidades de Tailwind que usan y que no están en la hoja generada (decidir si se añade un safelist o se cambia el diseño); verificar con una lista revisada y, si hay alguna que el paquete hace mal, una tarea en el cambio que la corrija antes de publicar
- [ ] 6.2 Publicar en el artefacto "Jotis.me" la carpeta generada siguiendo `scripts/artifact/README.md`; verificar que `list_files` coincide con `manifest.json`, que la página aparece en solo lectura y que `lastChange` apunta al commit
- [ ] 6.3 Abrir cinco vistas previas del artefacto publicado (Button, Input, Modal, AppIcon con Scaena y StreamAlert) en claro y en oscuro; verificar a ojo contra la web y dejar las capturas en el PR

## Workflow follow-up

- Archivar este cambio con `/opsx:archive` cuando todo esté hecho; los deltas actualizan `component-library`, `brand-assets`, `design-tokens`, `icon-set`, `docs-site` y crean `design-system-artifact`.
- Los cambios siguientes (formularios, base, navegación, datos, recursos, páginas y marketing) añaden componentes con el flujo de D4 y D7.
