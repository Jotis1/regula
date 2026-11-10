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
