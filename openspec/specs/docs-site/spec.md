# docs-site Specification

## Purpose
regula.jotis.me es la referencia pública del sistema de diseño de la suite jotis.me: reúne las reglas de la guía y la documentación viva de tokens, iconos y componentes, para que quien diseñe o programe una app la consulte en un solo sitio.

## Requirements

### Requirement: Secciones de fundamentos
La web SHALL tener una página para cada apartado de la guía: principios, contenido y tono, color, tipografía, espaciado, radios y layout, sombras y estados, iconografía, fondos y adornos, marca e iconos de app, Stream (Twitch), y la instalación con Tailwind v4 en Next.js y Astro, con el contenido de la guía. Las URLs SHALL ser `/foundations/<apartado>/` (con `layout` y `states` para espaciado y sombras), `/foundations/stream/` y `/start/install/`.

#### Scenario: Contenido y tono
- **WHEN** se abre la página de contenido y tono
- **THEN** aparecen la voz, las reglas de formato (tuteo, mayúscula inicial, `1.284,50 €`) y los ejemplos "en lugar de" de la guía

#### Scenario: URLs del rediseño
- **WHEN** se abren `/start/install/`, `/foundations/layout/` y `/foundations/states/`
- **THEN** responden con la instalación, el espaciado y las sombras, y `/usage/tailwind/`, `/foundations/spacing/` y `/foundations/shadows/` ya no existen

### Requirement: Tokens mostrados desde la fuente
Las páginas de color, tipografía, espaciado, radios y sombras SHALL generarse a partir de los tokens del paquete publicado y mostrar para cada token nombre, muestra, valor claro, valor oscuro, utilidad de Tailwind y nota de uso.

#### Scenario: Token nuevo
- **WHEN** se añade un token al paquete y se reconstruye la web
- **THEN** aparece en su página sin editar la web

#### Scenario: Copiar utilidad
- **WHEN** el usuario pulsa sobre el nombre de un token
- **THEN** se copia la utilidad (`bg-brand-solid`) al portapapeles y se confirma con un aviso breve

### Requirement: Página por componente
La web SHALL tener una página por cada componente con: descripción, su ficha repartida en "Úsalo así", "Evita", "Detalles" y "Accesibilidad" (sin reescribir su texto), su ejemplo interactivo (requisito «Playground de componente»), tabla de props generada de sus tipos, fragmento de código para Next.js y para Astro, y lo que amplía o difiere de la guía. La página no SHALL tener una galería fija de variantes y estados: lo que antes enseñaba esa galería se alcanza desde el ejemplo interactivo. La ficha de cada componente vive en el repo junto a su página y es la misma que se publica en el artefacto generado.

#### Scenario: Página de Button
- **WHEN** se abre la página de `Button`
- **THEN** desde su ejemplo interactivo se pueden ver las cinco jerarquías y los cinco tamaños funcionando, y la página muestra la regla de una sola acción primaria y la tabla de props con `hierarchy`, `size`, `destructive`, `iconOnly`, `loading` y `href`

#### Scenario: Sin galería de variantes
- **WHEN** se abre la página de cualquier componente
- **THEN** no tiene la sección «Variantes y estados» ni la entrada correspondiente en «En esta página», y el ejemplo interactivo es la primera sección tras la cabecera

#### Scenario: Fragmento de Astro
- **WHEN** se abre la pestaña Astro del ejemplo de un componente interactivo
- **THEN** el código incluye la importación del paquete y la directiva `client:*` necesaria

#### Scenario: Ficha repartida sin reescribir
- **WHEN** se abre la página de un componente cuya ficha tiene un párrafo "Evita"
- **THEN** ese párrafo aparece en la sección "Evita" con el texto de la ficha sin cambios

#### Scenario: Misma ficha en el artefacto
- **WHEN** se compara la ficha de un componente en su página con su `README.md` en el artefacto generado
- **THEN** tienen el mismo texto

### Requirement: Galería de iconos
La web SHALL mostrar los iconos de `@untitledui/icons`, las banderas de `@untitledui/country-flags`, los tipos de `@untitledui/file-icons` y los logos de terceros, pagos y cursores de `@jotis-me/assets`, cada set en su URL y unidos por una navegación común. Cada galería SHALL tener buscador por nombre y tamaño de vista previa en una sola fila. Al elegir uno SHALL mostrar un panel con el icono o recurso en varios tamaños que permita copiar su nombre y su uso en React con la importación del paquete del que sale, y, en los sets de `@jotis-me/assets`, su importación SVG y el SVG en bruto; en escritorio, el panel SHALL quedar fijo junto a la rejilla, y en móvil SHALL abrirse como hoja inferior. Cada galería SHALL cargar solo los dibujos que están a la vista y quedar dentro del límite de JavaScript de su página.

#### Scenario: Buscar un icono
- **WHEN** el usuario escribe "cal" en el buscador de iconos
- **THEN** solo se muestran los iconos cuyo nombre contiene "cal"

#### Scenario: Elegir un icono
- **WHEN** el usuario pulsa el icono `Calendar`
- **THEN** el panel muestra `Calendar` y su código lo importa de `@untitledui/icons`

#### Scenario: Icono fuera del núcleo
- **WHEN** el usuario elige un icono que no usa ningún componente del sistema, como `Rocket02`
- **THEN** el código del panel importa su componente de `@untitledui/icons`, igual que para cualquier otro icono

#### Scenario: Elegir un logo
- **WHEN** el usuario busca "github" y pulsa el logo de GitHub del set social
- **THEN** el panel muestra sus variantes en color y en gris y su código importa ese logo de `@jotis-me/assets/logos`

#### Scenario: Galería larga
- **WHEN** se abre la galería de iconos
- **THEN** se ven los primeros con el recuento total, calculado del paquete, y un botón «Mostrar más» que añade más, sin pedir los dibujos de los que no están a la vista, y el buscador recorre todos

#### Scenario: Filtrar por categoría
- **WHEN** el usuario elige la categoría «Tiempo» en la galería de iconos
- **THEN** solo quedan los iconos de esa categoría y el recuento dice cuántos son del total

#### Scenario: Elegir una bandera
- **WHEN** el usuario busca "es" o "españa" en la galería de banderas y pulsa la bandera de España
- **THEN** el panel enseña la bandera en círculo en varios tamaños y su código importa `FlagEs` de `@untitledui/country-flags`

#### Scenario: Elegir un icono de archivo
- **WHEN** el usuario pulsa el tipo `pdf` en la galería de archivos
- **THEN** el panel enseña sus variantes `default`, `gray` y `solid` y su código usa `FileIcon` de `@untitledui/file-icons`

#### Scenario: Cambiar de set
- **WHEN** desde `/icons/` el usuario pulsa «Banderas» en la navegación de sets
- **THEN** se abre `/icons/flags/`, y la navegación marca Banderas como página actual

#### Scenario: Panel en móvil
- **WHEN** a 390 px el usuario pulsa un icono y después Escape
- **THEN** el panel se abre como hoja inferior con el foco dentro, y al cerrarse el foco vuelve al icono

### Requirement: Tema claro y oscuro
La web SHALL ofrecer en la cabecera, en todos los anchos, un selector de tema con tres opciones: Sistema, Claro y Oscuro. Claro y Oscuro aplican o quitan `dark-mode` en toda la página y se recuerdan entre visitas; Sistema borra la elección guardada y sigue la preferencia del sistema, también si cambia con la página abierta. La primera vez la web SHALL usar la del sistema, sin parpadeo del tema equivocado al cargar. El menú móvil SHALL ofrecer las mismas tres opciones.

#### Scenario: Recordar tema
- **WHEN** el usuario elige oscuro y recarga la página
- **THEN** la página carga directamente en oscuro

#### Scenario: Volver al sistema
- **WHEN** el usuario elige "Sistema" en el menú móvil con el sistema en oscuro
- **THEN** la página pasa a oscuro y deja de recordar una elección propia

#### Scenario: Volver al sistema en escritorio
- **WHEN** en escritorio, con oscuro elegido y el sistema en claro, el usuario abre el selector de la cabecera y elige "Sistema"
- **THEN** la página pasa a claro, deja de recordar una elección propia y, si el sistema cambia a oscuro sin recargar, la página pasa a oscuro

#### Scenario: El selector dice lo elegido
- **WHEN** el usuario abre el selector de la cabecera
- **THEN** ve Sistema, Claro y Oscuro con la opción actual marcada, y el botón que lo abre muestra el icono y el nombre de esa opción (pantalla y «Sistema», sol y «Claro», luna y «Oscuro») desde la primera pintura, y tiene un nombre accesible que dice el tema elegido

#### Scenario: Mismo estado en los dos selectores
- **WHEN** el usuario elige "Claro" en la cabecera y después, a 390px, abre el menú móvil
- **THEN** el selector del menú móvil tiene "Claro" elegido

### Requirement: La web sigue el propio sistema
La web SHALL construirse con los paquetes del propio monorepo y cumplir las reglas de la guía: textos en castellano de España con tuteo, sin emojis y una acción principal por vista. Su estructura (cabecera, navegación lateral, menú móvil, pie y búsqueda), las secciones de la portada y las piezas de cada página SHALL montarse con componentes de `@jotis-me/react`, sin rehacer a mano lo que ya hace un componente del paquete. La navegación lateral SHALL ser `SidebarNav` con submenús nativos: HTML del servidor que funciona sin JavaScript. Si a un componente le falta algo para la web, SHALL ampliarse el componente. La cabecera SHALL mostrar el icono de app de Regula junto al nombre "Regula" en Bricolage Grotesque bold y SHALL ocupar todo el ancho de la ventana, con su marca alineada con la navegación lateral. El contenido y el pie SHALL medir como máximo el ancho del contenedor de la guía (`container-max-width-desktop`, 1280 px), centrados; la navegación lateral queda fuera de ese ancho, pegada al borde izquierdo.

#### Scenario: Cabecera
- **WHEN** se abre cualquier página
- **THEN** la cabecera muestra el icono de app de Regula (`Re`, tono `fuchsia`) y "Regula" en Bricolage Grotesque bold en `text-primary`

#### Scenario: Paquetes reales en el código
- **WHEN** se revisa cualquier fragmento de código de la web
- **THEN** solo importa de `@jotis-me/react`, `@jotis-me/tokens`, `@jotis-me/assets`, `@untitledui/icons`, `@untitledui/file-icons` o `@untitledui/country-flags`, y ninguno importa de `@jotis-me/icons`

#### Scenario: Estructura con el paquete
- **WHEN** se inspecciona la cabecera, la navegación lateral, el menú móvil, el pie o la búsqueda de cualquier página
- **THEN** cada uno es un componente de `@jotis-me/react` (`HeaderNav`, `SidebarNav`, `Slideout`, `Footer` y `CommandMenu`, o el que lo sustituya en el catálogo)

#### Scenario: Navegación lateral sin JavaScript
- **WHEN** se abre una página de componente con el JavaScript desactivado
- **THEN** la navegación lateral se ve entera, sus grupos se abren y se cierran, y el grupo del componente actual está abierto

#### Scenario: Ancho del contenedor
- **WHEN** se abre una página de componente en una ventana de 1920 px
- **THEN** la navegación lateral queda pegada a la izquierda, la marca de la cabecera queda alineada con ella, y el contenido con su índice «En esta página» y el pie miden como máximo 1280 px

#### Scenario: Ventana estrecha
- **WHEN** se abre la misma página en una ventana de 1280 px
- **THEN** el contenido ocupa el ancho que deja la navegación lateral, sin desplazamiento horizontal de la página

### Requirement: Búsqueda y navegación
La web SHALL tener en la cabecera las secciones Empezar, Fundamentos, Componentes, Stream e Iconos; una navegación lateral con filtro que enseña el árbol de la sección actual (en Componentes y Stream, los componentes agrupados por tipo); y una búsqueda global de páginas, tokens, iconos y componentes accesible con Ctrl+K / Cmd+K. La portada, las páginas de iconos y la 404 no SHALL llevar navegación lateral.

#### Scenario: Atajo de búsqueda
- **WHEN** el usuario pulsa Ctrl+K y escribe "modal"
- **THEN** aparece la página del componente `Modal` en los resultados y Enter navega a ella

#### Scenario: Filtrar la navegación
- **WHEN** el usuario escribe "tabla" en el filtro de la navegación lateral
- **THEN** solo quedan los enlaces que coinciden, con su grupo abierto, entre ellos `Table`

#### Scenario: Grupo del componente actual
- **WHEN** se abre la página de `Button`
- **THEN** la navegación lateral tiene abierto el grupo Acciones con `Button` marcado como página actual

#### Scenario: Árbol de la sección
- **WHEN** se abre la página de color
- **THEN** la navegación lateral enseña las páginas de Fundamentos, con Color como actual, y no enseña los grupos de componentes

### Requirement: Publicación en regula.jotis.me
La web SHALL servirse como sitio estático en `https://regula.jotis.me` con HTTPS, y SHALL indicar en el pie la versión de los paquetes que documenta, con un enlace al historial de cambios.

#### Scenario: Versión documentada
- **WHEN** se publica una versión nueva de los paquetes
- **THEN** tras el despliegue el pie de la web muestra ese número de versión

### Requirement: Rendimiento y accesibilidad de la web
Las páginas de la web SHALL pasar axe sin violaciones serias o críticas y SHALL obtener al menos 90 en Lighthouse en rendimiento y accesibilidad en móvil, sin excepciones.

#### Scenario: Auditoría en CI
- **WHEN** se ejecuta la auditoría sobre la portada, el índice de componentes, una página de fundamentos y una de componente
- **THEN** las cuatro superan 90 en rendimiento y en accesibilidad

### Requirement: Portada
La portada SHALL presentar qué es Regula, llevar a la instalación como acción principal con el comando de Next.js y de Astro a la vista, abrir la búsqueda y enlazar a Fundamentos, Componentes, Stream e Iconos con sus cifras reales, calculadas en el build. SHALL contar las cinco reglas como una historia por pasos sobre una pantalla de ejemplo hecha con componentes reales, que en móvil se recorre deslizando, y SHALL enseñar una pantalla de ejemplo en claro y en oscuro a la vez, con una línea que el usuario mueve entre los dos temas.

#### Scenario: Cifras reales
- **WHEN** se abre la portada
- **THEN** el número de componentes, iconos y tokens que muestra coincide con el de los paquetes

#### Scenario: Historia de las reglas
- **WHEN** en la portada el usuario pulsa «Siguiente regla» dos veces desde el principio
- **THEN** la pantalla de ejemplo tiene aplicadas las dos primeras reglas, lo que cambió con la segunda está señalado y su paso se anuncia como actual

#### Scenario: Reglas en móvil
- **WHEN** se abre la portada a 390 px
- **THEN** las reglas son una tira que se desliza con el dedo, con un fotograma por paso, también con el JavaScript desactivado

#### Scenario: Claro y oscuro a la vez
- **WHEN** se abre la portada con la web en oscuro y el usuario mueve la línea de «Así se ve» al 30 % con el teclado
- **THEN** el 30 % izquierdo de la pantalla de ejemplo se ve en claro y el resto en oscuro

### Requirement: Playground de componente
La página de cada componente del catálogo SHALL ofrecer un ejemplo interactivo que pinta el componente real y su código para Next.js y Astro, actualizados al momento con cada cambio. En escritorio, el lienzo y el código SHALL ir a la izquierda y los controles a la derecha, con desplazamiento propio, de modo que el lienzo no salga de la vista al recorrer los controles. SHALL tener:

- **Controles** para cada prop configurable: un selector por cada prop con valores cerrados, un interruptor por cada booleano, un campo numérico (con mínimo, máximo y paso cuando tengan sentido), un selector de icono y, para las props que reciben contenido (nodos, listas u objetos), un selector de valores preparados. Las props controladas, de callback o internas no tienen control.
- **Grupos** plegables de controles, con el primero abierto, y un filtro por nombre de prop cuando hay más de doce controles.
- **Estados** (`disabled`, `error`, `loading` o los que tenga el componente) como controles normales.
- **Atajos** con los tipos del Figma del componente, cuando tiene más de uno, en un único desplegable, nunca como fila de botones. Un atajo pone de una vez, sobre los valores por defecto, las props que definen ese tipo, y queda elegido mientras esas props no cambien. Todo lo que pone un atajo SHALL poder alcanzarse también con los controles.
- **Cambios a la vista.** Cada control con un valor distinto del de por defecto SHALL marcarse con texto, no solo con color, y SHALL poder restablecerse solo; cada grupo SHALL decir cuántos cambios tiene; y SHALL haber una lista de las props cambiadas y una acción que restablece todas.
- **Reglas de incompatibilidad.** Cada control que no aplica con los valores actuales de otros SHALL aparecer desactivado, con el motivo visible y anunciado a los lectores de pantalla, y su prop no SHALL pasarse al componente ni aparecer en el código.

#### Scenario: Cambiar una prop
- **WHEN** en el ejemplo interactivo de `Button` se elige `secondary` en `hierarchy`
- **THEN** el botón del ejemplo pasa a secundario y el código muestra `hierarchy="secondary"`

#### Scenario: Todos los componentes
- **WHEN** se abre la página de cualquiera de los componentes del catálogo, incluidos los de Stream
- **THEN** tiene ejemplo interactivo con al menos un control

#### Scenario: Prop numérica
- **WHEN** en el ejemplo de `ProgressBar` se escribe 75 en `value`
- **THEN** la barra se pinta al 75 % y el código muestra `value={75}`

#### Scenario: Elegir un icono
- **WHEN** en el ejemplo de `Button` se elige el icono `Plus` en `iconLeading`
- **THEN** el botón muestra ese icono y el código muestra `iconLeading={Plus}` con `import { Plus } from "@untitledui/icons"`

#### Scenario: Contenido preparado
- **WHEN** en el ejemplo de `Badge` se elige un avatar en `avatar`
- **THEN** la insignia lo muestra y el código incluye el JSX equivalente

#### Scenario: Atajo de un tipo del Figma
- **WHEN** en el ejemplo de `Input` se elige el atajo «Tarjeta de pago» en el desplegable de atajos
- **THEN** el campo pasa a ese tipo, los controles reflejan las props que puso el atajo (`type` vale `card`) y el desplegable lo muestra elegido; no hay ninguna fila de botones de atajos

#### Scenario: Prop incompatible
- **WHEN** en el ejemplo de `Button` se activa `iconOnly`
- **THEN** el control `iconTrailing` queda desactivado con su motivo, el botón no lo recibe y el código no lo incluye; al desactivar `iconOnly`, el control vuelve con su valor anterior

#### Scenario: Reglas comprobadas
- **WHEN** una regla de incompatibilidad nombra una prop o un valor que el componente no tiene
- **THEN** los tests de la web fallan diciendo qué componente y qué regla

#### Scenario: Estado
- **WHEN** en el ejemplo de `Input` se activa `disabled`
- **THEN** el campo se pinta deshabilitado y el código muestra `disabled`

#### Scenario: Ver lo cambiado
- **WHEN** en el ejemplo de `Input` se cambian `size` e `icon`
- **THEN** las dos filas dicen «Cambiado» con un «Restablecer», sus grupos dicen cuántas props tienen cambiadas, la lista de cambios tiene las dos y el código marca sus líneas

#### Scenario: Restablecer
- **WHEN** se quita de la lista de cambios la etiqueta de `size`
- **THEN** `size` vuelve a su valor por defecto, su fila deja de decir «Cambiado» y el código deja de incluirla

#### Scenario: Muchas props
- **WHEN** se abre el ejemplo de `Input`, que tiene más de doce controles, y se escribe «label» en el filtro
- **THEN** solo quedan los controles cuyo nombre contiene «label», con sus grupos abiertos

#### Scenario: En móvil
- **WHEN** se abre el ejemplo de `Input` a 390 px y se recorren sus controles
- **THEN** el componente sigue a la vista arriba, los grupos van en una columna y «Copiar código» queda a mano en una barra inferior

#### Scenario: Código copiable
- **WHEN** el usuario copia el código del ejemplo interactivo
- **THEN** el texto copiado es JSX válido que importa de `@jotis-me/react` y, si usa iconos, de `@untitledui/icons`

#### Scenario: Con teclado
- **WHEN** el usuario recorre los controles con Tab y cambia uno con el teclado
- **THEN** todos los controles activos reciben el foco, los desactivados se anuncian con su motivo y el ejemplo se actualiza

### Requirement: Navegación dentro de la página
Las páginas de fundamentos y de componente SHALL mostrar migas de pan, un índice "En esta página" de sus secciones y enlaces a la página anterior y siguiente de su sección. El índice SHALL ser una lista de enlaces que marca la sección que se está leyendo. Las de componente SHALL enlazar además a componentes relacionados. En móvil, el índice no se muestra.

#### Scenario: Anterior y siguiente
- **WHEN** se abre la página de color
- **THEN** enlaza a contenido y tono como anterior y a tipografía como siguiente

#### Scenario: Índice como enlaces
- **WHEN** se abre la página de `Button` y se baja hasta «Props»
- **THEN** el índice «En esta página» es una navegación con enlaces de ancla, sin pestañas, y «Props» lleva `aria-current="location"`

### Requirement: Índice de componentes
La web SHALL tener en `/components/` un índice de todos los componentes del catálogo agrupados por tipo, con su descripción, incluidos los de Stream. Arriba SHALL tener un mapa de los grupos, cada uno con una frase de para qué sirve y cuántos componentes tiene, un buscador que encuentra un componente por su nombre, su descripción o lo que hace, y un desplegable que lleva a un grupo.

#### Scenario: Todos en el índice
- **WHEN** se abre `/components/`
- **THEN** aparecen todos los componentes que exporta `@jotis-me/react`, cada uno enlazado a su página, y ninguno más

#### Scenario: Buscar por lo que hace
- **WHEN** el usuario escribe «fecha» en el buscador del índice
- **THEN** quedan `DatePicker` y `CalendarView`, aunque su nombre no contenga «fecha»

#### Scenario: Mapa de grupos
- **WHEN** se abre `/components/`
- **THEN** antes de las cards hay un enlace por cada uno de los 16 grupos, con su frase y su recuento, que lleva al grupo

### Requirement: Historial de cambios
La web SHALL tener en `/changelog/` el historial de versiones de los paquetes, generado de sus CHANGELOG en el build. El texto de cada entrada SHALL pintarse con su formato: párrafos, listas (también las que van dentro de una entrada) y código en línea.

#### Scenario: Versión publicada
- **WHEN** se publica una versión con una entrada en el CHANGELOG
- **THEN** tras el despliegue `/changelog/` muestra esa versión con su entrada

#### Scenario: Entrada con listas
- **WHEN** se abre `/changelog/` y se mira la entrada de la 0.4.0, que lista los componentes nuevos y después las variantes
- **THEN** cada lista se pinta como una lista con un elemento por línea, sin los guiones del Markdown, y el texto de entre las dos listas como un párrafo

### Requirement: Lienzos a tamaño real
Los componentes de tamaño fijo (`StreamScene` y `ChannelBanner`) SHALL tener una página `/components/<slug>/full/` que los muestra a su tamaño de Twitch, sin escalar, enlazada desde su página.

#### Scenario: Escena a tamaño real
- **WHEN** se abre `/components/stream-scene/full/`
- **THEN** la escena mide 1920×1080 px

### Requirement: Menú móvil
En pantallas estrechas la web SHALL sustituir la navegación lateral y las secciones de la cabecera por un menú a pantalla completa, con la búsqueda, la misma navegación con filtro y el selector de tema, que atrapa el foco y se cierra con Escape.

#### Scenario: Abrir y cerrar
- **WHEN** a 390px de ancho se abre el menú y se pulsa Escape
- **THEN** el menú se cierra y el foco vuelve al botón que lo abrió

### Requirement: Vista previa decorativa
La vista previa de una card SHALL ser decorativa: no SHALL recibir foco ni clics, no SHALL aparecer en el árbol de accesibilidad y no SHALL cambiar el nombre accesible de la card.

#### Scenario: Tab no entra en la vista previa
- **WHEN** el usuario recorre `/components/` con Tab
- **THEN** el foco pasa de una card a la siguiente sin detenerse en ningún botón, campo o enlace de las vistas previas

#### Scenario: Nombre de la card
- **WHEN** un lector de pantalla llega a la card de `ButtonGroup`
- **THEN** la anuncia como un enlace con el nombre del componente y su descripción, sin texto de la vista previa

#### Scenario: Clic en la vista previa
- **WHEN** el usuario hace clic sobre un botón dibujado en la vista previa
- **THEN** se abre la página del componente, igual que con un clic en cualquier otra parte de la card

### Requirement: Build sin capturas
El build de la web SHALL funcionar sin leer las capturas aprobadas de la paridad visual, que SHALL seguir siendo la referencia de los tests visuales, y SHALL terminar también cuando a un componente le falta la captura de su card: esa card SHALL mostrar el fondo de cuadros vacío.

#### Scenario: Componente nuevo sin captura
- **WHEN** se añade un componente al catálogo con su ficha, su ejemplo y su muestra, todavía sin sus capturas, y se construye la web
- **THEN** el build termina sin errores y su card muestra el fondo de cuadros vacío; los tests de catálogo siguen fallando por las capturas que faltan

### Requirement: JavaScript solo de lo que se usa
Cada página de la web SHALL descargar solo el código de los componentes que usan sus islas, y el JavaScript de cada página SHALL quedar dentro de un límite guardado en el repo y comprobado en CI. Subir un límite SHALL ser un cambio explícito de ese fichero. En las páginas de componente, el ejemplo interactivo SHALL cargar solo el componente de la página y los que necesiten sus controles y valores preparados.

#### Scenario: Componentes que la página no usa
- **WHEN** se abre `/` o `/components/`
- **THEN** ninguno de los archivos JavaScript que descarga contiene el código de componentes que ninguna de sus islas usa, como `Carousel`, `CalendarView`, `ColorPicker` o `StreamScene`

#### Scenario: Página de un componente
- **WHEN** se abre `/components/button/`
- **THEN** ninguno de los archivos JavaScript que descarga contiene el código de `CalendarView`, `ColorPicker`, `Carousel` o `StreamScene`

#### Scenario: Página que se pasa del límite
- **WHEN** un cambio hace que el JavaScript de `/` supere su límite
- **THEN** el paso de CI que mide el JavaScript falla y dice qué página, cuánto pesa y cuál es su límite

#### Scenario: Componente nuevo en el paquete
- **WHEN** se añade al paquete un componente que no usa ninguna isla de `/`
- **THEN** el JavaScript que descarga `/` no cambia

### Requirement: Composiciones de ejemplo
La web SHALL montar cada tipo del Figma de `Modal` (los 51), de `Slide out menu` (los 23) y el `Color picker modal` como composición de ejemplo hecha solo con componentes de Regula, en una página de composiciones de su componente, con su código copiable y su captura aprobada. Estas composiciones no se exportan del paquete.

#### Scenario: Modal de invitar usuarios
- **WHEN** el usuario abre la composición «Invitar usuarios» de la página de composiciones de Modal
- **THEN** ve el modal del Figma funcionando y su código solo importa componentes de `@jotis-me/react`

#### Scenario: Lista completa
- **WHEN** se comparan las composiciones de Modal y de Slideout con los tipos de sus conjuntos del Figma
- **THEN** cada tipo tiene su composición, sin que falte ninguno

### Requirement: Captura de muestra en las cards del índice
Cada card de `/components/` SHALL mostrar una imagen WebP de una muestra del componente tipo *showcase*: su forma más característica, bien compuesta y legible, sin obligación de ser una representación 1:1 de sus variantes ni de su tamaño real. La imagen SHALL corresponder al tema de la página (clara u oscura) y cambiar con él sin recargar; los componentes de Stream SHALL ir siempre en oscuro. La card no SHALL pintar el componente en vivo.

#### Scenario: Card con captura
- **WHEN** se abre `/components/` y se mira la card de `ButtonGroup`
- **THEN** su vista previa es una imagen WebP con el grupo de botones entero y sin deformar, no el componente montado en la página

#### Scenario: Solo lo principal
- **WHEN** se mira la card de `Button`
- **THEN** la captura enseña una composición con lo característico del botón, no todas sus jerarquías y tamaños

#### Scenario: Sigue el tema
- **WHEN** se cambia la web a oscuro
- **THEN** las cards de los componentes de aplicación muestran su captura oscura sin recargar, y las de Stream siguen en oscuro en los dos temas

#### Scenario: Solo se descarga lo que se ve
- **WHEN** se carga `/components/` en claro
- **THEN** el navegador no descarga las capturas oscuras ni las de las cards que aún no han entrado en pantalla, y cada imagen reserva su hueco para que la página no salte al cargarla

#### Scenario: Nítida en pantallas densas
- **WHEN** se mira una card en una pantalla con densidad 2×
- **THEN** el texto de la captura se lee nítido

### Requirement: Capturas regenerables y completas
Las capturas de las cards SHALL guardarse en el repo, optimizadas, y SHALL poder regenerarse con un comando para todo el catálogo o para los componentes que se le indiquen. Los tests de la web SHALL fallar si a un componente del catálogo le falta alguna de sus capturas o si una captura supera el peso máximo fijado en el repo.

#### Scenario: Regenerar una
- **WHEN** se ejecuta el comando de capturas con `Button`
- **THEN** se reescriben solo las capturas clara y oscura de `Button`

#### Scenario: Falta una captura
- **WHEN** un componente del catálogo no tiene su captura clara o la oscura (los de Stream, solo la oscura)
- **THEN** los tests de la web fallan diciendo qué componente y qué tema

#### Scenario: Captura pesada
- **WHEN** una captura pesa más que el máximo por imagen, o el conjunto más que el máximo total
- **THEN** los tests de la web fallan diciendo cuál y cuánto pesa

### Requirement: Controles del ejemplo alineados
Los controles del ejemplo interactivo SHALL alinearse por su borde superior en cada fila. Que un control muestre debajo el motivo por el que está desactivado no SHALL mover de sitio la etiqueta ni el campo de los demás controles de su fila.

#### Scenario: Control desactivado con motivo
- **WHEN** en el ejemplo de `Button` se activa `iconOnly` y `iconTrailing` queda desactivado con su motivo debajo
- **THEN** las etiquetas y los campos de los demás controles de esa fila siguen a la misma altura que antes de activarlo

#### Scenario: Interruptores junto a selectores
- **WHEN** una fila tiene selectores e interruptores y uno de los selectores muestra un motivo
- **THEN** los interruptores siguen a la altura del campo de los selectores, sin desplazarse

### Requirement: Esqueleto común de página
Todas las páginas salvo la portada y la 404 SHALL abrir con una cabecera de página (`PageHeader`) con migas, título y descripción, y cada sección SHALL abrir con un `SectionHeader`. El espaciado vertical, el ancho de lectura de los textos (720 px como máximo) y la jerarquía de títulos SHALL ser los mismos en todos los tipos de página.

#### Scenario: Mismo arranque
- **WHEN** se abren la página de `Button`, la de color y `/components/`
- **THEN** las tres empiezan con un `PageHeader` con un solo `h1`, y sus secciones son `h2` con el mismo espacio entre ellas

### Requirement: Reglas con ejemplos
Las páginas de fundamentos que enuncian reglas y las de componente SHALL enseñar sus reglas principales con pares de ejemplos hechos con componentes reales, uno que cumple la regla y otro que no, cada uno con su veredicto en texto («Esto sí», «Esto no», «En lugar de», «Mejor») y una frase.

#### Scenario: Una acción principal
- **WHEN** se abre la página de `Button`
- **THEN** «Cuándo usarlo» enseña un ejemplo con un primario y un secundario marcado «Esto sí» y otro con dos primarios marcado «Esto no», hechos con `Button`

#### Scenario: Contenido y tono
- **WHEN** se abre la página de contenido y tono
- **THEN** cada caso de «En lugar de esto, esto otro» se enseña con el mismo componente con el texto malo y con el bueno

### Requirement: Explorador de tokens
Las páginas de tokens SHALL tener un explorador con filtro por nombre, valor o uso y una elección de familia, que enseña de cada token su nombre, su valor claro y su valor oscuro a la vez, la utilidad que se copia al pulsarla y su nota de uso. En móvil, cada token SHALL ser una tarjeta, sin tabla con desplazamiento horizontal.

#### Scenario: Filtrar
- **WHEN** en la página de color el usuario escribe «placeholder» en el filtro
- **THEN** queda `text-placeholder` con sus dos valores y su nota

#### Scenario: En móvil
- **WHEN** se abre la página de color a 390 px
- **THEN** cada token es una tarjeta con su nombre, sus dos muestras, su botón de copiar y su uso, y la página no se desplaza en horizontal

### Requirement: Estados de la web
La web SHALL tener estados de carga, sin resultados y error para sus partes que esperan o buscan: las muestras y el ejemplo interactivo SHALL enseñar que cargan; cada buscador sin coincidencias SHALL decir qué se buscó y ofrecer cómo salir; y un fallo al copiar SHALL avisar de qué ha pasado y cómo copiar a mano, sin cerrarse solo y sin humor.

#### Scenario: Sin resultados en el índice
- **WHEN** el usuario escribe «botonn» en el buscador de `/components/`
- **THEN** se ve un estado vacío que nombra «botonn» y un botón «Limpiar búsqueda»

#### Scenario: Copiar falla
- **WHEN** el navegador no deja usar el portapapeles y el usuario pulsa copiar en un fragmento de código
- **THEN** aparece un aviso de error que dice que no se ha podido copiar y que se puede seleccionar el texto y copiarlo a mano, y no se cierra hasta que el usuario lo cierra

### Requirement: Escena en 21:9
La ficha de `StreamScene` SHALL incluir un ejemplo en 21:9 (`width={2580}`) con el código para 3440×1440.

#### Scenario: Ejemplo ultrapanorámico
- **WHEN** se abre `/components/stream-scene/`
- **THEN** hay un ejemplo de la escena en 21:9 con su código, que usa `width={2580}` y `scale={4/3}`
