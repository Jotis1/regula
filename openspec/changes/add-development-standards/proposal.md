# Proposal

## Why

Las decisiones del 2026-11-16 fijaron el stack de la suite (Next o Astro, con Bun, Biome, Turbo y changesets) y que la guía diría qué añadir sobre lo que genera cada framework. Hoy nada de eso está escrito como norma, así que cada proyecto nuevo lo decide de memoria. Regula tampoco lo cumple del todo:

- `noExplicitAny` está en `warn` y `biome ci` no falla con avisos, así que hay dos `as any` en `SocialButton`;
- la web y los ejemplos no tienen `noUncheckedIndexedAccess`. Solo en los `.ts` de la web saldrían 22 errores;
- los ejemplos no tienen `typecheck`;
- nada comprueba que una PR que cambia un paquete publicado traiga su changeset.

Este cambio es el 3 de la hoja de ruta, «normas de desarrollo». Escribe las normas, las publica en la guía, en `/standards.json` y en el MCP, y hace que Regula las cumpla.

## What Changes

- Cuatro áreas nuevas de normas. Los prefijos son tres letras en español, como `NOM` o `INT`:
  - **Stack y herramientas** (`HER`, `/standards/stack/`):
    - las apps usan Next.js o Astro;
    - Bun es el gestor y el runtime de los scripts, con la versión exacta en `packageManager` y solo `bun.lock`;
    - Biome hace el lint y el formato, sin ESLint ni Prettier;
    - `biome.json` parte del bloque de la guía;
    - Turbo ejecuta build, typecheck y test;
    - las apps desplegadas declaran `engines.node`.
  - **Código** (`COD`, `/standards/code/`):
    - `strict` y `noUncheckedIndexedAccess` sobre el tsconfig del framework;
    - un `typecheck` por workspace que el CI ejecuta;
    - sin `any`;
    - las supresiones (`biome-ignore`, `@ts-expect-error`) nombran la regla y el motivo, y no se usan `@ts-ignore` ni `@ts-nocheck`;
    - los paquetes publicados son ESM bien tipado y compilan con `NodeNext`;
    - uniones de literales en lugar de `enum`;
    - exports con nombre.
  - **Documentación** (`DOC`, `/standards/documentation/`):
    - JSDoc en todo export público de un paquete publicado;
    - JSDoc y `@default` en las props;
    - un README por paquete con instalación, uso y enlace a la guía;
    - un README del repo que dice cómo arrancar, construir y probar.
  - **Versiones y dependencias** (`VER`, `/standards/versioning/`):
    - SemVer, con la lista de lo que rompe en una librería de componentes;
    - un changeset en toda PR que cambia lo que se publica, o un changeset vacío;
    - changesets escritos para quien usa el paquete;
    - prerreleases en modo pre y nunca bajo `latest`;
    - el lockfile en el repo y `--frozen-lockfile` en el CI;
    - los frameworks como `peerDependencies`;
    - las dependencias 0.x fijadas;
    - las dependencias internas con `workspace:`.
- Orden de lectura de las áreas: Nombres, Idioma, Stack, Código, Documentación, Versiones, Git, CI y Proceso. Cambian los `order` de Git, CI y Proceso, pero no sus URLs ni sus IDs.
- Regula las cumple:
  - un script nuevo, `check:dev`, con su paso «Normas de desarrollo» en «Comprobaciones»;
  - un script nuevo de changesets, con su paso «Changesets» en el job «Commits»;
  - `biome.json` declara de forma explícita `noExplicitAny`, `noTsIgnore` y `noEnum` como `error`;
  - la web y los ejemplos activan `noUncheckedIndexedAccess`, y se corrigen sus errores;
  - los ejemplos ganan `typecheck`;
  - `@jotis-me/tokens` compila con `NodeNext`;
  - los exports sin JSDoc se documentan.
- Las normas se aplican al código nuevo y al que se toque. Las que tienen comprobación por máquina se cumplen ya en todo Regula, porque no se publica una norma automática sin su comprobación en verde.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `engineering-standards`: requisitos nuevos para las áreas de stack, código, documentación y versiones, y para el orden de las áreas.
- `standards-compliance`: requisitos nuevos para que Regula cumpla esas áreas: `check:dev`, la comprobación de changesets, Biome con las reglas explícitas, los tsconfig y `typecheck` de todos los workspaces, y los exports documentados.

## Impact

- `apps/docs/src/content/standards/`: `stack.yaml`, `code.yaml`, `documentation.yaml` y `versioning.yaml`, que son nuevos, y los `order` de `git.yaml`, `ci.yaml` y `process.yaml`. Cambian también `STANDARD_AREAS` y los tests que fijan el orden de las áreas (`standards.test.ts`, `mcp-tools.test.ts`). La página, `/standards.json` y el MCP salen solos de la fuente.
- Scripts nuevos con sus tests: `scripts/check-dev.ts` y `scripts/check-changesets.ts`. Pasos nuevos en `.github/workflows/ci.yml`.
- `biome.json`, `apps/docs/tsconfig.json`, `examples/*/tsconfig.json`, `examples/*/package.json` (con `typecheck`, y `@astrojs/check` en el de Astro) y `packages/tokens/tsconfig.json`.
- Código que hay que corregir: los errores de `noUncheckedIndexedAccess` en la web y los ejemplos, los `as any` de `SocialButton` y los exports sin JSDoc de `react/src/app-icon`, `react/src/components` y `tokens/src`.
- No cambia la API de ningún paquete publicado. Si un arreglo toca código publicado (`SocialButton`, JSDoc), lleva un changeset `patch`, como pide la propia norma `VER-002`.
- Fuera de alcance:
  - traducir al inglés los comentarios y el JSDoc que hoy están en español (va en la migración de idioma, antes de la beta);
  - tests y seguridad (cambio de calidad);
  - SEO, accesibilidad, i18n y rendimiento (cambio de web);
  - las reglas para programar con IA.
