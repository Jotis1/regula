# mcp-server Specification

## Purpose
El servidor MCP remoto de Regula en regula.jotis.me/mcp: las herramientas de consulta sobre normas, componentes, tokens e iconos, los JSON públicos que lo alimentan y cómo se comprueba, para que un agente consulte la guía sin navegar la web.

## Requirements

### Requirement: Servidor MCP remoto
Regula SHALL servir un servidor MCP en `https://regula.jotis.me/mcp` por Streamable HTTP, sin sesión y sin autenticación. El servidor SHALL ser solo de consulta: ninguna herramienta SHALL escribir, borrar ni llamar a servicios externos. SHALL anunciarse con el nombre `regula` y la versión del contrato (requisito «Versión del contrato»).

#### Scenario: Conectar un cliente
- **WHEN** un cliente MCP envía `initialize` a `https://regula.jotis.me/mcp`
- **THEN** recibe el nombre `regula`, la versión del contrato (`1.1.0`) y la capacidad de herramientas, sin pedir credenciales

#### Scenario: Listar herramientas
- **WHEN** el cliente pide `tools/list`
- **THEN** recibe las herramientas de normas, componentes, fundamentos, tokens, iconos y la búsqueda global, todas marcadas como de solo lectura

#### Scenario: Petición que no es MCP
- **WHEN** se abre `/mcp` con un `GET` desde el navegador
- **THEN** la respuesta es un error 405 con un enlace a `/start/mcp/`, no una página rota

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

### Requirement: Herramientas de componentes
El servidor SHALL tener:
- `list_components`: los componentes con su grupo y su descripción, con un filtro opcional por grupo;
- `get_component`: la ficha de un componente por su nombre, sin distinguir mayúsculas.

La ficha SHALL traer la descripción, la guía de uso, las props (nombre, tipo, si es obligatoria, valor por defecto y descripción), los atributos nativos que reenvía (requisito «Atributos nativos de la ficha»), si necesita `client:*` en Astro y los fragmentos de Next y de Astro.

#### Scenario: Props de Button
- **WHEN** se llama a `get_component` con `button`
- **THEN** devuelve la ficha de `Button` con la prop `hierarchy` y sus valores `primary - secondary - tertiary - link-color - link-gray`, y los dos fragmentos de código

#### Scenario: Componente que no existe
- **WHEN** se llama a `get_component` con `Botón`
- **THEN** devuelve un error de herramienta con los nombres más parecidos

### Requirement: Atributos nativos de la ficha
Cada entrada de los atributos nativos de la ficha SHALL nombrar un elemento HTML al que el componente puede reenviarlos y los atributos propios de ese elemento que acepta su tipo. Los globales de HTML, `aria-*` y los eventos no SHALL listarse: se dan por incluidos. Si el tipo solo hereda los globales, la entrada SHALL tener el elemento sin determinar y ningún atributo; si no hereda nada, la lista SHALL ir vacía.

#### Scenario: Atributos nativos de Button
- **WHEN** se llama a `get_component` con `button`
- **THEN** los atributos nativos traen una entrada `button` con `type` y otra `a` con `target`, y ninguna lista `className`, `onClick` ni `aria-label`

#### Scenario: Atributos nativos de Input
- **WHEN** se llama a `get_component` con `Input`
- **THEN** los atributos nativos traen una entrada `input` con `placeholder` y `autoComplete`

#### Scenario: Solo atributos globales
- **WHEN** se llama a `get_component` con `TransparencyGrid`
- **THEN** los atributos nativos traen una sola entrada, sin elemento y sin atributos

#### Scenario: Componente sin atributos nativos
- **WHEN** se llama a `get_component` con `Avatar`
- **THEN** los atributos nativos son una lista vacía

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
El servidor SHALL tener `search`, que busca un texto en normas, componentes, fundamentos, tokens e iconos a la vez y devuelve los resultados agrupados por tipo, con un máximo por grupo. Cada resultado SHALL decir qué herramienta da su detalle.

#### Scenario: Buscar «dominio inverso»
- **WHEN** se llama a `search` con `dominio inverso`
- **THEN** el grupo de normas trae `NAM-001` y dice que su detalle sale de `get_standard`

#### Scenario: Buscar «semánticos»
- **WHEN** se llama a `search` con `semánticos`
- **THEN** el grupo de fundamentos trae el de color y dice que su detalle sale de `get_foundation`

### Requirement: Límites de las respuestas
Cada herramienta SHALL validar sus parámetros y responder con un error de herramienta, no con un fallo del servidor, si no son válidos. Las búsquedas SHALL devolver como mucho 20 resultados por defecto y 50 si se piden más.

#### Scenario: Parámetro inválido
- **WHEN** se llama a `search_icons` sin `query`
- **THEN** la respuesta es un error de herramienta que nombra el parámetro que falta

### Requirement: Datos públicos en JSON
La web SHALL publicar, desde las fuentes de sus páginas:
- `/components.json`: cada componente con su grupo, su ficha, sus props y sus atributos nativos;
- `/tokens.json`: los tokens con sus valores por tema;
- `/icons.json`: las entradas de cada galería con su import.

Los nombres de campo SHALL ir en inglés. Cada JSON SHALL llevar `version` (la de Regula) y `apiVersion` (la del contrato). El MCP SHALL responder con ellos, con `/foundations.json` y con `/standards.json`, sin otra fuente.

#### Scenario: Mismo dato en la web y en el MCP
- **WHEN** cambia la descripción de `Button` en su ficha y se despliega
- **THEN** la página de `Button`, `/components.json` y `get_component` devuelven la descripción nueva

#### Scenario: Mismos atributos en la web y en el JSON
- **WHEN** se compara la línea de atributos reenviados de la página de un componente con su entrada en `/components.json`
- **THEN** nombran los mismos elementos y los mismos atributos

#### Scenario: Fundamento cambiado
- **WHEN** cambia un párrafo de la página de tipografía y se despliega
- **THEN** la página, `/foundations.json` y `get_foundation` devuelven el párrafo nuevo

### Requirement: Servidor comprobado
Los tests SHALL ejercitar el servidor MCP con un cliente MCP real contra el manejador de `/mcp`: `initialize`, `tools/list` y al menos una llamada con éxito y una con error por cada herramienta. Tras desplegar, SHALL comprobarse a mano que un cliente se conecta a la URL pública.

#### Scenario: Test del manejador
- **WHEN** corre la suite de tests de la web
- **THEN** un cliente MCP conecta con el manejador, lista las herramientas y llama a cada una

### Requirement: Herramientas de fundamentos
El servidor SHALL tener:
- `list_foundations`: los fundamentos de diseño en el orden de la guía, cada uno con su id, título, descripción, URL y los títulos de sus secciones;
- `get_foundation`: un fundamento completo por su id (`color`), sin distinguir mayúsculas, con el texto de cada sección.

Un fundamento completo SHALL traer los mismos campos que su entrada de `/foundations.json`.

#### Scenario: Listar los fundamentos
- **WHEN** se llama a `list_foundations`
- **THEN** devuelve los diez fundamentos en el orden de la navegación (principios, contenido, color, tipografía, layout, estados, iconografía, fondos, stream y marca), cada uno con su URL `https://regula.jotis.me/foundations/<id>/`

#### Scenario: Leer el color
- **WHEN** se llama a `get_foundation` con `Color`
- **THEN** devuelve el fundamento de color con sus secciones, y el texto trae la regla «Un estado siempre lleva palabra o icono además del color.» precedida de «Esto sí»

#### Scenario: Fundamento que no existe
- **WHEN** se llama a `get_foundation` con `colour`
- **THEN** devuelve un error de herramienta que dice que no existe, propone `color` y sugiere `list_foundations`

### Requirement: Fundamentos en JSON
La web SHALL publicar en el build `/foundations.json`, desde la misma colección que las páginas de `/foundations/`. Cada fundamento SHALL traer su id, título, descripción, orden, URL y secciones. Cada sección SHALL traer su título, la URL con su ancla y su texto en Markdown. El JSON SHALL llevar la versión de Regula que lo publica, y sus nombres de campo SHALL ir en inglés.

#### Scenario: Mismas secciones que la página
- **WHEN** se compara `/foundations/typography/` con su entrada de `/foundations.json`
- **THEN** cada `##` de la página es una sección del JSON, en el mismo orden y con la misma ancla

### Requirement: Texto de los componentes de la guía
El texto de cada sección SHALL incluir lo que la página dice dentro de sus componentes, no solo el Markdown:
- el pie de cada regla, precedido de la etiqueta de su veredicto que enseña la página («Esto sí», «Esto no»…);
- el título y el texto de cada apartado de las listas de esenciales, de términos y de formatos;
- lo que cabe y lo que no cabe en los bloques de tono;
- el pie de cada ejemplo.

Las demos que solo pintan componentes SHALL quedar fuera.

#### Scenario: Regla dentro de una pareja
- **WHEN** la página de color tiene una `Rule` con `verdict="dont"` y el pie «Dos puntos de color no dicen nada a quien no distingue el verde del rojo.»
- **THEN** la sección «Con ejemplos» de `/foundations.json` trae ese pie precedido de «Esto no»

#### Scenario: Demo de botones
- **WHEN** una regla de color enseña tres botones «Exportar», «Filtrar» y «Nuevo gasto»
- **THEN** el texto de la sección trae el pie de la regla y no los textos de los botones

### Requirement: Componentes sin clasificar
Si una página de fundamentos usa un componente del que no se sabe si aporta texto, los tests SHALL fallar en vez de perder ese texto sin avisar.

#### Scenario: Componente sin clasificar
- **WHEN** una PR añade a un fundamento un componente nuevo que no está ni entre los que aportan texto ni entre las demos
- **THEN** los tests fallan y nombran el componente y el archivo

### Requirement: Versión del contrato
El contrato del MCP (sus herramientas, sus parámetros y la forma de sus resultados) y el de los JSON públicos SHALL tener una versión SemVer propia, distinta de la de los paquetes. Añadir una herramienta, un parámetro opcional o un campo SHALL subir la menor. Quitar o renombrar una herramienta, un parámetro o un campo, o cambiar lo que significa, SHALL subir la mayor. El contrato arranca en `1.0.0` con lo que había antes de este cambio, y este cambio lo deja en `1.1.0`.

#### Scenario: Herramientas nuevas
- **WHEN** se despliega este cambio, con `list_foundations`, `get_foundation` y `/foundations.json`
- **THEN** el MCP anuncia `1.1.0` y cada JSON lleva `"apiVersion": "1.1.0"`

#### Scenario: Herramientas cambiadas sin subir la versión
- **WHEN** una PR añade o quita una herramienta del MCP y no cambia la versión del contrato
- **THEN** los tests fallan y dicen que hay que subir la versión

### Requirement: Deprecación en el contrato
Lo que se vaya a quitar del contrato SHALL marcarse antes como deprecado, con `Deprecated: use <lo que lo sustituye>` en su descripción, y SHALL seguir funcionando al menos durante una versión menor. Solo SHALL quitarse en la siguiente mayor.

#### Scenario: Herramienta que se va a quitar
- **WHEN** se decide quitar `search_icons` en favor de `search`
- **THEN** una menor marca `search_icons` como deprecada y sigue respondiendo, y la mayor siguiente la quita

### Requirement: Historial del contrato
`/start/mcp/` SHALL enseñar el historial del contrato: cada versión con su fecha y lo que añadió, deprecó o quitó. La versión más reciente del historial SHALL ser la que anuncia el servidor.

#### Scenario: Historial al día
- **WHEN** se abre `/start/mcp/` tras desplegar este cambio
- **THEN** el historial trae `1.1.0` (los fundamentos) y `1.0.0` (las siete herramientas y los cuatro JSON de partida)
