# Spec Delta

## MODIFIED Requirements

### Requirement: Catálogo completo de componentes
La librería SHALL exportar cada componente del catálogo del sistema, con su tipo de props, y el catálogo SHALL ser el mismo en el paquete, en la web y en el artefacto generado. El catálogo parte de los 74 componentes de la guía original y crece con cada cambio que añade uno.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen, como mínimo, ActivityFeed, Alert, AppIcon, Avatar, AvatarGroup, AvatarLabel, BackgroundPattern, Badge, Banner, BarChart, Breadcrumbs, BrowserFrame, Button, ButtonGroup, CalendarView, CardHeader, Carousel, ChartLegend, Checkbox, CloseButton, CodeSnippet, ColorPicker, CommandMenu, ContentDivider, ContextMenu, CopyTooltip, CreditCard, DatePicker, Dropdown, EmptyState, FeaturedIcon, FileUpload, FilterBar, HeaderNav, HelpIcon, Icon, InlineCTA, Input, Kbd, LineChart, LinkCard, Message, MessageInput, MetricCard, Modal, MultiSelect, Notification, NumberInput, PageHeader, Pager, Pagination, PaginationDots, PieChart, ProgressBar, ProgressCircle, ProgressSteps, Radio, RadioGroup, ScaledPreview, SectionFooter, SectionHeader, Select, SidebarNav, Skeleton, Slideout, Slider, Spinner, Table, Tabs, Tag, TagInput, TextEditor, Textarea, Toggle, Tooltip, TransparencyGrid, TreeView, VerificationCodeInput y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCountdown, StreamEvents, StreamGoal, StreamScene y StreamStatus, todos con sus tipos de props

#### Scenario: Catálogo coherente
- **WHEN** se compara lo que exporta el paquete con los componentes que tienen página en la web
- **THEN** son la misma lista, sin componentes de más ni de menos en ninguno de los dos lados

### Requirement: Estados comunes de interacción
Los controles SHALL mostrar hover cambiando el fondo o el texto un escalón, deshabilitado al 50 % de opacidad en todo el control y foco de teclado con `focus-ring-shadow` (`focus-ring-error-shadow` si hay error), salvo los campos de formulario, cuyo foco es solo el borde de 2px `border-brand` (`border-error` si hay error), como en el Figma, con transiciones de color de 100–150 ms y sin animaciones decorativas, salvo la entrada y salida de la familia Stream (requisito propio).

#### Scenario: Foco con teclado
- **WHEN** el usuario llega a un `Input` con Tab
- **THEN** el borde del control pasa a 2px `border-brand` y no hay anillo de foco por fuera, ni con teclado ni con ratón

#### Scenario: Foco con teclado en un botón
- **WHEN** el usuario llega a un `Button` con Tab
- **THEN** el botón muestra el anillo de foco `focus-ring-shadow`

#### Scenario: Deshabilitado
- **WHEN** un `Button` tiene `disabled`
- **THEN** se pinta al 50 % de opacidad, no responde a clics y no recibe foco

## ADDED Requirements

### Requirement: Desplegable con el menú del Figma
`Select` SHALL abrir, en lugar del menú nativo del navegador, una lista bajo el campo como la del Figma: cada opción con su texto, un texto de apoyo opcional y un icono, avatar o punto delante, y la elegida con un check de marca. SHALL elegirse con ratón y con teclado, y enviar su valor en un formulario con `name`. Los desplegables de `Input` SHALL usar la misma lista.

#### Scenario: Abrir y elegir
- **WHEN** se pulsa un `Select` de miembros del equipo y se elige «Olivia Rhye»
- **THEN** se abre una lista de opciones bajo el campo (no el menú del sistema), «Olivia Rhye» queda en el campo con su texto de apoyo «@olivia» y, al volver a abrir, lleva el check de marca

#### Scenario: Teclado
- **WHEN** con el foco en el campo se pulsa ↓, después ↓ y Enter
- **THEN** la lista se abre, se mueve a la siguiente opción y la elige, y el foco vuelve al campo

#### Scenario: Formulario
- **WHEN** un `Select` con `name="miembro"` está dentro de un formulario que se envía
- **THEN** el formulario envía `miembro` con el valor de la opción elegida

#### Scenario: Desplegable de un Input
- **WHEN** se abre el `leadingSelect` de prefijo telefónico de un `Input`
- **THEN** se abre la misma lista del Figma, no el menú del sistema


### Requirement: Pasos de un proceso
`ProgressSteps` SHALL pintar los pasos de un proceso, cada uno completo, actual o pendiente, en los cinco tipos del Figma: iconos centrados, iconos con texto, texto con línea, iconos mínimos e iconos mínimos unidos. El paso actual SHALL marcarse con `aria-current="step"` y el estado de cada paso SHALL poder leerse, no solo verse.

#### Scenario: Paso actual
- **WHEN** se pinta un `ProgressSteps` de cuatro pasos con el segundo como actual
- **THEN** es una lista ordenada, el segundo paso lleva `aria-current="step"`, el primero se anuncia como completo y el tercero y el cuarto como pendientes

#### Scenario: Iconos mínimos
- **WHEN** se pinta en el tipo de iconos mínimos con el tercero de cuatro como actual
- **THEN** se ve «Paso 3 de 4» junto a los cuatro iconos, sin los títulos de los pasos

#### Scenario: Número y check
- **WHEN** los pasos usan el marcador de número
- **THEN** los pendientes y el actual enseñan su número, y los completos un círculo verde (`bg-success-solid`) con un check

### Requirement: Pasos en columna
`ProgressSteps` SHALL admitir orientación horizontal y vertical: en vertical, cada paso pone su título y su texto de apoyo a la derecha del marcador, y la línea que los une va en vertical.

#### Scenario: Vertical
- **WHEN** se pinta con `orientation="vertical"`
- **THEN** los pasos se apilan, el texto de cada uno queda a la derecha de su marcador y la línea entre marcadores es vertical

### Requirement: Progreso circular
`ProgressCircle` SHALL pintar un valor de 0 a 100 como un arco sobre una pista, en círculo o semicírculo, con el valor en el centro y una etiqueta opcional, en los tamaños `xxs`, `xs`, `sm`, `md` y `lg`. SHALL anunciarse como barra de progreso con su valor.

#### Scenario: Valor
- **WHEN** se pinta un `ProgressCircle` de valor 40 con la etiqueta «Usuarios activos»
- **THEN** tiene `role="progressbar"` con `aria-valuenow="40"`, nombre «Usuarios activos», el centro dice «40%» y el arco cubre el 40 % de la pista

#### Scenario: Semicírculo
- **WHEN** se pinta con `shape="half"`
- **THEN** la pista y el arco son medio círculo y la caja mide la mitad de alto más el valor

### Requirement: Puntos de paginación
`PaginationDots` SHALL pintar un punto o una raya por página, con la actual en `bg-brand-solid`, en `md` y `lg`, con o sin marco. Con `onChange` SHALL ser un control que lleva a cada página; sin él, una indicación que dice «n de N» a los lectores de pantalla.

#### Scenario: Indicador
- **WHEN** se pinta con 3 páginas y la segunda como actual, sin `onChange`
- **THEN** se ven tres puntos, el segundo en color de marca, y un lector oye «2 de 3»

#### Scenario: Control
- **WHEN** se pinta con `onChange` y se pulsa el tercer punto
- **THEN** se llama a `onChange(3)`, y cada punto es un botón con nombre «Ir a la página n de 3»

### Requirement: Carrusel
`Carousel` SHALL pasar diapositivas de una en una con flechas a los lados, puntos de paginación, las flechas del teclado y deslizando el dedo, sin pasar solo. Las flechas SHALL deshabilitarse en la primera y en la última diapositiva.

#### Scenario: Pasar con las flechas
- **WHEN** en un `Carousel` de tres diapositivas se pulsa la flecha de la derecha
- **THEN** se ve la segunda diapositiva, el segundo punto pasa a actual y la flecha de la izquierda deja de estar deshabilitada

#### Scenario: Teclado
- **WHEN** con el foco dentro del carrusel se pulsa → y después ←
- **THEN** pasa a la siguiente diapositiva y vuelve a la anterior

#### Scenario: Accesible
- **WHEN** un lector de pantalla recorre el carrusel
- **THEN** lo anuncia como región con `aria-roledescription="carrusel"` y su nombre, cada diapositiva como «Diapositiva n de N», y las diapositivas que no se ven quedan fuera del árbol de accesibilidad

### Requirement: Cabecera de navegación
`HeaderNav` SHALL pintar la cabecera de una app en los tipos Simple, Dual-tier, Tabs y Centered, con marca, secciones, acciones y cuenta. La sección actual SHALL llevar `aria-current="page"`. En Dual-tier y Tabs SHALL haber una segunda fila con las subsecciones de la sección actual.

#### Scenario: Simple
- **WHEN** se pinta un `HeaderNav` Simple con cinco secciones y la segunda como actual
- **THEN** hay un `banner` con la marca, una navegación con las cinco secciones y la segunda con `aria-current="page"`, y las acciones y la cuenta a la derecha

#### Scenario: Dual-tier
- **WHEN** se pinta Dual-tier con subsecciones en la sección actual
- **THEN** debajo de la primera fila hay otra navegación con las subsecciones y la actual marcada

#### Scenario: Tabs
- **WHEN** se pinta con el tipo Tabs
- **THEN** las subsecciones van como pestañas `underline` bajo la primera fila

### Requirement: Menú móvil de la cabecera
Por debajo del ancho de escritorio, `HeaderNav` SHALL sustituir las secciones por un botón de menú que abre un panel a pantalla completa con buscador opcional, la navegación (las secciones con subsecciones se despliegan), los enlaces de pie y la cuenta. El panel SHALL atrapar el foco y cerrarse con Escape, devolviendo el foco al botón.

#### Scenario: Abrir y cerrar
- **WHEN** a 390px se pulsa el botón de menú y después Escape
- **THEN** el panel se abre con la navegación y el foco dentro, y al cerrarse el foco vuelve al botón

#### Scenario: Desplegar una sección
- **WHEN** en el panel se pulsa una sección con subsecciones
- **THEN** se despliegan sus subsecciones debajo y el botón de la sección pasa a `aria-expanded="true"`

### Requirement: Menú contextual
`ContextMenu` SHALL abrirse sobre una zona con el botón derecho, en el punto del puntero, o con el teclado (Mayús+F10 o la tecla de menú), con opciones que pueden llevar icono, atajo, marca de check o de punto, separadores y submenús. Escape SHALL cerrarlo y devolver el foco.

#### Scenario: Botón derecho
- **WHEN** se hace clic derecho dentro de la zona de un `ContextMenu`
- **THEN** no sale el menú del navegador, se abre el menú en el punto del clic con el foco en la primera opción, y elegir una opción la ejecuta y lo cierra

#### Scenario: Submenú
- **WHEN** con el foco en una opción con submenú se pulsa →
- **THEN** se abre el submenú a su lado con el foco en su primera opción, y ← lo cierra y vuelve a la opción

#### Scenario: Teclado
- **WHEN** con el foco en la zona se pulsa Mayús+F10
- **THEN** se abre el menú junto a la zona

### Requirement: Icono de ayuda
`HelpIcon` SHALL ser un botón con el icono de ayuda de 16px en `fg-quaternary` que, al pasar el ratón o enfocarlo, abre un tooltip con un título y un texto de apoyo opcional, en la posición que se le dé.

#### Scenario: Ayuda
- **WHEN** se enfoca un `HelpIcon` con título «Qué es esto» y posición `right`
- **THEN** es un botón con nombre «Ayuda: Qué es esto» y se abre a su derecha un tooltip con ese título

### Requirement: Pestañas verticales
`Tabs` SHALL admitir `orientation="vertical"`, que apila las pestañas y se recorre con ↑ y ↓, y los tipos `button-minimal` y, solo en vertical, `line`. Por debajo del ancho de escritorio, las pestañas verticales SHALL pasar a un desplegable con las mismas opciones. Sin las props nuevas, `Tabs` SHALL comportarse como hasta ahora.

#### Scenario: Vertical
- **WHEN** se pinta un `Tabs` con `orientation="vertical"` y `type="line"` y se pulsa ↓ sobre la primera pestaña
- **THEN** la lista tiene `aria-orientation="vertical"`, pasa a la segunda pestaña y la actual lleva una raya vertical de 2px en `fg-brand-primary`

#### Scenario: En móvil
- **WHEN** se pinta en vertical a 390px
- **THEN** en lugar de las pestañas se ve un desplegable con la actual elegida, y elegir otra cambia el panel

### Requirement: Tooltip con posición
`Tooltip` SHALL admitir la posición (arriba, abajo, izquierda o derecha), la alineación de la flecha (al centro, al principio o al final) y quitar la flecha. Sin esas props SHALL comportarse como hasta ahora: arriba y con la flecha centrada.

#### Scenario: Abajo
- **WHEN** se pinta un `Tooltip` con `placement="bottom"`
- **THEN** la burbuja sale debajo del elemento con la flecha arriba, apuntándole

#### Scenario: Sin cambios
- **WHEN** se compara la captura aprobada de `Tooltip` antes y después de este cambio
- **THEN** son iguales
