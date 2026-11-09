# Tasks

Comandos: `bun run --cwd apps/docs build`, `bunx biome ci .`, `bunx turbo run typecheck build`, `bun run --cwd apps/docs test` y los e2e de `apps/docs`. Lighthouse no se ejecuta en local: se mira en el CI del PR.

## 1. Medición en el repo

- [x] 1.1 Pasar el script provisional a `apps/docs/scripts/js-weight.ts` (design D3) con su comando `check:js` en `apps/docs/package.json`, sin límites todavía (solo informa). Test en `apps/docs/test/js-weight.test.ts` con un `dist` de prueba mínimo (un HTML con una isla y dos chunks que se importan) que comprueba entradas, imports seguidos, gzip y que los dinámicos van aparte. Verificar que sobre el build actual da los 288 kB gzip de `/` medidos en proposal.md.

## 2. Causa y arreglo del chunk compartido

- [x] 2.1 Confirmar la causa (design D1) con un build por hipótesis y la medición de `/`, y anotar en esta tarea cuál fue. **Causa: ninguna de las tres hipótesis. `CodeSnippet` y `CopyTooltip` se hidrataban como islas importadas directamente de `@jotis-me/react`; Astro apunta su `component-url` al índice del paquete, que pasa a ser punto de entrada, y Rolldown conserva todas las exportaciones de un punto de entrada.** Descartado con builds: el `import *` del Playground (`/` 289,6 kB tras el mapa), `VisualExample` (chunk idéntico sin él) y `sideEffects: false` (idéntico). Verificado cuando un build deja fuera de los archivos que descarga `/` el código de `Carousel`, `CalendarView`, `ColorPicker` y `StreamScene` (búsqueda de sus nombres en los chunks).
- [x] 2.2 Aplicar el arreglo (design D2): islas propias de la web para `CodeSnippet` y `CopyTooltip`, `EmptyState` sin `client:load` y el mapa explícito del `Playground` con su test contra `playground.ts`. Verificar con `check:js` que `/` y `/components/` bajan, que las páginas de componente siguen funcionando (`e2e/playground.spec.ts`, `e2e/components.spec.ts`) y que las capturas aprobadas no cambian (`bun run test:e2e` completo de `apps/docs`). **Hecho: `/` 290→192 kB y `/components/` 290→172 kB gzip (Bun); e2e 836/843, los 6 de `copy.spec.ts` buscaban la isla por `component-export=CopyTooltip` y se cambiaron a `component-url*=CopyTooltipIsland` (pasan); `Select (oscuro)` falla igual en local con el código de `main` (0,0206 frente a 0,02), no lo causa este cambio.**

## 3. Límites en CI

- [x] 3.1 Crear `apps/docs/js-budget.json` con un `default` y las rutas que necesiten más, a partir de lo medido tras el arreglo más un 10 % (design D3), y hacer que `check:js` falle con la página, su peso y su límite. Test: un `dist` de prueba que se pasa del límite hace fallar el comando con ese mensaje.
- [ ] 3.2 Añadir `bun run --cwd apps/docs check:js` al job de CI que construye la web (`.github/workflows/ci.yml`), tras el build y junto a `check:size`. Verificar en el CI del PR que el paso pasa y que Lighthouse da al menos 90 en rendimiento móvil en las cuatro páginas; si no, aplicar design D4 y anotar lo medido.

## Workflow follow-up

- Archivar este cambio antes que `add-minor-variants`, para que el requisito de rendimiento de `docs-site` quede sincronizado primero.
