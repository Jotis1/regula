# standards-compliance Specification

## Purpose
Cómo cumple Regula sus propias normas: las comprobaciones de CI y los tests que fallan cuando un paquete, un commit o una norma se salen de lo definido.

## Requirements

### Requirement: Regula cumple las normas verificables
Cada norma cuya verificación sea Biome, CI o test SHALL tener su comprobación funcionando en el repo de Regula y en verde en la rama principal. Una norma SHALL NOT publicarse como automática si su comprobación no existe todavía.

#### Scenario: Norma sin comprobación
- **WHEN** una norma dice que la verifica un paso de CI que no existe en `ci.yml`
- **THEN** los tests de la fuente de normas fallan y nombran la norma

### Requirement: Nombres de paquete comprobados
El CI SHALL comprobar el `name` de cada `package.json` del workspace y SHALL fallar si:
- un paquete privado no está en dominio inverso bajo `me.jotis.regula`;
- un paquete público no usa el scope `@jotis-me`.

Todos los paquetes del repo SHALL cumplirlo: `me.jotis.regula` (raíz), `me.jotis.regula.docs`, `me.jotis.regula.example.astro`, `me.jotis.regula.example.next` y `me.jotis.regula.artifact`, además de los tres `@jotis-me/*` publicados.

#### Scenario: Paquete privado mal nombrado
- **WHEN** una PR añade un paquete privado llamado `example-vite`
- **THEN** el CI falla, nombra el `package.json` y propone `me.jotis.regula.example.vite`

#### Scenario: Repo actual
- **WHEN** corre el CI en la rama principal
- **THEN** la comprobación de nombres pasa

### Requirement: Commits comprobados en las PR
En cada PR, el CI SHALL comprobar que todos los commits que trae la PR siguen Conventional Commits. SHALL fallar nombrando el commit y la regla que incumple. Los commits de fusión que genera GitHub SHALL quedar fuera. Los commits que ya están en la rama principal no se reescriben ni se comprueban.

#### Scenario: Commit sin tipo
- **WHEN** una PR trae un commit `Arreglos en la propuesta`
- **THEN** el CI falla en el job de commits y nombra ese commit

#### Scenario: Commit con cuerpo y coautor
- **WHEN** una PR trae un commit `fix(docs): el historial pinta las tablas`, con un cuerpo y un pie `Co-Authored-By:`
- **THEN** el job de commits pasa

### Requirement: PR de versión con formato
El PR de versión que abre changesets y su commit SHALL llamarse `chore(release): versión de los paquetes`.

#### Scenario: Siguiente versión
- **WHEN** se fusiona en la rama principal una PR con un changeset
- **THEN** el PR de versión que se abre y su commit se llaman `chore(release): versión de los paquetes`

### Requirement: CI de Regula con detección y puerta
El CI de Regula SHALL decidir en un job de detección si hay que comprobar código: SHALL saltarse los jobs pesados solo si todo lo cambiado está en `openspec/**` o `.claude/**`. Un job puerta llamado «CI» SHALL depender de todos los demás y fallar si alguno falló o se canceló. El ruleset de `main` SHALL exigir solo «CI».

#### Scenario: PR solo de OpenSpec
- **WHEN** una PR solo cambia archivos de `openspec/`
- **THEN** los jobs de comprobaciones y de navegador salen saltados, «Commits» corre, y «CI» pasa en menos de 5 minutos

#### Scenario: PR que toca el CI
- **WHEN** una PR cambia `openspec/` y `.github/workflows/ci.yml`
- **THEN** corren todos los jobs

#### Scenario: Un job falla
- **WHEN** falla uno de los shards de navegador
- **THEN** «CI» falla y la PR no se puede fusionar

### Requirement: Normas de CI comprobadas
El paso «Normas de CI» SHALL fallar, nombrando archivo y norma, si:
- el workflow del CI filtra `pull_request` por rutas o ramas;
- falta el job «CI» con `if: always()` y todos los demás jobs en sus `needs`;
- falta `concurrency` con `cancel-in-progress`;
- un `vercel.json` no tiene `ignoreCommand` con `turbo query affected`;
- un job que ejecuta Turbo no recibe `TURBO_TOKEN` ni `TURBO_TEAM`.

#### Scenario: Job nuevo fuera de la puerta
- **WHEN** una PR añade un job al CI y no lo añade a los `needs` de «CI»
- **THEN** el paso «Normas de CI» falla y nombra el job

#### Scenario: Repo actual
- **WHEN** corre el CI en la rama principal
- **THEN** el paso «Normas de CI» pasa

### Requirement: Navegador repartido
Los e2e de la web SHALL correr en varios shards de Windows en paralelo. Cada shard que falle SHALL subir sus resultados. Lighthouse, los e2e de tokens y assets, los ejemplos y el artefacto SHALL ir en un job aparte, también en Windows. Ninguno de esos jobs SHALL pasar de 15 minutos en una PR con código.

#### Scenario: PR con código
- **WHEN** una PR cambia un componente
- **THEN** todos los e2e corren repartidos en los shards, y desde el primer job hasta «CI» pasan menos de 15 minutos

### Requirement: Caché remota de Turbo en el CI
Los jobs del CI que ejecutan Turbo SHALL usar la caché remota del equipo de Vercel con `TURBO_TOKEN` y `TURBO_TEAM`. Sin el secreto, como en las PR desde forks, SHALL construir sin caché remota y no fallar por eso.

#### Scenario: Segundo job de la misma ejecución
- **WHEN** el job de comprobaciones ya construyó los paquetes y un shard de navegador ejecuta `turbo run build`
- **THEN** el shard restaura el build de la caché remota en lugar de construirlo

### Requirement: Web desplegada solo si cambia
El proyecto de Vercel de la web SHALL saltarse el build cuando `me.jotis.regula.docs` no está afectado por el cambio, según `turbo query affected` desde el commit anterior desplegado. Si la historia no basta para compararlo, SHALL construir.

#### Scenario: Fusión solo de OpenSpec
- **WHEN** se fusiona en `main` una PR que solo cambia `openspec/`
- **THEN** Vercel no construye y `regula.jotis.me` sigue sirviendo el despliegue anterior

#### Scenario: Fusión que cambia Turbo
- **WHEN** se fusiona en `main` una PR que cambia `turbo.json`
- **THEN** Vercel construye y despliega la web

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
- **WHEN** corre Biome sobre `examples/next/src/app/layout.tsx`, con su `export default`
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

### Requirement: Estructura comprobada
El paso «Normas de desarrollo» SHALL fallar, nombrando el archivo y la norma, si:
- un glob de `workspaces` de la raíz no empieza por `apps/`, `packages/`, `examples/` o `scripts/`;
- hay un `*.test.*` o un `*.spec.*` dentro de un `src/`;
- una app de Next no tiene `src/app/`, o tiene `app/` en su raíz;
- el `src/` de una app tiene una carpeta fuera de las del framework, las compartidas y `features/`.

#### Scenario: Carpeta suelta en src
- **WHEN** una PR añade `apps/docs/src/search/`
- **THEN** el paso falla, nombra la carpeta y la norma, y dice que va en `src/features/search/` o en una carpeta compartida

### Requirement: Cachés fuera de Git comprobadas
El paso «Normas de desarrollo» SHALL fallar, nombrando el archivo y la norma, si Git sigue un archivo de build o de caché (`dist/`, `.astro/`, `.next/`, `.turbo/`, `*.tsbuildinfo`).

#### Scenario: tsbuildinfo en Git
- **WHEN** Git sigue `examples/next/tsconfig.tsbuildinfo`
- **THEN** el paso falla y nombra el archivo y la norma de las cachés

### Requirement: Regula cumple la estructura
Regula SHALL cumplir el área de estructura:
- el ejemplo de Next con `src/app/`;
- las funcionalidades de la web (`mcp`, `playground`, `search`, `visual`) en `src/features/`;
- `*.tsbuildinfo` en el `.gitignore` y fuera de Git.

#### Scenario: Repo actual
- **WHEN** corre el paso «Normas de desarrollo» en la rama principal
- **THEN** no informa de ninguna carpeta ni archivo fuera de su sitio

### Requirement: Auditoría de dependencias en el CI
El job «Comprobaciones» SHALL tener un paso «Auditoría» que audita todas las dependencias del lockfile, las de desarrollo incluidas, y que falla con cada aviso alto o crítico sin excepción vigente, nombrando el paquete y el ID del aviso. Los avisos de severidad baja o moderada SHALL NOT hacerlo fallar.

#### Scenario: Repo actual
- **WHEN** corre el CI en la rama principal
- **THEN** el paso «Auditoría» pasa

#### Scenario: Aviso nuevo
- **WHEN** se publica un aviso alto de una dependencia del lockfile y una PR corre el CI
- **THEN** «Auditoría» falla y nombra el paquete y el aviso

### Requirement: Excepciones de la auditoría comprobadas
Las excepciones de la auditoría SHALL vivir en un archivo del repo, revisable en la PR, y no en una opción del workflow. El paso «Auditoría» SHALL fallar si una excepción:
- no lleva el ID del aviso, el motivo o la fecha;
- ha caducado, o su fecha queda a más de tres meses;
- tiene un aviso que ya no sale en la auditoría.

#### Scenario: Excepción caducada
- **WHEN** pasa la fecha de una excepción
- **THEN** «Auditoría» falla y nombra el aviso y la fecha

#### Scenario: Excepción que sobra
- **WHEN** una dependencia se actualiza y su aviso desaparece, pero su excepción sigue en el archivo
- **THEN** «Auditoría» falla y pide quitar la excepción

### Requirement: Normas de tests comprobadas
El CI SHALL fallar, nombrando el archivo y la norma, si:
- un workspace depende de Jest, Mocha o Cypress, o su script `test` no usa Vitest ni `bun test`, o su script `test:e2e` no usa Playwright;
- un e2e usa `waitForTimeout`;
- un `playwright.config` con reintentos en el CI no hace fallar los tests que pasan al reintentarlos;
- un test lleva `.only`, o un `.skip` sin supresión con motivo.

#### Scenario: Espera fija añadida
- **WHEN** una PR añade `page.waitForTimeout(500)` a un e2e
- **THEN** «Normas de desarrollo» falla y nombra el archivo, la línea y la norma de los tests deterministas

#### Scenario: Test enfocado
- **WHEN** una PR deja un `test.only`
- **THEN** el paso «Biome» falla

### Requirement: Workflows seguros comprobados
El paso «Normas de desarrollo» SHALL fallar, nombrando el workflow y la norma, si un workflow:
- no declara `permissions` en su raíz, o la raíz da algún permiso de escritura;
- usa una acción de fuera de `actions/*` y `github/*` sin un SHA de 40 caracteres, o sin la versión en un comentario;
- usa `pull_request_target`, o tiene un `run:` que interpola `${{ github.event.` o `${{ github.head_ref`.

#### Scenario: Acción sin SHA
- **WHEN** una PR añade `uses: some-org/some-action@v3` a `ci.yml`
- **THEN** el paso falla y nombra `ci.yml`, la acción y la norma de los SHA

#### Scenario: Acción oficial por etiqueta
- **WHEN** un workflow usa `actions/checkout@v7`
- **THEN** el paso no se queja

#### Scenario: Rama interpolada
- **WHEN** una PR añade un `run:` con `${{ github.head_ref }}`
- **THEN** el paso falla y nombra el workflow, el paso y la norma de la inyección

### Requirement: Publicación y secretos comprobados
El paso «Normas de desarrollo» SHALL fallar, nombrando el archivo y la norma, si un workflow nombra `NPM_TOKEN` o `NODE_AUTH_TOKEN`, si la publicación no usa `--provenance`, si `.gitignore` no ignora `.env` y `.env.*`, o si falta `SECURITY.md` en la raíz.

#### Scenario: Token de vuelta
- **WHEN** una PR añade a `release.yml` un paso con `NPM_TOKEN`
- **THEN** el paso falla y nombra `release.yml` y la norma de la publicación

### Requirement: Regula cumple las normas de tests
Regula SHALL cumplir las normas de tests el día que se publican: ningún e2e espera un tiempo fijo, el CI falla con un test inestable y los saltos condicionales de tests llevan su motivo.

#### Scenario: Repo actual
- **WHEN** corren el CI y `check:dev` en la rama principal
- **THEN** pasan «Normas de desarrollo», «Biome» y los e2e, sin tests marcados como inestables

### Requirement: Regula cumple las normas de seguridad
Regula SHALL cumplir las normas de seguridad el día que se publican:
- las acciones de terceros de sus workflows van por SHA, y Dependabot las actualiza;
- ningún `run:` interpola el contexto del evento ni el nombre de la rama;
- `release.yml` publica sin ningún camino para `NPM_TOKEN`;
- la raíz tiene `SECURITY.md`, y el repo tiene activados el aviso privado de vulnerabilidades y las actualizaciones de seguridad de Dependabot;
- la auditoría no da avisos altos ni críticos sin excepción vigente.

#### Scenario: Aviso privado
- **WHEN** alguien abre la pestaña de seguridad del repo de Regula en GitHub
- **THEN** puede avisar en privado de una vulnerabilidad, como dice `SECURITY.md`

### Requirement: Cabeceras de seguridad comprobadas
Un test de la web SHALL fallar si la configuración de despliegue no envía en todas las rutas `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y una CSP con `frame-ancestors 'none'`. El e2e que recorre todas las páginas SHALL fallar si una página no lleva CSP o si el navegador informa de una violación de la CSP, nombrando la página y la directiva.

#### Scenario: Script bloqueado
- **WHEN** una PR añade un script en línea que la CSP no permite
- **THEN** el e2e falla y nombra la página y `script-src`

#### Scenario: Cabecera quitada
- **WHEN** una PR quita `X-Content-Type-Options` de la configuración de despliegue
- **THEN** el test de las cabeceras falla y nombra la cabecera

### Requirement: Regula cumple el OWASP Top 10
La web de Regula SHALL cumplir `SEC-011` a `SEC-020` en lo que le aplica: es pública, de solo lectura y sin usuarios, así que `SEC-017` no aplica, y de `SEC-011` solo aplican CORS y SSRF. La ruta `/mcp` SHALL responder a un cuerpo mal formado con un error JSON-RPC genérico, sin traza, y un test SHALL comprobarlo.

#### Scenario: Cabeceras en producción
- **WHEN** alguien pide `https://regula.jotis.me/` tras el despliegue
- **THEN** la respuesta trae la CSP y las cabeceras de `SEC-012`

#### Scenario: MCP con un cuerpo roto
- **WHEN** alguien envía a `/mcp` un cuerpo que no es JSON
- **THEN** recibe un error JSON-RPC de parseo, sin traza ni rutas del servidor
