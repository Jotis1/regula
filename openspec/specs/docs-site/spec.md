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
La web SHALL tener una página por cada componente con: descripción, su ficha repartida en "Úsalo así", "Evita", "Detalles" y "Accesibilidad" (sin reescribir su texto), ejemplos vivos de sus variantes y estados, tabla de props generada de sus tipos, fragmento de código para Next.js y para Astro, y lo que amplía o difiere de la guía. La ficha de cada componente vive en el repo junto a su página y es la misma que se publica en el artefacto generado.

#### Scenario: Página de Button
- **WHEN** se abre la página de `Button`
- **THEN** se ven las cinco jerarquías y los cinco tamaños funcionando, la regla de una sola acción primaria y la tabla de props con `hierarchy`, `size`, `destructive`, `iconOnly`, `loading` y `href`

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
La web SHALL mostrar los 1.172 iconos del set completo, todos los logos de terceros y los sets de banderas, pagos, archivos y cursores. Cada galería SHALL tener buscador por nombre y tamaño de vista previa. Al elegir uno SHALL mostrar un panel con el icono o recurso en varios tamaños que permita copiar su nombre, su uso en React, su importación SVG y el SVG en bruto. Cada galería SHALL cargar solo los dibujos que están a la vista y quedar dentro del límite de JavaScript de su página.

#### Scenario: Buscar un icono
- **WHEN** el usuario escribe "cal" en el buscador de iconos
- **THEN** solo se muestran los iconos cuyo nombre contiene "cal"

#### Scenario: Elegir un icono
- **WHEN** el usuario pulsa el icono `calendar`
- **THEN** el panel muestra `calendar` y su código usa el paquete `@jotis-me/icons`

#### Scenario: Icono fuera del núcleo
- **WHEN** el usuario elige un icono que no está en el set núcleo
- **THEN** el código del panel importa su componente suelto (`IconXxx`) en lugar de usar `Icon name`

#### Scenario: Elegir un logo
- **WHEN** el usuario busca "github" y pulsa el logo de GitHub del set social
- **THEN** el panel muestra sus variantes en color y en gris y su código importa ese logo de `@jotis-me/icons/logos`

#### Scenario: Galería larga
- **WHEN** se abre la galería de iconos, que tiene 1.172
- **THEN** se ven los primeros con el recuento total («1172 iconos») y un botón «Mostrar más» que añade más, sin pedir los dibujos de los que no están a la vista, y el buscador recorre los 1.172

#### Scenario: Filtrar por categoría
- **WHEN** el usuario elige la categoría «Tiempo» en la galería de iconos
- **THEN** solo quedan los iconos de esa categoría del Figma y el recuento dice cuántos son del total

#### Scenario: Elegir una bandera
- **WHEN** el usuario busca "spain" en la galería de banderas y pulsa la bandera
- **THEN** el panel enseña el círculo, el cuadrado y el rectángulo, y su código importa de `@jotis-me/icons/flags`

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
La web SHALL construirse con los paquetes del propio monorepo y cumplir las reglas de la guía: textos en castellano de España con tuteo, sin emojis y una acción principal por vista. La cabecera SHALL mostrar el icono de app de Regula junto al nombre "Regula" en Bricolage Grotesque bold.

#### Scenario: Cabecera
- **WHEN** se abre cualquier página
- **THEN** la cabecera muestra el icono de app de Regula (`Re`, tono `fuchsia`) y "Regula" en Bricolage Grotesque bold en `text-primary`

#### Scenario: Paquetes reales en el código
- **WHEN** se revisa cualquier fragmento de código de la web
- **THEN** solo importa de `@jotis-me/react`, `@jotis-me/tokens` o `@jotis-me/icons`

### Requirement: Búsqueda y navegación
La web SHALL tener en la cabecera las secciones Empezar, Fundamentos, Componentes, Stream e Iconos; una navegación lateral con filtro y los componentes agrupados por tipo; y una búsqueda global de páginas, tokens, iconos y componentes accesible con Ctrl+K / Cmd+K.

#### Scenario: Atajo de búsqueda
- **WHEN** el usuario pulsa Ctrl+K y escribe "modal"
- **THEN** aparece la página del componente `Modal` en los resultados y Enter navega a ella

#### Scenario: Filtrar la navegación
- **WHEN** el usuario escribe "tabla" en el filtro de la navegación lateral
- **THEN** solo quedan los enlaces que coinciden, con su grupo abierto, entre ellos `Table`

#### Scenario: Grupo del componente actual
- **WHEN** se abre la página de `Button`
- **THEN** la navegación lateral tiene abierto el grupo Acciones con `Button` marcado como página actual

### Requirement: Publicación en regula.jotis.me
La web SHALL servirse como sitio estático en `https://regula.jotis.me` con HTTPS, y SHALL indicar en el pie la versión de los paquetes que documenta, con un enlace al historial de cambios.

#### Scenario: Versión documentada
- **WHEN** se publica una versión nueva de los paquetes
- **THEN** tras el despliegue el pie de la web muestra ese número de versión

### Requirement: Rendimiento y accesibilidad de la web
Las páginas de la web SHALL pasar axe sin violaciones serias o críticas y SHALL obtener al menos 90 en Lighthouse en rendimiento y accesibilidad en móvil.

#### Scenario: Auditoría en CI
- **WHEN** se ejecuta la auditoría sobre la portada, el índice de componentes, una página de fundamentos y una de componente
- **THEN** las cuatro superan los umbrales

### Requirement: Portada
La portada SHALL presentar qué es Regula, llevar a la instalación como acción principal, abrir la búsqueda y enlazar a Fundamentos, Componentes, Stream e Iconos con sus cifras reales, calculadas en el build.

#### Scenario: Cifras reales
- **WHEN** se abre la portada
- **THEN** el número de componentes, iconos y tokens que muestra coincide con el de los paquetes

### Requirement: Playground de componente
La página de cada componente SHALL ofrecer un playground generado desde sus props: un selector por cada prop con valores cerrados y un interruptor por cada booleano, que cambian el ejemplo y su código al momento. Un componente sin props de ese tipo SHALL mostrar solo sus ejemplos.

#### Scenario: Cambiar una prop
- **WHEN** en el playground de `Button` se elige `secondary` en `hierarchy`
- **THEN** el botón del ejemplo pasa a secundario y el código muestra `hierarchy="secondary"`

#### Scenario: Código copiable
- **WHEN** el usuario copia el código del playground
- **THEN** el texto copiado es JSX válido que importa de `@jotis-me/react`

### Requirement: Navegación dentro de la página
Las páginas de fundamentos y de componente SHALL mostrar migas de pan, un índice "En esta página" de sus secciones y enlaces a la página anterior y siguiente de su sección. Las de componente SHALL enlazar además a componentes relacionados.

#### Scenario: Anterior y siguiente
- **WHEN** se abre la página de color
- **THEN** enlaza a contenido y tono como anterior y a tipografía como siguiente

### Requirement: Índice de componentes
La web SHALL tener en `/components/` un índice de todos los componentes del catálogo agrupados por tipo, con su descripción, incluidos los de Stream.

#### Scenario: Todos en el índice
- **WHEN** se abre `/components/`
- **THEN** aparecen todos los componentes que exporta `@jotis-me/react`, cada uno enlazado a su página, y ninguno más

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

### Requirement: Vista previa en vivo en las cards del índice
Cada card de `/components/` SHALL mostrar una muestra con lo más característico del componente, pintada con el propio componente y en el tema de la página, sobre un fondo de cuadros sutil que indica transparencia. Los de Stream SHALL ir siempre en oscuro. La vista previa SHALL pintarse en el servidor, sin JavaScript propio.

#### Scenario: Vista previa con el componente real
- **WHEN** se abre `/components/` y se mira la card de `ButtonGroup`
- **THEN** la card contiene un `ButtonGroup` pintado con el componente del paquete, sin imágenes, entero dentro del recuadro de la vista previa

#### Scenario: Una sola muestra, sobre cuadros
- **WHEN** se mira la card de `Button`
- **THEN** su vista previa enseña un botón característico, no todas las jerarquías y tamaños de su ejemplo, sobre un damero de cuadros en `bg-secondary` y `bg-primary` que cambia con el tema

#### Scenario: Sigue el tema
- **WHEN** se cambia la web a oscuro
- **THEN** las vistas previas de los componentes de aplicación pasan a oscuro sin recargar ni pedir nada, y las de Stream siguen en oscuro en los dos temas

#### Scenario: Sin JavaScript para las vistas previas
- **WHEN** se carga `/components/`
- **THEN** ninguna vista previa es una isla que se hidrate, y la página funciona igual con el JavaScript desactivado

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
El build de la web SHALL funcionar sin leer las capturas aprobadas de la paridad visual. Esas capturas SHALL seguir siendo la referencia de los tests visuales.

#### Scenario: Componente nuevo sin captura
- **WHEN** se añade un componente al catálogo con su ficha y su ejemplo, todavía sin sus PNG aprobadas, y se construye la web
- **THEN** el build termina sin errores y su card muestra la vista previa en vivo; el test de catálogo y el visual siguen fallando por la captura que falta

### Requirement: JavaScript solo de lo que se usa
Cada página de la web SHALL descargar solo el código de los componentes que usan sus islas, y el JavaScript de cada página SHALL quedar dentro de un límite guardado en el repo y comprobado en CI. Subir un límite SHALL ser un cambio explícito de ese fichero.

#### Scenario: Componentes que la página no usa
- **WHEN** se abre `/` o `/components/`
- **THEN** ninguno de los archivos JavaScript que descarga contiene el código de componentes que ninguna de sus islas usa, como `Carousel`, `CalendarView`, `ColorPicker` o `StreamScene`

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
