# Design

## Context

- **Procedencia.** Inventario del Figma «Yoruverse UI v8.0» (`WybK3J9Wu3crF84nKwrN1z`) hecho el 10 de noviembre de 2026, página a página, sobre Base components, Application components, Shared assets, Foundations y Marketing components. Alcance decidido por el usuario:
  - Entra todo salvo las secciones de página.
  - Las pantallas (Log in, Sign up, Forgot password, Email verification, 404, Email templates) cuentan como secciones.
  - Las piezas de marketing que no son secciones entran como componentes.
  - Los tipos de Modal y de Slide out menu van como composiciones en la web.
  - Entran todos los iconos y recursos, salvo los logos de empresa (Company logo) y de prensa (Press logo).
- **Flujo de las fases 1 a 3** (`archive/2026-11-07-add-form-variants`, `2026-11-08-add-navigation-progress`, `2026-11-10-add-minor-variants`). Cada componente nuevo lleva:
  - su ejemplo en `apps/docs/src/visual/registry.ts`, su muestra en `thumbnails.tsx`, su fragmento, su página y su grupo en `catalog.ts`;
  - sus dos capturas aprobadas, capturadas en Windows y miradas en claro y oscuro antes de aprobarlas;
  - su límite en `packages/react/size-budget.json` (`check:size`, paso aparte de CI).

  El test de catálogo falla si falta algo. `apps/docs` tiene límite de JS por página (`check:js`). Nunca se pone `client:*` en un componente del paquete: se usan islas propias de la web.
- **Figma frente a tokens.** El Figma usa la paleta de Tailwind v3, no los tokens. De él se toman forma, medidas y estados, y el color se traduce al token semántico. Cuando el Figma y la spec no coinciden, se construye como el Figma y se actualiza la spec (regla del usuario).
- **Cómo se importan los recursos.** Los recursos de muchos nodos se importan exportando cada marco entero con `download_assets` (conserva los nombres de capa como `id`) y recortándolo en local con un script. Es el mismo método que `packages/icons/scripts/import-logos.ts`: `use_figma` devuelve 48 kB como mucho.
- **Cómo funcionan hoy los iconos.** `Icon` importa el mapa entero `src/data/icons.ts` (82 iconos), y cada `IconXxx` generado envuelve `Icon`. Con 1.172 iconos, cualquier uso cargaría el set entero. `@jotis-me/react` usa `IconName` en sus props y `iconSlot()`, que ya acepta un `ReactNode`.
- **Ya existe y no se rehace:** los patrones «Line pattern» (`@jotis-me/icons/patterns/pattern-*.svg`), los 87 trazos a mano y los sets Social, Integration y App icons de `@jotis-me/icons/logos`.

Nodos del Figma. Las piezas internas («_») de cada fila se leen dentro de su nodo padre.

| Pieza | Nodo |
| --- | --- |
| Avatar / Status icon / add button | `11008:45389` / `11008:45024` / `1102:4864` |
| AvatarGroup / AvatarLabel / Avatar profile photo | `1274:812` / `82:2793` / `1217:108477` |
| Badge / Badge close | `1046:3819` / `4824:404158` |
| ButtonGroup | `1046:10171` (base `1046:9312`) |
| Button close X / Social button / Social button group / App store badge | `2763:420129` / `1256:130788` / `1256:132638` / `1303:2162` |
| Dropdown menu (header, item, footer, account) | `3281:383083` (`3281:382878`, `11546:537565`, `11553:542018`, `12471:593498`) |
| Input field / Textarea | `1090:57817` / `1238:278` |
| Progress bar | `1085:57382` |
| Radio group / item | `1142:87213` / `124:2838` |
| Select (menu item) | `3281:377673` (`3281:380429`) |
| Slider / Control handle | `1086:534` / `3287:442783` |
| Tag (checkbox) | `3307:417515` (`3308:406033`) |
| Text editor / toolbar / tooltip | `9292:559325` / `9291:557668` / `9291:557669` |
| Video player 16:9 | `9264:576771` |
| Activity feed | `1254:128631` |
| Notification | `1135:618` |
| Sidebar navigation (featured card, account card) | `1158:90768` (`1157:90307`, `7891:87996`) |
| Breadcrumbs | `1122:153` |
| Calendar (day/week cells, events, time marker) | `8022:24550` (`7996:12741`, `7996:12700`, `8003:31690`) |
| Line and bar chart / Activity gauge / Radar chart / Chart marker | `1062:46989` / `1078:155` / `1084:7362` / `8100:193259` |
| Color picker / dropdown / modal (inputs, swatch) | `12423:52680` / `12424:15898` / `12427:142023` (`12304:616891`, `12423:52815`) |
| Content divider | `1252:126874` |
| Date picker dropdown / modal | `1150:16803` / `1547:269867` |
| File upload | `1175:101149` |
| Filters bar / dropdown menu / slideout menu | `12232:376165` / `12232:366410` / `12232:375462` |
| Inline CTA | `1255:131915` |
| Message / Message action | `1242:996` / `9206:602532` |
| Metric item | `1560:266217` |
| Modal (49 tipos) / Slide out menu (23 tipos) | `4057:415205` / `1240:137582` |
| Page header | `1239:122640` |
| Pagination | `1115:68622` |
| Section header | `1214:38` |
| Table / cell / header cell / lead action | `1227:110587` / `1222:107305` / `1221:107933` / `9400:570197` |
| Tree view | `12451:566966` |
| Tabs horizontal / vertical / Code snippet (comprobar) | página `43:0` / página `1221:106300` |
| Background pattern / overlay | `4932:397713` / `4896:411056` |
| Credit card / Browser toolbar | `1291:157837` / `7333:23578` |
| Screen mockup 3:2 / Modern screen / Macbook / iPhone | `1293:158480` / `8268:120483` / `1316:213` / `1869:445841` |
| Featured icon | `1102:5338` |
| Check icon / Check item / Star icon / Ratings badge | `1254:137887` / `1345:1610` / `1232:9` / `7460:158976` |
| Iconos de línea (19 marcos de categoría) | página `3463:407484` (`3463:407486` … `3463:408638`) |
| Banderas / Pagos / Archivos / Carpetas / Cursor | `11834:15048` / `1142:83268` / `4916:411695` / `7585:9240` / `9342:257073` |
| Dropdown header nav / Full-width header nav | `1288:26576` / `1287:2392` |
| Footer (links column, link) | `1517:334473` (`3288:570969`, `3288:570928`) |
| Blog post card / Blog subscribe card | `1390:58` / `1391:213014` |
| Pricing tier card | `1346:182709` |
| FAQ item | `1358:191490` |
| Team member | `1458:240598` |
| Quote image bottom panel (Testimonial) / carrusel | `1376:1163` / `1374:440` |
| Job post | `1506:244681` |

## Goals / Non-Goals

**Goals:**
- Cada valor de variante de las piezas incluidas, pintable con Regula. Componentes con tokens semánticos y en los dos temas, pintados en el servidor, con JavaScript solo donde haya interacción.
- Las variantes `Breakpoint=Mobile` del Figma, cubiertas con diseño adaptable (container queries como `HeaderNav`), no con props.
- Nada de lo existente cambia sin las props nuevas. Las capturas aprobadas se mantienen salvo donde el ejemplo enseñe lo nuevo. Las rupturas son solo las de D1 y D8, y van declaradas.
- Un icono, una bandera o un logo suelto pesan solo lo suyo al empaquetar.

**Non-Goals:**
- Los logos de empresa y de prensa de la página «Logos» del Figma (decisión del usuario).
- Las secciones de página y sus piezas internas, las pantallas completas, Email templates, las páginas de ejemplos y Utility.
- Exportar del paquete los tipos de Modal y Slideout: son composiciones.
- Fotos en los ejemplos de Regula: van avatares con iniciales y mockups con contenido hecho con componentes. Las apps pueden pasar fotos.
- Datos reales de tarjetas, pagos o países: los ejemplos usan datos inventados.

## Decisions

### D1. Set núcleo con nombre y set completo suelto (`@jotis-me/icons`)
- **Datos:** `src/data/icons.ts` pasa a tener los 1.172 dibujos, importados del Figma con un script (como `import-logos.ts`), con sus nombres en kebab-case. Los 82 actuales conservan nombre y dibujo; un test lo comprueba contra el fixture.
- **Núcleo:** `src/data/core.ts` lista los nombres que puede pintar `Icon name`: los 82 de hoy más los que usen los componentes de `@jotis-me/react`. `IconName` es la unión del núcleo. Un test comprueba que cada icono que nombran las fuentes de `packages/react` está en el núcleo.
- **Set completo:** `scripts/generate.ts` genera cada `IconXxx` con su propio dibujo en línea, sin depender del mapa. `allIconNames` lista los 1.172. Los SVG de `dist/svg/` pasan a ser los 1.172.
- **Ruptura:** `IconName` y `iconNames` ya no incluyen los nuevos (sí todos los de hoy), y `Icon name="..."` con un nombre fuera del núcleo no compila. Se declara como ruptura en el changeset y en el changelog, y la página de iconos lo explica.
- *Alternativa:* un `Icon` con los 1.172. Cargaría unos 200 kB gzip en cada componente que pinte un icono. Se descarta.
- *Alternativa:* carga diferida por nombre. No funciona sin JavaScript ni en el servidor. Se descarta.

### D2. Sets de color en entradas propias
- **Entradas nuevas:** `flags`, `payments`, `files` (archivos y carpetas) y `cursors`, con el patrón de `logos`:
  - SVG guardados en `packages/icons/assets/<set>/`;
  - componentes generados sueltos (`FlagEsCircle`, `PaymentVisaMd`, `FileTypePdfGray`, `FolderBrandOpen`, `CursorHandGrab`);
  - `<set>Names`;
  - `"./<set>"` y `"./<set>/*"` en `exports`.
- **Nombres:**
  - banderas por el país o la región en kebab-case, no por código ISO (PT, IT y MD se repiten y 11 regiones no tienen): `FlagSpainCircle`, `FlagScotlandSquare`, `FlagCanaryIslandsRectangle`;
  - pagos, archivos y cursores por su nombre del Figma en kebab-case.
- **Accesibilidad:** sin `title`, `aria-hidden`; con `title`, `role="img"`.
- **Recorte:** un script por familia, con un test que compara los nombres guardados con la lista esperada (261 × 3, 56 × 2, 153, 8, 18, 50) y comprueba `viewBox` e ids únicos en cada SVG.

### D3. `@jotis-me/react` no importa recursos de color
Banderas, pagos, archivos, cursores y logos llegan a los componentes como `ReactNode`, como ya pasa con los logos en `EmptyState`. Props afectadas:
- `flag` en `Badge` y `Tag`;
- `paymentIcon` en `RadioGroup`;
- `fileIcon` en `FileUpload` y en la celda de archivo de `Table`;
- `logo` en `SocialButton`, `AppStoreBadge`, `Dropdown` de integraciones y la celda de pago de `Table`.

Un test busca en `packages/react/dist` y falla si aparece un import de `@jotis-me/icons/<set>`.

Los botones de redes y los badges de tiendas sí necesitan su logo siempre. Son la excepción: `SocialButton` y `AppStoreBadge` reciben el logo por prop, y la web y el artefacto los montan con los de `@jotis-me/icons/logos`. Así el paquete no depende de los sets.

### D4. Grupos del catálogo
Los once grupos de Componentes se mantienen y se añade uno, «Web de marketing», con `MarketingNav`, `Footer`, `BlogPostCard`, `SubscribeCard`, `PricingCard`, `Accordion`, `TeamMemberCard`, `Testimonial` y `JobPostCard`. El test pasa de 11 a 12 grupos. El resto:

| Grupo | Componentes nuevos |
| --- | --- |
| Acciones | `SocialButton`, `SocialButtonGroup`, `AppStoreBadge` |
| Etiquetas e identidad | `AvatarProfilePhoto`, `CheckIcon`, `CheckItem`, `Rating`, `RatingBadge` |
| Gráficas | `ActivityGauge`, `RadarChart`, `ChartMarker` |
| Formularios | `ColorPickerDropdown` |
| Datos | `FilterMenu`, `FilterPanel` |
| Fondos y maquetas | `BackgroundOverlay`, `ScreenMockup`, `LaptopMockup`, `PhoneMockup` |

`Accordion` es genérico (pregunta y respuesta), aunque su aspecto es el del FAQ item. Va en marketing porque el Figma solo lo tiene ahí.

### D5. Variantes: API por componente
Reglas comunes:
- Props nuevas opcionales con el valor de hoy por defecto, así que sin ellas el HTML es el de antes (test con `renderToStaticMarkup` por componente).
- Los nombres siguen el Figma en kebab-case.
- Los textos nuevos van en `defaultStrings`.

Las que cambian de forma:
- **`Avatar`:** `badge` (`verified`, `count`, `company`) junto al `status` actual, con `count` y `company` (URL de imagen o nodo, por D3; ver `NOTAS.md`).
- **`AvatarGroup`:** `onAdd` y `addLabel`.
- **`AvatarLabel`:** `size`.
- **`Badge`:** `flag`, `avatar`, `iconTrailing` e `iconOnly`. Con `iconOnly`, `label` es obligatorio.
- **`Tag`:** `flag`, `avatar`, `checkable`, `checked` y `onCheckedChange`.
- **`ButtonGroup`:** `size`; en los elementos, `iconOnly` + `label` y `dot`.
- **`CloseButton`:** `size` y `onDark`.
- **`Dropdown`:**
  - `searchable` y `footer`;
  - `variant`: `default`, `integrations`, `account-button`, `account-avatar`, `account-card-xs`, `account-card-sm`, `account-card-md` y `account-breadcrumb`;
  - `accounts` para la lista de cuentas;
  - `triggerVariant="link"`.

  Sigue sobre React Aria como hoy.
- **`Input`:** `type="card"` (agrupado y red detectada, que pinta el logo recibido en `cardLogos`), `trailingButton`, `type="datetime-local"` con el aspecto del Figma, y `type="file"` con el botón «Elegir archivo».
- **`Textarea`:** `tags` + `tagPlacement` (reutiliza la lógica de `TagInput`).
- **`ProgressBar`:** `label` gana `top-floating` y `bottom-floating`.
- **`RadioGroup`:** `appearance` gana `icon-simple`; las opciones aceptan `avatar` y `paymentIcon`.
- **`Select`:** `searchable` (combobox de React Aria) y `type="tags"` (delega en `MultiSelect` con el aspecto de etiquetas).
- **`Slider`:** `range` (value `[min, max]`), `label` (`bottom`, `top-floating`), `formatValue`.
- **`TextEditor`:** `toolbar` (`simple`, `advanced`, `floating`) y `size`.
- **`VideoPlayer`:** `size`.
- **`ActivityFeed`:** `divider` (`line`, `divider`, `connector`, `none`, sustituye a `connector`, que se mantiene como alias), `type` (`notifications`, `messages`) y `supporting` por elemento.
- **`Notification`:** `image`, `avatar` y `progress`.
- **`SidebarNav`:**
  - `type`: `simple`, `dual-tier`, `slim`, `sections-dividers` y `sections-subheadings`;
  - elementos con `children` para los submenús (`defaultOpen`), `shortcut` y `trailing`; `sections` para los de secciones y `mark` para `slim`;
  - `featured` con las tarjetas del Figma como `ReactNode`, más plantillas en `SidebarCards` (`Progress`, `Notice`, `Upgrade`; un objeto, para no contar como componentes del catálogo);
  - `account` con la tarjeta de cuenta (el `Dropdown` `account-card-md`);
  - `responsive` (barra de menú por debajo de `lg`) y `defaultMenuOpen`.
- **`Breadcrumbs`:** `divider` (`chevron`, `slash`) y `type` (`text`, `text-line`, `button`, `account`); los elementos ganan `avatar` y `accounts` (el `Dropdown` `account-breadcrumb`).
- **`Pagination`:** `type` (`page-default`, `page-minimal`, `card-default`, `card-minimal`, `card-advanced`, `card-button-group`), `align` (`left`, `center`, `right`; los diez del Figma son estos seis tipos con su alineación), `shape` (`square`, `circle`) y `pageSizes`/`pageSize`/`onPageSizeChange`. Sin `type` ni `shape` es el de siempre.
- **`CalendarView`:** `view` (`month`, `week`, `day`) y `defaultView`; selector de vista con `Dropdown`.
- **`LineChart`/`BarChart`:** `legend` gana `top` y `right` (`true` = `top`), y `axisLabels`.
- **`ColorPicker`:** `type` (los doce) y `model` (`hex`, `rgb`, `css`, `hsl`, `hsb`). `onChange` sigue recibiendo hex. En degradado, `onGradientChange(stops)`.
- **`DatePicker`:** `times` (lista de horas) y `presentation` (`dropdown`, `modal`).
- **`ContentDivider`:** `actions` (botón, botón con icono o grupo).
- **`FileUpload`:** `progressStyle` (`bar`, `fill`) y `fileIcon` por archivo.
- **`InlineCTA`:** `type` con los siete del Figma, donde cada tipo es una plantilla sobre las props actuales. Ejemplo: `email` pinta `Input` + `Button` y avisa con `onSubmit`.
- **`Message`:** `type`, `attachment`, `reactions`, `status` (`unread`, `read`, `failed`), `onRetry` y `actions`.
- **`MessageInput`:** `variant` (`minimal`, `textarea`, `advanced`).
- **`MetricCard`:** `icon`, `iconStyle` y `chart` (lista de números, mini gráfica sin ejes) con `chartStyle`, más `changeBadge` y `footer`.
- **`PageHeader`:** `avatar`, `banner`, `centered` y `back` (el «Volver» del Figma en móvil).
- **`SectionHeader`:** `tabs`, `search`, `buttonGroup` y `menu`, como huecos (`ReactNode`) para `Tabs`, `Input` y `ButtonGroup` del paquete: así la cabecera sigue siendo de servidor y ligera.
- **`Table`:**
  - celdas por `column.type` (los quince del Figma);
  - `sortable` por columna, con `sort` y `onSortChange`, y `help` en la cabecera;
  - `selection` (`checkbox`, `radio`, `toggle`) con `selectedKeys`;
  - `striped`.
- **`TreeView`:** `size` y `type="advanced"`.
- **`BackgroundPattern`:** `tech-grid`.
- **`CreditCard`:** los trece temas.
- **`BrowserFrame`:** `minimal-color` y `theme`.
- **`FeaturedIcon`:** `gradient`, `dark` y `modern-neue`.
- **`Tabs` y `CodeSnippet`:** se miran contra el Figma (`Full width`, `Horizontal`/`Vertical`) y se añade lo que falte con el mismo criterio.

### D6. Componentes nuevos: piezas que reutilizan
- **Base:**
  - `AvatarProfilePhoto` y `CheckIcon` se construyen solos;
  - `CheckItem` = `CheckIcon` + texto;
  - `Rating` = estrellas en SVG con relleno parcial por `clipPath`, `role="img"` y la etiqueta «4,5 de 5»;
  - `RatingBadge` = `Rating` + texto del Figma.
- **`SocialButton`:** sobre `Button` (`secondary`), con el logo por prop (D3) y el texto de `defaultStrings` por proveedor. `SocialButtonGroup` los agrupa.
- **`AppStoreBadge`:** un enlace con el dibujo de la tienda pasado como `logo`, en `md` y `lg`.
- **Gráficas:** se dibujan como `LineChart` (SVG propio, paleta de series, tabla accesible).
  - `ActivityGauge`: anillos concéntricos;
  - `RadarChart`: polígonos sobre ejes radiales;
  - `ChartMarker`: punto con línea y tooltip, que también aceptan `LineChart` y `BarChart` con la prop `marker`.
- **`ColorPickerDropdown`:** el disparador del Figma (muestra, botón, enlace, campo hex o select) con un popover de React Aria que contiene `ColorPicker`.
- **`FilterMenu`:** `Dropdown` con casillas y pie de limpiar y aplicar. `FilterPanel` es el contenido para `Slideout`, con las mismas secciones.
- **`BackgroundOverlay`:** capa `absolute inset-0` con los tres tipos y desenfoque. `Modal` y `Slideout` siguen con la suya; el componente sirve para imágenes y composiciones.
- **Mockups:** SVG del marco tomados del Figma, con los colores pasados a tokens donde no sean del dispositivo, y un hueco con `children` o `src` + `alt`.
  - `ScreenMockup` tiene `variant` (`3-2`, `modern`) y `size`.
  - `LaptopMockup` y `PhoneMockup` se construyen igual.
- **Marketing:**
  - `MarketingNav` reutiliza la estructura de `HeaderNav` (marca, enlaces, acciones, menú móvil con `Slideout`), con `menu` (`dropdown`, `full-width`), `type` y `floating`. Los paneles del menú son `ReactNode` con plantillas exportadas (`NavMenuItem`, `NavMenuCard`) para no inventar veinte props.
  - `Footer` tiene `type`, `theme`, `columns`, `social` (nodos de logos) y `bottom`.
  - `Testimonial` es la cita con imagen del nodo `1376:1163`: cita, autor, cargo e imagen, con `variant` (`floating`, `full-width`) y `size`. Las flechas `_Testimonial carousel arrow` pasan a `Carousel` como `arrowStyle` (`chevron`, `arrow`, `button-arrow`).
  - `Accordion` usa `<button aria-expanded>` y una región; un único abierto es opcional (`single`).

### D7. Composiciones de Modal, Slideout y Color picker modal
- **Páginas:** cada componente tiene `/components/modal/composiciones/` y `/components/slideout/composiciones/`. La del color picker es una sección de la página de `ColorPicker`.
- **Contenido:** cada tipo del Figma es una entrada del registro visual (`registry.ts`, con `composition: true`) con su nombre en castellano, su código copiable y su captura aprobada (escritorio y móvil, como los demás ejemplos).
- **Lista:** se saca de las propiedades de variante del nodo y la guarda un test, que falla si falta un tipo.
- **Islas:** los ejemplos pintan el modal abierto dentro de su lienzo (`contained`, como hoy) y solo hidratan los que tienen interacción.
- **JS:** cada página de composiciones tiene su límite propio en `check:js`.

### D8. Rupturas declaradas
- **`@jotis-me/icons`:** las de D1.
- **`ActivityFeed`:** `connector` se mantiene como alias de `divider="connector"`, así que no rompe.
- **Lo demás:** retrocompatible. Si al implementar una variante solo puede entrar cambiando una prop existente, se para, se anota en `NOTAS.md` y se pregunta al usuario antes de seguir.

### D9. Galerías de recursos en la web
- **Páginas:** `/icons/` pasa a enseñar los 1.172 iconos. Los sets nuevos tienen página propia (`/icons/flags/`, `/icons/payments/`, `/icons/files/`, `/icons/cursors/`) en el selector `IconsNav.astro`. `/icons/logos/` no cambia.
- **Carga:** las galerías cargan los SVG como `<img loading="lazy">` desde URLs (`import.meta.glob` con `?no-inline`), igual que `LogoGallery`, y la lista de nombres va en el HTML. Así el JS de cada página no crece con el número de iconos.
- **Iconos de línea:** usan `mask-image` con `bg-fg-primary` para tomar el color del tema.
- **Rendimiento:** si el HTML de `/icons/` pasa de 400 kB, la rejilla se pagina por categoría (los 19 marcos del Figma) con un filtro, sin cambiar el buscador.

### D10. Orden y commits
El orden pedido es: variantes, base nuevos, complejos nuevos. Los cimientos de iconos (D1 y D2) van antes porque las variantes los usan en sus ejemplos: banderas en `Badge`, pagos en `RadioGroup`, archivos en `FileUpload`. No se exporta ningún componente nuevo de React antes de su grupo. Hay un commit por componente o por familia de recursos. Changesets: `@jotis-me/icons` `minor` con la ruptura declarada (0.x) y `@jotis-me/react` `minor`.


### D11. Cada página carga solo los ejemplos de su componente
- **Problema.** La isla `VisualExample` importa `src/visual/registry.ts`, que importa todos los ficheros de ejemplos. Cada página de componente y cada `/visual/<nombre>/` descargaba el registro entero (72 kB gzip al cerrar el grupo 2) y sus límites de `check:js` había que subirlos en cada tarea.
- **Decisión.** La isla carga con `React.lazy` solo el fichero de `src/visual/examples/` que exporta `<Nombre>Example`, a través de `import.meta.glob`; cada fichero es su propio trozo. El servidor espera al `lazy` (Suspense) y pinta el mismo HTML que antes. `registry.ts` no cambia: lo siguen usando el artefacto, los tests y las rutas.
- **Mapa nombre → fichero** en `src/visual/example-files.ts`, guardado por un test contra el registro.
- *Alternativa:* una isla por fichero de ejemplos elegida en Astro con doce condiciones por página. Más código y Astro no hidrata componentes dinámicos. Se descarta.

## Risks / Trade-offs

- **[PR enorme y CI lento]** → Un commit por pieza y el changelog por grupos. Se ejecutan las pruebas del paquete afectado en cada commit y el e2e completo solo al cerrar cada grupo de tasks. La PR se abre como borrador pronto para que CI vaya corriendo.
- **[Miles de SVG importados del Figma]** → Scripts de una vez por familia, con listas esperadas en tests. Una muestra de cada familia se mira en claro y oscuro en una página de prueba antes de aprobar.
- **[Tamaño del tarball de `@jotis-me/icons`]** → Se mide con `scripts/pack.ts` antes y después. Si pasa de 15 MB sin comprimir, se estudia separar los sets de color en un paquete propio y se pregunta antes de hacerlo.
- **[Bundle del artefacto (límite 6 MB) con 121 componentes]** → Se mide en cada grupo. El bundle no incluye recursos de color (D3), que van como assets.
- **[Miles de assets que subir al artefacto]** → Es la sincronización tras publicar, no este cambio. Son unas 90 tandas de 25; el README ya describe el método, y los ids de blob se sacan del JSONL de la sesión.
- **[Capturas: cientos nuevas]** → Cada una se mira antes de aprobarla. Las diferencias aceptadas con el Figma se anotan en `NOTAS.md` del cambio.
- **[Logos de marcas reales en botones de redes y pagos]** → Se usan para representar el servicio, como en el Figma. La ficha recuerda que cada marca es de su dueño.
- **[Interacciones nuevas complejas: rango del slider, degradado, barra flotante, orden de tabla, menús de marketing]** → Sobre React Aria donde tenga la pieza (Slider, ComboBox, Popover, Table). Cada una lleva tests de teclado y e2e.
