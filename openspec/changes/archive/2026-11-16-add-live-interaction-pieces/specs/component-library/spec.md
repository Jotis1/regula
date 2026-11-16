# Spec Delta

## MODIFIED Requirements

### Requirement: Catálogo completo de componentes
La librería SHALL exportar cada componente del catálogo del sistema, con su tipo de props, y el catálogo SHALL ser el mismo en el paquete, en la web y en el artefacto generado. El catálogo parte de los 74 componentes de la guía original y crece con cada cambio que añade uno.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen, como mínimo, Accordion, ActivityFeed, ActivityGauge, Alert, AppIcon, AppStoreBadge, Avatar, AvatarGroup, AvatarLabel, AvatarProfilePhoto, BackgroundOverlay, BackgroundPattern, Badge, BadgeGroup, Banner, BarChart, BlogPostCard, Breadcrumbs, BrowserFrame, Button, ButtonGroup, ButtonUtility, CalendarView, CardHeader, Carousel, ChartLegend, ChartMarker, CheckIcon, CheckItem, Checkbox, CloseButton, CodeSnippet, ColorPicker, ColorPickerDropdown, CommandMenu, CompareSlider, ContentDivider, ContextMenu, CopyTooltip, CreditCard, DatePicker, Disclosure, Dropdown, EmptyState, ExampleCard, FeaturedIcon, FileUpload, FilterBar, FilterMenu, FilterPanel, Footer, HeaderNav, HelpIcon, IconTile, InlineCTA, Input, JobPostCard, Kbd, LaptopMockup, LineChart, LinkCard, MarketingNav, Message, MessageInput, MetricCard, Modal, MultiSelect, Notification, NumberInput, PageHeader, Pager, Pagination, PaginationDots, PhoneMockup, PieChart, PricingCard, ProgressBar, ProgressCircle, ProgressSteps, RadarChart, Radio, RadioGroup, Rating, RatingBadge, ScaledPreview, ScreenMockup, SectionFooter, SectionHeader, SectionLabel, Select, SidebarNav, Skeleton, Slideout, Slider, SocialButton, SocialButtonGroup, Spinner, Spotlight, SubscribeCard, Table, Tabs, Tag, TagInput, TeamMemberCard, Testimonial, TextEditor, Textarea, Toggle, TokenSwatch, Tooltip, TransparencyGrid, TreeView, VerificationCodeInput y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCounter, StreamCountdown, StreamEvents, StreamGoal, StreamMeter, StreamPinnedMessage, StreamPoll, StreamScene y StreamStatus, todos con sus tipos de props

#### Scenario: Catálogo coherente
- **WHEN** se compara lo que exporta el paquete con los componentes que tienen página en la web
- **THEN** son la misma lista, sin componentes de más ni de menos en ninguno de los dos lados

## ADDED Requirements

### Requirement: Encuesta y predicción del directo
`StreamPoll` SHALL enseñar una encuesta o una predicción con su título, cada opción con su cifra, su porcentaje y su barra, y el tiempo que queda a partir de `seconds`. Bloqueada, SHALL decir «Votación cerrada». Terminada, SHALL marcar la opción ganadora y decir cuál ha ganado. En una predicción, SHALL enseñar además cuánta gente ha apostado en cada opción. La entrada y la salida SHALL ir en `motion`.

#### Scenario: Encuesta en marcha
- **WHEN** se pinta `StreamPoll` con `variant="poll"`, «Sí» a 12 votos, «Ni loco» a 30 y `seconds={42}`
- **THEN** enseña «Encuesta», «Quedan 0:42», «Sí» con 29 % y «Ni loco» con 71 %

#### Scenario: Predicción bloqueada
- **WHEN** se pinta `StreamPoll` con `variant="prediction"` y `state="locked"`
- **THEN** enseña «Predicción», «Votación cerrada», los puntos de cada opción y cuántas personas han apostado

#### Scenario: Resultado
- **WHEN** se pinta `StreamPoll` con `state="ended"` y `winnerId` en «Ni loco»
- **THEN** «Ni loco» lleva la marca de ganadora con su barra en índigo, las demás barras quedan apagadas y el pie dice «Ha ganado Ni loco»

#### Scenario: Sin votos
- **WHEN** todas las opciones están a 0
- **THEN** todas enseñan 0 % y ninguna barra tiene relleno

### Requirement: Contadores del directo
`StreamCounter` SHALL enseñar en horizontal hasta dos contadores, cada uno con su texto y su cifra tabular. Al cambiar una cifra, SHALL cambiarla solo con un fundido. Un valor que no sea un entero de 0 o más SHALL pintarse como 0.

#### Scenario: Dos contadores
- **WHEN** se pinta `StreamCounter` con «Muertes» a 37 y «Sustos» a 12
- **THEN** se ven los dos en una fila, con las cifras en números tabulares

#### Scenario: Cambio de cifra
- **WHEN** «Muertes» pasa de 37 a 38
- **THEN** la cifra nueva entra con un fundido y sin desplazamiento

### Requirement: Mensaje destacado del directo
`StreamPinnedMessage` SHALL enseñar un mensaje del chat con su rótulo, sus insignias, el nombre en su tono y el texto como texto plano, con la misma fila que `ChatBox`. Un texto largo SHALL cortarse a cuatro líneas.

#### Scenario: Mensaje con HTML
- **WHEN** se pinta `StreamPinnedMessage` con `text="<b>hola</b>"`
- **THEN** se ve el texto literal `<b>hola</b>`, sin negrita

#### Scenario: Mensaje de 500 caracteres
- **WHEN** el mensaje tiene 500 caracteres
- **THEN** se ven como mucho cuatro líneas y la tarjeta no pasa de su ancho

### Requirement: Medidor del directo
`StreamMeter` SHALL enseñar su texto y una barra de 0 a 100 sin cifras, con `role="meter"`. Con `full`, SHALL marcarse como lleno con un anillo que entra y sale con un fundido.

#### Scenario: Nivel
- **WHEN** se pinta `StreamMeter` con `label="Nivel de miedo"` y `value={64}`
- **THEN** la barra está al 64 %, no hay cifras a la vista y el medidor tiene `aria-valuenow="64"` y se llama «Nivel de miedo»

#### Scenario: Valor fuera de rango
- **WHEN** `value` es 140, −5 o `NaN`
- **THEN** la barra se pinta al 100 %, al 0 % y al 0 %

#### Scenario: Lleno con movimiento reducido
- **WHEN** se pinta con `full` y `prefers-reduced-motion: reduce`
- **THEN** el anillo aparece con un fundido, sin escalas ni desplazamientos

### Requirement: Canje de puntos de canal
`StreamEventType` SHALL incluir `redemption`, con su icono y la etiqueta «Canje de puntos». `StreamAlert` y `StreamEvents` SHALL admitir `reward`, el nombre de la recompensa, que entra en su texto por defecto.

#### Scenario: Alerta de canje
- **WHEN** se pinta `StreamAlert` con `type="redemption"` y `reward="Elige el próximo susto"`
- **THEN** lleva el icono de canje y el texto «Ha canjeado Elige el próximo susto.»

#### Scenario: Canje en la lista
- **WHEN** `StreamEvents` recibe un canje de «Hidratarse»
- **THEN** su fila dice «Canje de puntos · Hidratarse»

### Requirement: Chat seleccionable
`ChatBox` SHALL admitir `onSelect` y `selectedId`. Con `onSelect`, cada mensaje con `id` y sin `selectable: false` SHALL ser un botón que llama a `onSelect` con su mensaje, y el elegido SHALL marcarse con `aria-pressed` y a la vista. Sin `onSelect`, `ChatBox` MUST NOT tener botones.

#### Scenario: Elegir un mensaje
- **WHEN** en un `ChatBox` con `onSelect` se pulsa el mensaje de «lucia_88»
- **THEN** se llama a `onSelect` con ese mensaje

#### Scenario: Elegido a la vista
- **WHEN** `selectedId` es el de un mensaje
- **THEN** ese mensaje lleva `aria-pressed="true"`, fondo activo y borde índigo, y los demás `aria-pressed="false"`

#### Scenario: Mensaje no seleccionable
- **WHEN** un mensaje lleva `selectable: false` o no tiene `id`
- **THEN** no es un botón y no se puede elegir

#### Scenario: Con teclado
- **WHEN** se llega con Tab a un mensaje y se pulsa Enter
- **THEN** el mensaje lleva el anillo de foco y se llama a `onSelect`

#### Scenario: Sin onSelect
- **WHEN** se pinta `ChatBox` sin `onSelect`
- **THEN** no hay ningún botón y los mensajes se pintan como en el resto del chat

### Requirement: Enlaces en el chat
`ChatBox` y `StreamPinnedMessage` SHALL marcar como enlace, con el color de marca y subrayado, cada dirección del texto que empiece por `http://`, `https://` o `www.`, sin la puntuación del final. El enlace SHALL seguir siendo texto plano y MUST NOT poder pulsarse.

#### Scenario: Mensaje con enlace
- **WHEN** un mensaje dice «mira https://jotis.me.»
- **THEN** `https://jotis.me` se ve subrayado y en el color de marca, el punto final no, y no hay ningún elemento `<a>`

#### Scenario: Con www
- **WHEN** un mensaje dice «www.jotis.me/videos»
- **THEN** `www.jotis.me/videos` se ve como enlace

#### Scenario: Sin protocolo
- **WHEN** un mensaje dice «voy por la v1.2, ok.vale»
- **THEN** no se marca nada como enlace

#### Scenario: Enlace con HTML
- **WHEN** un mensaje dice `https://x.com/<b>hola</b>`
- **THEN** se ve el texto literal, sin negrita

### Requirement: Insignias junto al nombre
En `ChatBox` y en `StreamPinnedMessage`, las insignias, el nombre y los dos puntos SHALL ir siempre en la misma línea, con las insignias centradas en altura con el nombre. Un texto largo SHALL partirse después del nombre, nunca entre las insignias y el nombre.

#### Scenario: Mensaje largo con insignias
- **WHEN** «TioBigotes», con las insignias de moderador, sub y VIP, escribe un mensaje de 300 caracteres en un `ChatBox` de 420 px
- **THEN** las tres insignias y «TioBigotes:» están en la primera línea, y el texto sigue a su lado y en las líneas de abajo

#### Scenario: Insignias centradas
- **WHEN** se pinta un mensaje con una insignia
- **THEN** el centro de la insignia y el centro del nombre están a la misma altura, con un píxel de diferencia como mucho
