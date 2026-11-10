# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

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

### Requirement: Emojis y cursores
El paquete SHALL publicar los 18 emojis del Figma en `@jotis-me/icons/emoji` y los 50 cursores (los clásicos y los de macOS 26) en `@jotis-me/icons/cursors`, como componentes sueltos y como SVG. Los cursores SHALL poder usarse como valor de `cursor` en CSS a partir de su SVG.

#### Scenario: Cursor en CSS
- **WHEN** una página usa el SVG del cursor «hand-grab» en `cursor: url(…), grab`
- **THEN** el puntero se ve con el dibujo del Figma sobre ese elemento
