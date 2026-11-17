# Tasks

Cada tarea, o cada pieza coherente, va en su propio commit (GIT-005), en el orden de D10. Cada regla de Biome entra en `biome.json` en el mismo commit que deja el repo limpio para ella.

Comandos:
- `bunx biome ci --error-on-warnings .`
- `bunx turbo run build typecheck test`
- `bun run check:ci`
- `bun run check:dev`, desde la tarea 5.1
- `openspec validate add-development-standards --strict`

## 1. Prefijos en inglés y excepciones

- [x] 1.1 Añadir el campo `exceptions` al esquema de `standards.ts` (D2). La página del área lo pinta bajo el enunciado, y `/standards.json` y `get_standard` lo devuelven. Comprobar con un test del esquema y con el build
- [x] 1.2 Renombrar `NOM-00x` a `NAM-00x` e `IDI-00x` a `LNG-00x`, con los prefijos de los dos YAML. Cambiar también sus referencias:
  - `ci.yml`, `astro.config.mjs`, `standards.ts`, `mcp/tools.ts` y `check-package-names.ts`;
  - los tests y e2e de normas, MCP y búsqueda.

  En `LNG-001`, añadir la excepción de los bots. Comprobar:
  - que no queda ningún `NOM-`/`IDI-` fuera de `openspec/changes/archive`;
  - que `get_standard` con `NOM-001` da el error de norma que no existe;
  - que pasan los tests y los e2e de normas.

## 2. Biome

- [x] 2.1 `--error-on-warnings` en el paso «Biome» de `ci.yml`. Comprobar `bunx biome ci --error-on-warnings .` en local
- [x] 2.2 `noExplicitAny`, `noTsIgnore` y `noEnum` en `error`. Quitar los dos `as any` y sus `biome-ignore` de `SocialButton` (D9), con un changeset `patch` de `@jotis-me/react`. Comprobar con Biome y con los tests de `SocialButton`
- [x] 2.3 `noNonNullAssertion` y `useImportType` en `error`. Ver si `useImportType` da falsos positivos en `.astro` y, si los da, apagarla allí y anotarlo para la excepción de `COD-010` (D4). Comprobar con Biome
- [x] 2.4 `noDefaultExport` en `error`, con el override de Next y de los configs de D4. Antes, comprobar si `includes` acepta llaves. Pasar a exports con nombre las 154 islas de la web y `examples/astro/src/components/Periodo.tsx`, con sus imports. Comprobar:
  - con Biome;
  - con `bun run --cwd apps/docs typecheck` y el build;
  - que `examples/next/app/*` no da ningún diagnóstico;
  - con los e2e de la web.
- [x] 2.5 `noReExportAll` y `noNamespaceImport` en `error`. Pasar a exports con nombre los 4 `export *`. Los 17 `import * as` que recorren un módulo llevan su `biome-ignore` con motivo (D9). Comprobar con Biome, con `typecheck` y con `build`
- [x] 2.6 `noConsole` con `allow: ["error", "warn"]` y su override para scripts, tests, e2e y configs. Comprobar con Biome
- [x] 2.7 `useFilenamingConvention` con los dos niveles de D4. Comprobar antes que acepta `[slug]`, `[...slug]` y los nombres con puntos. Medir con la regla configurada y renombrar lo que no cumpla, con sus imports. Comprobar con Biome, con `typecheck`, con el build de la web y de los ejemplos y con los e2e

## 3. TypeScript

- [x] 3.1 `noUncheckedIndexedAccess` en `apps/docs`, `examples/astro` y `examples/next`. Corregir los errores con comprobaciones reales, sin `!` (D9). Comprobar con el `typecheck` de cada uno
- [x] 3.2 `erasableSyntaxOnly`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch` y `verbatimModuleSyntax` en todos los tsconfig (D5), y corregir lo que salga. Comprobar con `bunx turbo run typecheck`
- [ ] 3.3 Scripts `typecheck` en los ejemplos: `astro check`, con `@astrojs/check` en `devDependencies`, y `tsc --noEmit`. Comprobar que `bunx turbo run typecheck` incluye los dos y pasa
- [ ] 3.4 `packages/tokens/tsconfig.json` con `NodeNext`. Comprobar con `typecheck`, `build`, `check:package` y `scripts/pack.ts`

## 4. Documentación y dependencias

- [ ] 4.1 JSDoc, en inglés, en los 14 exports sin documentar. Para `tokens/src/generate.ts`, decidir según D9. Changeset `patch` en los paquetes que cambien. Comprobar con `typecheck` y `build`
- [ ] 4.2 JSDoc en todas las props de `@jotis-me/react`, con `@default` donde haya valor por defecto, y en las de `@jotis-me/assets` que no estén generadas. Va en varios commits, por grupos de componentes, con un changeset `patch`. Comprobar con `typecheck`, y con la ficha de un componente en `get_component`: la descripción de la prop sale del JSDoc
- [ ] 4.3 README de la raíz con los comandos de arrancar la web y de probar. Comprobar que ejecutar los comandos tal como están escritos funciona
- [ ] 4.4 `.github/dependabot.yml` de D8. Comprobar que el YAML es válido con `Bun.YAML.parse`. Tras fusionar, comprobar con la primera PR de Dependabot los riesgos de D8: los workspaces, el lockfile, `footer-max-line-length` y «Changesets»

## 5. Comprobaciones

- [ ] 5.1 `scripts/check-dev.ts` y su test `scripts/check-dev.test.ts` (D6), con un fixture que incumple cada punto de los requisitos «… comprobadas». La heurística del JSDoc se prueba con:
  - un `export const` de varias líneas;
  - un `export async function`;
  - un comentario `//`;
  - un `export { … } from`;
  - props opcionales y `readonly`.

  Script `check:dev` y paso «Normas de desarrollo» en «Comprobaciones», detrás de «Normas de CI». Comprobar que `bun run check:dev` pasa en el repo
- [ ] 5.2 `scripts/check-changesets.ts` y su test (D7), con estos casos:
  - un componente cambiado sin changeset;
  - una PR solo de tests;
  - un changeset vacío;
  - un changeset de otro paquete;
  - un `package.json` que solo cambia `devDependencies`;
  - uno que cambia `dependencies`;
  - la rama `changeset-release/main`.

  Paso «Changesets» en el job «Commits». Comprobar con `bun test` y, en local, contra `origin/main`

## 6. Normas

- [ ] 6.1 Los `order` de D1, las cuatro entradas nuevas de `STANDARD_AREAS` y los YAML `stack.yaml`, `code.yaml`, `documentation.yaml` y `versioning.yaml`, más `NAM-003` en `naming.yaml`: las 38 normas de D3. Cada una lleva:
  - enunciado, porqué, un ejemplo que la cumple y otro que no, y su verificación;
  - sus `exceptions` cuando las tenga. Las de `COD-009`, `COD-013` y `NAM-003` coinciden con los `overrides` de D4, y `COD-012` lleva la del código que recorre un módulo.

  `STK-004` enseña el bloque de D4 completo. Los ejemplos son los de los escenarios de la spec. Actualizar el orden fijado en `standards.test.ts`, `mcp-tools.test.ts` y, si lo fija, `standards.spec.ts`. Comprobar:
  - con `bun run --cwd apps/docs test`, con `problemsOf` en verde;
  - con el build;
  - que las cuatro páginas nuevas pintan sus normas y sus excepciones;
  - que `/standards.json` trae las nueve áreas en orden.
- [ ] 6.2 Un test que compara los `where` de las excepciones de las normas `biome` con los `overrides` de `biome.json` (D2). Más tests en `mcp-tools.test.ts`:
  - `get_standard` con `COD-009` devuelve sus excepciones;
  - `get_standard` con `VER-002`;
  - `list_standards` filtrado por `code`.

  Comprobar con `bun run --cwd apps/docs test`

## 7. Cierre

- [ ] 7.1 Abrir la PR y comprobar que en el CI pasan «Normas de desarrollo», «Changesets» y «Biome» con `--error-on-warnings`. Probar también con una rama que cambia `packages/react/src/` sin changeset: «Changesets» tiene que fallar y nombrar `@jotis-me/react`. Cerrarla sin fusionar
- [ ] 7.2 Pasar los comandos de arrancar, actualizar la memoria del proyecto (los prefijos nuevos, las áreas, `check:dev`, «Changesets» y Dependabot) y fusionar

## Workflow follow-up

- Archivar con `/opsx:archive` en una PR aparte, solo de `openspec/`.
- Revisar la primera PR de Dependabot (tarea 4.4).
