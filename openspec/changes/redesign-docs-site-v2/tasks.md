# Tasks

Un grupo por parte de la web, en el orden de la tabla de cambios del documento del rediseño. Cada grupo trae sus tests y e2e, sus capturas miradas en claro y oscuro a 1.440 y 390 px frente al lienzo, y acaba en un commit. Comandos: `bunx biome ci .`, `bunx turbo run typecheck build`, `bun run --cwd apps/docs check:js`, los e2e de `apps/docs` y la auditoría (axe y Lighthouse).

## 0. Antes de empezar

- [ ] 0.1 Comprobar que `unblock-docs-redesign`, `add-docs-variants` y `add-docs-pieces` están archivados y su versión publicada, y subir `apps/docs` a ella.

## 1. Esqueleto común

- [ ] 1.1 `SiteHeader` con `HeaderNav` `fullWidth` (design D1). E2E: a 1.920 px la marca queda alineada con el lateral.
- [ ] 1.2 Layouts con `PageHeader`, `SectionHeader`, columna de lectura y espaciado común. Test: un solo `h1` por página y secciones en `h2`.
- [ ] 1.3 «En esta página» con `Tabs` de enlaces y la sección que se lee marcada. E2E con `aria-current="location"`.

## 2. Navegación lateral

- [ ] 2.1 `SideNav` con `SidebarNav` `disclosure="native"` y el árbol de la sección (design D2), conservando el script del filtro. E2E: sin JavaScript se abre y se cierra; «tabla» encuentra `Table`; en color no salen los grupos de componentes; portada, iconos y 404 sin lateral.
- [ ] 2.2 `MobileMenu` con el lateral de toda la web, plegado salvo el bloque actual.

## 3. Página de componente

- [ ] 3.1 `groups` en los arranques de `src/lib/starts/` y test que avisa de los componentes con más de doce props sin grupos (design D3). Grupos de `Button`, `Input` y `Table` primero, luego el resto.
- [ ] 3.2 `Playground` en tres zonas, grupos con `Disclosure`, filtro con más de doce controles y atajos en `Select`.
- [ ] 3.3 Cambios a la vista: `labelAside` con «Cambiado» y «Restablecer», recuento por grupo, tira de `Tag`, `highlight` en el código y «Restablecer todo». E2E de los escenarios «Ver lo cambiado», «Restablecer» y «Muchas props».
- [ ] 3.4 Motivo de los controles desactivados en `hint`. E2E con teclado.
- [ ] 3.5 «Cuándo usarlo» y «Evita» con `ExampleCard`; la ficha da el texto y el arranque los especímenes. Relacionados con `LinkCard`.
- [ ] 3.6 Móvil: lienzo pegado, columna de grupos, barra inferior y props como lista de `Disclosure`. E2E a 390 px.

## 4. Portada

- [ ] 4.1 Cabecera con la instalación, la búsqueda y el formulario en `BrowserFrame` con divisa en el importe (design D4).
- [ ] 4.2 Historia de las reglas con `ProgressSteps`, `Spotlight` y la pantalla de Pecunia; en móvil, `Carousel` `strip`. E2E de «Historia de las reglas» y «Reglas en móvil».
- [ ] 4.3 «Así se ve» con `CompareSlider` y `light-mode`. E2E de «Claro y oscuro a la vez». Medir Lighthouse; si baja de 90, la copia oscura se pinta al entrar en pantalla.
- [ ] 4.4 Mapa y suite. Revisar el límite de `check:js` de `/` y anotar cuánto sube.

## 5. Índice de componentes

- [ ] 5.1 Mapa de grupos con sus frases, buscador por nombre, descripción y palabras clave, y `Select` de grupo (design D5). E2E de «Buscar por lo que hace» y «Mapa de grupos».
- [ ] 5.2 Cards a tres columnas con su captura (`ShowcaseImage`), sin tocar las capturas ni su carga perezosa.

## 6. Fundamentos

- [ ] 6.1 Pares de `ExampleCard` en las páginas que enuncian reglas (design D6).
- [ ] 6.2 Explorador de tokens con familias y `TokenSwatch`; tarjetas en móvil. E2E de «Filtrar» y «En móvil».
- [ ] 6.3 Contenido y tono con pares «en lugar de, mejor».

## 7. Iconos

- [ ] 7.1 Navegación de sets con `Tabs` de enlaces, filtros en una fila y rejilla de `IconTile` (design D7).
- [ ] 7.2 Panel fijo en escritorio y `Slideout` `bottom` en móvil. E2E de «Cambiar de set» y «Panel en móvil».

## 8. Estados

- [ ] 8.1 Carga, sin resultados y error al copiar (design D8). E2E de «Sin resultados en el índice» y «Copiar falla» (con el portapapeles bloqueado).

## 9. Cierre

- [ ] 9.1 Auditoría completa (axe y Lighthouse en portada, índice, una de fundamentos y una de componente), `check:js` con los límites revisados y el e2e completo con Firefox y WebKit.

## Workflow follow-up

- Archivar tras desplegar en regula.jotis.me.
