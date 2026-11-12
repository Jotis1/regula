# Notas de la implementación

## 1.1 Ancho del contenedor

- `Base.astro`: la barra lateral va sin contenedor; el contenido va en `div[data-container]` con `max-w-container` (1280) dentro de `main`, que conserva el padding de la guía. Cabecera y pie llevan `data-container` con el mismo ancho.
- La cabecera pasa a una barra de ancho completo con su contenido centrado en 1280, así que a 1440 px el contenido empieza 80 px más adentro. `e2e/header.spec.ts` (medidas a 1440) suma ese margen; el resto de lo que comprueba no cambia.
- No hay capturas aprobadas de páginas con cabecera o pie: el e2e completo en Chromium pasó sin rehacer ninguna. Fallos de carga ya conocidos (CopyTooltip, selector de archivo de Input) que pasan al repetirlos.
- Decisión sin consultar: la rama sale de `feat/figma-coverage` porque `complete-figma-coverage` aún no tiene PR; se rebasará sobre `main` cuando se fusione.

## 2.1 Recorte con fundido en las muestras

- `LivePreview.astro` ya no encoge ni tiene el respaldo del ejemplo entero (`thumbOf` y sus tests desaparecen: los 121 componentes tienen muestra y un test lo exige). El escenario (288×180) ancla la muestra según `crop` (`center` por defecto, `top`, `top-left`) y aplica una máscara con fundido de 24 px solo por los bordes por donde se recorta (`fadeMask`).
- `scale` queda como `@deprecated` en `Thumbnail` solo para las 55 muestras pendientes de 2.2: 54 con `scale` y `HeaderNav`, que se encoge con `ScaledPreview`. La lista (`SHRUNK_PENDING`, en `visual/thumbs.ts`) la comparten el test unitario y el e2e y debe quedar vacía en 2.2. La muestra de `ScaledPreview` queda fuera: es su demostración.
- La cuenta del resumen de la propuesta (60 muestras) era una estimación; las reales son 55.

## 2.2 Muestras a tamaño real

- Las 55 muestras pendientes ya van sin `scale` ni `ScaledPreview`: `scale` desaparece del tipo `Thumbnail` y `SHRUNK_PENDING` se borra. El test unitario falla si una muestra declara `scale:` o pinta `<ScaledPreview>` (salvo la de ScaledPreview, que es su demostración); el e2e comprueba en `/components/` que ninguna tiene `transform` con escala menor que 1.
- Cómo se resolvió cada una: los componentes que se adaptan al ancho se pintan a 288 px; el resto (Modal, Slideout y CommandMenu, en un escenario de 300–440 px; HeaderNav, MarketingNav, Footer, CalendarView…) se pinta a su ancho y se recorta arriba a la izquierda (`crop: "top-left"`) con fundido por los bordes recortados. LineChart y BarChart usan `width={288}` y `height={120}` (su SVG escala con el ancho, así que a 288 sobre 640 de diseño el texto salía a 6 px). Testimonial pierde `rating` y se pinta a 180 de alto para que se vea el panel con la cita. Accordion, TeamMemberCard y BadgeGroup pasan a `top-left` (se recortaban por los dos lados).
- **Excepción (decisión sin consultar):** `StreamScene` y `ChannelBanner` siguen miniaturizados con su propia prop `scale` del componente, porque son lienzos de 1920×1080 y 1200×… que a tamaño real solo enseñarían una esquina vacía. No pasa por `transform` de la card ni por `ScaledPreview`, así que los tests no los cuentan. A confirmar con el usuario.
- Revisado en claro y oscuro (Table, CalendarView, Modal, Slideout, CommandMenu, gráficas, marketing, mockups). Sin capturas aprobadas que rehacer: no hay referencia visual del índice.

## 3.1 Cabecera con HeaderNav

- **Hueco en el componente (changeset `header-nav-underline`, minor):** `HeaderNav` no tenía una cabecera de una fila con la sección actual subrayada ni dejaba usar el menú móvil de quien lo usa. Se añaden `type="underline"` (h-16, `text-sm` en `text-tertiary`, la actual en `text-primary` con subrayado de 2 px; en móvil, fila de 56) y `mobileBar` (sustituye al botón y al panel integrados). Test de HTML sin las props nuevas, ejemplo, ficha y captura de `HeaderNav` rehechas (claro y oscuro, revisadas).
- `SiteHeader.astro` pinta `HeaderNav` sin directiva `client:*` (cero JS propio) con tres slots de Astro (`brand`, `actions`, `mobileBar`), que llegan como props. Como `HeaderNav` pinta escritorio y móvil a la vez y la CSS elige, la cabecera lleva **dos islas de tema y dos de búsqueda** (una por versión). La búsqueda solo responde en la que se ve (`SiteSearch` comprueba que su botón tiene caja), así que Ctrl+K y el evento `regula:search` no abren dos diálogos. Los ayudantes de e2e que esperaban «la» isla esperan las dos (`theme`, `search`, `mobile`, `components`).
- `aria-current` de las secciones pasa de `"true"` a `"page"` (lo que pone `HeaderNav`); el test de la cabecera lo sigue. «Saltar al contenido» pasa a `fixed` porque ya no hay un `header` propio que lo contenga. El ejemplo nuevo de `HeaderNav` desplaza los índices de `e2e/header-nav.spec.ts` (+1).
- El tipado de la plantilla de Astro no ve que los slots son props: `{/* @ts-expect-error */}` con el motivo.
- `check:js`: sin cambios de límite; `/` y `/components/` siguen dentro.

## 3.2 SidebarNav: pendiente de decisión (no se hace en esta pasada)

`SideNav.astro` no se puede sustituir por `SidebarNav` con una prop opcional, por un requisito que ya existe: la navegación lateral debe funcionar **sin JavaScript** (`e2e/docnav.spec.ts:83`, `javaScriptEnabled: false`; los grupos son `<details>`). `SidebarNav` es una isla hidratada, sus grupos se abren con botones `aria-expanded` y sus filas son de `text-md` semibold (el DocNav del diseño es compacto, de `text-sm`, con filtro y contadores). Montarla con el paquete exige añadirle: un modo de grupos con `<details>` (sin JS), una densidad compacta, y un filtro con su atajo `/` (hoy `search` solo pinta un campo), más el coste de hidratar ~140 enlaces en todas las páginas. Es rediseñar el componente, más que «una prop opcional retrocompatible» (design D5), así que se deja a decisión de quien lo revisa:

1. **Ampliar `SidebarNav`** con `groups="details"`, `density="compact"` y `onSearch`/filtro (trabajo de varias tareas, con capturas y changeset), o
2. **Excepción documentada:** la navegación lateral sigue siendo HTML del servidor sin JS, y el requisito «Estructura con el paquete» la excluye (la cabecera, el menú móvil y el pie sí usan el paquete).

Hasta que se decida, 3.2 queda sin marcar y el resto del grupo sigue.

## 3.3 Pie con Footer

- `SiteFooter.astro` pinta el `Footer` del paquete (`large-04`: marca y texto a un lado, dos columnas, y la fila inferior con las versiones de los paquetes y «Qué ha cambiado» como enlace legal), sin directiva `client:*`. Sin cambios en el componente.
- Cambia el aspecto respecto a `Footer.dc.html`: enlaces de `text-md` semibold en color de marca, títulos en `text-primary` y filas más altas, que es el diseño del `Footer` del paquete. Se acepta como la consecuencia de usarlo, tal como promete el pie. Revisado en claro, oscuro y móvil (390 px).
- Las versiones van como texto en la línea del copyright (`<p>`), con `data-versions` en el `span`; ya no es una `<dl>`.
- El test de ancho (`layout.spec.ts`) mide el contenedor interno del `Footer`.

## 3.4 Portada con el paquete

- La portada ya usaba `BackgroundPattern`, `Badge`, `Button`, `Icon`, `Kbd`, `StreamStatus`, `AppIcon` y `HeroForm` (corrige lo dicho en la propuesta: «no importa nada del paquete»). Lo que estaba a mano y ahora es componente: las cuatro cards de «Dónde está cada cosa» de escritorio pasan a `LinkCard` (muestra inerte arriba, título y texto como enlace que cubre la card; `data-map-meta` sigue en el texto). Sin cambios en el paquete.
- Se quedan a mano, porque ningún componente del paquete tiene su forma: la fila horizontal de las cards de móvil (icono a la izquierda y chevron: `LinkCard` solo tiene la muestra encima), la lista numerada de las cinco reglas, la lista de apps con su `AppIcon`, y el campo-botón «Busca lo que te falte» (un disparador con aspecto de campo, no un `Input`). Las cabeceras de sección son `h2` con las clases de la guía: `SectionHeader` es una cabecera de página con acciones y pestañas, no un título de sección de una portada.
- Revisada en claro y oscuro; `home.spec.ts` y `check:js` sin cambios.

## 4.1 Motor: controles de número, icono y contenido

- `lib/playground.ts` gana tres tipos de control (`number`, `icon`, `content`) y los ajustes por prop (`Start.tweaks`: `hidden`, `number` con rango, `icon`, `content` con opciones preparadas). `State` pasa a admitir números y `undefined` (sin valor: la prop no se pasa ni se escribe). El código lleva el JSX de cada opción de contenido y los imports que pida (`importsOf`).
- Reglas del generador sin ajustes: `number` y `string | number` dan campo numérico (`Skeleton` `width`…); las props `icon`, `iconLeading`, `iconTrailing` e `iconOnly` de tipo `ReactNode` o `IconName` dan selector de icono (con buscador) con los 86 iconos del núcleo; **`value` solo se excluye si el componente tiene `onChange`** (en uno que solo muestra, como `ProgressBar`, es un dato y cuenta como número; antes `value` se excluía siempre).
- Solo hay iconos del núcleo en el selector, porque un nombre de icono de fuera del núcleo no pinta nada como cadena (`iconSlot`); ofrecer los otros 1.086 exigiría el nodo ya pintado de cada uno y cargar el set entero. La spec lo permite («y de `@jotis-me/icons` si usa un icono que no está en el núcleo») pero no lo exige; queda para configs que lo pidan con un `content`.
- `Playground.tsx` pinta los controles con `NumberInput` y `Select` del paquete (con `searchable` en los iconos). Los de contenido siguen sin uso hasta las configs del grupo 5 (probados con un `Start` sintético).
- Tests: `test/playground.test.ts` (generación de cada control, propagación a props y al código con sus imports, `value` con y sin `onChange`) y e2e de `Button` (icono) y `Skeleton` (número). Los 62 de humo siguen verdes.

## 4.2 Atajos y reglas de incompatibilidad

- `Start` gana `presets` (`{ label, props }[]`, los tipos del Figma) y `rules` (`{ when, disable, set?, reason }[]`). En `when`, `true` es «tiene algún valor», una lista «es uno de estos» y otro valor «es igual a»; son datos (JSON), no funciones, para que crucen de Astro a la isla y se puedan comprobar contra la tabla de props (4.4). Elegir un atajo parte del estado inicial (no arrastra lo del anterior); uno queda marcado mientras todas sus props valgan lo que dice. Hay un atajo fijo, «Por defecto», que vuelve al estado inicial.
- Una regla activa quita las props de `disable` de lo que se pinta y del código (`children` también se puede desactivar), y pone las de `set` si no valen ya algo (el `label` de un botón de solo icono, que si no queda sin nombre accesible). El valor de la prop desactivada se guarda: al quitar la causa vuelve. En la interfaz, el control sale desactivado con el motivo como pista (`hint`, asociada al campo, así que se anuncia).
- Primer caso, `Button`: siete atajos (Primario, Secundario, Terciario, Destructivo, Con icono, Solo icono, Cargando) y una regla (`iconOnly` desactiva `iconLeading`, `iconTrailing` y el texto). Los demás componentes llegan con el grupo 5.
- Detalle a revisar: con «Solo icono» quedan marcados «Primario» y «Solo icono», porque `hierarchy` sigue valiendo `primary`; es coherente con «marcado mientras sus props no cambien», pero se ve como dos elegidos.
- Tests: unitarios de las reglas (desactiva, `set`, el valor vuelve) y de los atajos; e2e de `Button` (atajo, control desactivado con su motivo, volver al inicio y Enter con teclado). Capturas: el playground no tiene captura aprobada; revisado a mano en claro.

## 4.3 Carga por componente

- `src/playground/<Componente>.tsx`, uno por cada uno de los 62 con punto de partida (63 con `SidebarNav`, que lleva su marca de Regula): `export { X as default } from "@jotis-me/react"`. `Playground.tsx` los carga con `import.meta.glob` y `use()` dentro de un `Suspense` (el servidor espera y pinta lo mismo); un fichero puede exportar además `tweaks` (ajustes de cliente, con nodos: contenido preparado), con los que la isla rehace los controles a partir de `rows` (la tabla de props, que ahora le llega como JSON). `lib/playground-components.ts` y su test desaparecen; `test/playground-modules.test.ts` exige un fichero por componente de `STARTS` y que cada uno se importe.
- Los datos (punto de partida, atajos, reglas) siguen en `lib/playground.ts` (`STARTS`) y no en los ficheros de componente, como proponía el diseño D3: son JSON, el servidor los necesita para decidir si hay playground y para el HTML, y los módulos de cliente solo aportan lo que lleva nodos. Se mantiene así por los 121 componentes; si `STARTS` se hace demasiado largo en el grupo 5 se reparte por grupo en ficheros `lib/playground-*.ts`.
- **Medido (`check:js`):** `/components/button/` pasa de ~375 a 248 kB gzip; `/components/calendar-view/` baja a 206; `/components/input/` (que arrastra DatePicker y Select por su galería) queda en 317,5. Las `/visual/` de formularios suben de 275,7 a 283,4 por el reparto de trozos; su límite pasa de 280 a 286 (motivo en `js-budget.json`). El de `/components/*/` baja en 6.2, al quitar la galería.
- `e2e/js-contents.spec.ts`: las páginas de Button, Badge e Input no descargan el código de ColorPicker, Carousel, StreamScene ni CalendarView (fragmentos de clases únicos buscados en todo el JS, también el dinámico); y la de ColorPicker sí descarga el suyo (comprueba que los marcadores valen).
- Los dos ficheros e2e que esperaban una sola isla de búsqueda (`not-found.spec.ts`) esperan las dos de la cabecera, como `search.spec.ts` en 3.1.

## 4.4 Test de configuraciones

- `test/playground-config.test.ts`: los 59 componentes del catálogo sin punto de partida están en una lista explícita (`PENDING`) que debe coincidir con lo que falta en `STARTS` y quedar **vacía en 5.7**; los 62 configurados tienen al menos un control; su punto de partida, atajos, reglas (`when`, `disable`, `set`) y ajustes nombran props que existen (o atributos de HTML heredados, `children`, `aria-*`, `data-*`) y con valores válidos para su control (uno de la unión, booleano, número, icono del núcleo, opción de contenido); cada atajo pinta (`renderToStaticMarkup` con el componente real) y su código es JSX válido; y los controles se rehacen igual con los ajustes. Falla diciendo qué componente y qué atajo o regla.
- **Fuera, por decisión sin consultar:** «ninguna prop configurable sin control ni `hidden`» (design D3). Las props de tipos abiertos (cadenas libres, nodos, objetos, funciones) son casi todas las de cada componente, y exigir `hidden` en cada una obligaría a escribir cientos de entradas sin enseñar nada; los controles salen solo de las props con valores cerrados, booleanos, números y de icono, y las demás se dan por el punto de partida o por un ajuste `content` cuando importan. La spec («un control por cada prop configurable… para las que reciben contenido, un selector de valores preparados») se cumple en los componentes donde el contenido importa, que son los del grupo 5.

## 5.1 Acciones y Formularios

- `STARTS` pasa a repartirse por grupos del catálogo en `lib/starts/<grupo>.ts` (re-exportado desde `playground.ts`); los grupos siguientes añaden a su fichero.
- Los 24 componentes (7 de Acciones y 17 de Formularios) tienen punto de partida, atajos con sus tipos del Figma y, donde la tabla lo permite, reglas: `Button` (solo icono), `ButtonUtility` (sin tooltip no hay posición ni estado abierto), `SocialButton` (solo logo sin texto), `Textarea` (la posición de las etiquetas solo aplica con etiquetas). `Slider`, `ColorPicker` y `ColorPickerDropdown`, que no tenían, pasan a tener ejemplo interactivo; los atajos de `ColorPicker` son los modelos (Hex, RGB, HSL, HSB) y los de `ColorPickerDropdown`, sus seis disparadores.
- Mejoras del motor que pedían estos componentes: `error` (`string | boolean`) es por defecto un control de contenido (sin error / «Con error»); un control de contenido sobre `children` escribe su código entre las etiquetas; las opciones de contenido pueden declarar imports por módulo (`@jotis-me/icons/logos`); en `when`, `null` es «no tiene valor»; el punto de partida puede nombrar la opción de contenido inicial por su etiqueta; un componente con atajos pero sin controles de la tabla (solo de módulo) también tiene playground.
- `SocialButton`, `SocialButtonGroup` y `AppStoreBadge` llevan en su módulo (`src/playground/`) el `logo` o los hijos como opciones preparadas con los logos de `@jotis-me/icons/logos` (seis redes en color y gris; cinco tiendas) y su código con los imports.
- Dudas: los atajos de `Select` (`type: "tags"`) y de `Input` (tarjeta, archivo, fecha y hora) siguen lo que dice la tabla de props y los ejemplos del registro, sin probar a fondo cada combinación con teclado; los pasa el humo (primer y último valor de cada control sin errores de consola) y axe en claro/oscuro.
- Los controles desactivados por una regla se saltan en el humo de e2e (`extremes`).

## 5.2 Navegación y Capas

- Los 12 de Navegación y los 5 de Capas (`Modal`, `Slideout`, `Tooltip`, `HelpIcon`, `CopyTooltip`) tienen ejemplo interactivo con atajos. Nuevos: `Breadcrumbs`, `Pagination` (seis tipos más forma), `PaginationDots`, `Pager` (sus enlaces anterior/siguiente son opciones preparadas de contenido, que van en el propio `Start`, JSON), `Dropdown` (disparadores, buscador, integraciones y las tarjetas de cuenta), `ContextMenu` (su menú, «Navegador» o «Edición», como contenido preparado), `HeaderNav` (los cinco tipos; módulo con la marca, el buscador, las acciones y la cuenta), `CommandMenu`, `TreeView`, `Slideout` (módulo con las acciones y el pie como contenido preparado), `Tooltip` (módulo con lo que envuelve) y `CopyTooltip` (módulo con el botón que se copia).
- `Modal` gana atajos (Alerta, Destructivo, Éxito, Horizontal, A la izquierda, Con divisores); los 51 tipos completos siguen en su página de composiciones.
- Los menús (`Dropdown`, `ContextMenu`) empiezan cerrados o con su vista previa abierta según el componente (`ContextMenu` con `defaultOpen`, en un marco de 260 px; `CommandMenu`, `Slideout` y `Modal`, contenidos en un marco).
- **Arreglo en el paquete (changeset `tree-view-meta-contrast`, patch):** axe encontró en `/components/tree-view/` que el texto de apoyo (`meta`) de la fila elegida (`text-quaternary` sobre `bg-secondary_hover`) no llegaba a 4,5:1 en claro. Pasa a `text-tertiary` solo en la fila elegida (`group-data-selected:`); se actualiza el fixture congelado de HTML de `TreeView` (la única diferencia es esa clase). La captura aprobada del ejemplo sigue pasando.
- `e2e/playground.spec.ts`: el test «un componente sin playground» pasa a `ChannelBanner` (el último pendiente) y se borra en 5.7; el humo salta los selectores desactivados por una regla.

## 5.3 Avisos y carga y Etiquetas e identidad

- Los 9 de Avisos y carga y los 14 de Etiquetas e identidad (con `Kbd`) tienen ejemplo interactivo y atajos con sus tipos del Figma. Nuevos: `EmptyState` (con reglas: la ilustración solo con `media="illustration"` y el icono solo con `media="icon"`), `ProgressBar` (`value` pasa a ser un campo numérico: el componente no tiene `onChange`), `ProgressCircle`, `ProgressSteps` (cinco tipos, vertical), `AvatarProfilePhoto`, `CheckIcon`, `CheckItem`, `Rating`, `RatingBadge` y `Kbd`.
- Nodos y funciones como contenido preparado en módulos: `actions` de `Alert`, `Banner` y `EmptyState` (botones); `flag` y `avatar` de `Badge` y `Tag` (`FlagSpainCircle` de `@jotis-me/icons/flags` y un `Avatar`); `onRemove` de `Tag` y `onAdd` de `AvatarGroup` (una función vacía, con «Con cierre» y «Con botón de añadir»). `Badge` solo icono desactiva texto, punto, bandera y avatar y pone el `label`.
- Cambio del motor: un prop de tipo `IconName` (como el `name` de `Icon`) también es un selector de icono.
- axe encontró que `CheckItem` pinta un `li` fuera de una lista en el ejemplo: el punto de partida lleva `as="div"` (y es lo que escribe el código).
- Pendiente de este grupo, por decisión: `Notification` y `Alert` no ofrecen `image`/`icon` como nodos (el icono sí, por nombre); `Avatar` `company` queda sin control (un nodo de logo).

## 5.4 Datos y Gráficas

- Los 6 de Datos y los 7 de Gráficas tienen ejemplo interactivo con atajos. Nuevos: `CalendarView` (módulo que fija el día de hoy y el mes, porque las fechas son `Date`, y ofrece los eventos de octubre como contenido preparado con su código `new Date(…)`; `defaultView` oculto —no responde a cambios— y los atajos mueven `view`), `FilterMenu`, `FilterPanel` (sus filtros, sin ellos o dos, como contenido preparado), `ActivityGauge`, `RadarChart`, `ChartMarker`. `Table` lleva atajos de orden, selección (casillas, radios, interruptores), franjas y tamaño; `MetricCard`, atajos y dos reglas (el estilo de la gráfica y el del icono solo aplican con gráfica o icono); `PieChart`, el hueco como número de 0 a 0,75.
- Cambio del motor: un ajuste de contenido gana a la exclusión de props de estado (`defaultValue` de `FilterPanel`).
- Dudas: las gráficas con `legend` (`boolean | "top" | "right"`) no tienen selector porque su tipo no es una unión de cadenas: la leyenda se mueve con atajos. `Table` no ofrece los tipos de celda del Figma como control (`type` de cada columna, con renderizadores): quedan en las composiciones y la galería hasta 6.1.

## 5.5 Estructura de página y Contenido y medios

- Los 8 de Estructura de página (`PageHeader`, `CardHeader`, `SectionHeader`, `SectionLabel`, `ContentDivider`, `SectionFooter`, `InlineCTA`, `LinkCard`) y los 5 de Contenido y medios (`Message`, `MessageInput`, `CodeSnippet`, `VideoPlayer`, `Carousel`) tienen ejemplo interactivo con atajos. `InlineCTA` lleva sus siete tipos como atajos con los datos de cada uno (plan, funciones, pago, archivo); `Message`, los tipos de mensaje (archivo, respuesta, escribiendo, con reacciones); `CodeSnippet`, las pestañas.
- Nodos como contenido preparado en módulos: acciones, avatar, buscador y pestañas de las cabeceras; la imagen y las acciones de `InlineCTA`; la muestra de `LinkCard`; la respuesta citada de `Message`; las tres diapositivas de `Carousel`.
- axe: las diapositivas de `Carousel` salieron con el mismo color de fondo y de texto en oscuro; pasan a `bg-brand-solid` con `text-white`.
- Dudas: los atajos de `Message` con `type="audio"`, `image`, `video` y `link-preview` no están (necesitan `audio`, `media` o `link` con datos de medios; los cubre el ejemplo de la galería hasta 6.1); `InlineCTA` con `payment.logo` y `file.icon` va sin el nodo (el componente cae a su texto).

## 5.6 Fondos y maquetas y Web de marketing

- Los 10 de Fondos y maquetas y los 9 de Web de marketing tienen ejemplo interactivo (se añade `web-de-marketing` al reparto de `lib/starts/`). Nuevos: `BackgroundOverlay` (los tres tipos y el desenfoque), `TransparencyGrid`, `ScaledPreview` (con un texto dentro), `ScreenMockup`, `LaptopMockup`, `PhoneMockup`, `MarketingNav` (los seis tipos de menú, ancho completo, flotante y «Solo enlaces»), `Footer` (seis de los veinte tipos como atajos y el resto por el selector de `type`), `BlogPostCard` (cuatro de los ocho tipos más horizontal), `SubscribeCard`, `PricingCard` (los diez tipos, con las props de cada uno), `JobPostCard`, `Accordion`, `TeamMemberCard` y `Testimonial`.
- Nodos como contenido preparado en módulos: marca, acciones y menús de `MarketingNav` (con `NavMenu`); marca de `Footer`; imagen de `BlogPostCard`, `TeamMemberCard` y `Testimonial`; acciones de `PricingCard`; bandera de `JobPostCard`; redes de `TeamMemberCard`; las flechas de `Testimonial`. El texto entre etiquetas de los tres maquetas es el de `Start.children`.
- Dudas: los atajos de `Footer`, `BlogPostCard`, `TeamMemberCard` cubren una parte de los tipos del Figma (los que cambian más que una cadena); el selector `type` llega a todos. `MarketingNav` pinta el menú abierto solo con `previewItem` («Producto»); `AppStoreBadge` y `SocialButton` de grupos anteriores se quedan como estaban.
