## MODIFIED Requirements

### Requirement: Campos de una norma
Cada norma SHALL tener:
- un ID con el prefijo en inglés de su área y tres cifras (`NAM-001`);
- un título;
- un nivel: DEBE, DEBERÍA o PUEDE, con el sentido de RFC 2119;
- a qué proyectos se aplica: todos, solo apps o solo paquetes publicados;
- el enunciado y el porqué;
- al menos un ejemplo que la cumple y otro que no;
- opcionalmente, las excepciones que pide un framework, cada una con dónde aplica y por qué.

Un ID SHALL NOT reutilizarse para otra norma, ni siquiera si la norma desaparece. A partir de la 1.0, los IDs SHALL NOT cambiar.

#### Scenario: Norma completa
- **WHEN** se abre la norma `NAM-001`
- **THEN** muestra su nivel DEBE, que se aplica a todos los proyectos, el enunciado, el porqué, un ejemplo que la cumple y otro que no

#### Scenario: Norma con excepciones
- **WHEN** se abre la norma de los exports con nombre
- **THEN** lista como excepción los archivos especiales de Next (`page.tsx`, `layout.tsx`…) y los ficheros de configuración, y dice que el framework los importa por su export por defecto

### Requirement: Verificación de una norma
Cada norma SHALL decir cómo se verifica: Biome, CI, test o revisión manual.
- Las verificables por máquina SHALL nombrar la comprobación concreta: la regla de Biome, el paso de CI o el test.
- Las de revisión SHALL decir qué tiene que mirar quien revisa.

#### Scenario: Norma automática
- **WHEN** se abre la norma `NAM-001`
- **THEN** dice que la verifica el CI con la comprobación de nombres de paquete

#### Scenario: Norma de revisión
- **WHEN** se abre una norma que no se puede comprobar por máquina, como la del idioma de los comentarios
- **THEN** dice que se verifica en revisión y qué tiene que mirar quien revisa

### Requirement: Idioma del código y de los textos
El área de idioma SHALL fijar, con nivel DEBE:
- que el código, los identificadores, los nombres de fichero y los comentarios van en inglés;
- que la guía, los mensajes de commit, los títulos de PR y los changesets van en español.

Los commits, títulos y ramas que genera un bot (Dependabot) SHALL quedar fuera de la parte de idioma, porque el bot no deja elegirlo. Sí SHALL cumplir Conventional Commits.

Las normas de idioma SHALL aplicarse al código nuevo y al que se toque desde su publicación. El código anterior se adapta en un cambio aparte antes de la beta.

#### Scenario: Identificador en español
- **WHEN** se mira el ejemplo que no cumple la norma del código en inglés
- **THEN** enseña una función con nombre en español, y el que la cumple, la misma función con nombre en inglés

#### Scenario: Commit de Dependabot
- **WHEN** Dependabot abre una PR con el commit `build(deps): bump astro from 7.0.1 to 7.1.0`
- **THEN** la PR cumple las normas aunque el commit esté en inglés

## ADDED Requirements

### Requirement: Prefijos en inglés
El prefijo de cada área SHALL ser de tres letras y en inglés: `NAM` (nombres), `LNG` (idioma), `STK` (stack), `COD` (código), `DOC` (documentación), `VER` (versiones), `GIT`, `INT` (CI) y `PRO` (proceso). Las normas `NOM-001`, `NOM-002` e `IDI-001` a `IDI-004` SHALL pasar a `NAM-001`, `NAM-002` y `LNG-001` a `LNG-004`, sin alias.

#### Scenario: ID antiguo
- **WHEN** se llama a `get_standard` con `NOM-001`
- **THEN** devuelve el error de norma que no existe

### Requirement: Normas compatibles con los frameworks
Ninguna norma SHALL obligar a algo que contradiga una convención de Next.js o de Astro. Cuando la convención pide otra cosa, la norma SHALL listarlo en sus excepciones, y la comprobación automática SHALL aplicar esas mismas excepciones. Una norma automática nueva SHALL publicarse solo si los dos ejemplos de Regula, uno de Next y otro de Astro, la cumplen sin supresiones.

#### Scenario: Página de Next
- **WHEN** un proyecto Next tiene `app/page.tsx` con `export default function Page()`
- **THEN** cumple la norma de los exports con nombre y Biome no avisa

### Requirement: Orden de las áreas
Las áreas de normas SHALL leerse en este orden en la navegación, en la página índice y en `/standards.json`: Nombres, Idioma, Stack, Código, Documentación, Versiones, Git, CI y Proceso. Cambiar el orden SHALL NOT cambiar la URL de un área.

#### Scenario: Áreas en el JSON
- **WHEN** un programa descarga `/standards.json`
- **THEN** las áreas llegan con los ids `naming`, `language`, `stack`, `code`, `documentation`, `versioning`, `git`, `ci` y `process`, en ese orden

### Requirement: Área de nombres: archivos
El área de nombres SHALL fijar, con nivel DEBE y para todos los proyectos, que los archivos de componentes (`.tsx` y `.astro`) se llaman en PascalCase o en kebab-case, y el resto, en kebab-case. Las rutas de los frameworks (`page.tsx`, `[slug].astro`, `[...slug].astro`) SHALL cumplirla tal como las pide cada framework.

#### Scenario: Utilidad en camelCase
- **WHEN** se mira el ejemplo que no cumple la norma de los archivos
- **THEN** enseña `formatDate.ts`, y el que la cumple, `format-date.ts` junto a `DatePicker.tsx`

### Requirement: Área de stack: frameworks y gestor
El área de stack SHALL tener el prefijo `STK` y fijar, con nivel DEBE:
- para las apps, que se construyen con Next.js o con Astro;
- para todos los proyectos, que Bun es el gestor de paquetes y el runtime de los scripts, con la versión exacta en `packageManager`, y que el único lockfile es `bun.lock`. El CI SHALL instalar la versión que dice `packageManager`.

#### Scenario: Dos lockfiles
- **WHEN** se mira el ejemplo que no cumple la norma de Bun
- **THEN** enseña un repo con `bun.lock` y `package-lock.json`, y el porqué explica que cada gestor resolvería versiones distintas

### Requirement: Área de stack: Biome
El área de stack SHALL fijar, con nivel DEBE y para todos los proyectos:
- que Biome hace el lint y el formato, sin ESLint ni Prettier;
- que el CI ejecuta `biome ci --error-on-warnings .`;
- que `biome.json` añade a lo que genera el framework el bloque de la guía, con sus excepciones por framework;
- que en `biome.json` las reglas se ponen en `error` o en `off`, nunca en `warn`.

#### Scenario: Regla en warn
- **WHEN** se mira el ejemplo que no cumple la norma de los niveles
- **THEN** enseña `"noExplicitAny": "warn"`, y el porqué explica que un aviso no hace fallar el CI y acaba ignorándose

#### Scenario: Bloque de Biome
- **WHEN** se mira el ejemplo que cumple la norma de `biome.json`
- **THEN** enseña el bloque completo, con los `overrides` de Next y de Astro, listo para copiar sobre lo que genera `biome init`

### Requirement: Área de stack: Turbo y Node
El área de stack SHALL fijar:
- con nivel DEBE y para todos los proyectos, que build, typecheck y test se ejecutan con Turbo, y que los scripts de la raíz los llaman con `turbo run`;
- con nivel DEBERÍA y para las apps desplegadas, que declaran en `engines.node` la versión mayor de Node con la que se despliegan.

#### Scenario: Script de la raíz
- **WHEN** se mira el ejemplo que cumple la norma de Turbo
- **THEN** enseña un `package.json` raíz con `"build": "turbo run build"`

### Requirement: Área de stack: Dependabot
El área de stack SHALL fijar, con nivel DEBE y para todos los proyectos, que Dependabot revisa cada semana las dependencias de Bun y las acciones de GitHub. Las versiones menores y los parches SHALL ir agrupados en una PR por ecosistema, y los commits SHALL llevar el prefijo `build` con el ámbito `deps`.

#### Scenario: Configuración
- **WHEN** se mira el ejemplo que cumple la norma de Dependabot
- **THEN** enseña un `.github/dependabot.yml` con los ecosistemas `bun` y `github-actions`, `interval: weekly`, un grupo para `minor` y `patch` y `commit-message.prefix: build`

### Requirement: Área de código: tsconfig y typecheck
El área de código SHALL tener el prefijo `COD` y fijar, con nivel DEBE y para todos los proyectos:
- que cada tsconfig, sobre el del framework, tiene `strict`, `noUncheckedIndexedAccess`, `erasableSyntaxOnly`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch` y `verbatimModuleSyntax`;
- que cada workspace con TypeScript tiene una tarea `typecheck` y el CI la ejecuta.

#### Scenario: Índice sin comprobar
- **WHEN** se mira el ejemplo que no cumple la norma del tsconfig
- **THEN** enseña `const first = items[0]; first.name` y el porqué explica que sin `noUncheckedIndexedAccess` el tipo no avisa de que `first` puede ser `undefined`

### Requirement: Área de código: escapes del tipado
El área de código SHALL fijar, con nivel DEBE y para todos los proyectos:
- que no se escribe `any`; lo que no se conoce es `unknown` y se estrecha;
- que no se usa la aserción no nula `!`;
- que no se usan `@ts-ignore` ni `@ts-nocheck`, y que todo `@ts-expect-error` o `biome-ignore` dice por qué.

#### Scenario: Aserción no nula
- **WHEN** se mira el ejemplo que no cumple la norma de `!`
- **THEN** enseña `items[0]!.name`, y el que la cumple, una comprobación que decide qué hacer si no hay elemento

#### Scenario: Supresión sin motivo
- **WHEN** se mira el ejemplo que no cumple la norma de las supresiones
- **THEN** enseña un `// @ts-ignore`, y el que la cumple, un `// @ts-expect-error: <motivo>` en un test de tipos

### Requirement: Área de código: paquetes ESM
El área de código SHALL fijar, con nivel DEBE y para los paquetes publicados, que son solo ESM, con `exports` y sus tipos correctos para quien los importa, y que compilan con `module` y `moduleResolution` en `NodeNext`, así que los imports relativos llevan la extensión `.js`.

#### Scenario: Import sin extensión
- **WHEN** se mira el ejemplo que no cumple la norma de `NodeNext`
- **THEN** enseña `import { cx } from "./cx"` en un paquete publicado, y el porqué explica que Node no lo resuelve aunque el bundler sí

### Requirement: Área de código: imports y exports
El área de código SHALL fijar, con nivel DEBE y para todos los proyectos:
- exports con nombre, y `export default` solo en las excepciones del framework;
- `import type` para lo que solo es un tipo;
- sin `export *`, para que lo público se vea en el archivo;
- sin `import * as`, salvo cuando el código recorre todos los exports del módulo, con una supresión que lo diga.

#### Scenario: Isla de React
- **WHEN** se mira el ejemplo que cumple la norma de los exports con nombre
- **THEN** enseña `export function SiteSearch()` importado como `import { SiteSearch } from "…"` desde una página Astro

#### Scenario: Catálogo de iconos
- **WHEN** se mira la excepción de `import * as`
- **THEN** enseña `import * as lineIcons from "@untitledui/icons"` en una galería que recorre todos los iconos, con su `biome-ignore` y el motivo

### Requirement: Área de código: estilo
El área de código SHALL fijar, con nivel DEBE y para todos los proyectos:
- que los conjuntos de valores son uniones de literales y no `enum`;
- que el código de `src/` no usa `console.log` ni `console.debug`. `console.error` y `console.warn` se permiten, y los scripts, tests y configuraciones quedan fuera.

#### Scenario: Enum
- **WHEN** se mira el ejemplo que cumple la norma de los conjuntos de valores
- **THEN** enseña `type ButtonSize = "sm" | "md" | "lg"` en lugar de un `enum`

### Requirement: Área de documentación: JSDoc
El área de documentación SHALL tener el prefijo `DOC` y fijar, con nivel DEBE y para los paquetes publicados:
- que todo export público (componente, función, constante o clase) lleva un JSDoc que dice para qué sirve, salvo el código generado con un generador documentado;
- que cada prop lleva JSDoc, con `@default` si tiene valor por defecto;
- que todo `@deprecated` dice qué usar en su lugar.

No SHALL repetir la norma de los comentarios del área de idioma: la enlazan.

#### Scenario: Prop con valor por defecto
- **WHEN** se mira el ejemplo que cumple la norma de las props
- **THEN** enseña una prop `size` con su JSDoc y `@default "md"`

#### Scenario: Deprecado sin sustituto
- **WHEN** se mira el ejemplo que no cumple la norma de `@deprecated`
- **THEN** enseña `@deprecated` solo, y el que la cumple, `@deprecated Use \`hierarchy\` instead.`

### Requirement: Área de documentación: README
El área de documentación SHALL fijar, con nivel DEBE:
- para los paquetes publicados, un README con cómo instalarlo, un uso mínimo y el enlace a la guía;
- para todos los proyectos, un README en la raíz con los comandos para instalar, arrancar, construir y probar.

#### Scenario: README de paquete
- **WHEN** se mira el ejemplo que cumple la norma del README de paquete
- **THEN** enseña un README con `bun add @jotis-me/react`, un import de un componente y el enlace a `https://regula.jotis.me`

### Requirement: Área de versiones: SemVer y deprecación
El área de versiones SHALL tener el prefijo `VER` y fijar, con nivel DEBE y para los paquetes publicados:
- SemVer, con la lista de lo que rompe: quitar o renombrar un export, una prop, un token o una variable CSS; cambiar un valor por defecto; estrechar un tipo que se acepta; subir la mayor de una `peerDependency`. Antes de la 1.0, lo que rompe sube la menor;
- que antes de quitar algo se marca `@deprecated` en una versión menor, y se quita en la siguiente mayor.

#### Scenario: Prop renombrada
- **WHEN** se mira el ejemplo que no cumple la norma de SemVer
- **THEN** enseña un changeset `patch` que renombra una prop, y la norma explica que eso rompe

### Requirement: Área de versiones: changesets
El área de versiones SHALL fijar, para los paquetes publicados:
- con nivel DEBE, que toda PR que cambia lo que el paquete publica trae un changeset que lo nombra, o un changeset vacío si no hay nada que publicar;
- con nivel DEBE, que el changeset se escribe para quien usa el paquete, y que si rompe dice cómo migrar;
- con nivel DEBE, que las prerreleases salen con el modo pre de changesets y una etiqueta de npm distinta de `latest`.

#### Scenario: Beta
- **WHEN** se mira el ejemplo que cumple la norma de las prerreleases
- **THEN** enseña `changeset pre enter beta` y una versión `1.0.0-beta.0` publicada con la etiqueta `beta`

### Requirement: Área de versiones: lockfile y frameworks
El área de versiones SHALL fijar, con nivel DEBE:
- para todos los proyectos, que el lockfile está en el repo y el CI instala con `--frozen-lockfile`;
- para los paquetes publicados, que los frameworks que comparte la app (`react`, `react-dom`, `next`, `astro`, `tailwindcss`) van en `peerDependencies` y nunca en `dependencies`.

#### Scenario: React en dependencies
- **WHEN** se mira el ejemplo que no cumple la norma de los frameworks compartidos
- **THEN** enseña un paquete con `react` en `dependencies`, y el porqué explica que la app acabaría con dos copias de React

### Requirement: Área de versiones: rangos y coherencia
El área de versiones SHALL fijar:
- con nivel DEBERÍA y para los paquetes publicados, que una dependencia 0.x en `dependencies` o `peerDependencies` se fija a una versión exacta;
- con nivel DEBE y para los paquetes publicados, que las internas se declaran con `workspace:`, que lo publicado no lleva ningún `workspace:` y que `sideEffects` está declarado;
- con nivel DEBE y para todos los proyectos, que una dependencia lleva el mismo rango en todos los workspaces.

#### Scenario: Rangos distintos
- **WHEN** se mira el ejemplo que no cumple la norma de la coherencia
- **THEN** enseña `react` con `^19.3.1` en la web y `^19.2.0` en un ejemplo

### Requirement: Excepción de TypeScript en la coherencia de rangos
La norma de la coherencia de rangos SHALL listar como excepción `typescript` en los workspaces con `@astrojs/check`, `next` o `dts-bundle-generator`, porque estas herramientas leen la API de JavaScript de TypeScript 6.

#### Scenario: TypeScript en una app de Astro
- **WHEN** se abre la norma de la coherencia
- **THEN** lista como excepción `typescript` en los workspaces con `@astrojs/check`, `next` o `dts-bundle-generator`, y dice que esas herramientas usan TypeScript 6
