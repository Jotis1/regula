# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

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
