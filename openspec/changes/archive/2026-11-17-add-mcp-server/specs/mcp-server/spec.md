## ADDED Requirements

### Requirement: Servidor MCP remoto
Regula SHALL servir un servidor MCP en `https://regula.jotis.me/mcp` por Streamable HTTP, sin sesión y sin autenticación. El servidor SHALL ser solo de consulta: ninguna herramienta SHALL escribir, borrar ni llamar a servicios externos. SHALL anunciarse con el nombre `regula` y la versión de `@jotis-me/react` que documenta la web.

#### Scenario: Conectar un cliente
- **WHEN** un cliente MCP envía `initialize` a `https://regula.jotis.me/mcp`
- **THEN** recibe el nombre `regula`, la versión documentada y la capacidad de herramientas, sin pedir credenciales

#### Scenario: Listar herramientas
- **WHEN** el cliente pide `tools/list`
- **THEN** recibe las herramientas de normas, componentes, tokens, iconos y la búsqueda global, todas marcadas como de solo lectura

#### Scenario: Petición que no es MCP
- **WHEN** se abre `/mcp` con un `GET` desde el navegador
- **THEN** la respuesta es un error 405 con un enlace a `/start/mcp/`, no una página rota

### Requirement: Idioma de las herramientas
Los nombres de las herramientas y de sus parámetros SHALL ir en inglés, en `snake_case`, y sus descripciones SHALL ir en inglés. Los textos que devuelven SHALL ser los de la guía, en español. Cada resultado SHALL llevar la URL absoluta de su página en la web.

#### Scenario: Resultado con su página
- **WHEN** una herramienta devuelve la norma `NOM-001`
- **THEN** el resultado trae su enunciado en español y la URL `https://regula.jotis.me/standards/naming/#nom-001`

### Requirement: Herramientas de normas
El servidor SHALL tener:
- `list_standards`: las áreas con sus normas (ID, título y nivel), con un filtro opcional por área;
- `get_standard`: una norma completa por su ID, sin distinguir mayúsculas.

Una norma completa SHALL traer los mismos campos que `/standards.json`.

#### Scenario: Leer una norma por ID
- **WHEN** se llama a `get_standard` con `git-001`
- **THEN** devuelve la norma de Conventional Commits con su nivel, a qué se aplica, el enunciado, el porqué, los ejemplos y cómo se verifica

#### Scenario: ID que no existe
- **WHEN** se llama a `get_standard` con `NOM-999`
- **THEN** devuelve un error de herramienta que dice que no existe y sugiere `list_standards`

### Requirement: Herramientas de componentes
El servidor SHALL tener:
- `list_components`: los componentes con su grupo y su descripción, con un filtro opcional por grupo;
- `get_component`: la ficha de un componente por su nombre, sin distinguir mayúsculas.

La ficha SHALL traer la descripción, la guía de uso, las props (nombre, tipo, si es obligatoria, valor por defecto y descripción), si necesita `client:*` en Astro y los fragmentos de Next y de Astro.

#### Scenario: Props de Button
- **WHEN** se llama a `get_component` con `button`
- **THEN** devuelve la ficha de `Button` con la prop `hierarchy` y sus valores `primary · secondary · tertiary · link-color · link-gray`, y los dos fragmentos de código

#### Scenario: Componente que no existe
- **WHEN** se llama a `get_component` con `Botón`
- **THEN** devuelve un error de herramienta con los nombres más parecidos

### Requirement: Herramienta de tokens
El servidor SHALL tener `search_tokens`, que busca tokens por texto en su nombre, o en su uso, con un filtro opcional por categoría (`color`, `type`, `spacing`, `radius`, `width`, `shadow`, `blur`, las de `@jotis-me/tokens`). Cada token SHALL traer su nombre, su categoría, su uso y su valor, por tema cuando cambia entre temas.

#### Scenario: Texto secundario
- **WHEN** se llama a `search_tokens` con `text-secondary`
- **THEN** el primer resultado es el token `text-secondary` con su valor en claro y en oscuro

### Requirement: Herramienta de iconos
El servidor SHALL tener `search_icons`, que busca en las galerías de la web (iconos de línea, banderas, tipos de archivo, pagos y cursores) por nombre, en PascalCase o con guiones, y por título, sin tildes ni mayúsculas. Cada resultado SHALL traer su galería, su nombre, sus variantes y cómo se importa.

#### Scenario: Icono de buscar
- **WHEN** se llama a `search_icons` con `search-lg`
- **THEN** aparece `SearchLg` de la galería de línea con su import `import { SearchLg } from "@untitledui/icons"`

#### Scenario: Bandera por país
- **WHEN** se llama a `search_icons` con `españa` y la galería `flags`
- **THEN** aparece la bandera `es`

### Requirement: Búsqueda global
El servidor SHALL tener `search`, que busca un texto en normas, componentes, tokens e iconos a la vez y devuelve los resultados agrupados por tipo, con un máximo por grupo. Cada resultado SHALL decir qué herramienta da su detalle.

#### Scenario: Buscar «dominio inverso»
- **WHEN** se llama a `search` con `dominio inverso`
- **THEN** el grupo de normas trae `NOM-001` y dice que su detalle sale de `get_standard`

### Requirement: Límites de las respuestas
Cada herramienta SHALL validar sus parámetros y responder con un error de herramienta, no con un fallo del servidor, si no son válidos. Las búsquedas SHALL devolver como mucho 20 resultados por defecto y 50 si se piden más.

#### Scenario: Parámetro inválido
- **WHEN** se llama a `search_icons` sin `query`
- **THEN** la respuesta es un error de herramienta que nombra el parámetro que falta

### Requirement: Datos públicos en JSON
La web SHALL publicar en el build, desde las mismas fuentes que sus páginas:
- `/components.json`: cada componente con su grupo, su ficha y sus props;
- `/tokens.json`: los tokens con sus valores por tema;
- `/icons.json`: las entradas de cada galería con su import.

Los nombres de campo SHALL ir en inglés. Cada JSON SHALL llevar la versión de Regula que lo publica. El MCP SHALL responder con estos datos y con `/standards.json`, sin otra fuente.

#### Scenario: Mismo dato en la web y en el MCP
- **WHEN** cambia la descripción de `Button` en su ficha y se despliega
- **THEN** la página de `Button`, `/components.json` y `get_component` devuelven la descripción nueva

### Requirement: Servidor comprobado
Los tests SHALL ejercitar el servidor MCP con un cliente MCP real contra el manejador de `/mcp`: `initialize`, `tools/list` y al menos una llamada con éxito y una con error por cada herramienta. Tras desplegar, SHALL comprobarse a mano que un cliente se conecta a la URL pública.

#### Scenario: Test del manejador
- **WHEN** corre la suite de tests de la web
- **THEN** un cliente MCP conecta con el manejador, lista las herramientas y llama a cada una
