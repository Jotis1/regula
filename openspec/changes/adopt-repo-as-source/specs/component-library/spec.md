# Spec Delta

## MODIFIED Requirements

### Requirement: Catálogo completo de componentes
La librería SHALL exportar cada componente del catálogo del sistema, con su tipo de props, y el catálogo SHALL ser el mismo en el paquete, en la web y en el artefacto generado. El catálogo parte de los 74 componentes de la guía original y crece con cada cambio que añade uno.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen, como mínimo, ActivityFeed, Alert, AppIcon, Avatar, AvatarGroup, AvatarLabel, BackgroundPattern, Badge, Banner, BarChart, Breadcrumbs, BrowserFrame, Button, ButtonGroup, CalendarView, CardHeader, ChartLegend, Checkbox, CloseButton, CodeSnippet, ColorPicker, CommandMenu, ContentDivider, CreditCard, DatePicker, Dropdown, EmptyState, FeaturedIcon, FileUpload, FilterBar, Icon, InlineCTA, Input, LineChart, Message, MessageInput, MetricCard, Modal, Notification, PageHeader, Pagination, PieChart, ProgressBar, Radio, RadioGroup, SectionFooter, SectionHeader, Select, SidebarNav, Skeleton, Slideout, Slider, Spinner, Table, Tabs, Tag, TextEditor, Textarea, Toggle, Tooltip, TreeView y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCountdown, StreamEvents, StreamGoal, StreamScene y StreamStatus, todos con sus tipos de props

#### Scenario: Catálogo coherente
- **WHEN** se compara lo que exporta el paquete con los componentes que tienen página en la web
- **THEN** son la misma lista, sin componentes de más ni de menos en ninguno de los dos lados

### Requirement: API pública según las fichas
Las props de cada componente SHALL coincidir en nombre, tipo y valores por defecto con sus tipos publicados y con la ficha de su página en la web; un cambio incompatible en ellas SHALL considerarse ruptura de API.

#### Scenario: Props del botón
- **WHEN** se usa `Button` con `hierarchy="secondary" size="lg" iconLeading="plus"`
- **THEN** se pinta un botón secundario de 44px de alto con el icono `plus` a la izquierda del texto

#### Scenario: Prop inexistente
- **WHEN** un proyecto TypeScript pasa `hierarchy="ghost"` a `Button`
- **THEN** la compilación falla con un error de tipo

### Requirement: Aspecto fiel a la guía
Cada componente SHALL reproducir, en claro y en oscuro, la captura aprobada de su ejemplo que se guarda en el repo, usando solo utilidades de los tokens semánticos y nunca hex ni paleta cruda (`bg-indigo-600`). Las capturas de los 74 componentes originales son las de la vista previa de la guía; las de un componente nuevo se aprueban al revisar su ejemplo.

#### Scenario: Comparación visual
- **WHEN** se compara la captura de cada ejemplo de la web con su captura aprobada, en ambos temas
- **THEN** no hay diferencias visibles de color, tamaño, radio, sombra ni tipografía

#### Scenario: Componente sin captura aprobada
- **WHEN** se ejecutan los tests visuales y un componente del catálogo no tiene captura aprobada en algún tema
- **THEN** el test falla indicando qué componente y qué tema faltan

#### Scenario: Sin colores crudos
- **WHEN** se analiza el código fuente de los componentes
- **THEN** no aparece ningún color hex ni utilidad de paleta cruda de Tailwind, salvo en los componentes cuya paleta fija documenta la guía: AppIcon (el tono de cada app), CreditCard (la tarjeta es un objeto y no cambia con el tema), BrowserFrame (el semáforo) y VideoPlayer (controles en blanco y negro sobre el vídeo); y las líneas sueltas que la guía fija y que se marcan con su motivo, como el brillo interior del botón primario
