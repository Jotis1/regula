# Tasks

Cada tarea, o cada pieza coherente, va en su propio commit (GIT-005), en el orden de D14. Cada comprobación entra en el mismo commit que deja el repo limpio para ella.

Comandos:
- `bunx biome ci --error-on-warnings .`
- `bunx turbo run build typecheck test`
- `bun run check:ci` y `bun run check:dev`
- `bun audit --audit-level=high`
- `openspec validate add-quality-standards --strict`

## 1. Tests deterministas

- [x] 1.1 Cambiar los `waitForTimeout` de `button-utility.spec.ts`, `chat-live.spec.ts` y `copy.spec.ts` por una espera a la condición o por `page.clock` (D7), y revisar el `setTimeout` del bucle de `components.spec.ts`. Comprobar que esos e2e pasan cinco veces seguidas con `--repeat-each=5` en Chromium y, los de `cross-browser`, también en Firefox y WebKit
- [x] 1.2 `failOnFlakyTests: !!process.env.CI` en `apps/docs/playwright.config.ts`, con `retries: 1` (D6). Comprobar en local con `CI=1` que un test que falla a propósito en el primer intento y pasa en el segundo hace fallar la ejecución, y quitar ese test
- [ ] 1.3 `noFocusedTests` y `noSkippedTests` en `error` en `biome.json`, y el `biome-ignore` con motivo en el `test.skip` condicional de `visual.spec.ts`. Comprobar con Biome que el repo pasa, y que un `it.only` de prueba lo hace fallar

## 2. Workflows

- [ ] 2.1 Fijar por SHA `oven-sh/setup-bun` en los tres workflows y `changesets/action` en `release.yml`, con la versión exacta en un comentario (D8). Comprobar que cada SHA es el commit de esa etiqueta con `gh api`
- [ ] 2.2 Pasar por `env:` los valores de `github.event.*` y `github.head_ref` de «Conventional Commits», «Tipografía» y «Changesets» (D8). Comprobar que ningún `run:` de `.github/workflows/` contiene `${{ github.event.` ni `${{ github.head_ref`, y que el job «Commits» pasa en la PR
- [ ] 2.3 Quitar `HAS_NPM_TOKEN`, el paso «Token temporal de npm» y su comentario de `release.yml`. Comprobar que ningún workflow nombra `NPM_TOKEN` y que `bun run scripts/release.ts --dry-run` sigue pasando `--provenance`

## 3. Avisos

- [ ] 3.1 `SECURITY.md` en la raíz (D9), en español y sin «·» ni rayas. Comprobar con `check:dev` (tipografía) y que el enlace al aviso privado apunta a la pestaña de seguridad del repo

## 4. Auditoría

- [ ] 4.1 Arreglar los dos avisos de hoy (D4): `bun audit fix --dry-run` y, si no basta, `overrides`. Lo que no se pueda forzar queda en `audit-exceptions.json` con su motivo y una caducidad de tres meses. Comprobar con `bunx turbo run build typecheck test`, `astro check` de la web y `bun audit --audit-level=high` (solo quedan los avisos con excepción)
- [ ] 4.2 `scripts/check-audit.ts` y su test (D3), con un fixture de `bun audit --json` y estos casos:
  - un aviso alto sin excepción;
  - un aviso con excepción vigente;
  - una excepción caducada;
  - una excepción a más de tres meses;
  - una excepción sin motivo;
  - una excepción cuyo aviso ya no sale;
  - un aviso moderado, que no cuenta.

  Paso «Auditoría» en «Comprobaciones», detrás de «Normas de desarrollo». Comprobar con `bun test scripts/check-audit.test.ts` y con `bun run scripts/check-audit.ts` en el repo

## 5. Comprobaciones en `check:dev`

- [ ] 5.1 `testingProblems` (TST-002 y TST-004, D5) con fixtures en `check-dev.test.ts`: `jest` en un `package.json`, un `test` sin Vitest ni `bun test`, un `test:e2e` sin Playwright, un `waitForTimeout` en `e2e/` y un `playwright.config.ts` con `retries` y sin `failOnFlakyTests`. Comprobar con `bun run check:dev`
- [ ] 5.2 `securityProblems` (SEC-005 a SEC-010 y SEC-013, D5) con fixtures: una dependencia `github:` y otra `https:` a un `.tgz` (y `workspace:` y `npm:`, que pasan), `NPM_TOKEN` en un workflow, `release.ts` sin `--provenance`, `permissions` de escritura en la raíz y sin `permissions`, una acción de terceros por etiqueta, una con SHA y sin comentario, `actions/checkout@v7` (que pasa), `pull_request_target`, `${{ github.head_ref }}` en un `run:`, un `.gitignore` sin `.env` y la falta de `SECURITY.md`. Comprobar con `bun run check:dev`, y que añadir `uses: some-org/some-action@v3` a `ci.yml` lo hace fallar con el archivo, la acción y `SEC-007`

## 6. Web y `/mcp` (OWASP)

- [ ] 6.1 `security: { csp: true }` en `apps/docs/astro.config.mjs` y las cabeceras de D12 en `apps/docs/vercel.json`, con `apps/docs/test/security-headers.test.ts`. Comprobar con `bun run --cwd apps/docs test` y que quitar una cabecera hace fallar el test
- [ ] 6.2 Recoger los eventos `securitypolicyviolation` en `a11y.spec.ts` y exigir la `<meta>` de la CSP en cada página (D12). Arreglar lo que salga, con `'unsafe-inline'` solo en `style-src-attr` si los `style=` de React lo piden, y nunca en `script-src`. Comprobar con los e2e completos de la web en Chromium, Firefox y WebKit, el tema claro y el oscuro y las islas interactivas, sin ninguna violación
- [ ] 6.3 Los casos de error de `/mcp` en `test/mcp.test.ts` (D13): un cuerpo que no es JSON da `-32700` sin traza, y un fallo de `load` da un mensaje sin traza. Medir si el SDK limita el tamaño del cuerpo y, si no, rechazar con 413 más de 1 MB, con su test. Comprobar con `bun run --cwd apps/docs test`

## 7. Normas

- [ ] 7.1 Los `order` de D1, las dos entradas nuevas de `STANDARD_AREAS` y los YAML `testing.yaml` y `security.yaml`: las 26 normas de D2. Cada una lleva enunciado, porqué, un ejemplo que la cumple y otro que no, y su verificación. Las de OWASP (`SEC-011` a `SEC-020`, D11) empiezan el título por su código (A01 a A10), dan el camino de Next y el de Astro y nombran en el porqué las normas que ya las cubren en parte. `SEC-012` enseña el bloque de cabeceras de D12. `SEC-007` cita el ataque a `tj-actions/changed-files`. `TST-001` dice por qué no hay umbral de cobertura. Los ejemplos son los de los escenarios de la spec. El porqué de `VER-006` gana la frase de la cadena de suministro. Actualizar el orden fijado en `standards.test.ts`, `mcp-tools.test.ts` y, si lo fija, `standards.spec.ts`. Comprobar:
  - con `bun run --cwd apps/docs test`, con `problemsOf` en verde;
  - que `/standards.json` trae las 12 áreas en el orden de la spec;
  - que `get_standard` del MCP devuelve `SEC-007` y `SEC-012`;
  - con el e2e de normas
- [ ] 7.2 Comprobación final: Biome, `bunx turbo run build typecheck test`, `check:ci`, `check:dev`, `check-audit`, los e2e de la web y `openspec validate add-quality-standards --strict`, todo en verde en local antes de abrir la PR

## Workflow follow-up

- Con permiso del usuario, activar en GitHub el aviso privado de vulnerabilidades y las actualizaciones de seguridad de Dependabot (D9), y comprobarlo con `gh api repos/Jotis1/regula --jq .security_and_analysis` y `gh api repos/Jotis1/regula/private-vulnerability-reporting`.
- Con permiso del usuario, crear en el firewall de Vercel la regla de límite de peticiones de `/mcp` (D13), y comprobar que la petición 101 de un minuto recibe 429.
- Tras el despliegue, comprobar con `curl -sI https://regula.jotis.me/` que llegan la CSP y las cabeceras de `SEC-012`, y que la `<meta>` de la CSP está en el HTML.
- Tras fusionar, comprobar que la primera PR de Dependabot de `github-actions` actualiza bien un SHA y su comentario.
- Archivar el cambio cuando la PR esté fusionada.
