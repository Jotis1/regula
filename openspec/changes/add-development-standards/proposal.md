# Proposal

## Why

Las decisiones del 2026-11-16 fijaron el stack de la suite (Next o Astro, con Bun, Biome, Turbo y changesets) y que la guía diría qué añadir sobre lo que genera cada framework. Hoy nada de eso está escrito como norma, así que cada proyecto nuevo lo decide de memoria. Regula tampoco lo cumple del todo:

- `noExplicitAny` está en `warn`, y `biome ci` no falla con avisos. Por eso `SocialButton` tiene dos `as any`;
- la web y los ejemplos no tienen `noUncheckedIndexedAccess`, y los ejemplos no tienen `typecheck`;
- hay 155 `export default` fuera de los archivos que el framework lo pide, y unas 300 props sin JSDoc;
- nada comprueba que una PR que cambia un paquete publicado traiga su changeset, y las dependencias se actualizan a mano.

Este cambio es el 3 de la hoja de ruta, «normas de desarrollo». Escribe las normas tras revisar las buenas prácticas con el usuario, las publica en la guía, en `/standards.json` y en el MCP, y hace que Regula las cumpla. La idea es subir el listón: si cuesta más trabajo, se asume.

## What Changes

- **Prefijos en inglés.** `NOM` pasa a `NAM` y `IDI` a `LNG`, sin alias. `GIT`, `INT` y `PRO` ya valen en inglés. Los IDs serán estables a partir de la 1.0.
- **Normas compatibles con los frameworks.** Ninguna norma puede chocar con una convención de Next o de Astro. Cuando un framework pide otra cosa, como el `export default` de `page.tsx`, la norma lo lista en un campo nuevo, `exceptions`, y la configuración lo aplica. Los dos ejemplos de Regula sirven de prueba.
- **Nombres:** una norma nueva sobre los nombres de archivo. Los componentes van en PascalCase y el resto en kebab-case.
- **Áreas nuevas:**
  - **Stack y herramientas** (`STK`):
    - Next.js o Astro;
    - Bun;
    - Biome sin ESLint ni Prettier;
    - el bloque de `biome.json`, con las reglas en `error` u `off` y nunca en `warn`;
    - Turbo;
    - `engines.node`;
    - Dependabot semanal y agrupado.
  - **Estructura** (`STR`), para que cualquier proyecto de la suite se navegue igual:
    - el monorepo en `apps/`, `packages/`, `examples/` y `scripts/`;
    - cada workspace con `src/`, `test/`, `e2e/` y `scripts/`, sin tests dentro de `src/`;
    - las apps de Next en `src/app/`, como las de Astro en `src/`;
    - en el `src/` de una app, solo las carpetas del framework, las compartidas por tipo (`components/`, `hooks/`, `lib/`, `styles/`, `data/`) y `features/<nombre>/`;
    - lo que usa una sola funcionalidad vive en su carpeta, y lo que usan dos o más sube a la compartida;
    - en un paquete, las entradas en la raíz de `src/` y lo privado en `src/internal/`;
    - ni builds ni cachés en Git;
    - un componente por archivo, con el nombre de su export.
  - **Código** (`COD`):
    - el tsconfig con `strict`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch` y `verbatimModuleSyntax`;
    - `typecheck` en todos los workspaces;
    - sin `any` ni `!`;
    - las supresiones con motivo;
    - los paquetes son ESM y compilan con `NodeNext`;
    - sin `enum`;
    - exports con nombre;
    - `import type`;
    - sin `export *` ni `import * as`;
    - sin `console` en `src/`;
    - lo simple primero (KISS);
    - lo nativo primero: elementos HTML y APIs de la plataforma antes que una dependencia o código propio.
  - **Documentación** (`DOC`):
    - JSDoc en los exports y en las props, con `@default`;
    - el README de cada paquete y el de la raíz;
    - `@deprecated` dice qué usar en su lugar.
  - **Versiones y dependencias** (`VER`):
    - SemVer y lo que rompe;
    - changesets, escritos para quien usa el paquete;
    - prerreleases;
    - deprecar antes de quitar;
    - el lockfile congelado en el CI;
    - los frameworks en `peerDependencies`;
    - las dependencias 0.x fijadas;
    - `workspace:` para las internas;
    - la misma versión en todo el monorepo;
    - `sideEffects` declarado.
- **Idioma:**
  - los commits y las ramas que generan los bots (Dependabot) quedan fuera de la norma del idioma. Siguen cumpliendo Conventional Commits;
  - una norma nueva de tipografía, `LNG-005`: ni el punto medio («·») ni las rayas («—» y «–») en ningún texto del repo ni en los commits. En su lugar va el guión simple («-»).
- **Formato:** la norma del bloque de Biome dice de forma explícita la sangría (tabuladores de ancho 4), el largo de línea, las comillas y el punto y coma.
- **Proceso:** una norma nueva, `PRO-003`, para lo que no tiene norma: se decide con un orden (lo que busca la norma más cercana, la convención del framework, lo que ya hace el repo y lo más simple), se anota en la PR y, cuando el caso se repite, se propone la norma.
- **Orden de las áreas:** Nombres, Idioma, Stack, Estructura, Código, Documentación, Versiones, Git, CI y Proceso.
- **Regula las cumple:**
  - un script nuevo, `check:dev` (paso «Normas de desarrollo»), y otro de changesets (paso «Changesets»);
  - `biome ci --error-on-warnings` y el bloque de Biome, con las excepciones de cada framework;
  - todos los tsconfig con los flags y su `typecheck`;
  - los exports con nombre, el JSDoc de exports y props, y el README de la raíz completo;
  - `.github/dependabot.yml`.
- **BREAKING** para quien enlace o consulte normas por ID: `NOM-00x` y `IDI-00x` dejan de existir.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `engineering-standards`:
  - prefijos en inglés y el campo de excepciones;
  - compatibilidad con los frameworks y orden de las áreas;
  - la norma de nombres de archivo, la excepción de los bots en el idioma y la norma de tipografía;
  - las cuatro áreas nuevas.
- `standards-compliance`:
  - `check:dev` y la comprobación de changesets;
  - Biome sin avisos;
  - los tsconfig y `typecheck`, y los ejemplos como prueba de compatibilidad;
  - los exports documentados;
  - la tipografía de los archivos y de los commits;
  - Dependabot.
- `docs-site`: el escenario de buscar una norma usa `NAM-001`.
- `mcp-server`: los escenarios que nombran `NOM-001` y `NOM-999` pasan a `NAM-*`.

## Impact

- **Normas:** `apps/docs/src/content/standards/`, con cuatro YAML nuevos, los IDs renombrados en `naming.yaml` y `language.yaml`, y los `order` nuevos. También el esquema `standards.ts` (campo `exceptions`, que la página y el JSON enseñan), `STANDARD_AREAS` y las referencias a los IDs antiguos:
  - `ci.yml` y `astro.config.mjs`;
  - `mcp/tools.ts` y `check-package-names.ts`;
  - los tests y e2e de normas, MCP y búsqueda.
- **Scripts y CI:** `scripts/check-dev.ts` y `scripts/check-changesets.ts`, con sus tests. `ci.yml`, con los pasos nuevos y `--error-on-warnings`. Un `.github/dependabot.yml` nuevo.
- **Configuración:** `biome.json`, todos los `tsconfig.json`, y los `package.json` de los ejemplos (`typecheck` y `@astrojs/check`).
- **Código:**
  - las islas de la web pasan a exports con nombre;
  - los errores de los flags nuevos de TS;
  - los `as any` y los `import * as`;
  - los nombres de archivo;
  - el JSDoc de exports y props;
  - el README raíz;
  - los «·», «—» y «–» de la guía, de los comentarios, del JSDoc, de los tests y de los textos de los componentes.
- **Paquetes publicados:** la API no cambia. El JSDoc y los arreglos internos llevan changesets `patch`. Algunos textos que pintan los componentes cambian de separador (`10:00-11:00`, `Donación - 5,00 €`), también con un `patch`.
- **Fuera de alcance:**
  - traducir los comentarios y el JSDoc en español que ya existen (va en la migración de idioma);
  - Knip;
  - tests y seguridad (`bun audit` y *provenance*);
  - SEO, accesibilidad, i18n, rendimiento e IA.
