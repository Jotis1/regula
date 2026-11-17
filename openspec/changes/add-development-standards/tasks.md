# Tasks

Cada tarea, o cada pieza coherente, va en su propio commit (GIT-005), en el orden de D7: primero los arreglos, después las comprobaciones y al final las normas. Comandos:
- `bunx biome ci .`
- `bunx turbo run build typecheck test`
- `bun run check:ci`
- `bun run check:dev`, desde la tarea 2.1
- `openspec validate add-development-standards --strict`

## 1. Regula al día

- [ ] 1.1 `biome.json` con el bloque de D3: `noExplicitAny` y `noTsIgnore` en `suspicious`, y `noEnum` en `style`, los tres como `error`. Quitar los dos `as any` y sus `biome-ignore` de `packages/react/src/components/SocialButton.tsx` (D6), con un changeset `patch` de `@jotis-me/react`. Comprobar con `bunx biome ci .` y con los tests de `SocialButton`
- [ ] 1.2 Medir primero los errores de `noUncheckedIndexedAccess` en `apps/docs` con `astro check`, contando los `.astro`. Si pasan de unos 60, parar y preguntar (riesgo de D6). Si no, activar el flag y corregir con comprobaciones reales, no con `!`. Comprobar con `bun run --cwd apps/docs typecheck`
- [ ] 1.3 `noUncheckedIndexedAccess` en `examples/astro` y `examples/next`, y sus scripts `typecheck` (`astro check`, con `@astrojs/check` en `devDependencies`, y `tsc --noEmit`). Comprobar que `bunx turbo run typecheck` incluye los dos ejemplos y pasa
- [ ] 1.4 `packages/tokens/tsconfig.json` con `module` y `moduleResolution` en `NodeNext`. Comprobar con `typecheck`, `build`, `check:package` y `scripts/pack.ts`
- [ ] 1.5 JSDoc, en inglés, en los 14 exports sin documentar: `react/src/app-icon`, `react/src/components` y `tokens/src/generate.ts`. Para `generate.ts`, decidir según D6 si se documenta o se mueve fuera de lo público. Si toca código publicado, lleva su changeset `patch`. Comprobar con `typecheck` y `build` de los paquetes

## 2. Comprobaciones

- [ ] 2.1 `scripts/check-dev.ts` y su test `scripts/check-dev.test.ts` (D4), con un fixture que incumple cada punto de «Normas de desarrollo comprobadas». La heurística del JSDoc se prueba con estos casos:
  - un `export const` de varias líneas;
  - un `export async function`;
  - un export precedido de un comentario `//`;
  - un `export { … } from`.

  Script `check:dev` en el `package.json` raíz, y paso «Normas de desarrollo» en «Comprobaciones», detrás de «Normas de CI». Comprobar que `bun run check:dev` pasa en el repo
- [ ] 2.2 `scripts/check-changesets.ts` y su test `scripts/check-changesets.test.ts` (D5), con estos casos:
  - un componente cambiado sin changeset falla;
  - una PR solo de tests pasa;
  - un changeset vacío cubre;
  - un changeset que nombra otro paquete no cubre;
  - la rama `changeset-release/main` sale con 0.

  Paso «Changesets» en el job «Commits». Comprobar con `bun test` y, en local, contra `origin/main`

## 3. Normas

- [ ] 3.1 Cambiar los `order`: `git.yaml` a 7, `ci.yaml` a 8 y `process.yaml` a 9. Las cuatro entradas nuevas van en `STANDARD_AREAS` en el orden de D1. Actualizar el orden fijado en `apps/docs/test/standards.test.ts`, `apps/docs/test/mcp-tools.test.ts` y, si lo fija, `apps/docs/e2e/standards.spec.ts`. Este commit va junto con la 3.2, porque el test exige que `STANDARD_AREAS` y los YAML coincidan
- [ ] 3.2 `stack.yaml`, `code.yaml`, `documentation.yaml` y `versioning.yaml` con las 26 normas de D2. Cada una lleva enunciado, porqué, un ejemplo que la cumple y otro que no, y su verificación. Los ejemplos son los de los escenarios de la spec de `engineering-standards`, y `HER-004` enseña el bloque de D3 completo. Comprobar con `bun run --cwd apps/docs test` (`problemsOf` en verde) y con el build. Comprobar también que `/standards/stack/`, `/standards/code/`, `/standards/documentation/` y `/standards/versioning/` pintan sus normas y que `/standards.json` trae las nueve áreas en orden
- [ ] 3.3 Un test en `mcp-tools.test.ts` con `get_standard` de `VER-002`, y `list_standards` filtrado por `code`. Comprobar con `bun run --cwd apps/docs test`

## 4. Cierre

- [ ] 4.1 Abrir la PR y comprobar en el CI:
  - «Normas de desarrollo» y «Changesets» en verde;
  - «Changesets» pasa porque la PR trae los changesets de 1.1 y 1.5.

  Con una rama de prueba que cambia `packages/react/src/` sin changeset, comprobar que «Changesets» falla y nombra `@jotis-me/react`, y cerrarla sin fusionar
- [ ] 4.2 Pasar los comandos de arriba, actualizar la memoria del proyecto (las áreas nuevas, `check:dev` y «Changesets») y fusionar

## Workflow follow-up

- Archivar con `/opsx:archive` en una PR aparte, solo de `openspec/`.
