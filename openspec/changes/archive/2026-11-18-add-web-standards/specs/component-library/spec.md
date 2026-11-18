# Spec Delta

## ADDED Requirements

### Requirement: Nivel del título en los componentes de página
`PageHeader` y `StreamScene` SHALL pintar su título como `<h1>` por defecto y SHALL admitir una prop que elige otro nivel de encabezado, de `h1` a `h6`, sin cambiar su aspecto. Así una página que los muestra dentro de otro contenido conserva un solo `<h1>`.

#### Scenario: Por defecto
- **WHEN** se pinta `PageHeader` con un título y sin elegir nivel
- **THEN** el título es un `<h1>`, como hasta ahora

#### Scenario: Dentro de una página con su propio título
- **WHEN** se pinta `PageHeader` eligiendo el nivel `h2`
- **THEN** el título es un `<h2>` con el mismo aspecto, y la página no gana otro `<h1>`
