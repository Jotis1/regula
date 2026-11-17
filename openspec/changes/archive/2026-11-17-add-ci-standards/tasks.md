# Tasks

Cada tarea, o pieza coherente, va en su propio commit (GIT-005). Comandos: `bunx biome ci .`, `bunx turbo run build typecheck test`, `bun run check:ci` y `openspec validate add-ci-standards --strict`.

## 1. Normas del área de CI

- [x] 1.1 `apps/docs/src/content/standards/ci.yaml` con prefijo `INT`, `order: 4` y las ocho normas de D7. Cada una lleva enunciado, porqué, un ejemplo que la cumple y otro que no, y su verificación. `process.yaml` pasa a `order: 5`. Entrada `{ slug: "ci", label: "CI" }` en `STANDARD_AREAS`, entre Git y Proceso
- [x] 1.2 `GIT-005` en `git.yaml` (D7): commits atómicos, nivel `must`, `appliesTo: all` y verificación de revisión, con ejemplos que cumplen y que no
- [x] 1.3 Comprobar que `standards.test.ts` pasa: el paso «Normas de CI» tiene que existir en `ci.yml`, así que esta tarea se cierra junto con la 2.3. Verificar en el build que `/standards/ci/` pinta las ocho normas y que `/standards.json` trae el área, y con `get_standard INT-003` en el fixture del MCP

## 2. Detección, puerta y `check:ci`

- [x] 2.1 `scripts/ci-changes.ts` (D1): calcula los archivos cambiados de la PR o del push y escribe `code=true|false` en `$GITHUB_OUTPUT`. Test `scripts/ci-changes.test.ts`:
  - solo `openspec/` da `false`;
  - `openspec/` más `.github/workflows/ci.yml` da `true`;
  - sin cambios da `true`;
  - si falla `git diff`, da `true`.
- [x] 2.2 `scripts/check-ci.ts` (D6) y su test `scripts/check-ci.test.ts`, con fixtures de workflows que incumplen cada punto del requisito «Normas de CI comprobadas». Incluye una puerta que no mira `needs.changes.result`, un job fuera de sus `needs` y un `ignoreCommand` con una versión de `turbo` distinta a la del `package.json`. Script `check:ci` en el `package.json` raíz
- [x] 2.3 `ci.yml`, con el reparto de D2:
  - job `changes` con `fetch-depth: 0`;
  - `if: needs.changes.outputs.code == 'true'` en los jobs pesados;
  - job «CI» con `if: always()` y la lógica de D2;
  - paso «Normas de CI» (`bun run check:ci`) en «Comprobaciones».

  Comprobar con `check:ci` en local

## 3. Navegador repartido

- [x] 3.1 Partir «Navegador» en `browser-e2e` (matriz de 3 shards) y `browser-other` según D3, con la subida de resultados por shard y el resumen de Lighthouse en `browser-other`
- [x] 3.2 `turbo.json`: los `outputs` siguen cubriendo `.vercel/output/**` (INT-004). Revisar si algún job nuevo lee algo que Turbo no guarda
- [x] 3.3 Abrir la PR y medir cada shard y `browser-other`. Si alguno pasa de 15 min, ajustar el número de shards o `fullyParallel`. Anotar las medidas en la PR y en `design.md`. Se activó `--fully-parallel`. El desequilibrio que queda entre shards se acepta, porque el tiempo cumple la spec (ver «Medidas» en el diseño)

## 4. Caché remota y despliegue condicionado

- [x] 4.1 Pedir al usuario el token de Vercel (alcance: equipo `jotis-projects-hobby`) como secreto `TURBO_TOKEN`, y crear la variable `TURBO_TEAM`. Añadir los dos al `env` de los jobs que ejecutan Turbo. Comprobar en el log de un shard que el build sale de la caché remota (`cache hit, replaying logs` con `Remote`)
- [ ] 4.2 `apps/docs/vercel.json` con el `ignoreCommand` de D5. Comprobar en Vercel que el despliegue de la PR construye, porque la PR cambia `turbo.json` o el CI. Tras fusionar, comprobar que un commit solo de `openspec/` no construye y que `regula.jotis.me` sigue sirviendo la web

## 5. Cierre

- [x] 5.1 Comprobar los escenarios de «CI de Regula con detección y puerta» con PR reales:
  - una rama de prueba que solo toca `openspec/`, con «CI» en verde en menos de 5 min;
  - una que rompe un test a propósito, con «CI» en rojo.

  Cerrar las dos sin fusionar
- [x] 5.2 Ruleset de `main` (id 26397472) con `gh api`, con el permiso del usuario y en dos pasos (D2): añadir «CI» y después quitar «Comprobaciones» y «Navegador». Verificar con `gh api` que solo queda «CI» y que una PR abierta lo exige
- [x] 5.3 Pasar los comandos de arriba, actualizar la memoria del proyecto y fusionar
