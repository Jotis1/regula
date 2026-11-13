# Spec Delta

## ADDED Requirements

### Requirement: Iconos de línea de Untitled UI
Los iconos de línea del sistema SHALL ser los de `@untitledui/icons`, que las apps importan directamente como componentes (`SearchLg`). El sistema no SHALL publicar una copia propia de ellos. Pintados por un componente de `@jotis-me/react` o sueltos, SHALL tomar el color del texto de su contenedor (`currentColor`) y quedar ocultos a lectores de pantalla salvo que quien los usa les dé un nombre accesible.

#### Scenario: Color por utilidad
- **WHEN** un icono de `@untitledui/icons` se pinta dentro de un elemento con `text-fg-brand-primary`
- **THEN** su trazo tiene el color `fg-brand-primary` en claro y en oscuro

#### Scenario: Un icono suelto
- **WHEN** una app importa solo `Rocket02` de `@untitledui/icons` y se empaqueta
- **THEN** el paquete resultante no contiene el dibujo de ningún otro icono

#### Scenario: Icono decorativo
- **WHEN** un componente del sistema pinta el icono que recibe junto a un texto
- **THEN** el SVG lleva `aria-hidden="true"` y no aparece en el árbol de accesibilidad

#### Scenario: Icono con significado
- **WHEN** una app pinta `<SearchLg role="img" aria-label="Buscar" aria-hidden={undefined} />`
- **THEN** el SVG se expone como imagen con el nombre «Buscar»

### Requirement: Iconos de archivo y banderas de Untitled UI
Los iconos de tipo de archivo SHALL ser los de `@untitledui/file-icons` y las banderas las de `@untitledui/country-flags` (en círculo, nombradas por el código ISO del país). El sistema no SHALL publicar copias propias, y sus componentes SHALL pintarlos correctamente cuando los reciben como nodo, con React 19, en claro y en oscuro.

#### Scenario: Bandera en un badge
- **WHEN** se pinta `Badge` con la bandera `<FlagEs />` de `@untitledui/country-flags`
- **THEN** la bandera de España se ve en círculo, a 16px, antes del texto

#### Scenario: Icono de archivo en una subida
- **WHEN** un elemento de `FileUpload` recibe `<FileIcon type="pdf" />` de `@untitledui/file-icons`
- **THEN** se ve el icono de PDF en lugar del genérico, y con `theme="dark"` dentro de `.dark-mode` usa sus colores de oscuro

#### Scenario: Varias banderas iguales en una página
- **WHEN** una página pinta la misma bandera dos veces
- **THEN** las dos se ven completas y recortadas en círculo

### Requirement: Iconos de pago
El sistema SHALL publicar los 56 iconos de métodos de pago del Figma en `sm` y `md` en `@jotis-me/assets/payments`, como componentes sueltos y como SVG.

#### Scenario: Un método de pago sin los demás
- **WHEN** una app importa solo el icono de Visa de `@jotis-me/assets/payments` y lo empaqueta
- **THEN** el resultado no contiene ningún otro icono de pago

### Requirement: Giro de carga
Los iconos que giran para indicar carga dentro de los componentes del sistema (como el de `Button` con `loading`) SHALL detener el giro cuando el usuario prefiere movimiento reducido.

#### Scenario: Movimiento reducido
- **WHEN** un `Button` con `loading` se pinta con `prefers-reduced-motion: reduce`
- **THEN** su icono de carga no gira

### Requirement: Versiones comprobadas de Untitled UI
El sistema SHALL fijar la versión exacta de cada paquete de Untitled UI que usa, y SHALL comprobar en sus tests que existe cada icono que importan sus componentes y la web.

#### Scenario: Icono que desaparece
- **WHEN** se sube la versión de `@untitledui/icons` y uno de los iconos que usa un componente ya no existe
- **THEN** los tipos o los tests del repo fallan diciendo qué icono falta

## MODIFIED Requirements

### Requirement: Logos de terceros
El sistema SHALL publicar los logos de servicios de terceros de los sets «App icons», «Integration icon» y «Social icon» del Figma, con sus variantes en color y en gris, cada uno como componente React suelto y como fichero SVG, en la entrada `@jotis-me/assets/logos`.

#### Scenario: Un logo sin los demás
- **WHEN** una app importa solo el logo de GitHub del set social desde `@jotis-me/assets/logos` y se empaqueta
- **THEN** el paquete resultante no contiene el código de ningún otro logo

#### Scenario: Logo en Astro sin isla
- **WHEN** una página Astro incluye en línea el SVG de un logo de `@jotis-me/assets/logos/<set>/<nombre>.svg`
- **THEN** la página lo pinta sin enviar JavaScript al cliente

#### Scenario: Lista completa
- **WHEN** se lista lo que exporta `@jotis-me/assets/logos`
- **THEN** aparecen los 232 logos de apps, los 16 de integraciones y los 34 sociales del Figma, cada uno con sus variantes

### Requirement: Cursores
El sistema SHALL publicar los 50 cursores del Figma (29 clásicos y 21 de macOS 26) en `@jotis-me/assets/cursors`, como componentes sueltos y como SVG. Cada SVG SHALL poder usarse como valor de `cursor` en CSS, con el punto activo que indique quien lo usa.

#### Scenario: Cursor en CSS
- **WHEN** una página usa el SVG del cursor «hand-grab» en `cursor: url(…) 6 4, grab`
- **THEN** el navegador acepta la regla con ese cursor sobre el elemento y la imagen se decodifica con el tamaño de su SVG

#### Scenario: Cursor de macOS 26 que sobresale
- **WHEN** se usa un cursor de macOS 26 cuyo dibujo sobresale de la caja de 20×20 del Figma
- **THEN** su SVG es más grande que 20×20 y no lleva el dibujo recortado

## REMOVED Requirements

### Requirement: Set completo de iconos de la guía
**Reason**: El set propio era una copia de los iconos de Untitled UI, que ya se publican en npm; mantenerla añadía peso al repo y a la web.
**Migration**: Importa cada icono de `@untitledui/icons` con su nombre en PascalCase sin el prefijo `Icon` (`IconRocket02` → `Rocket02`). `Icon name="…"` desaparece: usa el componente del icono. `align-top-01`, `align-top-02` y `help-hexagon` no existen en `@untitledui/icons`; usa `AlignTopArrow01`, `AlignTopArrow02` y `HelpOctagon` o el SVG propio de la app.

### Requirement: Iconos que heredan el color
**Reason**: Lo cubre el requisito «Iconos de línea de Untitled UI».
**Migration**: Igual que antes con `text-fg-*`. El tamaño por defecto de los iconos de Untitled UI es 24 (antes 20): pasa `size={20}` o una clase `size-5` cuando el icono va suelto; dentro de un componente del sistema, el componente pone el tamaño.

### Requirement: Accesibilidad de los iconos
**Reason**: Lo cubre el requisito «Iconos de línea de Untitled UI»; los iconos de Untitled UI no tienen prop `title`.
**Migration**: Sustituye `title="Buscar"` por `role="img" aria-label="Buscar" aria-hidden={undefined}`.

### Requirement: Iconos utilizables sin React
**Reason**: `@untitledui/icons` no publica ficheros SVG; mantenerlos exigiría conservar la copia.
**Migration**: En Astro, los componentes de `@untitledui/icons` se pintan en el servidor sin directiva `client:*` y no envían JavaScript. Para HTML sin Astro, copia el SVG desde untitledui.com.

### Requirement: Animación de giro
**Reason**: Los iconos de Untitled UI no tienen prop `spin`; el giro de carga de los componentes queda en el requisito «Giro de carga».
**Migration**: Usa `Spinner`, o la clase `animate-spin motion-reduce:animate-none` sobre el icono.

### Requirement: Banderas
**Reason**: Sustituidas por `@untitledui/country-flags`.
**Migration**: Importa la bandera por su código ISO (`FlagSpainCircle` → `FlagEs`). Las formas cuadrada y rectangular y las 27 banderas que el paquete oficial no trae dejan de existir.

### Requirement: Iconos de pago, archivo y carpeta
**Reason**: Los iconos de archivo se sustituyen por `@untitledui/file-icons`; los de pago siguen en el requisito «Iconos de pago».
**Migration**: Pagos: cambia `@jotis-me/icons/payments` por `@jotis-me/assets/payments`. Archivos: usa `<FileIcon type="pdf" variant="gray" />` de `@untitledui/file-icons` en lugar de `FileTypePdf` y similares. Las variantes de carpeta (marca, gris, ruido, transparente, abierta, cerrada) dejan de existir: queda `<FileIcon type="folder" />`.
