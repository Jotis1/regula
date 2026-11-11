# Tasks

Cómo se trabaja en cada task:
- Cada task acaba en un commit, con sus tests, su página o ficha actualizada y sus capturas.
- Antes de escribir, se lee el nodo del Figma de la pieza (tabla del Context de design.md) con `get_design_context` (skill `figma-design-to-code`) para medidas, radios y estados, traducidos a tokens semánticos.
- Las variantes `Mobile` se cubren con diseño adaptable (design D5).
- Sin las props nuevas, el HTML de cada componente es el de antes (test con `renderToStaticMarkup`).
- Las capturas se miran en claro y oscuro antes de aprobarlas, y las diferencias aceptadas con el Figma se anotan en `NOTAS.md` del cambio.

Comandos:
- `bun run --cwd packages/react test`
- `bun run --cwd packages/icons test`
- `bunx biome ci .`
- `bunx turbo run typecheck build`
- `bun run --cwd packages/react check:size`
- `bun run --cwd apps/docs check:js`
- los e2e de `apps/docs`, completos al cerrar cada grupo

Nunca se ejecuta `turbo run typecheck` mientras corre el e2e de docs.

## 1. Cimientos de iconos (`@jotis-me/icons`)

- [x] 1.1 Importar los 1.172 iconos de línea de los 19 marcos de la página `3463:407484` con un script (export por marco con `download_assets` y recorte local, como `import-logos.ts`) a `src/data/icons.ts`. Tests:
  - 1.172 nombres sin repetir («colors» está en dos categorías del Figma con el mismo dibujo: cuenta una vez);
  - los 82 de hoy conservan nombre y dibujo (fixture);
  - cada dibujo tiene trazo `currentColor` y viewBox 24×24.

  Mirar una muestra por categoría en claro y oscuro.
- [x] 1.2 Separar el set núcleo del completo (design D1):
  - `src/data/core.ts` con `IconName` y `iconNames`, y `allIconNames`;
  - `scripts/generate.ts` crea cada `IconXxx` con su dibujo en línea;
  - `dist/svg/` con los 1.172.

  Tests:
  - un import suelto de `IconRocket02` empaquetado no contiene otros dibujos;
  - `Icon name` solo acepta el núcleo (test de tipos);
  - cada icono que nombra `packages/react/src` está en el núcleo.

  En `@jotis-me/react`, comprobar que `iconSlot` y las props `icon*` aceptan nodos (requisito «Iconos de cualquier set en los componentes») y medir `check:size`.
- [x] 1.3 Banderas en `@jotis-me/icons/flags` (design D2) desde `11834:15048`. Test de nombres (261 × circle, square, rectangle), `viewBox`, sin ids y accesibilidad con y sin `title`.
- [x] 1.4 Pagos en `@jotis-me/icons/payments` desde `1142:83268` (56 × `sm`, `md`), con los mismos tests.
- [x] 1.5 Archivos (`4916:411695`, 153) y carpetas (`7585:9240`, 8) en `@jotis-me/icons/files`, con los mismos tests.
- [x] 1.6 Cursores (`9342:257073`, 50) en `@jotis-me/icons/cursors`, con los mismos tests y un e2e que use un cursor en CSS. Los emojis del Figma (18 PNG con el arte de emoji de Apple) se dejan fuera por licencia (decisión del usuario).
- [x] 1.7 `exports`, `check:package` (`publint`, `attw`) y medida del tarball con `scripts/pack.ts` antes y después, anotada. Si pasa de 15 MB sin comprimir, parar y preguntar (Risks). Changeset `minor` de `@jotis-me/icons` con la ruptura de `IconName` declarada.
- [x] 1.8 Galerías de la web (design D9):
  - `/icons/` con los 1.172 y el código de `IconXxx` para los que no están en el núcleo;
  - páginas de banderas, pagos, archivos y cursores en `IconsNav.astro` y en la navegación lateral;
  - nota de la ruptura en `/icons/`.

  E2E: buscar y copiar en cada galería. `check:js` dentro de límite y HTML de `/icons/` bajo 400 kB, o paginado por categoría.

## 2. Variantes: identidad y etiquetas

- [x] 2.1 `Avatar`: `badge` `verified`, `count` y `company` en los seis tamaños (`11008:45389`, `11008:45024`), con texto para lectores, y el icono de usuario sin foto. `AvatarGroup`: `onAdd`/`addLabel` (`1102:4864`). `AvatarLabel`: `size` (`82:2793`). Tests, ejemplos y capturas.
- [x] 2.2 `Badge`: `flag`, `avatar`, `iconTrailing` e `iconOnly` con `label` obligatorio (`1046:3819`). Ejemplos con banderas de `@jotis-me/icons/flags`.
- [x] 2.3 `Tag`: `flag`, `avatar` y `checkable`/`checked`/`onCheckedChange` (`3307:417515`, `3308:406033`). Tests de teclado de la casilla. Ejemplos y capturas.

- [x] 2.4 Web: cada página carga solo los ejemplos de su componente (design D11). La isla `VisualExample` deja de importar el registro entero y carga con `React.lazy` el fichero de `src/visual/examples/` que exporta `<Nombre>Example`. Tests: cada nombre del registro tiene fichero y export, y la isla de una página no incluye los ejemplos de otros ficheros. `check:js` con límites nuevos medidos (más un 10 %) y paridad visual y e2e de interacción sin cambios. Añadida a petición del usuario al cerrar el grupo 2.
## 3. Variantes: botones y comprobaciones

- [x] 3.1 `ButtonGroup`: `size`, `iconOnly` + `label` y `dot` en los elementos (`1046:10171`). `CloseButton`: `size` y `onDark` (`2763:420129`). Tests, ejemplos y capturas.
- [x] 3.2 Comparar `Tabs` (página `43:0`, `Full width`) y `CodeSnippet` (página `1221:106300`, `Horizontal` y `Vertical`) con el Figma. Añadir lo que falte con tests y capturas, o anotar en `NOTAS.md` que ya estaba.

## 4. Variantes: formularios

- [x] 4.1 `Dropdown` (`3281:383083`):
  - `searchable` y `footer`;
  - `variant` de integraciones y las seis de cuenta, con `accounts`;
  - `triggerVariant="link"`.

  Tests de teclado de la búsqueda y del cambio de cuenta. Ejemplos con logos de integraciones y capturas.
- [x] 4.2 `Input` (`1090:57817`):
  - `type="card"` con agrupado y logo de red por `cardLogos`;
  - `trailingButton`;
  - fecha y hora;
  - archivo.

  Tests de formato de tarjeta y del botón. `Textarea` (`1238:278`): `tags` + `tagPlacement` reutilizando `TagInput`. Ejemplos y capturas.
- [x] 4.3 `ProgressBar`: etiquetas `top-floating` y `bottom-floating` (`1085:57382`). `Slider` (`1086:534`, `3287:442783`): `range`, `label` y `formatValue`, con tests de teclado de los dos mandos (el mínimo no pasa del máximo, un nombre por mando). Ejemplos y capturas.
- [x] 4.4 `RadioGroup`: `icon-simple`, avatar e icono de pago por opción (`1142:87213`, `124:2838`). `Select`: `searchable` y `type="tags"` (`3281:377673`), con tests de filtrado y de Enter. Ejemplos con pagos de `@jotis-me/icons/payments` y capturas.
- [x] 4.5 `TextEditor` (`9292:559325`, `9291:557668`, `9291:557669`): `toolbar` `simple`, `advanced` y `floating`, `size` y tooltips por botón. Tests: aparece al seleccionar, Escape la cierra y los botones tienen nombre. Ejemplos y capturas.

## 5. Variantes: medios, feeds y navegación

- [x] 5.1 `VideoPlayer`: `size` (`9264:576771`). `ActivityFeed` (`1254:128631`): `divider` (con `connector` como alias), `type="messages"` y `supporting` (etiquetas, archivo, texto). `Notification` (`1135:618`): `image`, `avatar` y `progress`. Tests, ejemplos y capturas.
- [x] 5.2 `SidebarNav` (`1158:90768`, `1157:90307`, `7891:87996`):
  - los cinco `type`;
  - submenús con `children`;
  - `featured` con las plantillas de tarjeta;
  - `account`.

  Tests: el estrecho tiene tooltips con nombre y los submenús se abren con el teclado. Ejemplos y capturas en escritorio y móvil.
- [x] 5.3 `Breadcrumbs`: `divider` y `type` (`1122:153`). `Pagination`: los diez `type` y `shape` (`1115:68622`), con textos en `defaultStrings`. Tests, ejemplos y capturas.

## 6. Variantes: fechas, gráficas y color

- [x] 6.1 `CalendarView`: vistas `week` y `day` (`8022:24550` y sus piezas), con columna de horas, eventos de 30 a 120 min en nueve colores, línea de hora actual y selector de vista. Tests de posición de eventos y de la línea con `today` fijo. Ejemplos y capturas en escritorio y móvil.
- [x] 6.2 `LineChart`/`BarChart`: `legend` `top`/`right` y `axisLabels` (`1062:46989`). `DatePicker`: `times` y `presentation="modal"` (`1150:16803`, `1547:269867`), con tests de elegir día y hora. Ejemplos y capturas.
- [x] 6.3 `ColorPicker` (`12423:52680`, `12304:616891`): los doce `type` y los cinco `model`, con `onGradientChange`. Tests:
  - mismo color al cambiar de modelo;
  - paradas de degradado con el teclado;
  - subida de imagen por `input type=file`.

  Revisar `check:size` (hoy 123 kB). Ejemplos y capturas.

## 7. Variantes: contenido, mensajes y datos

- [x] 7.1 `ContentDivider`: `actions` (`1252:126874`). `FileUpload`: `progressStyle="fill"` y `fileIcon` (`1175:101149`), con ejemplos usando `@jotis-me/icons/files`. `InlineCTA`: los siete `type` (`1255:131915`). Tests, ejemplos y capturas.
- [x] 7.2 `Message` (`1242:996`): los nueve `type`, reacciones, estado con `onRetry` y panel de acciones. `MessageInput` (`9206:602532`): `variant`. Tests de accesibilidad del estado y de las reacciones. Ejemplos y capturas.
- [x] 7.3 `MetricCard` (`1560:266217`): `icon`, `iconStyle`, `chart` y `chartStyle`. `PageHeader` (`1239:122640`): `avatar`, `banner` y `centered`. `SectionHeader` (`1214:38`): `tabs`, `search` y `buttonGroup`. Tests, ejemplos y capturas.
- [x] 7.4 `Table` (`1227:110587`, `1222:107305`, `1221:107933`, `9400:570197`):
  - los quince tipos de celda;
  - `sortable` con `aria-sort`;
  - `help` en cabecera;
  - `selection` con casilla, radio o interruptor y casilla de cabecera;
  - `striped`.

  Tests de teclado y de selección. Ejemplos («Miembros del equipo», «Empresas», «Ventas», «Archivos» del Figma) y capturas.
- [x] 7.5 `FilterBar`: los ocho `type` (`12232:376165`). `TreeView`: `size` y `type="advanced"` (`12451:566966`). Tests, ejemplos y capturas.

## 8. Variantes: fondos y marcos

- [x] 8.1 `BackgroundPattern`: `tech-grid` (`4932:397713`). `CreditCard`: los trece temas (`1291:157837`). `BrowserFrame`: `minimal-color` y `theme` (`7333:23578`). `FeaturedIcon`: `gradient`, `dark` y `modern-neue` (`1102:5338`). Tests, ejemplos y capturas.

## 9. Componentes base nuevos

- [x] 9.1 `AvatarProfilePhoto` (`1217:108477`). Grupo «Etiquetas e identidad». Tests de foto, iniciales, icono y verificado. Página, ficha, ejemplo, muestra, fragmento, límite en `size-budget.json` y capturas.
- [x] 9.2 `CheckIcon` (`1254:137887`) y `CheckItem` (`1345:1610`), en «Etiquetas e identidad», con los mismos entregables.
- [x] 9.3 `Rating` (`1232:9`) y `RatingBadge` (`7460:158976`), en «Etiquetas e identidad». Tests del relleno parcial y del texto accesible «4,5 de 5». Mismos entregables.
- [x] 9.4 `SocialButton` y `SocialButtonGroup` (`1256:130788`, `1256:132638`), en «Acciones». Los textos por proveedor van en `defaultStrings` y el logo por prop (design D3). Mismos entregables.
- [x] 9.5 `AppStoreBadge` (`1303:2162`), en «Acciones»: cinco tiendas, `md`/`lg`, relleno y contorno, como enlace con nombre de la tienda. Mismos entregables. Al cerrar el grupo: test de `dist` sin imports de `@jotis-me/icons/<set>`.

## 10. Componentes complejos nuevos

- [ ] 10.1 `ActivityGauge` (`1078:155`), `RadarChart` (`1084:7362`) y `ChartMarker` (`8100:193259`) en «Gráficas», con `marker` en `LineChart`/`BarChart`. Tests de tabla accesible y valores. Mismos entregables.
- [ ] 10.2 `ColorPickerDropdown` (`12424:15898`) en «Formularios», con sus seis disparadores. Tests: el popover se abre y se cierra con el teclado y devuelve el foco. Mismos entregables.
- [ ] 10.3 `FilterMenu` (`12232:366410`) y `FilterPanel` (`12232:375462`) en «Datos», con sus estados vacío, inactivo y activo. Tests del recuento en el disparador y de limpiar y aplicar. El ejemplo de `FilterPanel` va dentro de `Slideout`. Mismos entregables.
- [ ] 10.4 `BackgroundOverlay` (`4896:411056`), `ScreenMockup` (`1293:158480`, `8268:120483`), `LaptopMockup` (`1316:213`) y `PhoneMockup` (`1869:445841`) en «Fondos y maquetas». Contenido de ejemplo hecho con componentes (sin fotos) y test de que solo la imagen interior se anuncia. Mismos entregables.

## 11. Piezas de marketing

- [ ] 11.1 Grupo «Web de marketing» en `catalog.ts`; el test de catálogo pasa de 11 a 12 grupos (design D4).
- [ ] 11.2 `MarketingNav` (`1288:26576`, `1287:2392`):
  - `menu` `dropdown` y `full-width`, con los veinte `type` y `floating`;
  - plantillas `NavMenuItem` y `NavMenuCard`;
  - menú móvil con submenús.

  E2E de teclado (abre, el foco entra, Escape devuelve el foco) en escritorio y móvil. Mismos entregables.
- [ ] 11.3 `Footer` (`1517:334473`): veinte tipos, dos temas, columnas apiladas en móvil. Mismos entregables.
- [ ] 11.4 `BlogPostCard` (`1390:58`) y `SubscribeCard` (`1391:213014`). Mismos entregables.
- [ ] 11.5 `PricingCard` (`1346:182709`, diez tipos) y `JobPostCard` (`1506:244681`). Mismos entregables.
- [ ] 11.6 `Accordion` (`1358:191490`): `aria-expanded`, región, icono a izquierda o derecha, divisor y `single`. Tests de teclado. `TeamMemberCard` (`1458:240598`, siete tipos). Mismos entregables.
- [ ] 11.7 `Testimonial` (`1376:1163`) y `arrowStyle` en `Carousel` (`1374:440`). Mismos entregables. Captura de `Carousel` vuelta a aprobar solo si cambia su ejemplo.

## 12. Composiciones

- [ ] 12.1 Página `/components/modal/composiciones/` con los 49 tipos de `4057:415205` como entradas del registro (`composition: true`), solo con componentes de Regula, código copiable y capturas. Test que compara la lista con los tipos del nodo. Límite propio en `check:js`.
- [ ] 12.2 Página `/components/slideout/composiciones/` con los 23 tipos de `1240:137582`, con los mismos entregables.
- [ ] 12.3 Composición del `Color picker modal` (`12427:142023`) en la página de `ColorPicker`, en escritorio y móvil.

## 13. Cierre

- [ ] 13.1 Recorrer otra vez el inventario del Figma (cada propiedad de variante de cada pieza incluida) contra el catálogo y anotar en `NOTAS.md` dónde se cubre cada valor (requisito «Cobertura del Figma»). Lo que falte vuelve a su grupo.
- [ ] 13.2 Changeset `minor` de `@jotis-me/react` con los 27 componentes y las variantes, y repaso del de `@jotis-me/icons`. Comprobaciones:
  - catálogo en 121 y 12 grupos (`test/catalog.test.ts`);
  - `check:size` y `check:js`;
  - el artefacto: `bun run artifact:build` y `bun test` y `test:e2e` en `scripts/artifact`, con los grupos de assets nuevos, el bundle por debajo de 6 MB y menos de 1.008 ficheros;
  - el e2e completo de `apps/docs` con Firefox y WebKit.

## Workflow follow-up

- Abrir la PR como borrador tras el grupo 1 para que CI vaya corriendo; una sola PR con todo.
- Después de publicar la versión, sincronizar el artefacto: 27 componentes nuevos, el set completo de iconos y los grupos de banderas, pagos, archivos y cursores. Son unas 90 tandas de 25, con los ids de blob sacados del JSONL de la sesión.
