# icon-set Specification

## Purpose
Ofrece el set de iconos de línea de la guía (24×24, trazo de 2px redondeado, sin relleno) a todas las apps, tanto como componentes React como en SVG para Astro y HTML.

## Requirements

### Requirement: Set completo de iconos de la guía
El paquete de iconos SHALL incluir los iconos de uso común definidos en el repo, como mínimo los 81 de la guía original con sus mismos nombres, dibujados en 24×24 con trazo de 2px, extremos redondeados y sin relleno. La misma lista SHALL ser la que use el artefacto generado.

#### Scenario: Paridad de nombres
- **WHEN** se compara la lista de iconos exportada con la de `iconNames` del artefacto generado
- **THEN** coinciden uno a uno

#### Scenario: Los 81 originales
- **WHEN** se busca en la lista exportada cada uno de los 81 nombres de la guía original, guardados como fixture en los tests del paquete
- **THEN** están todos

### Requirement: Iconos que heredan el color
Cada icono SHALL pintar su trazo con `currentColor` y aceptar `size` (20 por defecto) y `strokeWidth`, de modo que tome el color de la utilidad `text-fg-*` que tenga su contenedor.

#### Scenario: Color por utilidad
- **WHEN** un icono se pinta dentro de un elemento con `text-fg-brand-primary`
- **THEN** su trazo tiene el color `fg-brand-primary` en claro y en oscuro

#### Scenario: Tamaño
- **WHEN** se pinta un icono con `size={16}`
- **THEN** el SVG mide 16×16 px y conserva el viewBox 24×24

### Requirement: Accesibilidad de los iconos
Un icono sin `title` SHALL quedar oculto a lectores de pantalla (`aria-hidden`); con `title` SHALL exponerse como imagen con ese nombre accesible.

#### Scenario: Icono decorativo
- **WHEN** se pinta un icono sin `title` junto a un texto
- **THEN** el SVG lleva `aria-hidden="true"` y no aparece en el árbol de accesibilidad

#### Scenario: Icono con significado
- **WHEN** se pinta un icono con `title="Buscar"`
- **THEN** el SVG tiene `role="img"` y nombre accesible "Buscar"

### Requirement: Iconos utilizables sin React
El paquete SHALL publicar cada icono también como fichero SVG con trazo `currentColor`, importable desde Astro o HTML sin runtime de React.

#### Scenario: Icono en Astro sin isla
- **WHEN** una página Astro importa el SVG de un icono y lo incluye en línea
- **THEN** la página renderiza el icono sin enviar JavaScript al cliente

### Requirement: Animación de giro
El componente de icono SHALL aceptar `spin` para girar de forma continua (para cargas) y SHALL detener el giro cuando el usuario prefiere movimiento reducido.

#### Scenario: Movimiento reducido
- **WHEN** un icono con `spin` se pinta con `prefers-reduced-motion: reduce`
- **THEN** el icono no gira

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
