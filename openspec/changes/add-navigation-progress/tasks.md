# Tasks

Cada grupo trae sus propios tests, su página y sus capturas, y acaba en un commit. La referencia visual de cada pieza es su nodo del Figma (tabla del Context de design.md): antes de escribir, `get_design_context` del nodo (con la skill `figma-design-to-code`) para medidas, radios y estados, traducidos a los tokens semánticos. Las capturas nuevas se miran en claro y oscuro antes de aprobarlas. Comandos: `bun run --cwd packages/react test`, `bunx biome ci .`, `bunx turbo run typecheck build` y los e2e de `apps/docs`.

## 1. Foco de los campos sin doble borde (petición del usuario)

- [x] 1.1 Quitar el `has-[:focus-visible]` con `focus-ring-shadow` de `CONTROL` y `CONTROL_ERROR` en `packages/react/src/internal/field.tsx` (design D10), y revisar las casillas de `VerificationCodeInput`. Tests: con teclado (Tab) un `Input`, un `Select` y un `Textarea` llevan el borde de 2px y su sombra no incluye el anillo; un `Button` con Tab sigue con su anillo. Captura ampliada de un campo con foco de teclado en claro y oscuro, mirada: un solo borde, como el nodo `7953:158036`.
- [x] 1.2 Cambiar las fichas que hablan del anillo en los campos (`apps/docs/src/content/components/input.md` y las que lo repitan: `grep -rn "anillo" apps/docs/src/content/components`) y los tests o e2e que lo esperen en un campo. Verificar `bun run --cwd packages/react test` y los e2e de componentes y `a11y.spec.ts`.

## 2. `Select` con el menú del Figma (petición del usuario)

- [ ] 2.1 Rehacer `Select` sobre el `Select` de React Aria (design D9), mirando los nodos `3281:377673`, `7953:158048`, `7953:158036` y `3281:380429`: marco y tamaños de siempre, opciones con `supporting`, `icon`, `avatar` o `dot`, check de marca en la elegida y `onChange(value)`. Tests: no hay menú nativo, ↓ abre y elige, Enter devuelve el foco al campo, el valor viaja en un formulario con `name`, `disabled`, `placeholder`, y el texto de apoyo y el icono salen en el campo.
- [ ] 2.2 Pasar `leadingSelect` y `trailingSelect` de `Input` a la misma lista (componente interno compartido) y actualizar los usos de `Select` del repo al nuevo `onChange` (`grep -rn "<Select" apps/docs/src packages/react/src`: `Playground.tsx`, ejemplos, muestras y fragmentos). Tests de `Input` con desplegable y del `Playground` (`e2e/playground.spec.ts`, que hoy usa `selectOption` sobre un `<select>`).
- [ ] 2.3 Ficha de `Select` con las opciones nuevas y el cambio de `onChange`, ejemplo con la lista abierta como en el Figma (`defaultOpen` o equivalente para la vista previa), capturas de `Select` e `Input` vueltas a aprobar tras mirarlas, y un e2e en Chromium, Firefox y WebKit (`e2e/cross-browser/`) que abre, elige y envía.

## 3. Listas en el historial de cambios (petición del usuario)

- [ ] 3.1 Añadir a `apps/docs/src/lib/changelog.ts` la división del texto de una entrada en bloques de párrafo y de lista (design D11) y pintarlos en `src/pages/changelog.astro` con `<p>` y `<ul>`/`<li>`, los dos con `InlineCode`. Test unitario en `test/changelog.test.ts` con la entrada de la 0.4.0 (dos listas y un párrafo entre ellas) y un e2e que cuenta los `li` de esa entrada en `/changelog/` y comprueba que no quedan guiones sueltos. Captura de la entrada en claro y oscuro, mirada.

## 4. `Tooltip` con posición y `HelpIcon`

- [ ] 4.1 Añadir `placement` y `arrow` a `Tooltip` (design D7), con las flechas de izquierda y derecha en `internal/bubble.ts`, mirando el nodo `1052:489`. Tests: cada posición pone la burbuja y su flecha en su sitio (en `open`), `arrow={false}` la quita y, sin props, el HTML es el de hoy. Verificar que la captura aprobada de `Tooltip` no cambia.
- [ ] 4.2 Crear `HelpIcon` (design D7) mirando el nodo `1054:13`. Tests: es un botón con nombre «Ayuda: <título>», abre el tooltip al enfocarlo y pasa `placement`. Página en el grupo «Capas» con su ficha, ejemplo (posiciones y con texto de apoyo), muestra, fragmento y capturas aprobadas.

## 5. `ProgressCircle`

- [ ] 5.1 Crear `ProgressCircle` (design D3) con medidas y grosores del nodo `1084:2717`. Tests: `role="progressbar"`, `aria-valuenow` y nombre, el arco cubre el valor (largo del trazo), `shape="half"`, valores fuera de 0–100 recortados y se pinta en el servidor.
- [ ] 5.2 Página en «Avisos y carga» con ejemplo de los cinco tamaños en círculo y semicírculo, muestra, fragmento y capturas aprobadas.

## 6. `ProgressSteps`

- [ ] 6.1 Crear `ProgressSteps` (design D2) con los cinco tipos, los tres marcadores, `sm` y `md` y las dos orientaciones, mirando los nodos `1138:23`, `1138:1954`, `1141:76669`, `1254:144290`, `1139:79465`, `1139:79149` y `1139:79128`. Tests: lista ordenada, `aria-current="step"` en el actual, estado de cada paso para lectores, «Paso 3 de 4» en los mínimos, check en `fg-success-primary` con números, y vertical con la línea entre marcadores.
- [ ] 6.2 Página en «Avisos y carga» con ejemplo de los tipos (horizontal y vertical), muestra, fragmento y capturas aprobadas, mirando que coinciden con el Figma.

## 7. `PaginationDots` y `Carousel`

- [ ] 7.1 Crear `PaginationDots` (design D4) mirando los nodos `1111:1` y `1111:38`. Tests: indicador con «n de N» para lectores y sin botones; con `onChange`, botones «Ir a la página n de N» con `aria-current`; `dot`/`line`, `md`/`lg` y `framed`.
- [ ] 7.2 Crear `Carousel` (design D4) mirando los nodos `1253:164` y `1253:237`. Tests: flechas que pasan y se deshabilitan en los extremos, puntos que llevan a cada diapositiva, ← y → con el foco dentro, deslizar con eventos de puntero (umbral de 48px), diapositivas ocultas con `inert` y `aria-hidden`, región con `aria-roledescription="carrusel"`, sin transición con movimiento reducido.
- [ ] 7.3 Páginas de `PaginationDots` («Navegación») y `Carousel` («Contenido y medios»), con diapositivas hechas con componentes (sin fotos), muestras, fragmentos y capturas aprobadas. Un e2e que pasa diapositivas deslizando con la emulación táctil de Chromium.

## 8. `Tabs` verticales

- [ ] 8.1 Añadir `orientation`, `button-minimal` y `line` a `Tabs` (design D8), con el `Select` nativo por debajo de `lg` en vertical, mirando los nodos `43:2412`, `1397:9880` y `1118:69893`. Tests: `aria-orientation="vertical"`, ↓ pasa a la siguiente, raya de 2px de la actual en `line`, el desplegable cambia el panel, `line` en horizontal se pinta como `underline` y, sin props nuevas, el HTML es el de hoy.
- [ ] 8.2 Añadir al ejemplo de `Tabs` las verticales (`line` y `button-minimal`), volver a aprobar sus capturas tras mirarlas y un e2e a 390px con el desplegable. Ficha actualizada.

## 9. `ContextMenu`

- [ ] 9.1 Sacar el pintado de las opciones de `Dropdown` a un módulo interno compartido (design D6) y verificar que los tests y la captura de `Dropdown` no cambian.
- [ ] 9.2 Crear `ContextMenu` (design D6) mirando los nodos `11547:540792`, `11546:537565` y `11546:538631`: clic derecho en el punto del puntero, Mayús+F10 y tecla de menú, atajos, iconos, secciones con check (múltiple) y punto (única), separadores y submenús. Tests: el menú del navegador no sale, foco en la primera opción, elegir cierra, → abre el submenú y ← lo cierra, Escape devuelve el foco y las marcas de elección se anuncian.
- [ ] 9.3 Página en «Navegación» con el ejemplo simple y el avanzado del Figma, muestra, fragmento y capturas aprobadas, y un e2e con clic derecho real, también cerca del borde de la ventana.

## 10. `HeaderNav`

- [ ] 10.1 Añadir `side` a `Slideout` (`right` por defecto, `left`). Test del lado y verificar que la captura de `Slideout` no cambia.
- [ ] 10.2 Crear `HeaderNav` en escritorio con los cuatro tipos (design D5) mirando los nodos `1208:104342`, `1208:101427`, `11910:608084`, `11910:613771`, `1152:89220` y `1165:736`. Tests: `banner`, navegación con `aria-current="page"`, segunda fila con subsecciones en `dual-tier`, `tabs` (enlaces con aspecto de pestaña, sin `tablist`) y `centered`, y acciones y cuenta.
- [ ] 10.3 Añadir el menú móvil (design D5) mirando los nodos `1208:104358`, `1208:101749`, `11910:613336`, `11910:613804`, `1152:90366` y `1161:14070`: botón de menú bajo `lg`, `Slideout` desde la izquierda con buscador, navegación con secciones desplegables, enlaces de pie y cuenta. Tests: foco atrapado, Escape devuelve el foco al botón y `aria-expanded` al desplegar.
- [ ] 10.4 Página en «Navegación» con los cuatro tipos, muestra, fragmento y capturas aprobadas, y un e2e a 1440 y 390px: secciones, segunda fila, menú móvil abierto y cerrado, sin desplazamiento horizontal.

## 11. Integración

- [ ] 11.1 Changeset `minor` de `@jotis-me/react` (que avisa del cambio de `onChange` en `Select`, design D9). Pasar `bunx biome ci .`, `bunx turbo run typecheck test build`, el e2e completo de la web y los tests del artefacto (91 componentes), y verificar que todo queda en verde.

## Workflow follow-up

- Va en la misma PR que `fix/review-comments`, `theme-selector` y `promote-docs-pieces`. Lighthouse lo mide el CI.
- Archivar después de `promote-docs-pieces` (los dos modifican el requisito de catálogo).
- Después de publicar la versión: sincronizar el artefacto (siete componentes nuevos, sin assets) y proponer la fase 3.
