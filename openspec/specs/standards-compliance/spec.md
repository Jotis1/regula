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
