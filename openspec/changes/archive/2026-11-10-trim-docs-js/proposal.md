# Proposal

## Why

Desde la fase 2, Lighthouse móvil en CI falla una de cada dos veces (3 de 6 ejecuciones; `/` bajó a 79) y avisa de cerca de un segundo de JavaScript sin usar. Medido sobre el build de `main` (`76c1cfd`, 9 de noviembre de 2026): todas las páginas cargan unos 290 kB gzip de JS (unos 920 kB sin comprimir). De eso, 214 kB gzip (696 kB) son un único chunk compartido, `_astro/dist.*.js`, con `@jotis-me/react` entero (Carousel, HeaderNav, ColorArea, CalendarView, DatePicker, StreamScene y toda la parte de React Aria). Lo descarga cualquier página, también `/` y `/components/`, cuyas islas solo usan el selector de tema, el buscador, el menú móvil, el formulario de la portada, `CodeSnippet` y `CopyTooltip`. Cada componente nuevo engorda todas las páginas, y la fase 3 añade más.

| Página | JS estático (gzip) | Islas |
| --- | --- | --- |
| `/` | 288 kB | ThemeMenu, SiteSearch, MobileMenu, HeroForm, CodeSnippet, CopyTooltip |
| `/components/` | 287 kB | ThemeMenu, SiteSearch, MobileMenu, CopyTooltip |
| `/foundations/color/` | 288 kB | las mismas 4 |
| `/components/button/` | 303 kB | + Playground, VisualExample, CodeSnippet |

## What Changes

- Cada página carga solo el código de los componentes que usan sus islas. La causa probable es `import * as Regula from "@jotis-me/react"` en `Playground.tsx`, que obliga a conservar el paquete entero en el chunk que comparten todas las islas. Se confirma antes de arreglarlo (design).
- Las directivas de las islas ya son tardías (`client:idle`, `client:visible`, `client:media`), pero con `client:idle` el código se pide durante la carga y Lighthouse lo cuenta. No se cambian salvo que la medición tras el arreglo lo pida (design).
- El script de medición pasa al repo (`apps/docs/scripts/js-weight.ts`) y CI falla si una página supera su límite de JS. Los límites se guardan en un JSON, como `size-budget.json` del paquete.
- Lighthouse en CI se confirma en el PR: las cuatro páginas medidas llegan a 90 en rendimiento móvil.
- Nada cambia en el paquete publicado: es un cambio de la web y de su CI.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `docs-site`: el requisito de rendimiento gana un límite de JavaScript por página, comprobado en CI, y la auditoría incluye `/components/`, que ya mide `lighthouserc.json`.

## Impact

- `apps/docs`: `Playground.tsx` (y lo que haga falta en `visual/registry.ts` o `VisualExample.tsx`), directivas `client:*` de algunas islas, un script nuevo de medición con su JSON de límites y su test.
- CI (`.github/workflows/ci.yml`): un paso nuevo tras el build de la web.
- Sin changeset: `apps/docs` es privado.
- Va en la misma PR que `add-minor-variants`. Se implementa primero, para que los componentes nuevos de la fase 3 ya entren con el límite puesto.
