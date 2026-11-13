# Tasks

## 1. Preparación

- [x] 1.1 Crear la rama `feat/untitled-ui-icons` y añadir las dependencias con versión exacta: `@untitledui/icons` en `packages/react` (dependencies), `@untitledui/icons`, `@untitledui/file-icons`, `@untitledui/country-flags` y `sharp` en `apps/docs`; verificar que `bun install` termina y que `bun pm ls` muestra una sola copia de React
- [x] 1.2 Añadir un test en `apps/docs/test/untitled-ui.test.ts` que pinte con React 19 una bandera (`FlagEs`), un `FileIcon` de `pdf` en sus tres variantes y en `theme="dark"`, y un icono con nombre accesible; verificar que pasa (es la comprobación pendiente de que el paquete de banderas funciona)

## 2. Paquete `@jotis-me/assets`

- [x] 2.1 Crear `packages/assets` moviendo con `git mv` desde `packages/icons` los assets y el código de logos, pagos, cursores, trazos a mano y patrones (design D1), con su `package.json` (0.7.0, entradas `./logos`, `./payments`, `./cursors`, `./hand-drawn/*`, `./patterns/*`, `./app-icons/*`, `./logos/*`, `./payments/*`, `./cursors/*`), scripts de importación y de build; verificar que `bun run --cwd packages/assets build` genera `dist` con esas entradas
- [x] 2.2 Mover los tests y e2e de logos, pagos, cursores y adornos a `packages/assets` y verificar que `bun run --cwd packages/assets test` y `check:package` (publint + attw) pasan
- [x] 2.3 Escribir `packages/assets/README.md` (qué trae, uso en React y como SVG, y que iconos de línea, archivos y banderas se toman de Untitled UI); verificar que los fragmentos del README compilan en `examples/`

## 3. `@jotis-me/react`: icono de app e iconos como componente

- [x] 3.1 Mover la geometría del icono de app a `packages/react/src/app-icon/`, añadir la entrada `./app-icon` al `package.json` y reexportarla desde la raíz (design D2); verificar con los tests de registro y geometría movidos y con un test que importe `@jotis-me/react/app-icon` sin cargar React
- [x] 3.2 Hacer que `packages/assets` genere `app-icons/*` (favicon, `any`, `maskable`, `apple-touch-icon`) desde `@jotis-me/react/app-icon`; verificar que los ficheros generados son idénticos byte a byte a los que generaba `packages/icons` (comparación con el `dist` anterior)
- [x] 3.3 Crear `internal/icon.tsx` con `IconProp`, `IconComponentProps` e `iconSlot` (design D3), con tests: componente función, `forwardRef`, nodo, `undefined`, y un test de tipos que rechace `iconLeading="plus"`
- [x] 3.4 Escribir el script de migración de nombres (design D4) y pasarlo por `packages/react/src`: todas las props de icono pasan a `IconProp` y los iconos internos a importaciones de `@untitledui/icons`; eliminar `components/Icon.tsx` y sus exportaciones; verificar que `tsc --noEmit` pasa y que no queda ningún `@jotis-me/icons` ni `IconName` en `packages/react`
- [x] 3.5 Sustituir el giro de carga de `Button` y `FileUpload` por `Loading02` con `animate-spin motion-reduce:animate-none`; verificar con un test que el icono de carga lleva esas clases
- [x] 3.6 Actualizar los tests de `packages/react` (nombres → componentes) y los comentarios de props que citan `@jotis-me/icons/*`; verificar que `bun run --cwd packages/react test`, `check:colors`, `check:package` y `check:size` pasan, y que `check:size` confirma que importar solo `Button` no trae más dibujos que el de carga (ajustar `size-budget.json` con el valor medido)
- [x] 3.7 Actualizar `packages/react/README.md` (iconos como componente, `@untitledui/icons` como dependencia, entrada `app-icon`); verificar que sus fragmentos coinciden con `examples/next` y `examples/astro`, que construyen

## 4. Eliminar `@jotis-me/icons`

- [x] 4.1 Borrar `packages/icons` entero y quitarlo de `.changeset/config.json` (grupo fijo: `tokens`, `assets`, `react`), de `ci.yml` (lista de paquetes y e2e) y de `scripts/` (`pack.ts`, `release.ts`, `check-reference.ts`); verificar que `grep -r "@jotis-me/icons"` solo encuentra `openspec/`, los `CHANGELOG.md` y el changeset nuevo, y que `bun install` deja el `bun.lock` sin el paquete

## 5. Web: iconos, ejemplos y galerías

- [x] 5.1 Pasar el script de migración por `apps/docs/src` (estructura de la web, `visual/examples/*`, `playground/*`, fichas `.md`, `lib/snippets.ts`, `install.mdx`) y cambiar las importaciones de logos, pagos y cursores a `@jotis-me/assets`, las de archivos a `FileIcon` y las de banderas a `@untitledui/country-flags`; verificar que `astro check` y `bun run --cwd apps/docs test` pasan
- [x] 5.2 Sustituir en los ejemplos las banderas cuadradas o rectangulares, las carpetas y los tres iconos sin equivalente (`align-top-01`, `align-top-02`, `help-hexagon`) por lo que sí existe; verificar que el build de la web termina sin importaciones rotas
- [x] 5.3 Rehacer la galería de iconos de línea sobre `@untitledui/icons` (design D5: nombres del paquete, categorías en `src/data/icon-categories.json`, trazos por tramos generados en el build, panel con nombre, uso en React y SVG); verificar con `e2e/icons.spec.ts` actualizado (buscar, elegir, categoría, «Mostrar más», recuento del paquete)
- [x] 5.4 Rehacer las galerías de banderas (234 en círculo, búsqueda por código y por nombre en castellano) y de archivos (52 tipos × 3 variantes con `FileIcon`); verificar con `e2e/assets.spec.ts` actualizado, incluido el escenario de dos banderas iguales en una página
- [x] 5.5 Cambiar las galerías de logos, pagos y cursores a `@jotis-me/assets`; verificar con `e2e/logos.spec.ts` y `e2e/assets.spec.ts`
- [x] 5.6 Actualizar las páginas de fundamentos de iconografía y de marca, la portada (cifras calculadas de los paquetes nuevos), `search-index.json.ts`, `nav.ts` y `lib/props.ts`; verificar con `e2e/home.spec.ts`, `e2e/search.spec.ts` y `e2e/foundations.spec.ts`
- [x] 5.7 Pasar la paridad visual (`e2e/visual.spec.ts`), revisar cada diff y reaprobar solo las capturas que cambien por el paso a los iconos de npm o por las sustituciones de 5.2; anotar en `NOTAS.md` del cambio cuáles y por qué
- [x] 5.8 Medir el JavaScript con `bun run --cwd apps/docs check:js` y actualizar `js-budget.json` con lo medido más un 10 % (debe bajar o quedarse; si alguna página sube, explicar el motivo en el propio fichero)

## 6. Playground

- [x] 6.1 Convertir los `presets` de `lib/starts/*.ts` en un fixture de test («tipo del Figma → props») y añadir un test que compruebe que cada prop de variante de cada tipo tiene control o valor preparado (design D7); añadir los controles o `tweaks` que falten hasta que pase
- [x] 6.2 Eliminar la fila «Tipos»: el bloque de atajos de `Playground.tsx`, `Preset`, `Start.presets`, `applyPreset` y `presetActive` de `lib/playground.ts`, y las entradas `presets` de `lib/starts/*.ts`; verificar con `test/playground*.test.ts` y con el escenario «Sin atajos» en `e2e/playground.spec.ts`
- [x] 6.3 Alinear los controles por arriba (`items-start`) y dar al grupo de interruptores el margen superior del alto de etiqueta; verificar con un e2e que mide la posición vertical de etiquetas y campos de una fila antes y después de activar `iconOnly` en `Button` (no cambian) y revisando la captura de pantalla en 1280 y 390 px
- [x] 6.4 Cambiar el control de icono al conjunto fijo `lib/playground-icons.ts` con componentes de `@untitledui/icons`, y el código generado a `prop={Nombre}` con su importación; verificar con `test/playground.test.ts` (código de Next.js y Astro) y los escenarios «Elegir un icono» y «Código copiable» del e2e

## 7. Capturas de las cards

- [x] 7.1 Crear la página `/showcase/<slug>/` y reescribir `visual/thumbnails.tsx` como `visual/showcases.tsx` para el escenario de 640×400 (design D6), una muestra tipo showcase por componente, con `scale` donde haga falta; verificar que la página existe para todo el catálogo (test) y que no aparece en el buscador ni en el sitemap
- [x] 7.2 Escribir `scripts/capture-showcases.ts` (Playwright + sharp → WebP 960×600, claro y oscuro, Stream solo oscuro, nombres sueltos o `--all`) y el comando `capture:showcases`; verificar ejecutándolo con `Button` y abriendo los dos WebP
- [x] 7.3 Generar las capturas de todo el catálogo y **revisarlas una a una** (hoja de contactos en claro y en oscuro): ninguna recortada, deformada ni ilegible; rehacer las muestras que no queden bien y guardar las capturas en `src/assets/showcase/`
- [x] 7.4 Sustituir `LivePreview.astro` por `ShowcaseImage.astro` en el índice (dos `<img>` por tema, `loading="lazy"`, dimensiones fijas, damero vacío si falta); borrar `LivePreview.astro`, `visual/thumbs.ts` y lo que solo usaban; verificar con `e2e/components.spec.ts` (card con imagen, cambia con el tema, solo se pide la del tema activo, sin salto de maquetación, vista previa decorativa) y mirando la página en claro, oscuro y 390 px
- [x] 7.5 Añadir `test/showcases.test.ts` (cada componente tiene sus capturas; máximo por imagen y total) y fijar los máximos con lo medido; verificar que falla al quitar una captura y al superar el peso
- [x] 7.6 Quitar la excepción de Lighthouse del índice en `lighthouserc.json` y ejecutar `bun run --cwd apps/docs test:lighthouse`; verificar que las cuatro páginas superan 90
- [x] 7.7 Documentar en `apps/docs/README.md` cómo regenerar las capturas y cuándo (al tocar un componente o su muestra); verificar que el comando documentado funciona tal cual

## 8. Artefacto

- [x] 8.1 Actualizar `scripts/artifact` (design D8: rutas a `packages/assets`, sin grupos de iconos de línea, banderas ni archivos, párrafo de Untitled UI en la guía, ejemplos con iconos como componente); verificar con `bun run artifact:build`, los tests y el e2e de `scripts/artifact` (límites del tipo, montaje sin errores de consola)

## 9. Publicación e integración

- [x] 9.1 Escribir el changeset `minor` del grupo fijo con la guía de migración (nombres → componentes con la receta del script, tabla de importaciones antiguas → nuevas, lo que se elimina sin sustituto); verificar que `/changelog/` lo pinta bien en la web construida (el render en /changelog/ se comprueba al versionar: el changeset aún no es una entrada de CHANGELOG)
- [x] 9.2 Ejecutar `bun run ci`, `bunx biome ci .`, los e2e de `apps/docs` y de `packages/assets`, y `check:js`; verificar que todo pasa y anotar en `NOTAS.md` cualquier diferencia aceptada
- [x] 9.3 Medir y anotar en `NOTAS.md` el antes y el después: tamaño de `packages/` en el repo, tamaño instalado de `@jotis-me/react` con sus dependencias y JavaScript de `/components/` y de `/icons/`

## Workflow follow-up

- Tras publicar la 0.8.0, marcar el paquete antiguo como obsoleto: `npm deprecate @jotis-me/icons "Sustituido por @untitledui/icons, @untitledui/file-icons, @untitledui/country-flags y @jotis-me/assets"` (lo ejecuta el usuario).
- Archivar el cambio cuando el PR esté integrado y sincronizar las specs.
- Los ajustes componente por componente que vienen después regeneran la captura de cada componente que toquen.
