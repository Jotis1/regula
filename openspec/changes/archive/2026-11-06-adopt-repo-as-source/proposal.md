# Proposal

## Why

Hoy cada componente existe dos veces: en el `bundle.js` del artefacto "Jotis.me" de Claude, escrito a mano, y en `@jotis-me/react`. Ya han divergido: `reference/` tiene la versión `1793653059-466a` del artefacto y el artefacto va por la `1793805785-9fe2`, que añade el icono de Scaena que el repo no tiene. Antes de añadir los componentes y variantes que faltan respecto al Figma (fases siguientes), hace falta una sola fuente de verdad, o cada componente nuevo se escribe dos veces y diverge.

## What Changes

- El repo pasa a ser la fuente de verdad del sistema: tokens, iconos, marca, componentes, fichas y guía. `reference/` queda congelada como registro de la importación original y deja de leerse desde el código y los tests. Esto sustituye lo que decía `create-regula-design-system` ("el artefacto se actualiza desde el repo si hace falta"): ahora se actualiza siempre, y solo desde el repo.
- Se porta lo que el artefacto añadió después de la importación: Scaena (`Sc`, tono `lime`) en el registro de apps, sus cinco SVG, su mención en la ficha de AppIcon y en la página de marca.
- El artefacto "Jotis.me" se genera desde el repo: bundle de `@jotis-me/react` como script clásico, hoja compilada, tipos, fichas, vistas previas, tokens, fuentes y assets. Queda en solo lectura (`"editing": "code"`) para que nadie lo edite a mano.
- La paridad visual compara cada ejemplo de la web con capturas aprobadas que viven en el repo. Las 74 actuales (sacadas de la guía) se conservan tal cual y su carpeta pasa de `e2e/visual/reference/` a `e2e/visual/approved/`. Las de los componentes nuevos, o las de los que cambian de aspecto a propósito, se capturan del ejemplo de la web y se aprueban revisando la PNG en el diff del PR.
- El catálogo de componentes deja de estar fijado en 74: es lo que exporta `@jotis-me/react`, y un test comprueba que coincide con las páginas de la web y con el artefacto generado.
- **BREAKING** (solo interno): se retiran `scripts/import-artifact/` (su `extract-files.mjs` pasa a `scripts/artifact/tools/save-published.mjs`, para guardar el índice publicado al sincronizar), `apps/docs/scripts/split-guide.ts`, `packages/icons/scripts/extract.ts`, `packages/tokens/scripts/translate-usage.ts` (con la comprobación de traducción de `usage.test.ts`) y el servidor de vistas previas de la guía de los tests visuales. No cambia ninguna API publicada.

## Capabilities

### New Capabilities
- `design-system-artifact`: generación y publicación del artefacto "Jotis.me" de Claude a partir del repo, como copia de solo lectura del sistema.

### Modified Capabilities
- `component-library`: el catálogo deja de ser una lista fija de 74, la API se fija en los tipos y fichas del repo y el aspecto se valida contra capturas aprobadas.
- `brand-assets`: el registro de apps incluye Scaena.
- `design-tokens`: la paridad de tokens se mide contra la fuente del repo, no contra `tokens.json` de la guía importada.
- `icon-set`: el set de iconos se define en el repo y deja de compararse con `iconNames` de la guía importada.
- `docs-site`: la ficha de cada componente vive en el repo y el índice muestra todos los componentes del catálogo, sin un número fijo.

## Impact

- **Código**: `packages/icons` (fuentes de assets y SVG de app dentro del paquete, Scaena en el registro), tests de `packages/icons`, `packages/react` y `apps/docs` que leen `reference/`, `apps/docs/e2e/visual/*` (con la carpeta de capturas renombrada a `approved/`), `apps/docs/src/lib/previews.ts` (lee esas capturas), `apps/docs/scripts/capture-reference.ts` y los dos jobs de `.github/workflows/ci.yml`.
- **Nuevo**: `scripts/artifact/` (generador del artefacto) y su test, y un paso en CI que comprueba que el generador funciona.
- **Sistemas externos**: el artefacto "Jotis.me" de Claude pasa a ser de solo lectura y se republica después de cada versión publicada. Los diseños que lo usan (Scaena, Ornatus, Regula) empiezan a pintar los componentes reales del paquete en lugar de la copia a mano.
- **Fuera de alcance**: los componentes y variantes nuevos del Figma (cambios siguientes) y la corrección de la paleta del Figma.
