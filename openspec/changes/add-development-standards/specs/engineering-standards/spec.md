## ADDED Requirements

### Requirement: Orden de las áreas
Las áreas de normas SHALL leerse en este orden en la navegación, en la página índice y en `/standards.json`: Nombres, Idioma, Stack, Código, Documentación, Versiones, Git, CI y Proceso. Cambiar el orden SHALL NOT cambiar la URL ni los IDs de las normas de un área.

#### Scenario: Áreas en el JSON
- **WHEN** un programa descarga `/standards.json`
- **THEN** las áreas llegan con los ids `naming`, `language`, `stack`, `code`, `documentation`, `versioning`, `git`, `ci` y `process`, en ese orden

#### Scenario: URL de Git
- **WHEN** se abre `/standards/git/#git-001` después del cambio
- **THEN** la norma `GIT-001` sigue en la misma URL

### Requirement: Área de stack: frameworks y gestor
El área de stack SHALL tener el prefijo `HER` y fijar, con nivel DEBE:
- para las apps, que se construyen con Next.js o con Astro;
- para todos los proyectos, que Bun es el gestor de paquetes y el runtime de los scripts del repo, que `packageManager` fija la versión exacta de Bun, que el único lockfile es `bun.lock` y que el CI instala la versión que dice `packageManager`.

#### Scenario: App con otro framework
- **WHEN** se mira el ejemplo que no cumple la norma de los frameworks
- **THEN** enseña el `package.json` de una app que depende de `vite` y `react-router` sin Next ni Astro

#### Scenario: Dos lockfiles
- **WHEN** se mira el ejemplo que no cumple la norma de Bun
- **THEN** enseña un repo con `bun.lock` y `package-lock.json`, y el porqué explica que cada gestor resolvería versiones distintas

### Requirement: Área de stack: Biome
El área de stack SHALL fijar, con nivel DEBE y para todos los proyectos:
- que Biome hace el lint y el formato, que el CI ejecuta `biome ci .` y que no hay ESLint ni Prettier;
- que `biome.json` añade a lo que genera el framework el bloque de la guía: el preset `recommended`, `noExplicitAny`, `noTsIgnore` y `noEnum` como `error`, el formato de la suite, los imports ordenados y el `.gitignore` como lista de ignorados.

#### Scenario: Bloque de Biome
- **WHEN** se mira el ejemplo que cumple la norma de `biome.json`
- **THEN** enseña el bloque completo, listo para copiar sobre lo que genera `biome init`

#### Scenario: ESLint junto a Biome
- **WHEN** se mira el ejemplo que no cumple la norma de Biome
- **THEN** enseña un `package.json` con `eslint` y `prettier` en `devDependencies`

### Requirement: Área de stack: Turbo y Node
El área de stack SHALL fijar:
- con nivel DEBE y para todos los proyectos, que build, typecheck y test se ejecutan con Turbo, y que los scripts de la raíz los llaman con `turbo run`;
- con nivel DEBERÍA y para las apps desplegadas, que declaran en `engines.node` la versión mayor de Node con la que se despliegan.

#### Scenario: Script de la raíz
- **WHEN** se mira el ejemplo que cumple la norma de Turbo
- **THEN** enseña un `package.json` raíz con `"build": "turbo run build"`

### Requirement: Área de código: tipos
El área de código SHALL tener el prefijo `COD` y fijar, con nivel DEBE y para todos los proyectos:
- que cada tsconfig, sobre el que genera el framework, tiene `strict` y `noUncheckedIndexedAccess`;
- que cada workspace con TypeScript tiene una tarea `typecheck` y el CI la ejecuta;
- que no se escribe `any`; lo que no se conoce es `unknown` y se estrecha;
- que no se usan `@ts-ignore` ni `@ts-nocheck`, y que todo `@ts-expect-error` o `biome-ignore` dice por qué.

#### Scenario: Índice sin comprobar
- **WHEN** se mira el ejemplo que no cumple la norma del tsconfig
- **THEN** enseña `const first = items[0]; first.name` y el porqué explica que sin `noUncheckedIndexedAccess` el tipo no avisa de que `first` puede ser `undefined`

#### Scenario: Supresión sin motivo
- **WHEN** se mira el ejemplo que no cumple la norma de las supresiones
- **THEN** enseña un `// @ts-ignore` encima de una línea, y el que la cumple, un `// @ts-expect-error: <motivo>` en un test de tipos

### Requirement: Área de código: módulos
El área de código SHALL fijar, con nivel DEBE y para los paquetes publicados, que son solo ESM, con `exports` y sus tipos correctos para quien los importa, y que compilan con `module` y `moduleResolution` en `NodeNext`, así que los imports relativos llevan la extensión `.js`.

#### Scenario: Import sin extensión
- **WHEN** se mira el ejemplo que no cumple la norma de `NodeNext`
- **THEN** enseña `import { cx } from "./cx"` en un paquete publicado, y el porqué explica que Node no resuelve el import aunque el bundler del proyecto sí

### Requirement: Área de código: estilo
El área de código SHALL fijar, para todos los proyectos:
- con nivel DEBE, que los conjuntos de valores son uniones de literales y no `enum`;
- con nivel DEBERÍA, que los módulos exportan con nombre y solo usan `export default` donde el framework lo pide (páginas, layouts y ficheros de configuración).

#### Scenario: Enum
- **WHEN** se mira el ejemplo que cumple la norma de los conjuntos de valores
- **THEN** enseña `type ButtonSize = "sm" | "md" | "lg"` en lugar de un `enum`

### Requirement: Área de documentación: JSDoc
El área de documentación SHALL tener el prefijo `DOC` y fijar, para los paquetes publicados:
- con nivel DEBE, que todo export público (componente, función, constante o clase) lleva un JSDoc que dice para qué sirve. El código generado SHALL quedar fuera si su generador está documentado;
- con nivel DEBERÍA, que cada prop de un componente lleva JSDoc, con `@default` cuando tiene valor por defecto.

Las normas de documentación SHALL NOT repetir la de los comentarios del área de idioma: la enlazan.

#### Scenario: Export sin JSDoc
- **WHEN** se mira el ejemplo que no cumple la norma del JSDoc
- **THEN** enseña `export function Badge(props: BadgeProps)` sin comentario, y el que la cumple, el mismo export con un JSDoc de una línea

#### Scenario: Prop con valor por defecto
- **WHEN** se mira el ejemplo que cumple la norma de las props
- **THEN** enseña una prop `size` con su JSDoc y `@default "md"`

### Requirement: Área de documentación: README
El área de documentación SHALL fijar:
- con nivel DEBE y para los paquetes publicados, que el paquete tiene un README con cómo instalarlo, un uso mínimo y el enlace a la guía;
- con nivel DEBERÍA y para todos los proyectos, que el README de la raíz dice cómo instalar, arrancar, construir y probar el proyecto.

#### Scenario: README de paquete
- **WHEN** se mira el ejemplo que cumple la norma del README de paquete
- **THEN** enseña un README con `bun add @jotis-me/react`, un import de un componente y el enlace a `https://regula.jotis.me`

### Requirement: Área de versiones: SemVer
El área de versiones SHALL tener el prefijo `VER` y fijar, con nivel DEBE y para los paquetes publicados, que siguen SemVer. SHALL listar lo que rompe en una librería de componentes:
- quitar o renombrar un export, una prop, un token o una variable CSS;
- cambiar un valor por defecto;
- estrechar un tipo que se acepta;
- subir la versión mayor de una `peerDependency`.

Antes de la 1.0, lo que rompe sube la versión menor.

#### Scenario: Prop renombrada
- **WHEN** se mira el ejemplo que no cumple la norma de SemVer
- **THEN** enseña un changeset `patch` que renombra una prop, y la norma explica que renombrarla rompe y pide `major` (o `minor` antes de la 1.0)

### Requirement: Área de versiones: changesets
El área de versiones SHALL fijar, para los paquetes publicados:
- con nivel DEBE, que toda PR que cambia lo que el paquete publica trae un changeset que lo nombra, o un changeset vacío si no hay nada que publicar;
- con nivel DEBERÍA, que el changeset se escribe para quien usa el paquete, y que si rompe dice cómo migrar;
- con nivel DEBE, que las prerreleases salen con el modo pre de changesets y una etiqueta de npm distinta de `latest`.

#### Scenario: Beta
- **WHEN** se mira el ejemplo que cumple la norma de las prerreleases
- **THEN** enseña `changeset pre enter beta` y una versión `1.0.0-beta.0` publicada con la etiqueta `beta`

### Requirement: Área de versiones: lockfile y frameworks
El área de versiones SHALL fijar, con nivel DEBE:
- para todos los proyectos, que el lockfile está en el repo y el CI instala con `--frozen-lockfile`;
- para los paquetes publicados, que los frameworks que comparte la app (`react`, `react-dom`, `next`, `astro`, `tailwindcss`) van en `peerDependencies` con el rango de versiones mayores admitidas, y nunca en `dependencies`.

#### Scenario: React en dependencies
- **WHEN** se mira el ejemplo que no cumple la norma de los frameworks compartidos
- **THEN** enseña un paquete con `react` en `dependencies`, y el porqué explica que la app acabaría con dos copias de React

### Requirement: Área de versiones: rangos e internas
El área de versiones SHALL fijar, para los paquetes publicados:
- con nivel DEBERÍA, que una dependencia 0.x en `dependencies` o `peerDependencies` se fija a una versión exacta;
- con nivel DEBE, que las dependencias internas del monorepo se declaran con `workspace:` y el paquete que se publica no lleva ningún `workspace:`.

#### Scenario: Dependencia 0.x
- **WHEN** se mira el ejemplo que cumple la norma de las dependencias 0.x
- **THEN** enseña `"@untitledui/icons": "0.0.23"`, y la norma explica que en 0.x una versión menor puede romper
