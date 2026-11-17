# Design

## Context

Las normas viven en `apps/docs/src/content/standards/*.yaml`, una por área, con el esquema de `apps/docs/src/lib/standards.ts`. `problemsOf` comprueba que cada verificación automática existe de verdad: `ci` busca un job o un paso con ese nombre en `ci.yml`, `biome` busca el texto en `biome.json` y `test` busca el archivo. La página, `/standards.json` y el MCP salen de la fuente sin más trabajo. Hoy hay cinco áreas: NOM (1), IDI (2), GIT (3), INT (4) y PRO (5).

Estado de Regula frente a las normas nuevas, medido el 2026-11-17:

- **Biome.** Usa `recommended`, pero `noExplicitAny` y `noEnum` están en `warn` por defecto y `biome ci` no falla con avisos. Ninguna de las dos reglas aparece en `biome.json`, así que una norma `biome` que las nombre no pasaría `problemsOf`. Hay dos `as any` en `packages/react/src/components/SocialButton.tsx`, suprimidos con `biome-ignore`. No hay ningún `enum`.
- **tsconfig.** Los paquetes y el artefacto ya tienen `noUncheckedIndexedAccess`. La web y el ejemplo Astro extienden `astro/tsconfigs/strict`, que no lo trae, y el ejemplo Next tiene el tsconfig que genera Next. Con el flag, `tsc` da 22 errores en los `.ts` de la web; los `.astro` no se han medido. `tsc --showConfig -p` resuelve los `extends` con TypeScript 7.
- **typecheck.** Los dos ejemplos no tienen script `typecheck`. El ejemplo Astro no depende de `@astrojs/check`.
- **Módulos.** `react` y `assets` compilan con `NodeNext`, pero `tokens` usa el `Bundler` de la base. Su `src/` no tiene imports relativos.
- **JSDoc.** En `src/`, fuera de `internal/` y de los `*.generated.*`, quedan 14 exports sin JSDoc: 11 en `tokens/src/generate.ts`, 2 en `react/src/app-icon` y 1 en `react/src/components`. Los generados de `assets` suman unos 500.
- **Changesets.** `changeset status --since` (v3.0.3) marca un paquete como cambiado con cualquier archivo de su carpeta, tests incluidos. La v3 no trae `changedFilePatterns`.
- **Ya cubiertos.** Hay pasos que cubren normas nuevas: «publint y arethetypeswrong» (ESM y tipos), «Paquetes sin workspace:» (dependencias internas) y `bun install --frozen-lockfile` en todos los jobs. Los README de los tres paquetes existen.

## Goals / Non-Goals

**Goals:**
- 26 normas nuevas en cuatro áreas, con el mismo esquema y la misma calidad de ejemplos que las de CI.
- Toda norma automática con su comprobación en verde en Regula el día que se publica.
- Una sola comprobación nueva para casi todo (`check:dev`), siguiendo el patrón de `check:names` y `check:ci`.

**Non-Goals:**
- Traducir al inglés los comentarios o el JSDoc existentes (eso va en la migración de idioma).
- Pedir JSDoc a los tipos exportados. La norma cubre componentes, funciones, constantes y clases; las props van como DEBERÍA.
- Un paquete de configuración compartida. La guía da el bloque para copiar, como se decidió el 2026-11-16.
- Hooks de Git locales.

## Decisions

### D1. Cuatro áreas, slugs en inglés y prefijos en español

| Archivo | Slug y URL | Título | Prefijo | `order` |
| --- | --- | --- | --- | --- |
| `stack.yaml` | `stack` | Stack y herramientas | `HER` | 3 |
| `code.yaml` | `code` | Código | `COD` | 4 |
| `documentation.yaml` | `documentation` | Documentación | `DOC` | 5 |
| `versioning.yaml` | `versioning` | Versiones y dependencias | `VER` | 6 |

Git pasa a `order: 7`, CI a 8 y Proceso a 9. `STANDARD_AREAS` sigue el mismo orden. Los slugs van en inglés por IDI (URLs en inglés), y los prefijos en español, como `NOM` o `INT`.

Se descartó un área por tema pedido (tests, versionado, dependencias…). Versionado y dependencias van juntas porque las dos tratan lo que el paquete promete a quien lo instala, y la navegación ya tiene nueve entradas.

### D2. Las normas

`appliesTo`: `all`, `app` o `package`. Nivel: DEBE (`must`) o DEBERÍA (`should`). La verificación `ci` apunta al paso «Normas de desarrollo» salvo que se indique otro.

| ID | Nivel | Aplica | Norma | Verificación |
| --- | --- | --- | --- | --- |
| HER-001 | must | app | Next.js o Astro | ci |
| HER-002 | must | all | Bun: `packageManager` exacto, solo `bun.lock`, CI con `bun-version-file` | ci |
| HER-003 | must | all | Biome para lint y formato, sin ESLint ni Prettier, `biome ci .` en el CI | ci |
| HER-004 | must | all | `biome.json` con el bloque de la guía (D3) | ci |
| HER-005 | must | all | build, typecheck y test con `turbo run` | ci |
| HER-006 | should | app | `engines.node` en las apps con `vercel.json` | ci |
| COD-001 | must | all | `strict` y `noUncheckedIndexedAccess` | ci |
| COD-002 | must | all | `typecheck` en cada workspace con TS, ejecutado en el CI | ci |
| COD-003 | must | all | Sin `any` | biome `noExplicitAny` |
| COD-004 | must | all | Sin `@ts-ignore` ni `@ts-nocheck`; supresiones con motivo | ci |
| COD-005 | must | package | ESM con `exports` y tipos correctos | ci «publint y arethetypeswrong» |
| COD-006 | must | package | `NodeNext` e imports relativos con `.js` | ci |
| COD-007 | must | all | Uniones de literales, no `enum` | biome `noEnum` |
| COD-008 | should | all | Exports con nombre; `default` solo donde lo pide el framework | review |
| DOC-001 | must | package | JSDoc en todo export público | ci |
| DOC-002 | should | package | JSDoc y `@default` en las props | review |
| DOC-003 | must | package | README con instalación, uso y enlace a la guía | ci |
| DOC-004 | should | all | README de la raíz con instalar, arrancar, construir y probar | review |
| VER-001 | must | package | SemVer y la lista de lo que rompe | review |
| VER-002 | must | package | Changeset en toda PR que cambia lo publicado | ci «Changesets» |
| VER-003 | should | package | Changeset para quien usa el paquete; migración si rompe | review |
| VER-004 | must | package | Prerreleases en modo pre, nunca bajo `latest` | review |
| VER-005 | must | all | Lockfile en el repo y `--frozen-lockfile` en el CI | ci |
| VER-006 | must | package | Frameworks compartidos en `peerDependencies` | ci |
| VER-007 | should | package | Dependencias 0.x fijadas en `dependencies` y `peerDependencies` | ci |
| VER-008 | must | package | Dependencias internas con `workspace:` y paquete sin `workspace:` | ci «Paquetes sin workspace:» |

`COD-004` va por `check:dev` y no por Biome: Biome tiene `noTsIgnore`, pero no ve `@ts-nocheck` ni el motivo de un `@ts-expect-error`. `noTsIgnore` se activa igualmente en `biome.json`, como parte del bloque de `HER-004`.

`COD-008` y `DOC-002` se quedan en revisión. La web tiene muchos `export default` en islas de React, y las props sin JSDoc (`className`) son demasiadas para meterlas en este cambio. Las dos se pueden endurecer más adelante sin cambiar el ID.

El porqué de `VER-007` cuenta que la norma no aplica a `devDependencies`, porque el lockfile ya fija lo que se instala en el repo. Por eso `^0.18.5` de `@arethetypeswrong/cli` cumple.

### D3. El bloque de Biome

Es lo que se añade sobre `biome init`, y lo que comprueba `HER-004`:

```json
{
	"vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
	"formatter": { "enabled": true, "indentStyle": "tab", "indentWidth": 4, "lineWidth": 110 },
	"linter": {
		"enabled": true,
		"rules": {
			"preset": "recommended",
			"suspicious": { "noExplicitAny": "error", "noTsIgnore": "error" },
			"style": { "noEnum": "error" }
		}
	},
	"assist": { "actions": { "source": { "organizeImports": "on" } } },
	"javascript": { "formatter": { "quoteStyle": "double", "semicolons": "always" } }
}
```

`check:dev` lee `biome.json` como JSON y compara clave a clave; cualquier otra clave es libre. Las normas `biome` (`COD-003` y `COD-007`) nombran `noExplicitAny` y `noEnum`, que entonces aparecen en `biome.json` y pasan `problemsOf`.

### D4. `scripts/check-dev.ts`

Sigue el patrón de `check-ci.ts`: funciones puras que reciben el contenido de los archivos y devuelven problemas (`{ file, rule, message }`), un `main` que lee el repo y sale con 1 si hay alguno, y un test con fixtures por cada punto del requisito «Normas de desarrollo comprobadas». Script `check:dev` en la raíz: `bun test scripts/check-dev.test.ts && bun run scripts/check-dev.ts`. Paso «Normas de desarrollo» en «Comprobaciones», detrás de «Normas de CI».

- **Workspaces.** Salen de `workspaces` del `package.json` raíz. Las apps son las de `apps/*` y `examples/*`, y los paquetes publicados, los que no son `private`.
- **tsconfig.** `bunx tsc --showConfig -p <dir>` por cada workspace con `tsconfig.json`, para leer el resultado con los `extends` resueltos (presets de Astro y de Next incluidos). Es más lento que leer el JSON, pero no hay que reimplementar la resolución de `extends` desde `node_modules`. Para la parte de `NodeNext` se miran `module` y `moduleResolution` del mismo resultado.
- **Supresiones.** Recorre los `.ts`, `.tsx` y `.astro` con `git ls-files`, que respeta el `.gitignore` y deja fuera `dist`, `.astro` y `.next`. Un `@ts-expect-error` necesita texto después, y un `biome-ignore`, texto después de `:`.
- **JSDoc.** En `packages/*/src` de los paquetes publicados, salvo `internal/` y `*.generated.*`, busca líneas `export (async )?(function|const|class)` cuya línea anterior no vacía no cierre un comentario `/** … */`. Es una heurística de líneas, no un análisis con el compilador. La API JS de TypeScript 7 no es estable, y el código de Regula lo formatea Biome, así que la forma de las líneas es predecible. Los `export { … } from` no cuentan, porque reexportan algo que ya lleva su JSDoc donde se define.
- **CI.** Lee `.github/workflows/*.yml` con `Bun.YAML.parse`, como `check-ci`. Comprueba que cada `bun install` lleva `--frozen-lockfile` y que cada `setup-bun` usa `bun-version-file: package.json`.

### D5. `scripts/check-changesets.ts` en lugar de `changeset status`

`changeset status --since` falla en una PR que solo toca tests, y la v3 no deja configurar qué archivos cuentan. El script propio hace esto:
1. Lista los archivos cambiados con `git diff --name-only <base>...<head>`, con las mismas variables de la PR que usa `ci-changes.ts`.
2. Por cada paquete publicado, mira si alguno cae en `src/`, en una entrada de `files` que no sea `dist`, o en el `package.json`.
3. Lee los `.changeset/*.md` añadidos en la PR. Un frontmatter que nombra el paquete lo cubre, y uno vacío (`---\n---`) los cubre todos.
4. Sale con 1 y nombra los paquetes sin cubrir.

Va como paso «Changesets» en el job «Commits», que ya es solo de PR y tiene `fetch-depth: 0`. Así no hace falta un job nuevo ni tocar los `needs` de la puerta. La rama `changeset-release/main` sale temprano con 0, porque el PR de versión borra los changesets a propósito. Test `scripts/check-changesets.test.ts` con los tres escenarios de la spec y el de la rama de versión.

### D6. Cómo se pone Regula al día

- **`biome.json`.** Se añade el bloque de D3. Se quitan los dos `as any` de `SocialButton`: se tipa `rest` según la rama, el enlace o el botón, y si no hay forma limpia, con un `as ButtonProps` estrecho. Esto toca código publicado, así que lleva un changeset `patch` de `@jotis-me/react`.
- **tsconfig.**
  - Se añade `noUncheckedIndexedAccess` a `apps/docs`, `examples/astro` y `examples/next`.
  - Se arreglan los errores con comprobaciones reales (`if (!x) …`, `?.`), no con `!`. Solo se acepta `!` donde un test o el propio código garantizan el índice, y con un comentario.
  - `packages/tokens/tsconfig.json` pasa a `NodeNext` como `react` y `assets`.
- **typecheck.** `examples/astro` gana `"typecheck": "astro check"` y `@astrojs/check` en `devDependencies`, y `examples/next` gana `"typecheck": "tsc --noEmit"`. Turbo ya ejecuta `typecheck` en todos los workspaces que lo tienen.
- **JSDoc.** Se documentan los 14 exports. Los de `tokens/src/generate.ts` se documentan si forman parte de lo que se publica. Si son internos del build, el archivo pasa a `scripts/` o a `src/internal/`, lo que encaje mejor con `tsconfig.build.json`. El JSDoc nuevo va en inglés (IDI-001), aunque el de al lado siga en español hasta la migración.

### D7. Orden de los commits

Primero van los arreglos del código, cada uno con su tipo (`fix`, `build`, `docs`…). Después, las comprobaciones con sus pasos de CI. Al final, las normas en YAML. Así ningún commit publica una norma automática cuya comprobación no exista o esté en rojo, y `problemsOf` pasa en cada commit (GIT-005).

## Risks / Trade-offs

- **[Los `.astro` de la web pueden traer muchos más errores de `noUncheckedIndexedAccess`]** → La tarea mide primero con `astro check`. Si pasan de unos 60, se para y se pregunta antes de seguir, en lugar de llenar el código de `!`.
- **[La heurística del JSDoc puede dar falsos positivos con exports de varias líneas o decoradores]** → El test cubre `export const x = …` de varias líneas, `export async function` y un export precedido de un comentario `//`, que no cuenta como JSDoc. Si aparece un caso real que no encaja, se amplía la heurística; no se añade una lista de excepciones.
- **[`tsc --showConfig` por workspace hace más lento el paso]** → Son ocho workspaces y cada llamada tarda menos de un segundo con TypeScript 7.
- **[Cambiar los `order` mueve Git, CI y Proceso en la navegación]** → Las URLs y los IDs no cambian, y los tests y e2e que fijan el orden se actualizan en el mismo commit.
- **[Un changeset vacío puede usarse para saltarse la norma]** → Es una decisión explícita y visible en la PR, y `VER-002` dice cuándo vale: cuando lo que se cambia no altera lo que recibe quien instala el paquete.

## Migration Plan

Las normas solo añaden comprobaciones al CI de Regula. Las PR abiertas que cambien paquetes publicados sin changeset fallarán en «Changesets» tras el rebase, y se arreglan con `bun run changeset`. No hay cambios en el ruleset, porque los pasos nuevos van dentro de jobs que ya exige la puerta «CI».

## Open Questions

(ninguna)
