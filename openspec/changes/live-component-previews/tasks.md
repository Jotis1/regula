# Tasks

Todo en `apps/docs`. Tests unitarios con `bun run test`; e2e con `bunx playwright test --project=chromium` tras `bunx turbo run build --filter=docs...`.

## 1. Medida de partida

- [x] 1.1 Medir `/components/` antes de tocar nada y apuntarlo en `openspec/changes/live-component-previews/NOTAS.md`. Lighthouse no se puede ejecutar en esta máquina (Chrome bloqueado y Lighthouse se cuelga con el Chromium de Playwright), así que son dos medidas:
  - **Local**, con `apps/docs/scripts/measure-page.ts` (Chromium de Playwright por CDP, emulación móvil con CPU a 4×): peso del HTML y de lo que pide al cargar, nodos del DOM y tiempos de maquetación, de estilos y de tareas, en mediana de varias pasadas.
  - **CI**: un primer commit solo con `/components/` añadido a las `url` de `lighthouserc.json`, para que el CI de la PR dé la nota real de Lighthouse de la página antes del cambio.

  Se comprueba con las cifras de las dos medidas escritas en las notas.

## 2. Escenario y prueba con seis componentes

- [x] 2.1 Mover `VIEWPORT_WIDTH` a `src/visual/cards.ts` y que `e2e/visual/compare.ts` lo importe de allí. Comprobar que `e2e/visual.spec.ts -g "controles"` y `bun run test` pasan.
- [x] 2.2 Crear `src/visual/thumbs.ts` con `PREVIEW_BOX` (288×180) y una función pura `thumbOf(name)` que encaja el ejemplo entero en el escenario: escala y desplazamiento. Es el respaldo de D2 para un componente sin muestra. Tests unitarios en `test/thumbs.test.ts`:
  - el ejemplo entero (800 × `CARD_HEIGHTS`) cabe en 288×180 sin pasar de 1 y queda centrado;
  - un componente sin alto en `CARD_HEIGHTS` falla con su nombre.
- [x] 2.3 Crear `src/components/LivePreview.astro`: el escenario (D2), con `inert`, `aria-hidden`, `pointer-events-none`, `content-visibility` (D5) y `dark-mode` si el componente está en `DARK_PREVIEWS` (D4). Dentro, la muestra del componente (D2) o, si no tiene, su `VisualExample` entero, sin directiva `client:*` (D1).
- [x] 2.4 Pasar a muestras propias (D2, revisión de la primera prueba):
  - crear `src/visual/thumbnails.tsx` con las de Button, Input, Table, DatePicker, StreamAlert y StreamScene (esta con `scale` fija, D7);
  - el fondo de cuadros en el recuadro (D4);
  - quitar las zonas, `stageScale` y la regla CSS de la primera versión.

  Tests: `test/thumbs.test.ts` sin zonas y un test de que `LivePreview` usa la muestra si existe.
- [x] 2.5 Montar la card nueva en `index.astro` (D3): vista previa fuera del `<a>`, enlace que cubre la card con `after:inset-0`, y foco y hover en el `<li>`. Activarla solo para Button, Input, Table, DatePicker, StreamAlert y StreamScene; el resto sigue con su foto. Comprobar en local, en claro y en oscuro, a 390, 768 y 1440px, y enseñar capturas de esas seis cards a la persona usuaria antes de seguir (Migration Plan, paso 1).

## 3. Todas las cards

- [x] 3.1 Escribir en `thumbnails.tsx` la muestra de los 78 componentes, pasar todas las cards a vista previa en vivo y quitar la rama de la foto de `index.astro`. Añadir el test que exige una muestra por componente del catálogo. Revisar cada card en claro y en oscuro. Comprobar con una captura de página completa de `/components/` en los dos temas, que se adjunta a la PR.
- [x] 3.2 Reescribir el e2e de las cards en `e2e/components.spec.ts`:
  - la card de `ButtonGroup` contiene un `ButtonGroup` pintado (sin `<img>`);
  - Tab pasa de card a card sin entrar en las vistas previas;
  - el nombre accesible de la card es el de siempre;
  - un clic sobre un botón dibujado abre la página del componente;
  - al pasar a oscuro, la vista previa cambia sin peticiones nuevas;
  - las de Stream van en oscuro en los dos temas;
  - la página no carga ninguna isla de `VisualExample`;
  - ninguna de las 78 vistas previas sale vacía (captura del escenario con más de dos colores), que cubre `StreamScene` y `ChannelBanner` con su `scale` fija (D7).

  Comprobar que pasan este e2e, el que lista el índice y `e2e/a11y.spec.ts -g "/components/ "`, sin ids duplicados.
- [ ] 3.3 Añadir un test (unitario o e2e) para «Build sin capturas»:
  - construye la web con una copia de `e2e/visual/approved/` a la que le falta la PNG de un componente;
  - termina sin errores;
  - la card del componente tiene su vista previa.

  Si construir dos veces es demasiado lento para el CI, que el test compruebe que ningún módulo de `src/` lee `e2e/visual/approved/` (como hace `check:reference` con `reference/`), y hacer a mano la prueba del build una vez.

- [x] 3.4 Arreglar en `@jotis-me/react` los ids repetidos de `Dropdown` con `defaultOpen` en el HTML de servidor (decisión del usuario, lo encontró el e2e de 3.2): panel en línea fuera de `MenuTrigger` y opciones con sus huecos de React Aria. Test de SSR en `test/menus.test.tsx` (ids únicos y sin referencias rotas), paridad visual de `Dropdown` igual, `axe` de su página en verde y changeset *patch*.

## 4. Limpieza

- [ ] 4.1 Borrar `src/lib/previews.ts`, `src/pages/components/previews/[file].webp.ts` y `test/previews.test.ts`; quitar `sharp` de `apps/docs/package.json` con `bun remove sharp` en `apps/docs`. Comprobar que `bunx turbo run build --filter=docs...`, `bun run test` y `bun run lint` pasan y que `grep -r sharp apps/docs/src` no encuentra nada.
- [ ] 4.2 Actualizar el `README.md` de `apps/docs`: las cards del índice pintan el ejemplo en vivo con `THUMBS`, y las capturas aprobadas son solo para la paridad visual. Revisar también el paso «Componente nuevo» del README, que ya no necesita la PNG para que el build funcione, aunque el test de catálogo la sigue exigiendo.

## 5. Medida final y PR

- [ ] 5.1 Repetir las dos medidas de 1.1 y apuntarlas en `NOTAS.md` junto a las de partida. Comprobar que la aserción de `lhci` para `/components/` sigue pasando (mediana de 3 pasadas ≥ 0,9), que la ejecución representativa no empeora respecto a la de partida (rendimiento 84, LCP 4,2 s) teniendo en cuenta lo ruidosa que es, y que en la medida local los nodos, los tiempos y el peso no empeoran sin razón. Si algo empeora, aplicar las salidas del riesgo «DOM grande» del design y volver a medir antes de seguir.
- [ ] 5.2 Pasar `bun run ci` y la suite de e2e de la web entera (`bunx playwright test`). Abrir la PR con las capturas de 3.1 y las cifras de 5.1, y comprobar que el CI completo pasa.

## Workflow follow-up

- Tras el merge, comprobar en la web publicada que `/components/` se ve igual que en local.
- Archivar el cambio con `/opsx:archive`.
