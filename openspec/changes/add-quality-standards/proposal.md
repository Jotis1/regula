# Proposal

## Why

Las normas de desarrollo (cambio 3) dejaron fuera los tests y la seguridad, que son el punto 2 de la hoja de ruta hacia la beta. Hoy Regula prueba mucho, pero nada dice cómo ni lo exige. Y sin una norma, la seguridad depende de que alguien se acuerde. Medido el 2026-11-18:
- `bun audit` da 2 avisos altos (`path-to-regexp` y `picomatch`, transitivos) y el CI no lo ejecuta;
- `ci.yml` interpola `${{ github.head_ref }}`, el nombre de la rama que elige quien abre la PR, dentro de un `run:`;
- `oven-sh/setup-bun` y `changesets/action`, que es la que corre en la publicación, van por etiqueta y no por SHA;
- `release.yml` conserva la rama del `NPM_TOKEN`, aunque el secreto se borró el 2026-11-17;
- no hay `SECURITY.md`, y el aviso privado de vulnerabilidades y las actualizaciones de seguridad de Dependabot están apagados;
- cuatro e2e esperan con `waitForTimeout`, y Playwright reintenta en el CI sin que un test inestable haga fallar nada;
- la web no envía cabeceras de seguridad ni CSP (`apps/docs/vercel.json` solo tiene `ignoreCommand`), y ninguna norma pide cubrir los riesgos del OWASP Top 10.

El usuario fijó el 2026-11-18 que todos los proyectos de la suite aseguran la web contra el OWASP Top 10.

## What Changes

- **Dos áreas nuevas:** «Tests» (`TST`, slug `testing`) detrás de Código y «Seguridad» (`SEC`, slug `security`) detrás de Versiones. El orden queda: Nombres, Idioma, Stack, Estructura, Código, Tests, Documentación, Versiones, Seguridad, Git, CI y Proceso.
- **Tests (`TST`):**
  - todo cambio de comportamiento y todo arreglo lleva un test que fallaría sin él. **Sin umbral de cobertura** (decisión del usuario): un porcentaje invita a tests vacíos;
  - cada herramienta para lo suyo: Vitest con jsdom, Playwright con navegador real y `bun test` para los scripts;
  - los tests prueban lo que se ve (por rol), no lo interno (`should`);
  - tests deterministas: sin esperas fijas ni red externa, con el reloj y el azar controlados, y un test inestable hace fallar el CI;
  - axe pasa en cada componente público y en cada página, y la apariencia se compara con capturas aprobadas (esto último, `should`);
  - ni `.only` ni `.skip` sin motivo.
- **Seguridad (`SEC`):**
  - `bun audit` en el CI. Falla con avisos altos o críticos (decisión del usuario), y cada excepción lleva el ID del aviso, el motivo y una fecha de caducidad;
  - las actualizaciones de seguridad de Dependabot, activadas;
  - publicar en npm con trusted publishing y provenance, sin tokens;
  - los workflows piden los permisos mínimos;
  - las acciones de terceros (fuera de `actions/*` y `github/*`) se fijan por SHA con el comentario de la versión, y Dependabot los actualiza (decisión del usuario). Las oficiales siguen por etiqueta mayor;
  - sin inyección en los workflows: ni `pull_request_target` ni `${{ github.event.* }}` ni `${{ github.head_ref }}` dentro de `run:`, que se pasan por `env:`;
  - ningún secreto en el repo: `.env*` ignorado, y secret scanning y push protection activados;
  - los scripts de instalación, solo de paquetes de `trustedDependencies` con su motivo (`should`);
  - un `SECURITY.md` con el canal privado de aviso;
  - **el OWASP Top 10:2025, una norma por categoría** (decisión del usuario), de A01 a A10. Cada una dice qué hacer en Next y en Astro y nombra las normas que ya cubren parte de ella. Las de diseño (control de acceso, diseño inseguro, autenticación, registro) son de revisión. La de configuración insegura (A02) se comprueba: cabeceras de seguridad y CSP en cada app que se despliega.
- **Lo que ya existe no se repite:** el lockfile congelado ya es `VER-006` y no lleva norma `SEC`.
- **Regula las cumple:**
  - un paso nuevo «Auditoría» en «Comprobaciones», con `scripts/check-audit.ts` y `audit-exceptions.json`;
  - `check:dev` gana las comprobaciones automáticas de las dos áreas;
  - Biome con `noFocusedTests` y `noSkippedTests`;
  - Playwright con `failOnFlakyTests` en el CI;
  - los `waitForTimeout` fuera;
  - los SHA de las dos acciones de terceros;
  - `head_ref` y los `github.event.*` por `env:`;
  - la rama del `NPM_TOKEN` fuera de `release.yml`;
  - `SECURITY.md`;
  - la web con CSP (`security.csp` de Astro) y las cabeceras de seguridad en `vercel.json`, comprobadas por un test y por un e2e que falla con cualquier violación de la CSP;
  - la ruta `/mcp` responde a una petición mal formada con un error genérico, sin traza (A10);
  - los dos avisos de hoy, arreglados o con su excepción;
  - y, con permiso del usuario, los dos ajustes del repo en GitHub.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `engineering-standards`: el orden de las áreas, y las áreas de tests y de seguridad.
- `standards-compliance`: la auditoría en el CI, las comprobaciones de tests y de seguridad, y que Regula las cumple.

## Impact

- **Normas:** `apps/docs/src/content/standards/testing.yaml` y `security.yaml`, los `order` nuevos y dos entradas en `STANDARD_AREAS`. También el orden que fijan `standards.test.ts`, `mcp-tools.test.ts` y, si lo fija, `standards.spec.ts`.
- **Scripts y CI:**
  - `scripts/check-audit.ts` y su test, y `audit-exceptions.json`;
  - `scripts/check-dev.ts` y su test;
  - `ci.yml` (paso «Auditoría», `env:` en los pasos de «Commits», SHA de `setup-bun`) y `release.yml` (SHA de `changesets/action`, sin `NPM_TOKEN`);
  - `.github/dependabot.yml`, si hace falta para los SHA.
- **Web:** `apps/docs/vercel.json` (cabeceras), `apps/docs/astro.config.mjs` (`security.csp`), un test de las cabeceras, la escucha de violaciones de la CSP en el e2e que recorre todas las páginas, y un caso de error en `mcp.spec.ts`.
- **Configuración:** `biome.json`, `apps/docs/playwright.config.ts` y los de los paquetes con e2e, `package.json` raíz (`overrides`, si arreglan los avisos) y `SECURITY.md`.
- **Tests:** los cuatro e2e con `waitForTimeout` (`button-utility`, `chat-live` y `copy`) y el `test.skip` condicional de `visual.spec.ts`, que lleva su motivo.
- **GitHub (fuera del repo, con permiso del usuario):** activar el aviso privado de vulnerabilidades y las actualizaciones de seguridad de Dependabot.
- **Paquetes publicados:** no cambian. Si un `override` cambia lo que instala quien usa un paquete, lleva changeset `patch`.
- **Fuera de alcance:**
  - un escáner dinámico (OWASP ZAP) en el CI: se descartó con el usuario, por KISS;
  - SEO, rendimiento, accesibilidad e i18n, y el arreglo de Lighthouse;
  - un umbral de cobertura;
  - CodeQL y OpenSSF Scorecard.
