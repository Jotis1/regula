## ADDED Requirements

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
