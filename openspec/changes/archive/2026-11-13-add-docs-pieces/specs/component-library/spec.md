# Spec Delta

## MODIFIED Requirements

### Requirement: Catálogo completo de componentes
La librería SHALL exportar cada componente del catálogo del sistema, con su tipo de props, y el catálogo SHALL ser el mismo en el paquete, en la web y en el artefacto generado. El catálogo parte de los 74 componentes de la guía original y crece con cada cambio que añade uno.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen, como mínimo, Accordion, ActivityFeed, ActivityGauge, Alert, AppIcon, AppStoreBadge, Avatar, AvatarGroup, AvatarLabel, AvatarProfilePhoto, BackgroundOverlay, BackgroundPattern, Badge, BadgeGroup, Banner, BarChart, BlogPostCard, Breadcrumbs, BrowserFrame, Button, ButtonGroup, ButtonUtility, CalendarView, CardHeader, Carousel, ChartLegend, ChartMarker, CheckIcon, CheckItem, Checkbox, CloseButton, CodeSnippet, ColorPicker, ColorPickerDropdown, CommandMenu, CompareSlider, ContentDivider, ContextMenu, CopyTooltip, CreditCard, DatePicker, Disclosure, Dropdown, EmptyState, ExampleCard, FeaturedIcon, FileUpload, FilterBar, FilterMenu, FilterPanel, Footer, HeaderNav, HelpIcon, IconTile, InlineCTA, Input, JobPostCard, Kbd, LaptopMockup, LineChart, LinkCard, MarketingNav, Message, MessageInput, MetricCard, Modal, MultiSelect, Notification, NumberInput, PageHeader, Pager, Pagination, PaginationDots, PhoneMockup, PieChart, PricingCard, ProgressBar, ProgressCircle, ProgressSteps, RadarChart, Radio, RadioGroup, Rating, RatingBadge, ScaledPreview, ScreenMockup, SectionFooter, SectionHeader, SectionLabel, Select, SidebarNav, Skeleton, Slideout, Slider, SocialButton, SocialButtonGroup, Spinner, Spotlight, SubscribeCard, Table, Tabs, Tag, TagInput, TeamMemberCard, Testimonial, TextEditor, Textarea, Toggle, TokenSwatch, Tooltip, TransparencyGrid, TreeView, VerificationCodeInput y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCountdown, StreamEvents, StreamGoal, StreamScene y StreamStatus, todos con sus tipos de props

#### Scenario: Catálogo coherente
- **WHEN** se compara lo que exporta el paquete con los componentes que tienen página en la web
- **THEN** son la misma lista, sin componentes de más ni de menos en ninguno de los dos lados

## ADDED Requirements

### Requirement: Comparador con línea
`CompareSlider` SHALL superponer dos capas y descubrir la de abajo hasta una línea que el usuario mueve con el ratón, el dedo o el teclado. El control SHALL ser un deslizador con nombre accesible que anuncia el porcentaje y la capa que se ve a cada lado. La capa tapada SHALL quedar fuera del árbol de accesibilidad.

#### Scenario: Arrastrar
- **WHEN** en un `CompareSlider` con `defaultValue={50}` el usuario lleva la línea al 80 %
- **THEN** se ve el 80 % izquierdo de `before` y el 20 % derecho de `after`, y se llama a `onChange(80)`

#### Scenario: Con teclado
- **WHEN** el usuario llega con Tab al control y pulsa → tres veces y después Fin
- **THEN** el valor pasa a 53 y después a 100, con el anillo de foco visible

#### Scenario: Sin JavaScript
- **WHEN** se pinta en el servidor con `defaultValue={30}`
- **THEN** la línea está al 30 % y las dos capas se ven a su lado

### Requirement: Foco sobre una zona
`Spotlight` SHALL envolver un contenido y, con `active`, rodearlo de un anillo de marca y mostrar su nota, que SHALL enlazarse al contenido como descripción y anunciarse al activarse. Sin `active`, SHALL pintar solo el contenido.

#### Scenario: Señalar un cambio
- **WHEN** un `Spotlight` con `note="Ahora en gris"` pasa a `active`
- **THEN** el contenido lleva el anillo, la nota aparece junto a él y un lector oye «Ahora en gris»

#### Scenario: Movimiento reducido
- **WHEN** el sistema pide movimiento reducido
- **THEN** el anillo y la nota aparecen sin transición

### Requirement: Bloque plegable
`Disclosure` SHALL pintar un bloque con título, un acompañante opcional a la derecha y un contenido que se abre y se cierra con `<details>`, sin JavaScript, en `sm` y `md`.

#### Scenario: Grupo de propiedades
- **WHEN** se pinta `Disclosure` con `title="Iconos"`, `aside` con «3 props» y `defaultOpen`
- **THEN** se ve abierto, con «3 props» a la derecha del título, y se cierra al pulsar el título también con el JavaScript desactivado

### Requirement: Tarjeta de ejemplo
`ExampleCard` SHALL pintar un espécimen sobre el damero de transparencia con un pie que lleva un veredicto (`do`, `dont`, `instead` o `better`) como palabra e icono, y un texto. SHALL ser una figura con su leyenda.

#### Scenario: Esto no
- **WHEN** se pinta `ExampleCard` con `verdict="dont"`, dos botones primarios dentro y `caption="No apiles dos primarios."`
- **THEN** es un `<figure>` con los botones sobre el damero y una leyenda con un badge de error que dice «Esto no» y el texto

### Requirement: Baldosa de icono
`IconTile` SHALL pintar un icono con su nombre como botón que se puede elegir (o como enlace con `href`), con estado elegido que se anuncia y se ve sin depender solo del color, y con el nombre completo como nombre accesible aunque se recorte.

#### Scenario: Elegir
- **WHEN** se pulsa un `IconTile` con `label="Mail01"` y `onSelect`
- **THEN** se llama a `onSelect`, y con `selected` el botón tiene `aria-pressed="true"` y un filo de 2 px

### Requirement: Muestra de token
`TokenSwatch` SHALL pintar el nombre de un token de color con su valor claro y su valor oscuro a la vez, cada uno con su muestra y su hexadecimal, en fila o en tarjeta, y SHALL copiar su utilidad al pulsarla con el aviso de `CopyTooltip`.

#### Scenario: Los dos temas a la vez
- **WHEN** se pinta `TokenSwatch` de `text-primary` en una página oscura
- **THEN** se ven las muestras `#171717` y `#fafafa` con sus valores, cada una con un filo que se distingue de su propio color

#### Scenario: Copiar
- **WHEN** el usuario pulsa la utilidad `text-primary`
- **THEN** se copia al portapapeles y se confirma con «Copiado»
