# Spec Delta

## MODIFIED Requirements

### Requirement: Secciones de fundamentos
La web SHALL tener una página para cada apartado de la guía: principios, contenido y tono, color, tipografía, espaciado, radios y layout, sombras y estados, iconografía, fondos y adornos, marca e iconos de app, Stream (Twitch), y la instalación con Tailwind v4 en Next.js y Astro, con el contenido de la guía. Las URLs SHALL ser `/foundations/<apartado>/` (con `layout` y `states` para espaciado y sombras), `/foundations/stream/` y `/start/install/`.

#### Scenario: Contenido y tono
- **WHEN** se abre la página de contenido y tono
- **THEN** aparecen la voz, las reglas de formato (tuteo, mayúscula inicial, `1.284,50 €`) y los ejemplos "en lugar de" de la guía

#### Scenario: URLs del rediseño
- **WHEN** se abren `/start/install/`, `/foundations/layout/` y `/foundations/states/`
- **THEN** responden con la instalación, el espaciado y las sombras, y `/usage/tailwind/`, `/foundations/spacing/` y `/foundations/shadows/` ya no existen

### Requirement: Página por componente
La web SHALL tener una página por cada componente con: descripción, su ficha de la guía repartida en "Úsalo así", "Evita", "Detalles" y "Accesibilidad" (sin reescribir su texto), ejemplos vivos de sus variantes y estados, tabla de props generada de sus tipos, fragmento de código para Next.js y para Astro, y lo que amplía o difiere de la guía.

#### Scenario: Página de Button
- **WHEN** se abre la página de `Button`
- **THEN** se ven las cinco jerarquías y los cinco tamaños funcionando, la regla de una sola acción primaria y la tabla de props con `hierarchy`, `size`, `destructive`, `iconOnly`, `loading` y `href`

#### Scenario: Fragmento de Astro
- **WHEN** se abre la pestaña Astro del ejemplo de un componente interactivo
- **THEN** el código incluye la importación del paquete y la directiva `client:*` necesaria

#### Scenario: Ficha repartida sin reescribir
- **WHEN** se abre la página de un componente cuya ficha tiene un párrafo "Evita"
- **THEN** ese párrafo aparece en la sección "Evita" con el texto de la ficha sin cambios

### Requirement: Galería de iconos
La web SHALL mostrar todos los iconos del set con buscador por nombre y tamaño de vista previa, y al elegir uno SHALL mostrar un panel con el icono en varios tamaños que permita copiar su nombre, su uso en React, su importación SVG y el SVG en bruto.

#### Scenario: Buscar un icono
- **WHEN** el usuario escribe "cal" en el buscador de iconos
- **THEN** solo se muestran los iconos cuyo nombre contiene "cal"

#### Scenario: Elegir un icono
- **WHEN** el usuario pulsa el icono `calendar`
- **THEN** el panel muestra `calendar` y su código usa el paquete `@jotis-me/icons`

### Requirement: Tema claro y oscuro
La web SHALL ofrecer un conmutador de tema que aplique `dark-mode` a toda la página, recuerde la elección entre visitas y use la preferencia del sistema la primera vez, sin parpadeo del tema equivocado al cargar. En el menú móvil SHALL ofrecer además volver a la preferencia del sistema.

#### Scenario: Recordar tema
- **WHEN** el usuario elige oscuro y recarga la página
- **THEN** la página carga directamente en oscuro

#### Scenario: Volver al sistema
- **WHEN** el usuario elige "Sistema" en el menú móvil con el sistema en oscuro
- **THEN** la página pasa a oscuro y deja de recordar una elección propia

### Requirement: La web sigue el propio sistema
La web SHALL construirse con los paquetes del propio monorepo y cumplir las reglas de la guía: textos en castellano de España con tuteo, sin emojis y una acción principal por vista. La cabecera SHALL mostrar el icono de app de Regula junto al nombre "Regula" en Bricolage Grotesque bold.

#### Scenario: Cabecera
- **WHEN** se abre cualquier página
- **THEN** la cabecera muestra el icono de app de Regula (`Re`, tono `chartreuse`) y "Regula" en Bricolage Grotesque bold en `text-primary`

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

## ADDED Requirements

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
La web SHALL tener en `/components/` un índice de todos los componentes agrupados por tipo, con su descripción, incluidos los de Stream.

#### Scenario: Todos en el índice
- **WHEN** se abre `/components/`
- **THEN** aparecen los 74 componentes, cada uno enlazado a su página

### Requirement: Historial de cambios
La web SHALL tener en `/changelog/` el historial de versiones de los paquetes, generado de sus CHANGELOG en el build.

#### Scenario: Versión publicada
- **WHEN** se publica una versión con una entrada en el CHANGELOG
- **THEN** tras el despliegue `/changelog/` muestra esa versión con su entrada

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
