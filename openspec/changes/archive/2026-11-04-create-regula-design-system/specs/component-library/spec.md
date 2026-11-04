# Spec Delta

## Purpose

Da a las apps de la suite los componentes de la guía de diseño ya construidos en React, con la API, los estados y las reglas de sus fichas, para usarlos igual en Next.js y en Astro sin rediseñarlos en cada proyecto.

## ADDED Requirements

### Requirement: Catálogo completo de componentes
La librería SHALL exportar los 74 componentes que tienen ficha en la guía, con el mismo nombre que en ella, cada uno con su tipo de props.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen ActivityFeed, Alert, AppIcon, Avatar, AvatarGroup, AvatarLabel, BackgroundPattern, Badge, Banner, BarChart, Breadcrumbs, BrowserFrame, Button, ButtonGroup, CalendarView, CardHeader, ChartLegend, Checkbox, CloseButton, CodeSnippet, ColorPicker, CommandMenu, ContentDivider, CreditCard, DatePicker, Dropdown, EmptyState, FeaturedIcon, FileUpload, FilterBar, Icon, InlineCTA, Input, LineChart, Message, MessageInput, MetricCard, Modal, Notification, PageHeader, Pagination, PieChart, ProgressBar, Radio, RadioGroup, SectionFooter, SectionHeader, Select, SidebarNav, Skeleton, Slideout, Slider, Spinner, Table, Tabs, Tag, TextEditor, Textarea, Toggle, Tooltip, TreeView y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCountdown, StreamEvents, StreamGoal, StreamScene y StreamStatus, todos con sus tipos de props

### Requirement: API pública según las fichas
Las props de cada componente SHALL coincidir en nombre, tipo y valores por defecto con las declaradas en `index.d.ts` y en la ficha del componente de la guía; un cambio incompatible en ellas SHALL considerarse ruptura de API.

#### Scenario: Props del botón
- **WHEN** se usa `Button` con `hierarchy="secondary" size="lg" iconLeading="plus"`
- **THEN** se pinta un botón secundario de 44px de alto con el icono `plus` a la izquierda del texto

#### Scenario: Prop inexistente
- **WHEN** un proyecto TypeScript pasa `hierarchy="ghost"` a `Button`
- **THEN** la compilación falla con un error de tipo

### Requirement: Aspecto fiel a la guía
Cada componente SHALL reproducir el aspecto de su vista previa en la guía, en claro y en oscuro, usando solo utilidades de los tokens semánticos y nunca hex ni paleta cruda (`bg-indigo-600`).

#### Scenario: Comparación visual
- **WHEN** se compara la captura de cada ejemplo de la web con la vista previa del componente en la guía, en ambos temas
- **THEN** no hay diferencias visibles de color, tamaño, radio, sombra ni tipografía

#### Scenario: Sin colores crudos
- **WHEN** se analiza el código fuente de los componentes
- **THEN** no aparece ningún color hex ni utilidad de paleta cruda de Tailwind, salvo en los componentes cuya paleta fija documenta la guía: AppIcon (el tono de cada app), CreditCard (la tarjeta es un objeto y no cambia con el tema), BrowserFrame (el semáforo) y VideoPlayer (controles en blanco y negro sobre el vídeo); y las líneas sueltas que la guía fija y que se marcan con su motivo, como el brillo interior del botón primario

### Requirement: Estados comunes de interacción
Los controles SHALL mostrar hover cambiando el fondo o el texto un escalón, deshabilitado al 50 % de opacidad en todo el control y foco de teclado con `focus-ring-shadow` (`focus-ring-error-shadow` si hay error), con transiciones de color de 100–150 ms y sin animaciones decorativas, salvo la entrada y salida de la familia Stream (requisito propio).

#### Scenario: Foco con teclado
- **WHEN** el usuario llega a un `Input` con Tab
- **THEN** el control muestra el anillo de foco de la guía y el borde `border-brand`

#### Scenario: Deshabilitado
- **WHEN** un `Button` tiene `disabled`
- **THEN** se pinta al 50 % de opacidad, no responde a clics y no recibe foco

### Requirement: Reglas de uso aplicadas por los componentes
Los componentes SHALL incorporar las reglas de su ficha que no dependen del contexto: `iconOnly` exige `label`, los campos de formulario muestran etiqueta visible cuando se pasa `label`, los estados de error llevan texto además del color y `Button` con `href` se pinta como enlace.

#### Scenario: Botón solo icono sin etiqueta
- **WHEN** un proyecto TypeScript usa `Button` con `iconOnly` y sin `label`
- **THEN** la compilación falla con un error de tipo

#### Scenario: Botón como enlace
- **WHEN** se pasa `href="/ajustes"` a `Button`
- **THEN** el elemento pintado es `<a href="/ajustes">` con el mismo aspecto

#### Scenario: Error de campo
- **WHEN** un `Input` recibe `error="Introduce un correo válido."`
- **THEN** se muestra ese texto bajo el campo, el borde pasa a error y el campo lleva `aria-invalid="true"` enlazado al mensaje

### Requirement: Accesibilidad
Cada componente interactivo SHALL ser operable solo con teclado y exponer roles, nombres y estados ARIA correctos; los modales y paneles SHALL atrapar el foco, cerrarse con Escape y devolver el foco al disparador.

#### Scenario: Modal con teclado
- **WHEN** se abre un `Modal` y el usuario pulsa Tab repetidamente y luego Escape
- **THEN** el foco recorre solo los elementos del modal, el modal se cierra con Escape y el foco vuelve al botón que lo abrió

#### Scenario: Auditoría automática
- **WHEN** se ejecuta axe sobre cada ejemplo de la web en claro y en oscuro
- **THEN** no hay violaciones de nivel serio o crítico, salvo las excepciones de contraste documentadas en la guía

### Requirement: Compatibilidad con Next.js
La librería SHALL funcionar en Next.js con App Router: los componentes sin estado SHALL poder renderizarse como Server Components y los interactivos SHALL declararse como componentes de cliente, sin errores de hidratación.

#### Scenario: Server Component
- **WHEN** una página de servidor de Next.js importa y pinta `Badge` y `PageHeader`
- **THEN** la página compila y se renderiza sin marcarla como cliente ni enviar JavaScript de esos componentes

#### Scenario: Componente interactivo en página de servidor
- **WHEN** una página de servidor pinta un `Modal` desde el paquete
- **THEN** compila sin error de "use client" y el modal funciona tras la hidratación sin avisos en consola

### Requirement: Compatibilidad con Astro
La librería SHALL funcionar en Astro con la integración de React: los componentes SHALL renderizarse en el servidor sin directiva y SHALL ser interactivos con cualquier directiva `client:*`.

#### Scenario: Render estático en Astro
- **WHEN** una página Astro pinta `Alert` sin directiva `client:*`
- **THEN** el HTML resultante incluye el componente con su aspecto final y no se envía JavaScript para él

#### Scenario: Isla interactiva
- **WHEN** una página Astro pinta `Tabs` con `client:load`
- **THEN** el cambio de pestaña funciona con ratón y teclado

### Requirement: Estilos a través de Tailwind del proyecto
La librería SHALL apoyarse en la instalación de Tailwind v4 del proyecto consumidor con una sola importación CSS que añade el tema y declara las fuentes de clases del paquete; no SHALL inyectar CSS en tiempo de ejecución.

#### Scenario: Instalación mínima
- **WHEN** un proyecto con Tailwind v4 añade la importación CSS del paquete a su hoja principal
- **THEN** todos los componentes se pintan con su aspecto final sin otra configuración

### Requirement: Contenido por defecto en castellano
Los textos que traen los componentes (etiquetas accesibles, "Cerrar", estados vacíos, paginación, fechas) SHALL estar en castellano de España con tuteo, y las cifras y fechas SHALL formatearse en `es-ES` (`1.284,50 €`, `29 oct 2026`); todos esos textos SHALL poder sustituirse por props.

#### Scenario: Formato de fecha
- **WHEN** `DatePicker` muestra el 29 de octubre de 2026
- **THEN** el texto es "29 oct 2026"

#### Scenario: Texto sustituible
- **WHEN** se pasa `label="Cerrar aviso"` a `CloseButton`
- **THEN** el nombre accesible del botón es "Cerrar aviso"

### Requirement: Familia Stream para directos
Los componentes de Stream SHALL pintarse siempre con el tema oscuro, sea cual sea el tema de la página; lo que aparece o se va SHALL entrar en 250 ms con fundido y 8px de subida y salir en 200 ms, solo con fundido si el usuario pide movimiento reducido; las cifras de reloj SHALL usar números tabulares; los textos que llegan del público SHALL pintarse como texto plano; y los lienzos de tamaño fijo SHALL medir su tamaño de Twitch multiplicado por `scale`.

#### Scenario: Oscuro en una página clara
- **WHEN** se pinta `StreamAlert` dentro de una página en tema claro
- **THEN** la tarjeta usa los valores oscuros de los tokens

#### Scenario: Entrada con movimiento reducido
- **WHEN** se pinta `StreamAlert` con `state="enter"` y `prefers-reduced-motion: reduce`
- **THEN** la tarjeta aparece con fundido y sin desplazamiento

#### Scenario: Cuenta atrás
- **WHEN** se pinta `StreamCountdown` con `seconds={90}`
- **THEN** muestra "01:30", lleva `role="timer"` y `aria-live="off"`, y al llegar a "00:00" se queda ahí

#### Scenario: Mensaje con HTML
- **WHEN** `ChatBox` recibe un mensaje con `text="<b>hola</b>"`
- **THEN** se ve el texto literal `<b>hola</b>`, sin negrita

#### Scenario: Escena escalada
- **WHEN** se pinta `StreamScene` con `scale={0.5}`
- **THEN** ocupa 960×540 px

#### Scenario: En directo sin rojo
- **WHEN** se pinta `StreamStatus` con `status="live"`
- **THEN** el punto usa `fg-success-secondary` y va junto a la palabra "En directo"

### Requirement: Gráficas con la paleta de series
LineChart, BarChart y PieChart SHALL asignar por defecto, en este orden, `utility-brand-600`, `utility-brand-400`, `utility-brand-200`, `utility-sky-500`, `utility-pink-500` y `utility-neutral-400`, y SHALL mostrar leyenda por defecto cuando haya tres series o más.

#### Scenario: Tres series
- **WHEN** se pinta un `LineChart` con tres series sin `legend`
- **THEN** las líneas usan los tres primeros colores de la paleta y aparece la leyenda
