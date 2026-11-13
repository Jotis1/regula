# component-library Specification

## Purpose
Da a las apps de la suite los componentes de la guía de diseño ya construidos en React, con la API, los estados y las reglas de sus fichas, para usarlos igual en Next.js y en Astro sin rediseñarlos en cada proyecto.

## Requirements

### Requirement: Catálogo completo de componentes
La librería SHALL exportar cada componente del catálogo del sistema, con su tipo de props, y el catálogo SHALL ser el mismo en el paquete, en la web y en el artefacto generado. El catálogo parte de los 74 componentes de la guía original y crece con cada cambio que añade uno.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen, como mínimo, Accordion, ActivityFeed, ActivityGauge, Alert, AppIcon, AppStoreBadge, Avatar, AvatarGroup, AvatarLabel, AvatarProfilePhoto, BackgroundOverlay, BackgroundPattern, Badge, BadgeGroup, Banner, BarChart, BlogPostCard, Breadcrumbs, BrowserFrame, Button, ButtonGroup, ButtonUtility, CalendarView, CardHeader, Carousel, ChartLegend, ChartMarker, CheckIcon, CheckItem, Checkbox, CloseButton, CodeSnippet, ColorPicker, ColorPickerDropdown, CommandMenu, CompareSlider, ContentDivider, ContextMenu, CopyTooltip, CreditCard, DatePicker, Disclosure, Dropdown, EmptyState, ExampleCard, FeaturedIcon, FileUpload, FilterBar, FilterMenu, FilterPanel, Footer, HeaderNav, HelpIcon, IconTile, InlineCTA, Input, JobPostCard, Kbd, LaptopMockup, LineChart, LinkCard, MarketingNav, Message, MessageInput, MetricCard, Modal, MultiSelect, Notification, NumberInput, PageHeader, Pager, Pagination, PaginationDots, PhoneMockup, PieChart, PricingCard, ProgressBar, ProgressCircle, ProgressSteps, RadarChart, Radio, RadioGroup, Rating, RatingBadge, ScaledPreview, ScreenMockup, SectionFooter, SectionHeader, SectionLabel, Select, SidebarNav, Skeleton, Slideout, Slider, SocialButton, SocialButtonGroup, Spinner, Spotlight, SubscribeCard, Table, Tabs, Tag, TagInput, TeamMemberCard, Testimonial, TextEditor, Textarea, Toggle, TokenSwatch, Tooltip, TransparencyGrid, TreeView, VerificationCodeInput y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCountdown, StreamEvents, StreamGoal, StreamScene y StreamStatus, todos con sus tipos de props

#### Scenario: Catálogo coherente
- **WHEN** se compara lo que exporta el paquete con los componentes que tienen página en la web
- **THEN** son la misma lista, sin componentes de más ni de menos en ninguno de los dos lados

### Requirement: API pública según las fichas
Las props de cada componente SHALL coincidir en nombre, tipo y valores por defecto con sus tipos publicados y con la ficha de su página en la web; un cambio incompatible en ellas SHALL considerarse ruptura de API.

#### Scenario: Props del botón
- **WHEN** se usa `Button` con `hierarchy="secondary" size="lg" iconLeading={Plus}`, con `Plus` de `@untitledui/icons`
- **THEN** se pinta un botón secundario de 44px de alto con el icono `Plus` a la izquierda del texto

#### Scenario: Prop inexistente
- **WHEN** un proyecto TypeScript pasa `hierarchy="ghost"` a `Button`
- **THEN** la compilación falla con un error de tipo

### Requirement: Aspecto fiel a la guía
Cada componente SHALL reproducir, en claro y en oscuro, la captura aprobada de su ejemplo que se guarda en el repo, usando solo utilidades de los tokens semánticos y nunca hex ni paleta cruda (`bg-indigo-600`). Las capturas de los 74 componentes originales parten de la vista previa de la guía; las de un componente nuevo, o las de uno existente cuyo aspecto cambia a propósito, se aprueban en el PR que las añade o sustituye, revisando la PNG en el diff.

#### Scenario: Comparación visual
- **WHEN** se compara la captura de cada ejemplo de la web con su captura aprobada, en ambos temas
- **THEN** no hay diferencias visibles de color, tamaño, radio, sombra ni tipografía

#### Scenario: Componente sin captura aprobada
- **WHEN** se ejecutan los tests visuales y un componente del catálogo no tiene captura aprobada en algún tema
- **THEN** el test falla indicando qué componente y qué tema faltan

#### Scenario: Cambio de aspecto aprobado
- **WHEN** un PR cambia a propósito el aspecto de un componente que ya tiene captura aprobada, también uno de los 74 originales
- **THEN** el PR sustituye sus dos PNG por capturas nuevas de su ejemplo, explica el motivo, y los tests visuales pasan contra las nuevas

#### Scenario: Sin colores crudos
- **WHEN** se analiza el código fuente de los componentes
- **THEN** no aparece ningún color hex ni utilidad de paleta cruda de Tailwind, salvo en los componentes cuya paleta fija documenta la guía: AppIcon (el tono de cada app), CreditCard (la tarjeta es un objeto y no cambia con el tema), BrowserFrame (el semáforo) y VideoPlayer (controles en blanco y negro sobre el vídeo); y las líneas sueltas que la guía fija y que se marcan con su motivo, como el brillo interior del botón primario

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
`MultiSelect` SHALL dejar elegir varias opciones de una lista con casillas y un buscador en su cabecera. El campo SHALL resumir lo elegido («2 elegidos»). La lista SHALL tener un pie para quitar todo o elegir todo, manejarse entero con teclado y avisar en castellano cuando la búsqueda no encuentra nada.

#### Scenario: Elegir con teclado
- **WHEN** el foco está en un `MultiSelect` sin nada elegido, el usuario pulsa Enter, escribe `mar` en el buscador, baja con la flecha a «Marketing» y pulsa Enter
- **THEN** «Marketing» queda elegida con su casilla marcada, la lista sigue abierta con el texto buscado y el campo dice «1 elegido»

#### Scenario: Búsqueda sin resultados
- **WHEN** el usuario escribe en el buscador un texto que no coincide con ninguna opción
- **THEN** la lista muestra en castellano que no hay resultados y un botón «Borrar búsqueda» que vacía el buscador, con textos sustituibles por props

#### Scenario: Restablecer y elegir todo
- **WHEN** hay una opción elegida y el usuario pulsa «Elegir todo» y después «Restablecer» en el pie de la lista
- **THEN** primero quedan elegidas todas las opciones y después ninguna, y el campo vuelve a mostrar su placeholder

#### Scenario: Cerrar sin perder la selección
- **WHEN** hay dos opciones elegidas y el usuario pulsa Escape
- **THEN** la lista se cierra, el campo sigue diciendo «2 elegidos» y el foco vuelve al campo

### Requirement: Opciones en tarjetas
`RadioGroup` SHALL admitir un aspecto de tarjeta, en el que cada opción es una tarjeta con borde que puede llevar un icono, un avatar o un logo de pago. La tarjeta elegida SHALL marcarse con borde `border-brand` y su indicador. El teclado y la semántica SHALL ser los mismos del grupo normal.

#### Scenario: Elegir una tarjeta
- **WHEN** se pinta un `RadioGroup` de tarjetas con tres planes y el usuario pulsa la flecha abajo desde el primero
- **THEN** el segundo plan queda elegido, su tarjeta muestra el borde `border-brand` y el indicador marcado, y la primera vuelve a su borde normal

#### Scenario: Aspecto por defecto
- **WHEN** se pinta un `RadioGroup` sin indicar el aspecto
- **THEN** se ve igual que su captura aprobada anterior a este cambio

### Requirement: Interruptor fino
`Toggle` SHALL admitir la variante `slim` del Figma: una pista más pequeña y sin relleno, con el tirador a su misma altura y con borde, en los dos tamaños, con los mismos estados, teclado y semántica de `role="switch"` del interruptor normal.

#### Scenario: Interruptor fino con teclado
- **WHEN** el foco está en un `Toggle` `slim` apagado y el usuario pulsa Espacio
- **THEN** pasa a encendido con la pista en `bg-brand-solid` y el anillo de foco visible, y un lector de pantalla lo anuncia como interruptor activado

### Requirement: Menú con una opción elegida
`Dropdown` SHALL admitir, además de acciones, una elección única entre sus opciones: la opción elegida se marca con un check a la derecha y se anuncia como opción de radio de menú marcada. Elegir otra opción SHALL avisar con su valor y cerrar el menú. Sin elección configurada, el menú SHALL comportarse como hasta ahora.

#### Scenario: Opción elegida
- **WHEN** se pinta un `Dropdown` con las opciones Sistema, Claro y Oscuro y Claro como elegida, y se abre
- **THEN** Claro lleva el check y se anuncia como `menuitemradio` con `aria-checked="true"`, y Sistema y Oscuro como `menuitemradio` con `aria-checked="false"`

#### Scenario: Elegir otra
- **WHEN** en ese menú se elige Oscuro con el teclado (flechas y Enter)
- **THEN** el menú avisa con el valor de Oscuro, se cierra y el foco vuelve al botón que lo abrió

#### Scenario: Sin elección
- **WHEN** se pinta un `Dropdown` solo con acciones, como antes de este cambio
- **THEN** sus elementos se anuncian como `menuitem`, sin check, y cada acción llama a su `onSelect`

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

#### Scenario: Varios montados
- **WHEN** hay dos `CopyTooltip` montados en la misma página y se copia un valor
- **THEN** sale una sola burbuja, la del primero montado

#### Scenario: El portapapeles falla
- **WHEN** el navegador rechaza escribir en el portapapeles
- **THEN** la burbuja dice «No se pudo copiar: selecciónalo a mano»

#### Scenario: CodeSnippet no cambia
- **WHEN** se copia el código de un `CodeSnippet`
- **THEN** el botón muestra su ✓ y «Copiado» como hasta ahora, sin burbuja

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
- **WHEN** el usuario llega con Tab a un `ButtonUtility` con `icon={Copy01}` y `label="Copiar"`
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
- **WHEN** se pinta `EmptyState` con `media="integrations"` e `items` con doce logos de `@jotis-me/assets/logos`
- **THEN** se ven dos filas de logos que se desvanecen hacia los lados sobre el título

#### Scenario: Usuarios sin fotos
- **WHEN** se pinta `EmptyState` con `media="users-radius"` e `items` con avatares de iniciales
- **THEN** los avatares se reparten por los círculos concéntricos, con la lupa en el centro

### Requirement: Cobertura del Figma
Cada componente del Figma «Yoruverse UI v8.0» que no sea una sección de página, una página completa o una pieza interna (nombre con «_») SHALL tener su equivalente en Regula con todas sus variantes, como componente, como variante de un componente o como composición de ejemplo en la web. Cuando el Figma y una ficha no coincidan, SHALL valer el Figma y la ficha SHALL actualizarse.

#### Scenario: Variante del Figma
- **WHEN** se toma cualquier propiedad de variante de un componente incluido del Figma y cualquiera de sus valores
- **THEN** hay una forma documentada de pintar ese valor con los componentes de Regula

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
- **WHEN** se pinta un elemento de `ButtonGroup` con `iconOnly={Grid01}` y `label="Cuadrícula"`
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
- **THEN** las pestañas van debajo del título como `Tabs` de tipo `button-border` (las del Figma) y se manejan con las flechas

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

### Requirement: Submenús nativos de la navegación lateral
`SidebarNav` SHALL admitir `disclosure="native"`, con el que cada elemento con `children` de los tipos `simple`, `sections-dividers` y `sections-subheadings` SHALL pintarse como `<details>` con su `<summary>` y abrirse y cerrarse sin JavaScript, con el mismo aspecto que con `disclosure="script"`. SHALL estar abierto de inicio el elemento que lleva `defaultOpen` o el que contiene el activo. Sin la prop, `SidebarNav` SHALL comportarse como hasta ahora.

#### Scenario: Sin JavaScript
- **WHEN** se pinta en el servidor un `SidebarNav` con `disclosure="native"` y dos grupos, el segundo con el elemento activo, y se abre la página con el JavaScript desactivado
- **THEN** el segundo grupo se ve abierto con el activo marcado con `aria-current="page"`, y el primero se abre y se cierra al pulsar su título

#### Scenario: Sin la prop
- **WHEN** se pinta `SidebarNav` sin `disclosure`
- **THEN** el HTML es el mismo que antes de este cambio

#### Scenario: Tipos con segundo panel
- **WHEN** se pinta `SidebarNav` con `type="slim"` y `disclosure="native"`
- **THEN** se comporta como con `disclosure="script"`

### Requirement: Pasos navegables
`ProgressSteps` SHALL admitir `onChange` y `children`. Con `onChange`, cada paso SHALL ser un botón que llama a `onChange` con su índice, cuyo texto visible es solo el marcador y el título; la descripción SHALL ir fuera del botón, debajo, enlazada con `aria-describedby`. Con `children`, el componente SHALL pintar el contenido del paso actual y anunciar su cambio a los lectores de pantalla. Sin las props nuevas, `ProgressSteps` SHALL comportarse como hasta ahora.

#### Scenario: Pulsar un paso
- **WHEN** en un `ProgressSteps` de cuatro pasos con `onChange` y el primero como actual se pulsa el tercero
- **THEN** se llama a `onChange(2)`, y cada paso es un botón con el título del paso como nombre

#### Scenario: Descripción fuera del botón
- **WHEN** se pinta un `ProgressSteps` con `onChange` y pasos con descripción
- **THEN** ningún botón contiene la descripción, cada uno la tiene como descripción accesible y axe no marca `label-content-name-mismatch`

#### Scenario: Contenido del actual
- **WHEN** se pinta en vertical con `children={(i) => <p>Paso {i}</p>}` y el segundo como actual
- **THEN** el texto «Paso 1» va dentro del segundo elemento de la lista, bajo su título, en una región que se anuncia al cambiar

#### Scenario: Con teclado
- **WHEN** el usuario llega con Tab a un paso y pulsa Enter
- **THEN** el paso lleva el anillo de foco y se llama a `onChange` con su índice

### Requirement: Cabecera a ancho completo
`HeaderNav` SHALL admitir `fullWidth`, con el que su contenido ocupa todo el ancho disponible con el relleno lateral de siempre, en lugar de centrarse en el contenedor de 1.280 px. Sin la prop, `HeaderNav` SHALL comportarse como hasta ahora.

#### Scenario: Ventana ancha
- **WHEN** se pinta `HeaderNav` con `fullWidth` en una ventana de 1.920 px
- **THEN** la marca empieza a 32 px del borde izquierdo y las acciones acaban a 32 px del derecho

### Requirement: Pestañas que navegan
Cuando todos los elementos de `Tabs` llevan `href`, `Tabs` SHALL pintarse como una navegación de enlaces con el mismo aspecto que las pestañas, sin `tablist`, con `aria-current` en el actual: `location` si su `href` es un ancla y `page` si no.

#### Scenario: Índice de la página
- **WHEN** se pinta `Tabs` en vertical con `type="line"`, tres elementos con `href` de ancla y el segundo como actual
- **THEN** es una `<nav>` con nombre y tres enlaces, el segundo con `aria-current="location"` y la raya de 2 px a su izquierda, y no hay ningún elemento con `role="tab"`

#### Scenario: Sin href
- **WHEN** se pinta `Tabs` sin `href` en sus elementos
- **THEN** el HTML es el mismo que antes de este cambio

#### Scenario: Enlaces en vertical y en móvil
- **WHEN** se pinta en vertical a 390 px un `Tabs` con `href` en todos sus elementos
- **THEN** sigue siendo la lista de enlaces, sin pasar al desplegable de las pestañas verticales

### Requirement: Carrusel en tira
`Carousel` SHALL admitir `type="strip"`, que enseña las diapositivas en una fila que se desplaza en horizontal, se detiene en cada una y deja ver parte de la siguiente, sin flechas y sin JavaScript para desplazarse.

#### Scenario: Deslizar
- **WHEN** a 390 px se pinta un `Carousel` con `type="strip"` y seis diapositivas, con el JavaScript desactivado
- **THEN** se ve la primera entera y parte de la segunda, la fila se desplaza con el dedo y se detiene en cada diapositiva, y no hay flechas

#### Scenario: Lista con nombre
- **WHEN** un lector de pantalla llega a la tira
- **THEN** la anuncia como lista con su nombre y seis elementos

### Requirement: Interruptor sin etiqueta visible
`Toggle` SHALL aceptar `aria-label` y `aria-labelledby` como nombre accesible del interruptor, también sin `label`.

#### Scenario: En una fila
- **WHEN** se pinta `Toggle` sin `label` y con `aria-label="Activar recordatorio"`
- **THEN** el interruptor tiene `role="switch"` y se llama «Activar recordatorio»

### Requirement: Acompañante de la etiqueta
Los campos con etiqueta (`Input`, `Textarea`, `Select`, `MultiSelect`, `NumberInput` y `TagInput`) y `Toggle` SHALL admitir `labelAside`, un nodo que se pinta al final de la fila de la etiqueta, fuera del elemento `<label>`.

#### Scenario: Cambiado y restablecer
- **WHEN** se pinta `Select` con `label="size"` y `labelAside` con un `Badge` «Cambiado» y un `Button` «Restablecer»
- **THEN** los dos van en la fila de la etiqueta, alineados a la derecha, y pulsar «Restablecer» no abre el desplegable

### Requirement: Líneas destacadas en el código
`CodeSnippet` SHALL admitir `highlight`, en el código o en cada pestaña: una lista de números de línea, desde 1, que se pintan con fondo y raya de marca y que se anuncian como destacadas a los lectores de pantalla.

#### Scenario: Líneas cambiadas
- **WHEN** se pinta `CodeSnippet` con un código de seis líneas y `highlight={[4, 5]}`
- **THEN** las líneas 4 y 5 llevan el fondo y la raya, y un lector oye una vez que están destacadas

### Requirement: Buscador con texto inicial
`CommandMenu` SHALL admitir `defaultQuery`, el texto con el que se abre su buscador, y SHALL avisar de él con `onQueryChange` al abrirse.

#### Scenario: Abrir con texto
- **WHEN** se abre `CommandMenu` con `defaultQuery="input"`
- **THEN** el buscador muestra «input», los resultados ya están filtrados y se llama a `onQueryChange("input")`

### Requirement: Hoja inferior
`Slideout` SHALL admitir `side="bottom"`, que lo pinta como una hoja que sube desde abajo, a todo el ancho, con el alto de su contenido hasta el 85 % de la pantalla y su cuerpo con desplazamiento propio. El foco, Escape, la X y el clic fuera SHALL funcionar como en los otros lados.

#### Scenario: Detalle en móvil
- **WHEN** a 390 px se abre un `Slideout` con `side="bottom"` y se pulsa Escape
- **THEN** la hoja ocupa el ancho de la pantalla pegada abajo con el foco dentro, y al cerrarse el foco vuelve a quien la abrió

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

### Requirement: Escena de ancho configurable
`StreamScene` SHALL admitir `width`, el ancho lógico del lienzo en px, con 1080 de alto siempre. Sin `width`, o con un valor que no sea un entero de al menos 1920, el lienzo SHALL medir 1920. La cuadrícula y el pie SHALL ocupar todo el ancho, y el bloque central SHALL seguir centrado y al mismo tamaño.

#### Scenario: Ultrapanorámica
- **WHEN** se pinta `StreamScene` con `width={2580}` y `scale={4/3}`
- **THEN** ocupa 3440×1440 px, el pie empieza y acaba a 80 px lógicos de los bordes y el titular está centrado en el lienzo

#### Scenario: Valor no válido
- **WHEN** se pinta `StreamScene` con `width={1280}` o `width={2000.5}`
- **THEN** el lienzo mide 1920×1080, como sin `width`

#### Scenario: Sin width
- **WHEN** se pinta `StreamScene` sin `width`
- **THEN** el HTML es el mismo que antes de este cambio

### Requirement: Acciones en la fila móvil
`HeaderNav` SHALL admitir `mobileActions`, con el que `actions` se pinta también en la fila móvil, entre la marca y el botón de menú (o lo que dé `mobileBar`). Sin la prop, `HeaderNav` SHALL comportarse como hasta ahora.

#### Scenario: Botón de tema en móvil
- **WHEN** se pinta `HeaderNav` con `mobileActions` y un botón de tema en `actions` en una cabecera de 390 px
- **THEN** se ven la marca, el botón de tema y el botón de menú
