## MODIFIED Requirements

### Requirement: Búsqueda y navegación
La web SHALL tener en la cabecera las secciones Empezar, Fundamentos, Componentes, Stream, Iconos y Normas. SHALL tener también:
- una navegación lateral con filtro que enseña el árbol de la sección actual. En Componentes y Stream son los componentes agrupados por tipo; en Normas, el índice y las áreas;
- una búsqueda global de páginas, tokens, iconos, componentes y normas, accesible con Ctrl+K / Cmd+K.

La portada, las páginas de iconos y la 404 no SHALL llevar navegación lateral.

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

#### Scenario: Buscar una norma
- **WHEN** el usuario pulsa Ctrl+K y escribe "NOM-001" o "dominio inverso"
- **THEN** aparece la norma de los paquetes privados, y Enter lleva a su área con la norma a la vista

## ADDED Requirements

### Requirement: URLs de la web en inglés
Las rutas de la web y los parámetros de sus URLs SHALL ir en inglés:
- las composiciones de un componente se sirven en `/components/<componente>/compositions/`;
- la galería abre un icono con `?icon=<nombre>`;
- las páginas `/visual/` y `/showcase/` cambian de tema con `?theme=dark`.

Las rutas antiguas `/components/<componente>/composiciones/` SHALL redirigir a las nuevas.

#### Scenario: Composiciones de Modal
- **WHEN** se abre `/components/modal/composiciones/`
- **THEN** la web redirige a `/components/modal/compositions/`, que enseña las 51 composiciones

#### Scenario: Icono desde la búsqueda
- **WHEN** el usuario busca un icono con Ctrl+K y pulsa Enter
- **THEN** la galería se abre con `?icon=<nombre>` y el icono a la vista

#### Scenario: Ejemplo en oscuro
- **WHEN** se abre `/visual/button/?theme=dark`
- **THEN** la página se pinta en tema oscuro

### Requirement: Sección de normas
La web SHALL tener una sección Normas:
- un índice en `/standards/`, con todas las normas agrupadas por área, cada una con su ID, su título y su nivel;
- una página por área en `/standards/<area>/`, con cada norma completa.

Las páginas SHALL usar los componentes de Regula y el esqueleto común de página.

#### Scenario: Índice
- **WHEN** se abre `/standards/`
- **THEN** aparecen las áreas Nombres, Idioma, Git y Proceso, cada una con sus normas, y cada norma enlaza a su ancla en la página del área

#### Scenario: Accesibilidad
- **WHEN** se auditan `/standards/` y una página de área con axe en los dos temas
- **THEN** no hay errores

### Requirement: Cada norma en su página
Cada norma SHALL tener un ancla con su ID en minúsculas (`/standards/naming/#nom-001`). El nivel SHALL verse como texto («Debe», «Debería», «Puede») y no solo como color. Los ejemplos de código SHALL pintarse con `CodeSnippet`, con el veredicto («Esto sí», «Esto no») en texto.

#### Scenario: Enlace a una norma
- **WHEN** se abre `/standards/git/#git-001`
- **THEN** la página baja hasta la norma de Conventional Commits, que muestra su nivel, a qué se aplica, el porqué, los ejemplos y cómo se verifica
