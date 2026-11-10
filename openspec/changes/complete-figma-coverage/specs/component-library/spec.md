# Spec Delta

## MODIFIED Requirements

### Requirement: Catálogo completo de componentes
La librería SHALL exportar cada componente del catálogo del sistema, con su tipo de props, y el catálogo SHALL ser el mismo en el paquete, en la web y en el artefacto generado. El catálogo parte de los 74 componentes de la guía original y crece con cada cambio que añade uno.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen, como mínimo, Accordion, ActivityFeed, ActivityGauge, Alert, AppIcon, AppStoreBadge, Avatar, AvatarGroup, AvatarLabel, AvatarProfilePhoto, BackgroundOverlay, BackgroundPattern, Badge, BadgeGroup, Banner, BarChart, BlogPostCard, Breadcrumbs, BrowserFrame, Button, ButtonGroup, ButtonUtility, CalendarView, CardHeader, Carousel, ChartLegend, ChartMarker, CheckIcon, CheckItem, Checkbox, CloseButton, CodeSnippet, ColorPicker, ColorPickerDropdown, CommandMenu, ContentDivider, ContextMenu, CopyTooltip, CreditCard, DatePicker, Dropdown, EmptyState, FeaturedIcon, FileUpload, FilterBar, FilterMenu, FilterPanel, Footer, HeaderNav, HelpIcon, Icon, InlineCTA, Input, JobPostCard, Kbd, LaptopMockup, LineChart, LinkCard, MarketingNav, Message, MessageInput, MetricCard, Modal, MultiSelect, Notification, NumberInput, PageHeader, Pager, Pagination, PaginationDots, PhoneMockup, PieChart, PricingCard, ProgressBar, ProgressCircle, ProgressSteps, RadarChart, Radio, RadioGroup, Rating, RatingBadge, ScaledPreview, ScreenMockup, SectionFooter, SectionHeader, SectionLabel, Select, SidebarNav, Skeleton, Slideout, Slider, SocialButton, SocialButtonGroup, Spinner, SubscribeCard, Table, Tabs, Tag, TagInput, TeamMemberCard, Testimonial, TextEditor, Textarea, Toggle, Tooltip, TransparencyGrid, TreeView, VerificationCodeInput y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCountdown, StreamEvents, StreamGoal, StreamScene y StreamStatus, todos con sus tipos de props

#### Scenario: Catálogo coherente
- **WHEN** se compara lo que exporta el paquete con los componentes que tienen página en la web
- **THEN** son la misma lista, sin componentes de más ni de menos en ninguno de los dos lados

## ADDED Requirements

### Requirement: Cobertura del Figma
Cada componente del Figma «Yoruverse UI v8.0» que no sea una sección de página, una página completa o una pieza interna (nombre con «_») SHALL tener su equivalente en Regula con todas sus variantes, como componente, como variante de un componente o como composición de ejemplo en la web. Cuando el Figma y una ficha no coincidan, SHALL valer el Figma y la ficha SHALL actualizarse.

#### Scenario: Variante del Figma
- **WHEN** se toma cualquier propiedad de variante de un componente incluido del Figma y cualquiera de sus valores
- **THEN** hay una forma documentada de pintar ese valor con los componentes de Regula

### Requirement: Iconos de cualquier set en los componentes
Las props de icono de los componentes (`icon`, `iconLeading`, `iconTrailing` y similares) SHALL aceptar el nombre de un icono del set núcleo o un nodo ya pintado, de modo que se pueda usar cualquiera de los 1.173 iconos del set completo sin que el componente cargue el set entero.

#### Scenario: Icono fuera del núcleo
- **WHEN** se pinta `Button` con `iconLeading={<IconRocket02 />}`, un icono que no está en el núcleo
- **THEN** el botón pinta ese icono con el tamaño y el color de su sitio, y el paquete empaquetado no contiene el dibujo de ningún otro icono fuera del núcleo

### Requirement: Variantes de avatar
`Avatar` SHALL ofrecer, además de los estados en línea y desconectado, la insignia de verificado, un contador y un avatar pequeño de empresa en la esquina, en sus seis tamaños, y sin foto ni iniciales SHALL pintar el icono de usuario. `AvatarGroup` SHALL ofrecer un botón de añadir al final, con nombre accesible. `AvatarLabel` SHALL ofrecer los tamaños `sm`, `md` y `lg`.

#### Scenario: Verificado
- **WHEN** se pinta `Avatar` con `badge="verified"`
- **THEN** lleva en la esquina la marca de verificado del Figma, con un texto para lectores que lo dice

#### Scenario: Añadir al grupo
- **WHEN** se pinta `AvatarGroup` con `onAdd` y `addLabel="Invitar"`
- **THEN** al final hay un botón redondo con el icono de más que se llama «Invitar»

### Requirement: Foto de perfil
`AvatarProfilePhoto` SHALL pintar la foto de perfil grande del Figma con su filo blanco y su sombra, en `sm`, `md` y `lg`, con foto, iniciales o icono, y con la insignia de verificado opcional.

#### Scenario: Sin foto
- **WHEN** se pinta `AvatarProfilePhoto` sin `src` ni `initials`
- **THEN** se ve el círculo con el icono de usuario del tamaño que toca

### Requirement: Variantes de badge y tag
`Badge` SHALL aceptar una bandera o un avatar delante, un icono detrás y el modo de solo icono con nombre accesible. `Tag` SHALL aceptar una bandera o un avatar delante y una casilla de selección que lo marque y lo desmarque.

#### Scenario: Badge con bandera
- **WHEN** se pinta `Badge` con `flag={<FlagEs />}` y el texto «España»
- **THEN** la bandera va delante, redonda y del tamaño del badge

#### Scenario: Tag con casilla
- **WHEN** el usuario pulsa la casilla de un `Tag` con `checkable`
- **THEN** la casilla cambia de estado, se anuncia como casilla marcada o no y el tag avisa con `onCheckedChange`

### Requirement: Variantes de grupo de botones y botón de cerrar
`ButtonGroup` SHALL ofrecer los tamaños `sm` y `md` y elementos con icono delante, de solo icono (con nombre accesible) o con punto. `CloseButton` SHALL ofrecer los tamaños `sm`, `md` y `lg` y la versión para fondo oscuro.

#### Scenario: Solo icono
- **WHEN** se pinta un elemento de `ButtonGroup` con `iconOnly="grid-01"` y `label="Cuadrícula"`
- **THEN** el elemento solo enseña el icono y se llama «Cuadrícula»

### Requirement: Botones de redes y de tiendas
`SocialButton` SHALL pintar el botón de inicio de sesión de Google, Facebook, Apple, X, Figma y Dribbble en `md` y `lg`, con texto o solo logo, y en los temas marca, gris y color. `SocialButtonGroup` SHALL agruparlos en fila o en columna. `AppStoreBadge` SHALL pintar el badge de Google Play, App Store, Mac App Store, Galaxy Store y AppGallery en `md` y `lg`, relleno o con contorno, como enlace.

#### Scenario: Botón de Google
- **WHEN** se pinta `SocialButton` con `provider="google"` y `theme="gray"`
- **THEN** es un botón con el logo de Google y el texto por defecto en castellano para entrar con Google

#### Scenario: Badge de tienda
- **WHEN** se pinta `AppStoreBadge` con `store="app-store"` y `href`
- **THEN** es un enlace con el badge de App Store cuyo nombre accesible dice la tienda

### Requirement: Variantes de menú desplegable
`Dropdown` SHALL ofrecer los tipos del Figma: búsqueda dentro del menú, lista de integraciones con sus logos, las seis variantes de cuenta (botón, avatar, tarjeta `xs`, `sm` y `md` y migas) con la cabecera de cuenta y la lista de cuentas, el disparador de tipo enlace y el pie con texto o botón.

#### Scenario: Buscar en el menú
- **WHEN** el usuario abre un `Dropdown` con `searchable` y escribe «inv»
- **THEN** solo quedan las opciones que contienen «inv» y el foco sigue en el buscador

#### Scenario: Cambiar de cuenta
- **WHEN** el usuario abre un `Dropdown` de cuenta y elige otra cuenta de la lista
- **THEN** la cuenta elegida queda marcada y el componente avisa con su valor

### Requirement: Variantes de campos de texto
`Input` SHALL ofrecer el campo de tarjeta de pago (con el logo de la red detectada), el botón detrás, el campo de fecha y hora y el campo de archivo. `Textarea` SHALL ofrecer etiquetas dentro y fuera del campo, como `TagInput`.

#### Scenario: Tarjeta de pago
- **WHEN** el usuario escribe un número que empieza por 4 en un `Input` con `type="card"`
- **THEN** el campo agrupa los dígitos de cuatro en cuatro y enseña delante el logo de Visa

#### Scenario: Botón detrás
- **WHEN** se pinta `Input` con `trailingButton={{ label: "Copiar", icon: "copy-01" }}`
- **THEN** el botón va pegado al campo por la derecha, con el filo compartido del Figma

### Requirement: Variantes de selección
`Select` SHALL ofrecer el tipo con búsqueda (el campo filtra mientras se escribe) y el tipo con etiquetas. `RadioGroup` SHALL ofrecer los tipos con icono simple, avatar e icono de pago, además de los que ya tiene.

#### Scenario: Select con búsqueda
- **WHEN** el usuario escribe «mad» en un `Select` con `searchable`
- **THEN** la lista solo enseña las opciones que contienen «mad» y Enter elige la marcada

### Requirement: Variantes de progreso y slider
`ProgressBar` SHALL ofrecer la etiqueta flotante encima y debajo. `Slider` SHALL ofrecer el rango con dos mandos, la etiqueta debajo y la flotante encima con tooltip, manejable con el teclado en los dos mandos.

#### Scenario: Rango
- **WHEN** el usuario mueve con las flechas el mando izquierdo de un `Slider` con `range`
- **THEN** cambia solo el mínimo, que nunca pasa del máximo, y cada mando tiene su nombre accesible

### Requirement: Variantes del editor de texto
`TextEditor` SHALL ofrecer la barra de herramientas simple y la avanzada, la barra flotante que aparece al seleccionar texto, los tamaños `sm` y `md`, y los tooltips de cada botón.

#### Scenario: Barra flotante
- **WHEN** el usuario selecciona una palabra en un `TextEditor` con `toolbar="floating"`
- **THEN** aparece una barra sobre la selección con los botones de formato, y Escape la cierra

### Requirement: Tamaños del reproductor de vídeo
`VideoPlayer` SHALL ofrecer los tamaños `sm`, `md` y `lg` del Figma, que cambian los controles y la barra de acciones.

#### Scenario: Reproductor pequeño
- **WHEN** se pinta `VideoPlayer` con `size="sm"`
- **THEN** la barra de acciones y sus botones son los de `sm` del Figma

### Requirement: Variantes de feed y notificación
`ActivityFeed` SHALL ofrecer los divisores línea, divisor, conector y ninguno, el tipo de mensajes y los elementos de apoyo de etiquetas, archivo y texto. `Notification` SHALL ofrecer los tipos con imagen, con avatar y con indicador de progreso, además de los de icono.

#### Scenario: Notificación con progreso
- **WHEN** se pinta `Notification` con `progress={40}`
- **THEN** lleva debajo del texto una barra de progreso al 40 % anunciada como tal

### Requirement: Variantes de navegación
`SidebarNav` SHALL ofrecer los tipos simple, dos niveles, estrecho, secciones con divisores y secciones con subtítulos, con submenús desplegables, las tarjetas destacadas del Figma y la tarjeta de cuenta abierta y cerrada. `Breadcrumbs` SHALL ofrecer el divisor chevron y barra, y los tipos texto, texto con línea, botón y desplegables de cuenta. `Pagination` SHALL ofrecer los diez tipos del Figma en forma cuadrada y circular.

#### Scenario: Barra estrecha
- **WHEN** se pinta `SidebarNav` con `type="slim"`
- **THEN** solo enseña iconos, cada uno con su nombre en un tooltip, y el submenú se abre en un segundo panel

#### Scenario: Paginación de tarjeta
- **WHEN** se pinta `Pagination` con `type="card-minimal"` y `align="right"`
- **THEN** se ve el texto «Página 2 de 10» y los botones anterior y siguiente alineados a la derecha

### Requirement: Vistas de semana y día del calendario
`CalendarView` SHALL ofrecer las vistas de mes, semana y día, con el selector de vista, la columna de horas, los eventos de 30 a 120 minutos con sus nueve colores y la línea de la hora actual.

#### Scenario: Vista de semana
- **WHEN** se pinta `CalendarView` con `view="week"` y un evento de 10:00 a 11:30
- **THEN** el evento ocupa hora y media en la columna de su día, y la línea de la hora actual cruza el día de hoy

### Requirement: Variantes de gráficas
`LineChart` y `BarChart` SHALL ofrecer la leyenda arriba, a la derecha o ninguna, y los ejes con etiquetas o sin ellas. `ActivityGauge` SHALL pintar anillos concéntricos de progreso en `xs`, `sm`, `md` y `lg`, con leyenda abajo, a la derecha o ninguna. `RadarChart` SHALL pintar una o más series sobre ejes radiales con leyenda opcional. `ChartMarker` SHALL pintar el marcador de punto del Figma (línea, guion o mínimo) con su tooltip de valor.

#### Scenario: Gauge
- **WHEN** se pinta `ActivityGauge` con tres series de 80, 60 y 40 %
- **THEN** se ven tres anillos con esos avances, cada uno con su nombre y su valor accesibles

#### Scenario: Radar
- **WHEN** se pinta `RadarChart` con seis ejes y dos series
- **THEN** se ven dos polígonos con los colores de la paleta de series y una tabla accesible con sus valores

### Requirement: Variantes del selector de color
`ColorPicker` SHALL ofrecer los doce tipos del Figma: color sólido, paradas de degradado, subida de imagen, muestras, muestras guardadas `sm` y `md`, muestras de marca, muestras de grises, selector mínimo, barra de tono, barra de transparencia y selector de paleta. También SHALL ofrecer los modelos Hex, RGB, CSS, HSL y HSB. `ColorPickerDropdown` SHALL abrir el selector desde una muestra, un botón, un enlace, un campo hex o un select. El modal del selector SHALL estar como composición en la web.

#### Scenario: Cambiar de modelo
- **WHEN** el usuario cambia el modelo de un `ColorPicker` de Hex a HSL
- **THEN** los campos enseñan el mismo color en HSL y al editarlos el color cambia igual

#### Scenario: Degradado
- **WHEN** el usuario añade una parada en un `ColorPicker` con `type="gradient"`
- **THEN** aparece un mando nuevo en la barra, se puede mover y borrar con el teclado, y el componente avisa con la lista de paradas

### Requirement: Variantes del selector de fechas
`DatePicker` SHALL ofrecer el tipo de horas disponibles (una lista de horas elegibles junto al calendario) y la presentación en modal además del desplegable.

#### Scenario: Elegir hora
- **WHEN** el usuario elige un día y después «10:30» en un `DatePicker` con `times`
- **THEN** el componente avisa con la fecha y la hora, y la hora elegida queda marcada

### Requirement: Variantes de divisor, subida y CTA
`ContentDivider` SHALL ofrecer los tipos con botón, botón con icono y grupo de botones. `FileUpload` SHALL ofrecer el progreso como relleno del elemento además de la barra, y el icono simple o el de tipo de archivo. `InlineCTA` SHALL ofrecer los tipos de imagen, acciones, campo de email, cambio de plan, mejora de plan, método de pago y recibo.

#### Scenario: CTA con email
- **WHEN** el usuario escribe su correo en un `InlineCTA` con `type="email"` y pulsa el botón
- **THEN** el componente avisa con `onSubmit` y el correo escrito

### Requirement: Variantes de métricas y cabecera de página
`MetricCard` SHALL ofrecer los tipos simple, con icono (cuatro estilos) y con gráfica (cuatro estilos), con su mini gráfica y su cambio positivo o negativo. `PageHeader` SHALL ofrecer los estilos con avatar y con banner, centrados o no.

#### Scenario: Métrica con gráfica
- **WHEN** se pinta `MetricCard` con `chart={[…]}` y `trend="down"`
- **THEN** lleva a la derecha una mini gráfica en el color de error y el cambio en rojo con su flecha

### Requirement: Variantes de mensajería
`Message` SHALL ofrecer los tipos de mensaje, respuesta, archivo, audio, imagen, vídeo, vista previa de enlace, enlace mínimo y escribiendo. También SHALL ofrecer reacciones con contador, el panel de acciones y el estado de leído, sin leer o fallido. `MessageInput` SHALL ofrecer el tipo mínimo, el de área de texto y el avanzado con sus botones de adjuntar y formato.

#### Scenario: Mensaje fallido
- **WHEN** se pinta un `Message` enviado con `status="failed"`
- **THEN** lleva el icono de fallo con un texto para lectores, y pulsarlo avisa con `onRetry`

### Requirement: Variantes de cabecera de sección y árbol
`SectionHeader` SHALL ofrecer pestañas debajo y los tipos con botones, con búsqueda y con grupo de botones. `TreeView` SHALL ofrecer los tamaños `sm` y `md` y el tipo avanzado con conectores.

#### Scenario: Cabecera con pestañas
- **WHEN** se pinta `SectionHeader` con `tabs` de tres pestañas
- **THEN** las pestañas van debajo del título como `Tabs` de tipo subrayado y se manejan con las flechas

### Requirement: Variantes de tabla
`Table` SHALL ofrecer los tipos de celda del Figma: texto, avatar, icono de archivo, método de pago, badge, varios badges, tendencia, grupo de avatares, select, progreso, estrellas, botones de acción, iconos de acción y menú. También SHALL ofrecer cabeceras con orden y ayuda, la acción inicial de casilla, radio o interruptor, y filas alternas.

#### Scenario: Ordenar
- **WHEN** el usuario pulsa una cabecera de `Table` con `sortable`
- **THEN** la cabecera anuncia el orden ascendente con `aria-sort`, enseña la flecha y la tabla avisa con la columna y el sentido

#### Scenario: Seleccionar filas
- **WHEN** el usuario marca la casilla de la cabecera de una `Table` con `selection="checkbox"`
- **THEN** se marcan todas las filas visibles y la casilla de la cabecera queda marcada

### Requirement: Filtros
`FilterBar` SHALL ofrecer los ocho tipos del Figma: simple, pestañas y búsqueda, pestañas y selector de fechas, filtros de fecha, desplegables, desplegables y selector de fechas, y avanzado con filtros inactivos y con filtros activos. `FilterMenu` SHALL ser el desplegable de filtros con sus estados vacío, inactivo y activo. `FilterPanel` SHALL ser el contenido de filtros que se pone dentro de `Slideout`, con sus mismos tres estados.

#### Scenario: Filtros activos
- **WHEN** el usuario marca dos opciones en `FilterMenu` y lo cierra
- **THEN** el disparador enseña el número 2 y el componente avisa con las opciones marcadas

### Requirement: Fondos y marcos
`BackgroundPattern` SHALL ofrecer también el patrón tech grid. `BackgroundOverlay` SHALL pintar las capas de fondo del Figma (sólida, degradado y transparente, con desenfoque opcional) que se ponen detrás de un modal o una imagen. `CreditCard` SHALL ofrecer los trece temas del Figma. `BrowserFrame` SHALL ofrecer Safari, minimal monocromo y minimal en color, en claro y oscuro. `FeaturedIcon` SHALL ofrecer los estilos light, gradient, dark, modern, modern neue y outline.

#### Scenario: Tema de tarjeta
- **WHEN** se pinta `CreditCard` con `theme="gradient-strip-vertical"`
- **THEN** la tarjeta lleva la banda vertical con degradado del Figma

### Requirement: Mockups de pantallas y dispositivos
`ScreenMockup` SHALL pintar una captura en el marco 3:2 (seis tamaños) o en el marco modern, para escritorio y móvil. `LaptopMockup` SHALL pintar el portátil del Figma con una imagen o un nodo dentro de la pantalla. `PhoneMockup` SHALL pintar el teléfono con barra de estado y barra de inicio. Todos SHALL ser decorativos salvo la imagen de dentro, que conserva su texto alternativo.

#### Scenario: Contenido en el portátil
- **WHEN** se pinta `LaptopMockup` con una imagen de `alt="Panel de ventas"`
- **THEN** la imagen ocupa la pantalla del portátil y es lo único que anuncian los lectores

### Requirement: Iconos de comprobación y valoraciones
`CheckIcon` SHALL pintar la marca de comprobación en los tipos default, línea y relleno, en `xs` a `lg` y en marca, gris y éxito. `CheckItem` SHALL pintar esa marca con un texto, en `sm` a `lg`. `Rating` SHALL pintar de una a cinco estrellas con relleno de 0 a 100 % en pasos de 10, en amarillo o gris, con su valor accesible. `RatingBadge` SHALL pintar el badge de valoración del Figma.

#### Scenario: Valoración parcial
- **WHEN** se pinta `Rating` con `value={4.5}`
- **THEN** se ven cuatro estrellas llenas y una a medias, y los lectores anuncian «4,5 de 5»

### Requirement: Navegación y pie de marketing
`MarketingNav` SHALL pintar la cabecera de una web de marketing con menús desplegables (diez tipos) o a todo el ancho (diez tipos), con menú móvil y submenús. `Footer` SHALL pintar los veinte tipos del Figma en los temas default y marca. Los dos SHALL adaptarse a móvil como sus variantes del Figma.

#### Scenario: Menú a todo el ancho
- **WHEN** el usuario abre con el teclado un menú de `MarketingNav` con `menu="full-width"`
- **THEN** el panel ocupa el ancho de la página, el foco entra en él y Escape lo cierra devolviendo el foco al disparador

#### Scenario: Pie en móvil
- **WHEN** se pinta `Footer` en un contenedor de 375px de ancho
- **THEN** las columnas de enlaces se apilan como en la variante móvil del Figma

### Requirement: Tarjetas de marketing
Regula SHALL ofrecer las tarjetas de marketing del Figma con su variante de escritorio y móvil:
- `BlogPostCard`, en sus ocho tipos, vertical y horizontal;
- `SubscribeCard`, default y con línea;
- `PricingCard`, en sus diez tipos;
- `TeamMemberCard`, en sus siete tipos;
- `Testimonial`, la cita con imagen, flotante o a todo el ancho, en `sm` y `md`;
- `JobPostCard`, simple y en sus dos tipos de tarjeta.

#### Scenario: Tarjeta de precio
- **WHEN** se pinta `PricingCard` con `type="badge"`, un precio y una lista de ventajas
- **THEN** se ve el badge del plan, el precio con su periodo y cada ventaja con un `CheckItem`

### Requirement: Acordeón
`Accordion` SHALL pintar preguntas que abren y cierran su respuesta, con el aspecto del FAQ item del Figma, con divisor opcional e icono a la izquierda o a la derecha, y con la opción de dejar solo uno abierto.

#### Scenario: Abrir
- **WHEN** el usuario pulsa la pregunta de un `Accordion` cerrado
- **THEN** se abre la respuesta, el botón anuncia `aria-expanded="true"` y el icono pasa de más a menos
