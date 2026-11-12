# icon-set Specification

## Purpose
Ofrece el set de iconos de línea de la guía (24×24, trazo de 2px redondeado, sin relleno) a todas las apps, tanto como componentes React como en SVG para Astro y HTML.

## Requirements

### Requirement: Set completo de iconos de la guía
El paquete de iconos SHALL incluir los 1.172 iconos de línea del Figma «Yoruverse UI v8.0» con sus nombres del Figma en kebab-case, dibujados en 24×24 con trazo de 2px, extremos redondeados y sin relleno. Cada icono SHALL publicarse como componente React suelto que lleva su propio dibujo y como fichero SVG. El componente `Icon` con `name` SHALL cubrir un set núcleo, que incluye como mínimo los 81 de la guía original y los que usan los componentes de `@jotis-me/react`, sin cargar los demás. La lista del set completo SHALL ser la que use el artefacto generado.

#### Scenario: Paridad de nombres
- **WHEN** se compara la lista del set completo exportada con la de `iconNames` del artefacto generado
- **THEN** coinciden uno a uno

#### Scenario: Los 81 originales
- **WHEN** se busca en el set núcleo cada uno de los 81 nombres de la guía original, guardados como fixture en los tests del paquete
- **THEN** están todos, con los mismos nombres que antes de este cambio

#### Scenario: Set completo
- **WHEN** se lista el set completo exportado
- **THEN** tiene 1.172 iconos: los del Figma (1.173 componentes, con «colors» repetido en las categorías Images y Editor y con el mismo dibujo), sin ningún nombre repetido

#### Scenario: Un icono suelto
- **WHEN** una app importa solo `IconRocket02` y se empaqueta
- **THEN** el paquete resultante no contiene el dibujo de ningún otro icono

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

### Requirement: Banderas
El paquete SHALL publicar en `@jotis-me/icons/flags` las 261 banderas del Figma, en círculo, cuadrado y rectángulo, como componentes sueltos y como SVG, con nombre por el país o la región en kebab-case y decorativas salvo que lleven `title`.

#### Scenario: Bandera con nombre
- **WHEN** se pinta la bandera de España en círculo con `title="España"`
- **THEN** es una imagen con el nombre «España»; sin `title`, queda oculta para los lectores

### Requirement: Iconos de pago, archivo y carpeta
El paquete SHALL publicar los 56 iconos de métodos de pago del Figma en `sm` y `md` en `@jotis-me/icons/payments`. También SHALL publicar los iconos de tipo de archivo (los 153 del Figma: tipos y extensiones en default, gris y sólido) y las carpetas (marca, gris, ruido y transparente, abiertas y cerradas) en `@jotis-me/icons/files`, como componentes sueltos y como SVG.

#### Scenario: Icono de PDF
- **WHEN** una app importa el icono de archivo PDF en gris y lo empaqueta
- **THEN** el resultado no contiene ningún otro icono de archivo

### Requirement: Cursores
El paquete SHALL publicar los 50 cursores del Figma (29 clásicos y 21 de macOS 26) en `@jotis-me/icons/cursors`, como componentes sueltos y como SVG. Cada SVG SHALL poder usarse como valor de `cursor` en CSS, con el punto activo que indique quien lo usa.

#### Scenario: Cursor en CSS
- **WHEN** una página usa el SVG del cursor «hand-grab» en `cursor: url(…) 6 4, grab`
- **THEN** el navegador acepta la regla con ese cursor sobre el elemento y la imagen se decodifica con el tamaño de su SVG

#### Scenario: Cursor de macOS 26 que sobresale
- **WHEN** se usa un cursor de macOS 26 cuyo dibujo sobresale de la caja de 20×20 del Figma
- **THEN** su SVG es más grande que 20×20 y no lleva el dibujo recortado
