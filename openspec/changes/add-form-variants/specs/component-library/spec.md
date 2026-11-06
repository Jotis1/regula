# Spec Delta

## MODIFIED Requirements

### Requirement: Catálogo completo de componentes
La librería SHALL exportar cada componente del catálogo del sistema, con su tipo de props, y el catálogo SHALL ser el mismo en el paquete, en la web y en el artefacto generado. El catálogo parte de los 74 componentes de la guía original y crece con cada cambio que añade uno.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen, como mínimo, ActivityFeed, Alert, AppIcon, Avatar, AvatarGroup, AvatarLabel, BackgroundPattern, Badge, Banner, BarChart, Breadcrumbs, BrowserFrame, Button, ButtonGroup, CalendarView, CardHeader, ChartLegend, Checkbox, CloseButton, CodeSnippet, ColorPicker, CommandMenu, ContentDivider, CreditCard, DatePicker, Dropdown, EmptyState, FeaturedIcon, FileUpload, FilterBar, Icon, InlineCTA, Input, LineChart, Message, MessageInput, MetricCard, Modal, MultiSelect, Notification, NumberInput, PageHeader, Pagination, PieChart, ProgressBar, Radio, RadioGroup, SectionFooter, SectionHeader, Select, SidebarNav, Skeleton, Slideout, Slider, Spinner, Table, Tabs, Tag, TagInput, TextEditor, Textarea, Toggle, Tooltip, TreeView, VerificationCodeInput y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCountdown, StreamEvents, StreamGoal, StreamScene y StreamStatus, todos con sus tipos de props

#### Scenario: Catálogo coherente
- **WHEN** se compara lo que exporta el paquete con los componentes que tienen página en la web
- **THEN** son la misma lista, sin componentes de más ni de menos en ninguno de los dos lados

## ADDED Requirements

### Requirement: Campos de formulario con la misma forma
Los campos de formulario nuevos (`NumberInput`, `TagInput`, `VerificationCodeInput` y `MultiSelect`) SHALL admitir las mismas props `label`, `required`, `hint` y `error` que `Input`, con el mismo aspecto y el mismo enlace accesible del error. Cuando tengan alto propio, SHALL ofrecer los tamaños `sm`, `md` y `lg` de `Input`.

#### Scenario: Error en un campo nuevo
- **WHEN** un `NumberInput` recibe `label="Invitados"` y `error="Como mucho, 12."`
- **THEN** la etiqueta se ve encima del campo, el mensaje se ve debajo en `text-error-primary`, el borde pasa a error y el campo lleva `aria-invalid="true"` enlazado al mensaje

#### Scenario: Misma altura que Input
- **WHEN** se pintan en una fila un `Input`, un `NumberInput`, un `TagInput` y un `MultiSelect`, todos con `size="lg"`
- **THEN** los cuatro controles miden 44px de alto mientras no haya etiquetas que hagan crecer el campo

### Requirement: Campo con texto o desplegable delante y detrás
`Input` SHALL admitir un texto fijo delante del valor y un desplegable delante o detrás, dentro del mismo marco. Lo que se escribe y la opción elegida SHALL ser dos valores distintos, cada uno con su nombre accesible.

#### Scenario: Texto fijo delante
- **WHEN** se pinta un `Input` con el texto fijo `https://` y el usuario escribe `jotis.me`
- **THEN** el campo muestra `https://` en `text-tertiary`, separado por un borde del valor, y el valor del campo es `jotis.me`

#### Scenario: Desplegable de prefijo
- **WHEN** se pinta un `Input` con un desplegable delante con las opciones `+34` y `+351`, y el usuario elige `+351`
- **THEN** el desplegable avisa del cambio con su propio valor, el texto escrito no cambia y un lector de pantalla anuncia el desplegable con su etiqueta, distinta de la del campo

### Requirement: Contraseña que se puede mostrar
Un `Input` con `type="password"` SHALL incluir un botón para mostrar u ocultar lo escrito. El botón SHALL tener un nombre accesible que diga qué hace en cada momento y SHALL dejar el foco en el botón.

#### Scenario: Mostrar la contraseña
- **WHEN** el usuario escribe en un campo de contraseña y pulsa el botón «Mostrar contraseña»
- **THEN** el texto se ve en claro, el botón pasa a llamarse «Ocultar contraseña» con `aria-pressed="true"` y el texto escrito no se pierde

#### Scenario: Sin botón
- **WHEN** se desactiva el botón en un campo de contraseña
- **THEN** el campo se pinta como un `Input` normal de contraseña, sin botón

### Requirement: Campo numérico con pasos
`NumberInput` SHALL ofrecer un valor numérico con botones de restar y sumar, en horizontal o en vertical, y SHALL respetar el mínimo, el máximo y el paso. SHALL mostrar el número con el formato `es-ES` y aceptar la coma como separador decimal.

#### Scenario: Pasos con teclado
- **WHEN** el foco está en un `NumberInput` con valor 3, paso 1 y máximo 4, y el usuario pulsa la flecha arriba dos veces
- **THEN** el valor pasa a 4, se queda en 4 y el botón de sumar queda deshabilitado

#### Scenario: Decimal con coma
- **WHEN** el usuario escribe `12,5` en un `NumberInput` con paso 0,5
- **THEN** el valor es 12.5 y el campo muestra `12,5`

### Requirement: Campo de etiquetas
`TagInput` SHALL convertir el texto escrito en una etiqueta al pulsar Enter o coma. SHALL mostrar las etiquetas dentro del campo o debajo, dejar quitar cada una con su botón o con Retroceso en el campo vacío y no admitir etiquetas repetidas ni vacías.

#### Scenario: Añadir y quitar
- **WHEN** el usuario escribe `diseño`, pulsa Enter, escribe `diseño` otra vez, pulsa Enter y luego pulsa Retroceso con el campo vacío
- **THEN** tras el primer Enter hay una etiqueta `diseño`, el segundo no añade otra y Retroceso la quita, todo avisado con el valor nuevo

#### Scenario: Quitar con su botón
- **WHEN** el usuario llega con Tab al botón de cerrar de la etiqueta `diseño` y pulsa Enter
- **THEN** la etiqueta desaparece y el foco vuelve al campo de texto

### Requirement: Código de verificación
`VerificationCodeInput` SHALL pedir un código de 4 o 6 dígitos con una casilla por dígito. El foco SHALL pasar solo a la casilla siguiente o a la anterior. Pegar o autocompletar el código entero SHALL rellenar todas las casillas. Al completarse, SHALL avisar con el código.

#### Scenario: Escribir y borrar
- **WHEN** el usuario escribe `4`, `8` y `1` en un código de 6 dígitos y luego pulsa Retroceso dos veces
- **THEN** el foco avanza a la cuarta casilla, el primer Retroceso borra el `1` y deja el foco en la tercera, y el segundo borra el `8`

#### Scenario: Pegar el código
- **WHEN** el usuario pega `482913` en la primera casilla
- **THEN** las seis casillas quedan rellenas, el foco va a la última y el componente avisa del código completo `482913` una sola vez

#### Scenario: Casillas con nombre
- **WHEN** un lector de pantalla recorre las casillas de un código de 6 dígitos con la etiqueta «Código de verificación»
- **THEN** cada casilla se anuncia como «Dígito 1 de 6» a «Dígito 6 de 6» dentro de un grupo con esa etiqueta, solo admite cifras y la primera pide el autocompletado de código de un solo uso

### Requirement: Selección múltiple con búsqueda
`MultiSelect` SHALL dejar elegir varias opciones de una lista que se filtra al escribir. SHALL mostrar las opciones elegidas como etiquetas que se pueden quitar, manejarse entero con teclado y avisar en castellano cuando la búsqueda no encuentra nada.

#### Scenario: Elegir con teclado
- **WHEN** el foco está en un `MultiSelect`, el usuario escribe `ma`, baja con la flecha a «Marta» y pulsa Enter
- **THEN** «Marta» queda elegida y se ve como etiqueta en el campo, la lista sigue abierta con «Marta» marcada y el texto buscado se vacía

#### Scenario: Búsqueda sin resultados
- **WHEN** el usuario escribe un texto que no coincide con ninguna opción
- **THEN** la lista muestra un texto en castellano que dice que no hay resultados, y ese texto se puede sustituir por prop

#### Scenario: Cerrar sin perder la selección
- **WHEN** hay dos opciones elegidas y el usuario pulsa Escape
- **THEN** la lista se cierra, las dos etiquetas siguen en el campo y el foco se queda en el campo

### Requirement: Opciones en tarjetas
`RadioGroup` SHALL admitir un aspecto de tarjeta, en el que cada opción es una tarjeta con borde que puede llevar un icono, un avatar o un logo de pago. La tarjeta elegida SHALL marcarse con borde `border-brand` y su indicador. El teclado y la semántica SHALL ser los mismos del grupo normal.

#### Scenario: Elegir una tarjeta
- **WHEN** se pinta un `RadioGroup` de tarjetas con tres planes y el usuario pulsa la flecha abajo desde el primero
- **THEN** el segundo plan queda elegido, su tarjeta muestra el borde `border-brand` y el indicador marcado, y la primera vuelve a su borde normal

#### Scenario: Aspecto por defecto
- **WHEN** se pinta un `RadioGroup` sin indicar el aspecto
- **THEN** se ve igual que su captura aprobada anterior a este cambio

### Requirement: Interruptor fino
`Toggle` SHALL admitir la variante `slim` del Figma: una pista más fina que el tirador, en los dos tamaños, con los mismos estados, teclado y semántica de `role="switch"` del interruptor normal.

#### Scenario: Interruptor fino con teclado
- **WHEN** el foco está en un `Toggle` `slim` apagado y el usuario pulsa Espacio
- **THEN** pasa a encendido con la pista en `bg-brand-solid` y el anillo de foco visible, y un lector de pantalla lo anuncia como interruptor activado
