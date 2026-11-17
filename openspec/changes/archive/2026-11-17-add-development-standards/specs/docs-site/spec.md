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

#### Scenario: Cabecera a 1024 px
- **WHEN** se abre cualquier página a 1024 px de ancho
- **THEN** las seis secciones caben, la búsqueda es un botón de icono de 44 px a la vista y la página no se desplaza en horizontal

#### Scenario: Buscar una norma
- **WHEN** el usuario pulsa Ctrl+K y escribe "NAM-001" o "dominio inverso"
- **THEN** aparece la norma de los paquetes privados, y Enter lleva a su área con la norma a la vista
