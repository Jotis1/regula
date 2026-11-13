# Design

## Context

Motivo y alcance en `proposal.md`. Lo que condiciona el diseño, comprobado en el repo y en npm el 2026-11-12:

- `packages/icons` exporta ocho entradas: iconos de línea (raíz), `app-icon`, `logos`, `flags`, `payments`, `files`, `cursors` y carpetas de SVG. `@jotis-me/react` solo importa de la raíz (10 ficheros, unos 20 componentes sueltos más `Icon` por nombre) y de `app-icon` (`AppIcon.tsx`).
- En `packages/react/src` hay 91 apariciones del tipo `IconName` (props `IconName | ReactNode`) y unos 200 usos de nombres en cadena, repartidos por unos 45 componentes. `iconSlot(icon, size)` en `components/Icon.tsx` es el punto único que convierte nombre en icono.
- Paquetes oficiales de Untitled UI (los tres MIT, `sideEffects: false`, ESM + CJS, probados con React 19 en un proyecto aislado):
  - `@untitledui/icons@0.0.23`: 1.181 componentes en PascalCase (`SearchLg`), props `size` (24 por defecto), `color` y las de `<svg>`; `aria-hidden="true"` por defecto; sin `title`, sin `spin`, sin ficheros SVG. Cubre los 82 nombres del núcleo y 1.169 de los 1.172 del set (faltan `align-top-01`, `align-top-02`, `help-hexagon`).
  - `@untitledui/file-icons@0.0.9`: un solo componente `FileIcon` (`type`, `variant` default/gray/solid, `theme` light/dark, `size`), 52 tipos; importa todos los dibujos de forma estática y no tiene mapa `exports`.
  - `@untitledui/country-flags@0.0.17`: 234 banderas circulares (`FlagEs`), con `forwardRef`; los `id` de `clipPath` son fijos por bandera (`ES_svg__a`), así que dos banderas iguales comparten `id` con el mismo contenido.
- Los nombres que escribió el usuario (`@untitled-ui/icons`, `@untitled-ui/file-icons`) no existen en npm; `@untitled-ui/icons-react` es un paquete de terceros. Se usan los oficiales `@untitledui/*`.
- Web: el índice pinta 121 muestras en vivo (`LivePreview.astro` + `visual/thumbnails.tsx`, 1.717 líneas) en un escenario de 288×180 con recorte. El playground (`Playground.tsx`) pone los controles en un `flex flex-wrap items-end`: un control con `hint` crece hacia abajo y, al alinearse por abajo, sube su etiqueta y su campo respecto a los demás. Los atajos viven en `Start.presets` de `lib/starts/*.ts`.
- Decisiones del usuario (2026-11-12): conservar en un paquete propio lo que Untitled UI no cubre; props de icono como componente o nodo; capturas en el repo en claro y oscuro; mantener las galerías de lo que se sigue usando.
- Entorno local: Windows, solo Bun, sin Chrome; Playwright con el Chromium de la versión del workspace.

## Goals / Non-Goals

**Goals:**

- Que ningún dibujo de Untitled UI viva copiado en el repo.
- Que `@jotis-me/react` no arrastre un mapa de iconos: solo los que importa cada componente.
- Que la migración de las apps sea mecánica y esté escrita.
- Cards del índice ligeras y bien compuestas, con un flujo de regeneración de un comando.

**Non-Goals:**

- Rediseñar componentes: los ajustes uno a uno vienen después.
- Mantener compatibilidad con `icon="nombre"` (ni capa de transición).
- Recrear las banderas cuadradas y rectangulares o las carpetas.
- Cambiar las capturas aprobadas de paridad visual (`e2e/visual/approved`), salvo las que cambien de píxeles por el paso a los iconos de npm.

## Decisions

### D1. Paquete nuevo `@jotis-me/assets` en lugar de adelgazar `@jotis-me/icons`

`packages/icons` se borra y se crea `packages/assets` con `logos`, `payments`, `cursors`, `hand-drawn/*`, `patterns/*` y `app-icons/*` (mismos nombres de entrada y de fichero). El nombre deja de mentir (ya no tiene iconos) y el usuario pidió eliminar `@jotis-me/icons`. Entra en el grupo fijo de changesets con `tokens` y `react` y nace en 0.8.0.

- Se mudan con `git mv` los assets, los scripts `import-{logos,payments,cursors}.ts`, la parte correspondiente de `generate.ts` y `assets.ts`, y sus tests. Se borran `import-{icons,flags,files}.ts`, `components.generated.tsx`, `flags.generated.tsx`, `files.generated.tsx`, `names.generated.ts`, `data/core*`, `Icon.tsx`, `icon-svg.tsx` y `assets/{flags,files,icon-categories.json}`.
- Alternativa descartada: conservar el nombre `@jotis-me/icons`. Menos trabajo de publicación, pero el paquete seguiría llamándose «icons» sin tenerlos y las apps no notarían que las entradas raíz, `flags` y `files` han desaparecido hasta que fallase el build.

### D2. La geometría del icono de app vive en `@jotis-me/react`

`app-icon.ts` y `data/appicon.ts` pasan a `packages/react/src/app-icon/`. `@jotis-me/react` añade la entrada `./app-icon` (TypeScript puro, sin React) y sigue reexportando `apps`, `appIconSvg`, etc. desde la raíz. `@jotis-me/assets` genera los ficheros de favicon y PWA importando esa geometría de `@jotis-me/react/app-icon` como `devDependency` (turbo construye `react` antes que `assets`; no hay ciclo porque `react` no depende de `assets`).

- Por qué: `AppIcon` es el único uso de `@jotis-me/icons` que `react` necesita en tiempo de ejecución; mover la geometría deja a `react` sin dependencia de `assets` (requisito de `package-distribution`).
- Alternativa descartada: dejarla en `assets` y que `react` dependa de él. Toda app instalaría logos, pagos y cursores aunque no los use.

### D3. Props de icono: `IconProp = ComponentType<IconComponentProps> | ReactNode`

- `packages/react/src/internal/icon.tsx` define `IconComponentProps = { size?: number; className?: string; "aria-hidden"?: boolean | "true" | "false" }`, el tipo `IconProp` (exportado por el paquete) e `iconSlot(icon, size)`.
- `iconSlot` distingue componente de nodo así: `isValidElement(icon)` → nodo, se devuelve tal cual; función, u objeto con `$$typeof` (los `forwardRef` y `memo`, como las banderas) → componente, se pinta `<Icon size={size} aria-hidden />`; cadena, número u otro nodo → se devuelve tal cual (un texto es un nodo válido, no un nombre). El tipo excluye `string` de la rama de componente, pero `ReactNode` lo admite: para que `iconLeading="plus"` sea error de tipos, `IconProp` se define como `ComponentType<…> | Exclude<ReactNode, string>`.
- Los componentes que hoy guardan nombres en tablas (`Alert`, `ChatBadge`, `FeaturedIcon`…) pasan a guardar los componentes importados de `@untitledui/icons`, con importaciones nombradas desde la raíz del paquete (el `sideEffects: false` y los ESM por fichero permiten el *tree-shaking*; lo comprueba `check:size` y el escenario «Solo lo que se usa»).
- Se elimina `components/Icon.tsx` (`Icon`, `IconName`, `IconProps`). El giro de carga (`Button`, `FileUpload`) usa `Loading02` con `animate-spin motion-reduce:animate-none`, que ya existe como patrón en `Spinner.tsx`.
- Tamaño por defecto: los de Untitled UI miden 24; `iconSlot` siempre pasa `size`, así que dentro de los componentes no cambia nada.
- `@untitledui/icons` va en `dependencies` de `@jotis-me/react` con versión exacta (`0.0.23`): en `0.0.x` el `^` ya equivale a exacta, y se escribe sin él para que se vea. Las apps que importen iconos por su cuenta lo declaran también (la guía de instalación lo dice).
- Alternativa descartada: mantener los nombres con un mapa interno de 82 iconos. Decisión del usuario; además obligaba a mantener el mapa y a cargarlo siempre.

### D4. Migración mecánica de nombres

Un script de un solo uso (`scripts/migrate-icon-names.ts`, que no se queda en el repo tras usarse, o se deja en `scripts/` documentado para las apps) reescribe `icon="search-lg"` → `icon={SearchLg}` y añade la importación, con la regla kebab-case → PascalCase, que cubre los 82 del núcleo. Se usa sobre `packages/react/src`, `apps/docs/src`, `examples/` y `scripts/artifact`. Se publica en el changelog como receta para las apps de la suite. Los tres iconos sin equivalente se sustituyen a mano (`AlignTopArrow01`, `AlignTopArrow02`, `HelpOctagon`) donde aparezcan.

### D5. Galerías de `/icons/`

- **Iconos de línea**: la lista de nombres sale de `Object.keys` de `@untitledui/icons` en el build (sin los alias obsoletos que el paquete marca), y las categorías de un JSON propio de la web (`apps/docs/src/data/icon-categories.json`, el actual `icon-categories.json` con las claves pasadas a PascalCase). Como el paquete no trae SVG, la galería deja de pedir ficheros `.svg` a la vista: el build genera un JSON por tramo con el `d` de los trazos (renderizando cada componente con `renderToStaticMarkup`), y la isla sigue cargando solo los tramos visibles. El panel copia nombre y uso en React; desaparecen «importación SVG» y, en su lugar, se copia el SVG renderizado.
- **Banderas**: 234 en círculo; el buscador acepta el código ISO y el nombre del país en castellano (de `Intl.DisplayNames("es", { type: "region" })` en el build, con el código como respaldo para `FlagEarth` y las variantes numeradas).
- **Archivos**: los 52 tipos de `SUPPORTED_FILE_TYPES` × 3 variantes con `FileIcon`.
- **Logos, pagos, cursores**: igual que hoy, cambiando el paquete.
- `AssetGallery.tsx`, `LogoGallery.tsx` y `lib/gallery.ts` se adaptan; `js-budget.json` se vuelve a medir (debe bajar o quedarse).

### D6. Capturas de las cards: página de muestra + Playwright + sharp

- **Muestras**: `visual/thumbnails.tsx` se renombra a `visual/showcases.tsx` y conserva una muestra por componente (lo más característico, una sola forma y quieta), sin los recortes: ya no hay un escenario pequeño que las corte. La página de captura las **ajusta sola a un marco de 640×400** (16/10): mide la unión de todo lo que pintan la muestra y sus hijos, la agranda o la encoge hasta ocupar el 74 % del marco (entre 0,3× y 2,4×) y la centra. Es una foto, no un componente vivo: encoger una tabla no la «atrofia», y un botón agrandado no pierde nitidez (se fotografía a 2×). La cuenta vive en `visual/showcase.ts` (`fitScale`) y la repite el script en línea de la página. Las muestras que, ajustadas, no queden bien se rehacen a mano tras revisar la hoja de contactos (tarea 7.3).
- **Página de captura**: `/showcase/<slug>/` (como `/visual/<name>/`: fuera del buscador, del sitemap y de la navegación), que pinta la muestra sobre el damero `TransparencyGrid`, sin cabecera ni pie. Se pinta en el servidor, sin JavaScript de React (las muestras ya estaban pensadas para eso: las capas van en línea); solo un script en línea ajusta la escala cuando están las fuentes y marca `#stage[data-ready]`.
- **Script** `apps/docs/scripts/capture-showcases.ts` (calcado de `capture-approved.ts`: arranca `astro preview` si no hay, Chromium de Playwright): viewport 640×400 a `deviceScaleFactor: 2`, tema claro y `dark-mode` (Stream solo oscuro), espera a fuentes y a `prefers-reduced-motion: reduce`, captura PNG en memoria y la pasa por `sharp` → WebP de 800×500 (la card más ancha mide unos 380 px de CSS: a 2× sobra), `quality: 80`, `effort: 6`. Acepta nombres sueltos o `--all`. Comando: `bun run --cwd apps/docs capture:showcases [Nombre…]`.
- **Dónde**: `apps/docs/src/assets/showcase/<slug>-{light,dark}.webp`, cargadas con `import.meta.glob("…/*.webp", { eager: true, query: "?url" })` para que Astro les ponga hash y caché larga. No se pasan por `astro:assets` (ya están optimizadas).
- **Card** (`ShowcaseImage.astro`, sustituye a `LivePreview.astro`): dentro del `TransparencyGrid`, dos `<img alt="" loading="lazy" decoding="async" width="800" height="500">`; la clara con `dark:hidden` y la oscura con `hidden dark:block` (la variante `dark` que ya usa la web). Una imagen `display:none` con `loading="lazy"` no se descarga, así que solo viaja la del tema activo. Sin captura (glob sin entrada), no se pinta `<img>`: queda el damero.
- **Presupuesto**: test en `apps/docs/test/showcases.test.ts`: cada componente del catálogo tiene sus ficheros; ≤ 45 kB por imagen y ≤ 7 MB en total (`SHOWCASE_MAX_BYTES`; se ajusta tras la primera tanda, hacia abajo si sobra).
- **Lighthouse**: `lighthouserc.json` vuelve a un único umbral de 0,90.
- Alternativas descartadas: generar en cada build (el build necesitaría navegador; decisión del usuario); AVIF (algo más pequeño, pero más lento de codificar y el usuario pidió WebP); reutilizar las capturas aprobadas de paridad (enseñan todas las variantes, que es lo que el usuario no quiere).

### D7. Playground sin atajos y con controles alineados

- Se borra el bloque `data-playground-presets` de `Playground.tsx`, y de `lib/playground.ts` el tipo `Preset`, `Start.presets`, `applyPreset` y `presetActive`. Se borran las entradas `presets` de `lib/starts/*.ts`.
- **Antes de borrar cada `presets`** se revisa que lo que ponía se alcanza con controles (requisito «Cobertura del Figma»): si un atajo fijaba una prop sin control (contenido como `label` o `placeholder` no cuenta; una prop de variante sí), se le añade un control o un valor preparado (`tweaks`). El test de configuración del playground lo comprueba con una lista de «tipo del Figma → props» que antes eran los presets y pasa a ser un fixture de test.
- Alineación: el contenedor de controles pasa de `items-end` a `items-start`. Selectores y campos numéricos llevan etiqueta arriba, así que alineados por arriba sus etiquetas y campos coinciden aunque uno tenga `hint`. El grupo de interruptores, que no tiene etiqueta encima, lleva un margen superior fijo igual al alto de etiqueta más su separación (`mt-[26px]` con `size="sm"`; se mide en la implementación), en lugar del `pb-2` actual.
- El control de icono: `Select` con búsqueda sobre un conjunto fijo de la web (`apps/docs/src/lib/playground-icons.ts`, los 82 nombres del antiguo núcleo en PascalCase, importados de `@untitledui/icons`), no sobre los 1.181, para no cargar todo el set en cada página de componente. El código generado escribe `iconLeading={Plus}` y la importación.

### D8. Artefacto

`scripts/artifact/src/content.ts` deja de leer `packages/icons/dist/svg` y los grupos de banderas y archivos; apunta a `packages/assets` para iconos de app, adornos, patrones, logos, pagos y cursores. `entry.ts` deja de exportar `iconNames`. La guía del artefacto añade un párrafo con los tres paquetes de Untitled UI.

## Risks / Trade-offs

- [Paquetes `0.0.x` de terceros pueden renombrar o quitar iconos] → versión exacta, y como los componentes importan por nombre, un icono que falte rompe `tsc`; un test lista los iconos del selector del playground y de la web contra el paquete.
- [`FileIcon` importa los 150 dibujos de forma estática] → `@jotis-me/react` no lo importa (los componentes reciben el nodo); solo pesa en las apps que lo usen y en las páginas de la web que lo enseñen, dentro de su límite de JavaScript. Se documenta en la guía de instalación.
- [`id` repetidos al pintar la misma bandera dos veces] → el `clipPath` repetido es idéntico, así que se ve bien; lo cubre un e2e («Varias banderas iguales»). Si axe lo marca (`duplicate-id` ya no es regla seria en axe 4.x), se anota en NOTAS.
- [Ruptura grande para las cinco apps] → guía de migración en el changelog con la receta del script (D4) y la tabla de sustituciones de importaciones.
- [Las capturas se quedan viejas cuando cambia un componente] → no hay comparación automática de píxeles (sería frágil entre sistemas); el test solo comprueba que existen y pesan poco. Se añade a `apps/docs/README.md` el paso «regenera la captura» en la lista de cosas que hacer al tocar un componente, y los ajustes componente a componente que vienen después la regeneran como parte de cada uno.
- [Capturas hechas en Windows frente a CI en Linux] → no importa: no se comparan, solo se sirven.
- [Capturas aprobadas de paridad visual] → los iconos de Untitled UI son los mismos trazos que la copia, pero el orden o la forma de los `path` puede variar un píxel; se pasa la paridad visual tras el grupo de `react` y se reaprueban solo las que cambien, mirando cada diff.
- [Quitar los atajos esconde tipos del Figma] → revisión de D7 antes de borrar cada uno.

## Migration Plan

1. Rama `feat/untitled-ui-icons` desde `main`. Orden de las tareas: paquetes (`assets`, `react`) → web (galerías, ejemplos, playground) → capturas → artefacto → CI y changeset.
2. Changeset `minor` (0.x: una versión menor puede romper) para el grupo fijo `tokens`/`assets`/`react` → 0.8.0, con la guía de migración.
3. Tras publicar 0.8.0: `npm deprecate @jotis-me/icons "Sustituido por @untitledui/icons, @untitledui/file-icons, @untitledui/country-flags y @jotis-me/assets"`. Lo ejecuta el usuario (acción sobre el registro público).
4. Vuelta atrás: revertir el PR antes de publicar; después de publicar, las apps se quedan en 0.7.0, que sigue instalable.

## Open Questions

- Si el script de migración de nombres (D4) se queda en el repo como utilidad para las apps o solo como receta en el changelog. No cambia las tareas: se decide al escribir el changelog.
