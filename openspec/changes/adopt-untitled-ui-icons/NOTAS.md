# Notas de la implementación

Decisiones y diferencias respecto a lo planeado, para que los artefactos y el código no se contradigan.

## Diferencias con el plan

- **Ajuste automático de las muestras (D6).** En lugar de un campo `scale` por muestra, la página `/showcase/<slug>/` mide lo que de verdad se ve (recortando con los `overflow` de los ancestros) y la ajusta al 74 % del marco de 640×400, entre 0,3× y 2,4×. Las muestras que seguían mal (BackgroundPattern, CalendarView, CardHeader, Carousel, CodeSnippet, Footer, HeaderNav, MarketingNav, Pager, Table, Testimonial, VideoPlayer, Banner) se rehicieron a mano. `design.md` ya lo dice. Se descartó el viewport de 640 px de la captura: se fotografía en 1280 px para que las clases `md:` pinten como en la web.
- **Atajos (D7).** Quitarlos descubrió que ~50 props de contenido (listas, objetos, `false | "…"`, alias de tipo) solo se alcanzaban con ellos. Para no perder los 417 tipos del Figma: (1) `controlsOf` entiende uniones con `false`, `true` y números (`coerce`); (2) nuevo ajuste `choice` para alias que la tabla no despliega; (3) `starts/tipos-del-figma.ts`, generado de `test/fixtures/figma-types.json`, da valores preparados; (4) un control de contenido parte de una opción «Por defecto» con el valor del punto de partida. Un test comprueba que cada tipo del Figma se alcanza con los controles y pinta sin errores.
- **Selector de icono del playground.** Son 86 iconos (los del antiguo núcleo), no 82: el recuento de la spec antigua estaba desfasado.
- **Búsqueda global (Ctrl+K).** Los resultados de iconos ya no pintan el icono de cada uno (cargaría el set entero en todas las páginas): llevan un icono fijo y buscan por `SearchLg` y por `search-lg`.
- **`@jotis-me/assets` depende de `@jotis-me/react`** como devDependency (genera los favicons con `app-icon`), y `react` no puede depender de `assets`: los tests de `react` usan logos de mentira (`test/logo-stub.tsx`).
- **«HTML de antes».** Las pruebas de variantes comparan con el HTML anterior sin contar el dibujo de los SVG (`toMatchBefore` en `test/setup.ts`): los iconos de npm dibujan distinto. Lo demás sigue igual de exigente.
- **Banderas.** El `clipPath` de cada bandera tiene un `id` fijo (`ES_svg__a`): dos banderas iguales en una página lo repiten con el mismo contenido y se ven bien (e2e que lo comprueba con capturas).
- **Astro e islas.** Un icono como componente es una función: no cruza de un Server Component ni de un `.astro` a una isla. La guía de instalación, el changelog y los fragmentos de la web lo dicen; los ejemplos de `examples/` usan el nodo (`<Clock size={16} />`) donde cruza.

## Capturas aprobadas de la paridad visual (5.7)

Pasan todas sin reaprobar ninguna: los trazos de Untitled UI coinciden con los de la copia. Solo se borraron las dos de `Icon`, que dejó de ser un componente.

## Medidas

- `packages/` en el repo: 10,25 MB → 5,9 MB; las capturas WebP añaden 3,2 MB (228 imágenes, 14 kB de media). Neto, unos −1,1 MB; el peso instalado del paquete `react` ya no incluye el mapa de iconos y `check:size` baja en casi todos los componentes.
- JavaScript de las páginas: bajan o quedan igual, salvo `/visual/*/` de los formularios, que suben de 286 a 301 kB (`FileIcon` trae sus 52 dibujos); el límite pasa a 332 con su motivo en `js-budget.json`.
- Importar solo `Button` empaqueta un único dibujo de `@untitledui/icons` (`Loading02`).

## Pendiente de CI o de quien publique

- **Lighthouse.** En este PC no se puede validar el umbral de 90: la 0.7.0 publicada saca 0,88 (`/components/button/`) y 0,78 (`/components/`) en la misma máquina. Con las capturas, `/components/` y las demás páginas dan 0,68–0,83 en local (FCP de 2–4 s, también en páginas de texto que no han cambiado). El umbral único de 0,90 está puesto en `lighthouserc.json` y lo decide CI. Las primeras cards piden ya la captura clara (`loading="eager"`), porque una imagen perezosa en el LCP tardaba en empezar a bajar.
- **attw.** `check:package` llama a `npm pack`, que no existe aquí; publint pasa y `attw` sobre el `.tgz` de `bun pm pack` da verde en ESM y bundler para `assets` y `react`.
- **Deprecar `@jotis-me/icons`** tras publicar la 0.8.0: `npm deprecate @jotis-me/icons "Sustituido por @untitledui/icons, @untitledui/file-icons, @untitledui/country-flags y @jotis-me/assets"`.
- **Test «humo» del playground.** Con toda la batería a la vez (dos workers y el recorrido de accesibilidad) falla de forma intermitente en un componente distinto cada vez (CardHeader, Badge), por tiempo al elegir una opción; solo, pasa siempre. CI lo reintenta una vez (`retries: 1`). Si se repite en CI, mirar `extremes()` en `e2e/playground.spec.ts`: ahora hay más selectores de contenido por componente.
- **7.6 queda sin marcar**: la excepción de Lighthouse está quitada, pero el umbral de 90 no se ha podido comprobar en este PC (ver arriba).
