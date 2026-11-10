# Spec Delta

## MODIFIED Requirements

### Requirement: Catálogo completo de componentes
La librería SHALL exportar cada componente del catálogo del sistema, con su tipo de props, y el catálogo SHALL ser el mismo en el paquete, en la web y en el artefacto generado. El catálogo parte de los 74 componentes de la guía original y crece con cada cambio que añade uno.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen, como mínimo, ActivityFeed, Alert, AppIcon, Avatar, AvatarGroup, AvatarLabel, BackgroundPattern, Badge, BadgeGroup, Banner, BarChart, Breadcrumbs, BrowserFrame, Button, ButtonGroup, ButtonUtility, CalendarView, CardHeader, Carousel, ChartLegend, Checkbox, CloseButton, CodeSnippet, ColorPicker, CommandMenu, ContentDivider, ContextMenu, CopyTooltip, CreditCard, DatePicker, Dropdown, EmptyState, FeaturedIcon, FileUpload, FilterBar, HeaderNav, HelpIcon, Icon, InlineCTA, Input, Kbd, LineChart, LinkCard, Message, MessageInput, MetricCard, Modal, MultiSelect, Notification, NumberInput, PageHeader, Pager, Pagination, PaginationDots, PieChart, ProgressBar, ProgressCircle, ProgressSteps, Radio, RadioGroup, ScaledPreview, SectionFooter, SectionHeader, SectionLabel, Select, SidebarNav, Skeleton, Slideout, Slider, Spinner, Table, Tabs, Tag, TagInput, TextEditor, Textarea, Toggle, Tooltip, TransparencyGrid, TreeView, VerificationCodeInput y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCountdown, StreamEvents, StreamGoal, StreamScene y StreamStatus, todos con sus tipos de props

#### Scenario: Catálogo coherente
- **WHEN** se compara lo que exporta el paquete con los componentes que tienen página en la web
- **THEN** son la misma lista, sin componentes de más ni de menos en ninguno de los dos lados

## ADDED Requirements

### Requirement: Grupo de badges
`BadgeGroup` SHALL pintar un badge con su texto delante o detrás de un mensaje, dentro de un contenedor del mismo color, en los tipos `pill` y `modern`, los colores gris, marca, error, aviso y éxito y los tamaños `md` y `lg`. Con `href` o `onClick` SHALL ser un enlace o un botón con una flecha al final y cambio de fondo al pasar por encima.

#### Scenario: Aviso de novedad
- **WHEN** se pinta `BadgeGroup` con `badge="Nuevo"`, el mensaje «Hemos publicado una función» y `href="/novedades"`
- **THEN** es un enlace cuyo nombre accesible incluye «Nuevo» y el mensaje, y termina con una flecha decorativa

#### Scenario: Sin acción
- **WHEN** se pinta `BadgeGroup` sin `href` ni `onClick`
- **THEN** no es un control interactivo y no lleva flecha

### Requirement: Etiqueta de sección
`SectionLabel` SHALL pintar el título de una sección con texto de apoyo opcional, en `sm` y `md`. Con `required` SHALL añadir una marca de obligatorio que los lectores de pantalla anuncien como texto; con `help` SHALL añadir un `HelpIcon` con ese texto; y con `actions` SHALL pintar debajo sus acciones.

#### Scenario: Obligatorio con ayuda
- **WHEN** se pinta `SectionLabel` con `title="Equipo"`, `required` y `help="Quién puede ver el proyecto"`
- **THEN** el título lleva un asterisco de color de marca con un texto para lectores que dice que es obligatorio, y un botón de ayuda que abre ese texto en un tooltip

#### Scenario: Nivel de encabezado
- **WHEN** se pinta `SectionLabel` con `as="h2"`
- **THEN** el título es un `h2`; sin `as`, es un `h3`

### Requirement: Botón utilitario
`ButtonUtility` SHALL ser un botón de solo icono en tamaños `xs` y `sm` y jerarquías `secondary` y `tertiary`, con nombre accesible obligatorio, que SHALL mostrarse en un tooltip al pasar el ratón o enfocarlo con el teclado. Con `href` SHALL ser un enlace con el mismo aspecto.

#### Scenario: Nombre en tooltip
- **WHEN** el usuario llega con Tab a un `ButtonUtility` con `icon="copy-01"` y `label="Copiar"`
- **THEN** el botón se llama «Copiar», muestra el anillo de foco y abre un tooltip con «Copiar»

#### Scenario: Deshabilitado
- **WHEN** se pinta `ButtonUtility` con `disabled`
- **THEN** está al 50 % de opacidad, no responde y no abre su tooltip

### Requirement: Estilos de spinner
`Spinner` SHALL ofrecer los estilos `line-simple` (arco sobre su pista, el de siempre y el de por defecto), `line-spinner` (solo el arco) y `dot-circle` (un círculo de dieciséis puntos que se desvanecen), en sus cuatro tamaños. Todos SHALL girar más despacio con movimiento reducido y anunciar su texto como hasta ahora.

#### Scenario: Sin estilo
- **WHEN** se pinta `Spinner` sin `variant`
- **THEN** el HTML es el mismo que antes de este cambio

#### Scenario: Círculo de puntos
- **WHEN** se pinta `Spinner` con `variant="dot-circle"`
- **THEN** se ve un círculo de puntos que gira, y el estado se anuncia con «Cargando…»

### Requirement: Cabeceras del estado vacío
`EmptyState` SHALL ofrecer como cabecera el icono destacado (por defecto), una ilustración (`cloud`, `box`, `documents`, `credit-card`), un icono de archivo sobre cuadrícula, una carpeta, una carpeta translúcida, usuarios en círculos, usuarios en fila o integraciones, en `sm`, `md` y `lg`. Las cabeceras SHALL ser decorativas y adaptarse a los dos temas.

#### Scenario: Por defecto
- **WHEN** se pinta `EmptyState` solo con `title` y `description`
- **THEN** se ve igual que antes de este cambio, con el icono destacado

#### Scenario: Ilustración en oscuro
- **WHEN** se pinta `EmptyState` con `media="illustration"` e `illustration="box"` dentro de `.dark-mode`
- **THEN** la ilustración usa los colores del tema oscuro y queda oculta para los lectores de pantalla

### Requirement: Avatares y logos del estado vacío
Las cabeceras de usuarios e integraciones de `EmptyState` SHALL pintar los avatares o logos que reciban (`items`), sea cual sea su contenido (fotos, iniciales o logos), recortados y desvanecidos hacia los bordes como en el Figma, y SHALL pintarse sin ellos con su icono central.

#### Scenario: Integraciones con logos
- **WHEN** se pinta `EmptyState` con `media="integrations"` e `items` con doce logos de `@jotis-me/icons/logos`
- **THEN** se ven dos filas de logos que se desvanecen hacia los lados sobre el título

#### Scenario: Usuarios sin fotos
- **WHEN** se pinta `EmptyState` con `media="users-radius"` e `items` con avatares de iniciales
- **THEN** los avatares se reparten por los círculos concéntricos, con la lupa en el centro
