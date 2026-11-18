# Design

## Context

Las normas viven en `apps/docs/src/content/standards/*.yaml`, con el esquema de `apps/docs/src/lib/standards.ts`. `problemsOf` comprueba que cada verificación automática existe: un paso de `ci.yml`, una regla de `biome.json` o un archivo de test. Las comprobaciones de desarrollo están en `scripts/check-dev.ts`, como funciones puras por área (`stackProblems`, `codeProblems`, `structureProblems`…) que ya leen los workflows con `Bun.YAML.parse`.

Estado medido el 2026-11-18 (ver proposal.md, «Why»):

| Punto | Estado hoy |
| --- | --- |
| `bun audit` | 2 avisos altos: `path-to-regexp` (6.1.0, vía `@vercel/routing-utils`) y `picomatch` (≤ 4.0.7, vía Astro, Vite y changesets). Los demás `path-to-regexp` (0.1.13, 6.3.0 y 8.4.2) no están afectados |
| Opciones de `bun audit` (1.4.4) | `--audit-level`, `--ignore=<GHSA>` (repetible), `--json`, `--prod`. No tiene archivo de configuración ni caducidad |
| Permisos | `ci.yml` y `lighthouse-publicada.yml` con `contents: read` en la raíz; `release.yml` con `{}` y los de escritura en su job. Ya cumplen |
| Acciones de terceros | `oven-sh/setup-bun@v2` (en los tres workflows) y `changesets/action@v1` (en `release.yml`) |
| Interpolación en `run:` | Los tres pasos de «Commits» usan `github.event.pull_request.*.sha` y `github.head_ref`. Ningún workflow usa `pull_request_target` |
| `release.yml` | Conserva `HAS_NPM_TOKEN` y el paso «Token temporal de npm». La publicación usa `--provenance` (`scripts/release.ts`) |
| GitHub | Secret scanning y push protection activados. El aviso privado de vulnerabilidades y las actualizaciones de seguridad de Dependabot, apagados |
| `.gitignore` | Ignora `.env` y `.env.*`, salvo `.env.example` |
| Herramientas de tests | Vitest en los tres paquetes y en la web, Playwright en sus `test:e2e`, `bun test` en `scripts/`. Ni Jest, ni Mocha, ni Cypress |
| Esperas fijas | `waitForTimeout` en `button-utility.spec.ts` (500 ms), `chat-live.spec.ts` (3500 y 3000 ms) y `copy.spec.ts` (7000 ms), y un `setTimeout` de 40 ms en un bucle de `components.spec.ts` |
| Reintentos | `apps/docs/playwright.config.ts` reintenta una vez en el CI y no falla con los inestables. Los `playwright.config` de los paquetes no reintentan |
| `.only` y `.skip` | Ningún `.only`. Un `test.skip(condición, motivo)` en `visual.spec.ts` |
| Cabeceras y CSP | `apps/docs/vercel.json` solo tiene `ignoreCommand`: ninguna cabecera de seguridad ni CSP. Astro 7.4 trae `security.csp`, que añade a cada página una `<meta http-equiv="content-security-policy">` con los hashes de sus scripts y estilos. Una CSP en `<meta>` no admite `frame-ancestors`, que tiene que ir como cabecera |
| HTML crudo y `eval` | Biome ya tiene `noDangerouslySetInnerHtml` y `noGlobalEval` (preset `recommended`). Los 4 `dangerouslySetInnerHTML` de `@jotis-me/react` llevan su motivo. Los `set:html` de la web pintan Markdown del propio repo |
| `/mcp` | La única ruta de servidor (`src/features/mcp/route.ts`), pública y de solo lectura, sin CORS propio ni límite de peticiones. Los errores de parseo los responde el SDK de MCP con JSON-RPC, y el `catch` de las herramientas devuelve `error.message` |
| axe | `apps/docs/e2e/a11y.spec.ts` pasa axe por todas las páginas construidas, con las excepciones de contraste de la guía; 54 de los 102 tests de `@jotis-me/react` usan `axe-core` |

## Goals / Non-Goals

**Goals:**
- 26 normas nuevas, 6 de tests y 20 de seguridad, 10 de ellas del OWASP Top 10:2025 (D2 y D11), con el esquema y la calidad de ejemplos de las áreas anteriores.
- Toda norma automática tiene su comprobación en verde en Regula el día que se publica.

**Non-Goals:**
- Un escáner dinámico (OWASP ZAP) en el CI, que se descartó con el usuario.
- Implementar `SEC-012` en los ejemplos, que no se despliegan (D12).
- Fijar por SHA las acciones de `actions/*` y `github/*`.
- Fijar `npm install -g npm@latest` en `release.yml`. Hace falta npm ≥ 11.5.1 para trusted publishing, y viene del registro oficial.
- CodeQL, OpenSSF Scorecard, SBOM y la firma de commits.
- Medir la cobertura.

## Decisions

### D1. Áreas y orden

| Archivo | Slug | Título | Prefijo | `order` |
| --- | --- | --- | --- | --- |
| `naming.yaml` | `naming` | Nombres | `NAM` | 1 |
| `language.yaml` | `language` | Idioma | `LNG` | 2 |
| `stack.yaml` | `stack` | Stack y herramientas | `STK` | 3 |
| `structure.yaml` | `structure` | Estructura | `STR` | 4 |
| `code.yaml` | `code` | Código | `COD` | 5 |
| `testing.yaml` | `testing` | Tests | `TST` | 6 |
| `documentation.yaml` | `documentation` | Documentación | `DOC` | 7 |
| `versioning.yaml` | `versioning` | Versiones y dependencias | `VER` | 8 |
| `security.yaml` | `security` | Seguridad | `SEC` | 9 |
| `git.yaml` | `git` | Git | `GIT` | 10 |
| `ci.yaml` | `ci` | CI | `INT` | 11 |
| `process.yaml` | `process` | Proceso | `PRO` | 12 |

Tests va detrás de Código porque se escribe con él. Seguridad va detrás de Versiones porque la mitad de sus normas tratan dependencias y publicación. Se descartó un área única «Calidad»: mezclaría dos prefijos de temas distintos, y el usuario pidió las normas por separado. El slug es `testing` y no `tests`, por coherencia con `naming` y `versioning`. Las URL de las demás áreas no cambian.

### D2. Las normas

| ID | Nivel | Aplica | Norma | Verificación |
| --- | --- | --- | --- | --- |
| TST-001 | must | all | Cada cambio de comportamiento o arreglo lleva un test que fallaría sin él | review |
| TST-002 | must | all | Vitest con jsdom, Playwright y `bun test`; ni Jest, ni Mocha, ni Cypress | ci «Normas de desarrollo» |
| TST-003 | should | all | Se prueba lo que se ve (rol, nombre accesible, texto) | review |
| TST-004 | must | all | Tests deterministas: sin esperas fijas ni red externa; reloj y azar controlados; un inestable falla | ci «Normas de desarrollo» |
| TST-005 | must | all | axe pasa en cada componente público y en cada página; capturas aprobadas (`should`, en el mismo enunciado) | ci «Web (funcional, axe y paridad visual)» |
| TST-006 | must | all | Ni `.only` ni `.skip` sin motivo | biome `noFocusedTests` |
| SEC-001 | must | all | `bun audit` en el CI, falla con alto o crítico | ci «Auditoría» |
| SEC-002 | must | all | Excepciones con ID, motivo y caducidad | ci «Auditoría» |
| SEC-003 | must | all | Actualizaciones de seguridad de Dependabot activadas | review |
| SEC-004 | should | all | Scripts de instalación solo en `trustedDependencies`, con motivo en la PR | review |
| SEC-005 | must | package | Trusted publishing y provenance, sin tokens de npm | ci «Normas de desarrollo» |
| SEC-006 | must | all | `permissions` mínimos: raíz vacía o de lectura, escritura por job | ci «Normas de desarrollo» |
| SEC-007 | must | all | Acciones de terceros por SHA con la versión en comentario | ci «Normas de desarrollo» |
| SEC-008 | must | all | Sin `pull_request_target` ni interpolar `github.event.*` o `github.head_ref` en `run:` | ci «Normas de desarrollo» |
| SEC-009 | must | all | Sin secretos en el repo; secret scanning y push protection | ci «Normas de desarrollo» (la parte de `.gitignore`) |
| SEC-010 | must | all | `SECURITY.md` con el aviso privado de GitHub | ci «Normas de desarrollo» |
| SEC-011 | must | app | A01 Control de acceso: el servidor comprueba permisos y deniega por defecto; CORS sin `*` con credenciales; sin SSRF | review |
| SEC-012 | must | app | A02 Configuración insegura: CSP y cabeceras de seguridad, sin mapas de código en producción | test `apps/docs/test/security-headers.test.ts` |
| SEC-013 | must | all | A03 Cadena de suministro: dependencias solo del registro, `integrity` en scripts de otro origen | ci «Normas de desarrollo» |
| SEC-014 | must | app | A04 Criptografía: HTTPS, ningún secreto en el navegador, Web Crypto, contraseñas en el proveedor | review |
| SEC-015 | must | all | A05 Inyección: HTML crudo solo de contenido propio o limpio, sin `eval`, entrada validada, consultas parametrizadas | biome `noDangerouslySetInnerHtml` |
| SEC-016 | must | all | A06 Diseño inseguro: sección «Seguridad» en el `design.md` y límite de peticiones en los endpoints públicos | review |
| SEC-017 | must | app | A07 Autenticación: biblioteca o proveedor, cookies `HttpOnly`, límite de intentos, segundo factor | review |
| SEC-018 | must | all | A08 Integridad: firma en los webhooks, esquema al deserializar, provenance | review |
| SEC-019 | must | app | A09 Registro y alertas: errores registrados sin secretos, aviso ante un pico | review |
| SEC-020 | must | app | A10 Condiciones excepcionales: fallar cerrado, errores genéricos, límites de tamaño y de tiempo | test `apps/docs/test/mcp.test.ts` |

Del borrador que se debatió, la capa de axe y la de capturas quedan en una sola norma (`TST-005`): las dos van en el mismo paso, y el enunciado dice que las capturas son `should`. La auditoría y sus excepciones se separan (`SEC-001` y `SEC-002`), porque se incumplen por separado. El lockfile congelado no lleva norma `SEC`: ya es `VER-006`, y su porqué gana una frase sobre la cadena de suministro.

`TST-006` verifica con `noFocusedTests` porque `problemsOf` busca una sola regla. `noSkippedTests` también entra en `biome.json`, y el enunciado nombra las dos.

`SEC-003` y la parte de GitHub de `SEC-009` y `SEC-010` son de revisión. Leer `security_and_analysis` pide un token con permiso de administración, y el `GITHUB_TOKEN` del CI no lo tiene. `check:dev` solo comprueba lo que está en el repo.

### D3. La auditoría: `scripts/check-audit.ts` y `audit-exceptions.json`

`bun audit` no admite caducidades ni motivos, así que un script propio la envuelve:

```json
[
	{
		"id": "GHSA-9wv6-86v2-598j",
		"package": "path-to-regexp",
		"why": "Llega por @vercel/routing-utils, que fija 6.1.0. Solo procesa las rutas de vercel.json en el build",
		"until": "2027-02-18"
	}
]
```

1. Lee `audit-exceptions.json` y falla si a una entrada le falta un campo, si `until` no es una fecha `AAAA-MM-DD` o si ya pasó.
2. Ejecuta `bun audit --audit-level=high --json`, sin `--prod`: las de desarrollo corren en el CI con sus secretos y en la publicación.
3. Falla por cada aviso que no tiene excepción, con el paquete, el ID y la severidad.
4. Falla por cada excepción cuyo aviso ya no sale, para que el archivo no acumule entradas muertas.

Es la parte pura (`auditProblems(report, exceptions, today)`) la que tiene tests, con un JSON de `bun audit` guardado como fixture: el test no usa la red (TST-004). Paso «Auditoría» en «Comprobaciones», detrás de «Normas de desarrollo». El archivo va en la raíz para que se vea en la PR. Se descartó guardarlo en `bunfig.toml`, porque Bun no lo lee para `audit`, y en `.github/`, porque no es configuración de GitHub.

La caducidad máxima es de tres meses. Así una excepción se revisa al menos una vez por trimestre, y el script falla si `until` está más lejos de eso.

Se descartó `--prod` (lo que decidió el usuario es «alto o crítico en todo») y la acción `actions/dependency-review-action`, que solo mira lo que añade la PR y no ve un aviso nuevo de una dependencia vieja.

### D4. Los dos avisos de hoy

Primero `bun audit fix --dry-run`. Si sube `picomatch` dentro de los rangos, se aplica. Si no, va un `overrides` en el `package.json` raíz, como los de `@emnapi/*`, comprobando después `turbo run build typecheck test` y `astro check`. `path-to-regexp` 6.1.0 lo fija `@vercel/routing-utils`. Si forzar 6.3.0 rompe el build de Vercel, queda como excepción con el motivo de D3 y una caducidad de tres meses. Lo que haya que forzar no cambia lo que instalan los usuarios de los paquetes publicados, porque llega por la web y por herramientas de desarrollo. Así que no lleva changeset.

### D5. Comprobaciones nuevas en `check:dev`

Dos funciones nuevas, `testingProblems(repo)` y `securityProblems(repo)`, en el patrón de las demás, con fixtures en `check-dev.test.ts`:

- **TST-002:** ningún workspace depende de `jest`, `mocha`, `cypress` ni de `@jest/*`. Un script `test` contiene `vitest` o `bun test`, y un `test:e2e`, `playwright test`.
- **TST-004:**
  - ninguna línea de `e2e/**` contiene `waitForTimeout(`;
  - todo `playwright.config.ts` con `retries` distinto de 0 tiene `failOnFlakyTests`. Es una búsqueda de texto: la configuración no se ejecuta, y Biome la formatea de forma predecible.

  El `setTimeout` dentro de un `new Promise` no se detecta. Es raro y lo cubre la revisión.
- **SEC-005:** ningún workflow contiene `NPM_TOKEN` ni `NODE_AUTH_TOKEN`, y `scripts/release.ts` pasa `--provenance`.
- **SEC-006:** cada workflow tiene `permissions` en la raíz con `{}` o solo con valores `read`.
- **SEC-007:** cada `uses:` de un paso o de un job que no empieza por `actions/`, `github/` ni `./` lleva `@` y 40 caracteres hexadecimales. El comentario de la versión se mira en el texto crudo de la línea, porque `Bun.YAML.parse` quita los comentarios.
- **SEC-008:** ningún `on` incluye `pull_request_target`, y ningún `run:` contiene `${{ github.event.` ni `${{ github.head_ref`.
- **SEC-009:** `.gitignore` tiene líneas `.env` y `.env.*`.
- **SEC-010:** existe `SECURITY.md` en la raíz.
- **SEC-013:** ninguna dependencia de un `package.json` es una URL (`github:`, `git+`, `http:`, `https:` o `file:` a un `.tgz`). `workspace:` y `npm:` valen.

`noFocusedTests` y `noSkippedTests` van en `error` en `biome.json`. El `test.skip` condicional de `visual.spec.ts` lleva `biome-ignore lint/suspicious/noSkippedTests: <motivo>`, que `COD-005` ya exige con motivo.

### D6. Tests inestables

`failOnFlakyTests: !!process.env.CI` en `apps/docs/playwright.config.ts`, y se mantiene `retries: 1`. El reintento sigue sirviendo para el informe: Playwright marca el test como inestable en lugar de fallar sin más. Se descartó quitar los reintentos: el fallo sería el mismo, pero sin la etiqueta que dice que es inestable y no un fallo real.

### D7. Las esperas fijas

Cada `waitForTimeout` se cambia por una de dos cosas:
- **una espera a la condición** que el test busca de verdad: `expect(...).toBeVisible()`, `toHaveText` o `toHaveAttribute`, que ya reintentan solas;
- **`page.clock`**, cuando lo que se prueba es que algo pasa tras un tiempo (el texto del botón de copiar vuelve tras unos segundos, el chat en vivo escribe con retardo). `page.clock.install()` y `runFor(ms)` adelantan el reloj sin esperar.

El bucle de `components.spec.ts` se mira caso a caso con el mismo criterio.

### D8. Workflows

- **SHA:** se resuelven con `gh api repos/<owner>/<repo>/git/ref/tags/<tag>`, siguiendo la etiqueta anotada hasta el commit, para la versión exacta que hay hoy detrás de `v2` y de `v1`. Se escriben como `oven-sh/setup-bun@<sha> # v2.x.y`. Dependabot (`github-actions`, ya configurado) actualiza los SHA y el comentario. No hace falta tocar `dependabot.yml`.
- **`env:`:** los tres pasos de «Commits» pasan a:

  ```yaml
  - name: Changesets
    env:
        BASE: ${{ github.event.pull_request.base.sha }}
        HEAD: ${{ github.event.pull_request.head.sha }}
        BRANCH: ${{ github.head_ref }}
    run: bun run scripts/check-changesets.ts "$BASE" "$HEAD" "$BRANCH"
  ```

  Los SHA no se pueden manipular, pero la norma no distingue campos del evento: es más simple prohibirlos todos en `run:` que mantener una lista de los seguros.
- **`release.yml`:** se quitan `HAS_NPM_TOKEN` y el paso «Token temporal de npm», y su comentario de la cabecera. La 0.10.1 ya salió sin token.

### D9. `SECURITY.md` y los ajustes de GitHub

`SECURITY.md` en español (LNG). Dice qué versiones reciben arreglos (la última 0.x publicada), cómo avisar (el formulario de aviso privado de la pestaña de seguridad del repo, y que no se abra un issue público) y qué esperar después. Los dos ajustes del repo se cambian con `gh api`:
- `PUT repos/Jotis1/regula/private-vulnerability-reporting`;
- `PUT repos/Jotis1/regula/automated-security-fixes`.

Son acciones fuera del repo, así que se piden al usuario antes de hacerlas.

### D11. El OWASP Top 10:2025

El usuario fijó que todos los proyectos aseguran la web contra el OWASP Top 10, con una norma por categoría (`SEC-011` a `SEC-020`, de A01 a A10). Se usa la versión 2025, final desde enero de 2026. El título de cada norma empieza por su código (`A01 Control de acceso`), para que se pueda citar por los dos nombres.

Cada norma da los dos caminos de la suite: qué se usa en Next (Server Actions, `proxy.ts`, `next.config.ts`) y qué en Astro (`security.csp`, endpoints, `astro:env`). Lo que ya cubre otra norma no se repite: el porqué la nombra. A03 remite a `SEC-001`, `SEC-002`, `SEC-005`, `SEC-007` y `VER-006`, y solo añade las dependencias de Git y el `integrity`.

Cómo se verifica:
- **Se comprueban:**
  - **A02:** las cabeceras, con un test y un e2e (D12);
  - **A03:** las URL de Git o de tarball en un `package.json`, en `check:dev` (`securityProblems`);
  - **A05:** el HTML crudo y `eval`, con Biome, que ya los vigila;
  - **A10:** el error genérico de `/mcp`, con un test.
- **Son de revisión** A01, A04, A06, A07, A08 y A09. Dependen de qué hace el código, y ninguna regla lo mide sin falsos positivos. Cada una dice qué tiene que mirar quien revisa.

Una app sin servidor o sin usuarios cumple las normas de `app` que no le aplican sin hacer nada. La web de Regula es pública, de solo lectura y sin usuarios: A07 no le aplica, y de A01 solo CORS y SSRF (`/mcp` no pide URL que lleguen del usuario).

### D12. Cabeceras y CSP

**Astro (la web):**
- `security: { csp: true }` en `astro.config.mjs`. Astro calcula los hashes de los scripts y estilos de cada página y los pone en una `<meta>`. Se prefiere a una CSP escrita a mano en `vercel.json`, que tendría que llevar `unsafe-inline` para los scripts de Astro (lo nativo primero, `COD-015`).
- En `vercel.json`, `headers` para `/(.*)` con:
  - `Content-Security-Policy: frame-ancestors 'none'` (la `<meta>` no la admite);
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains`;
  - `X-Content-Type-Options: nosniff`;
  - `Referrer-Policy: strict-origin-when-cross-origin`;
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

  El navegador aplica a la vez las dos CSP, la de la cabecera y la de la `<meta>`, y una petición tiene que pasar las dos.
- **Comprobación:**
  - `apps/docs/test/security-headers.test.ts` lee `vercel.json` y falla si falta una cabecera o un valor;
  - el e2e de `a11y.spec.ts`, que ya recorre todas las páginas, gana un `addInitScript` que recoge los eventos `securitypolicyviolation`. Falla si una página no tiene la `<meta>` o si hubo alguna violación;
  - `astro preview` no aplica `vercel.json`, así que tras el despliegue se mira la respuesta real (en el «Workflow follow-up» de las tareas).

**Next (la guía):** la norma da las cabeceras en `headers()` de `next.config.ts` y la CSP con *nonce* en `proxy.ts`, como pide la documentación de Next. Ningún proyecto de la suite despliega Next todavía, y los ejemplos no se despliegan, así que `SEC-012` se aplica a las apps con `vercel.json` (la misma regla que `STK-006`). La primera app de Next de la suite probará el bloque.

### D13. `/mcp`: errores y límite de peticiones

- **Errores (A10):**
  - un caso nuevo en `test/mcp.test.ts` envía a `handle` un cuerpo que no es JSON y comprueba que la respuesta es un error JSON-RPC `-32700`, sin trazas ni rutas de archivo;
  - el `catch` de las herramientas sigue devolviendo `error.message`, porque los errores de `tool.run` los escribe Regula y no llevan rutas. Otro caso fuerza un fallo de `load` y comprueba que el mensaje no trae traza.
- **Tamaño (A10):** medido al implementar: el SDK de MCP (1.32.2) ya rechaza con 413 un cuerpo de más de 4 MB (`maxRequestBodySize`), sin leerlo entero. No se añade un límite propio (lo nativo primero, `COD-015`); un test lo cubre.
- **Límite de peticiones (A06):** una regla de *rate limit* del firewall de Vercel para `/mcp` (lo nativo primero): 100 peticiones por minuto e IP, con respuesta 429. Es un ajuste del proyecto en Vercel, fuera del repo, así que se pide permiso al usuario.
- **CORS (A01):** `/mcp` no envía `Access-Control-Allow-Origin`. Los clientes MCP no son navegadores, así que no hace falta.

### D14. Orden de los commits

Uno por pieza (GIT-005), y cada comprobación en el mismo commit que deja el repo limpio para ella:
1. Las esperas fijas y `failOnFlakyTests`.
2. `noFocusedTests` y `noSkippedTests`, con el `biome-ignore` del salto.
3. Los SHA, `env:` en «Commits» y la limpieza de `release.yml`.
4. `SECURITY.md`.
5. Los avisos de hoy (D4) y `check-audit.ts` con su paso.
6. `testingProblems` y `securityProblems` en `check:dev`.
7. La CSP y las cabeceras de la web, con su test y el e2e (D12).
8. Los errores y el tamaño de `/mcp`, con sus tests (D13).
9. El orden de las áreas y los YAML de las normas.

Los ajustes de GitHub (D9) y el límite de peticiones de Vercel (D13) van después de fusionar, o antes si el usuario lo prefiere, pero no dependen del código.

## Risks / Trade-offs

- **[`failOnFlakyTests` destapa tests inestables que hoy pasan en silencio, sobre todo en Firefox y WebKit]** → Es lo que busca la norma. Los que salgan se arreglan en esta PR. Si uno no tiene arreglo razonable, se para y se decide con el usuario, sin ninguna lista de excepciones.
- **[Un aviso nuevo bloquea todas las PR, también las que no tocan dependencias]** → Es lo que decidió el usuario. La salida rápida es una excepción con caducidad, que se revisa en la propia PR. Las actualizaciones de seguridad de Dependabot suelen traer el arreglo antes.
- **[`bun audit` necesita la red y la base de avisos de npm]** → Si el registro falla, el paso falla y se relanza, como pasa ya con `bun install`. No se añade lógica de reintentos.
- **[El formato JSON de `bun audit` cambia entre versiones de Bun]** → El fixture del test lo fija y `packageManager` fija la versión. Al subir Bun, el test de `check-audit` lo detecta.
- **[Dependabot y los SHA]** → Dependabot actualiza `uses:` con SHA cuando lleva el comentario de la versión. Se comprueba en su primera PR de `github-actions` tras fusionar.
- **[La CSP rompe algo que hoy funciona: islas de React, el script del tema, los estilos en línea]** → El e2e de las violaciones lo encuentra página a página. `security.csp` cubre los scripts y estilos que genera Astro. Los atributos `style=` que pinta React en el servidor dependen de `style-src-attr`: se mide al activar la CSP y, si hace falta, se añade `'unsafe-inline'` solo en `style-src-attr`, que no ejecuta código. `script-src` no lleva nunca `unsafe-inline` ni `unsafe-eval`.
- **[`astro preview` no aplica `vercel.json`]** → El test lee el archivo y la comprobación tras el despliegue mira la respuesta real. Las vistas previas de Vercel también aplican `vercel.json`.
- **[`page.clock` no cubre todos los temporizadores (animaciones CSS)]** → Para las animaciones, el test espera al estado final con `expect`, no al tiempo.

## Migration Plan

Las PR abiertas al fusionar tendrán que rebasar. Una PR que traiga una acción de terceros por etiqueta, o un `run:` con contexto del evento, fallará en «Normas de desarrollo» y se arregla con el ejemplo de la norma. El ruleset no cambia: «Auditoría» va dentro de «Comprobaciones», que ya exige la puerta «CI».

## Open Questions

(ninguna)
