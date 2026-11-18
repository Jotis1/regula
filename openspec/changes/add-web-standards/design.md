# Design

## Context

Las normas viven en `apps/docs/src/content/standards/<área>.yaml` (esquema en `src/lib/standards.ts`: `id`, `level`, `appliesTo`, `statement`, `rationale`, `examples`, `verification` con `kind` `biome`, `ci`, `test` o `review`, y `exceptions`). El orden lo dan el campo `order` de cada fichero y `STANDARD_AREAS` en `src/lib/catalog.ts`. Hoy hay 12 áreas; Seguridad es la 9 y Git, CI y Proceso son la 10, la 11 y la 12.

Lo medido el 2026-11-18 en la web construida:
- `Base.astro` pinta `<title>` y `<meta name="description">`, con una descripción genérica por defecto. No pinta `canonical` ni Open Graph. `site` está configurado (`https://regula.jotis.me`).
- Las páginas internas (`/visual/`, `/showcase/`, `*/full/` y `*/composiciones/`) ya llevan `noindex`.
- De las páginas indexables, todas tienen título único y descripción. La portada usa la descripción genérica, que es la suya.
- `/components/page-header/` tiene 2 `<h1>` y `/components/stream-scene/` tiene 3: `PageHeader` y `StreamScene` pintan su título como `<h1>` siempre.
- `apps/docs/scripts/js-weight.ts` mide el JS de cada página (gzip) contra `js-budget.json` y corre en el CI como «JS por página de la web» (`check:js`).
- `lighthouserc.json` mide cuatro páginas, tres veces cada una, y exige 0,9 en rendimiento y en accesibilidad.
- Varios tests de la web ya leen `dist/` (`catalog`, `gallery`, `mcp-tools`), y en Turbo `test` depende de `build`.
- Los dos ejemplos (`examples/astro` y `examples/next`) no se despliegan. El de Astro lleva `lang="es"`.

## Goals / Non-Goals

**Goals:**
- Publicar las cuatro áreas con sus normas, cada una con su verificación.
- Que Regula las cumpla el día que se publican, salvo `LOC-003` y `LOC-004`, que quedan como excepción con fecha.
- Que el CI deje de fallar por la carga del runner.

**Non-Goals:**
- Mover textos a catálogos o dar a los componentes una API de idioma.
- Traducir la web o los componentes.
- JSON-LD en Regula.
- Medir con usuarios reales.

## Decisions

### D1. Cuatro áreas detrás de Seguridad
Slugs y prefijos: `accessibility` (`ACC`), `performance` (`PRF`), `seo` (`SEO`) y `localization` (`LOC`), con `order` 10 a 13. Git, CI y Proceso pasan a 14, 15 y 16. Las URLs de las áreas existentes no cambian.

Van juntas y detrás de Seguridad porque las cinco son requisitos de la web que se despliega; Git, CI y Proceso son cómo se trabaja y siguen al final.

### D2. Las normas y su verificación
| ID | Nivel | Aplica | Verificación |
|---|---|---|---|
| ACC-001 WCAG 2.2 AA | DEBE | todos | revisión (cita `TST-005`) |
| ACC-002 Teclado y foco visible | DEBE | todos | revisión |
| ACC-003 Enlace de salto y región `main` | DEBE | apps | test |
| ACC-004 Nombre accesible y texto alternativo | DEBE | todos | revisión (axe cubre parte) |
| ACC-005 Contraste AA en los dos temas | DEBE | todos | revisión (axe cubre parte) |
| ACC-006 Movimiento reducido | DEBE | todos | revisión |
| ACC-007 Objetivos de 24 px | DEBE | todos | revisión |
| ACC-008 No solo el color | DEBERÍA | todos | revisión |
| PRF-001 Core Web Vitals | DEBE | apps | revisión |
| PRF-002 Presupuestos de peso por página | DEBE | apps | ci |
| PRF-003 CLS en el CI, sin puntuación como puerta | DEBE | apps | ci |
| PRF-004 Imágenes | DEBE | apps | revisión |
| PRF-005 Fuentes | DEBE | apps | revisión |
| PRF-006 Estático por defecto | DEBERÍA | apps | revisión |
| PRF-007 Hash y caché inmutable | DEBERÍA | apps | revisión |
| SEO-001 Título y descripción propios | DEBE | apps | test |
| SEO-002 `canonical` absoluta | DEBE | apps | test |
| SEO-003 `robots.txt` y sitemap | DEBE | apps | test |
| SEO-004 Un solo `<h1>` | DEBE | apps | test |
| SEO-005 `noindex` en lo interno | DEBE | apps | test |
| SEO-006 Redirección al mover una página | DEBE | apps | revisión |
| SEO-007 Open Graph | DEBERÍA | apps | test |
| SEO-008 JSON-LD | PUEDE | apps | revisión |
| LOC-001 `lang` en `<html>` | DEBE | apps | test |
| LOC-002 Formatos con `Intl` | DEBE | todos | revisión |
| LOC-003 Textos en catálogos | DEBE | todos | revisión |
| LOC-004 Frases sin concatenar | DEBE | todos | revisión |
| LOC-005 Rutas por idioma y `hreflang` | DEBE | apps | revisión |
| LOC-006 Textos más largos | DEBERÍA | todos | revisión |

Las normas de SEO y de rendimiento dicen en su enunciado que se aplican a las apps que se despliegan, como ya hace `SEC-012`. Los ejemplos no se despliegan, así que la regla de «los dos ejemplos la cumplen sin supresiones» no les afecta. `ACC-003` y `LOC-001` sí aplican a los ejemplos: se comprueba en la implementación que los dos las cumplen.

Las que axe cubre en parte (`ACC-004` y `ACC-005`) quedan como revisión: axe ya es `TST-005`, y marcar estas como automáticas diría que axe basta, cuando no ve un nombre accesible que existe pero no dice nada.

### D3. Un test sobre `dist/` para SEO, `lang` y regiones
`apps/docs/test/pages.test.ts` recorre los `index.html` de `dist/`, separa las páginas indexables (sin `<meta name="robots" content="noindex">`) y comprueba `SEO-001` a `SEO-005`, `SEO-007`, `LOC-001` y `ACC-003`. Lee también `dist/robots.txt` y el sitemap y los cruza con la lista de páginas indexables.

Es un test de Vitest y no un script nuevo: ya hay tests que leen `dist/`, Turbo construye antes de probar, y el fallo sale junto al resto de tests. La web no tiene ninguna librería de DOM en sus tests, y no se añade una para esto: las etiquetas que se miran (`<title>`, `<meta>`, `<link>`, `<h1>`, `<html lang>`, `<main>`) se extraen con expresiones sobre el HTML que genera Astro, que es regular, con funciones pequeñas y probadas en el mismo fichero.

Alternativa descartada: comprobarlo en el e2e que recorre todas las páginas. Es más lento y no añade nada: lo que se comprueba está en el HTML estático.

### D4. `canonical` y Open Graph en `Base.astro`
`Base.astro` calcula la URL canónica con `new URL(Astro.url.pathname, Astro.site)` y pinta `canonical`, `og:title`, `og:description`, `og:url`, `og:type`, `og:image`, `og:locale` y `twitter:card`. El título y la descripción de Open Graph son los de la página. Las páginas con `noindex` no pintan `canonical` ni Open Graph.

Una sola imagen de Open Graph para toda la web, de 1200 por 630 px, guardada en el repo. Una imagen por página sería mejor para compartir, pero pide generarlas en el build y no hace falta para cumplir la norma (KISS).

### D5. Sitemap con `@astrojs/sitemap` y `robots.txt` como endpoint
El sitemap sale de la integración oficial `@astrojs/sitemap`, con un `filter` que deja fuera las páginas internas. Astro no ofrece al código de una página la lista de todas las rutas del build, así que escribirlo a mano obligaría a mantener esa lista aparte. Es una dependencia nueva, solo de la web.

El `filter` se basa en la URL, y `noindex` se decide en cada página. Para que no se separen, el test de D3 exige que el sitemap liste exactamente las páginas sin `noindex`.

`robots.txt` es un endpoint (`src/pages/robots.txt.ts`) que toma el dominio de `Astro.site`: así el enlace al sitemap no se escribe a mano.

### D6. `titleAs` en `PageHeader` y `StreamScene`
Los dos ganan una prop opcional `titleAs`, de `"h1"` a `"h6"`, con `"h1"` por defecto. Solo cambia la etiqueta; las clases son las mismas. Los ejemplos de la guía de esos dos componentes usan `titleAs="h2"`.

Es aditivo y lleva changeset `minor`.

Alternativas descartadas:
- Una excepción de `SEO-004` para las páginas de ejemplo: la norma quedaría incumplida en dos páginas para siempre, y el mismo problema lo tiene cualquier app que pinte un `PageHeader` dentro de una pestaña o de un panel.
- Pintar esos ejemplos en un `iframe`: cambia cómo se ven y cómo se prueban todos los ejemplos por dos casos.

### D7. `check:weight`: el presupuesto de JS se amplía a HTML y CSS
`scripts/js-weight.ts` pasa a `scripts/page-weight.ts` y mide, por página y en gzip:
- el JS, como hasta ahora;
- el HTML del propio `index.html`;
- el CSS de las hojas que enlaza la página.

`js-budget.json` pasa a `weight-budget.json`, con un bloque por tipo (`js`, `css` y `html`), cada uno con `default` y `pages`. Los límites de JS se conservan. Los de HTML y CSS se fijan en la implementación con lo medido más un 10 %, la misma regla que ya usa el fichero. El script `check:js` pasa a `check:weight` y el paso del CI a «Peso por página de la web».

Se amplía el mecanismo que hay y no se añade otro: un solo fichero de presupuestos y un solo paso.

### D8. Lighthouse: CLS y accesibilidad como puerta, rendimiento como aviso
En `lighthouserc.json`:
- `categories:performance` pasa de `error` a `warn`, con el mismo 0,9;
- se añade `cumulative-layout-shift` como `error`, con máximo 0,1;
- `categories:accessibility` sigue como `error` con 0,9.

El CLS y la accesibilidad no dependen de la velocidad de la máquina; la puntuación de rendimiento sí. El resumen (`lighthouse-summary.ts`) sigue enseñando las puntuaciones. El paso del CI se renombra a «Lighthouse (móvil, CLS y accesibilidad)». El workflow manual sobre la web publicada no cambia: allí el 90 de rendimiento sigue siendo el criterio.

### D9. `standards-exceptions.json`
En la raíz, con la misma forma que `audit-exceptions.json`:
```json
[{ "rule": "LOC-003", "reason": "…", "expires": "2027-03-31" }]
```
`check:dev` falla si una entrada ha caducado, si `rule` no es el ID de una norma, si falta `reason` o `expires`, o si la norma es automática (`biome`, `ci` o `test`): una excepción no puede tapar una comprobación. No hay plazo máximo, a diferencia de la auditoría: una migración puede necesitar más de tres meses, y la fecha queda a la vista en la PR.

Entran `LOC-003` y `LOC-004` con caducidad el 2027-03-31.

## Risks / Trade-offs

- **Presupuestos de HTML y CSS recién medidos** → pueden saltar en la primera PR que añada contenido. Mitigación: el 10 % de margen, y subir un límite es un cambio de una línea con su motivo.
- **El CSS global pesa 175 kB sin comprimir** y es uno para toda la web → el presupuesto de CSS será casi el mismo en todas las páginas. Vale como aviso de crecimiento, no como reparto por página.
- **`titleAs` amplía la API pública** → es una prop más que mantener. Se limita a los dos componentes que hoy pintan `<h1>`.
- **Una sola imagen de Open Graph** → todas las páginas se comparten con la misma imagen. Aceptado por KISS.
- **Normas de revisión sin comprobación** (la mayoría de `ACC` y `LOC`) → dependen de quien revisa. Es el mismo trato que las normas de diseño del OWASP.
- **La excepción de `LOC` puede caducar sin migración hecha** → `check:dev` fallará el 2027-03-31. Es lo que se busca: obliga a hacer la migración o a renovar la fecha con un motivo nuevo.

## Migration Plan

Un commit por pieza, en este orden: las excepciones con caducidad, `titleAs`, los metadatos y el sitemap, el test de las páginas, `check:weight`, Lighthouse y, al final, las cuatro áreas de normas (que no pueden publicarse como automáticas antes de que existan sus comprobaciones). No hay nada que deshacer en producción: si algo falla, se revierte la PR.

## Open Questions

- **La imagen de Open Graph.** Propuesta: el logotipo de Regula y el lema de la portada sobre el fondo de la marca, capturada una vez con Playwright desde una página interna. Se enseña al usuario antes de fusionar.
- **La fecha de la excepción de `LOC`.** Se propone el 2027-03-31; el usuario puede fijar otra.
