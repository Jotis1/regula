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
