# component-library Specification

## Purpose
Da a las apps de la suite los componentes de la guía de diseño ya construidos en React, con la API, los estados y las reglas de sus fichas, para usarlos igual en Next.js y en Astro sin rediseñarlos en cada proyecto.

## Requirements

### Requirement: Catálogo completo de componentes
La librería SHALL exportar cada componente del catálogo del sistema, con su tipo de props, y el catálogo SHALL ser el mismo en el paquete, en la web y en el artefacto generado. El catálogo parte de los 74 componentes de la guía original y crece con cada cambio que añade uno.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen, como mínimo, ActivityFeed, Alert, AppIcon, Avatar, AvatarGroup, AvatarLabel, BackgroundPattern, Badge, Banner, BarChart, Breadcrumbs, BrowserFrame, Button, ButtonGroup, CalendarView, CardHeader, ChartLegend, Checkbox, CloseButton, CodeSnippet, ColorPicker, CommandMenu, ContentDivider, CreditCard, DatePicker, Dropdown, EmptyState, FeaturedIcon, FileUpload, FilterBar, Icon, InlineCTA, Input, LineChart, Message, MessageInput, MetricCard, Modal, MultiSelect, Notification, NumberInput, PageHeader, Pagination, PieChart, ProgressBar, Radio, RadioGroup, SectionFooter, SectionHeader, Select, SidebarNav, Skeleton, Slideout, Slider, Spinner, Table, Tabs, Tag, TagInput, TextEditor, Textarea, Toggle, Tooltip, TreeView, VerificationCodeInput y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCountdown, StreamEvents, StreamGoal, StreamScene y StreamStatus, todos con sus tipos de props

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
