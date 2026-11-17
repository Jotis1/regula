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
- a `biome.json` le falta alguna pieza del bloque de la guía, o tiene alguna regla en `warn`;
- el paso «Biome» no usa `--error-on-warnings`;
- un script `build`, `typecheck` o `test` de la raíz no usa `turbo run`;
- una app con `vercel.json` no tiene `engines.node`;
- falta `.github/dependabot.yml`, o no revisa cada semana `bun` y `github-actions` con el prefijo `build`.

#### Scenario: Regla en warn
- **WHEN** una PR pone `noEnum` en `warn`
- **THEN** el paso falla y nombra `biome.json` y la norma de los niveles

#### Scenario: Sangría con espacios
- **WHEN** una PR pone `"indentStyle": "space"` en `biome.json`
- **THEN** el paso falla y nombra `biome.json` y la norma del bloque

### Requirement: Tipografía comprobada
El paso «Normas de desarrollo» SHALL fallar si un archivo de texto que sigue Git, fuera de lo que `LNG-005` deja fuera, tiene un «·», un «—» o un «–» que no sea una cita suelta del carácter. El mensaje SHALL nombrar el archivo, la línea y `LNG-005`.

En cada PR, el paso «Tipografía» del job «Commits» SHALL fallar si un commit de la PR, salvo los de un bot, lleva alguno de esos caracteres en el título o en el cuerpo, y SHALL nombrar el commit.

#### Scenario: Raya en un comentario
- **WHEN** una PR añade a un componente un comentario con una raya («—»)
- **THEN** «Normas de desarrollo» falla y nombra el archivo, la línea y `LNG-005`

#### Scenario: Punto medio en un commit
- **WHEN** una PR trae un commit con «·» en el título
- **THEN** «Tipografía» falla y nombra el commit

#### Scenario: Commit de Dependabot con notas de versión
- **WHEN** Dependabot sube una dependencia y el cuerpo de su commit copia unas notas de versión con «—»
- **THEN** «Tipografía» pasa

### Requirement: Regula cumple la tipografía
Los textos de Regula SHALL cumplir `LNG-005`: la guía, los comentarios, el JSDoc, los tests, las especificaciones de OpenSpec que no están archivadas y los textos que pintan los componentes. Los textos de `@jotis-me/react` que cambian de separador SHALL llevar un changeset `patch`.

#### Scenario: Repo actual
- **WHEN** corre el paso «Normas de desarrollo» en la rama principal
- **THEN** no informa de ningún «·», «—» ni «–»

### Requirement: Normas de código comprobadas
El paso «Normas de desarrollo» SHALL fallar, nombrando el archivo y la norma, si:
- el tsconfig de un workspace, ya resuelto con sus `extends`, no tiene alguno de los flags del área de código;
- un workspace con tsconfig no tiene script `typecheck`;
- el código tiene un `@ts-ignore`, un `@ts-nocheck`, o un `@ts-expect-error` o `biome-ignore` sin motivo;
- un paquete publicado no compila con `NodeNext`.

#### Scenario: Ejemplo sin typecheck
- **WHEN** una PR añade un ejemplo con tsconfig y sin script `typecheck`
- **THEN** el paso falla y nombra el `package.json` y la norma de `typecheck`

### Requirement: Normas de documentación comprobadas
El paso «Normas de desarrollo» SHALL fallar, nombrando el archivo y la norma, si en un paquete publicado, fuera de los `*.generated.*` y de `internal/`:
- un export público, o una propiedad de una interfaz o de un tipo objeto de nivel superior, no lleva JSDoc;
- un `@deprecated` no dice qué usar.

#### Scenario: Prop sin documentar
- **WHEN** una PR añade a `Button` una prop sin JSDoc
- **THEN** el paso falla y nombra el archivo, la prop y la norma

### Requirement: READMEs comprobados
El paso «Normas de desarrollo» SHALL fallar si un paquete publicado no tiene README o no enlaza a `https://regula.jotis.me`, o si el README de la raíz no tiene, en sus bloques de código, los comandos de instalar, arrancar, construir y probar.

#### Scenario: README de la raíz sin comandos
- **WHEN** el README de la raíz solo tiene `bun install`
- **THEN** el paso falla y dice que faltan los comandos de arrancar, construir y probar

### Requirement: Normas de dependencias comprobadas
El paso «Normas de desarrollo» SHALL fallar, nombrando el archivo y la norma, si:
- un paquete publicado tiene un framework compartido en `dependencies`, una dependencia 0.x con rango o no declara `sideEffects`;
- una dependencia tiene rangos distintos en dos workspaces, salvo `typescript` en los workspaces con `@astrojs/check`, `next` o `dts-bundle-generator`;
- un job del CI instala sin `--frozen-lockfile`.

#### Scenario: Rango distinto
- **WHEN** una PR sube `react` a `^19.4.0` solo en un ejemplo
- **THEN** el paso falla y nombra los dos `package.json` y la norma de la coherencia

#### Scenario: TypeScript 6 en una app de Astro
- **WHEN** la web de Astro usa `typescript` `^6` y la raíz `^7`
- **THEN** el paso pasa, porque `astro check` necesita TypeScript 6

### Requirement: Changesets comprobados en las PR
En cada PR, el paso «Changesets» SHALL fallar si la PR cambia lo que publica un paquete y no trae un changeset que lo nombre ni uno vacío. Cuenta como publicado:
- `src/`;
- lo que lista `files`, salvo la salida del build;
- el `package.json`, salvo `devDependencies` y `scripts`.

El PR de versión de changesets SHALL quedar fuera.

#### Scenario: Componente cambiado sin changeset
- **WHEN** una PR cambia `packages/react/src/components/Button.tsx` y no trae ningún changeset
- **THEN** el paso falla y nombra `@jotis-me/react`

#### Scenario: Solo tests
- **WHEN** una PR solo cambia `packages/react/test/`
- **THEN** el paso pasa sin changeset

#### Scenario: Dependabot sube una devDependency
- **WHEN** una PR de Dependabot solo cambia `devDependencies` de `@jotis-me/react` y `bun.lock`
- **THEN** el paso pasa sin changeset

#### Scenario: Dependabot sube una dependencia publicada
- **WHEN** una PR de Dependabot sube `clsx` en las `dependencies` de `@jotis-me/react`
- **THEN** el paso falla hasta que alguien añade un changeset a la PR

### Requirement: Regula cumple el área de código
Todos los workspaces de Regula SHALL tener los flags del área de código, un script `typecheck` y su `typecheck` en verde en el CI: la web, los dos ejemplos, el artefacto y los paquetes. `biome ci --error-on-warnings .` SHALL pasar con el bloque de la guía. Las únicas supresiones de `noNamespaceImport` SHALL ser las del código que recorre todos los exports de un módulo.

#### Scenario: Ejemplos en el typecheck
- **WHEN** corre `turbo run typecheck` en el CI
- **THEN** incluye `me.jotis.regula.example.astro` y `me.jotis.regula.example.next`, y pasa

#### Scenario: Any nuevo
- **WHEN** una PR añade `as any` en un componente
- **THEN** el paso «Biome» falla

### Requirement: Ejemplos como prueba de los frameworks
Los ejemplos de Next y de Astro SHALL pasar Biome, `typecheck` y «Normas de desarrollo» con el mismo bloque de configuración que se publica en la guía, sin supresiones propias. Si una regla nueva choca con una convención de alguno de los dos frameworks, su excepción SHALL añadirse a la norma y al bloque antes de publicarla.

#### Scenario: Layout de Next
- **WHEN** corre Biome sobre `examples/next/app/layout.tsx`, con su `export default`
- **THEN** no hay ningún diagnóstico

### Requirement: Exports de Regula documentados
Cada export público y cada prop de `@jotis-me/tokens`, `@jotis-me/assets` y `@jotis-me/react` SHALL llevar JSDoc. Los ficheros generados de `@jotis-me/assets` quedan fuera, porque su generador está documentado.

#### Scenario: Repo actual
- **WHEN** corre el paso «Normas de desarrollo» en la rama principal
- **THEN** no informa de ningún export ni prop sin JSDoc

### Requirement: Dependabot en Regula
Regula SHALL tener `.github/dependabot.yml` según la norma de Dependabot. Sus PR SHALL pasar «Commits» y la puerta «CI» sin cambios manuales, salvo el changeset cuando suben una dependencia publicada.

#### Scenario: Primera PR agrupada
- **WHEN** Dependabot abre la PR semanal de versiones menores de Bun
- **THEN** su commit empieza por `build(deps):` y el job «Commits» pasa
