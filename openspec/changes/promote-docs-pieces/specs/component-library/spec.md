# Spec Delta

## MODIFIED Requirements

### Requirement: Catálogo completo de componentes
La librería SHALL exportar cada componente del catálogo del sistema, con su tipo de props, y el catálogo SHALL ser el mismo en el paquete, en la web y en el artefacto generado. El catálogo parte de los 74 componentes de la guía original y crece con cada cambio que añade uno.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen, como mínimo, ActivityFeed, Alert, AppIcon, Avatar, AvatarGroup, AvatarLabel, BackgroundPattern, Badge, Banner, BarChart, Breadcrumbs, BrowserFrame, Button, ButtonGroup, CalendarView, CardHeader, ChartLegend, Checkbox, CloseButton, CodeSnippet, ColorPicker, CommandMenu, ContentDivider, CopyTooltip, CreditCard, DatePicker, Dropdown, EmptyState, FeaturedIcon, FileUpload, FilterBar, Icon, InlineCTA, Input, Kbd, LineChart, LinkCard, Message, MessageInput, MetricCard, Modal, MultiSelect, Notification, NumberInput, PageHeader, Pager, Pagination, PieChart, ProgressBar, Radio, RadioGroup, ScaledPreview, SectionFooter, SectionHeader, Select, SidebarNav, Skeleton, Slideout, Slider, Spinner, Table, Tabs, Tag, TagInput, TextEditor, Textarea, Toggle, Tooltip, TransparencyGrid, TreeView, VerificationCodeInput y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCountdown, StreamEvents, StreamGoal, StreamScene y StreamStatus, todos con sus tipos de props

#### Scenario: Catálogo coherente
- **WHEN** se compara lo que exporta el paquete con los componentes que tienen página en la web
- **THEN** son la misma lista, sin componentes de más ni de menos en ninguno de los dos lados

## ADDED Requirements

### Requirement: Damero de transparencia
`TransparencyGrid` SHALL pintar detrás de su contenido un damero que indica transparencia, hecho con los tokens de fondo para que siga el tema. SHALL ofrecer un tamaño de cuadro pequeño y otro grande, y ser decorativo: sin papel en el árbol de accesibilidad.

#### Scenario: Sigue el tema
- **WHEN** un `TransparencyGrid` se pinta en claro y después dentro de un contenedor con `dark-mode`
- **THEN** sus cuadros usan en cada caso los colores de `bg-primary` y `bg-secondary` de ese tema

#### Scenario: Decorativo
- **WHEN** se pinta con un componente dentro
- **THEN** el damero no añade nada al árbol de accesibilidad y el componente de dentro se anuncia como siempre

### Requirement: Vista previa encogida
`ScaledPreview` SHALL pintar su contenido a un ancho real dado y encogerlo para que quepa en una caja de ancho y alto dados, sin desbordarla. Con una escala explícita SHALL usar esa; sin ella, la mayor que cabe sin pasar de 1: encoge, no amplía.

#### Scenario: Cabe sin escala dada
- **WHEN** un `ScaledPreview` con ancho real de 1920 y caja de 360×202 pinta una escena
- **THEN** la caja mide 360×202, el contenido se encoge a 0,1875 y nada sale de la caja

#### Scenario: No amplía
- **WHEN** un `ScaledPreview` de ancho real 200 se pinta en una caja de 360×100
- **THEN** el contenido se pinta a escala 1, sin ampliarlo

#### Scenario: Escala dada
- **WHEN** se le pasa `scale={0.5}` con ancho real de 400 y caja de 300×120
- **THEN** el contenido se pinta a 400 de ancho encogido a la mitad y lo que no cabe queda recortado por la caja

### Requirement: Tecla de atajo
`Kbd` SHALL pintar una tecla o atajo como elemento `kbd` en dos variantes: `menu`, la de los atajos de los menús, y `field`, la de la pista de un campo como «Ctrl K». Dropdown y CommandMenu SHALL usar la variante `menu`, con el mismo aspecto que hasta ahora.

#### Scenario: Dos variantes
- **WHEN** se pinta `<Kbd>⌘K</Kbd>` y `<Kbd variant="field">Ctrl K</Kbd>`
- **THEN** los dos son `kbd`; el primero lleva el texto de 12px de la fuente del cuerpo con filo `border-secondary`, y el segundo mide 22px de alto, con fondo `bg-secondary` y Geist Mono

#### Scenario: Menús sin cambios
- **WHEN** se compara la captura aprobada de Dropdown y CommandMenu antes y después de este cambio
- **THEN** son iguales

### Requirement: Card enlazada
`LinkCard` SHALL ser una card cuyo enlace cubre toda su superficie, con título, descripción y una zona de vista previa opcional que queda fuera del enlace, inerte y oculta a los lectores de pantalla. El foco y el paso del ratón SHALL marcar la card entera.

#### Scenario: Toda la card lleva al enlace
- **WHEN** se pulsa en cualquier punto de una `LinkCard`, también sobre su vista previa
- **THEN** se abre su enlace, cuyo nombre accesible es el título seguido de la descripción

#### Scenario: Vista previa inerte
- **WHEN** la vista previa contiene botones o enlaces dibujados
- **THEN** no reciben foco ni clics, y no aparecen en el árbol de accesibilidad

### Requirement: Anterior y siguiente
`Pager` SHALL pintar al final de una página una navegación «Anterior y siguiente» con hasta dos enlaces, cada uno con su dirección y el nombre de la página a la que lleva. Sin ninguno de los dos, no SHALL pintar nada.

#### Scenario: Solo siguiente
- **WHEN** se pinta un `Pager` con `next={{ href: "/b/", label: "Button group" }}` y sin `prev`
- **THEN** hay una navegación llamada «Anterior y siguiente» con un solo enlace, que lleva a `/b/` y dice «Siguiente» y «Button group»

### Requirement: Copiar con aviso junto a lo pulsado
El hook `useCopy` SHALL copiar un texto al portapapeles y avisar con `CopyTooltip`: una burbuja como la de `Tooltip`, junto al elemento pulsado, que dice solo «Copiado» (sin repetir lo copiado) o que no se pudo copiar. El aviso SHALL anunciarse sin mover el foco y desaparecer solo. `CodeSnippet` SHALL conservar su propia confirmación.

#### Scenario: Copia bien
- **WHEN** se pulsa un botón que copia `bg-brand-solid`
- **THEN** el portapapeles tiene `bg-brand-solid` y sobre el botón aparece una burbuja con `role="status"` que dice solo «Copiado», con el aspecto de `Tooltip`, y se va sola

#### Scenario: Valor largo
- **WHEN** se copia una variable de 60 caracteres
- **THEN** la burbuja sigue diciendo solo «Copiado» y mide lo mismo que con un valor corto

#### Scenario: Sin sitio arriba
- **WHEN** el elemento pulsado está pegado al borde superior de la ventana
- **THEN** la burbuja aparece debajo del elemento, sin salirse de la ventana

#### Scenario: HTML sin JavaScript propio
- **WHEN** en una página se monta un `CopyTooltip` con `copyAttribute="data-copy"` y se pulsa un botón de HTML estático con `data-copy="var(--bg-primary)"`
- **THEN** se copia `var(--bg-primary)` y la burbuja «Copiado» sale sobre ese botón

#### Scenario: El portapapeles falla
- **WHEN** el navegador rechaza escribir en el portapapeles
- **THEN** la burbuja dice «No se pudo copiar: selecciónalo a mano»

#### Scenario: CodeSnippet no cambia
- **WHEN** se copia el código de un `CodeSnippet`
- **THEN** el botón muestra su ✓ y «Copiado» como hasta ahora, sin burbuja
