# Spec Delta

## MODIFIED Requirements

### Requirement: Historial de cambios
La web SHALL tener en `/changelog/` el historial de versiones de los paquetes, generado de sus CHANGELOG en el build. El texto de cada entrada SHALL pintarse con su formato: párrafos, listas (también las que van dentro de una entrada) y código en línea.

#### Scenario: Versión publicada
- **WHEN** se publica una versión con una entrada en el CHANGELOG
- **THEN** tras el despliegue `/changelog/` muestra esa versión con su entrada

#### Scenario: Entrada con listas
- **WHEN** se abre `/changelog/` y se mira la entrada de la 0.4.0, que lista los componentes nuevos y después las variantes
- **THEN** cada lista se pinta como una lista con un elemento por línea, sin los guiones del Markdown, y el texto de entre las dos listas como un párrafo
