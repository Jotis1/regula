# @jotis-me/react

## 0.7.0

### Minor Changes

- f45e9b0: Cobertura completa del Figma «Yoruverse UI v8.0»: 27 componentes nuevos y las variantes que faltaban en los existentes. El catálogo pasa a 121 componentes en 12 grupos, con el grupo nuevo «Web de marketing». Todo es retrocompatible: sin las props nuevas, cada componente pinta el mismo HTML que antes.

  **Componentes nuevos**
  - Identidad y valoraciones: `AvatarProfilePhoto`, `CheckIcon`, `CheckItem`, `Rating` (relleno parcial, «4,5 de 5») y `RatingBadge`.
  - Botones de redes y tiendas: `SocialButton` (Google, Facebook, Apple, X, Figma y Dribbble, en tres temas), `SocialButtonGroup` y `AppStoreBadge` (Google Play, App Store, Mac App Store, Galaxy Store y AppGallery).
  - Gráficas: `ActivityGauge`, `RadarChart` y `ChartMarker`, que también se puede usar en `LineChart` y `BarChart` con `marker`.
  - Color y filtros: `ColorPickerDropdown` (seis disparadores que abren el selector en un popover), `FilterMenu` (constructor de condiciones) y `FilterPanel` (filtros en un panel lateral).
  - Fondos y dispositivos: `BackgroundOverlay`, `ScreenMockup` (3:2 en seis tamaños y moderno), `LaptopMockup` y `PhoneMockup`.
  - Web de marketing: `MarketingNav` (navegación con menús de varios tipos y versión flotante), `Footer`, `BlogPostCard`, `SubscribeCard`, `PricingCard` (diez tipos), `JobPostCard`, `Accordion` (con teclado), `TeamMemberCard` (siete tipos) y `Testimonial`.

  **Variantes nuevas en componentes existentes**
  - `Avatar`: insignias de verificado, número y empresa, y estado. `AvatarGroup`: botón de añadir. `Badge`: bandera, avatar, X y solo icono. `Tag`: bandera, avatar, punto, contador y casilla.
  - `ButtonGroup`: iconos, solo icono y punto. `CloseButton`: fondo oscuro. `Button` e `iconOnly` aceptan un icono ya pintado.
  - `Dropdown`: buscador, integraciones y los selectores de cuenta. `Input`: tarjeta de pago, botón detrás, fecha y hora y archivo. `Textarea`: etiquetas dentro o fuera y `size="sm"`. `Select`: búsqueda, iconos, avatares, puntos y etiquetas. `RadioGroup`: los seis tipos del Figma. `ProgressBar` y `Slider`: etiquetas y rango. `TextEditor`: barra flotante y tamaños. `VideoPlayer`: tres tamaños.
  - `ActivityFeed`: divisores (`connector` sigue como alias) y tipo mensajes. `Notification`: los nueve tipos. `SidebarNav`: dos niveles, estrecha, secciones, tarjetas destacadas (`SidebarCards`) y cuenta. `Breadcrumbs`: divisor y cuatro tipos. `Pagination`: seis tipos con `align`, y forma.
  - `CalendarView`: vistas de semana y día. `LineChart` y `BarChart`: leyenda y marcador. `ColorPicker`: los doce tipos y los modelos Hex, RGB, CSS, HSL y HSB. `DatePicker`: rango, fecha sola y horas.
  - `ContentDivider`, `FileUpload`, `InlineCTA`, `Message`, `MessageInput`, `MetricCard`, `PageHeader`, `SectionHeader`, `Table` (celdas, orden, selección), `FilterBar`, `TreeView`, `Tabs`, `CodeSnippet`, `BackgroundPattern`, `CreditCard` (trece temas), `BrowserFrame`, `FeaturedIcon` y `Carousel` (`arrowStyle`): las variantes del Figma.
  - `Modal`: `align`, `media`, `footerStart` y `dividers`. `Slideout`: `icon` y `footerStart`. Con ellos, la web monta los 51 tipos de Modal y los 23 de Slideout del Figma como composiciones para copiar.

  Las props de icono aceptan el nombre de un icono del núcleo o cualquier icono de `@jotis-me/icons` ya pintado, sin cargar el set entero.
- 1516a94: `HeaderNav` gana el tipo `underline` (una fila con la sección actual subrayada, la cabecera de una web de documentación) y la prop `mobileBar`, que sustituye al botón de menú y al panel móvil integrados por los de quien usa el componente. Sin ellas, el HTML no cambia.

### Patch Changes

- 2d5ee33: `TreeView`: el texto de apoyo (`meta`) de la fila elegida pasa de `text-quaternary` a `text-tertiary`, porque sobre el fondo de la fila elegida no llegaba a 4,5:1 de contraste en el tema claro.
- Updated dependencies [c328f41]
  - @jotis-me/icons@0.7.0
  - @jotis-me/tokens@0.7.0

## 0.6.0

### Minor Changes

- 197f8f0: Variantes menores del Figma, fase 3: tres componentes nuevos y el catálogo pasa de 91 a 94.
  - `BadgeGroup`: un badge dentro de otro con un mensaje («Nuevo · Hemos publicado…»), delante o detrás, en `pill` o `modern`, cinco colores y `md`/`lg`. Con `href` u `onClick` es un enlace o un botón con flecha.
  - `SectionLabel`: el título de una sección de ajustes, con marca de obligatorio, icono de ayuda, texto de apoyo y acciones debajo, en `sm` y `md`.
  - `ButtonUtility`: botón pequeño de solo icono (`xs`, `sm`; `secondary`, `tertiary`) que dice qué hace en un tooltip.

  Y en los que ya había, sin cambiar lo de antes:
  - `Spinner` gana `variant`: `line-spinner` (arco largo, sin pista) y `dot-circle` (dieciséis puntos que se desvanecen).
  - `EmptyState` gana `media` con las ocho cabeceras del Figma (ilustraciones de nube, caja, documentos y tarjeta; archivo; carpeta; carpeta translúcida; usuarios en círculos y en fila; integraciones, con los avatares o logos que le pases en `items`) y `size` (`sm`, `md`, `lg`). Sin las props nuevas se ve igual que antes. Pesa más: sus dibujos lo llevan de unos 22 a unos 40 kB en gzip.

### Patch Changes

- Updated dependencies [a9768ec]
  - @jotis-me/icons@0.6.0
  - @jotis-me/tokens@0.6.0

## 0.5.0

### Minor Changes

- a375e45: Dropdown admite elección única: con `selectedValue` el menú elige una opción entre varias, marcada con un check a la derecha y anunciada como `menuitemradio` con `aria-checked`. Cada opción lleva su `value` y `onSelectionChange(value)` avisa al elegir y cierra el menú. Sin `selectedValue`, el menú de acciones se comporta como siempre.
- 71d7816: Navegación y progreso del Figma, fase 2: siete componentes nuevos y el catálogo pasa de 84 a 91.

  **Cambio que rompe: `Select`.** Deja de ser el menú nativo del navegador y pasa a ser el del Figma, una lista bajo el campo hecha con el `Select` de React Aria. Su `onChange` ya no recibe el evento del `<select>`, sino el valor elegido: donde leías `event.target.value`, pasa a leer el argumento (`onChange={(valor) => …}`). El resto (`value`, `defaultValue`, `name`, `disabled`, `placeholder`, `size`) sigue igual, y el valor sigue viajando en un formulario con `name`. Pesa más: la lista de React Aria lleva `Select` de unos 25 a unos 85 kB en gzip (como `Dropdown` o `MultiSelect`), y con él `Input` (por `leadingSelect` y `trailingSelect`), `Tabs` y lo que usa un campo (`Banner`, `FilterBar`, `SidebarNav`, `ColorPicker`).

  Componentes nuevos:
  - `ProgressSteps`: los pasos de un proceso (completo, actual, pendiente) en cinco tipos (`icons-centered`, `icons-text`, `text-line`, `minimal`, `minimal-connected`), con marcadores de check, número o icono, tamaños `sm` y `md` y orientación horizontal o vertical.
  - `ProgressCircle`: progreso en círculo o semicírculo, con su valor y una etiqueta, de `xxs` a `lg`. Se pinta en el servidor.
  - `PaginationDots`: puntos o rayas que dicen en qué página estás, en `md` y `lg`, con o sin marco; con `onChange` llevan a otra página.
  - `Carousel`: pasa diapositivas con flechas, puntos, ← y → y deslizando el dedo; las diapositivas ocultas quedan inertes.
  - `HeaderNav`: la cabecera de una app en cuatro tipos (`simple`, `dual-tier`, `tabs` y `centered`), con su menú móvil, que abre un panel desde la izquierda.
  - `ContextMenu`: menú del botón derecho (o de Mayús+F10 y la tecla de menú) sobre una zona, con atajos, iconos, grupos con check o punto y submenús.
  - `HelpIcon`: el icono de ayuda de 16px que abre un tooltip al pasar el ratón o enfocarlo.

  Y variantes nuevas, sin cambiar lo que ya había:
  - `Select` e `Input` (`leadingSelect` y `trailingSelect`): opciones con texto de apoyo, icono, avatar o punto delante y un check en la elegida.
  - `Tabs`: `orientation="vertical"` (por debajo de `lg` pasa a un desplegable) y los tipos `button-minimal` y `line`.
  - `Tooltip`: `placement` (arriba, abajo, izquierda o derecha) y `arrow` (centrada, al principio, al final o sin flecha).
  - `Slideout`: `side="left"` para abrirlo desde la izquierda.
  - Los campos con foco (`Input`, `Select`, `Textarea`, `NumberInput`, `TagInput`, `MultiSelect`, `VerificationCodeInput`) llevan solo el borde de 2px de marca, sin el anillo exterior que se sumaba con teclado y se veía como un borde doble.
- a27c3e8: Seis piezas de la web de documentación pasan al paquete, y el catálogo crece de 78 a 84 componentes:
  - `TransparencyGrid`: fondo de damero que indica transparencia y sigue el tema, en cuadros de 8 o 16px.
  - `ScaledPreview`: pinta una pieza a su ancho real y la encoge para que quepa en una caja, sin JavaScript.
  - `Kbd`: tecla o atajo con dos variantes, `menu` (la de los atajos de Dropdown y CommandMenu, que ya existía privada) y `field` (la pista «Ctrl K» de un campo de búsqueda).
  - `LinkCard`: card cuyo enlace cubre toda su superficie, con una vista previa opcional inerte y fuera del enlace.
  - `Pager`: navegación «Anterior y siguiente» al final de una página.
  - `CopyTooltip` y el hook `useCopy`: copiar al portapapeles con una burbuja «Copiado», como la de `Tooltip`, junto al elemento pulsado. `CodeSnippet` conserva su propia confirmación.

### Patch Changes

- 0c76166: CommandMenu: con el foco en el buscador, la opción activa lleva también el anillo de foco.

  Bordes que tapaban los fondos de dentro: CodeSnippet (columna de números y pestañas), CalendarView (fila de los días de la semana, días de otro mes y la fecha de la cabecera) y CommandMenu (pie) llevan ahora un borde de verdad en lugar de una sombra interior, así que se ve entero.
- Updated dependencies [858d806]
  - @jotis-me/icons@0.5.0
  - @jotis-me/tokens@0.5.0

## 0.4.0

### Minor Changes

- ebf83b3: Formularios del Figma, fase 1. Cuatro componentes nuevos:
  - `NumberInput`: campo numérico con botones para restar y sumar, en horizontal o vertical, con mínimo, máximo, paso y formato `es-ES`.
  - `TagInput`: convierte lo escrito en etiquetas con Enter o coma, dentro o debajo del campo.
  - `VerificationCodeInput`: código de 4 o 6 dígitos, una casilla por dígito, con pegado, autocompletado (`one-time-code`) y `onComplete`.
  - `MultiSelect`: varias opciones con buscador y casillas; el campo resume lo elegido y la lista trae «Restablecer» y «Elegir todo».

  Y variantes nuevas, sin cambiar lo que ya había:
  - `Input`: `prefix` (texto fijo delante), `leadingSelect` / `trailingSelect` (desplegable nativo dentro del campo) y botón para mostrar la contraseña con `type="password"` (`revealable`, `revealLabels`). `Input` pasa a ser componente de cliente; un campo de texto se sigue pintando igual en el servidor.
  - `RadioGroup`: `appearance="card"` (opciones en tarjetas con `media` y `supporting`) e `indicator`.
  - `Toggle`: `variant="slim"`.

### Patch Changes

- cee0e19: `Dropdown` abierto de inicio (`defaultOpen`) ya no repite ids ni deja referencias ARIA rotas en el HTML de servidor. El panel en línea iba dentro del `MenuTrigger` de React Aria y cada opción recibía las props del botón (su `id`, `aria-controls`, `aria-haspopup`…). Ahora va fuera, y la etiqueta, la descripción y el atajo de cada opción van en sus huecos de React Aria. El aspecto y el comportamiento no cambian: el botón sigue cerrando el menú abierto de inicio y elegir una opción lo cierra.
- @jotis-me/icons@0.4.0
  - @jotis-me/tokens@0.4.0

## 0.3.0

### Minor Changes

- 94ffbf3: Scaena entra en la suite: `apps.scaena` / `appIcons.scaena` (`Sc`, tono `lime`), con sus SVG y PNG en `dist/app-icons/` y `app="scaena"` en `AppIcon`. `lime` no bloquea ningún tono libre: sus vecinos (`yellow` y `green`) ya estaban vetados.

### Patch Changes

- Updated dependencies [94ffbf3]
  - @jotis-me/icons@0.3.0
  - @jotis-me/tokens@0.3.0

## 0.2.0

### Minor Changes

- f691517: Regula entra en la familia de iconos de app: `AppIcon app="regula"` pinta "Re" en `fuchsia`. `@jotis-me/icons` publica sus SVG, favicon y PNG en `app-icons/regula-*`. Como `purple` y `pink` son vecinos de `fuchsia`, dejan de valer para una app nueva.

### Patch Changes

- 7749e46: `BrowserFrame`: el área de contenido es una región con foco (`tabIndex={0}`, `<section>` con la dirección como nombre y anillo de foco), para que una pantalla que no cabe se pueda desplazar con el teclado. Antes, a anchos estrechos, axe lo marcaba como región desplazable sin foco.
- cd49f95: `Checkbox`: con `indeterminate`, `aria-checked="mixed"` se pone al montar, junto con la propiedad `indeterminate` de la casilla. Antes, el HTML de servidor anunciaba "mixed" en una casilla nativa que hasta hidratar no lo estaba.
- 815df97: `ColorPicker`: la barra de tono tiene nombre propio («Tono», cambiable con `hueLabel`). Antes, en el HTML de servidor, su `aria-labelledby` apuntaba a una etiqueta que no existía hasta hidratar.
- Updated dependencies [f691517]
  - @jotis-me/icons@0.2.0
  - @jotis-me/tokens@0.2.0

## 0.1.0

### Minor Changes

- 060d186: Primera versión pública del sistema de diseño de la suite jotis.me: tokens semánticos en claro y oscuro con su tema de Tailwind v4 y las fuentes de la suite; los 81 iconos de línea como componentes React y SVG sueltos, con los iconos de app y los adornos; y los 74 componentes de la guía en React, compatibles con Next.js (App Router) y Astro.

### Patch Changes

- Updated dependencies [060d186]
  - @jotis-me/tokens@0.1.0
  - @jotis-me/icons@0.1.0
