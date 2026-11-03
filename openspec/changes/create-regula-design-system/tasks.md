# Tasks

## 1. Repositorio y referencia

- [x] 1.1 Inicializar git, `.gitignore`, `.editorconfig`, licencia MIT y README raíz; verificar con `git status` que solo aparecen esos ficheros y `openspec/`
- [x] 1.2 Registrar en npmjs.com la organización `jotis-me` para el scope `@jotis-me`; verificar con `npm org ls jotis-me`
- [x] 1.3 Crear el monorepo Bun + Turborepo con `packages/{tokens,icons,react}`, `apps/docs`, `examples/{next,astro}`, TypeScript estricto y Biome (`indentStyle: "tab"`, `indentWidth: 4`); verificar que `bun install`, `bunx turbo run build` y `bunx biome ci .` terminan sin error con paquetes vacíos
- [x] 1.4 Descargar del artefacto "Jotis.me" (versión `1793307990-2c91`) README, `tokens.json`, `design-system.json`, las 62 fichas y vistas previas, `index.d.ts`, `bundle.js`/`bundle.css` y los README de `assets/` a `reference/` (el artefacto solo deja leer ficheros de texto; las fuentes salen de npm en 2.3), con un `reference/VERSION`; verificar que hay 62 carpetas de componente con `README.md` y `preview.html`

## 2. @jotis-me/tokens

- [x] 2.1 Escribir el generador que lee `reference/tokens.json` y emite `tokens.css` (`:root` + `.dark-mode`); verificar con test de snapshot y un test que compara la lista de tokens con `tokens.json` uno a uno
- [x] 2.2 Generar `theme.css` para Tailwind v4: `--color-*: initial`, utilidades de color, `alpha-*`, variante `dark` sobre `.dark-mode`, escala `text-*`/`text-display-*` con interletrado, familias, radios, sombras (incluida `xs-skeuomorphic`), `focus-ring-shadow`/`focus-ring-error-shadow` con hueco `#0A0A0A` en oscuro, `max-w-container` y `max-w-paragraph`; verificar compilando una fixture de Tailwind y comprobando valores de `bg-brand-solid`, `text-display-sm`, `rounded-lg`, `p-6` y que `bg-indigo-600` no genera CSS
- [x] 2.3 Copiar las fuentes woff2 variables desde los paquetes npm `geist` y `@fontsource-variable/bricolage-grotesque` con sus licencias OFL y generar `fonts.css`; verificar en una página de fixture sin red externa (Playwright con red bloqueada) que se usan Geist y Bricolage Grotesque
- [x] 2.4 Generar `index.js` + `index.d.ts` con los tokens tipados; verificar con un test de tipos (`tsd` o `expectTypeOf`) que `tokens['text-primary']` devuelve `{ light, dark }` y que un nombre inexistente no compila
- [x] 2.5 Configurar `exports`, `sideEffects` y README de instalación del paquete; verificar con `publint` y `arethetypeswrong` sin errores

## 3. @jotis-me/icons y recursos de marca

- [x] 3.1 Extraer los 81 iconos de `bundle.js`/`reference/assets/Icons` a SVG normalizados (24×24, trazo 2, `currentColor`, extremos redondeados); verificar con un test que la lista coincide con `iconNames` y que ningún SVG tiene `fill` ni color fijo
- [x] 3.2 Generar un componente React por icono y `Icon` con `name`, `size` (20), `strokeWidth`, `title` y `spin` (respetando `prefers-reduced-motion`); verificar con tests de `aria-hidden`/`role="img"`, tamaño y giro
- [x] 3.3 Publicar los SVG sueltos y comprobar su uso desde Astro sin React; verificar en `examples/astro` (cuando exista, tarea 6.2) que la página no envía JS
- [x] 3.4 Implementar el módulo de geometría del icono de app (esquinas, letras en curvas desde la tabla de Bricolage de la guía, virgulilla fija, línea base 62,5/66,4 %) y el registro de apps con su validación de tonos; verificar con tests que rechazan `red`, `yellow`, grises y tonos usados o vecinos
- [x] 3.5 Generar por app los SVG de las cuatro variantes, favicon, PNG `any`/`maskable` y `apple-touch-icon` 180px; verificar comparando con los SVG de `reference/assets/App icons` y comprobando con un test que la virgulilla y las letras del maskable quedan en la zona segura
- [x] 3.6 Publicar `patterns/` y `hand-drawn/` con el trazo en `currentColor` (tinta `#171717`, `#FAFAFA` en oscuro vía CSS); verificar con una captura en claro y en oscuro

## 4. Base de @jotis-me/react

- [x] 4.1 Configurar el build con `tsc` (un fichero por componente) que conserva `"use client"`, `exports`, `sideEffects: false`, peers (React 18/19, Tailwind v4) y `styles.css` con los `@import` de tokens y `@source "./dist"`; verificar con un test sobre `dist/` que los módulos interactivos empiezan por `"use client"` y los estáticos no
- [x] 4.2 Crear utilidades internas: `cx` (clsx + tailwind-merge configurado con los nombres propios), formateadores `es-ES` de cifras y fechas (`1.284,50 €`, `29 oct 2026`) y diccionario de textos por defecto sustituibles; verificar con tests unitarios
- [x] 4.3 Montar Vitest + Testing Library + `vitest-axe` y un helper que pinta cada componente en claro y en oscuro; verificar con un componente de prueba
- [x] 4.4 Añadir una comprobación que prohíbe hex y utilidades de paleta cruda en `packages/react/src` salvo en `AppIcon`, `CreditCard`, `BrowserFrame` y `VideoPlayer`, cada uno con su motivo (plugin GritQL de Biome o, si no basta, script `bun run check:colors` en CI); verificar que falla con un ejemplo y pasa con el código limpio
- [x] 4.5 Añadir `react-aria-components` y comprobar que funciona en SSR; verificar renderizando un Dialog en servidor sin avisos de ids

## 5. Esqueleto de la web y fundamentos

- [x] 5.1 Crear `apps/docs` en Astro + MDX + `@astrojs/react` con layout propio: cabecera "jotis.me" en Bricolage bold + "Regula", navegación lateral por secciones, pie con la versión de los paquetes; verificar con `bun run --filter docs build`
- [x] 5.2 Implementar el conmutador de tema con script en `<head>` (localStorage + `prefers-color-scheme`, sin parpadeo); verificar con un test de Playwright que tras elegir oscuro y recargar la primera captura ya es oscura
- [x] 5.3 Redactar las páginas de fundamentos desde `reference/GUIA.md`: principios, contenido y tono, tipografía, espaciado/radios/layout, sombras y estados, iconografía, fondos y adornos, marca e iconos de app, uso con Tailwind v4 en Next y Astro; verificar con revisión de que cada apartado del README tiene su página
- [x] 5.4 Generar las páginas de color, tipografía, espaciado, radios y sombras desde `@jotis-me/tokens` con muestra, valores claro/oscuro, utilidad y nota, y copia de la utilidad al pulsar; verificar con un test que añadir un token de prueba lo hace aparecer sin tocar la web
- [x] 5.5 Crear la galería de iconos con buscador y copia de uso React / importación SVG / SVG en bruto; verificar con Playwright que "cal" filtra los iconos correctos
- [x] 5.6 Crear la plantilla de página de componente (descripción, cuándo/qué evitar, ejemplos vivos con `client:visible`, tabla de props con `react-docgen-typescript`, pestañas de código Next/Astro); verificar con una página de prueba
- [x] 5.7 Montar el test de paridad visual (Playwright: captura de `reference/components/<X>/preview.html` frente al ejemplo de la web, en claro y oscuro) y el test de axe por página; verificar con la página de prueba de 5.6

## 6. Proyectos de ejemplo

- [x] 6.1 Crear `examples/next` (App Router, Tailwind v4) siguiendo solo el README de `@jotis-me/react`, con una página de servidor de componentes estáticos y otra con un interactivo; verificar con `next build` y un test de Playwright sin avisos de hidratación en consola
- [x] 6.2 Crear `examples/astro` (`@astrojs/react`, Tailwind v4) con componentes sin directiva, una isla `client:load` y el patrón de envoltorio `.tsx` para props función; verificar con `astro build` que la página estática no incluye JS de componentes y que la isla responde a teclado

## 7. Componentes base

- [x] 7.1 Portar Icon, Button (5 jerarquías, 5 tamaños, destructive, iconos, iconOnly con label obligatorio en tipos, loading, href → `<a>`), CloseButton y ButtonGroup; verificar con tests de props, estados, foco y axe, y con la paridad visual de sus páginas
- [x] 7.2 Portar Badge (pill/badge/modern, colores, dot, icono, onRemove), Tag, Avatar, AvatarGroup y AvatarLabel; verificar con tests, axe y paridad visual
- [x] 7.3 Portar FeaturedIcon, Spinner, Skeleton y ProgressBar; verificar con tests (incluido `prefers-reduced-motion`), axe y paridad visual
- [x] 7.4 Portar AppIcon sobre el módulo de geometría de 3.4 (variantes, tamaños, `solid` por debajo de 20px, sin virgulilla por debajo de 32px); verificar con tests y paridad con `reference/assets/App icons`
- [x] 7.5 Escribir las páginas de la web de los 14 componentes de este grupo desde sus fichas; verificar con el build de la web y con que cada página pasa los tests de 5.7

## 8. Componentes de formulario

- [x] 8.1 Portar Input, Textarea y Select (nativo) con etiqueta, hint, error (`aria-invalid` + `aria-describedby`), tamaños e iconos; verificar con tests de error y foco, axe y paridad visual
- [x] 8.2 Portar Checkbox (indeterminate) y Radio con `<input>` nativo, y RadioGroup y Toggle sobre React Aria (design §5); verificar con tests de teclado (espacio, flechas), axe y paridad visual
- [x] 8.3 Portar Slider y FileUpload (arrastrar, lista de ficheros, progreso, error); verificar con tests de teclado y de `onFiles`, axe y paridad visual
- [x] 8.4 Portar DatePicker (simple y rango, presets, `es-ES`) sobre React Aria; verificar con tests de navegación por teclado y de formato "29 oct 2026", axe y paridad visual
- [x] 8.5 Portar ColorPicker (muestras y hex), TextEditor (formato básico, maxLength) y MessageInput; verificar con tests, axe y paridad visual
- [x] 8.6 Escribir las páginas de la web de los 13 componentes de este grupo; verificar con el build de la web y los tests de 5.7

## 9. Navegación

- [x] 9.1 Portar Tabs (cuatro tipos, contador), Breadcrumbs y Pagination; verificar con tests de teclado y `aria-current`, axe y paridad visual
- [x] 9.2 Portar SidebarNav, Dropdown (ítems, divisores, atajos, danger) y FilterBar; verificar con tests de menú por teclado y Escape, axe y paridad visual
- [x] 9.3 Portar CommandMenu (grupos, filtrado, estado vacío) y TreeView; verificar con tests de búsqueda, flechas y Enter, axe y paridad visual
- [x] 9.4 Escribir las páginas de la web de los 8 componentes de este grupo; verificar con el build de la web y los tests de 5.7

## 10. Superposiciones y avisos

- [x] 10.1 Portar Modal (stacked/horizontal, icono, destructive, backdrop `bg-overlay` 70 % + blur 16px) y Slideout sobre React Aria; verificar con tests de atrapado de foco, Escape y devolución del foco, axe y paridad visual
- [x] 10.2 Portar Tooltip, Alert (floating/full), Notification y Banner (neutro/marca); verificar con tests (nombre accesible, cierre), axe y paridad visual
- [x] 10.3 Portar EmptyState con los textos de ejemplo de la guía; verificar con tests, axe y paridad visual
- [x] 10.4 Escribir las páginas de la web de los 7 componentes de este grupo, incluida la regla "una acción principal por modal"; verificar con el build de la web y los tests de 5.7

## 11. Datos, contenido y maquetas

- [x] 11.1 Portar Table (columna principal, alineación, render, cabecera, pie, tamaños), MetricCard y ActivityFeed; verificar con tests, axe y paridad visual
- [x] 11.2 Portar Message, CalendarView (vista mes, `es-ES`) y CodeSnippet (pestañas, números de línea, Geist Mono); verificar con tests, axe y paridad visual
- [x] 11.3 Portar PageHeader, CardHeader, SectionHeader, SectionFooter, ContentDivider e InlineCTA; verificar con tests de render en servidor sin directiva, axe y paridad visual
- [x] 11.4 Portar BackgroundPattern (cinco patrones con máscara), BrowserFrame, CreditCard y VideoPlayer; verificar con tests, axe y paridad visual
- [x] 11.5 Escribir las páginas de la web de los 16 componentes de este grupo; verificar con el build de la web y los tests de 5.7

## 12. Gráficas

- [x] 12.1 Portar LineChart (área), BarChart (apilado), PieChart (anillo, centro) y ChartLegend con la paleta de series por defecto y leyenda automática con 3+ series; verificar con tests de colores, leyenda y `aria-label`, axe y paridad visual en claro y oscuro
- [x] 12.2 Escribir las páginas de la web de las 4 gráficas, con la advertencia de la tercera serie en oscuro; verificar con el build de la web y los tests de 5.7

## 13. Stream (Twitch)

- [x] 13.1 Reimportar la guía en `reference/` desde la versión `1793561361-ae73` con `scripts/import-artifact/` (README como `GUIA.md`, `VERSION` actualizado) sin regenerar `packages/tokens/src/tokens.json` ni tocar AppIcon (design §12); verificar que hay 74 carpetas de componente con `README.md` y `preview.html` más Cover, que `--missing` no lista nada y que build, tests y la paridad de los 62 componentes existentes siguen pasando (si el bundle nuevo cambia alguna vista previa, anotarlo)
- [x] 13.2 Crear la base común de Stream: raíz con `dark-mode`, entrada y salida con `starting:` y `motion-reduce`, cifras tabulares, iconos y etiquetas de los siete tipos de evento (compartidos por StreamAlert y StreamEvents) y lienzo de tamaño fijo escalable; verificar con tests y con `e2e/motion.spec.ts` que con movimiento reducido solo hay fundido
- [x] 13.3 Portar StreamAlert (siete tipos, `state`, `message` como texto plano), StreamEvents (máximo, hora relativa, detalle en `es-ES`), StreamStatus y ChatBadge; verificar con tests, axe en claro y oscuro y paridad visual
- [x] 13.4 Portar ChatBox (tonos `utility-*`, insignias, desvanecido, translúcido con reserva sólida, solo el último mensaje animado), CamFrame, StreamGoal (`role="progressbar"`, meta conseguida) y NowPlaying; verificar con tests, axe y paridad visual
- [x] 13.5 Portar StreamCountdown (`role="timer"`, `aria-live="off"`, h:mm:ss, se queda en 00:00, `now` y `paused`) y StreamScene (cuatro variantes, 1920×1080, `scale`); verificar con tests de reloj falso, axe y paridad visual
- [x] 13.6 Portar ChannelPanel (320px, una acción) y ChannelBanner (1200×480, zona segura de 120px, `scale`); verificar con tests, axe y paridad visual
- [x] 13.7 Escribir la página de fundamentos `/foundations/stream/` desde la sección de la guía y las páginas de los 12 componentes; verificar con el build de la web y los tests de 5.7

## 14. Búsqueda, publicación y despliegue

- [x] 14.1 Integrar Pagefind con CommandMenu y atajo Ctrl+K / Cmd+K sobre páginas, tokens, iconos y componentes; verificar con Playwright que "modal" encuentra la página de Modal y Enter navega
- [x] 14.2 Configurar Changesets en modo `fixed` para los tres paquetes, versión inicial `0.1.0` y changelog; verificar con `bunx changeset version` en seco
- [x] 14.3 Crear el workflow de CI con `oven-sh/setup-bun` (tipos, `biome ci`, tests, axe, paridad visual, build de ejemplos, `publint`/`attw`, tamaño por componente, Lighthouse CI ≥ 90) y el de publicación (`bun pm pack` + `npm publish <tgz> --provenance`) al fusionar el PR de versión; verificar con un PR de prueba que un test roto bloquea la publicación y que el `package.json` empaquetado no contiene `workspace:`
- [x] 14.4 Crear el proyecto en Vercel (raíz `apps/docs`, `bun install`, previews por PR) y el CNAME de `regula.jotis.me` hacia Vercel; verificar que `https://regula.jotis.me` responde con HTTPS y muestra la versión en el pie
- [x] 14.5 Publicar `0.1.0` de `@jotis-me/tokens`, `@jotis-me/icons` y `@jotis-me/react`; verificar que npmjs.com muestra la procedencia y que `npm install @jotis-me/react` funciona sin credenciales en un directorio vacío

## 15. Comprobaciones de integración

- [ ] 15.1 Crear un proyecto Next.js nuevo y otro Astro nuevo fuera del monorepo siguiendo solo el README publicado y pintar un `Button` en claro y oscuro; verificar que el aspecto coincide con la web
- [ ] 15.2 En el ejemplo Next, importar solo `Button` y analizar el bundle de producción; verificar que no contiene código de `DatePicker` ni de las gráficas
- [ ] 15.3 Recorrer la web publicada con axe y Lighthouse en móvil (portada, una página de fundamentos, una de componente) en ambos temas; verificar los umbrales del spec `docs-site`

## Workflow follow-up

- Archivar el cambio cuando la web esté publicada y `0.1.0` en npm.
- Abrir un cambio por app (Vinculum, Pecunia, Emptor, Ornatus) para migrarla a los paquetes.
- Abrir un cambio para las fuentes de reserva ajustadas en `@jotis-me/tokens` (`size-adjust` y `ascent-override` para Geist, Geist Mono y Bricolage), de modo que el cambio de fuente no desplace el texto con red lenta (ver NOTAS.md, 14.3).
