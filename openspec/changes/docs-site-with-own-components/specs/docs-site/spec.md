## MODIFIED Requirements

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

### Requirement: Playground de componente
La página de cada componente del catálogo SHALL ofrecer un ejemplo interactivo que pinta el componente real y su código para Next.js y Astro, actualizados al momento con cada cambio. SHALL tener:

- **Controles** para cada prop configurable: un selector por cada prop con valores cerrados, un interruptor por cada booleano, un campo numérico (con mínimo, máximo y paso cuando tengan sentido), un selector de icono y, para las props que reciben contenido (nodos, listas u objetos), un selector de valores preparados. Las props controladas, de callback o internas no tienen control.
- **Estados** (`disabled`, `error`, `loading` o los que tenga el componente) como controles normales.
- **Atajos** con los tipos del Figma del componente, cuando tiene más de uno. Un atajo pone de una vez las props que definen ese tipo y queda marcado mientras esas props no cambien.
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
- **WHEN** en el ejemplo de `Button` se elige el icono `plus` en `icon`
- **THEN** el botón muestra ese icono y el código muestra `icon="plus"`

#### Scenario: Contenido preparado
- **WHEN** en el ejemplo de `Badge` se elige un avatar en `avatar`
- **THEN** la insignia lo muestra y el código incluye el JSX equivalente

#### Scenario: Atajo de un tipo del Figma
- **WHEN** en el ejemplo de `Input` se pulsa el atajo «Tarjeta de pago»
- **THEN** el campo pasa a ese tipo, los controles reflejan las props que puso el atajo y el atajo queda marcado

#### Scenario: Prop incompatible
- **WHEN** en el ejemplo de `Button` se activa `iconOnly`
- **THEN** el control `iconTrailing` queda desactivado con su motivo, el botón no lo recibe y el código no lo incluye; al desactivar `iconOnly`, el control vuelve con su valor anterior

#### Scenario: Reglas comprobadas
- **WHEN** una regla de incompatibilidad nombra una prop o un valor que el componente no tiene
- **THEN** los tests de la web fallan diciendo qué componente y qué regla

#### Scenario: Estado
- **WHEN** en el ejemplo de `Input` se activa `disabled`
- **THEN** el campo se pinta deshabilitado y el código muestra `disabled`

#### Scenario: Código copiable
- **WHEN** el usuario copia el código del ejemplo interactivo
- **THEN** el texto copiado es JSX válido que importa de `@jotis-me/react` (y de `@jotis-me/icons` si usa un icono que no está en el núcleo)

#### Scenario: Con teclado
- **WHEN** el usuario recorre los controles con Tab y cambia uno con el teclado
- **THEN** todos los controles activos reciben el foco, los desactivados se anuncian con su motivo y el ejemplo se actualiza

### Requirement: Vista previa en vivo en las cards del índice
Cada card de `/components/` SHALL mostrar una muestra con lo más característico del componente, pintada con el propio componente a su tamaño real, en el tema de la página y sobre un fondo de cuadros sutil que indica transparencia. La muestra no SHALL encogerse: si el componente no cabe entero en el recuadro, SHALL recortarse con un fundido en el borde. Los de Stream SHALL ir siempre en oscuro. La vista previa SHALL pintarse en el servidor, sin JavaScript propio.

#### Scenario: Vista previa con el componente real
- **WHEN** se abre `/components/` y se mira la card de `ButtonGroup`
- **THEN** la card contiene un `ButtonGroup` pintado con el componente del paquete, sin imágenes, entero dentro del recuadro de la vista previa

#### Scenario: Tamaño real
- **WHEN** se mira la card de `Table`, `Alert` o `LineChart`
- **THEN** su texto se pinta al mismo tamaño que en la página del componente, y lo que no cabe se recorta con un fundido

#### Scenario: Ninguna muestra encogida
- **WHEN** una muestra del índice se pinta con una escala menor que 1
- **THEN** los tests de la web fallan diciendo qué componente

#### Scenario: Una sola muestra, sobre cuadros
- **WHEN** se mira la card de `Button`
- **THEN** su vista previa enseña un botón característico, no todas las jerarquías y tamaños, sobre un damero de cuadros en `bg-secondary` y `bg-primary` que cambia con el tema

#### Scenario: Sigue el tema
- **WHEN** se cambia la web a oscuro
- **THEN** las vistas previas de los componentes de aplicación pasan a oscuro sin recargar ni pedir nada, y las de Stream siguen en oscuro en los dos temas

#### Scenario: Sin JavaScript para las vistas previas
- **WHEN** se carga `/components/`
- **THEN** ninguna vista previa es una isla que se hidrate, y la página funciona igual con el JavaScript desactivado

### Requirement: La web sigue el propio sistema
La web SHALL construirse con los paquetes del propio monorepo y cumplir las reglas de la guía: textos en castellano de España con tuteo, sin emojis y una acción principal por vista. Su estructura (cabecera, navegación lateral, menú móvil, pie y búsqueda) y las secciones de la portada SHALL montarse con componentes de `@jotis-me/react`, sin rehacer a mano lo que ya hace un componente del paquete. Si a un componente le falta algo para la web, SHALL ampliarse el componente. La cabecera SHALL mostrar el icono de app de Regula junto al nombre "Regula" en Bricolage Grotesque bold. Cabecera, contenido y pie SHALL medir como máximo el ancho del contenedor de la guía (`container-max-width-desktop`, 1280 px), centrados; la navegación lateral queda fuera de ese ancho, pegada al borde izquierdo.

#### Scenario: Cabecera
- **WHEN** se abre cualquier página
- **THEN** la cabecera muestra el icono de app de Regula (`Re`, tono `fuchsia`) y "Regula" en Bricolage Grotesque bold en `text-primary`

#### Scenario: Paquetes reales en el código
- **WHEN** se revisa cualquier fragmento de código de la web
- **THEN** solo importa de `@jotis-me/react`, `@jotis-me/tokens` o `@jotis-me/icons`

#### Scenario: Estructura con el paquete
- **WHEN** se inspecciona la cabecera, la navegación lateral, el menú móvil, el pie o la búsqueda de cualquier página
- **THEN** cada uno es un componente de `@jotis-me/react` (`HeaderNav`, `SidebarNav`, `Slideout`, `Footer` y `CommandMenu`, o el que lo sustituya en el catálogo)

#### Scenario: Ancho del contenedor
- **WHEN** se abre una página de componente en una ventana de 1920 px
- **THEN** la navegación lateral queda pegada a la izquierda, y el contenido con su índice «En esta página» mide como máximo 1280 px, igual que la cabecera y el pie

#### Scenario: Ventana estrecha
- **WHEN** se abre la misma página en una ventana de 1280 px
- **THEN** el contenido ocupa el ancho que deja la navegación lateral, sin desplazamiento horizontal de la página

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
