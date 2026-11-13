# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Galería de iconos
La web SHALL mostrar los iconos de `@untitledui/icons`, las banderas de `@untitledui/country-flags`, los tipos de `@untitledui/file-icons` y los logos de terceros, pagos y cursores de `@jotis-me/assets`. Cada galería SHALL tener buscador por nombre y tamaño de vista previa. Al elegir uno SHALL mostrar un panel con el icono o recurso en varios tamaños que permita copiar su nombre y su uso en React con la importación del paquete del que sale, y, en los sets de `@jotis-me/assets`, su importación SVG y el SVG en bruto. Cada galería SHALL cargar solo los dibujos que están a la vista y quedar dentro del límite de JavaScript de su página.

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

### Requirement: La web sigue el propio sistema
La web SHALL construirse con los paquetes del propio monorepo y cumplir las reglas de la guía: textos en castellano de España con tuteo, sin emojis y una acción principal por vista. Su estructura (cabecera, menú móvil, pie y búsqueda) y las secciones de la portada SHALL montarse con componentes de `@jotis-me/react`, sin rehacer a mano lo que ya hace un componente del paquete. La navegación lateral queda fuera de esta regla: SHALL seguir siendo HTML del servidor que funciona sin JavaScript, con grupos `<details>`. Si a un componente le falta algo para la web, SHALL ampliarse el componente. La cabecera SHALL mostrar el icono de app de Regula junto al nombre "Regula" en Bricolage Grotesque bold. Cabecera, contenido y pie SHALL medir como máximo el ancho del contenedor de la guía (`container-max-width-desktop`, 1280 px), centrados; la navegación lateral queda fuera de ese ancho, pegada al borde izquierdo.

#### Scenario: Cabecera
- **WHEN** se abre cualquier página
- **THEN** la cabecera muestra el icono de app de Regula (`Re`, tono `fuchsia`) y "Regula" en Bricolage Grotesque bold en `text-primary`

#### Scenario: Paquetes reales en el código
- **WHEN** se revisa cualquier fragmento de código de la web
- **THEN** solo importa de `@jotis-me/react`, `@jotis-me/tokens`, `@jotis-me/assets`, `@untitledui/icons`, `@untitledui/file-icons` o `@untitledui/country-flags`, y ninguno importa de `@jotis-me/icons`

#### Scenario: Estructura con el paquete
- **WHEN** se inspecciona la cabecera, el menú móvil, el pie o la búsqueda de cualquier página
- **THEN** cada uno es un componente de `@jotis-me/react` (`HeaderNav`, `Slideout`, `Footer` y `CommandMenu`, o el que lo sustituya en el catálogo)

#### Scenario: Navegación lateral sin JavaScript
- **WHEN** se abre una página de componente con el JavaScript desactivado
- **THEN** la navegación lateral se ve entera, sus grupos se abren y se cierran, y el grupo del componente actual está abierto

#### Scenario: Ancho del contenedor
- **WHEN** se abre una página de componente en una ventana de 1920 px
- **THEN** la navegación lateral queda pegada a la izquierda, y el contenido con su índice «En esta página» mide como máximo 1280 px, igual que la cabecera y el pie

#### Scenario: Ventana estrecha
- **WHEN** se abre la misma página en una ventana de 1280 px
- **THEN** el contenido ocupa el ancho que deja la navegación lateral, sin desplazamiento horizontal de la página

### Requirement: Rendimiento y accesibilidad de la web
Las páginas de la web SHALL pasar axe sin violaciones serias o críticas y SHALL obtener al menos 90 en Lighthouse en rendimiento y accesibilidad en móvil, sin excepciones.

#### Scenario: Auditoría en CI
- **WHEN** se ejecuta la auditoría sobre la portada, el índice de componentes, una página de fundamentos y una de componente
- **THEN** las cuatro superan 90 en rendimiento y en accesibilidad

### Requirement: Playground de componente
La página de cada componente del catálogo SHALL ofrecer un ejemplo interactivo que pinta el componente real y su código para Next.js y Astro, actualizados al momento con cada cambio. SHALL tener:

- **Controles** para cada prop configurable: un selector por cada prop con valores cerrados, un interruptor por cada booleano, un campo numérico (con mínimo, máximo y paso cuando tengan sentido), un selector de icono y, para las props que reciben contenido (nodos, listas u objetos), un selector de valores preparados. Las props controladas, de callback o internas no tienen control.
- **Estados** (`disabled`, `error`, `loading` o los que tenga el componente) como controles normales.
- **Reglas de incompatibilidad.** Cada control que no aplica con los valores actuales de otros SHALL aparecer desactivado, con el motivo visible y anunciado a los lectores de pantalla, y su prop no SHALL pasarse al componente ni aparecer en el código.

El ejemplo no SHALL tener atajos de tipos ni ninguna otra fila de botones sobre los controles: los controles de propiedades son la única forma de cambiarlo.

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
- **WHEN** se abre el ejemplo interactivo de `Input`, que antes tenía la fila «Tipos»
- **THEN** no hay fila de atajos, y el tipo «Tarjeta de pago» se alcanza eligiendo `card` en el control `type`

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
- **THEN** el texto copiado es JSX válido que importa de `@jotis-me/react` y, si usa iconos, de `@untitledui/icons`

#### Scenario: Con teclado
- **WHEN** el usuario recorre los controles con Tab y cambia uno con el teclado
- **THEN** todos los controles activos reciben el foco, los desactivados se anuncian con su motivo y el ejemplo se actualiza

### Requirement: Build sin capturas
El build de la web SHALL funcionar sin leer las capturas aprobadas de la paridad visual, que SHALL seguir siendo la referencia de los tests visuales, y SHALL terminar también cuando a un componente le falta la captura de su card: esa card SHALL mostrar el fondo de cuadros vacío.

#### Scenario: Componente nuevo sin captura
- **WHEN** se añade un componente al catálogo con su ficha, su ejemplo y su muestra, todavía sin sus capturas, y se construye la web
- **THEN** el build termina sin errores y su card muestra el fondo de cuadros vacío; los tests de catálogo siguen fallando por las capturas que faltan

## REMOVED Requirements

### Requirement: Vista previa en vivo en las cards del índice
**Reason**: Los componentes pintados en vivo dentro de un recuadro de 288×180 se recortaban y se veían atrofiados, y pintar 121 muestras en el HTML obligaba a una excepción de rendimiento en el índice.
**Migration**: Lo sustituye el requisito «Captura de muestra en las cards del índice». El requisito «Vista previa decorativa» sigue valiendo para la imagen.
