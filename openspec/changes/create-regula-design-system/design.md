# Design

## Context

- El directorio `regula/` solo tiene OpenSpec: no es repo git ni tiene código.
- La fuente de verdad actual es el artefacto de Claude "Jotis.me" (tipo Design System, slug `bb424412-8082-461e-a84f-b3704de675c1`, importado primero en la versión `1793307990-2c91` y después en la `1793561361-ae73`, que añade los 12 componentes de Stream, §12), que contiene:
  - `project/README.md`: reglas, tono, color, tipografía, espaciado, iconografía, marca, iconos de app y uso con Tailwind v4.
  - `project/tokens.json` (2.610 líneas, valor claro/oscuro y nota de uso por token) y `project/design-system.json`.
  - `project/components/<Nombre>/README.md` + `preview.html` de 74 componentes, 62 de aplicación y 12 de Stream (`Cover` solo tiene vista previa: es la portada del propio artefacto, no un componente).
  - `project/components/index.d.ts`: tipos de las props de todos los componentes.
  - `project/components/bundle.js` / `bundle.css`: implementación React funcional (global `window.Jotis`, clases `.jm-*`, `data-theme="dark"`), pensada solo para las vistas previas.
  - `project/fonts/*.woff2` (Geist, Geist Mono, Bricolage Grotesque; binarios que la herramienta de artefactos no deja extraer, así que se toman de npm: `geist` y `@fontsource-variable/bricolage-grotesque`, mismas fuentes OFL) y `project/assets/*` (iconos de app, trazos a mano, iconos, logos, patrones).
- La guía fija que las apps parten del `theme.css` de Untitled UI con marca índigo, Tailwind v4, clase `.dark-mode` y `dark:` redefinida sobre ella.
- Decidido con el usuario: componentes React compartidos por Next y Astro (Astro vía islas), npm público y todos los componentes en este cambio.

## Goals / Non-Goals

**Goals:**
- Que una app instale un paquete, añada una línea de CSS y use cualquier componente con el aspecto de la guía en Next.js (App Router) o Astro.
- Que `tokens.json` genere tokens, tema de Tailwind y páginas de la web, sin duplicar nada a mano.
- Paridad visual con las vistas previas de la guía, comprobada de forma automática.

**Non-Goals:**
- Componentes `.astro` nativos o versiones para Vue/Svelte.
- Migrar Vinculum, Pecunia, Emptor u Ornatus a los paquetes (cada app, su propio cambio).
- Lo que la guía deja fuera a propósito: componentes de marketing, calendario en vista semana/día, color picker con degradados o RGB/HSL, gráficas radar/gauge, mockups de dispositivo.
- Sincronizar de vuelta con el artefacto de Claude o con Figma de forma automática.
- En Stream: la conexión con Twitch (API, EventSub), la cola de alertas y la exportación de paneles a PNG. Los componentes reciben los datos por props; la cola y la conexión son de la app del overlay.

## Decisions

### 1. Monorepo con Bun y Turborepo

```
regula/
  packages/tokens     → @jotis-me/tokens
  packages/icons      → @jotis-me/icons
  packages/react      → @jotis-me/react
  apps/docs           → regula.jotis.me (Astro)
  examples/next       → Next.js App Router que consume los paquetes
  examples/astro      → Astro + @astrojs/react que consume los paquetes
  reference/          → copia congelada del artefacto (solo lectura, no se publica)
```
Los workspaces de Bun resuelven los paquetes en local con `workspace:*` (lockfile `bun.lock`) y Turborepo ordena `build → test → docs`. El build de los paquetes con React es `tsc` (salida ESM con un fichero por módulo, conserva `"use client"` y genera los `.d.ts`; tsup se descartó porque su generación de tipos depende de la API JS de TypeScript, que TypeScript 7 nativo no ofrece) y Vitest para los tests (jsdom, Testing Library y axe listos), ambos lanzados con `bun run`. Alternativa descartada: Nx (demasiado para tres paquetes).

### 1b. Biome para lint y formato
Un `biome.json` en la raíz sustituye a ESLint y Prettier, con `formatter.indentStyle: "tab"` e `indentWidth: 4`, para TS, TSX, JS, JSON y CSS. En `.astro` y `.mdx` Biome solo cubre parcialmente (los bloques de script); se acepta. CI ejecuta `biome ci`.

### 2. `tokens.json` como fuente y generador propio
Un script Node en `@jotis-me/tokens` lee `tokens.json` y genera:
- `tokens.css`: `:root { --color-…-value }` y `.dark-mode { … }`.
- `theme.css`: `@theme inline` que mapea cada token a su utilidad, `@custom-variant dark (&:where(.dark-mode, .dark-mode *));`, escala tipográfica, radios, sombras y anillo de foco.
- `fonts.css`: `@font-face` hacia los woff2 incluidos.
- `index.js` / `index.d.ts`: objeto tipado `tokens['text-primary'] → { light, dark, usage }`.

Alternativa: Style Dictionary. Añade configuración y su salida para Tailwind v4 no es nativa; el formato es pequeño y un script de ~200 líneas con tests de snapshot basta.

Cada token es una variable con su nombre de la guía (`--bg-primary`, `--text-tertiary`), igual que en las vistas previas del artefacto; el tema la asigna al espacio de nombres de Tailwind de su utilidad (`--background-color-primary` → `bg-primary`, `--text-color-primary` → `text-primary`, `--color-fg-*` → `text-fg-*`). Radios y sombras van en el tema con valor literal para no crear referencias circulares; el anillo de foco, que cambia con el tema, es `shadow-focus-ring`.

El tema declara antes `--color-*: initial`, de modo que la paleta cruda (`bg-indigo-600`) no existe en los componentes; las escalas `utility-*` sí. `AppIcon` lleva su tabla de tonos dentro del componente.

### 3. Modo oscuro con la clase `.dark-mode`
La sección de Tailwind de la guía y el `theme.css` de Untitled UI usan `.dark-mode`. El `data-theme="dark"` del bundle es interno del artefacto. Se adopta `.dark-mode` y la web lo documenta. **Conflicto señalado:** si alguna app ya usa `data-theme`, tendrá que cambiarlo al migrar.

### 4. Componentes con clases de Tailwind que compila el consumidor
`@jotis-me/react` publica JS con clases de Tailwind, sin CSS propio, más un `@jotis-me/react/styles.css`:
```css
@import "@jotis-me/tokens/tokens.css";
@import "@jotis-me/tokens/theme.css";
@import "@jotis-me/tokens/fonts.css";
@source "./dist";
```
La app añade `@import "tailwindcss"; @import "@jotis-me/react/styles.css";`. El `@source` se resuelve relativo a ese fichero, así que el Tailwind de la app genera las clases de los componentes en su propio build y sin duplicados. Alternativa: CSS precompilado. Es más fácil de consumir, pero duplica utilidades con las de la app y provoca conflictos de especificidad. Descartado.

Las clases se componen con `clsx` + `tailwind-merge` (configurado con los nombres propios) para que el `className` del consumidor gane sin conflictos.

### 5. React Aria Components para la accesibilidad de los interactivos complejos
Modal, Slideout, Dropdown, CommandMenu, Tabs, Tooltip, DatePicker, ColorPicker (área y barra de tono), Slider, RadioGroup, Toggle y TreeView se apoyan en `react-aria-components`. `Checkbox` y `Radio` usan `<input>` nativo porque su tipo extiende `InputHTMLAttributes` (`onChange` con evento, `required`, `form`…), algo que el `Checkbox` de React Aria no admite; el nativo ya da espacio, flechas entre radios del mismo `name` y envío en formularios, e `indeterminate` se marca con la propiedad del DOM y `aria-checked="mixed"`. `ButtonGroup` usa botones nativos con `aria-pressed` dentro de un `<fieldset>`, como dice su ficha: el `ToggleButtonGroup` de React Aria lo convertiría en un grupo de radios, con otra semántica. Esa librería resuelve el atrapado de foco, Escape, la devolución del foco, el roving tabindex y los ids estables en SSR. Untitled UI React usa la misma base, coherente con el origen de la guía. Alternativas:
- Radix: buena, pero sin date picker ni árbol, y con otro modelo de foco.
- Portar `bundle.js` tal cual: menos dependencias, pero más riesgo justo en los requisitos difíciles.

`Tabs` va sobre `Tabs`/`TabList`/`Tab` de React Aria, que enlaza siempre la pestaña activa a su panel con `aria-controls`; como el tipo de la guía no tiene paneles, se añade una prop opcional `children: (id) => ReactNode` que pinta el panel activo en un `TabPanel` enlazado, y sin ella cada `Tab` se pinta con la prop `render` de React Aria quitando ese `aria-controls` (si no, apuntaría a un id que no existe y axe lo marca). Decisión del usuario.

`Dropdown` va sobre `MenuTrigger` + `Pressable` + `Popover` + `Menu` de React Aria, que coordinan foco, flechas desde el botón, Escape y devolución del foco (con `Popover` + `Menu` sueltos el foco caía en el contenedor del menú mientras se posicionaba). Por eso `Button` pasa `ref` con `forwardRef`, y un `trigger` propio tiene que pasarlo también. El menú abierto con `defaultOpen` es una vista previa: se pinta en línea bajo el botón (posición absoluta, como en la guía), sin llevarse el foco ni bloquear la página, porque el popover flotante se daba la vuelta, se recortaba a la ventana y se cerraba al desplazar; el botón o elegir un ítem lo cierran.

La API pública sigue siendo la de `index.d.ts`: React Aria queda dentro y no se expone. `Select` mantiene el `<select>` nativo, como declara su tipo. Los componentes visuales y simples (Badge, Avatar, Alert, PageHeader…) no dependen de React Aria.

### 6. Frontera servidor/cliente
- Un módulo por componente. Los interactivos empiezan con `"use client"`. `tsc` genera un fichero por componente, así que la directiva sobrevive al build, y un test lo comprueba sobre `dist/`.
- Los componentes sin estado no llevan directiva: funcionan como Server Components en Next y se renderizan sin JS en Astro.
- En Astro, los interactivos necesitan `client:*`. Sin directiva pintan su HTML inicial (Tabs muestra la pestaña activa y, si recibe `children`, su panel) pero no responden. La web lo documenta.
- Las props función (`onChange`, `render`) no cruzan de Astro a una isla. Los ejemplos de Astro muestran envoltorios en `.tsx`.

### 7. Portar desde `bundle.js`, con la ficha como regla
Por componente se parte de cuatro fuentes:
- su README, que fija las reglas;
- `preview.html`, que fija el aspecto;
- sus tipos en `index.d.ts`;
- su implementación en `bundle.js`/`bundle.css`.

Las clases `.jm-*` se traducen a utilidades de tokens. Ante un choque entre guía y `theme.css`, manda `theme.css`, como dice la guía. Ante un choque entre ficha y bundle, manda la ficha. Excepciones decididas con el usuario: el icono de `Banner` sigue al bundle (48px, `modern` en el tema por defecto y `light` en `brand`; la ficha dice 40px `modern`), y el cierre automático de `Notification` que pide la ficha (y el bundle no tiene) se implementa con pausa y una prop nueva `autoClose`. Por contraste (axe en la web, mínimo 4,5:1), también decidido con el usuario: los comentarios de `CodeSnippet` van en `utility-green-700` en lugar de `utility-green-600` (3,2:1 en claro) y el "N más…" de `CalendarView` en `text-quaternary` en lugar de `utility-neutral-500` (3,8:1 en oscuro).

### 8. Iconos y recursos de marca en `@jotis-me/icons`
A partir de los SVG (`reference/assets/Icons` y el set de `Icon` en `bundle.js`), el paquete genera:
- un componente React por icono (`<IconCalendar />`) y `Icon` con `name`, para la API `iconLeading="plus"`;
- SVG sueltos con `stroke="currentColor"`, importables desde Astro (`?raw` o como componente SVG de Astro).

El paquete publica también `app-icons/` (SVG y PNG generados), `patterns/` y `hand-drawn/`. Un generador en `@jotis-me/icons/scripts` produce favicon, `any`, `maskable` y `apple-touch-icon`. Las letras salen de la tabla de curvas de Bricolage Grotesque 600 que trae la guía (`APPICON.glyphs` en `bundle.js`, con avances y kerning), aplicando la transformación a coordenadas absolutas; así no hace falta la fuente TTF ni opentype.js. La tabla redondea a unidades enteras de la fuente: frente a los SVG de la guía, como mucho 0,04 unidades sobre 128. `AppIcon` en `@jotis-me/react` usa el mismo módulo de geometría.

### 9. Web en Astro + MDX, sin Starlight
`apps/docs` es Astro con colecciones de contenido en Markdown (MDX donde hace falta JSX): una página por fundamento (del README) y una por componente (de su ficha, ampliada). Los fragmentos de código de cada componente viven en `src/lib/snippets.ts` y no en el frontmatter, porque Biome formatea el Markdown y rompe los bloques YAML de varias líneas. Starlight queda fuera porque impone su propio aspecto, y la web tiene que ser el propio sistema.
- Textos en castellano y URLs en inglés: `/foundations/<tema>/`, `/usage/tailwind/`, `/icons/`, `/components/<nombre>/`.
- Las notas de uso de los tokens van traducidas al castellano en `packages/tokens/src/tokens.json` (`scripts/translate-usage.ts` parte del original en inglés de `reference/tokens.json`), así que el paquete y la web dicen lo mismo.
- Ejemplos vivos: islas de `@jotis-me/react` con `client:visible`; son los mismos ejemplos que la paridad visual (`src/visual/`), así la página enseña exactamente lo que se compara con la guía.
- Tablas de props generadas con `react-docgen-typescript` en el build.
- Páginas de tokens leídas directamente de `@jotis-me/tokens`.
- Búsqueda con Pagefind (estática, sin servicio), abierta desde `CommandMenu`.
- Tema: un script en línea en `<head>` aplica `.dark-mode` desde `localStorage`/`prefers-color-scheme` antes de pintar.
- `apps/docs` fija TypeScript 6 porque `astro check` aún no admite TypeScript 7; el resto del monorepo usa TypeScript 7 (Bun instala cada paquete aislado).
- Hosting en Vercel con la integración de Git: raíz del proyecto `apps/docs`, instalación con `bun install`, previews en cada PR y `regula.jotis.me` como CNAME hacia Vercel.

### 10. Calidad y verificación
- **Unitarios y comportamiento:** Vitest + Testing Library en cada componente (props, estados, teclado).
- **Accesibilidad:** `vitest-axe` por componente y `@axe-core/playwright` en la web, en ambos temas.
- **Paridad visual:** las vistas previas de la guía se pintan con nuestro `tokens.css` (mismos nombres de variable), `bundle.css`, `bundle.js` y React 18.3.1 UMD de npm (idéntico al del artefacto) y se capturan una vez, en claro y oscuro, a 800 px y al alto que declara cada tarjeta (`e2e/visual/reference/`, versionadas). Cada componente portado reproduce su vista previa en `/visual/<nombre>/` (fuera de la navegación, `noindex`) y se compara píxel a píxel con pixelmatch: mismo tamaño y menos del 2 % de píxeles distintos.
- **Integración:** CI construye `examples/next` (una página de servidor con componentes estáticos y otra con Modal) y `examples/astro` (con y sin `client:*`). Comprueba que no hay avisos de hidratación y, en Astro, que no se envía JS para los estáticos.
- **Lighthouse CI** en la web: ≥ 90 en rendimiento y accesibilidad, móvil.

### 11. Versionado y publicación con Changesets
- Changesets con los tres paquetes en modo `fixed` (misma versión para todos), para que "la web documenta la versión X" sea inequívoco.
- GitHub Actions (con `oven-sh/setup-bun`). `ci.yml` corre en cada PR y en cada push a `main`: un trabajo en Ubuntu (Biome, tipos, tests, build, colores, publint/attw, tamaño por componente con `check:size` y `size-budget.json`, y `scripts/pack.ts`) y otro en Windows con navegador (e2e de tokens e iconos, la web con axe y paridad visual, los dos ejemplos y Lighthouse CI). Va en Windows porque las referencias de paridad se capturaron en Windows y el suavizado del texto cambia entre sistemas.
- `release.yml` solo corre cuando `ci.yml` termina bien tras un push a `main` (`workflow_run`), sobre el mismo commit. La acción de Changesets abre y actualiza el PR de versión; al fusionarlo, `scripts/release.ts` empaqueta cada paquete con `bun pm pack` (que sustituye `workspace:*` por la versión real), comprueba que el `package.json` del `.tgz` no contiene `workspace:`, se niega a publicar 0.0.0 y publica en orden (tokens, icons, react) con `npm publish --provenance`. **Trusted publishing** (decisión del usuario): sin token de npm; npm usa el OIDC de GitHub Actions, y cada paquete tiene en npmjs.com como editor de confianza `Jotis1/regula` con `release.yml`. npm solo deja configurarlo en paquetes que ya existen, así que la primera publicación (0.1.0) usa un token temporal de npm guardado como secreto `NPM_TOKEN`: el flujo lo usa solo si el secreto existe. Tras publicar se configura el editor de confianza en los tres paquetes y se borran el secreto y el token. La acción de Changesets solo gestiona el PR de versión; la publicación es un paso propio (si no, la acción escribiría un `~/.npmrc` con `NPM_TOKEN` vacío que estorbaría al OIDC).
- Lighthouse no se puede ejecutar en el equipo de desarrollo (una extensión bloquea el Chrome instalado y la Lighthouse de `@lhci/cli` falla con el Chromium de Playwright): se verifica solo en CI.
- Versión inicial `0.1.0`; `1.0.0` cuando una app de la suite haya migrado.

### 12. Familia Stream (Twitch)
Doce componentes para directos (StreamAlert, StreamScene, StreamCountdown, CamFrame, ChatBox, ChatBadge, StreamGoal, StreamEvents, NowPlaying, StreamStatus, ChannelPanel, ChannelBanner), con las mismas cuatro fuentes por componente que el resto (§7) y la sección "Stream (Twitch)" de la guía como regla común.
- **Siempre oscuros.** La raíz de cada uno lleva la clase `dark-mode`, nuestro equivalente del `data-theme="dark"` del bundle (§3). Los tokens se redefinen en ese subárbol y `dark:` funciona dentro, así que se ven igual en una página clara.
- **Movimiento, la excepción acotada.** Lo que aparece o se va (una alerta, el último mensaje del chat, la primera fila de eventos) entra en 250 ms con fundido y 8px de subida y sale en 200 ms; con `prefers-reduced-motion`, solo fundido. Se hace con la variante `starting:` de Tailwind v4 (`@starting-style`) para la entrada y con clases de salida para `state="exit"`, sin keyframes nuevos ni cambios en `@jotis-me/tokens`. En un OBS con un Chromium anterior al 117 el elemento aparece sin animación. Nada más se anima: las barras y la cuenta atrás solo cambian cuando cambia el dato.
- **Cifras de reloj** en Geist con `tabular-nums`, no en Bricolage.
- **Lienzos de tamaño fijo** (StreamScene 1920×1080, ChannelBanner 1200×480): se pintan a tamaño real y se escalan con `transform`. Con `scale` no necesitan JS; sin él miden su contenedor. El que mide es el lienzo común (`internal/stream-stage.tsx`, `"use client"`); el componente que lo usa puede seguir siendo de servidor (StreamScene lo es: su texto sale en el HTML y solo el lienzo y la cuenta atrás son de cliente). StreamCountdown también es de cliente (cuenta el tiempo); el resto, de servidor salvo que su tarea demuestre lo contrario.
- **Datos del público** (`message` de StreamAlert, `text` de ChatBox): siempre texto plano, nunca HTML.
- **ChatBox translúcido:** `color-mix` sobre la variable del token más `backdrop-blur-lg`, con fondo sólido de reserva con `@supports`. Sin colores crudos; si la guía fija alguno, va con `// color-fijo:`.
- **Reimportación.** `reference/` pasa entera a la versión `1793561361-ae73`. Lo que no es de Stream (la paleta `chartreuse` en `tokens.json`, Regula en App icons, `design-system.json`) queda en `reference/` sin portar: `packages/tokens/src/tokens.json` no se regenera con `translate-usage.ts` y AppIcon no cambia hasta un cambio de estilo propio. Solo se capturan las referencias de paridad de los 12 nuevos; si el bundle nuevo altera la vista previa de alguno de los 62 existentes, se revisa a mano.
- **Web:** página de fundamentos `/foundations/stream/` desde la sección de la guía y una página por componente; los lienzos se ven escalados al ancho del ejemplo.

## Risks / Trade-offs

- [Algunos setups de Tailwind ignoran `node_modules` al detectar clases] → El `@source` va dentro del CSS del paquete con ruta explícita, que v4 respeta; los ejemplos lo verifican en cada release.
- [La paridad píxel a píxel con 74 vistas previas es cara y frágil] → Umbrales tolerantes y comparación por componente aislado; las diferencias aceptadas se anotan en la página del componente.
- [React Aria añade peso (~30–50 kB gz en apps con muchos interactivos)] → Importación por componente, `sideEffects: false` y control de tamaño por componente en CI.
- [Las props función no cruzan islas de Astro] → Patrón de envoltorio `.tsx` documentado y presente en `examples/astro`.
- [El artefacto puede seguir cambiando durante el port] → Copia congelada en `reference/` con su versión; las actualizaciones posteriores entran en cambios propios. Excepción, decidida con el usuario: la versión `1793561361-ae73` (Stream) entra en este cambio para salir en la `0.1.0`.
- [`changeset publish` llama a `npm publish`, que no reescribe `workspace:*`, y se publicarían dependencias rotas] → Publicar desde el `.tgz` de `bun pm pack` y comprobar en CI que el `package.json` empaquetado no contiene `workspace:`.
- [Licencias de fuentes: Geist y Bricolage son OFL] → Incluir las licencias en `@jotis-me/tokens/fonts/` y citarlas en la web.

## Migration Plan

No hay sistema previo: el despliegue solo añade.
1. Publicar versiones `0.x` y la web; las apps siguen con sus estilos.
2. Cada app migra en su propio cambio.
3. Marcha atrás: `npm deprecate` de la versión defectuosa y nueva versión de parche; la web se redespliega desde el commit anterior.

