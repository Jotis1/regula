## MODIFIED Requirements

### Requirement: Herramientas de componentes
El servidor SHALL tener:
- `list_components`: los componentes con su grupo y su descripción, con un filtro opcional por grupo;
- `get_component`: la ficha de un componente por su nombre, sin distinguir mayúsculas.

La ficha SHALL traer la descripción, la guía de uso, las props (nombre, tipo, si es obligatoria, valor por defecto y descripción), los atributos nativos que reenvía, si necesita `client:*` en Astro y los fragmentos de Next y de Astro.

Los atributos nativos SHALL ir como una lista con una entrada por elemento HTML al que el componente puede reenviarlos (`button`, `a`, `input`, `textarea`…): el nombre del elemento y los atributos propios de ese elemento que acepta el tipo del componente, sin los globales de HTML, `aria-*` ni los eventos, que se dan por incluidos. Si el tipo solo hereda los globales, la entrada SHALL tener el elemento sin determinar y la lista de atributos vacía. Un componente que no reenvía nada SHALL traer la lista vacía.

#### Scenario: Props de Button
- **WHEN** se llama a `get_component` con `button`
- **THEN** devuelve la ficha de `Button` con la prop `hierarchy` y sus valores `primary · secondary · tertiary · link-color · link-gray`, y los dos fragmentos de código

#### Scenario: Atributos nativos de Button
- **WHEN** se llama a `get_component` con `button`
- **THEN** los atributos nativos traen una entrada `button` con `type` y otra `a` con `target`, y ninguna lista `className`, `onClick` ni `aria-label`

#### Scenario: Atributos nativos de Input
- **WHEN** se llama a `get_component` con `Input`
- **THEN** los atributos nativos traen una entrada `input` con `placeholder` y `autoComplete`

#### Scenario: Componente sin atributos nativos
- **WHEN** se llama a `get_component` con `Avatar`
- **THEN** los atributos nativos son una lista vacía

#### Scenario: Componente que no existe
- **WHEN** se llama a `get_component` con `Botón`
- **THEN** devuelve un error de herramienta con los nombres más parecidos

### Requirement: Datos públicos en JSON
La web SHALL publicar en el build, desde las mismas fuentes que sus páginas:
- `/components.json`: cada componente con su grupo, su ficha, sus props y sus atributos nativos reenviados;
- `/tokens.json`: los tokens con sus valores por tema;
- `/icons.json`: las entradas de cada galería con su import.

Los nombres de campo SHALL ir en inglés. Cada JSON SHALL llevar la versión de Regula que lo publica. El MCP SHALL responder con estos datos y con `/standards.json`, sin otra fuente.

#### Scenario: Mismo dato en la web y en el MCP
- **WHEN** cambia la descripción de `Button` en su ficha y se despliega
- **THEN** la página de `Button`, `/components.json` y `get_component` devuelven la descripción nueva

#### Scenario: Mismos atributos en la web y en el JSON
- **WHEN** se compara la línea de atributos reenviados de la página de un componente con su entrada en `/components.json`
- **THEN** nombran los mismos elementos y los mismos atributos
