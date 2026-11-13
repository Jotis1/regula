# Spec Delta

## MODIFIED Requirements

### Requirement: API pública según las fichas
Las props de cada componente SHALL coincidir en nombre, tipo y valores por defecto con sus tipos publicados y con la ficha de su página en la web; un cambio incompatible en ellas SHALL considerarse ruptura de API.

#### Scenario: Props del botón
- **WHEN** se usa `Button` con `hierarchy="secondary" size="lg" iconLeading={Plus}`, con `Plus` de `@untitledui/icons`
- **THEN** se pinta un botón secundario de 44px de alto con el icono `Plus` a la izquierda del texto

#### Scenario: Prop inexistente
- **WHEN** un proyecto TypeScript pasa `hierarchy="ghost"` a `Button`
- **THEN** la compilación falla con un error de tipo

### Requirement: Avatares y logos del estado vacío
Las cabeceras de usuarios e integraciones de `EmptyState` SHALL pintar los avatares o logos que reciban (`items`), sea cual sea su contenido (fotos, iniciales o logos), recortados y desvanecidos hacia los bordes como en el Figma, y SHALL pintarse sin ellos con su icono central.

#### Scenario: Integraciones con logos
- **WHEN** se pinta `EmptyState` con `media="integrations"` e `items` con doce logos de `@jotis-me/assets/logos`
- **THEN** se ven dos filas de logos que se desvanecen hacia los lados sobre el título

#### Scenario: Usuarios sin fotos
- **WHEN** se pinta `EmptyState` con `media="users-radius"` e `items` con avatares de iniciales
- **THEN** los avatares se reparten por los círculos concéntricos, con la lupa en el centro

### Requirement: Iconos de cualquier set en los componentes
Las props de icono de los componentes (`icon`, `iconLeading`, `iconTrailing`, `iconOnly` y similares) SHALL aceptar un componente de icono (el de `@untitledui/icons` o cualquiera que acepte `size` y `className`) o un nodo ya pintado, y no SHALL aceptar nombres en cadena. Cuando reciben un componente, SHALL pintarlo con el tamaño y el color de su sitio. El paquete SHALL contener solo los dibujos de los iconos que usan sus propios componentes.

#### Scenario: Icono fuera del núcleo
- **WHEN** se pinta `Button` con `iconLeading={Rocket02}`
- **THEN** el botón pinta ese icono con el tamaño y el color de su sitio, igual en `sm` que en `xl`

#### Scenario: Icono como nodo
- **WHEN** se pinta `Button` con `iconLeading={<Rocket02 className="text-fg-brand-primary" />}`
- **THEN** el botón pinta el nodo tal cual, con el color que trae

#### Scenario: Nombre en cadena
- **WHEN** un proyecto TypeScript pasa `iconLeading="plus"` a `Button`
- **THEN** la compilación falla con un error de tipo

#### Scenario: Solo lo que se usa
- **WHEN** una app importa solo `Button` y construye para producción
- **THEN** el bundle de cliente contiene el icono de carga del botón y ningún otro dibujo de `@untitledui/icons`

### Requirement: Botón utilitario
`ButtonUtility` SHALL ser un botón de solo icono en tamaños `xs` y `sm` y jerarquías `secondary` y `tertiary`, con nombre accesible obligatorio, que SHALL mostrarse en un tooltip al pasar el ratón o enfocarlo con el teclado. Con `href` SHALL ser un enlace con el mismo aspecto.

#### Scenario: Nombre en tooltip
- **WHEN** el usuario llega con Tab a un `ButtonUtility` con `icon={Copy01}` y `label="Copiar"`
- **THEN** el botón se llama «Copiar», muestra el anillo de foco y abre un tooltip con «Copiar»

#### Scenario: Deshabilitado
- **WHEN** se pinta `ButtonUtility` con `disabled`
- **THEN** está al 50 % de opacidad, no responde y no abre su tooltip

### Requirement: Variantes de grupo de botones y botón de cerrar
`ButtonGroup` SHALL ofrecer los tamaños `sm` y `md` y elementos con icono delante, de solo icono (con nombre accesible) o con punto. `CloseButton` SHALL ofrecer los tamaños `sm`, `md` y `lg` y la versión para fondo oscuro.

#### Scenario: Solo icono
- **WHEN** se pinta un elemento de `ButtonGroup` con `iconOnly={Grid01}` y `label="Cuadrícula"`
- **THEN** el elemento solo enseña el icono y se llama «Cuadrícula»

### Requirement: Catálogo completo de componentes
La librería SHALL exportar cada componente del catálogo del sistema, con su tipo de props, y el catálogo SHALL ser el mismo en el paquete, en la web y en el artefacto generado. El catálogo parte de los 74 componentes de la guía original y crece con cada cambio que añade uno.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen, como mínimo, Accordion, ActivityFeed, ActivityGauge, Alert, AppIcon, AppStoreBadge, Avatar, AvatarGroup, AvatarLabel, AvatarProfilePhoto, BackgroundOverlay, BackgroundPattern, Badge, BadgeGroup, Banner, BarChart, BlogPostCard, Breadcrumbs, BrowserFrame, Button, ButtonGroup, ButtonUtility, CalendarView, CardHeader, Carousel, ChartLegend, ChartMarker, CheckIcon, CheckItem, Checkbox, CloseButton, CodeSnippet, ColorPicker, ColorPickerDropdown, CommandMenu, ContentDivider, ContextMenu, CopyTooltip, CreditCard, DatePicker, Dropdown, EmptyState, FeaturedIcon, FileUpload, FilterBar, FilterMenu, FilterPanel, Footer, HeaderNav, HelpIcon, InlineCTA, Input, JobPostCard, Kbd, LaptopMockup, LineChart, LinkCard, MarketingNav, Message, MessageInput, MetricCard, Modal, MultiSelect, Notification, NumberInput, PageHeader, Pager, Pagination, PaginationDots, PhoneMockup, PieChart, PricingCard, ProgressBar, ProgressCircle, ProgressSteps, RadarChart, Radio, RadioGroup, Rating, RatingBadge, ScaledPreview, ScreenMockup, SectionFooter, SectionHeader, SectionLabel, Select, SidebarNav, Skeleton, Slideout, Slider, SocialButton, SocialButtonGroup, Spinner, SubscribeCard, Table, Tabs, Tag, TagInput, TeamMemberCard, Testimonial, TextEditor, Textarea, Toggle, Tooltip, TransparencyGrid, TreeView, VerificationCodeInput y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCountdown, StreamEvents, StreamGoal, StreamScene y StreamStatus, todos con sus tipos de props

#### Scenario: Catálogo coherente
- **WHEN** se compara lo que exporta el paquete con los componentes que tienen página en la web
- **THEN** son la misma lista, sin componentes de más ni de menos en ninguno de los dos lados
