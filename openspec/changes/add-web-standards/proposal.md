# Proposal

## Why

Las normas de Regula cubren el código, los tests y la seguridad, pero nada dice cómo tiene que ser una web de la suite para quien la visita o la busca. Es el punto 3 de la hoja de ruta hacia la beta. Medido el 2026-11-18 sobre la web construida (170 páginas, sin contar `/visual/` ni `/showcase/`):
- ninguna página lleva `canonical` ni Open Graph, y no hay `robots.txt` ni sitemap;
- dos páginas indexables tienen más de un `<h1>` (`/components/page-header/`, 2, y `/components/stream-scene/`, 3): los ejemplos de `PageHeader` y `StreamScene` pintan su propio `<h1>`;
- el paso de Lighthouse del CI exige 90 en rendimiento y falla según la carga del runner, sin que cambie el código;
- el peso de JS por página ya tiene presupuesto (`check:js` y `js-budget.json`), pero el del HTML (la portada, 226 kB) y el del CSS (175 kB) no;
- axe pasa en todas las páginas y en los dos temas, hay enlace de salto y se respeta el movimiento reducido, pero ninguna norma lo pide ni declara un nivel de WCAG;
- la suite está solo en español: `lang="es"` y cifras con `Intl`, y unos 276 textos escritos dentro del código de `@jotis-me/react`.

## What Changes

- **Cuatro áreas nuevas**, detrás de Seguridad (decisión del usuario): «Accesibilidad» (`ACC`, slug `accessibility`), «Rendimiento» (`PRF`, slug `performance`), «SEO» (`SEO`, slug `seo`) e «Internacionalización» (`LOC`, slug `localization`). El orden queda: Nombres, Idioma, Stack, Estructura, Código, Tests, Documentación, Versiones, Seguridad, Accesibilidad, Rendimiento, SEO, Internacionalización, Git, CI y Proceso.
- **Accesibilidad (`ACC`):**
  - el objetivo es WCAG 2.2 AA (decisión del usuario);
  - todo se maneja con el teclado, con foco visible, y cada página tiene enlace de salto y sus regiones;
  - cada control tiene nombre accesible y cada imagen su texto alternativo;
  - contraste AA en los dos temas;
  - se respeta `prefers-reduced-motion`;
  - lo que se pulsa mide al menos 24 px;
  - la información no depende solo del color (`should`).
  - Axe en cada página y componente ya es `TST-005` y no se repite.
- **Rendimiento (`PRF`):**
  - Core Web Vitals en móvil: LCP de 2,5 s o menos, CLS de 0,1 o menos e INP de 200 ms o menos;
  - **el CI vigila presupuestos fijos** (decisión del usuario): peso de HTML, CSS y JS por página y CLS. La puntuación de Lighthouse se enseña como aviso y no hace fallar el CI;
  - imágenes en formato moderno, con dimensiones y carga diferida bajo el pliegue;
  - fuentes propias en WOFF2, y solo se precargan las del primer pintado;
  - estático por defecto, y cada isla con la directiva menos urgente que sirva (`should`);
  - assets con hash y caché inmutable (`should`).
- **SEO (`SEO`)**, para las páginas indexables de las apps que se despliegan:
  - título y descripción propios;
  - `canonical` con URL absoluta;
  - `robots.txt` y sitemap, solo con las páginas indexables;
  - un solo `<h1>` por página;
  - `noindex` en las páginas internas o de prueba;
  - una página que se mueve deja una redirección permanente;
  - Open Graph (`should`) y datos estructurados JSON-LD (`may`).
- **Internacionalización (`LOC`)**, preparada para más idiomas (decisión del usuario):
  - `lang` en `<html>`;
  - cifras, fechas y monedas con `Intl` y la configuración regional explícita;
  - los textos de la interfaz viven en catálogos por idioma, no en el código;
  - no se montan frases concatenando trozos;
  - con más de un idioma, rutas por idioma y `hreflang`;
  - la interfaz aguanta textos más largos (`should`).
- **Excepciones de Regula con caducidad:** un fichero `standards-exceptions.json` declara las normas que Regula todavía no cumple, cada una con su motivo y su fecha. `check:dev` falla si una caduca o nombra una norma que no existe. Entran `LOC-003` y `LOC-004` (decisión del usuario): la migración de los textos a catálogos va en un cambio aparte.
- **Regula cumple el resto:**
  - `canonical`, Open Graph, `robots.txt` y sitemap en la web;
  - `PageHeader` y `StreamScene` ganan una prop para elegir el nivel de su título, y sus ejemplos dejan de pintar un `<h1>` de más;
  - `check:js` pasa a `check:weight`, con presupuestos de HTML, CSS y JS;
  - Lighthouse falla por el CLS y por la accesibilidad, y la puntuación de rendimiento queda como aviso;
  - un test recorre la web construida y comprueba las normas de SEO, `lang` y las regiones.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `engineering-standards`: el orden de las áreas, y las áreas de accesibilidad, rendimiento, SEO e internacionalización.
- `standards-compliance`: las comprobaciones de las cuatro áreas, las excepciones con caducidad y que Regula las cumple.
- `docs-site`: el requisito «Rendimiento y accesibilidad de la web» deja la puntuación de rendimiento de Lighthouse y pasa a presupuestos, y la web gana `canonical`, Open Graph, `robots.txt` y sitemap.
- `component-library`: `PageHeader` y `StreamScene` dejan elegir el nivel del encabezado de su título.

## Impact

- **Normas:** `apps/docs/src/content/standards/accessibility.yaml`, `performance.yaml`, `seo.yaml` y `localization.yaml`, los `order` nuevos de `git`, `ci` y `process`, y cuatro entradas en `STANDARD_AREAS`. También el orden que fijan `standards.test.ts` y `mcp-tools.test.ts`.
- **Web:**
  - `apps/docs/src/layouts/Base.astro` (`canonical` y Open Graph);
  - `apps/docs/src/pages/robots.txt.ts`;
  - `@astrojs/sitemap` en `apps/docs/astro.config.mjs` (dependencia nueva de la web);
  - la imagen de Open Graph;
  - los ejemplos de `PageHeader` y `StreamScene`;
  - un test nuevo sobre `dist/`.
- **Paquetes publicados:** `@jotis-me/react` gana una prop opcional en `PageHeader` y en `StreamScene`. Es aditivo: changeset `minor`.
- **Scripts y CI:**
  - `apps/docs/scripts/js-weight.ts` y su test pasan a medir también HTML y CSS, con `weight-budget.json` y el script `check:weight`;
  - `apps/docs/lighthouserc.json` y el nombre de su paso en `ci.yml`;
  - `scripts/check-dev.ts` y su test (excepciones con caducidad);
  - `standards-exceptions.json` en la raíz.
- **Fuera de alcance:**
  - mover los textos de `@jotis-me/react` y de la web a catálogos, y la API de idioma de los componentes: van en un cambio aparte, antes de que caduque la excepción;
  - traducir nada: la suite sigue solo en español;
  - datos estructurados JSON-LD en Regula (la norma es `may`);
  - medir los Core Web Vitals con usuarios reales;
  - cambiar el workflow manual de Lighthouse sobre la web publicada.
