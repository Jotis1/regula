# Tasks

## 1. Congelar la referencia

- [ ] 1.1 Reimportar del artefacto "Jotis.me" la versión `1793805785-9fe2` en `reference/` (AppIcon `README.md` y `preview.html`, `assets/App icons/README.md` y los 5 `scaena-*.svg`, `GUIA.md`, `components/bundle.js`, `components/index.d.ts`, `design-system.json`) y actualizar `reference/VERSION`; verificar que el sha256 de cada fichero coincide con el de `list_files` de esa versión y que el resto de `reference/` no cambia
- [ ] 1.2 Marcar `reference/` como congelada en su `README.md` (procedencia de las 74 fichas y de las capturas aprobadas, copia para deshacer, no se lee desde el código) y en el `README.md` raíz; verificar con revisión del diff

## 2. Scaena y assets dentro del paquete de iconos

- [ ] 2.1 Copiar los SVG de app de la guía (incluidos los de Scaena) a `packages/icons/test/fixtures/app-icons/` y apuntar `packages/icons/test/app-icon.test.ts` y `packages/react/test/app-icon.test.tsx` a esa carpeta; verificar que los tests pasan sin cambios en el código
- [ ] 2.2 Añadir `scaena` (`Sc`, `lime`) al registro de `appicon.ts` y al tipo de apps de `app-icon.ts`; verificar con tests que sus 5 variantes coinciden con los fixtures, que `green` falla como vecino de `lime` y que los tonos ya usados siguen fallando
- [ ] 2.3 Mover los SVG de `reference/assets/{Hand-drawn,Patterns}` a `packages/icons/assets/{hand-drawn,patterns}/` con la tinta `#171717` ya en `currentColor`, y hacer que `scripts/assets.ts` lea de ahí; verificar que `dist/hand-drawn` y `dist/patterns` salen idénticos byte a byte a los del build anterior
- [ ] 2.4 Sustituir la lectura de `reference/design-system.json` en `icons.test.tsx` y `decorations.test.ts` por la lista del propio paquete, y añadir el test de que los 81 nombres originales siguen exportándose; verificar con `bun run test` en `packages/icons`
- [ ] 2.5 Añadir Scaena a la ficha de AppIcon, a la página de marca (`content/foundations/brand.md`) y al ejemplo de AppIcon de la web, con el texto de la guía `9fe2`; verificar con el build de la web y una captura de la página de marca
- [ ] 2.6 Retirar `packages/icons/scripts/extract.ts` y `packages/tokens/scripts/translate-usage.ts` (y su test `usage.test.ts`, que pasa a comprobar `tokens.json` del paquete); verificar con `bunx turbo run build typecheck test`
- [ ] 2.7 Añadir el changeset (minor de `@jotis-me/icons` y `@jotis-me/react` por la app nueva); verificar con `bunx changeset status`

## 3. Paridad visual con capturas aprobadas

- [ ] 3.1 Llevar la altura de cada tarjeta y el tema de su vista previa al registro de ejemplos (`visual/registry.ts`) con los valores que hoy se leen de los `preview.html` de la guía; verificar con un test que el registro tiene altura para cada componente del catálogo y que coinciden con las de la guía para los 74
- [ ] 3.2 Hacer que `visual.spec.ts` compare cada ejemplo con su PNG aprobada sin servir la guía, y retirar `e2e/visual/reference.ts`; verificar con la suite visual en verde y con un test que falla al borrar una PNG de prueba indicando componente y tema
- [ ] 3.3 Sustituir `scripts/capture-reference.ts` por `scripts/capture-approved.ts <Nombre…>`, que captura el ejemplo de la web en claro y en oscuro, y documentar el flujo de aprobación (revisar en la vista previa del deploy, capturar, meter las PNG en el PR) en el README de la web; verificar capturando un componente existente y comprobando que la PNG nueva pasa la comparación con la actual
- [ ] 3.4 Pasar `e2e/foundations.spec.ts` a leer las páginas de `content/foundations/` en lugar de `reference/GUIA.md`, y retirar `scripts/split-guide.ts`; verificar con la suite e2e de fundamentos en verde

## 4. Catálogo único

- [ ] 4.1 Añadir en `apps/docs` el test de catálogo: lo que exporta `@jotis-me/react` (en PascalCase), `COMPONENT_GROUPS`, las páginas de `content/components/` y las PNG aprobadas son la misma lista; verificar que pasa hoy y que falla al quitar una página de prueba
- [ ] 4.2 Cambiar la portada y el índice de componentes para que el recuento salga del catálogo en lugar de un 74 escrito; verificar con el e2e del índice
- [ ] 4.3 Comprobar con `rg "reference/" packages apps scripts` que no queda ninguna lectura de `reference/` fuera de comentarios de procedencia, y añadir esa comprobación a CI; verificar que falla con una lectura de prueba

## 5. Generador del artefacto

- [ ] 5.1 Crear `scripts/artifact/` con `bun run artifact:build` que escribe `dist-artifact/project/` y `manifest.json` (ruta y sha256 de cada fichero), y añadir `dist-artifact/` a `.gitignore`; verificar que corre sin red (`unshare -n` o red bloqueada en el test)
- [ ] 5.2 Generar el bundle IIFE de `@jotis-me/react` y de los ejemplos del registro con React por globales y namespace `Jotis`, con la cabecera `@ds-bundle` del catálogo; verificar con un test que abre una página con React 18 UMD y el bundle en Playwright, monta `Jotis.Button` y `Jotis.previews.Button` sin errores en consola, y que el bundle no pasa de 6 MB ni contiene `</script` ni `<!--`
- [ ] 5.3 Compilar la hoja con Tailwind v4 desde `@jotis-me/react/styles.css`, con `[data-theme="dark"]` como alias de `.dark-mode`; verificar en el mismo test que un `Button` primario tiene el color de `bg-brand-solid` en claro y en oscuro
- [ ] 5.4 Generar `index.d.ts` único con `dts-bundle-generator`; verificar que compila con `tsc --noEmit` y que declara todos los componentes del catálogo
- [ ] 5.5 Generar fichas, vistas previas (`@dsCard` con grupo y altura del registro), `README.md` desde los fundamentos, `tokens.json` con `meta.source`, fuentes y los grupos de assets; verificar con tests que cada componente del catálogo tiene ficha y vista previa idénticas en texto a su página, que `tokens.json` coincide con el paquete y que el total queda por debajo de los límites del tipo
- [ ] 5.6 Comparar las vistas previas generadas con las PNG aprobadas en Playwright (mismo tamaño, ambos temas); verificar que pasan las 74 y que alcanzan la misma tolerancia que la suite visual de la web
- [ ] 5.7 Añadir `artifact:build` y sus tests al job de comprobaciones de `ci.yml`; verificar con un PR de prueba en verde
- [ ] 5.8 Escribir `scripts/artifact/README.md` con el procedimiento de publicación (leer el índice publicado, comparar `manifest.json` con `list_files`, subir solo los assets cambiados, publicar los ficheros cambiados y el índice al final, con `"editing": "code"` y `lastChange` `GitHub - Jotis1/regula@<sha>`); verificar con revisión

## 6. Primera sincronización

- [ ] 6.1 Abrir los diseños que usan el artefacto (Scaena, Ornatus y la web de Regula) con el bundle generado en local y anotar las diferencias frente a la copia a mano; verificar con una lista revisada y, si hay alguna que el paquete hace mal, una tarea en el cambio que la corrija antes de publicar
- [ ] 6.2 Publicar en el artefacto "Jotis.me" la carpeta generada siguiendo `scripts/artifact/README.md`; verificar que `list_files` coincide con `manifest.json`, que la página aparece en solo lectura y que `lastChange` apunta al commit
- [ ] 6.3 Abrir cinco vistas previas del artefacto publicado (Button, Input, Modal, AppIcon con Scaena y StreamAlert) en claro y en oscuro; verificar a ojo contra la web y dejar las capturas en el PR

## Workflow follow-up

- Archivar este cambio con `/opsx:archive` cuando todo esté hecho; los deltas actualizan `component-library`, `brand-assets`, `design-tokens`, `icon-set`, `docs-site` y crean `design-system-artifact`.
- Los cambios siguientes (formularios, base, navegación, datos, recursos, páginas y marketing) añaden componentes con el flujo de D4 y D7.
