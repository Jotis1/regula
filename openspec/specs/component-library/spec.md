# component-library Specification

## Purpose
Da a las apps de la suite los componentes de la guía de diseño ya construidos en React, con la API, los estados y las reglas de sus fichas, para usarlos igual en Next.js y en Astro sin rediseñarlos en cada proyecto.

## Requirements

### Requirement: Catálogo completo de componentes
La librería SHALL exportar cada componente del catálogo del sistema, con su tipo de props, y el catálogo SHALL ser el mismo en el paquete, en la web y en el artefacto generado. El catálogo parte de los 74 componentes de la guía original y crece con cada cambio que añade uno.

#### Scenario: Exportaciones
- **WHEN** se lista lo que exporta el punto de entrada del paquete
- **THEN** aparecen, como mínimo, ActivityFeed, Alert, AppIcon, Avatar, AvatarGroup, AvatarLabel, BackgroundPattern, Badge, Banner, BarChart, Breadcrumbs, BrowserFrame, Button, ButtonGroup, CalendarView, CardHeader, Carousel, ChartLegend, Checkbox, CloseButton, CodeSnippet, ColorPicker, CommandMenu, ContentDivider, ContextMenu, CopyTooltip, CreditCard, DatePicker, Dropdown, EmptyState, FeaturedIcon, FileUpload, FilterBar, HeaderNav, HelpIcon, Icon, InlineCTA, Input, Kbd, LineChart, LinkCard, Message, MessageInput, MetricCard, Modal, MultiSelect, Notification, NumberInput, PageHeader, Pager, Pagination, PaginationDots, PieChart, ProgressBar, ProgressCircle, ProgressSteps, Radio, RadioGroup, ScaledPreview, SectionFooter, SectionHeader, Select, SidebarNav, Skeleton, Slideout, Slider, Spinner, Table, Tabs, Tag, TagInput, TextEditor, Textarea, Toggle, Tooltip, TransparencyGrid, TreeView, VerificationCodeInput y VideoPlayer, y los de Stream: CamFrame, ChannelBanner, ChannelPanel, ChatBadge, ChatBox, NowPlaying, StreamAlert, StreamCountdown, StreamEvents, StreamGoal, StreamScene y StreamStatus, todos con sus tipos de props

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
