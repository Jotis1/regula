# Tasks

## 1. El reintento en los e2e de la web

- [x] 1.1 Renombrar `apps/docs/e2e/hydration.ts` a `fixtures.ts` y hacer que todos los e2e de la web importen `test` y `expect` de ahí. Verificación: ningún `*.spec.ts` de `apps/docs/e2e` importa `test` de `@playwright/test`, y `astro check` pasa.
- [x] 1.2 En `fixtures.ts`, reintentar `page.goto` una vez cuando falla con `net::ERR_CONNECTION_REFUSED` o `net::ERR_NO_BUFFER_SPACE`, esperando antes a la página de error de Chromium, y anotar `navigation-retry` en el test. Verificación: `apps/docs/e2e/navigation-retry.spec.ts` pasa sus tres casos (un reintento, dos fallos y otro error de red).

## 2. La norma

- [x] 2.1 Añadir a `TST-004`, en `apps/docs/src/content/standards/testing.yaml`, la excepción escrita de la navegación que el runner rechaza. Verificación: los tests de la fuente de normas pasan y `/standards/testing/` enseña la excepción.

## 3. Comprobación final

- [x] 3.1 Pasar en local, guardando el código de salida de cada uno: `bunx turbo run build typecheck test`, Biome con `--error-on-warnings`, `check:dev` y `check:ci`. Verificación: todos terminan en 0.
- [x] 3.2 Pasar los e2e completos de la web con `CI=1`. Verificación: ningún test falla ni sale inestable.

## Workflow follow-up

- Abrir la PR, esperar al CI y fusionar con permiso del usuario.
- Archivar el cambio en una PR aparte con la sincronización de specs.
