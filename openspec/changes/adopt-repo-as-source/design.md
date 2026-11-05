# Design

## Context

Ver proposal.md (Why). Estado actual que condiciona el diseño:

- El repo ya es casi autosuficiente: los tokens salen de `packages/tokens/src/tokens.json`, las fichas están en `apps/docs/src/content/components/*.md`, los iconos en `packages/icons/src/data/icons.ts` y el registro de apps en `packages/icons/src/data/appicon.ts`.
- Lo que aún lee `reference/`: los tests visuales (`apps/docs/e2e/visual/reference.ts` sirve los `preview.html` de la guía y saca de ellos la altura de cada tarjeta), `packages/icons/scripts/assets.ts` (copia los SVG de adornos y patrones en el build), los tests de iconos (`iconNames` de `design-system.json`), los de AppIcon (comparan con los SVG de la guía), `apps/docs/e2e/foundations.spec.ts` y los scripts de importación (`scripts/import-artifact/`, `split-guide.ts`, `extract.ts`, `translate-usage.ts`).
- Las capturas de paridad ya se guardan en el repo: `apps/docs/e2e/visual/reference/*.png` (74 componentes x 2 temas). El test compara el ejemplo de la web con esas PNG, no con la guía en vivo. Se capturaron en Windows, y por eso el job de navegador de CI corre en `windows-latest`; el job de comprobaciones corre en `ubuntu-latest`.
- Unos 30 ficheros de `apps/docs` citan `reference/docs-design/*.dc.html` o `reference/components/*/preview.html` en su comentario de cabecera como procedencia. No son lecturas.
- Los ejemplos de `apps/docs/src/visual/examples/*.tsx` usan utilidades propias (`flex flex-wrap gap-4`, `grid-cols-[88px_repeat(5,64px)]`…) que no aparecen en `packages/react/dist`.
- `packages/icons/src/data/{appicon,icons}.ts` llevan la cabecera «Generado por scripts/extract.ts… No editar a mano».
- El artefacto "Jotis.me" es del tipo Design System: `project/design-system.json` (índice), `tokens.json`, `README.md`, `components/<X>/{README.md,preview.html}`, `components/bundle.{js,css}`, `components/index.d.ts`, `components/lib/react*.js` (React 18.3.1), `fonts/*.woff2` y grupos de assets subidos (App icons, Hand-drawn, Patterns, Logos, Icons). El tipo admite un modo sincronizado desde código, `"editing": "code"`, que deja la página en solo lectura.
- `reference/` está en la versión `1793653059-466a`; el artefacto, en la `1793805785-9fe2`. La única diferencia es Scaena: ficha y vista previa de AppIcon, README de App icons, la guía, `bundle.js`, `index.d.ts`, el índice y los 5 SVG `scaena-*.svg`.

## Goals / Non-Goals

**Goals:**
- Que cada cosa del sistema tenga una sola fuente en el repo y el artefacto se genere entero desde ella.
- Que el flujo para añadir componentes en los cambios siguientes sea: spec, implementación, página, captura aprobada y sincronización, sin tocar el artefacto a mano.

**Non-Goals:**
- Publicar el artefacto desde CI: el tipo solo se escribe con las herramientas de artefactos de Claude.
- Cambiar la API o el aspecto de ningún componente.
- Corregir el Figma.

## Decisions

### D1. `reference/` se congela en la última versión del artefacto, no se borra
Se reimporta una última vez (versión `9fe2`) y se marca como congelada en su README. Se conserva porque es la procedencia de las 74 fichas y de las capturas aprobadas, y porque sirve de copia para deshacer la primera sincronización. A partir de aquí nada la lee. CI lo comprueba buscando rutas reales a la carpeta raíz: `../reference/` (con cualquier número de `../`) y `join(…, "reference")` que suban fuera del paquete. No busca la palabra suelta: los comentarios de procedencia (`reference/docs-design/*.dc.html`…) se conservan. Con el cambio de nombre a `approved/` (D4) ya no hay otra carpeta `reference` en el código.
*Alternativa:* borrarla. Se descarta por la procedencia y la vuelta atrás; pesa poco.

### D2. Los assets fuente pasan al paquete de iconos
Los SVG de adornos y patrones se copian a `packages/icons/assets/{hand-drawn,patterns}/` con la tinta ya en `currentColor`. `assets.ts` lee de ahí. Los SVG de app ya se generan con `appIconSvg`, y los de la guía (incluidos los de Scaena) se copian como fixtures de test a `packages/icons/test/fixtures/app-icons/`. `extract.ts` y `translate-usage.ts` se retiran: hicieron su trabajo una vez y su salida ya está versionada. Los ficheros de `data/` pasan a ser fuente y se editan a mano: su cabecera dice de dónde salieron y que ya no se regeneran. La lista de los 81 nombres originales de iconos se guarda como fixture (`packages/icons/test/fixtures/icon-names-guide.json`) para que el test de mínimos no dependa de la guía.

En `packages/tokens/test/usage.test.ts`, la comprobación de que cada nota de uso está traducida respecto al original se retira con `translate-usage.ts`: la traducción se hizo una vez y las notas en castellano son ahora la fuente. Lo que se conserva es la lista de nombres de tokens en su orden, fijada como fixture (`packages/tokens/test/fixtures/token-names.json`). Así, quitar o renombrar un token es un cambio explícito del fixture en el PR.

### D3. Scaena entra por el registro, igual que el resto
Se añade `scaena: { letters: "Sc", hue: "lime" }` a `appicon.ts`. `lime` es válido: sus vecinos en el orden de la paleta (`WHEEL` de `app-icon.ts`) son `yellow` y `green`, y ninguno está en uso. `yellow` está prohibido de por sí y `green` ya estaba bloqueado por ser vecino de `emerald` (Pecunia). Por eso Scaena no bloquea ningún tono nuevo. El test de vecindad comprueba que `validateApps` devuelve, para una app en `green`, el problema que nombra a Scaena (`lime`) además del de Pecunia. Los SVG generados se comparan con los 5 de la guía, igual que se hizo con Regula.

### D4. Las capturas aprobadas sustituyen a la guía como referencia visual
La carpeta `apps/docs/e2e/visual/reference/` pasa a llamarse `apps/docs/e2e/visual/approved/`. Las PNG actuales se mueven sin cambiar: se capturaron de la guía y siguen siendo la referencia de esos 74. Cambia cómo se crean las nuevas: `capture-approved.ts <Nombre…>` captura el ejemplo de la web (no la vista previa de la guía) en claro y en oscuro. La altura de cada tarjeta y si su vista previa es oscura pasan del `preview.html` de la guía al registro de ejemplos (`apps/docs/src/visual/registry.ts`), que ya tiene `DARK_PREVIEWS`.

Flujo de aprobación:
- **Dónde se captura.** En Windows, igual que el job de navegador de CI, porque el render de fuentes cambia entre sistemas. Se puede capturar en local o con un job manual (`workflow_dispatch`) en `windows-latest` que sube las PNG como artifact del run.
- **Qué se aprueba.** La PNG que entra en el diff del PR (GitHub la enseña, y en un cambio la compara con la anterior), revisada junto al ejemplo en la vista previa del deploy. La vista previa sirve para probar la interacción. La PNG es lo que queda como referencia, porque en el PR que la crea el test visual pasa siempre: compara el ejemplo consigo mismo.
- **Componente nuevo.** Su página, su ejemplo en el registro y sus dos PNG van en el mismo PR. El test de catálogo (D5) falla si falta alguna.
- **Cambio de aspecto de un componente existente, incluidos los 74 originales.** Se recaptura con el mismo script y se sustituyen sus PNG. El PR explica el motivo (variante nueva del Figma, corrección…) y la revisión compara la PNG anterior con la nueva en el diff. Sustituir una PNG que salió de la guía es válido: desde este cambio la referencia es la captura aprobada, no la guía.
- **Comprobación sin sobrescribir.** `capture-approved.ts --out <carpeta>` escribe en otra carpeta, para comparar una captura nueva con la aprobada sin tocarla.
*Alternativa:* capturar del Figma. Se descarta: el Figma no usa los tokens del sistema (tiene la paleta de Tailwind v3) y no tiene la familia Stream.

### D5. El catálogo es lo que exporta `@jotis-me/react`
Un test en `apps/docs` compara los componentes que exporta el paquete con `COMPONENT_GROUPS` de `catalog.ts`, con las páginas de `content/components/` y con las PNG aprobadas. Un componente es una exportación de tiempo de ejecución en PascalCase que es una función o un objeto de React (`forwardRef`/`memo`, por su `$$typeof`). Así, una constante o un contexto en PascalCase no entra en el catálogo por error. Hoy el resto de exportaciones son `appIcons`, `format*` y `defaultStrings`. Añadir un componente sin página, sin grupo o sin captura rompe el build. Los specs dejan de llevar un número fijo.

### D6. El generador vive en `scripts/artifact/` y no necesita red
`bun run artifact:build` escribe `dist-artifact/project/` y un `manifest.json` con el sha256 de cada fichero:
- **Bundle**: `Bun.build` con formato IIFE de una entrada que reexporta `@jotis-me/react` y los ejemplos de `visual/registry.ts`, con un plugin que resuelve `react`, `react-dom` y `react/jsx-runtime` a `window.React`/`window.ReactDOM`. Asigna `window.Jotis` (mismo namespace que hoy, así los diseños que ya lo usan siguen funcionando) y deja los ejemplos en `window.Jotis.previews`. Primera línea, la cabecera `@ds-bundle` con la lista del catálogo.
- **Hoja**: Tailwind v4 compila `@jotis-me/react/styles.css` (tokens, tema y `@source` de `dist`) a un CSS estático. Le suma un `@source` de `apps/docs/src/visual/` para que entren las utilidades propias de los ejemplos, que el bundle publica en `Jotis.previews`. Al selector `.dark-mode` se le suma `[data-theme="dark"]`, que es el que usa el artefacto (igual que hace hoy `reference.ts`). La hoja solo lleva las utilidades que usan el paquete y los ejemplos. Los diseños hechos en el artefacto que usen otras se detectan en la revisión de la tarea 6.1, y entonces se decide si se añade un safelist o se cambia el diseño.
- **Tipos**: un único `index.d.ts` hecho con `dts-bundle-generator` a partir de `packages/react/dist`.
- **Fichas**: cada `content/components/<x>.md` sin el frontmatter, con la `description` como primera frase.
- **Vistas previas**: `components/<Nombre>/preview.html` con la cabecera `@dsCard` (grupo de `catalog.ts`, altura del registro) que monta `Jotis.previews.<Nombre>`.
- **Guía**: `README.md` desde las páginas de fundamentos de `content/foundations/`, en el orden de la web.
- **Tokens, fuentes y assets**: `tokens.json` del paquete con `meta.source` `github`, repo y commit; las `woff2` de `@jotis-me/tokens`; los SVG de app, adornos y patrones como grupos de assets.
- **Índice**: se lee el publicado, se conservan sus claves y registros de assets, y se ponen `"editing": "code"` y `lastChange` (`via`: `GitHub - Jotis1/regula@<sha>`).

### D7. La publicación la hace Claude a partir de la carpeta generada
Después de cada versión publicada (o a mano cuando haga falta), se pide a Claude que sincronice el artefacto. Claude genera la carpeta, compara el `manifest.json` con `list_files` del artefacto, sube solo los assets nuevos o cambiados, publica los ficheros cambiados en una llamada y deja el índice para la última. El procedimiento queda en `scripts/artifact/README.md`. Como la publicación es manual, el procedimiento empieza comparando el `lastChange` publicado con el commit de la última versión de los paquetes (la última etiqueta de changesets). Si el artefacto va por detrás, lo dice, y así se ve cualquier versión que se quedó sin sincronizar. Si más adelante está disponible `/design-sync` de Claude Code con su productor, se puede cambiar sin tocar los specs.

## Risks / Trade-offs

- [Los diseños hechos con el artefacto (Scaena, Ornatus, Regula) usan la copia a mano de `window.Jotis`, que puede diferir del paquete en detalles] → Antes de la primera publicación, se abren esos diseños con el bundle nuevo y se listan las diferencias. Las props son las mismas por spec; lo que cambie es el paquete, que es la versión buena.
- [React del artefacto (18.3.1) y paquete compilado con React 19] → El bundle se compila con React externo y `jsx-runtime` resuelto contra el global 18. Hoy el paquete no usa APIs exclusivas de React 19 (`use`, `useActionState`, `ref` como prop…; `Button` usa `forwardRef`). La prueba del bundle con React 18 UMD corre en CI en cada PR, así que una API de 19 que se cuele rompe el build en lugar de llegar al artefacto.
- [Los tests de navegador comparan con PNG capturadas en Windows] → Las pruebas con Playwright del generador (bundle con React 18, hoja y comparación de vistas previas) van al job de navegador en `windows-latest`. El job de comprobaciones de `ubuntu-latest` ejecuta `artifact:build`, la comprobación sin red (`unshare -n`) y los tests que no abren navegador.
- [Bundle y hoja pesados por `react-aria-components` y Tailwind] → Límite de 6 MB del tipo; con 74 componentes se espera muy por debajo. El test del generador comprueba el tamaño.
- [Alguien edita el artefacto a mano antes del modo solo lectura] → La primera publicación lee el índice justo antes y avisa si `lastChange` no es la `9fe2`.
- [Quitar `reference/` de los tests puede tapar una regresión con la guía] → Las PNG aprobadas, los fixtures de app y la lista de iconos son exactamente lo que se comparaba antes, ahora versionado dentro de cada paquete.

## Migration Plan

1. Reimportar `reference/` a la `9fe2` y congelarla.
2. Portar Scaena y mover assets y fixtures (D2, D3).
3. Cortar las lecturas de `reference/` en tests y scripts (D4, D5).
4. Generador y sus tests (D6): `artifact:build` y los tests sin navegador en el job de comprobaciones; los de Playwright, en el job de navegador.
5. Revisar los diseños que usan el artefacto con el bundle nuevo y publicar la primera sincronización (D7).

Vuelta atrás: republicar en el artefacto los ficheros de `reference/` (versión `9fe2`) sin `"editing": "code"`; el repo no depende del artefacto en ningún paso.
