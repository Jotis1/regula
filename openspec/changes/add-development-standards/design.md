# Design

## Context

Las normas viven en `apps/docs/src/content/standards/*.yaml`, un archivo por área, con el esquema de `apps/docs/src/lib/standards.ts`. `problemsOf` comprueba que cada verificación automática existe de verdad:
- `ci` busca un job o un paso con ese nombre en `ci.yml`;
- `biome` busca el texto en `biome.json`;
- `test` busca el archivo.

La página, `/standards.json` y el MCP salen de la fuente sin más trabajo.

Estado de Regula medido el 2026-11-17 con `biome lint --only=<regla>`, `tsc` y búsquedas en el repo:

| Práctica | Estado hoy |
| --- | --- |
| `biome ci .` | 0 avisos y 4 `info` (`noUselessFragments`). Añadir `--error-on-warnings` no cuesta nada |
| `noExplicitAny` y `noEnum` | En `warn` por defecto. 2 `as any` suprimidos en `SocialButton` y ningún `enum` |
| `noNonNullAssertion`, `useImportType` | 0 casos |
| `noDefaultExport` | 171 casos: 13 configs, 3 archivos de `examples/next/app`, 154 islas de la web y `examples/astro/src/components/Periodo.tsx` |
| `noReExportAll` | 4 casos |
| `noNamespaceImport` | 17 casos. Todos recorren un módulo entero (galerías de iconos, banderas, logos, pagos, cursores; tests que recorren `@jotis-me/react`; composiciones de ejemplos) |
| `noConsole` | 75 casos, todos en `scripts/` |
| `useFilenamingConvention` | 165 `info` con la configuración por defecto, todos archivos en PascalCase (`.astro` y `.tsx` cuyo nombre no coincide con un export) |
| `noUncheckedIndexedAccess` | Lo tienen los paquetes y el artefacto. Faltan la web (22 errores solo en los `.ts`) y los ejemplos |
| `typecheck` | Falta en los dos ejemplos. El de Astro no depende de `@astrojs/check` |
| `NodeNext` | Lo usan `react` y `assets`. `tokens` usa `Bundler`, aunque su `src/` no tiene imports relativos |
| JSDoc de exports | 14 sin JSDoc fuera de `internal/` y de `*.generated.*` |
| JSDoc de props | Unas 300 sin JSDoc en `@jotis-me/react`, a ojo |
| README de la raíz | Tiene instalar, construir y Biome. Le faltan arrancar y probar |
| Changesets | `changeset status --since` (v3.0.3) da por cambiado un paquete con cualquier archivo de su carpeta, y la v3 no trae `changedFilePatterns` |
| Dependabot | No hay `.github/dependabot.yml` |
| IDs antiguos | `NOM-`/`IDI-` aparecen en `ci.yml`, `astro.config.mjs`, `standards.ts`, `mcp/tools.ts`, `check-package-names.ts`, los tests y e2e de normas, MCP y búsqueda, y las specs `docs-site`, `mcp-server` y `engineering-standards` |

`tsc --showConfig -p` resuelve los `extends` con TypeScript 7, presets de Astro incluidos.

## Goals / Non-Goals

**Goals:**
- 37 normas nuevas, una en Nombres (`NAM-003`) y 36 en cuatro áreas nuevas, más los prefijos en inglés. Todo con el esquema y la calidad de ejemplos de las normas de CI.
- Ninguna norma choca con una convención de Next o Astro, y los ejemplos lo demuestran.
- Toda norma automática tiene su comprobación en verde en Regula el día que se publica.

**Non-Goals:**
- Traducir los comentarios y el JSDoc que ya existen en español.
- Knip, `useBlockStatements`, `noBarrelFile`, `exactOptionalPropertyTypes`, `isolatedDeclarations`, `@example` obligatorio y `api-extractor`. Se debatieron y se descartaron.
- Auditoría de dependencias y *provenance*, que van en el cambio de calidad y seguridad.
- Un paquete de configuración compartida: la guía da el bloque para copiar.

## Decisions

### D1. Áreas y prefijos

| Archivo | Slug | Título | Prefijo | `order` |
| --- | --- | --- | --- | --- |
| `naming.yaml` | `naming` | Nombres | `NAM` (antes `NOM`) | 1 |
| `language.yaml` | `language` | Idioma | `LNG` (antes `IDI`) | 2 |
| `stack.yaml` | `stack` | Stack y herramientas | `STK` | 3 |
| `code.yaml` | `code` | Código | `COD` | 4 |
| `documentation.yaml` | `documentation` | Documentación | `DOC` | 5 |
| `versioning.yaml` | `versioning` | Versiones y dependencias | `VER` | 6 |
| `git.yaml` | `git` | Git | `GIT` | 7 |
| `ci.yaml` | `ci` | CI | `INT` | 8 |
| `process.yaml` | `process` | Proceso | `PRO` | 9 |

`GIT`, `INT` (*integration*) y `PRO` (*process*) ya valen en inglés y no cambian. El renombrado no deja alias, como decidió el usuario. Un ID antiguo da el error de norma que no existe. Se hace ahora porque solo los usa Regula, y después de la 1.0 ya no se podría. Versiones y dependencias van en un solo área, porque las dos tratan lo que el paquete promete a quien lo instala.

### D2. Campo `exceptions`

`rule` gana un campo opcional:

```ts
exceptions: z.array(z.object({ where: z.string(), why: z.string() })).optional()
```

La página de cada área pinta las excepciones como una lista bajo el enunciado, y `/standards.json` y `get_standard` las devuelven tal cual. Cuando una norma `biome` tiene excepciones, sus `where` coinciden con los `overrides` del bloque de D4. Un test lo comprueba para `COD-009`, `COD-013` y `NAM-003`.

### D3. Las normas

Todas son de nivel `must`, salvo `STK-006` y `VER-008`, que son `should`. Las de verificación `ci` apuntan al paso «Normas de desarrollo», salvo que la tabla diga otro.

| ID | Aplica | Norma | Verificación |
| --- | --- | --- | --- |
| NAM-003 | all | Archivos: componentes en PascalCase o kebab-case, el resto en kebab-case | biome `useFilenamingConvention` |
| STK-001 | app | Next.js o Astro | ci |
| STK-002 | all | Bun: `packageManager` exacto, solo `bun.lock`, CI con `bun-version-file` | ci |
| STK-003 | all | Biome, sin ESLint ni Prettier | ci |
| STK-004 | all | El bloque de `biome.json`, con las reglas en `error` u `off`, y `biome ci --error-on-warnings` | ci |
| STK-005 | all | build, typecheck y test con `turbo run` | ci |
| STK-006 | app | `engines.node` en las apps con `vercel.json` | ci |
| STK-007 | all | Dependabot semanal, agrupado, con `build(deps)` | ci |
| COD-001 | all | Los siete flags del tsconfig (D5) | ci |
| COD-002 | all | `typecheck` en cada workspace con TS | ci |
| COD-003 | all | Sin `any` | biome `noExplicitAny` |
| COD-004 | all | Sin `!` | biome `noNonNullAssertion` |
| COD-005 | all | Sin `@ts-ignore` ni `@ts-nocheck`, y supresiones con motivo | ci |
| COD-006 | package | ESM con `exports` y tipos correctos | ci «publint y arethetypeswrong» |
| COD-007 | package | `NodeNext` | ci |
| COD-008 | all | Sin `enum` | biome `noEnum` |
| COD-009 | all | Exports con nombre | biome `noDefaultExport` |
| COD-010 | all | `import type` | biome `useImportType` |
| COD-011 | all | Sin `export *` | biome `noReExportAll` |
| COD-012 | all | Sin `import * as`, salvo al recorrer el módulo | biome `noNamespaceImport` |
| COD-013 | all | Sin `console.log` ni `console.debug` fuera de scripts, tests y configs | biome `noConsole` |
| DOC-001 | package | JSDoc en los exports | ci |
| DOC-002 | package | JSDoc en las props, con `@default` | ci |
| DOC-003 | package | `@deprecated` con sustituto | ci |
| DOC-004 | package | README del paquete | ci |
| DOC-005 | all | README de la raíz con instalar, arrancar, construir y probar | ci |
| VER-001 | package | SemVer y lo que rompe | review |
| VER-002 | package | Changeset en toda PR que cambia lo publicado | ci «Changesets» |
| VER-003 | package | Changeset escrito para quien usa el paquete, y migración si rompe | review |
| VER-004 | package | Prerreleases en modo pre, nunca bajo `latest` | review |
| VER-005 | package | `@deprecated` en una menor antes de quitar en la mayor | review |
| VER-006 | all | Lockfile en el repo y `--frozen-lockfile` | ci |
| VER-007 | package | Frameworks en `peerDependencies` | ci |
| VER-008 | package | Dependencias 0.x fijadas | ci |
| VER-009 | package | Internas con `workspace:` y sin `workspace:` al publicar | ci «Paquetes sin workspace:» |
| VER-010 | all | El mismo rango en todo el monorepo | ci |
| VER-011 | package | `sideEffects` declarado | ci |

`COD-005` va por `check:dev`: Biome no ve `@ts-nocheck` ni el motivo de un `@ts-expect-error`. `noTsIgnore` se activa igualmente, dentro del bloque.

`VER-008` no se aplica a `devDependencies`, porque el lockfile ya fija lo que se instala en el repo. Por eso `^0.18.5` de `@arethetypeswrong/cli` cumple.

`VER-010` compara `dependencies` y `devDependencies`. Las `peerDependencies` quedan fuera, porque expresan el rango que se admite y no lo que se instala.

`VER-010` tiene una excepción de framework (D2): `typescript` en los workspaces con `@astrojs/check` o con `next`. `astro check` y `next build` comprueban los tipos con la API de TypeScript 6, que TypeScript 7 (el de la raíz) no tiene. El artefacto no la necesita: comprueba sus tipos con TypeScript 7 sin errores, así que pasa a `^7.0.2`. La excepción se descubrió al escribir `check:dev`, que encontró el conflicto en el repo real.

### D4. El bloque de Biome y sus excepciones de framework

El bloque es lo que se añade sobre `biome init`, y lo que comprueba `STK-004`. Los `overrides` son las excepciones de D2:

```jsonc
{
	"vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
	"formatter": { "enabled": true, "indentStyle": "tab", "indentWidth": 4, "lineWidth": 110 },
	"linter": {
		"enabled": true,
		"rules": {
			"preset": "recommended",
			"suspicious": {
				"noExplicitAny": "error",
				"noTsIgnore": "error",
				"noConsole": { "level": "error", "options": { "allow": ["error", "warn"] } }
			},
			"style": {
				"noEnum": "error",
				"noNonNullAssertion": "error",
				"noDefaultExport": "error",
				"useImportType": "error",
				"useFilenamingConvention": {
					"level": "error",
					"options": { "requireAscii": true, "filenameCases": ["kebab-case"] }
				}
			},
			"performance": { "noReExportAll": "error", "noNamespaceImport": "error" }
		}
	},
	"assist": { "actions": { "source": { "organizeImports": "on" } } },
	"javascript": { "formatter": { "quoteStyle": "double", "semicolons": "always" } },
	"overrides": [
		{
			// Next importa estos archivos por su export por defecto, y los configs se cargan igual
			"includes": [
				"**/app/**/page.tsx", "**/app/**/layout.tsx", "**/app/**/template.tsx",
				"**/app/**/loading.tsx", "**/app/**/error.tsx", "**/app/**/global-error.tsx",
				"**/app/**/not-found.tsx", "**/app/**/default.tsx",
				"**/app/**/opengraph-image.tsx", "**/app/**/icon.tsx",
				"**/app/**/sitemap.ts", "**/app/**/robots.ts", "**/app/**/manifest.ts",
				"**/*.config.ts", "**/*.config.mts", "**/*.config.mjs", "**/*.config.js"
			],
			"linter": { "rules": { "style": { "noDefaultExport": "off" } } }
		},
		{
			// Componentes: PascalCase o kebab-case (rutas de Next y páginas de Astro, como page.tsx o [slug].astro)
			"includes": ["**/*.tsx", "**/*.astro"],
			"linter": { "rules": { "style": { "useFilenamingConvention": {
				"level": "error",
				"options": { "requireAscii": true, "filenameCases": ["PascalCase", "kebab-case"] }
			} } } }
		},
		{
			// En los scripts y los tests la consola es la salida del programa
			"includes": ["**/scripts/**", "**/test/**", "**/e2e/**", "**/*.config.*"],
			"linter": { "rules": { "suspicious": { "noConsole": "off" } } }
		}
	]
}
```

Hay que comprobar tres cosas al implementar:
- si Biome 2.6 acepta llaves (`{page,layout}`) en `includes`. Si las acepta, se acorta la lista; si no, se queda como está;
- que `useFilenamingConvention` acepta los segmentos dinámicos (`[slug]`, `[...slug]`, `[[...slug]]`) y los nombres con puntos (`astro.config.mjs`, `button.test.tsx`);
- que `useImportType` no da falsos positivos en el frontmatter de `.astro`. Si los da, se apaga en `**/*.astro`, como ya pasa con `noUnusedImports`, y esa excepción se añade a `COD-010`.

`check:dev` lee `biome.json` como JSON. Falla si falta una clave del bloque, si alguna regla vale `"warn"` o `{ "level": "warn" }`, en cualquier parte del archivo, o si el paso «Biome» de `ci.yml` no lleva `--error-on-warnings`. Las demás claves son libres. Así `problemsOf` encuentra en `biome.json` los nombres de las reglas de las normas `biome`.

Las excepciones de Regula que no son de framework (`.astro` con `noUnusedImports`, carpetas ignoradas) siguen en `biome.json`, fuera del bloque.

### D5. Flags del tsconfig

`strict`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch` y `verbatimModuleSyntax`. En Regula:
- **Paquetes:** se añaden en `tsconfig.base.json`.
- **Web y ejemplo Astro:** en su tsconfig, sobre `astro/tsconfigs/strict`.
- **Ejemplo Next:** en su tsconfig. Next solo añade claves a ese archivo, no las quita.
- **Artefacto:** en el suyo, que no extiende la base.

`erasableSyntaxOnly` también prohíbe `namespace` y las *parameter properties*. Ninguna se usa hoy, y encaja con el *type stripping* de Node y de Bun. Se descartaron `exactOptionalPropertyTypes`, que choca con los tipos de React y react-aria, e `isolatedDeclarations`, que pide tipar a mano el retorno de todos los exports.

### D6. `scripts/check-dev.ts`

Sigue el patrón de `check-ci.ts`: funciones puras que reciben el contenido y devuelven `{ file, rule, message }`, un `main` que lee el repo y sale con 1 si hay problemas, y un test con un fixture por cada punto de los requisitos «… comprobadas». Script `check:dev`: `bun test scripts/check-dev.test.ts && bun run scripts/check-dev.ts`. Paso «Normas de desarrollo» en «Comprobaciones», detrás de «Normas de CI».

- **Workspaces:** salen de `workspaces` del `package.json` raíz. Son apps los de `apps/*` y `examples/*`, y paquetes publicados los que no son `private`.
- **tsconfig:** `bunx tsc --showConfig -p <dir>` por cada workspace con `tsconfig.json`. Del mismo resultado salen los flags de D5 y el `module` y el `moduleResolution` de `COD-007`.
- **Supresiones:** recorre los `.ts`, `.tsx`, `.astro`, `.mjs` y `.js` de `git ls-files`. Un `@ts-expect-error` necesita texto detrás, y un `biome-ignore`, texto detrás de `:`. `@ts-ignore` y `@ts-nocheck` fallan siempre.
- **JSDoc:** se aplica a `packages/*/src` de los publicados, salvo `internal/` y `*.generated.*`. Es una heurística de líneas, porque la API JS de TypeScript 7 no es estable y Biome formatea el código, así que la forma de las líneas es predecible:
  - un export (`export (async )?(function|const|class)`) necesita que su línea anterior no vacía cierre un `/** … */`;
  - una prop (cualquier miembro de una `interface` o de un `type` objeto declarado en el nivel superior, exportado o no) también: `ButtonBase` no se exporta y sus props llegan a la ficha a través de `ButtonProps`. Una línea `//` entre el JSDoc y el miembro no lo rompe;
  - un `@deprecated` necesita texto en su misma línea;
  - los `export { … } from` no cuentan.
- **README:** los de paquete necesitan `https://regula.jotis.me`. El de la raíz necesita, en sus bloques de código, una línea con `install` y otras con `dev`, `build` y `test`.
- **Dependencias:** recorre los `package.json` de los workspaces y aplica `VER-007`, `VER-008`, `VER-010` (con su excepción de `typescript`) y `VER-011`.
- **Supresiones:** solo cuenta una directiva que abre un comentario (`// @ts-ignore`, `{/* @ts-expect-error … */}`). Las mismas palabras dentro de una cadena o de una frase no cuentan, así que los tests del propio script no se marcan a sí mismos.
- **Biome:** una regla en `"warn"` se busca en todo `biome.json`, salvo dentro de un array: `allow: ["error", "warn"]` de `noConsole` son valores de la opción, no un nivel.
- **CI y Dependabot:** lee `.github/workflows/*.yml` y `.github/dependabot.yml` con `Bun.YAML.parse`, como `check-ci`. Comprueba:
  - que todo `bun install` lleva `--frozen-lockfile`;
  - que todo `setup-bun` usa `bun-version-file`;
  - que Dependabot tiene los ecosistemas `bun` y `github-actions`, `weekly`, un grupo de `minor`/`patch` y el prefijo `build`.

### D7. `scripts/check-changesets.ts`

Se hace un script propio porque `changeset status --since` falla en una PR que solo toca tests, y la v3 no deja elegir qué archivos cuentan. Funciona así:
1. Lista los archivos cambiados con `git diff --name-only <base>...<head>`, con las mismas variables de la PR que `ci-changes.ts`.
2. Por cada paquete publicado, mira si cambia `src/`, una entrada de `files` que no sea `dist`, o el `package.json`. Del `package.json` compara el JSON de la base con el de la PR, sin `devDependencies` ni `scripts`, así que una subida de Dependabot solo de desarrollo no pide changeset.
3. Lee los `.changeset/*.md` añadidos en la PR. Un frontmatter que nombra el paquete lo cubre, y uno vacío los cubre todos.
4. Sale con 1 y nombra los paquetes sin cubrir.

Va como paso «Changesets» en el job «Commits», que ya es solo de PR y tiene `fetch-depth: 0`, así que no hace falta tocar los `needs` de la puerta. La rama `changeset-release/main` sale con 0.

### D8. Dependabot

```yaml
version: 2
updates:
    - package-ecosystem: bun
      directory: /
      schedule: { interval: weekly }
      groups:
          minor-patch: { update-types: [minor, patch] }
      commit-message: { prefix: build, include: scope }
    - package-ecosystem: github-actions
      directory: /
      schedule: { interval: weekly }
      groups:
          minor-patch: { update-types: [minor, patch] }
      commit-message: { prefix: build, include: scope }
```

Las versiones mayores llegan en PR sueltas, porque cada una puede romper algo y necesita su propia revisión. Los commits salen como `build(deps): …` y `build(deps-dev): …`: cumplen GIT-001, y la excepción de idioma del bot queda en `LNG-001`. Las PR de Dependabot no reciben `TURBO_TOKEN`, y el CI construye sin caché remota (INT-006). Si una PR sube una dependencia publicada, «Changesets» falla hasta que alguien le añade el changeset. Es lo que pide `VER-002`: quien instala el paquete recibe una dependencia nueva.

### D9. Cómo se pone Regula al día

- **IDs:** se cambian `NOM-`/`IDI-` en los YAML, en las referencias de la tabla de contexto y en las specs vivas, a través de las deltas de este cambio. Los cambios archivados no se tocan.
- **Exports por defecto:** las 154 islas de la web y `Periodo.tsx` pasan a exports con nombre, y sus imports en `.astro` y `.mdx` cambian con ellos. Los 13 configs y los 3 archivos de Next quedan cubiertos por el override.
- **`import * as`:** los 17 casos recorren un módulo, así que llevan `biome-ignore lint/performance/noNamespaceImport: <motivo>`. Si un caso no recorre el módulo, pasa a imports con nombre.
- **Nombres de archivo:** se renombran los que no cumplan con los overrides de D4, y sus imports con ellos. Hay que medirlo con la regla ya configurada, porque los 165 avisos de hoy salen de la configuración por defecto.
- **`console`:** nada que cambiar, porque los 75 casos están en `scripts/`.
- **`noReExportAll`:** los 4 `export *` reexportaban ~500 componentes generados de `@jotis-me/assets`, así que no se podían escribir a mano. Decidido con el usuario: `scripts/generate.ts` escribe también las entradas `logos.ts`, `payments.ts` y `cursors.ts`, con un `export { … } from` por módulo y un nombre por línea. Son código generado y Biome las ignora (`!packages/assets/src/{logos,payments,cursors}.ts`), como a `*.generated.*`. La API no cambia: 344, 113 y 51 exports en `dist`, como antes.
- **`@ts-nocheck`:** `check:dev` encontró uno en `scripts/artifact/src/entry.ts`. Sobraba, porque el tsconfig del artefacto ya excluye ese archivo; se quitó.
- **`useFilenamingConvention`:** con la configuración de D4, el repo solo incumplía en 2 archivos, ambos `InlineCTA.tsx` (los 165 avisos de antes salían de la configuración por defecto). Se resolvió con `strictCase: false`, que admite las siglas, en lugar de renombrar el archivo y separarlo del nombre del componente publicado.
- **TypeScript:** los errores de los flags nuevos se arreglan con comprobaciones reales, no con `!` (que ahora prohíbe `COD-004`). No hay umbral para parar: el usuario acepta el trabajo que salga.
- **`typecheck`:** `examples/astro` gana `astro check` y `@astrojs/check`, y `examples/next` gana `tsc --noEmit`.
- **`NodeNext`:** `packages/tokens/tsconfig.json` pasa a `NodeNext`.
- **JSDoc:** se documentan, en inglés (LNG-001), 538 props de `@jotis-me/react` (la medición real; el «unas 300» de antes era una estimación a ojo) y los exports que faltaban.
  - `tokens/src/generate.ts` es código del build, no se publica: pasa a `scripts/generate.ts`. Lo publicado de `tokens` son los `index.js` e `index.d.ts` que genera, así que su JSDoc va en las plantillas del generador.
  - El resultado llega a la ficha de la guía y al MCP (`get_component`), que ya leían los comentarios en español: durante un tiempo, la tabla de props mezcla descripciones nuevas en inglés con las anteriores en español, hasta la migración de idioma.
  - Las descripciones de los 119 archivos se escribieron comprobando el código de cada componente cuando el nombre no bastaba (rangos, qué texto sustituye cada etiqueta, qué parte de la interfaz es), y salen en commits por grupo de componentes del catálogo.
- **README:** el de la raíz gana los comandos de arrancar la web y de probar.
- **Changesets:** los cambios en paquetes publicados llevan changesets `patch`.

### D10. Orden de los commits

Cada pieza va en su propio commit (GIT-005). El orden es:
1. El renombrado de prefijos con el campo `exceptions`.
2. Los arreglos, de uno en uno por regla o por flag. Cada regla de Biome entra en `biome.json` en el mismo commit que deja el repo limpio para ella.
3. Dependabot.
4. `check:dev` y «Changesets».
5. Las normas nuevas en YAML.

Así ningún commit publica una norma automática sin su comprobación en verde, y `problemsOf` pasa en todos.

## Risks / Trade-offs

- **[El trabajo es grande: ~155 exports, ~300 props, renombrados de archivos y los errores de cuatro flags]** → Va en muchos commits pequeños, uno por regla, así que la PR se revisa por partes. Si alguna parte se alarga demasiado, se puede partir en otra PR sin romper el orden de D10.
- **[Renombrar archivos o exports de la web rompe imports]** → `astro check`, los tests y los e2e lo detectan. Cada renombrado va con su build.
- **[La heurística del JSDoc puede fallar con formas raras]** → El test cubre exports de varias líneas, `export async function`, comentarios `//` (que no cuentan), `export { … } from` y props opcionales y de solo lectura. Si aparece un caso real que no encaja, se amplía la heurística. No se añade una lista de excepciones.
- **[El soporte de Dependabot para Bun con workspaces, o para el `bun.lock` de texto]** → Se comprueba en la primera PR de Dependabot. Si no actualiza los workspaces, se pasa a `directories` con cada carpeta. Si no puede con el lockfile, se para y se avisa al usuario.
- **[El cuerpo de los commits de Dependabot puede superar `footer-max-line-length`]** → Se mira en la primera PR. Si falla, se desactiva esa regla en `.commitlintrc.json`, como ya está `body-max-line-length`.
- **[Dependabot puede subir una dependencia en un solo workspace y romper `VER-010`]** → En una PR agrupada suele subirla en todos. Si no, la PR falla en «Normas de desarrollo» y se arregla a mano. Es lo que tiene que pasar.
- **[El renombrado sin alias rompe enlaces externos a `#nom-001`]** → Solo los usa Regula, y el usuario lo aceptó.

## Migration Plan

Las PR abiertas al fusionar tendrán que rebasar. Las que cambien paquetes publicados sin changeset fallarán en «Changesets» y se arreglan con `bun run changeset`. El ruleset no cambia, porque los pasos nuevos van dentro de jobs que ya exige la puerta «CI». Dependabot empieza a abrir PR la semana siguiente a la fusión.

## Open Questions

(ninguna)
