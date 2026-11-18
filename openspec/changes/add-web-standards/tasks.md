# Tasks

## 1. Excepciones de normas con caducidad

- [x] 1.1 Añadir a `scripts/check-dev.ts` la lectura de `standards-exceptions.json` (raíz): falla si una entrada ha caducado, si `rule` no es el ID de una norma, si falta `why` o `until`, o si la norma es automática (`biome`, `ci` o `test`). Verificación: casos nuevos en `scripts/check-dev.test.ts`, uno por cada fallo y uno válido, en verde con `bun test scripts`.
- [x] 1.2 Crear `standards-exceptions.json` vacío (`[]`). Verificación: `bun run check:dev` pasa.

## 2. `headingLevel` en PageHeader y StreamScene

- [x] 2.1 Añadir a `PageHeader` la prop opcional `headingLevel` (de 1 a 6, por defecto 1), con su JSDoc, en sus dos variantes. Verificación: tests nuevos en el test del componente (por defecto pinta `<h1>`; con `headingLevel={2}` pinta `<h2>` con las mismas clases), en verde.
- [x] 2.2 Añadir la misma prop a `StreamScene`. Verificación: tests nuevos equivalentes, en verde.
- [x] 2.3 Documentar la prop en la página de cada componente y en su ejemplo interactivo, y usar `headingLevel={2}` en los ejemplos de la guía de los dos. Verificación: tras `bun run build`, `/components/page-header/` y `/components/stream-scene/` tienen un solo `<h1>` en `dist/`, y sus capturas aprobadas no cambian.
- [x] 2.4 Changeset `minor` para `@jotis-me/react`. Verificación: `bunx changeset status` lo lista.

## 3. Metadatos, robots y sitemap de la web

- [x] 3.1 En `apps/docs/src/layouts/Base.astro`, pintar en las páginas indexables `canonical` (URL absoluta con `Astro.site`), `og:title`, `og:description`, `og:url`, `og:type`, `og:image`, `og:locale` y `twitter:card`; las páginas con `noindex` no los llevan. Verificación: en `dist/index.html` y `dist/components/button/index.html` aparecen con `https://regula.jotis.me/…`, y en `dist/visual/button/index.html` no.
- [x] 3.2 Crear la imagen de Open Graph (1200 por 630 px, logotipo y lema sobre el fondo de la marca) y enseñársela al usuario antes de fusionar. Verificación: el fichero existe, pesa menos de 200 kB y `og:image` apunta a él con URL absoluta.
- [x] 3.3 Escribir el sitemap desde el gancho `astro:build:done` (design D5), sin las páginas con `noindex`, con la función del XML en `src/lib/sitemap.ts` y su test. Verificación: `dist/sitemap.xml` lista las 166 páginas indexables y ninguna interna, y `test/sitemap.test.ts` pasa.
- [x] 3.4 Crear `apps/docs/src/pages/robots.txt.ts`, que permite rastrear y enlaza al sitemap con el dominio de `Astro.site`. Verificación: `dist/robots.txt` contiene `Sitemap: https://regula.jotis.me/sitemap.xml`.

## 4. Test de las páginas construidas

- [x] 4.1 Crear `apps/docs/test/pages.test.ts`: recorre los `index.html` de `dist/`, separa las indexables y comprueba en cada una título único, descripción, `canonical` igual a su URL absoluta, un solo `<h1>` y Open Graph completo; en todas, `lang` en `<html>`; y en las indexables, región `main` y enlace de salto. Los fallos nombran la página. Verificación: el test pasa, y falla al quitar a mano el `canonical` de una página de `dist/`.
- [x] 4.2 En el mismo test, comprobar que `robots.txt` enlaza al sitemap y que el sitemap lista exactamente las páginas indexables. Verificación: el test pasa, y falla si se añade una URL de `/visual/` al sitemap de `dist/`.
- [x] 4.3 Comprobar que los dos ejemplos cumplen `ACC-003` y `LOC-001` (`lang`, región `main` y enlace de salto) y arreglar el que no. Verificación: los e2e de los ejemplos siguen en verde y un caso nuevo en cada uno comprueba `lang` y el enlace de salto.

## 5. Peso por página: HTML, CSS y JS

- [x] 5.1 Renombrar `apps/docs/scripts/js-weight.ts` a `page-weight.ts` y medir también el HTML de la página y el CSS que enlaza, en gzip; el fallo nombra la página, el tipo, lo medido y el límite. Verificación: casos nuevos en el test del script (HTML y CSS por encima y por debajo del límite), en verde.
- [x] 5.2 Pasar `js-budget.json` a `weight-budget.json` con los bloques `js`, `css` y `html`: conservar los límites de JS y fijar los de HTML y CSS con lo medido más un 10 %, con su motivo en `$comment`. Verificación: `bun run check:weight` pasa sobre el build actual.
- [x] 5.3 Renombrar el script `check:js` a `check:weight` y el paso del CI a «Peso por página de la web», y actualizar lo que los nombre (`check-ci`, normas y documentación). Verificación: `bun run check:ci` pasa y `grep -r "check:js"` no encuentra nada fuera de `openspec/changes/archive/` y de los changelogs.

## 6. Lighthouse

- [x] 6.1 En `apps/docs/lighthouserc.json`: `categories:performance` como `warn`, `cumulative-layout-shift` como `error` con máximo 0,1, y `categories:accessibility` como está. Verificación: `bun run test:lighthouse` en local termina en 0 aunque una puntuación de rendimiento baje de 0,9, y enseña el aviso.
- [x] 6.2 Renombrar el paso del CI a «Lighthouse (móvil, CLS y accesibilidad)» y hacer que `lighthouse-summary.ts` enseñe la puntuación de rendimiento como aviso y el CLS. Verificación: `bun run check:ci` pasa y el test del resumen cubre un informe con rendimiento bajo y CLS correcto.

## 7. Las cuatro áreas de normas

- [x] 7.1 Crear `accessibility.yaml` (`ACC-001` a `ACC-008`, `order` 10) con enunciado, porqué, ejemplos y verificación según la tabla del design D2. Verificación: `bun run test` de la web valida el esquema y la página `/standards/accessibility/` se construye.
- [x] 7.2 Crear `performance.yaml` (`PRF-001` a `PRF-007`, `order` 11), con `PRF-002` y `PRF-003` apuntando a los pasos del CI de los grupos 5 y 6. Verificación: los tests de la fuente de normas encuentran esos pasos en `ci.yml`.
- [x] 7.3 Crear `seo.yaml` (`SEO-001` a `SEO-008`, `order` 12), con las automáticas apuntando a `pages.test.ts`. Verificación: los tests de la fuente de normas pasan.
- [x] 7.4 Crear `localization.yaml` (`LOC-001` a `LOC-006`, `order` 13). Verificación: los tests de la fuente de normas pasan.
- [x] 7.5 Pasar `git`, `ci` y `process` a `order` 14, 15 y 16, añadir las cuatro áreas a `STANDARD_AREAS` y actualizar el orden en `standards.test.ts` y `mcp-tools.test.ts`. Verificación: esos tests pasan y `/standards.json` lista las 16 áreas en el orden de la spec.
- [x] 7.6 Declarar `LOC-003` y `LOC-004` en `standards-exceptions.json`, con su motivo y caducidad el 2027-03-31 (o la fecha que fije el usuario). Verificación: `bun run check:dev` pasa.

## 8. Comprobación final

- [ ] 8.1 Pasar en local, guardando el código de salida de cada uno: `bunx turbo run build typecheck test`, Biome con `--error-on-warnings`, `check:dev`, `check:ci`, `check:audit` y `check:weight`. Verificación: todos terminan en 0.
- [ ] 8.2 Pasar los e2e completos de la web con `CI=1`. Verificación: ningún test falla ni sale inestable.
- [ ] 8.3 `openspec validate add-web-standards --strict`. Verificación: sin errores.

## Workflow follow-up

- Abrir la PR de `feat/add-web-standards`, esperar al CI y fusionar con permiso del usuario.
- Comprobar en producción `https://regula.jotis.me/robots.txt`, el sitemap y los metadatos de una página.
- Archivar el cambio en una PR aparte (`chore/archive-add-web-standards`) con la sincronización de specs.
