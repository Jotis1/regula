## MODIFIED Requirements

### Requirement: Idioma de las herramientas
Los nombres de las herramientas y de sus parámetros SHALL ir en inglés, en `snake_case`, y sus descripciones SHALL ir en inglés. Los textos que devuelven SHALL ser los de la guía, en español. Cada resultado SHALL llevar la URL absoluta de su página en la web.

#### Scenario: Resultado con su página
- **WHEN** una herramienta devuelve la norma `NAM-001`
- **THEN** el resultado trae su enunciado en español y la URL `https://regula.jotis.me/standards/naming/#nam-001`

### Requirement: Herramientas de normas
El servidor SHALL tener:
- `list_standards`: las áreas con sus normas (ID, título y nivel), con un filtro opcional por área;
- `get_standard`: una norma completa por su ID, sin distinguir mayúsculas.

Una norma completa SHALL traer los mismos campos que `/standards.json`, incluidas sus excepciones si las tiene.

#### Scenario: Leer una norma por ID
- **WHEN** se llama a `get_standard` con `git-001`
- **THEN** devuelve la norma de Conventional Commits con su nivel, a qué se aplica, el enunciado, el porqué, los ejemplos y cómo se verifica

#### Scenario: ID que no existe
- **WHEN** se llama a `get_standard` con `NAM-999`
- **THEN** devuelve un error de herramienta que dice que no existe y sugiere `list_standards`

#### Scenario: Norma con excepciones
- **WHEN** se llama a `get_standard` con `COD-009`
- **THEN** la norma trae sus excepciones, entre ellas los archivos especiales de Next

### Requirement: Búsqueda global
El servidor SHALL tener `search`, que busca un texto en normas, componentes, tokens e iconos a la vez y devuelve los resultados agrupados por tipo, con un máximo por grupo. Cada resultado SHALL decir qué herramienta da su detalle.

#### Scenario: Buscar «dominio inverso»
- **WHEN** se llama a `search` con `dominio inverso`
- **THEN** el grupo de normas trae `NAM-001` y dice que su detalle sale de `get_standard`
