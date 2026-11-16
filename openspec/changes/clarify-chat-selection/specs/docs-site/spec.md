## MODIFIED Requirements

### Requirement: Historial de cambios
La web SHALL tener en `/changelog/` el historial de versiones de los paquetes, generado de sus CHANGELOG en el build. El texto de cada entrada SHALL pintarse con su formato: párrafos, listas a cualquier profundidad (también las que van dentro de una entrada o empiezan en su primera línea), tablas, negrita, también con código dentro, y código en línea. MUST NOT quedar a la vista guiones, barras ni asteriscos del Markdown.

#### Scenario: Versión publicada
- **WHEN** se publica una versión con una entrada en el CHANGELOG
- **THEN** tras el despliegue `/changelog/` muestra esa versión con su entrada

#### Scenario: Entrada con listas
- **WHEN** se abre `/changelog/` y se mira la entrada de la 0.4.0, que lista los componentes nuevos y después las variantes
- **THEN** cada lista se pinta como una lista con un elemento por línea, sin los guiones del Markdown, y el texto de entre las dos listas como un párrafo

#### Scenario: Sublistas
- **WHEN** se mira la entrada de la 0.9.0, cuyo elemento `ChatBox` lleva su propia lista
- **THEN** esa lista se pinta dentro de su elemento, sin guiones sueltos

#### Scenario: Negrita con código
- **WHEN** una entrada dice «**Cambio que rompe: `Select`.**»
- **THEN** se pinta en negrita, con `Select` como código, y sin asteriscos

#### Scenario: Subidas de dependencias
- **WHEN** el CHANGELOG de `@jotis-me/react` anota `- @jotis-me/tokens@0.9.0` en «Patch Changes»
- **THEN** `/changelog/` no lo enseña como un arreglo

#### Scenario: Tabla
- **WHEN** se mira la entrada de la 0.8.0, con su tabla «Antes (`0.7`)» y «Ahora»
- **THEN** se pinta como una tabla con su cabecera y una fila por cambio, y si no cabe se desplaza dentro de su caja, no la página
