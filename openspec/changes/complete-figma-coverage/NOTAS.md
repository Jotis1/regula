# Notas de implementación

Decisiones y diferencias aceptadas que salen al implementar. Lo que cambia la spec o el design también se corrige allí.

## Iconos de línea

- **1.172, no 1.173.** El Figma tiene 1.173 componentes en los 19 marcos de la página «Icons», pero `colors` está en dos categorías (Images y Editor) con el mismo dibujo. Cuenta como un icono. Las cifras de proposal, design, specs y tasks se corrigieron.
- **Importación.** `packages/icons/scripts/import-icons.ts` recorta cada icono de los SVG que exporta `download_assets` (uno por marco). Las coordenadas están en el marco; el origen de cada icono sale de la rejilla (4 columnas cada 272 px desde x=64, filas cada 40 px desde y=156) y los trazos se trasladan a 0..24. Los 82 de antes conservan su dibujo (fixture `icon-drawings-original.json`). Los corazones del Figma traen `fill-rule`/`clip-rule` sin relleno: no pintan nada y se ignoran.
- **`as const` descartado.** Con 1.172 iconos, `typeof icons` como tupla literal da «union type too complex» en `tsc`. `src/data/icons.ts` usa `defineIcons({...})`: las claves siguen siendo una unión de nombres y los trazos son `readonly string[]`.

## Núcleo y set completo

- **Núcleo = los 82 de antes, sin añadir ninguno.** Se buscó en `packages/react/src` cualquier literal que coincida con un nombre del set completo: salieron 9 (`box`, `circle`, `divider`, `list`, `mouse`, `placeholder`, `square`, `transform`, `x`), todos falsos positivos (variantes, no iconos). Los componentes solo usan los 82, y el tipado de `IconName` lo garantiza.
- **`iconNames` pasa a ser el núcleo** (82, como antes) y `allIconNames` es el set completo. La web (`/icons/`, portada, buscador) y el artefacto siguen usando `iconNames` hasta las tasks 1.8 y 13.2.
- **El mapa completo no se publica.** `src/data/icons.ts` (580 kB) queda fuera de `tsconfig.build.json`: solo lo leen los scripts y los tests. `dist/data` lleva solo el núcleo.
- **Un componente por icono**, con su dibujo en línea y `@__PURE__`. Un import suelto empaquetado con `bun build` pesa menos de 20 kB y no contiene ningún otro dibujo (test).

## Props de icono con nodos

- Las props `icon` de los componentes aceptan `IconName | ReactNode` y se pintan con `iconSlot` (23 ficheros). Con un nombre, el HTML es el mismo que antes (test de equivalencia).
- **`Button iconOnly` se queda en `IconName`.** `ReactNode` incluye `undefined`, y rompería el discriminante entre botón con texto y botón de solo icono. Los iconos de cualquier set van en `iconLeading`/`iconTrailing`, que ya aceptaban nodos.
- `ButtonUtility icon` usa `IconName | NonNullable<ReactNode>` para seguir siendo obligatorio.
- Un icono pasado como nodo lleva el tamaño que le dé quien lo pasa (20 por defecto); el componente no lo fuerza.

## Banderas

- **261 países, no 260.** El marco del Figma trae 261 «Country»: 260 con componentes y uno con marcos normales (3 × 261 = 783 banderas). Se importan las 783.
- **Nombre por país o región, no por código ISO.** Los códigos se repiten (Portugal y Azores = PT, Italia y Cerdeña = IT, Moldavia y Transnistria = MD) y 11 regiones no tienen (Canary Islands, Sicily, Tibet…), así que no dan nombres únicos. Los componentes son `FlagSpainCircle`, `FlagScotlandSquare`, `FlagCanaryIslandsRectangle`, y los ficheros `spain-circle.svg`. La galería busca por nombre en inglés, como los demás nombres del paquete.
- **Importación** (`scripts/import-flags.ts`): la caja de cada bandera sale de la rejilla del marco (14 columnas cada 134 px, filas cada 52 px; círculo, cuadrado a +36 y rectángulo a +72) y se comprueba contra sus trazos. 34 círculos se pasan ~1 px de su caja (el marco del Figma los recorta): con el viewBox de la caja quedan recortados igual.
- Las banderas reutilizan `makeLogo`, así que `size` es el alto en px y el ancho sigue la proporción (30×20 para el rectángulo).

## Iconos de pago

- **56 métodos × `sm` (34×24) y `md` (46×32) = 112**, importados de `Payment method icon` (`1142:83268`) con `scripts/import-payments.ts`. La caja de cada variante sale de la rejilla del conjunto (tres columnas, filas cada 48 px) y se comprueba contra sus trazos.
- **Nombres:** kebab-case de la propiedad `Payment method` (`visa-md`, `cash-app-pay-sm`). Se separan las palabras que el Figma escribe juntas (`ApplePay` → `apple-pay`, `GooglePay`, `BitcoinCash`, `DinersClub`) y se corrigen tres erratas del Figma: `Etherium` → `ethereum`, `Lightcoin` → `litecoin` y `Ayden` → `adyen`. El dibujo no cambia.
- Cada marca es de su dueño: se usan para representar el método de pago, sin cambiar su forma ni sus colores.

## Iconos de archivo y carpetas

- **153 tipos de archivo + 8 carpetas = 161**, en `@jotis-me/icons/files` (`scripts/import-files.ts`). Los tipos son 40×40; las carpetas, 48×48 cerradas y 54×48 abiertas.
- **Nombres:** `<categoria>-<tipo>` con `-gray` o `-solid` (el default no lleva sufijo): `document-pdf`, `design-fig-gray`, `image-png-solid`. Los paréntesis del Figma salen (`FIG (Figma)` → `fig`). Los diez iconos sin extensión que el Figma llama «Simple» o «Default» según su variante son `generic-*` (`generic-folder`, `generic-video-01-solid`). Los componentes son `FileDocumentPdf`, `FileDesignFigGray`; las carpetas, `FolderBrand`, `FolderBrandOpen`, `FolderNoise`, `FolderTransparent`.
- **Desenfoque de fondo.** Las carpetas «noise» y «transparent» llevan un desenfoque de lo que hay detrás (`backdrop-filter` dentro de un `foreignObject`). No cabe en un SVG suelto, así que se quita junto con su recorte. Diferencia aceptada: se ven igual sobre un fondo liso y algo menos «de cristal» sobre una imagen.
- **Textura de ruido.** Estas mismas carpetas usan un PNG de 128×128 (`noise.png`) como textura. No tiene versión vectorial: se conserva como `<image>` con data URI dentro del SVG (unos 27 kB por carpeta, solo en estas cuatro).
- **`xlink`.** Figma exporta la imagen con `xlink:href` sin declarar `xmlns:xlink`; como imagen el SVG se rompía. Se añade la declaración, y un test comprueba que todos los SVG de color del paquete (logos, banderas, pagos y archivos) son XML válido.

## Cursores

- **50 cursores** en `@jotis-me/icons/cursors` (`scripts/import-cursors.ts`): 29 clásicos y 21 de macOS 26. Nombres en kebab-case; los de macOS llevan el prefijo `macos-` (`macos-resize-north-south`, `CursorMacosResizeNorthSouth`).
- **Tamaño.** Los clásicos miden 20×20, como su caja del Figma. Varios de macOS 26 sobresalen de su caja (la flecha llega unos píxeles más abajo; la del menú mide 28×38), así que su `viewBox` crece por ese lado para no recortarlos. Los `size` de los componentes son el alto.
- **Sin punto activo.** El SVG no lleva el hotspot del cursor: se pasa en la regla de CSS, `cursor: url(".../hand-grab.svg") 6 4, grab`. Un e2e comprueba que Chromium acepta un cursor así y que cada SVG de color del paquete (1.400+) se decodifica como imagen.

## Emojis (fuera)

- **Los 18 emojis del Figma no se publican.** Son PNG de 160×160 con el arte de emoji de Apple (corazones, pulgares, caras, ojos), no vectores. Redistribuirlos en un paquete npm público puede incumplir la licencia de Apple. Decisión del usuario: se omiten. Los emojis nativos del sistema cubren el caso. Salen de proposal, design, specs y tasks.

## Tamaño del paquete de iconos

- **`@jotis-me/icons` 0.6.0 → este cambio:** 597 → 2.815 ficheros; 2,98 → 8,99 MB sin comprimir; tarball de 1,03 → 2,73 MB (`scripts/pack.ts`). Muy por debajo del umbral de 15 MB del design, así que los sets de color se quedan en el mismo paquete. Un import suelto empaquetado con `bun build` pesa lo que su dibujo: menos de 20 kB en todos los casos, 30 kB las carpetas con textura.
- `check:package` (`publint` y `attw` con el perfil `esm-only`) pasa con las nueve entradas y sus comodines.

## Galerías de la web

- **Una sola isla para cinco galerías.** `AssetGallery` sustituye a `IconGallery` y sirve iconos, banderas, pagos, archivos y cursores (`/icons/`, `/icons/flags/`, `/icons/payments/`, `/icons/files/`, `/icons/cursors/`). Los logos siguen con su `LogoGallery`. `IconsNav` enlaza las seis y la navegación lateral y el índice de búsqueda tienen las cuatro nuevas; el índice lleva los 1.172 iconos.
- **Nada de dibujos dentro de la isla.** Recibe las URL de los SVG (`import.meta.glob` con `?no-inline`) y los pinta como `<img loading="lazy">`. La rejilla enseña 96 y «Mostrar más» añade 240; buscar y filtrar recorren todo. Los iconos de línea son negros de origen (`currentColor` no llega a una `<img>`): en oscuro se invierten (`[.dark-mode_&]:invert`).
- **Pesos.** HTML de `/icons/` 333 kB (antes de comprimir las props 614 kB), banderas 298 kB, pagos 228, archivos 237, cursores 224: todo bajo los 400 kB. Las props van como una cadena (`encodeUrls`) y no como un objeto por recurso. JS de las cinco páginas: 212,6 kB gzip, por el `Select` de la librería del filtro; `js-budget.json` sube a 234.
- **Vite junta los SVG idénticos.** Ocho iconos tienen el mismo dibujo que otro y comparten fichero (y URL, con el nombre del primero). El nombre sale de la ruta del fichero, no de la URL, y viaja junto a ella.
- **Código del panel.** Un icono del núcleo ofrece `IconXxx` y `<Icon name>`; uno fuera del núcleo, solo `IconXxx`. Los cursores añaden una pestaña CSS (el punto activo lo pones tú). El SVG de las carpetas con textura se recorta en el panel (lleva un PNG en base64).
- **Aviso en `/icons/`** para quien viene de una versión anterior: `Icon name` acepta solo los 82 del núcleo.


## Avatar, AvatarGroup y AvatarLabel (2.1)

- **`company`, no `companySrc`.** D5 decía `companySrc` (una URL), pero D3 manda que los logos lleguen como `ReactNode`: la web y el artefacto solo tienen los logos de `@jotis-me/icons/logos` como componentes y no hay forma portátil de sacar su URL en los ejemplos. `company` acepta las dos cosas: una URL se pinta como `<img>` y un nodo se estira al círculo. Design corregido.
- **Una sola esquina.** El Figma (`Status icon`, `11008:45024`) tiene una sola insignia por avatar: online, offline, avatar, verificado o contador. Si se pasan `status` y `badge`, se pinta la insignia y se anuncia solo ella.
- **Caja de la insignia.** 10, 12, 14, 16, 18 y 20 px de `xs` a `2xl`, a −2 px de la esquina, como las instancias del Figma. El punto de `status` se queda como estaba (30 % del avatar, sin sobresalir) para no cambiar el HTML ni las capturas sin props nuevas; el del Figma mide 12 de una caja de 16 en `lg`. Diferencia aceptada.
- **Verificado.** Los dos trazados del Figma (roseta girada 22,5° y tick) en un SVG de 16 sin redibujar. El azul del Figma (`#3B82F6`) pasa al token `utility-blue-500`; el tick, a `fg-white`.
- **Contador.** El Figma solo tiene el contador a 16 px con un «8» de 10 px en negrita. En el resto de tamaños el número escala en proporción (6 px en `xs`, 13 px en `2xl`), como al escalar la instancia: en `xs` no se lee, y la ficha lo dice. Desde 100 se escribe «99+» y el círculo crece a lo ancho. Se anuncia «N notificaciones».
- **Empresa.** Logo con filo `bg-primary` de 1,5 px. Sin `badgeLabel` es decorativo (el nombre suele estar ya junto al avatar).
- **Botón de añadir.** `Avatar add button` (`1102:4864`) existe en `xs`, `sm` y `md`, con `plus` de 16, 16 y 20 px; de `lg` a `2xl` se extrapola (20, 24 y 24). Va a 8 px del grupo (`Avatar group`, `1274:812`). El tooltip «Add user» del Figma es el `Tooltip` de la librería con `addLabel` (por defecto «Añadir persona»): `AvatarGroup` pasa de 24 a 41,8 kB y su límite sube a 42 kB, el mismo que `ButtonUtility`, que usa el mismo tooltip. Sin `onAdd`, el HTML es el de antes y no se pinta ningún tooltip.
- **`AvatarLabel size`.** Antes `size` solo cambiaba el avatar; ahora, como el Figma (`82:2793`), cambia también el texto: `sm` nombre `text-sm` y apoyo `text-xs`, `md` `text-sm` en las dos (el de siempre), `lg` `text-md` en las dos. `xs`, `xl` y `2xl` llevan el texto de `md`. **Es un cambio de una prop existente (D8):** quien use hoy `size="sm"` o `size="lg"` verá otro texto. En el repo solo se usa `size="md"`, que no cambia. Confirmado por el usuario el 10-11-2026: se queda así, y el changeset de 13.2 lo menciona.
- **JS de `/visual/`.** Esas páginas cargan todos los ejemplos del registro, así que crecen con cada ejemplo nuevo: 341,0 → 341,4 kB con estos; límite a 343 en `js-budget.json`.
- **Captura de `Select` en oscuro.** Falla en este PC por un 2,06 % de píxeles (umbral 2 %) también en `HEAD`, sin estos cambios: diferencia de renderizado del equipo nuevo, no de este cambio. No se vuelve a aprobar; el CI de Windows decide.

## Badge (2.2)

- **Rellenos por variante.** El Figma (`Badge`, `1046:3819`) estrecha el hueco del lado del dibujo: con bandera o avatar delante (`pill` md: 4 px a la izquierda y 10 a la derecha), con solo un icono detrás (`pill` md: 10 y 8) y con solo icono (5, 6 y 8 px de `sm` a `lg`). Se aplican solo con esas props, así que el HTML de los badges de antes no cambia (test). Con `icon`, `dot` u `onRemove` junto a `iconTrailing` se quedan los rellenos de siempre: el Figma no tiene esas combinaciones.
- **Icono delante ya existente.** El `Icon leading` del Figma tiene sus propios rellenos (`pill` md: 8 y 10 px, separación 4), y el `icon` de antes usa los genéricos (10 y 10, separación 6). No se toca: cambiaría el HTML y las capturas de un uso existente sin props nuevas. Diferencia aceptada.
- **`flag` es un nodo y `avatar` una URL o un nodo** (D3): el paquete no importa banderas. El avatar lleva el filo interior de 0,33 px al 16 % negro del Figma, por encima de la foto.
- **`iconOnly` exige `label` y no admite texto** (unión de tipos, con test de tipos). El `label` va como texto oculto dentro del badge, no como `aria-label` de un `span`, que los lectores no anuncian en todos los casos.
- **Ejemplo.** Avatar con el icono de usuario, no con iniciales: a 16 px las iniciales no se leen.
- **JS de `/components/*/`.** Las páginas de componente cargan la isla `VisualExample` con el registro entero de ejemplos (72 kB gzip): 349,0 → 350,4 kB con las banderas y variantes de Badge; límite a 352. Crecerá con cada tarea del cambio (ver `/visual/` en 2.1).

## Tag (2.3)

- **Casilla nativa.** `checkable` convierte el tag en la etiqueta (`<label>`) de un `<input type="checkbox">` oculto, con la caja pintada al lado por `peer-*`, como `Checkbox`. Se marca con un clic en el texto o con Espacio, el texto es su nombre accesible y funciona sin hidratar (`defaultChecked`); `checked` + `onCheckedChange` para controlarlo, y `name`/`value` para formularios. La X sigue siendo un botón aparte: pulsarla no marca la casilla (test).
- **Medidas del Figma** (`Tag`, `3307:417515`; `Tag checkbox`, `3308:406033`): caja de 14, 16 y 18 px con radio de 4 px (`radius-sm` de Regula: el `radius-xs` del Figma mide 4 y el de Regula 2), check de 10, 12 y 14 px en `bg-brand-solid` (`_hover` al pasar por encima). Bandera de 13,33 px y avatar de 16. Lo de delante se separa 4, 5 y 6 px del texto; el hueco izquierdo pasa a 5, 4 y 5 px con casilla y a 4, 5 y 7 con bandera o avatar.
- **Pequeñas incoherencias del Figma.** La casilla en `sm` deja 5 px a la izquierda y en `md` 4; se copian tal cual. El hueco derecho con X (4 px en el Figma) no cambia: es el de los tags con X de antes, y tocarlo cambiaría su HTML sin props nuevas.
- **Ejemplo.** Avatares con el icono de usuario, como en `Badge`.
- **JS de `/visual/`:** 343,3 kB con estos ejemplos; límite a 346.

## Ejemplos por página (2.4, design D11)

- **Antes:** la isla `VisualExample` importaba `registry.ts` y, con él, los doce ficheros de ejemplos. Cada página de componente descargaba 350,4 kB gzip y cada `/visual/<nombre>/` 343,3; los límites subían en cada tarea.
- **Ahora:** la isla carga con `React.lazy` (vía `import.meta.glob`) solo el fichero de `src/visual/examples/` de su componente, según `src/visual/example-files.ts`, guardado por un test contra el registro. El servidor espera al `lazy` y el HTML lleva el ejemplo como antes (con las marcas de Suspense de React); la hidratación espera a que llegue el trozo.
- **`check:js` honesto:** el trozo del ejemplo lo pide la página después, como import dinámico, y antes no contaba. `js-weight.ts` lo suma a la página a partir del `name` de la isla (test con un dist de prueba). Medido con él: páginas de componente 277–306 kB (el resto es sobre todo el `Playground`), `/visual/` 107–250 kB. Límites: 337 y 275 (medido más un 10 %).
- **Granularidad:** por fichero de ejemplos, no por componente: la página de `Avatar` también carga los ejemplos de `Badge` y `Tag` (`display.tsx`). Partir los ficheros por componente bajaría algo más, pero no hace falta ahora.
- **Tests de las páginas de componente.** Con el `lazy`, la isla empieza por la marca de Suspense de React (`<!--$-->`). Como es `display: contents`, Playwright no puede hacer scroll a ella y `client:visible` no llegaba a hidratarla en el test (en el navegador no pasa: Astro observa los hijos elemento). Los cuatro sitios de `components.spec.ts` y `copy.spec.ts` hacen scroll a su primer elemento. E2E completo: 906/907, solo la captura de `Select` en oscuro de este PC.

## ButtonGroup y CloseButton (3.1)

- **Medidas del Figma** (`ButtonGroup`, `1046:10171`, base `1046:9312`): `md` mide 40 px y `sm` 36 px (rellenos 8 px arriba y abajo). Texto: 16 px a los lados en `md`, 14 en `sm`. Con icono delante: `sm` 12 y 14 px, separación 6. Solo icono: 12 px en `md` y 10 en `sm`. Punto de 10 px, separación 8.
- **`icon` en `md` se queda como estaba.** El Figma pone 14/16 px y separación 6, y el `icon` de antes usa 16 px por los dos lados y separación 8. No se toca: cambiaría el HTML de un uso existente sin props nuevas (test). Diferencia aceptada, como en `Badge`. En `sm`, que es nuevo, sí lleva las medidas del Figma.
- **`iconOnly` exige `label` y no admite `icon` ni `dot`** (unión de tipos, con test de tipos). El `label` va como texto oculto (`sr-only`) dentro del botón, igual que en `Badge`.
- **`dot`:** punto decorativo (`aria-hidden`) en `bg-utility-green-500`, el verde que usa el Figma. No hay otro color de punto en el Figma, así que no se añade prop de color.
- **Estados `Disabled` del Figma:** no se añaden. Los elementos del grupo no tienen `disabled` hoy y la spec no lo pide.
- **`CloseButton`** (`2763:420129`): `sm` 36 px, `md` 40 px y `lg` 44 px con X de 24 px. `onDark`: fondo blanco al 20 % al pasar por encima, como el Figma. El color de la X en reposo sobre oscuro (`text-fg-white/70`) es una elección nuestra: el Figma usa la imagen de la X sin color de capa y no se puede leer como token.
- **Ejemplos:** `ButtonGroup` enseña `md` y `sm` con texto, icono, punto y solo icono (cuadrícula, lista, añadir); `CloseButton` enseña los tres tamaños en claro y sobre `bg-brand-solid`. El Figma usa flechas y un `+` en el ejemplo de solo icono; aquí cuadrícula y lista, que son el uso típico. `list` no está en el set núcleo, así que la lista usa `align-left`.

## Tabs y CodeSnippet frente al Figma (3.2)

**Tabs** (página `43:0`):
- **Ya estaba:** los seis `type` (Button brand, gray, border, minimal, Underline y Line vertical), `sm` y `md`, horizontal y vertical, y la variante `Mobile` (en vertical, el desplegable por debajo de `lg`; en horizontal el diseño adaptable).
- **Faltaba y se añade: `Full width`.** `fullWidth` reparte el ancho: cada pestaña `flex-1` y centrada; los segmentados (`button-border`, `button-minimal`) pasan de `inline-flex w-fit` a `flex w-full`. Solo en horizontal. Sin la prop, el HTML es el de antes (test con las cadenas de antes).
- **Iconos delante de la pestaña (16 px) en el Figma:** no se añade prop. `label` ya es un `ReactNode` y admite un `Icon`. Separación icono-texto: 8 px de Regula frente a 4 + 2 del Figma; diferencia aceptada, para no cambiar el HTML.
- **Estados `Focus` y `Hover` del Figma:** ya los cubren los `data-focus-visible` y `data-hovered` de React Aria.

**CodeSnippet** (página `1221:106300`):
- **Ya estaba:** `Horizontal` (columna de números, código, botón de copiar), las pestañas y el copiar con el estado «Copiado».
- **Faltaba y se añade:**
  - `variant="vertical"`: tarjeta gris `bg-secondary_alt` con `radius-3xl` que enmarca el código en otra tarjeta blanca con sombra grande y sin números de línea (los admite con `lineNumbers`).
  - `Vertical with tabs`: con `tabs`, las pestañas de texto pasan a una cabecera (`rounded-t-xl`) con el botón de copiar.
  - `maxHeight`: recorte con degradado y botón «Ver más» / «Ver menos» (`Show more` del Figma, con `aria-expanded`). Se decide por el número de líneas (20 px cada una más 40 de relleno), no midiendo, para pintar lo mismo en servidor y cliente.
  - `onExpand`: botón de ampliar (`maximize-01`) junto al de copiar, con nombre «Ampliar código». Es un aviso: qué amplía lo decide quien lo use; el paquete no inventa un modal.
- **Un solo botón de copiar con pestañas verticales.** El Figma pinta dos (cabecera y tarjeta). Dos botones con el mismo nombre confunden a los lectores, así que va uno, en la cabecera, y copia la pestaña activa.
- **Sin `Disabled`/`Hover` de las pestañas de código a parte:** el hover es `hover:text-primary`, como el del Figma.
- **Colores del resaltado:** siguen los de la ficha de la guía (comentarios `utility-green-700` por contraste); el Figma usa `#16a34a`, `#db2777`, `#2563eb` y `#dc2626` para `export`/`=`. No se cambia el resaltado.
- **Textos nuevos en `defaultStrings`:** `expandCode`, `showMoreCode`, `showLessCode`.
- **Ejemplo:** horizontal con pestañas, vertical con pestañas y recortada, y vertical simple con ampliar.

## Dropdown (4.1)

Nodos: `Dropdown menu` `3281:383083`, cabecera `11553:542017`, pie `11553:541939`, elemento `11546:537618`.

- **`searchable`** (Search simple/advanced): `Autocomplete` + `SearchField` de React Aria. El foco se queda en el buscador mientras se filtra, ↓ pasa a las opciones, Enter elige y Escape vacía y, con la búsqueda vacía, cierra. Filtra por `textValue` (o el texto de `label`). Se vacía al cerrar. Sin coincidencias, `emptyLabel`.
- **`footer`** (texto o botón): un hueco `ReactNode` con la raya superior y `px-4 py-3`. Con un botón de ancho completo, el relleno es de 16 px a los lados y no los 12 del Figma (`_Dropdown menu footer` con botón); diferencia aceptada, para que el pie de texto y el de botón compartan caja.
- **Título de grupo** (`{ heading }`, el «Switch account» y «Company» del Figma): hace falta en las cuentas y es útil fuera. Sale como `MenuSection` con su `Header`, así los lectores lo anuncian como grupo con nombre.
- **`variant="integrations"`:** es el botón de siempre con el panel de 216 px y los logos (nodos) a 20 px dentro del hueco de 16. Los logos los pasa quien lo usa (D3); la web usa los `*Gray` de `@jotis-me/icons/logos`. `terminal-square` no está en el set núcleo: el ejemplo usa `code-01`.
- **Cuentas** (`account-button`, `-avatar`, `-card-xs/sm/md`, `-breadcrumb`): `accounts` con una cuenta elegida (`account`/`defaultAccount`/`onAccountChange`). La lista va en una `MenuSection` con su propia selección única (radio de marca a la derecha), separada de `selectedValue`, que sigue siendo de las acciones. `{ accounts: true }` en `items` fija el sitio; sin él va al final tras un separador. `onAddAccount` pone la fila «Añadir cuenta», fuera del grupo de selección.
  - `account-button` es el botón de siempre y `account-avatar` es solo el avatar con el nombre del menú como texto oculto (un `aria-label` chocaba con las iniciales visibles: regla `label-content-name-mismatch` de axe).
  - Las tarjetas `xs` (152×36), `sm` (168×44) y `md` (240×56, con correo) y las migas (28 de alto, sin caja, filas de dos líneas con correo) enseñan la cuenta elegida.
  - Cabecera de cuenta («Cuenta PRO / se renueva…»): va en `header`, que ya existía.
- **Sin el interruptor «Modo oscuro» ni el submenú «Support» del Figma:** `items` no tiene submenús ni controles dentro de una fila, y la spec no los pide. Quien lo necesite puede hacer un menú con una opción de elección única (como el selector de tema).
- **Submenús (`Inset icon=True, State=Open` del elemento, con `chevron`)** y checkboxes dentro de las opciones (`Search advanced`, «Untitled UI» con minus): no se añaden. La spec de la tarea habla de búsqueda, pie, cuentas, integraciones y enlace.
- **`triggerVariant="link"`** (`12006:557415`): texto semibold con chevron `fg-quaternary`, sin caja ni relleno; con `selectedValue` marca la opción elegida.
- **Rellenos de las filas de cuenta:** el avatar de 20 px de las filas (Figma) es un `Avatar xs` reducido a `size-5`; en las migas, `md` de 40.
- **Peso:** `Dropdown` pasa de 77 a 86,8 kB gzip (`Autocomplete`, `SearchField` y `Avatar`); límite a 97.792 (más un 10 %).
- **Ejemplo** con seis menús (acciones, tema, búsqueda con título y pie, integraciones con logos, cuenta `md` y los disparadores cerrados) y e2e con Chromium real de la búsqueda y del cambio de cuenta.

## Input y Textarea (4.2)

Nodos: `Input field` `1090:57817` (`Payment input`, `Trailing button`, `Date and time`, `File upload`) y `Textarea input field` `1238:278` (`Tags inner`, `Tags outer`).

- **`type="card"`:** campo de texto numérico (`inputmode`, `autocomplete="cc-number"`) que deja solo dígitos (19 como máximo) y los agrupa de cuatro en cuatro. Reconoce la red por los primeros dígitos (Visa, Mastercard, Amex, Discover, Diners, JCB, UnionPay, Maestro) y pinta el logo recibido en `cardLogos` (D3) en una caja de 34×24 con filo `border-secondary` y fondo `fg-white`, como el `Payment method icon` del Figma. Sin logo para la red, no pinta ninguno (no hay icono genérico de tarjeta en el set núcleo).
  - Amex se agrupa también de cuatro en cuatro (4-6-5 sería lo correcto): la spec pide cuatro en cuatro y es lo que hace el Figma.
  - `e.target.value` llega a `onChange` ya agrupado. Al editar en medio del número, el cursor salta al final (el valor se reescribe); se acepta, es lo habitual en estos campos sin librería.
  - `detectCardNetwork` y `formatCardNumber` se exportan del fichero del componente y se prueban, pero no del punto de entrada (el test de catálogo compara componentes).
- **`trailingButton`** (`Trailing button`): `{ label, icon?, onClick? }`. Va dentro del marco, tras el campo, con `border-l` compartido y sin fondo propio (el filo del campo es una sombra interior que un fondo opaco taparía, visto en la primera captura). Foco propio de 2 px en `border-brand`.
- **`type="datetime-local"`:** el campo nativo con calendario de 20 px delante, sin el indicador nativo. El botón del calendario abre `showPicker()` (nombre «Elegir fecha», `pickerLabel`). El Figma pinta la hora con el selector «10:30 AM» propio; aquí es el nativo del navegador, que es accesible y funciona con teclado, y su formato lo decide el idioma del navegador. El color del texto vacío (placeholder) no se puede cambiar en el nativo: se queda el del navegador.
- **`type="file"`:** el campo nativo va oculto (`sr-only`) pero enfocable, el nombre elegido (o «Ningún archivo seleccionado») ocupa el campo y «Elegir archivo» es un botón pegado a la derecha, solo para el ratón (`aria-hidden`, fuera del orden de Tab) para no tener dos controles con el mismo nombre. Con teclado se abre con Enter desde el propio campo (e2e con Chromium).
- **Rellenos:** los de siempre (`fieldPadding`); el botón lleva 14 px a los lados como el Figma. `size` solo cambia la altura y el cuerpo del texto del campo; el texto del botón es `text-sm` en las tres alturas, como en el Figma.
- **`Textarea` con `tags`/`defaultTags`:** delega en `TagInput` con la nueva prop `multiline` (caja de 104 px, etiquetas y texto fluyen juntos, un clic enfoca). Enter o coma crean la etiqueta, como `TagInput`: no hay texto libre en este modo (en un textarea Enter es salto de línea y no hay forma de distinguir). `tagPlacement` `inside`/`outside` como los `Tags inner/outer` del Figma. El `size` `sm` del Figma (160 px de alto) no se añade: `Textarea` no tiene `size` y la spec no lo pide.
- **Peso:** `Textarea` pasa de 10 a 26 kB gzip porque importa `TagInput` (y con él `Tag`) aunque no se usen las etiquetas. Límite a 29.184. Si molestara, se puede partir `Textarea` en dos entradas; no se hace ahora. `Input` 87,8 kB (límite 94,0, sin cambios).
- **Ejemplos y e2e:** Input con tarjeta (logos de `@jotis-me/icons/payments`), botón, fecha y archivo; Textarea con las tres variantes; e2e con Chromium de tarjeta (agrupa mientras se escribe), selector de archivo con el ratón y con el teclado y Tab al botón.

## ProgressBar y Slider (4.3)

Nodos: `Progress bar` `1085:57382` (`Top floating`, `Bottom floating`), `Slider` `1086:534` y `_Control handle` `3287:442783` (`Text`, `Tooltip`).

- **`ProgressBar` `top-floating` / `bottom-floating`:** burbuja de `bg-primary_alt` con filo `border-secondary_alt`, `radius-md`, 12 y 8 px de relleno, 12px semibold y `shadow-lg`, centrada en el final del relleno (el Figma la coloca a −21 px del borde derecho, o sea centrada). Arriba queda a 12 px de la barra y abajo a 8 px (`top-4`).
  - La barra no recorta la burbuja (las variantes de siempre sí llevan `overflow-hidden`). El hueco que ocupa se reserva con relleno (42 px arriba, 38 abajo): el Figma deja la burbuja saliendo de una caja de 8 px y pisaría lo de al lado.
  - La burbuja es decorativa (`aria-hidden`): el valor ya lo dice `aria-valuenow`, así no se lee dos veces.
- **`Slider` `range`:** dos mandos con React Aria. El valor es `[mínimo, máximo]`; el tipo es una unión (`range: true` exige pares y `onChange` los devuelve). El relleno va entre los dos, redondeado, como la línea del Figma. El mínimo no pasa del máximo (lo impone React Aria). Nombre accesible de cada mando: «Mínimo» y «Máximo» (`thumbLabels`); el lector lee «Precio Mínimo».
- **`label`:** `bottom` (16 px medium bajo el mando) y `top-floating` (burbuja encima, 8 y 6 px de relleno, a 38 px sobre el mando), ambas dentro del propio mando para que lo sigan. `formatValue(n)` decide el texto; por defecto, el número (el Figma pone «%» porque su escala es 0–100). Decorativas: lo que anuncia el mando es el número, sin pasar por `formatValue`. Si hiciera falta anunciar «40 %», habría que pasar `aria-valuetext`, que React Aria no deja cambiar por mando; no se hace.
- **Hueco:** con `label` el componente reserva 46 px arriba o 44 abajo (`pt`/`pb`). Sin `label`, el HTML es el de antes salvo el id que reparte React Aria al montar (el test lo normaliza). La diferencia con la vista previa de la guía (1 px por la línea base) sigue como estaba.
- **`step`** se añade porque un rango sin salto configurable es poco útil; no lo pide la spec.
- **No se añaden** los estados `Hover` y `Focused` de `_Control handle`: los cubren `:hover` y `data-focus-visible` del mando existente (`shadow-focus-ring`).
- **Ejemplos y e2e:** cinco sliders (simple, con etiqueta debajo y flotante, rango con las dos etiquetas) y cuatro barras; e2e con Chromium del rango (teclado en cada mando, tope, Tab y arrastre).
- **Peso:** `Slider` mide 25,6 kB gzip y cabe en su límite de 26,0, que no se toca. `ProgressBar` 9,5 kB (10,5).

## RadioGroup y Select (4.4)

Nodos: `Radio group` `1142:87213` (`Icon simple`, `Avatar`, `Payment icon`, `sm` y `md`) y `Select` `3281:377673` (`Search`, `Tags`).

- **`RadioGroup`:** los tres tipos del Figma son tarjetas con un delantero y el indicador a la derecha (en el Figma, casilla; el `indicator` ya existente decide). `appearance="icon-simple"` es la tarjeta de siempre pensada para ellos; `card` también los admite. Opciones nuevas: `icon` (caja de 32 px con borde `border-primary` y `shadow-xs-skeuomorphic`), `avatar` (`Avatar` de 32 px) y `paymentIcon` (nodo de `@jotis-me/icons/payments`, D3, en una caja de 46×32 con filo `border-secondary` y fondo `fg-white`). Manda `media`, luego `paymentIcon`, `avatar` e `icon`. Los delanteros son decorativos (`aria-hidden`): el nombre de la opción es su texto.
  - **`size="md"`** ahora también cambia las tarjetas (antes las ignoraba): delantero de 40 px (logo 58×40), texto de 16 px e indicador de 20 px, como el `Size=md` del Figma. Con `size` por defecto el HTML de `card` es el de antes (test).
  - **Sin la fila de acciones** («Set as default», «Edit») de los métodos de pago del Figma: serían botones dentro de la etiqueta de un radio, que los lectores y el teclado no manejan bien. Quien lo necesite puede ponerlos fuera de la tarjeta.
  - **Peso:** `RadioGroup` pasa de 27 a 44,8 kB gzip (arrastra `Avatar` e `Icon`); límite a 50.688.
- **`Select searchable`:** combobox de React Aria (`ComboBox`) con la lupa delante, el chevron detrás y el marco de `Input`. Filtra por `textValue` sin distinguir mayúsculas ni acentos. Escribir abre la lista; sin coincidencias sale `emptyLabel`. Al salir, vuelve el texto de la opción elegida.
  - **«Enter elige la marcada»:** React Aria no marca la primera opción al filtrar y su Enter, sin opción marcada, trataría lo escrito como texto libre y volvería al valor anterior. Se intercepta Enter en el marco del campo: con la lista abierta, algo escrito y ninguna opción marcada con las flechas, elige la primera que queda. Marcarla visualmente al escribir se intentó (efecto + `setFocusedKey`) y no es fiable entre jsdom y Chromium, así que no hay marca visible: la que elegiría Enter es la primera de la lista. Diferencia con el Figma, que no enseña cuál.
  - El campo enseña el texto de la opción, no su icono, avatar o punto (solo salen en la lista). `defaultOpen` no existe en el combobox de React Aria: no se admite, y las vistas previas lo enseñan cerrado.
  - El chevron es solo para el ratón (`excludeFromTabOrder`).
- **`Select type="tags"`:** delega en `MultiSelect` con la nueva prop `display="tags"`: cada elegida es una `Tag` dentro del campo, que crece en alto. `value`, `defaultValue` y `onChange` pasan a ser listas (unión de tipos). La lista lleva buscador y casillas. **Las etiquetas no llevan X** (el Figma sí): el campo es un botón y meter botones dentro es inaccesible; se quitan desmarcando en la lista. `supporting` pasa tal cual; una etiqueta que no es texto usa `textValue`.
  - **Diferencia con el Figma `Tags`:** allí se escribe dentro del campo entre las etiquetas; aquí el buscador está en la lista, como en `MultiSelect`.
- **Peso de `Select`:** de 95 a 104,3 kB (ahora importa `MultiSelect`, `ComboBox` y `Tag`); límite a 117.760. `Tabs` usaba `Select` solo para su desplegable vertical y habría heredado el peso, así que ahora usa `OptionSelect` (el campo interno) dentro de la misma caja: el HTML es el mismo salvo el id que reparte React Aria al botón. `Tabs` baja de 97 a 89 kB.
- **`check:js`:** las galerías de iconos (`/icons/*`) comparten una isla con `Select` y suben de 212,6 a 237,9 kB; límite a 262 (más un 10 %). Si molestara, `Select` podría cargar el buscador y las etiquetas con `React.lazy`, a costa de pintar el campo tras hidratar; no se hace ahora.
- **Un hueco de tipos que sigue:** `icon` y similares aceptan `IconName | ReactNode`, y un `string` es un `ReactNode`, así que un nombre de icono que no está en el set (`layers-two-01`) compila y se pinta vacío. No es de esta tarea (se vio en el ejemplo y se cambió a `star-01`).
- **Ejemplos y e2e:** `RadioGroup` con los tres tipos y `md`; `Select` con búsqueda y con etiquetas; e2e con Chromium de la búsqueda (filtra, Enter elige, flechas, «Sin resultados»).

## TextEditor (4.5)

Nodos: `Text editor` `9292:559325` (`Default` y `Floating toolbar`, `sm` y `md`), `Text editor toolbar` `9291:557668` (`Simple`, `Advanced`) y `Text editor tooltip` `9291:557669`.

- **API:** `toolbar` (`simple`, `advanced`, `floating`), `size` (`sm`, `md`) y `onGenerate`. Sin `toolbar`, la barra de siempre (con enlace y alinear a la derecha) y el `title` nativo; el HTML cambia solo en el orden de las clases del área (test). `md` es el relleno y el radio de antes.
  - `simple` es la del Figma: negrita, cursiva, subrayado, color, alinear a la izquierda, centrar y lista (sin enlace ni alinear a la derecha, que el Figma no tiene ahí).
  - `advanced` añade tipo y tamaño de letra, enlace, imagen y generar. **Generar solo se pinta con `onGenerate`**: un botón sin acción no sirve y el componente no sabe generar texto.
  - `floating` es la tarjeta blanca del Figma (`Text editor tooltip` `Advanced`): `sm` con los botones de `simple` y `md` con los de `advanced` sin los selectores, como el `Floating toolbar` del frame.
- **Diferencia con el Figma: la variante oscura.** `Text editor tooltip` `Simple` (nodo `9291:558484`) es una barra oscura de seis botones (B, I, U, alinear, centrar, enlace). No se ha hecho: la flotante es siempre la tarjeta clara. Si se quiere, sería una prop `floatingTheme` y no cambia lo demás.
- **Flotante:** sale sobre la selección del área (`selectionchange`) centrada y a 8 px de ella, sin salirse del editor por los lados (se mide la barra tras pintarla y se recoloca; lo vio el e2e con una palabra en el borde izquierdo, donde la barra quedaba fuera de la pantalla), y no se pinta en servidor. Escape la cierra, devuelve el foco al área y no vuelve hasta que la selección se vacía. Mientras el selector de color está abierto sigue visible, aunque la selección salga del área.
- **Tooltips:** con `toolbar`, `Tooltip` de React Aria con el nombre de cada botón. **No llevan el atajo** («Bold ⌘B»): cambia con el sistema y el componente no lo programa (el del navegador sí funciona en el área). Sin `toolbar` queda el `title` de siempre.
- **Color:** botón con la muestra y un popover con las 16 muestras del Figma y «Personalizado» (hex de 6 cifras y Enter). Se aplica con `foreColor` y estilos en línea (`<span style="color">`). Sin elegir, la muestra es el color de texto del tema (`fg-primary`), no el negro fijo del Figma, que en oscuro no se vería. Los 16 hex son datos del contenido: `check-colors` admite el fichero con su motivo.
- **Tipo y tamaño de letra:** `OptionSelect` (el campo interno de `Select`) con tres tipos (Inter, Georgia, Mono) y cinco tamaños (13, 16, 18, 24 y 32 px). `execCommand("fontSize")` solo admite del 1 al 7, así que el tamaño sale como `<font size="5">`, no en píxeles exactos. Icono de 20 px en el campo (el Figma, 16).
- **Selección y menús abiertos:** React Aria deja el resto de la página inerte con un menú abierto y la selección del área desaparece. Se guarda cada `selectionchange` dentro del área y, cuando el menú ha cerrado y ha devuelto el foco (dos `requestAnimationFrame`), se recupera y se aplica el formato. Si se cierra sin elegir, también se recupera. Tests de unidad con `waitFor` y e2e en Chromium real (color, tamaño, flotante, tooltip), que es donde importa.
- **Núcleo de iconos:** `type-01` (selector de letra) pasa al núcleo de `@jotis-me/icons`, que queda en 83; el test del núcleo lista los añadidos por componente y el texto de `/icons/` y de «Iconografía» dice 83.
- **Peso:** `TextEditor` pasa de 27 a 96 kB gzip (arrastra `Popover`, `Dialog`, `Tooltip` y `OptionSelect`); límite a 105.984. Es el mayor salto del cambio. Si molestara, la barra avanzada y el selector de color podrían cargarse con `React.lazy` a costa de pintar la barra tras hidratar. `AvatarGroup` sube a 47.616 (+0,1 kB por el icono del núcleo, estaba al límite). `check:js` sin tocar: ninguna página pasó de su límite.
- **Ejemplo y capturas:** cuatro editores (el de siempre, simple `sm`, avanzada a ancho completo y flotante `sm`, con la pista «Selecciona texto para ver la barra», porque la barra solo sale al seleccionar). Alto de la tarjeta, de 300 a 900.

## VideoPlayer, ActivityFeed y Notification (5.1)

Nodos: `Video player 16:9` `9264:576771`, `Activity feed` `1254:128631` y `Notification` `1135:618`.

- **`VideoPlayer size`:** `sm`, `md` y `lg` del Figma. Sin `size`, el reproductor de siempre con el mismo HTML (test contra fixture). Botones con 8 px de relleno e iconos de 16, degradado de transparente a negro al 30 %, esquinas `radius-lg` (`sm`, `md`) y `radius-xl` (`lg`).
  - `sm`: reproducir, volumen y pantalla completa, sin progreso.
  - `md`: reproducir, «00:00», progreso de 8 px, «-08:24», volumen y pantalla completa.
  - `lg`: reproducir, volumen con deslizador de 44 px, progreso, velocidad y pantalla completa. La velocidad rota 1x → 1.25x → 1.5x → 2x → 0.5x con `playbackRate`.
  - **Diferencias con el Figma:** sin **AirPlay** (es una API solo de Safari, `webkitShowPlaybackTargetPicker`; en el resto de navegadores sería un botón que no hace nada). Sin la **marca de buffer** (el Figma pinta lo cargado al 30 %; el `<input type=range>` no la tiene) ni la **vista previa al pasar por la barra** (necesita miniaturas del vídeo). Sin los **tooltips con atajo** («Play · Space»): el componente no programa atajos de teclado. El icono de pausa es `pause-circle` (el núcleo no tiene `pause`), como antes.
  - El ancho lo pone quien lo usa (el alto sigue 16:9); el Figma fija 320, 560 y 720.
- **`ActivityFeed`:** `divider` (`line`, `divider`, `connector`, `none`) con `connector` como alias; sin las props nuevas, el HTML es el de antes (fixture) y `divider="connector"` pinta lo mismo que `connector`.
  - **`line` y `divider` se pintan igual** (línea `border-secondary` entre elementos, 16 px de hueco). En el Figma, `Line` está en el feed de notificaciones y `Divider` en el de mensajes, con la misma línea de 1 px; no hay diferencia visible que justifique dos estilos.
  - `type="messages"`: autor `text-sm-medium`, hora `text-xs`, usuario (`handle`) debajo y el texto en una burbuja `border-secondary` con la esquina superior izquierda recta, como el `Message bubble` del Figma.
  - `supporting`: etiquetas (`Tag md`), archivo (icono como nodo por D3, por defecto `file-04`; nombre y tamaño) y texto en recuadro. En `messages`, el elemento de apoyo va en lugar de la burbuja (el Figma no pinta las dos a la vez).
- **`Notification`:** `image`, `avatar` (+ `time`) y `progress` (+ `progressLabel`). `alertBody` acepta lo que va en el sitio del icono, la hora y lo de bajo el texto; sin ellos el HTML de `Alert` y `Notification` es el de antes (fixture).
  - **Imagen:** decorativa. Con 448 px o más de contenedor va a la izquierda (160 px de ancho, a sangre); más estrecho, arriba (160 px de alto). **Diferencia con el Figma móvil:** allí la imagen va dentro del relleno, debajo del texto y encima de las acciones; aquí va arriba y a sangre, porque las acciones son parte del cuerpo y reordenar obligaría a pintar la imagen dos veces. La X queda arriba a la derecha de la tarjeta.
  - **Avatar:** `Avatar md` en el sitio del icono y la hora en `text-quaternary` junto al título.
  - **Progreso:** `ProgressBar label="bottom"` con el título como nombre, e icono `upload-cloud-02` en `FeaturedIcon modern` gris. El texto es «60%», no «60% uploaded...» del Figma: el porcentaje es el de `ProgressBar` y lo que sube ya lo dice el título.
  - Con imagen o avatar el ancho máximo pasa de 320 a 560 px (`--width-md`), como los 504 y 544 de las instancias del Figma.
- **Peso:** `ActivityFeed` de 26,5 a 27,5 kB (importa `Tag`) y `Notification` de 27 a 27,8 kB (`Avatar` y `ProgressBar`); los dos límites a 28.672. `VideoPlayer` 23,7 kB, dentro.
- **Ejemplos:** `VideoPlayer` con el de siempre y los tres tamaños; `ActivityFeed` con dos feeds nuevos (sin divisor con etiquetas y texto, y mensajes con un PDF de `@jotis-me/icons/files`); `Notification` con los cuatro tipos (éxito, avatar, progreso e imagen hecha con `FeaturedIcon`, sin fotos).
- **Capturas:** alto de las tarjetas en `cards.ts`: `VideoPlayer` 400 → 1370, `ActivityFeed` 330 → 540, `Notification` 170 → 650, para que entren los ejemplos nuevos (con el alto de antes la captura solo enseñaba el primero). Revisadas en claro y oscuro.

## SidebarNav (5.2)

Nodos: `Sidebar navigation` `1158:90768` (cinco `Type` × `Open` × `Breakpoint`, con `Simple`, `Dual-tier`, `Slim`, `Sections dividers` y `Sections subheadings`), `Nav featured card` `1157:90307` (13 tipos) y `Nav account card` `7891:87996`.

- **API** (todo opcional; sin las props nuevas el HTML es el de antes, test contra fixture `sidebar-nav-before.json` salvo los ids de React, que se normalizan porque el componente pide dos `useId` más):
  - `type`: `simple`, `dual-tier`, `slim`, `sections-dividers`, `sections-subheadings`.
  - Elementos: `children` (submenú de un nivel), `defaultOpen`, `shortcut` y `trailing`. `items` pasa a ser opcional y `sections` [{`title`, `items`}] lo sustituye en los dos tipos de secciones.
  - `mark` (marca compacta de `slim`), `featured`, `account`, `responsive` y `defaultMenuOpen`.
  - **Añadidos sobre D5:** `sections`, `mark`, `shortcut`, `trailing`, `defaultOpen`, `responsive` y `defaultMenuOpen`. Design corregido.
- **Submenús.** Un elemento con `children` es un `<button>` con `aria-expanded` y `aria-controls`, no un `<details>`: con `<summary>` Enter no activa el desplegable en jsdom y no se pueden escribir tests de teclado fiables. El submenú cerrado va con `hidden` (no está en el árbol de accesibilidad). Empieza abierto si él o un hijo es la página actual, o con `defaultOpen`. **El componente ahora necesita hidratación** para los submenús (ficha: `interactive: true`); sin ellos los ítems siguen siendo enlaces.
- **`dual-tier` y `slim`.** Los elementos con submenú eligen qué enseña un segundo panel (`role="group"` con el nombre del elemento, de 256 px, `hidden` si no hay ninguno elegido). Volver a pulsar el elegido lo cierra. En `slim` el panel lleva el nombre del elemento como título (`text-brand-secondary`) y cada icono es `size-10` con el nombre como texto oculto y `Tooltip` (`placement="right"`). La marca es `mark` (o `brand` recortado), sin buscador ni tarjeta destacada.
  - **Diferencia con el Figma `slim`:** el Figma pone la ficha del usuario con correo en el panel; aquí la columna estrecha lleva el avatar (con el nombre para lectores) y el botón de cerrar sesión, y el panel solo el submenú.
- **Tipos de secciones.** Tarjeta redondeada con filo (`rounded-2xl`) en lugar de la raya derecha. Con divisores, una raya entre grupos; con subtítulos, el título en mayúsculas (`h2`) y la lista con ese nombre (`aria-labelledby`). Con `search`, `sections-subheadings` pinta la lupa junto a la marca (como el Figma) y no el campo.
- **Cuenta** (`7891:87996`): `account` es el `Dropdown` `account-card-md` tal cual (cuentas, menú, «Añadir cuenta»), sin disparador propio. **Diferencias con el Figma:** la tarjeta mide 240 px (la de `Dropdown`) y no el ancho de la columna, y el menú sale debajo o encima de ella (lo decide `Dropdown`) y no a su derecha. El tipo `Simple` del Figma es el `user` que ya existía (avatar, nombre y cerrar sesión).
- **Tarjetas destacadas.** `featured` es un nodo. `SidebarCards` (objeto, no tres exportaciones: el test de catálogo cuenta como componente toda función en PascalCase que sale del punto de entrada) trae `Progress` (`bar` y `circle`), `Upgrade` y `Notice` (icono o imagen, texto, hueco libre y botones; con `outline` es la blanca con filo). Con `Notice` y componentes de la librería la vista previa hace los 13 tipos: progreso (2), imagen, cookies, referidos, completar cuenta, mejora de plan, soporte, evento, mensaje, proyectos, prueba gratuita y QR.
  - **Imagen** (`media`): hueco bajo el texto, como el Figma; el ejemplo usa un bloque de color y no el reproductor con una foto. **QR:** dibujo de ejemplo, no un código real. **Iconos de otros sets** (`link-03`, `zap-fast`, `message-chat-circle`, `life-buoy-01`…) llegan como nodos de `@jotis-me/icons` (D3).
  - La X es `CloseButton` `sm` (nombre «Cerrar aviso»). Los botones de texto de abajo son `Button` `link-gray` y `link-color`, pasados en `actions`.
- **Móvil (D5).** `responsive` (opt-in, para no cambiar el HTML de quien ya lo usa): por debajo de `lg` una barra de 56 px con la marca y un botón de menú (`aria-expanded`, `aria-controls`) abre la navegación a ancho completo, y el segundo panel pasa debajo del primero. `slim` con `responsive` se ve igual que el resto en móvil (el cuerpo es la misma columna), no como un carril de iconos. `defaultMenuOpen` es para vistas previas y capturas (la variante `Open=True` del Figma). **Diferencia:** no hay animación de apertura ni capa sobre el contenido (es un bloque en el flujo).
- **Peso:** `SidebarNav` pasa de 22 a 106,1 kB gzip (`Dropdown` con su `Autocomplete`, `Popover` y `Avatar`, más `Tooltip`, `Kbd`, `ProgressCircle` y `ProgressBar`); límite a 119.552. Es el salto de `TextEditor` otra vez. Si molestara, `account` podría cargarse con `React.lazy` a costa de pintar la tarjeta tras hidratar; no se hace ahora.
- **Ejemplo propio** (`examples/sidebar.tsx`): con el peso, compartir `navigation.tsx` subía `Tabs` y `FilterBar` a 339,8 kB (límite 337), así que `SidebarNavExample` va en su fichero y esas páginas no cargan `Dropdown` ni las tarjetas. `check:js` sin tocar.
- **Ejemplo y capturas:** simple (submenú abierto, tarjeta de progreso y cuenta), estrecho, dos niveles, los dos de secciones, la barra adaptable cerrada y abierta (375 px) y las 13 tarjetas. Alto de la tarjeta 560 → 5.120. E2E con Chromium (`sidebar-nav.spec.ts`): submenú con Enter y Espacio, tooltip al enfocar, segundo panel de `slim` y de `dual-tier`, cambio de cuenta y menú adaptable.
- **Caché de vitest.** Un fichero de ejemplos nuevo no lo ve `visual-registry.test.ts` hasta borrar `node_modules/.vitest-cache` (en la raíz): el `import()` con variable queda cacheado con la lista antigua de ficheros.
- **Revisión del usuario (2026-11-11).** El ejemplo interactivo apenas cambiaba entre tipos: su punto de partida eran dos enlaces sin submenú ni secciones, así que `dual-tier` y `slim` no tenían panel que abrir y los de secciones caían en la misma lista. Ahora parte de un `Panel` con submenú, `sections` con título, pie y `account`, y cada `type` se ve distinto. La marca de Regula (`AppIcon` + «Regula») la pone un envoltorio en `playground-components.ts`, porque los nodos no cruzan a la isla: el código copiable no la lleva. Ejemplos, miniatura y fragmento usan también Regula en lugar de «jotis.me», que en `slim` se veía recortado.
  - Dos fallos que salieron al mirarlo: en `slim`, `account` pintaba la tarjeta de 240 px fuera de la columna de 68 (ahora es `Dropdown` `account-avatar`), y en `sections-subheadings` con lupa la marca de logo y nombre se separaba (`justify-between` repartía los hijos del fragmento; ahora van en un grupo). Tests de los dos.
  - «Variantes y estados» vacía: era el `astro dev` del usuario, no la web. Al borrar `apps/docs/node_modules/.vite` con el servidor de desarrollo abierto, Vite responde `504 (Outdated Optimize Dep)` y la isla no carga. Se arregla reiniciando `astro dev`; la web construida la pinta entera.

## Breadcrumbs y Pagination (5.3)

Nodos: `Breadcrumbs` `1122:153` (divisor × tipo × breakpoint) y `Pagination` `1115:68622` (tipo × forma × breakpoint).

- **`Breadcrumbs`:** `divider` (`chevron`, `slash`; el icono `slash-divider` entra en el núcleo) y `type` (`text`, `text-line`, `button`, `account`). Los elementos ganan `avatar` y `accounts`/`defaultAccount`/`onAccountChange`, que pintan el `Dropdown` `account-breadcrumb` tal cual. Sin las props nuevas el HTML es el de antes (fixture `breadcrumbs-pagination-before.json`). Móvil: solo cambia el hueco entre elementos (6 px, y 2 px en `button`).
  - **Diferencia con el Figma `account`:** el menú abierto del Figma lleva la lista con radio; el de `Dropdown` es la lista de cuentas con check, que ya existía.
- **`Pagination`:** **los «diez `type`» del Figma son seis `type` y `align`**, porque la spec (escenario «Paginación de tarjeta») ya usa `type="card-minimal"` con `align="right"`: `page-default`, `page-minimal`, `card-default`, `card-minimal` (izquierda, centro, derecha), `card-advanced` (izquierda, centro) y `card-button-group` (izquierda, derecha). Design corregido. `shape` `square`/`circle`.
  - **Defaults:** sin `type` ni `shape` se pinta el marcado de siempre (`LegacyPagination`, sin clases de móvil), para cumplir el HTML idéntico. Con `type="page-minimal"` explícito es el mismo diseño con las clases de móvil.
  - **Filas por página** (`pageSizes`, `pageSize`, `onPageSizeChange`): un `<select>` nativo de 36 px (no `Select`: ~80 kB de React Aria); en `card-advanced` salen siempre (10, 25, 50, 100), en `card-minimal` solo con `pageSizes`. Es un `<select>` nativo (el `Select` de la librería sumaba ~80 kB). Cuadro de página: `<input>` de texto numérico; Enter o desenfoque van a la página y un valor fuera de rango vuelve a la actual.
  - **Móvil (D5):** por debajo de `md` los botones quedan en icono (el texto pasa a `sr-only`) y los números se cambian por «Página N de T»; en `card-minimal` y `card-advanced` se ocultan la lista de filas y el cuadro de página. **Diferencia con el Figma:** `card-button-group` conserva los números en móvil en lugar de recortarlos a «1 2 … 9 10».
  - **Diferencia:** en `card-advanced` a 800 px la fila se parte en dos líneas (`flex-wrap`); el Figma es de 1216.
- **Iconos:** `chevron-left-double`, `chevron-right-double` y `slash-divider` entran en el núcleo (`core-names.ts`). `Icon` pesa tres trazos más y `AvatarLabel`, que estaba en el límite exacto, pasa de 26.624 a 29.696 en `size-budget.json`.
- **Peso:** `Pagination` 25,6 kB (límite 28.160, sin tocar) y `Breadcrumbs` 24,2 kB (26.624).
- **Ejemplos y capturas:** `Breadcrumbs` con los cuatro tipos y las dos barras (alto 56 → 300) y `Pagination` con los diez (80 → 960). E2E `pagination-breadcrumbs.spec.ts`: botones de icono y texto de página en móvil, cuadro de página y cambio de cuenta con el teclado. Capturas revisadas en claro y oscuro.

## CalendarView (6.1)

Nodo: `Calendar` `8022:24550` (`Type` mes, semana y día × `Breakpoint`).

- **API** (todo opcional; sin las props nuevas el HTML de la vista de mes es el de antes, fixture `calendar-view-before.json`): `view`/`defaultView`/`onViewChange` (`month`, `week`, `day`), `onSelectEvent`, `startHour`, `hours` y `aside`; `CalendarEvent` gana `duration` (minutos, 60 por defecto). El selector de vista (`Dropdown` de elección única) solo aparece si se pasa `view`, `onViewChange` o un `defaultView` distinto de `month`, para no cambiar el HTML de quien ya lo usa. **Añadidos sobre design.md D5:** `onSelectEvent`, `startHour`, `hours` y `aside`.
- **Semana y día.** Cada hora mide 96 px, como el Figma; las líneas van cada 30 min. Columna de horas, una columna por día (lunes a domingo) y eventos colocados por su hora y su `duration`; los que se pisan se reparten el ancho (carriles). Cada día es una lista con su fecha como nombre y cada evento un elemento «título, 10:00–11:30» (con `onSelectEvent`, un botón). Los nueve colores del Figma salen de los colores de `Badge` (hay doce).
- **Hora actual.** Línea `brand` con punto y la hora en la columna de horas, a la hora de `today` (por eso `today` ahora conserva la hora: el mes sigue usando solo el día). Es un `role="separator"` con «Hora actual: 14:20» y no sale en una semana o un día que no contienen hoy ni si cae fuera de `hours`. Tests con `today` fijo: 14:20 → 1.376 px.
- **Navegación.** Anterior y siguiente avanzan un mes, una semana o un día; «Hoy» vuelve a hoy. El título es el mes (o el día completo) y, en semana y día, una insignia con la semana ISO y el rango como subtítulo (`subtitle` lo sustituye).
- **Móvil (D5).** Con container queries (`@container`, umbral 576 px del propio calendario, no de la ventana), para que un marco de 375 px lo enseñe igual que un móvil: la semana pasa a una tira con los siete días y la columna del día elegido (pulsar un día cambia de columna), como el `Week view` móvil del Figma. Solo se activa con `@container` si hay selector o la vista no es mes.
- **Desplazamiento.** La cuadrícula mide como mucho 640 px y se desplaza; con JavaScript arranca en `startHour` (8). `hours` recorta el tramo (el ejemplo usa `[8, 18]` porque la captura es de la página sin hidratar y empezaría a las 00:00).
- **Diferencias con el Figma:** la vista de día no trae el mini calendario ni el detalle del evento (invitados, recordatorio…): `aside` pinta lo que se le pase y el ejemplo monta un detalle sencillo. Sin botón de búsqueda (va en `actions`). Horas en 24 h («09:00») y no «9 AM».
- **Zona desplazable.** La cuadrícula de horas es un `<section>` «Horario» con `tabIndex=0` (axe `scrollable-region-focusable`, que salió en el e2e de grupo): con el teclado se enfoca y se mueve con las flechas.
- **Peso y ejemplo propio:** `CalendarViewExample` va en `examples/calendar.tsx` para que las páginas que comparten `data.tsx` no carguen `Dropdown`. Capturas revisadas en claro y oscuro (alto de la tarjeta 760 → 4.500). E2E `calendar-view.spec.ts`: selector con el teclado y la columna única en 375 px.
- **Corrección de peso (5.3 y 6.1).** Las mediciones de 5.3 (`Pagination` 25,6 kB, `Breadcrumbs` 24,2 kB) se hicieron con un `dist` viejo. Medido con el `dist` nuevo: `Breadcrumbs` 87,7 kB y `PageHeader` 87,9 kB (el desplegable de cuentas arrastra `Dropdown` con React Aria), `CalendarView` 91,4 kB (selector de vista, también `Dropdown`). Límites a 98.816, 99.328 y 103.424, como se hizo con `SidebarNav`. `Pagination` dejó `Select` por un `<select>` nativo con el mismo aspecto (`Select` sumaba ~80 kB a quien pagina una tabla): vuelve a 27,3 kB, límite sin tocar. Si `Breadcrumbs`/`PageHeader` molestaran, el desplegable de cuentas podría cargarse con `React.lazy`; `check:size` (sin `splitting`) no lo vería.

## LineChart, BarChart y DatePicker (6.2)

Nodos: `Line and bar chart` `1062:46989` (`Legend` × `Axis labels` × estilo × breakpoint), `Date picker` `1150:16803` y el modal `1547:269867`.

- **Gráficas.** `legend` acepta `true`/`"top"` (encima, lo de siempre), `"right"` (en columna a la derecha; el dibujo se encoge) y `false`. `axisLabels` {`x`, `y`} pinta los títulos de los ejes como el Figma: el vertical girado a la izquierda y el horizontal bajo las etiquetas; el margen del dibujo crece 20 px por título. Sin las props nuevas el HTML es el de antes (fixture `charts-before.json`).
  - **Diferencia con el Figma:** en `Axis labels=False` el Figma tampoco pinta los valores del eje vertical; aquí se quedan siempre, porque son la única referencia de escala para leer la gráfica (la tabla accesible es aparte). `axisLabels` solo añade los títulos. Leyenda arriba alineada a la izquierda (el Figma la pone a la derecha), como estaba.
- **`DatePicker` con `times`.** Lista de horas a la derecha del calendario (un `fieldset` «Horas disponibles» con botones `aria-pressed`), del alto del calendario y con desplazamiento. Aplicar pide día y hora; cambiar de día conserva la hora; el pie y el disparador enseñan «15 oct 2026, 10:30». `onApply` recibe `start` con la hora puesta y `time`; `DateRange` gana `time` (también vale en `defaultValue`). No se ofrece con `range`.
- **`presentation="modal"`.** El mismo panel en `ModalOverlay`/`Modal` de React Aria con el fondo de las capas (`OVERLAY`, como `CommandMenu`): centrado, foco atrapado, Escape o clic fuera cancelan y el foco vuelve al botón.
- **Contraste del disparador vacío.** El e2e de accesibilidad encontró que el botón sin fecha (`text-placeholder`) no llega a 4,5:1 en oscuro (antes no salía: la página solo enseñaba el panel `inline`). Pasa a `text-tertiary`. Cambia el aspecto del disparador vacío para quien ya lo usaba (un gris algo más oscuro); `FilterBar` no varía su captura.
- **`Notification`** pasa de 28.672 a 29.696 en `size-budget.json`: los textos nuevos de `defaultStrings` (lo comparten todos) lo dejaron en el límite exacto.
- **Ejemplos y capturas:** `LineChart` y `BarChart` con leyenda arriba, a la derecha, títulos y las dos cosas (alto 330 → 1.300); `DatePicker` con el rango de siempre, el de horas y el disparador del modal (540 → 960). E2E `date-picker-times.spec.ts`: el modal elige día y hora y devuelve el foco, y Escape cierra sin aplicar. Capturas revisadas en claro y oscuro.

## ColorPicker (6.3)

Nodos: `Color picker` `12423:52680` (12 `Type`) y `_Color inputs` `12304:616891` (Hex, RGB, CSS, HSL, HSB y la fila de parada).

- **Sin `type`, el de siempre** (`LegacyColorPicker`, HTML igual, fixture `color-picker-before.json`). Con `type`, el componente nuevo; `model` solo cuenta con `type`. `onChange` sigue recibiendo el hex; con `type` recibe además la opacidad (segundo argumento opcional, así no rompe a quien pasaba una función de un argumento).
- **Tipos.** `solid`/`gradient`/`image`: un panel con las pestañas del Figma (`Tabs` del paquete) abierto en esa, y la X con `onClose` (`CloseButton`). Muestras: `swatch`, `saved-sm`, `saved-md`, `brand` y `gray` (los 600 de Tailwind por defecto, como el Figma; van con su comentario `color-fijo` y `biome-ignore format` para que la lista quede en una línea). Barras: `minimal`, `hue-slider`, `transparency-slider`. `palette`: rejilla de 18 tonos × 11 luminosidades generada en HSL (no es la tabla exacta del Figma, que es la paleta de Tailwind), como `radiogroup` con una sola parada de tabulación y flechas en dos direcciones.
- **Modelos.** Desplegable `Select` + campos en grupo; cada campo avisa en cuanto lo escrito es válido y al salir vuelve al valor real. Conversión con `parseColor` de React Aria. Test: #7F56D9 = RGB 127/86/217, HSL 259/63/59, HSB 259/60/85, CSS `rgba(127, 86, 217, 1)`, como el Figma.
- **Degradado.** Vista previa (lineal a 135° o radial), invertir, barra con un mando `slider` por parada (flechas, Mayúsculas ×10, Inicio/Fin, Suprimir; arrastre con el puntero), filas con posición, color, opacidad y quitar (mínimo dos), «Añadir» entre la elegida y la siguiente con el foco en la nueva. `onGradientChange` con la lista ordenada. **Diferencias con el Figma:** sin los mandos de ángulo sobre la vista previa (el ángulo es fijo) y sin la fila de degradados guardados.
- **Imagen.** `input type="file"` de imágenes dentro de su etiqueta «Haz clic para subir», zona para soltar, relleno (rellenar, ajustar, recortar, mosaico) y los siete ajustes del Figma con `Slider` (-100 a 100). La vista previa aplica exposición, contraste, saturación, temperatura y matiz con filtros CSS; luces y sombras no tienen filtro y solo se avisan (`onImageAdjust`). En jsdom no hay `URL.createObjectURL`: sin él se enseña solo el nombre del archivo.
- **Cuentagotas.** `EyeDropper` del navegador; donde no existe (Firefox, Safari, jsdom) el botón sale desactivado.
- **Textos** en `labels` del propio componente y no en `defaultStrings`: ese objeto lo importa todo el paquete y cada texto nuevo suma peso a todos (ya pasó con `Notification`).
- **Icono:** `switch-horizontal-01` entra en el núcleo (invertir el degradado).
- **Peso:** 123 → 140,3 kB (`Tabs`, `Select` y `Slider`); límite a 158.208. Ejemplo propio (`examples/color.tsx`) para que las páginas de `forms.tsx` no lo carguen; `check:js` sin cambios.
- **Ejemplo y capturas:** el de siempre, el panel en sus tres pestañas, las cinco de muestras, las tres barras y la paleta (alto 420 → 2.800). Revisadas en claro y oscuro.

## Cierre del grupo 6

E2E completo de docs: 935 pasan. Fallaron dos: el de `CopyTooltip` de siempre (pasa solo) y «los ejemplos vivos no heredan los estilos», que buscaba la única tabla del ejemplo de `DatePicker` y ahora hay dos (rango y horas): mira la primera (`228a973`).

## ContentDivider, FileUpload e InlineCTA (7.1)

Nodos: `Content divider` `1252:126874`, `File upload` `1175:101149` e `Inline CTA` `1255:131915`. Sin las props nuevas, el HTML de los tres es el de antes (fixture `divider-upload-cta-before.json`).

- **`ContentDivider`:** `actions` es lo del centro con nombre (`Button`, `Button` solo icono o `ButtonGroup`), igual que `children`; si llegan los dos, gana `actions`. Los tres estilos del Figma (línea, dos líneas, banda) ya estaban (`variant`).
- **`FileUpload`:** `progressStyle="fill"` llena el fondo de la tarjeta (`bg-secondary`) hasta el porcentaje y pone «16 MB | ↑ 40%» sin barra; el relleno es un `role="progressbar"` con el nombre del archivo. Va 1 px por dentro para no tapar el borde (es una sombra interior). `UploadFile.icon` o `fileIcon(file)` ponen el icono del tipo (`@jotis-me/icons/files`); con error se sigue pintando el aviso.
  - **Diferencia con el Figma:** en `bar` el Figma también pinta la barra al 100 % y «200 KB de 200 KB»; se deja como estaba (sin barra al completar) para no cambiar el HTML de quien ya lo usa.
- **`InlineCTA`:** `type` con los siete del Figma como plantillas (`image`, `actions`, `email`, `change-plan`, `upgrade-plan`, `payment-method`, `receipt`) con sus datos (`plan`, `features`, `payment`, `file`, `onSubmit`…). Sin `type` es la tarjeta de siempre (`ClassicInlineCTA`).
  - **Sigue siendo de servidor:** el campo de `email` va en `internal/inline-cta-email.tsx` con `"use client"` (el test de frontera servidor lo pide). Usa las piezas de `Input` (`FieldShell`, `controlClasses`, `nativeClasses`) y no `Input` entero: con `Input`, `InlineCTA` pasaba de 23 a 90,9 kB por sus desplegables. Queda en 25,3 kB (límite 25.600 → 28.160, por `Button`). La ficha pasa a `interactive: true` por el campo.
  - **Móvil (D5):** con `type`, container queries (`@container`, umbral `md` = 448 px de la tarjeta): la imagen arriba y los botones a todo el ancho con la acción principal arriba (`flex-col-reverse`), como el Figma.
  - Ejemplo sin fotos: la imagen es un bloque de marca con `AppIcon`. Logos de `@jotis-me/icons/payments` y `/files`.
- **Ejemplos y capturas:** `ContentDivider` con el botón, el grupo de iconos en `dual`, el grupo de texto en `fill` y el botón de icono (alto 200 → 520); `FileUpload` con la lista de relleno e iconos de tipo (400 → 1.000); `InlineCTA` con los siete tipos y dos en 360 px (170 → 2.600). Revisadas en claro y oscuro.
- **`check:js` (7.1).** Tabs y FilterBar volvieron a pasarse por 0,2 kB (337,2 de 337). `FilterBarExample` pasa a `examples/filter-bar.tsx` (FilterBar lleva `DatePicker`); Tabs se quedó en 337,1 por lo que suma el núcleo de iconos y `defaultStrings`, así que el patrón `/components/*/` sube de 337 a 340, con el motivo en `js-budget.json`.

## Message y MessageInput (7.2)

Nodos: `Message` `1242:996` (9 tipos × enviado × panel de acciones) y `Message action` `9206:602532` (las tres cajas de escribir).

- **`Message`.** `type` con los nueve del Figma y una prop de datos por tipo (`reply`, `file`, `audio`, `media` para imagen y vídeo, `link`), `reactions`/`onReact`, `status`/`onRetry` y `actions`. Sin ninguna de ellas, el mensaje de siempre (`ClassicMessage`, HTML igual, fixture `message-before.json`). Sigue siendo de servidor: el reproductor de `audio` va en `internal/message-audio.tsx` como isla.
  - **Estado:** un check (enviado), dos checks de marca (leído; el núcleo no tiene «check doble», se pintan dos `check` montados) o el aviso de fallo, que con `onRetry` es un botón «No se ha enviado. Reintentar el envío» (escenario de la spec).
  - **Reacciones:** lista «Reacciones»; con `onReact`, botones con `aria-pressed` y nombre «Perfecto: 2».
  - **Acciones:** `role="toolbar"` oscuro (`bg-primary-solid`) con botones de icono con nombre. Siempre visible si se pasa: mostrarlo al pasar el ratón es cosa de quien lo usa.
  - **Audio:** la onda es un dibujo fijo (no se analiza el audio) que se colorea según avanza; sin `src`, el botón queda desactivado.
  - **Diferencias con el Figma:** el vídeo es el `<video>` nativo con controles (o un nodo) y no los controles propios del Figma; en el ejemplo las imágenes son bloques de color, sin fotos.
- **`MessageInput`.** `variant` `minimal` (una línea y el botón de enviar al lado), `textarea` (micrófono arriba; adjuntar, emoji y «Enviar» abajo) y `advanced` (micrófono y barra con `toolbar`, «Atajos» y «Adjuntar»). Cada botón sale si llega su función (`onVoice`, `onEmoji`, `onShortcuts`, `onAttach`). Sin `variant`, la de siempre.
- **Iconos del set completo en vez de agrandar el núcleo.** Cada icono del núcleo lo paga todo componente que usa `Icon`: con cuatro más (micrófono, cara, comando y el de invertir de `ColorPicker`), `ActivityFeed`, `Avatar`, `CardHeader` y `Pagination` se pasaban de su límite. Se quitan del núcleo y se usan como componentes sueltos (`IconMicrophone02`, `IconFaceSmile`, `IconCommand`, `IconSwitchHorizontal01` de `@jotis-me/icons`), que solo pesan donde se usan. Para poder hacerlo, `Button` `iconOnly` acepta ya un nodo además de un nombre (como pide la spec para los `icon`); con un nombre el HTML no cambia. El núcleo se queda en 86 (los 82, `type-01`, `slash-divider` y los dos chevrones dobles de 5.3).
- **Peso:** `Message` 28,7 kB (`Avatar`, iconos y el reproductor); límite 26.624 → 32.768. `MessageInput` 26,5 kB, dentro.
- **`check:js`:** las páginas de componente pasan a 343,4 kB: la isla del playground de cada página trae todos los componentes, así que cada variante nueva suma en todas. Patrón `/components/*/` 340 → 350, con el motivo en `js-budget.json`. **Pendiente (fuera de esta tarea):** que el playground cargue solo el componente de su página, como se hizo con los ejemplos en 2.4.
- **Ejemplos y capturas:** `Message` en su propio fichero (`examples/message.tsx`) con los de siempre y los nueve tipos, reacciones, los tres estados y el panel (alto 300 → 1.500); `MessageInput` con las tres variantes (120 → 640). Revisadas en claro y oscuro.

## MetricCard, PageHeader y SectionHeader (7.3)

Nodos: `Metric item` `1560:266217`, `Page header` `1239:122640` y `Section header` `1214:38`. Sin las props nuevas el HTML de los tres es el de antes (fixture `headers-metric-before.json`); los tres siguen siendo de servidor.

- **`MetricCard`:** `icon`/`iconStyle` (cuatro: `featured`, `featured-inline`, `modern`, `modern-inline`, con `FeaturedIcon`), `chart`/`chartStyle` (cuatro: `sparkline`, `area`, `line`, `header`), y además `changeBadge` y `footer` (**añadidos sobre design.md**: el Figma pinta el cambio como insignia en las simples y lleva pies con «View report» o ajustes y botón). La mini gráfica es un SVG propio sin ejes, en `fg-success-secondary`/`fg-error-secondary` según `trend` (escenario de la spec), decorativa (`aria-hidden`). Las tarjetas nuevas llevan borde de verdad (`border`) y no sombra interior: el fondo de la banda de `header` tapaba la sombra. Peso 26,9 kB, límite 27.648 → 30.720.
  - **Diferencia:** la línea del Figma lleva un punto en el valor actual; aquí no (sin datos de cuál es).
- **`PageHeader`:** `avatar`, `banner` (`true` = degradado `utility-brand-200` → `utility-pink-200`, o un nodo), `centered` y `back` (**añadido**: el «Back» del Figma en móvil, que sustituye a las migas por debajo de `@md` con container queries). Con banda, el avatar sube sobre su borde y las migas van a su derecha; sin banda, las migas encima y el avatar junto al título. La búsqueda del Figma es un `Input` en `actions`.
- **`SectionHeader`:** `tabs`, `search`, `buttonGroup` y `menu` como huecos para los componentes del paquete (`Tabs`, `Input`, `ButtonGroup`, un `Button` de tres puntos): si los importara, una cabecera de servidor de 9 kB pasaría a cargar React Aria. Rejilla: en ancho, título, controles y menú en una fila; en estrecho, el menú junto al título y los controles debajo (un solo menú en el DOM).
  - **Spec corregida:** el escenario «Cabecera con pestañas» decía `Tabs` de tipo subrayado; el Figma pinta un segmentado (`button-border`). Se construye como el Figma.
  - **Diferencias:** en móvil el Figma cambia las pestañas por un desplegable; aquí se desplazan en horizontal (las `Tabs` horizontales no tienen desplegable). La barra de pestañas del Figma ocupa todo el ancho; `button-border` mide lo que sus pestañas.
- **Ejemplos y capturas:** `MetricCard` con los tipos de icono y de gráfica, insignia y pies (alto 190 → 980); `PageHeader` con avatar, banda, banda con avatar, centrado y 375 px (200 → 1.900); `SectionHeader` con búsqueda, grupo, pestañas y 375 px (200 → 980). Revisadas en claro y oscuro.

## Table (7.4)

Nodos: `Table` `1227:110587` (las tablas de ejemplo), `Table cell` `1222:107305`, `Table header cell` `1221:107933` y la acción inicial `9400:570197`. Sin las props nuevas, el HTML es el de antes (`ClassicTable`, fixture `table-before.json`).

- **Tipos de celda:** `column.type` con catorce plantillas; los «quince del Figma» cuentan la tendencia positiva y la negativa por separado, aquí es `trend` con `direction`. El valor de `row[key]` toma la forma del tipo (`TableCellAvatar`, `TableCellFile`…, todos exportados). `select` es un `<select>` nativo con el punto de la opción elegida (no `Select`: React Aria en cada tabla), y `menu` es el botón de tres puntos o el nodo que se le pase (un `Dropdown`). En la tabla tipada las celdas no parten líneas (`whitespace-nowrap`): la tabla se desplaza en horizontal.
- **Orden:** botón en la cabecera, `aria-sort` (`none` en las ordenables sin orden, nada en el resto) y flecha. La tabla ordena las filas ella misma (`localeCompare` en castellano con números) con `sortValue` para valores compuestos; `sort`/`onSortChange` para guardarlo fuera (escenario «Ordenar»).
- **Ayuda:** `help` pinta `HelpIcon` («Ayuda: …»).
- **Selección:** `Checkbox` (cabecera con todas las visibles, a medias con algunas: escenario «Seleccionar filas»), `Radio` (un nombre de grupo por tabla) o `Toggle` (nombre en `sr-only`), sobre las claves `row.id` o el índice.
- **`striped`:** filas pares en `bg-secondary`.
- **`"use client"`:** la tabla tipada tiene estado (orden y selección). La de siempre se sigue pintando igual en servidor.
- **Peso:** 27 → 55,5 kB (`HelpIcon` con su tooltip, `Checkbox`, `Toggle`, `Avatar`, `AvatarGroup`, `ProgressBar`, `Badge`). Límite a 62.976. Iconos de flecha del set completo (`IconArrowUp`, `IconArrowDown`), no del núcleo.
- **`check:js`:** la página de Tabs (que carga todo en el playground) llega a 350,3: patrón `/components/*/` a 360. Sigue pendiente el playground por página.
- **Diferencias con el Figma:** las barras de filtros y búsqueda de las tablas del Figma son `FilterBar` (7.5) y no parte de `Table`; el estado «hover/selected» de cada celda es el hover de la fila.
- **Ejemplo y capturas:** `examples/table.tsx` con la de siempre y las cuatro del Figma: miembros del equipo (avatar, insignia, ayuda, insignias, iconos de acción y casillas), empresas (filas alternas, grupo de avatares, progreso ordenable, estrellas y menú), ventas (radio, tendencia y botones de texto) y archivos (interruptor e iconos de tipo). Alto 420 → 2.450. Revisadas en claro y oscuro.

## FilterBar y TreeView (7.5)

Nodos: `Filters bar` `12232:376165` (8 tipos × breakpoint) y `Tree view` `12451:566966`. Sin las props nuevas, el HTML de los dos es el de antes (fixtures `filter-bar-before.json` y `tree-view-before.json`, con los ids de React y React Aria normalizados).

- **`FilterBar`:** `type` con siete valores; los «ocho» del Figma cuentan el avanzado inactivo y el activo, aquí es `advanced` sin o con `conditions`. Huecos para los componentes del paquete: `dates` (un `DatePicker`), `extra` (los atajos «Hoy» y el `Select` de periodo) y `fields` (`Select`, `Input` con su etiqueta encima). El constructor de `advanced` usa `<select>` y `<input>` nativos (con nombre «Campo / Operador / Valor del filtro N») y avisa con la lista en `onConditionsChange`; el botón de filtro de la primera fila añade una condición. Iconos del set completo (`IconSearchLg`, `IconXClose`).
  - **Móvil (D5):** container queries. Filtros en icono, búsqueda a todo el ancho; el constructor se sustituye por «Filtros (N)», que abre `onOpenFilters` (el «Edit filters 3» del Figma).
  - **Diferencias:** el desplegable de varios elegidos del Figma («2 selected · 16 users» con buscador y casillas) es un `Select type="tags"` o un `MultiSelect` que se pasa en `fields`; el atajo ⌘K de la búsqueda no se pinta.
- **`TreeView`:** `size` (`md`: `py-2`, `text-md`, iconos de 20 y sangría de 28) y `type="advanced"`: `Tree` de React Aria en selección múltiple con `Checkbox slot="selection"` (Espacio marca) y `Button slot="chevron"` (la flecha abre sin marcar). La cascada es propia: el estado guarda las hojas, una carpeta está marcada si lo están todas sus hojas y a medias si alguna (`isIndeterminate`). Conectores con un tramo horizontal hasta cada fila y el vertical cortado en el último hijo. Asa `IconDotsGrid` decorativa (sin arrastre: el Figma no lo define). Peso 75,4 kB; límite 78.336 → 84.992.
- **Ejemplos y capturas:** `FilterBar` con la de siempre, los ocho tipos y dos en 375 px (alto 120 → 1.180); `TreeView` con el de siempre, `md` y el avanzado (330 → 860). Revisadas en claro y oscuro.

## Cierre del grupo 7

E2E completo de docs: 935 pasan. Fallaron dos: el de `CopyTooltip` de siempre y «a 390px ninguna página se desplaza en horizontal» en `/components/table/`: los `<input>` de `Checkbox`, `Radio` y `Toggle` van ocultos en posición absoluta y, sin un antecesor posicionado dentro de la región que se desplaza, la región no los recortaba y ensanchaban la página a 735 px. No bastó con `relative` en la celda de selección (`036d07f`): los textos `sr-only` de las insignias de tendencia y de los botones se medían igual fuera. La tabla tipada lleva `relative` en el `<table>`, y así todo lo absoluto de dentro se recorta en la región.

## BackgroundPattern, CreditCard, BrowserFrame y FeaturedIcon (8.1)

Nodos: `Background pattern` `4932:397713`, `Credit card mockup` `1291:157837`, `Browser toolbar` `7333:23578` y `Featured icon` `1102:5338`. Sin las props nuevas, el HTML de los cuatro es el de antes (fixtures `frames-before.json` y `credit-card-before.json`).

- **`BackgroundPattern` `tech-grid`:** matriz de puntos (12 px de paso y radio 2; 8 y 1,5 en `sm`), más densa arriba y con tres opacidades al azar (reparto determinista con `seed`, como `grid-check`). Cada opacidad es un único `<path>`: miles de puntos en tres nodos. Color `utility-neutral-200`. **Diferencia:** el Figma es un vector fijo; aquí se genera al tamaño del área.
- **`CreditCard`:** ocho temas nuevos, trece en total. Las bandas son el gris 800 del Figma (`#262626`), abajo (la mitad) o a la izquierda (menos 88 px de franja de color); en las verticales el texto de abajo se queda en la parte oscura. Colores fijos, como el resto de la tarjeta (es un objeto, no cambia con el tema). **Diferencia:** se conserva el chip, que el Figma no pinta en las de banda.
- **`BrowserFrame`:** `minimal-color` (minimal con el semáforo en color) y `theme`. `theme="dark"` añade `dark-mode` al marco: barra, borde y contenido toman los tokens del tema oscuro. **Limitación:** no hay clase de tokens que fuerce el tema claro dentro de una página oscura, así que `theme="light"` sigue al tema de la página.
- **`FeaturedIcon`:** `gradient` (círculo con los anillos `utility-*-50` y `-100` y el sólido en el centro), `dark` (cuadrado del color sólido, icono blanco, borde claro y brillo inferior esqueumórfico) y `modern-neue` (marco blanco con filo y cuadrado interior con sombra). Con `light`, `modern` y `outline`, los seis estilos de la spec.
- **Ejemplos y capturas:** `tech-grid` con dos máscaras (alto 520 → 740), las trece tarjetas (460 → 1.560), `minimal-color` y los oscuros (600 → 1.150) y las filas de `gradient`, `dark` y `modern-neue` (140 → 340). Revisadas en claro y oscuro.

## Cierre del grupo 8

E2E completo de docs: 935 pasan; fallaron el de `CopyTooltip` y «el archivo se elige también con el teclado» (`input-variants`), y los dos pasan solos: son de carga.

## AvatarProfilePhoto, CheckIcon y CheckItem (9.1 y 9.2)

Nodos: `Avatar profile photo` `1217:108477`, `Check icon` `1254:137887` y `Check item text` `1345:1610`. Los tres, en «Etiquetas e identidad», con página, ficha, ejemplo (`display.tsx`), muestra, fragmento, límite y capturas. Catálogo: 94 → 97.

- **`AvatarProfilePhoto`:** `sm` 72 · `md` 96 · `lg` 160; aro `bg-primary` con filo y, dentro, foto, iniciales en Bricolage (`display-xs/md/xl`) o el icono de usuario (32/40/64) con `shadow-2xl`. Sello de verificado: el de `Avatar`, que pasa a `internal/verified-seal.tsx` para compartirlo (`Avatar` no cambia su HTML). Accesibilidad como `Avatar`: con iniciales y `alt`, imagen con nombre (y «Verificado»). Peso 25,5 kB, límite 28.160.
- **`CheckIcon`:** `type` `default` (tinte), `line` (`check-circle`) y `filled` (sólido con check blanco); `color` `brand`, `gray`, `success`; cuatro tamaños (20 a 32). Decorativo. El tinte usa la escala `utility` (100 de fondo, 600 el check) y no `bg-brand-secondary`: en oscuro aquel fondo y `fg-brand-primary` casi no se distinguían (se vio en la captura).
- **`CheckItem`:** `<li>` (o `div` con `as`) con `CheckIcon` y el texto en `text-tertiary`; `sm`/`md`/`lg` = check 20/24/28 y `text-sm`/`md`/`lg`, un paso menos en estrecho (container queries), como el Figma en móvil.
- **Diferencias:** el Figma de `CheckItem` solo tiene los colores marca y éxito; aquí también `gray`, el de `CheckIcon`.

## Rating y RatingBadge (9.3)

Nodos: `Star icon` `1232:9` y `Ratings badge` `7460:158976`. Los dos, en «Etiquetas e identidad» (catálogo 97 → 99), con página, ficha, ejemplo (`display.tsx`), muestra, fragmento, límite y capturas.

- **`Rating`:** la estrella del Figma (caja de 20) dos veces: fondo `bg-tertiary` (el `#F5F5F5` del Figma) y encima el relleno recortado con `clip-path: inset()`, en pasos de 10 % como las once variantes; `yellow` = `fg-warning-secondary` (el `#FACC15` del Figma no tiene token estable en los dos temas) y `gray` = `fg-primary` (el `#171717` del Figma, blanco en oscuro). `max` de 1 a 5, `size` `sm` 16 · `md` 20 · `lg` 24. `role="img"` con «4,5 de 5»; `ratingLabel()` exportada para quien la necesite. Peso 9,9 kB, límite 12.800.
- **`RatingBadge`:** las dos coronas del Figma (36 × 80) en `currentColor` con `text-fg-primary`; la derecha del Figma es exactamente la izquierda en espejo (`x' = 36 − x`, mismos 18 trazos), así que se dibuja una y se voltea con `-scale-x-100` (10 kB menos). Estrellas `Rating` `sm` con 2 px de separación, título `text-sm` seminegrita y apoyo `text-xs` `text-secondary`, solapados −4 px como el Figma. Peso 14,9 kB, límite 17.920.
- **Diferencias:** la estrella vacía es tan clara como en el Figma (`bg-tertiary`), poco visible sobre blanco; la celda `rating` de `Table` sigue con su `bg-quaternary` (no se toca su HTML).

## SocialButton y SocialButtonGroup (9.4)

Nodos: `Social button` `1256:130788` y `Social button group` `1256:132638`. Los dos, en «Acciones» (catálogo 99 → 101), con página, ficha, ejemplo (`examples/social.tsx`, aparte para que los logos solo los carguen estas páginas), muestra, fragmento, límite y capturas.

- **`SocialButton`:** un `Button` (D3: el logo por `logo`, el texto de `defaultStrings.signInWith[provider]`, «Entrar con Google»). `theme` `brand` = `Button` primario con el fondo de la marca y su hover del Figma (Facebook `#1877F2`/`#0C63D4`, Dribbble `#EA4C89`/`#E62872`, negro en Apple, X y Figma, como el Figma también en hover), con el brillo del primario y el logo en blanco; Google en `brand` es el secundario, como el Figma. `color`/`gray` = secundario; el logo toma `currentColor` del envoltorio (`fg-primary` o `fg-quaternary`) y no el gris de iconos del secundario. `md` 40 con logo 16 y 8 px hasta el texto; `lg` 44 con logo 20 y 10 px; solo logo con `p-3`. Peso 25,4 kB, límite 28.160.
- **Logos por tema:** los `…LogoGray` de `@jotis-me/icons/logos` usan `currentColor`, así que salen en blanco en `brand` y en gris en `gray`. En `color`, Apple y X van con `…LogoGray` (los de color son negros fijos y en oscuro no se verían). La tabla está en la ficha y en `SOCIAL_LOGOS` del ejemplo.
- **`SocialButtonGroup`:** `role="group"` con `label`; `layout` `column` (a todo el ancho, 10 px en `md` y 12 en `lg`, de los altos del Figma) o `row` (iguales, 12 px). Peso 9,1 kB, límite 10.752.
- **Presupuesto de JS:** `/components/*/` 360 → 365 (Tabs a 361,7 kB con Rating, RatingBadge y los textos nuevos de `defaultStrings`); motivo en `js-budget.json`. Sigue pendiente el playground por página.
- **Test de catálogo:** los vecinos de `Button` incluyen los dos nuevos y el último de «Acciones» pasa a ser `SocialButtonGroup`.

## AppStoreBadge (9.5)

Nodo: `Mobile app store badge` `1303:2162`. En «Acciones» (catálogo 101 → 102), con página, ficha, ejemplo (`examples/social.tsx`), muestra, fragmento, límite y capturas.

- **Dibujos:** el Figma da cada insignia como un SVG entero (texto en curvas, en inglés, como las oficiales), así que D3 se cumple con un set nuevo en `@jotis-me/icons/logos`: `store`, diez dibujos (cinco tiendas × relleno y contorno; `md` y `lg` son el mismo dibujo escalado). Componentes `StoreGooglePlayLogo`, `StoreAppStoreLogo`, `StoreMacAppStoreLogo`, `StoreGalaxyStoreLogo`, `StoreAppGalleryLogo` y sus `…OutlineLogo`; ficheros en `assets/logos/store/` y `dist/logos/store/`.
- **Limpieza:** ids solo los referenciados y con prefijo `store-<insignia>-`; el contorno (un solo `#171717`) pasa a `currentColor` y el componente le da `text-primary`, así en oscuro sale en blanco. Galaxy Store en relleno se exportó con el fondo del marco y un degradado cónico en `foreignObject`, que los logos no admiten: se quitó el fondo y el cónico se sustituyó por un lineal en diagonal con los mismos tonos (coral → rojo → rosa → magenta). Es la única diferencia con el Figma.
- **Módulo propio:** las insignias van en `src/logos-store.generated.tsx` (re-exportado por `logos.ts`). En un solo módulo con el resto de logos, el trozo compartido de la web con los logos (que cargan las páginas con algún logo) subía 20–26 kB en 20 páginas; separadas, solo las carga quien las usa.
- **Galería de logos:** no se añaden a `/icons/logos/` (su rejilla es de cuadros de 48); se ven en la página de `AppStoreBadge`.
- **Componente:** `<a>` con `aria-label` = nombre de la tienda (contenido en el texto visible, 2.5.3) o `label`; el dibujo es decorativo; `md` 40 y `lg` 44 de alto con el ancho proporcional; foco con `shadow-focus-ring`. Peso 9,2 kB, límite 10.240.
- **Cierre del grupo 9:** test en `build.test.ts` que falla si `dist` (o `src`) importa `@jotis-me/icons/logos|flags|payments|files|cursors`; `app-icon` sí se importa (es la utilidad de AppIcon, no un set de recursos).

## Cierre del grupo 9

E2E completo de docs: 982 pasan y fallaron tres. El de `CopyTooltip` es de carga (pasa solo). Los otros dos eran de este grupo: `docnav` contaba 4 componentes en «Acciones» (ahora 7; el test los saca del catálogo) y en `/components/` se repetía el id `social-google-0`, porque las muestras de `SocialButton` y `SocialButtonGroup` usaban las dos el logo de Google en color, que lleva su `clipPath`. La de `SocialButton` pasa a Apple y Facebook en marca. Repetidos `docnav`, `components` y `copy`: 133 pasan.

## ActivityGauge, RadarChart y ChartMarker (10.1)

Nodos: `Activity gauge` `1078:155`, `Radar chart` `1084:7362` y `Chart marker` `8100:193259`. Los tres, en «Gráficas» (catálogo 102 → 105), con página, ficha, ejemplo (`charts.tsx`), muestra, fragmento, límite y capturas; LineChart y BarChart, con `marker` en su ficha, su ejemplo y sus capturas.

- **Tabla accesible:** las gráficas anteriores no tenían; las nuevas llevan `ChartTable` (`internal/chart.tsx`), una tabla `sr-only` con el mismo nombre que la imagen: en `ActivityGauge`, serie y valor («Móvil, 72 %»); en `RadarChart`, un eje por fila y una serie por columna. LineChart y BarChart siguen con sus títulos por punto (no se toca su HTML).
- **`ActivityGauge`:** medidas del Figma por tamaño: lado 160/200/240/280, grosor 8/12/16/18 y radios en el eje (76/64/52 · 94/78/62 · 112/92/72 · 131/107/83). Avance con `stroke-dasharray` desde arriba y extremos redondos sobre la pista `bg-tertiary`. Centro: texto `text-xs`/`text-sm` y cifra `text-xl` (xs) o Bricolage `display-xs/sm/md`. Colores `utility-brand-700/600/400` (en oscuro la escala se invierte y el de fuera queda el más claro, como en el resto de gráficas). Leyenda con `ChartLegend`, debajo o a la derecha. 10,2 kB, límite 12.800.
- **`RadarChart`:** el lienzo del Figma (392 × 372, centro 7 px bajo la mitad, radio 152) en `viewBox`, que se escala; rejilla y rayos `border-tertiary`, escala en pastillas `utility-neutral-50` sobre el eje de arriba (ancho estimado por número de caracteres), series con relleno al 16 % y borde de 2. Colores por defecto marca, cielo y rosa, como el Figma (no la paleta de series en orden, que daría dos morados). 10,5 kB, límite 13.312.
- **`ChartMarker`:** `internal/chart-marker.tsx` con `MarkerLine` (SVG: línea que se desvanece con un degradado de `useId`, de puntos en `dash` con `stroke-dasharray="0 6"`, lisa en `minimal`; punto hueco de 12 o lleno de 6) y `MarkerBubble` (la burbuja de `Tooltip`). En LineChart y BarChart, `marker` envuelve el svg en una caja relativa y coloca la burbuja en porcentajes del `viewBox`; sin `marker`, el HTML es idéntico (los fixtures de `charts-before.json` pasan). En BarChart marca el total apilado. 9,7 kB, límite 12.288. LineChart y BarChart pasan a 11,2 y 11,1 kB (límite 11,5).
- **Diferencias:** el cursor de mano del Figma sobre el marcador no se dibuja (es el puntero del sistema).

## ColorPickerDropdown (10.2)

Nodo: `Color picker dropdown` `12424:15898`. En «Formularios» (catálogo 105 → 106), página interactiva, ficha, ejemplo (`color.tsx`), muestra, fragmento, límite, capturas y un e2e (`color-picker-dropdown.spec.ts`: Enter abre, Escape cierra y el foco vuelve).

- **Estructura:** `DialogTrigger` + `Popover` (`bottom end`, 8 px) + `Dialog` de React Aria con el `ColorPicker` `solid` dentro (con sus pestañas y su X, que cierra el popover). Los seis disparadores del Figma son `Button` de React Aria con las clases de los nuestros (secundario, campo con `shadow-xs` y borde `border-primary`); no se usa `Button` del paquete porque `DialogTrigger` necesita un botón de React Aria para abrir y devolver el foco.
- **Nombres:** las muestras y botones se llaman «Color: #7F56D9» (`label` y valor); `hex-input` añade la opacidad; `select` usa `aria-labelledby` con su etiqueta visible y el valor.
- **Estado:** `value`/`defaultValue`, `alpha`/`defaultAlpha` e `isOpen`/`onOpenChange`, controlados o no; el `ColorPicker` se monta al abrir con el color actual. `pickerProps` pasa el resto (muestras, «Añadir», modelo).
- **Peso:** 141,3 kB (casi todo el `ColorPicker`), límite 147.456. La captura es estática: enseña los disparadores; el panel abierto lo cubre el e2e.
- **Test de foco:** React Aria devuelve el foco al disparador después del cierre, en otro ciclo; en jsdom hay que esperarlo con `waitFor`.

## FilterMenu y FilterPanel (10.3)

Nodos: `Filters dropdown menu` `12232:366410` y `Filters slideout menu` `12232:375462`. Los dos, en «Datos» (catálogo 106 → 108), páginas interactivas, fichas, ejemplos (`filter-bar.tsx`; el de `FilterPanel` dentro de un `Slideout` `contained`), muestras, fragmentos, límites y capturas.

- **Diseño corregido:** design.md decía «`Dropdown` con casillas»; el Figma es un constructor de filtros (campo, operador y valor por fila) en el que el valor de lista lleva casillas. Se sigue el Figma y se corrige design.md.
- **Piezas compartidas:** `internal/filter-rules.tsx` (`FilterRows`, `FilterEmpty`, `AddButton`, `FilterActions`, textos `FILTER_LABELS`). Campo y operador son `<select>` nativos (el campo con «Elige un filtro» como marcador, en gris con `:invalid`); el valor, un `<input>` o, si el campo tiene `options`, el `MultiSelect` del paquete tal cual (búsqueda, «Restablecer», «Seleccionar todo» y el resumen «2 elegidos · 16 usuarios», que suma las cifras de los apoyos).
- **`FilterMenu`:** `DialogTrigger` + `Popover` (`bottom start` o `bottom end` con `align`) de 624 px o el ancho de pantalla menos 32. Borrador que parte de lo aplicado cada vez que se abre; «Aplicar filtros» guarda solo las filas completas y cierra; «Limpiar todo» aplica `[]`; Escape cierra sin aplicar. El botón, con fondo `bg-secondary` y la pastilla con el número si hay filtros, se llama «Filtros 3 filtros activos»: el número visible y el resto en `sr-only` (con `aria-label` axe daba `label-content-name-mismatch`, porque el texto visible «Filtros 3» no estaba en el nombre). 86,2 kB, límite 90.112.
- **`FilterPanel`:** el contenido del `Slideout` (el título, la descripción y la X son los del `Slideout`): filas en dos líneas, «Añadir filtro» y el pie pegado abajo (`sticky`, `mt-auto`). 86,0 kB, límite 90.112.
- **Textos:** en `FILTER_LABELS`, reutilizando `filters` y `clearAll` de `defaultStrings` (no se añade nada a `defaultStrings`).

## BackgroundOverlay, ScreenMockup, LaptopMockup y PhoneMockup (10.4)

Nodos: `Background overlay` `4896:411056`, `Screen mockup 3:2` `1293:158480`, `Modern screen mockup` `8268:120483`, `Macbook Pro mockup` `1316:213` e `iPhone mockup` `1869:445841`. Los cuatro, en «Fondos y maquetas» (catálogo 108 → 112), con página, ficha, ejemplo (`examples/devices.tsx`, aparte porque lleva gráficas), muestra, fragmento, límite y capturas.

- **Contenido de ejemplo:** un panel hecho con `MetricCard`, `LineChart` y `Button`, pintado a 1200 (o 375 en móvil) y encogido con `ScaledPreview`; sin fotos.
- **Accesibilidad:** el marco es siempre decorativo (`aria-hidden`); con `src` y `alt`, la imagen es lo único que se anuncia (test con los cuatro).
- **`BackgroundOverlay`:** `bg-overlay/70` y `backdrop-blur-[8px]`; el degradado del Figma (máscara del 50 % al 100 % sobre el 70 %) es `from-overlay/35 to-overlay/70`, sin colores crudos. 9,1 kB, límite 10.240.
- **`ScreenMockup`:** un componente con `variant` `3-2` (seis anchos máximos, filo de 4 px `bg-primary-solid` encima de la pantalla y sombra `shadow-2xl` detrás) y `modern` (`desktop` 3:2 y `mobile` 355/773, tres capas). 9,5 kB, límite 11.264.
- **`PhoneMockup`:** el marco son los vectores del Figma (13 kB: borde, banda, fondo con el hueco de la pantalla, botones, antenas, cámara, altavoz) en un SVG encima de la pantalla; la barra de estado y el indicador de inicio pasan a `currentColor` con `text-primary` para verse en oscuro. 14,3 kB, límite 16.384.
- **`LaptopMockup`:** el MacBook del Figma es un mapa de bits (981 kB como SVG): se dibuja en SVG con sus medidas (tapa, filo, cámara, rótulo, base de aluminio en degradado y sombra) y la pantalla en la caja del Figma. Ids de los `defs` con `useId` para que dos portátiles no los repitan. 9,9 kB, límite 11.264.
- **Colores del dispositivo:** `internal/device-frames.ts` (generado) entra en las excepciones de `check-colors`, como `CreditCard` y `BrowserFrame`.
- **Un fichero por componente:** la primera versión los tenía juntos en `Mockups.tsx` y la web (que lee las props de `components/<Nombre>.tsx`) y `check:size` fallaban; se separan, con `internal/mockup-screen.tsx` para lo común. Ojo: `turbo build` no borra `dist`, y el `Mockups.js` viejo hacía fallar `check:size`.
- **Muestras:** dentro de un contenedor sin ancho, `w-full` deja la maqueta a 0; las muestras llevan un `div` con el ancho.

## Cierre del grupo 10

E2E completo de docs: 1.043 pasan; fallaron el de `CopyTooltip` (de carga, conocido) y el de accesibilidad de `/components/color-picker-dropdown/` en los dos temas: `label-content-name-mismatch`, porque los disparadores con texto visible llevaban `aria-label` («Color: #7F56D9») que no contenía el texto («Color», «7F56D9 100%»). Ahora el valor va en `sr-only` junto al texto visible; solo las muestras sin texto llevan `aria-label`. Repetido: pasa.

## Grupo «Web de marketing» y MarketingNav (11.1 y 11.2)

Nodos: `Dropdown header navigation` `1288:26576` y `Full-width header navigation` `1287:2392`. El grupo nuevo «Web de marketing» (catálogo 112 → 113; test de catálogo de 11 a 12 grupos, y los vecinos: `AppIcon` ya no es el último de Componentes) empieza con `MarketingNav`, que no puede ir antes porque el catálogo no admite grupos vacíos. Página interactiva, ficha, ejemplo (`examples/marketing.tsx`), muestra, fragmento, límite, capturas y e2e de teclado (`marketing-nav.spec.ts`, escritorio a 1440 con `full-width` y móvil a 390).

- **Tipos:** catorce disposiciones (`type`, siete desplegables y siete a todo el ancho) y `floating` cubren los veinte tipos del Figma (seis de ellos son «Floating …»). El tipo da el ancho del desplegable (336, 640, 768 u 800) y si la columna aparte va a la izquierda (`blog-posts-with-sidebar`); las columnas se reparten a partes iguales.
- **Paneles:** `panel` {`columns`, `header`, `aside`, `footer`} con nodos, como pide design.md. Las plantillas se exportan en el objeto `NavMenu` (`NavMenu.Section`, `NavMenu.Item`, `NavMenu.Card`) y no como `NavMenuItem`/`NavMenuCard` sueltos: el test de catálogo cuenta como componente cada función exportada con nombre en mayúscula (mismo criterio que `SidebarCards`).
- **Menús:** `DialogTrigger` + `Popover` de React Aria; a todo el ancho, el popover toma la cabecera como `triggerRef` y su ancho (`--trigger-width`). Escape cierra y devuelve el foco al botón. El menú móvil es otro popover bajo la cabecera, con cada apartado desplegable en una caja (`aria-expanded`), los enlaces del pie en dos columnas y las acciones a todo el ancho. Escritorio o móvil por consulta de contenedor (`@5xl`), como `HeaderNav`.
- **Vista previa:** `previewItem` pinta un menú en línea, sin popover ni foco (como `MultiSelect defaultOpen`), para las capturas, que son estáticas; el ejemplo pinta las cabeceras a 1280 en `ScaledPreview` para que se vea el escritorio en la captura de 800.
- **Peso:** 58,1 kB, límite 61.440. `/components/*/` de `js-budget` pasa de 365 a 370 (Tabs 365,5 kB); el playground por página sigue pendiente (el paquete solo exporta `.`).

## Footer (11.3)

Nodo: `Footer` `1517:334473`. En «Web de marketing» (catálogo 113 → 114), con página, ficha, ejemplo (`marketing.tsx`: los veinte tipos a 1280 encogidos, el tema de marca y el móvil a 375), muestra, fragmento, límite, capturas y e2e (`footer.spec.ts`: a 375 px las columnas van de dos en dos).

- **API:** piezas (`brand`, `description`, `extra`, `columns`, `links`, `cta`, `aside`, `copyright`, `legal`, `social`) y `type`; una tabla `LAYOUT` dice qué pone cada tipo grande y dónde (llamada centrada, a los lados, boletín o en banda; marca al lado o centrada; columnas o fila; bloque de la derecha; pie con marca, redes, legales, formulario o lema; pie en banda). Los cuatro pequeños son una línea. Lo que un tipo no usa no se pinta, así un mismo juego de props sirve para los veinte (el ejemplo lo hace).
- **Temas:** `brand` con `bg-brand-section`, textos `*_on-brand`, `border-brand_alt` y bandas `bg-brand-section_subtle` (en oscuro, `bg-brand-section` es `#171717` por token).
- **Móvil:** consulta de contenedor (`@3xl`, 768): columnas de dos en dos, bloques apilados, márgenes de 16.
- **Sin `aria-label`:** Biome no lo admite en `footer`; el elemento ya es la región de información de contenido.
- **Peso:** 10,7 kB, límite 12.288.

## BlogPostCard y SubscribeCard (11.4)

Nodos: `Blog post card` `1390:58` y `Blog subscribe card` `1391:213014`. En «Web de marketing» (catálogo 114 → 116), con página, ficha, ejemplo (`marketing.tsx`, portadas de color sin fotos), muestra, fragmento, límite y capturas.

- **`BlogPostCard`:** `type` `simple-01…04` (portada suelta con radio 16) y `card-01…04` (tarjeta con borde y portada a sangre); las cuatro cabeceras: categoría, `BadgeGroup` con tiempo de lectura, autor y fecha con etiquetas, y autor y categoría sobre la portada con «Leer la entrada». `orientation` `horizontal` se pone en fila desde 576 px de contenedor (`@xl`) y en vertical por debajo, como el Figma en móvil. Un solo enlace por tarjeta: el del título, con su área extendida a toda la tarjeta. La banda sobre la portada de `04` es `bg-overlay/60` con desenfoque (con el 30 % el texto blanco no daba contraste sobre una portada clara: lo vio axe en la web). 28,7 kB, límite 31.744.
- **`SubscribeCard`:** formulario con `type="email"` obligatorio, etiqueta para lectores y la nota de privacidad como descripción; `onSubscribe(email)`. `line` lleva el sobre y la raya de 4 px de marca arriba. Campo nativo con las clases de los campos (el `Input` completo pesa 65 kB). 24,4 kB, límite 26.624.

## PricingCard y JobPostCard (11.5)

Nodos: `_Pricing tier card` `1346:182709` y `_Job post` `1506:244681`. En «Web de marketing» (catálogo 116 → 118), con página, ficha, ejemplo (`marketing.tsx`), muestra, fragmento, límite y capturas.

- **`PricingCard`:** los diez tipos con las mismas piezas (`name`, `price`/`period`, `description`, `badge`, `icon`, `features`, `featuresTitle`/`featuresDescription`, `actions`, `banner`, `callout`); el tipo decide el orden, si los botones van antes o después de la lista, el pie gris (`icon`), la banda (`banner`), el icono sobre el borde (`icon-offset`), la lista en dos columnas desde 480 px de contenedor (`dual-check-items`) y el estilo de los checks (`CheckItem` tintado, de contorno o lleno, en marca o éxito, como el Figma). La nota de `call-out` (en el Figma, una flecha manuscrita) es un texto de marca encima, sin la flecha. Los `primary-*` van sobre `bg-brand-primary_alt`: con `bg-brand-primary`, en oscuro el fondo era morado vivo y el texto no se leía (se vio en la captura). 27,9 kB, límite 30.720.
- **`JobPostCard`:** `simple`, `card-01` y `card-02`; un solo enlace (el puesto) con el área en toda la tarjeta; lugar, jornada y sueldo con sus iconos (`marker-pin-01` y `currency-dollar-circle` del set completo, no del núcleo); en estrecho (`@md`) las etiquetas bajan bajo el título. 26,3 kB, límite 28.672.

## Accordion y TeamMemberCard (11.6)

Nodos: `_FAQ item` `1358:191490` y `_Team member` `1458:240598`. En «Web de marketing» (catálogo 118 → 120), con página, ficha, ejemplo, muestra, fragmento, límite y capturas.

- **`Accordion`:** cada pregunta es un encabezado (`headingLevel`, 3) con un botón `aria-expanded`/`aria-controls` y la respuesta en una región con el nombre de la pregunta (`hidden` si está cerrada). `single`, `iconPosition` (`left`/`right`, más/menos en círculo del set completo), `divider`, controlado o no. Teclado: Enter y Espacio (botón nativo), flechas arriba y abajo con vuelta, Inicio y Fin. 10,4 kB, límite 12.288.
- **`TeamMemberCard`:** siete tipos; `image-left` en fila desde 512 px de contenedor. El panel de cristal del Figma es blanco translúcido con texto blanco: sin contraste sobre una foto clara (axe lo marcó con el ejemplo); aquí es `bg-overlay/60` con desenfoque, con borde `fg-white` al 30 % (sin colores crudos). 26,7 kB, límite 29.696.
- **`Avatar`:** llegó justo a su límite (26,0 kB de 26.624) sin cambios propios, por lo que comparte; sube a 27.136.

## Testimonial y arrowStyle de Carousel (11.7)

Nodos: `_Quote image bottom panel` `1376:1163` y `_Testimonial carousel arrow` `1374:440`. `Testimonial` en «Web de marketing» (catálogo 120 → 121), con página, ficha, ejemplo (con un `Carousel` de testimonios con `arrowStyle="button-arrow"`), muestra, fragmento, límite y captura.

- **`Testimonial`:** `figure` con la cita en `blockquote` y la persona en `figcaption`; panel de cristal `floating` o `full-width`, `md`/`sm`, estrellas con `Rating color="white"` (color nuevo de `Rating`, `fg-white`), flechas solo con `onPrevious`/`onNext`. Como en `TeamMemberCard`, el cristal es `bg-overlay/60` (el blanco translúcido del Figma no da contraste). 23,4 kB, límite 25.600.
- **`Carousel`:** `arrowStyle` `button-chevron` (la de siempre), `button-arrow` (flecha en el círculo) y `arrow` (flecha larga del set completo, sin círculo); sin la prop, el HTML es el mismo (test con `renderToStaticMarkup`). Su ejemplo no cambia, así que su captura no se vuelve a aprobar; la ficha nombra la prop.

## Cierre del grupo 11

E2E completo de docs: 1.099 pasan; fallaron el de `CopyTooltip` (de carga, conocido) y el de `color-picker-dropdown.spec.ts`: desde el arreglo del cierre del grupo 10, el nombre del botón es el texto visible más el valor en `sr-only`, y Chromium lo junta con otro espacio («Color : #7F56D9»); el localizador exacto ya no lo encontraba. Pasa a una expresión regular. Repetido: pasa.

## Composiciones de Modal (12.1)

Nodo: `Modal` `4057:415205`. Página `/components/modal/composiciones/`, enlazada desde la de `Modal` (sección «Composiciones»).

- **51 tipos, no 49.** La propiedad `Type` del conjunto tiene 51 valores en escritorio (la spec y la tarea decían 49). Vale el Figma: hay 51 composiciones y el test (`test/compositions.test.ts`) guarda la lista tal cual.
- **Registro.** `src/visual/compositions.ts` (sin React): nombre, componente, tipo del Figma, título en castellano, alto y `composition: true`. Las composiciones entran en `visualExamples`, `EXAMPLE_FILES` y `CARD_HEIGHTS`, así que tienen su `/visual/<nombre>/`, su captura aprobada (claro y oscuro, 800 px como los demás) y su paridad en `visual.spec.ts`; no son componentes del catálogo ni se exportan. Tests: la lista frente a los tipos del Figma, alto = lienzo + 32 px, nombres y títulos únicos, y el código copiable.
- **Código copiable.** `src/lib/composition-code.ts` saca del fichero de ejemplos (`modal-compositions.tsx`) la función de la composición, los ayudantes que usa (`cancelar`, `Dibujo`, `MensajeNuevo`…) y solo los imports que necesita; quita el lienzo de la web y `contained`. Los imports son de `@jotis-me/react` y, para los iconos del set completo y los logos sociales, de `@jotis-me/icons` (también Regula: el escenario de la spec dice «solo `@jotis-me/react`»; los iconos que no están en el núcleo no se pueden pintar con `Icon name`).
- **`Modal` crece** (sin las props nuevas, el HTML es el mismo; test con `renderToStaticMarkup`): `align="center"` (cabecera centrada en apilado), `media` (imagen, carrusel o vídeo sobre la cabecera), `footerStart` (a la izquierda del pie: «No volver a mostrar», «¿Necesitas ayuda?», «Copiar enlace») y `dividers` (rayas bajo la cabecera y sobre el pie; sin contenido, solo la de la cabecera). Con todo eso los 51 tipos se montan sin piezas propias.
- **Diferencias con el Figma.** Las fotos son degradados con formas (sin imágenes); el QR es un dibujo fijo; los modales con imagen arriba (`Payment details with image`, `User settings`) van sin la X para que no tape la imagen; los iconos destacados `modern` pintan el glifo en gris (el Figma lo tinta en verde o rojo en los horizontales); `Banner appearance` y `Appearance settings` llevan la vista previa a la izquierda de cada opción (la `media` de `RadioGroup`), no encima; en oscuro las tres vistas previas del tema se ven iguales porque usan tokens.
- **JS.** La página carga las 51 en una isla (`client:visible`, un solo trozo) y `CodeSnippet`: 287,1 kB, límite propio 316. Las props nuevas de `Modal` y el reparto de trozos con `modal-compositions` suben Tabs a 371,5 kB y las `/visual/` de formularios a 275,7: límites 375 y 280.

## Composiciones de Slideout (12.2)

Nodo: `Slide out menu` `1240:137582`, 23 tipos (en escritorio y móvil). Página `/components/slideout/composiciones/`, con la misma infraestructura de 12.1 (`compositions.ts`, `slideout-compositions.tsx`, test con la lista del Figma, capturas y paridad).

- **`Slideout` crece** (sin las props nuevas, el HTML es el mismo; test con `renderToStaticMarkup`): `icon` (icono destacado `modern` gris junto al título) y `footerStart` (a la izquierda del pie, frente a los botones).
- **Diferencias con el Figma.** Sin fotos (iniciales y degradados); `Calendar event` lleva la fecha como icono del título; los menús de permisos de `Share project` son `Select` pequeños (el Figma enseña uno abierto); la conversación del asistente usa `Message` y la barra «Cancelar · Sí, cámbialo» es texto; `Integration` dibuja los dos logos como avatares con iniciales. El panel mide 440 px como el del Figma; en las capturas sale a la derecha de un lienzo de 800.
- **Móvil.** Los tipos móviles del Figma son los mismos paneles a 375 px: el panel ocupa el ancho disponible (`w-full`, `max-w` 440), así que en una app a 375 px es el tipo móvil. En la página, cada composición va en una caja de 640 px como mínimo que se desplaza en móvil; las capturas aprobadas son las de 800 px, como las de los demás ejemplos.
- **JS.** Página 262,9 kB, límite propio 290; Tabs 375,7 kB, límite de `/components/*/` a 380.

## Composición del Color picker modal (12.3)

Nodo: `Color picker modal` `12427:142023`, con `Breakpoint` `Desktop` y `Mobile`. Dos composiciones (`ColorPickerModal` y `ColorPickerModalMobile`, en `color-picker-compositions.tsx`) en una sección «Composiciones» de la página de `ColorPicker`, como pide el diseño (D7): con dos o menos, `ComponentPage` las pinta en la página con su código (`INLINE_COMPOSITIONS`); con más, enlaza a su página propia. Mismo registro, test con los dos `Breakpoint`, capturas y paridad.

- **Montaje.** `BackgroundOverlay` con desenfoque y, encima, un `role="dialog"` con el `ColorPicker` `palette` (opacidad, campo hex y guardados), como el Figma; el de móvil es el mismo en un marco de 375 px. Sin `Modal` porque el del Figma no tiene título ni pie: en una app, el diálogo necesita además atrapar el foco (`Modal`, o el popover de `ColorPickerDropdown`).
- **JS.** Va en el límite de `/components/*/` (la página de `ColorPicker` ya cargaba el selector).

## Recorrido de cobertura (13.1)

Hecho el 11 de noviembre de 2026 leyendo con `use_figma` (solo lectura) cada conjunto de componentes de las páginas de Base components, Application components y Shared assets, con todas sus propiedades de variante (sin los estados `State`/`Hover`/`Focus`, que son interacción). Las piezas de marketing, iconos, logos y recursos se leyeron nodo a nodo en sus grupos (1 y 11). Las piezas internas («_») se cubren dentro de su padre. `Breakpoint=Mobile` se cubre siempre con diseño adaptable (container queries o ancho disponible), no con props.

| Figma (propiedades) | Dónde se cubre |
| --- | --- |
| Avatar (Size xs–2xl, Border, Placeholder icon/text) · Status icon (Offline, Online, Avatar, Verified tick, Count) · Avatar add button · Avatar image | `Avatar` `size`, `border`, iniciales/icono, `status`, `badge` (`verified`, `count`, `company`); `AvatarGroup` `onAdd` (2.1) |
| Avatar label group (sm–lg) · Avatar group (xs–md) · Avatar profile photo (Placeholder, Text, sm–lg) | `AvatarLabel`, `AvatarGroup`, `AvatarProfilePhoto` (2.1, 9.1) |
| Badge (Size, Type pill/badge/modern, Icon: punto, país, X, avatar, icono delante/detrás/solo, 12 colores) · Badge group · Badge close X | `Badge` `size`, `type`, `dot`, `flag`, `onRemove`, `avatar`, iconos, `color`; `BadgeGroup` (2.2) |
| Button (xs–xl, 5 jerarquías, solo icono) · destructivo · utility · loading · close X (fondo oscuro) | `Button` (`size`, `hierarchy`, `iconOnly`, `destructive`, `loading`), `ButtonUtility`, `CloseButton` (3.1) |
| Social button (6 redes, texto, 3 temas) · Social button group · Mobile app store badge (5 tiendas, 2 estilos) | `SocialButton`, `SocialButtonGroup`, `AppStoreBadge` (9.4, 9.5) |
| Button group (sm/md, icono delante/solo/punto) | `ButtonGroup` items `icon`, `iconOnly`, `dot`, `size` (3.1) |
| Checkbox (Checked, Indeterminate, sm/md, Checkbox/Radio, Text) | `Checkbox` (`indeterminate`, `size`, `label`/`hint`), `Radio` |
| Dropdown menu (14 tipos, Open) y sus piezas · Context menu (Simple/Advanced) | `Dropdown` (disparadores y `variant` `integrations`, `account-*`), `ContextMenu` (4.1) |
| Input field (sm–lg, 14 tipos, destructivo) · Verification code (sm–lg, 4/6) · Textarea (sm/md, Default/Tags inner/outer) | `Input` (`prefix`, desplegables, `type="card"`, `trailingButton`, `revealable`, `datetime-local`, `file`), `TagInput`, `NumberInput` (`orientation`), `VerificationCodeInput` (`digits`, `size`), `Textarea` (`tags`, `tagPlacement`, **`size` añadido en 13.1**) (4.2) |
| Progress bar (11 valores, 5 etiquetas) · Progress circle (xxs–lg, Circle/Half) | `ProgressBar` `label`, `ProgressCircle` `size`/`shape` (4.3) |
| Radio group (sm/md, 6 tipos) e item | `RadioGroup` `appearance`/`indicator`, opciones con `icon`, `avatar`, `paymentIcon`, `media` (4.4) |
| Select (sm–lg, 6 tipos) · Multi-select · items | `Select` (icono, avatar, punto, búsqueda, etiquetas), `MultiSelect` (4.4) |
| Slider (etiqueta, controles) · Control handle (texto, tooltip) | `Slider` (rango, `label` `bottom`/`top-floating`) (4.3) |
| Tag (sm–lg, país/avatar/punto, X/texto/contador, casilla) | `Tag` `size`, `flag`, `avatar`, `dot`, `onRemove`, `count`, `checkable` (2.3) |
| Text editor (Default/Floating toolbar, sm/md), barra, tooltip, 16 iconos | `TextEditor` `toolbar`, `size` (4.5) |
| Toggle (Default/Slim, sm/md, Text) | `Toggle` `variant`, `size`, `label`/`hint` |
| Tooltip (texto de apoyo, 7 flechas) · Help icon (7 posiciones) | `Tooltip` y `HelpIcon` `placement` + `arrow` |
| Video player 16:9 (sm–lg, Playing) y sus piezas | `VideoPlayer` `size` (5.1) |
| Activity feed (4 divisores, 2 tipos) · Feed item (sm/md, Labels/File/Text, conector) | `ActivityFeed` `divider`, `type`, `size`, `supporting` (5.1) |
| Alert (6 colores, Floating/Full-width) · Notification (9 tipos) | `Alert` `color`/`variant`; `Notification` (5.1) |
| Sidebar navigation (5 tipos, Open) · featured card (13) · account card · Header navigation (4 tipos, Mobile open) | `SidebarNav` (`type`, `featured` con `SidebarCards`, `account`), `HeaderNav` `type` (5.2) |
| Breadcrumbs (Chevron/Slash, 4 tipos) | `Breadcrumbs` `divider`, `type` (5.3) |
| Calendar (Month/Week/Day), celdas, eventos (9 colores), marcador de hora | `CalendarView` (6.1) |
| Card header (Avatar) · Section header (Tabs, 3 tipos) · Section label (sm/md, Actions) · Section footer (Section/Card, botones) · Page header (6 estilos) | `CardHeader` `avatar`, `SectionHeader`, `SectionLabel`, `SectionFooter` `card`, `PageHeader` (7.3) |
| Line and bar chart (leyenda, ejes, Line/Bar) · Activity gauge (xs–lg, leyenda) · Pie chart (xxs–lg, hueco 0–75 %, leyenda) · Radar chart · Chart marker | `LineChart`/`BarChart` `legend` y `marker`, `ActivityGauge`, `PieChart` (`size` en px, `hole` de 0 a 1, `legend`), `RadarChart`, `ChartMarker` (6.2, 10.1) |
| Code snippet (Horizontal/Vertical/con pestañas) | `CodeSnippet` `variant`, `tabs` (3.2) |
| Color picker (12 tipos) · Color inputs (6 modelos) · Color picker dropdown (6) · Color picker modal | `ColorPicker` `type`/`model`, `ColorPickerDropdown`, composición (6.3, 10.2, 12.3) |
| Command bar (6 tipos, texto apilado) e items | `CommandMenu` (grupos, `icon` con avatar o punto, `description`, `shortcut`, `emptyText`) |
| Content divider (6 tipos, 3 estilos) | `ContentDivider` (7.1) |
| Date picker dropdown/modal (Dual, Single, Available times) | `DatePicker` (6.2) |
| Empty state (8 iconos, sm–lg) · Illustration (4 estilos) | `EmptyState` `media`, `illustration`, `size` |
| File upload (cola, barra/relleno) e item (icono de tipo/simple) | `FileUpload` `progressStyle`, `fileIcon` (7.1) |
| Filters bar (8 tipos) · Filters dropdown menu · slideout | `FilterBar`, `FilterMenu`, `FilterPanel` (7.5, 10.3) |
| Inline CTA (7 tipos) | `InlineCTA` `type` (7.1) |
| Loading indicator (3 estilos, sm–xl) | `Spinner` `variant`, `size` |
| Message (9 tipos, enviado, panel de acciones), reacción, estado · Message action (3) | `Message`, `MessageInput` `variant` (7.2) |
| Metric item (9 tipos, acciones) · Chart mini · Change | `MetricCard` (7.3) |
| Modal (51 tipos) · Slide out menu (23 tipos) | composiciones (12.1, 12.2); `Modal` `align`/`media`/`footerStart`/`dividers`, `Slideout` `icon`/`footerStart` |
| Pagination (10 tipos, 2 formas) · dot group (md/lg, Dot/Line, Framed) · Carousel image/arrow | `Pagination` `type` + `align`, `shape`; `PaginationDots`; `Carousel` `arrowStyle` (5.3, 11.7) |
| Progress steps (5 conjuntos, Check/Number/Featured, sm/md) | `ProgressSteps` `type`, `marker`, `size`, `orientation` |
| Table (4 ejemplos, divisores o franjas) · cell (15 tipos) · header cell · lead action | `Table` (7.4) |
| Tabs horizontales (5 tipos, ancho completo) y verticales (5 tipos) | `Tabs` `type`, `fullWidth`, `orientation` (3.2) |
| Tree view (Simple/Advanced, sm/md) | `TreeView` (7.5) |
| Background pattern (5 tipos, sm/md) · decorative (círculos, cuadrados, sm–lg) · mask (5) · Background overlay (3, desenfoque) | `BackgroundPattern` `pattern`/`size`/`mask`, `BackgroundOverlay` (8.1, 10.4) |
| Banner (5 tipos, 2 temas, Floating/Full-width) | `Banner` (`email`, `actions`, `slim`, `countdown`, `theme`, `layout`) |
| Credit card (13 temas) · Browser toolbar (3, 2 temas) · Screen mockup 3:2 (xs–2xl) · Modern screen mockup · MacBook · iPhone | `CreditCard`, `BrowserFrame`, `ScreenMockup` `variant`/`size`, `LaptopMockup`, `PhoneMockup` (8.1, 10.4) |
| Line pattern (4) · trazos a mano (flechas, subrayados, acentos, garabatos) | `@jotis-me/icons/patterns` y los trazos de `@jotis-me/icons` (ya existían) |
| Featured icon · Check icon · Check item · Star icon · Ratings badge | `FeaturedIcon`, `CheckIcon`, `CheckItem`, `Rating`, `RatingBadge` (8.1, 9.2, 9.3) |
| Navegación, pie y tarjetas de marketing (Header navigation, Footer, Blog, Pricing, FAQ, Team member, Testimonial, Job post) | grupo 11 |
| Iconos (19 categorías), banderas, pagos, archivos, carpetas, cursores, logos sociales, de integración y de apps | grupo 1 y `@jotis-me/icons` |

**Lo que faltaba.** Solo `Textarea` `Size` (`sm`): en 4.2 se dejó fuera porque la spec no lo pedía, pero el requisito «Cobertura del Figma» pide cada valor. Vuelve a su grupo (4.2) y se hace aquí: `size="sm"` con texto de 14 px, pista de 12, relleno de 12 y caja de 110 px; sin la prop, el HTML no cambia (test). Ejemplo, ficha y captura de `Textarea` actualizados.

**Fuera, por decisión del alcance:** las secciones de página (de marketing y el `Section divider`), las pantallas (Log in, Sign up, 404, Email templates), los logos de empresa y de prensa, las páginas de ejemplos y Utility.
