# Tasks

Comandos: `bun run --cwd apps/docs build`, `bun run --cwd apps/docs test`, `bun run --cwd apps/docs check:js`, `bunx biome ci .`, `bunx turbo run typecheck build` y los e2e de `apps/docs` (Chromium, Firefox y WebKit). Cada tarea va en su propio commit, con las capturas que cambie revisadas en claro y oscuro (y en móvil si toca la estructura) y sus notas en `NOTAS.md`. Si un componente del paquete cambia, va con su test, ficha, ejemplo, captura y changeset.

## 1. Ancho del contenedor

- [x] 1.1 Sacar la barra lateral del contenedor y poner `max-w-container` (1280) con el padding del contenedor a cabecera, contenido (con el índice derecho) y pie, en `Base.astro`, `SiteHeader.astro`, `SiteFooter.astro` y `ComponentPage.astro` (design D1). Verificar con un e2e nuevo en `e2e/layout.spec.ts`: a 1920 px, la barra lateral empieza en x=0 y el contenido, la cabecera y el pie miden como mucho 1280; a 1280 px, no hay desplazamiento horizontal. Rehacer y revisar las capturas de página afectadas.

## 2. Muestras del índice a tamaño real

- [x] 2.1 Quitar `scale` y `ScaledPreview` de `visual/thumbnails.tsx` y añadir a `LivePreview.astro` el recorte con ancla (`crop`) y fundido con `mask-image` (design D2). Añadir el test unitario que falla si alguna muestra declara una escala, y el e2e sobre `/components/` que comprueba que ninguna vista previa tiene una transformación con escala menor que 1. Este test fallará hasta 2.2.
- [x] 2.2 Rehacer las 60 muestras encogidas para que enseñen una pieza a tamaño real (`Table` con cabecera y tres filas, `CalendarView` con una semana, gráficas a ancho de la caja, `Banner` flotante…), por grupos del catálogo. Verificar que pasan el test y el e2e de 2.1 y los de «Vista previa decorativa». Revisar las capturas de `/components/` en claro y oscuro: ningún texto por debajo de 12 px.

## 3. Estructura con los componentes del paquete

- [x] 3.1 Cabecera con `HeaderNav` (design D5): marca, cinco secciones con `current`, `SiteSearch` y `ThemeMenu`, con «Saltar al contenido» delante. Si falta algo en `HeaderNav`, ampliarlo con una prop opcional y su test de HTML idéntico sin ella. Verificar con los e2e de cabecera, búsqueda (Cmd+K) y tema, y con el test de que la cabecera es un `HeaderNav`.
- [ ] 3.2 Barra lateral y menú móvil con `SidebarNav` (secciones, filtro con `/`, contadores por grupo y grupo actual abierto), ampliando `SidebarNav` si hace falta. Verificar con los e2e de «Filtrar la navegación», «Grupo del componente actual» y «Menú móvil» sin cambiar lo que comprueban, y con a11y (axe) en una página de componente.
- [x] 3.3 Pie con `Footer` (marca, descripción actual, columnas y legal), ampliándolo si hace falta. Verificar con el e2e del pie y las capturas en claro, oscuro y móvil.
- [x] 3.4 Portada con los componentes del paquete (`SectionHeader`, `LinkCard`, `FeaturedIcon`, `Badge`, `Button`, `BackgroundPattern`), con el mismo contenido y orden. Verificar con el test «Cifras reales», el e2e de la portada, la captura revisada y `check:js` de `/` dentro de su límite.
- [ ] 3.5 Comprobar que ninguna pieza de la estructura queda a mano: un test recorre `SiteHeader`, `SideNav`, `SiteFooter`, `MobileMenu` y la portada y falla si alguno pinta navegación o enlaces fuera de un componente del paquete. Anotar en `NOTAS.md` los huecos de componentes encontrados en el grupo 3 y la changeset de `@jotis-me/react` si hubo cambios.

## 4. Motor del ejemplo interactivo

- [x] 4.1 Definir `PlaygroundConfig` y los controles nuevos (número, icono, contenido preparado y oculto) generados de `propsOf` y ajustados por la config (design D3). Pintarlos en `Playground.tsx` con componentes del paquete (`NumberInput`, `Select` con iconos y `Select` para el contenido). Tests unitarios en `test/playground.test.ts` para la generación de cada tipo de control y para el código que escribe cada uno (incluidos los imports de `@jotis-me/icons` cuando el icono no está en el núcleo).
- [x] 4.2 Atajos y reglas: chips de atajos con su estado marcado, controles desactivados con el motivo en `aria-describedby`, props desactivadas fuera del componente y del código, y valor guardado al reactivarlas. Verificar con tests unitarios del estado y con un e2e en `e2e/playground.spec.ts` para `Button` (`iconOnly` desactiva `iconTrailing`) y para un atajo, también con teclado.
- [x] 4.3 Carga por componente (design D4): configs en `src/playground/<Componente>.tsx` cargadas con `import.meta.glob` y `lazy`, y retirada de `playground-components.ts` y su test. Migrar los 62 puntos de partida de `STARTS` a configs. Verificar que el HTML del servidor trae el ejemplo completo (e2e con JS desactivado), que `/components/button/` no descarga `CalendarView`, `ColorPicker`, `Carousel` ni `StreamScene` (scenario «Página de un componente») y que `check:js` lo mide.
- [x] 4.4 Test de configs (`test/playground-config.test.ts`, design D3): cada componente del catálogo con config; props y valores de `start`, `presets`, `rules` y `controls` válidos contra `propsOf`; ninguna prop configurable sin control ni `hidden`; cada atajo pinta sin errores y su código compila. Marcar como pendientes, en una lista explícita del test que debe quedar vacía al final del grupo 5, los componentes que todavía no tienen config.

## 5. Configs por grupo

Cada tarea: config con punto de partida, controles ajustados, atajos con los tipos del Figma (tabla de NOTAS 13.1 de `complete-figma-coverage`) y reglas de incompatibilidad de cada componente del grupo. Se quitan de la lista de pendientes de 4.4. Verificar con el test de configs, un e2e por grupo que recorre los atajos de cada componente sin errores de consola, y axe en las páginas del grupo.

- [ ] 5.1 Acciones y Formularios.
- [ ] 5.2 Navegación y Capas.
- [ ] 5.3 Avisos y carga, y Etiquetas e identidad.
- [ ] 5.4 Datos y Gráficas.
- [ ] 5.5 Estructura de página, y Contenido y medios.
- [ ] 5.6 Fondos y maquetas, y Web de marketing.
- [ ] 5.7 Los cuatro grupos de Stream, en oscuro. Verificar además que la lista de pendientes de 4.4 queda vacía.

## 6. Página sin galería y límite de JS

- [ ] 6.1 Quitar «Variantes y estados» de `ComponentPage.astro` y de `[slug].astro` (y su entrada en «En esta página»), dejando el ejemplo interactivo como primera sección y las composiciones donde están (design D6). Actualizar los e2e y tests que buscaban `#variantes` (`components`, `copy`, `stream`, `component-page`) y la ficha de la web que describe la página. Verificar con el scenario «Sin galería de variantes» y los e2e completos.
- [ ] 6.2 Medir con `check:js` y bajar `/components/*/` en `js-budget.json` a lo medido más un 10 %, con el motivo en `$comment`. Verificar que `check:js` pasa y que el límite queda por debajo de 380.

## 7. Cierre

- [ ] 7.1 Pasada completa: build, tests de la web y del paquete, `check:js`, `check:size`, `biome ci`, typecheck, e2e completos en los tres navegadores y artefacto (`bun test` de `scripts/artifact`, que no debe cambiar). Revisar en claro, oscuro y móvil una página de cada grupo, `/components/` y la portada. Anotar en `NOTAS.md` lo que se decidió sin consultar.

## Workflow follow-up

- Antes de empezar: cerrar `complete-figma-coverage` (PR a `main` y `/opsx:archive`) y crear la rama de este cambio desde `main`.
- PR en borrador al terminar el grupo 3, para ver la estructura nueva en el despliegue de vista previa.
- Archivar con `/opsx:archive` tras la revisión.
