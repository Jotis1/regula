# Spec Delta

## ADDED Requirements

### Requirement: Logos de terceros
El paquete de iconos SHALL publicar los logos de servicios de terceros de los sets «App icons», «Integration icon» y «Social icon» del Figma, con sus variantes en color y en gris, cada uno como componente React suelto y como fichero SVG, desde una entrada propia (`@jotis-me/icons/logos`) separada de la de los iconos de línea.

#### Scenario: Un logo sin los demás
- **WHEN** una app importa solo el logo de GitHub del set social desde `@jotis-me/icons/logos` y se empaqueta
- **THEN** el paquete resultante no contiene el código de ningún otro logo

#### Scenario: Logo en Astro sin isla
- **WHEN** una página Astro incluye en línea el SVG de un logo de `@jotis-me/icons/logos/<set>/<nombre>.svg`
- **THEN** la página lo pinta sin enviar JavaScript al cliente

#### Scenario: Lista completa
- **WHEN** se lista lo que exporta `@jotis-me/icons/logos`
- **THEN** aparecen los 232 logos de apps, los 16 de integraciones y los 34 sociales del Figma, cada uno con sus variantes, y la entrada principal del paquete no exporta ninguno

### Requirement: Logos accesibles
Cada logo SHALL ser decorativo por defecto y SHALL aceptar un `title` que lo convierta en imagen con ese nombre, y la variante gris de los sets que la tienen monocroma SHALL pintarse con `currentColor`.

#### Scenario: Logo con nombre
- **WHEN** se pinta un logo con `title="GitHub"`
- **THEN** es una imagen con el nombre «GitHub»; sin `title`, queda oculto para los lectores de pantalla
