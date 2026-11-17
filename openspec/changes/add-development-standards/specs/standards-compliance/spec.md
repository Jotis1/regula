## ADDED Requirements

### Requirement: Herramientas del stack comprobadas
El paso «Normas de desarrollo» del CI SHALL fallar, nombrando el archivo y la norma, si:
- una app de `apps/` o `examples/` no depende de `next` ni de `astro`;
- `packageManager` no fija una versión exacta de Bun, hay otro lockfile o el CI instala Bun sin `bun-version-file`;
- hay ESLint o Prettier, como dependencia o como configuración.

#### Scenario: Repo actual
- **WHEN** corre el CI en la rama principal
- **THEN** el paso «Normas de desarrollo» pasa

#### Scenario: Prettier añadido
- **WHEN** una PR añade `prettier` a las `devDependencies` de la web
- **THEN** el paso falla y nombra `apps/docs/package.json` y la norma de Biome

### Requirement: Configuración del stack comprobada
El paso «Normas de desarrollo» SHALL fallar, nombrando el archivo y la norma, si:
- a `biome.json` le falta alguna pieza del bloque de la guía;
- un script `build`, `typecheck` o `test` de la raíz no usa `turbo run`;
- una app con `vercel.json` no tiene `engines.node`.

#### Scenario: Regla del bloque quitada
- **WHEN** una PR quita `noEnum` de `biome.json`
- **THEN** el paso falla y nombra `biome.json` y la norma del bloque de Biome

### Requirement: Normas de código comprobadas
El paso «Normas de desarrollo» SHALL fallar, nombrando el archivo y la norma, si:
- el tsconfig de un workspace, ya resuelto con sus `extends`, no tiene `strict` y `noUncheckedIndexedAccess`;
- un workspace con tsconfig no tiene script `typecheck`;
- el código tiene un `@ts-ignore`, un `@ts-nocheck`, o un `@ts-expect-error` o `biome-ignore` sin motivo;
- un paquete publicado no compila con `NodeNext`.

#### Scenario: Ejemplo sin typecheck
- **WHEN** una PR añade un ejemplo con tsconfig y sin script `typecheck`
- **THEN** el paso falla y nombra el `package.json` y la norma de `typecheck`

### Requirement: Normas de documentación y dependencias comprobadas
El paso «Normas de desarrollo» SHALL fallar, nombrando el archivo y la norma, si:
- un export público de un paquete publicado no lleva JSDoc, salvo en los ficheros `*.generated.*` y en `internal/`;
- un paquete publicado no tiene README, o su README no enlaza a `https://regula.jotis.me`;
- un paquete publicado tiene un framework compartido en `dependencies` o una dependencia 0.x con rango;
- un job del CI instala sin `--frozen-lockfile`.

#### Scenario: Export sin documentar
- **WHEN** una PR añade a `@jotis-me/react` un componente exportado sin JSDoc
- **THEN** el paso falla y nombra el archivo, el export y la norma del JSDoc

### Requirement: Changesets comprobados en las PR
En cada PR, el paso «Changesets» SHALL fallar si la PR cambia lo que publica un paquete publicado y no trae un changeset que lo nombre ni un changeset vacío. Cuenta como lo que se publica:
- `src/`;
- lo que lista `files`, salvo la salida del build;
- el `package.json`.

El PR de versión de changesets SHALL quedar fuera.

#### Scenario: Componente cambiado sin changeset
- **WHEN** una PR cambia `packages/react/src/components/Button.tsx` y no trae ningún changeset
- **THEN** el paso falla y nombra `@jotis-me/react`

#### Scenario: Solo tests
- **WHEN** una PR solo cambia `packages/react/test/`
- **THEN** el paso pasa sin changeset

#### Scenario: Changeset vacío
- **WHEN** una PR cambia el `package.json` de `@jotis-me/tokens` y trae un changeset vacío
- **THEN** el paso pasa

### Requirement: Regula cumple el área de código
Todos los workspaces de Regula SHALL tener `strict` y `noUncheckedIndexedAccess`, un script `typecheck` y su `typecheck` en verde en el CI. Incluye la web, los dos ejemplos y el artefacto. `biome.json` SHALL declarar `noExplicitAny`, `noTsIgnore` y `noEnum` como `error`, y `biome ci .` SHALL pasar sin supresiones de `noExplicitAny`. Los tres paquetes publicados SHALL compilar con `NodeNext`.

#### Scenario: Ejemplos en el typecheck
- **WHEN** corre `turbo run typecheck` en el CI
- **THEN** incluye `me.jotis.regula.example.astro` y `me.jotis.regula.example.next`, y pasa

#### Scenario: Any nuevo
- **WHEN** una PR añade `as any` en un componente
- **THEN** el paso «Biome» falla

### Requirement: Exports de Regula documentados
Cada export público de `@jotis-me/tokens`, `@jotis-me/assets` y `@jotis-me/react` SHALL llevar JSDoc. Los ficheros generados de `@jotis-me/assets` quedan fuera, porque su generador está documentado.

#### Scenario: Repo actual
- **WHEN** corre el paso «Normas de desarrollo» en la rama principal
- **THEN** no informa de ningún export sin JSDoc
