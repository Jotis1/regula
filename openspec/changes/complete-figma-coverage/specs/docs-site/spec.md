# Spec Delta

## MODIFIED Requirements

### Requirement: Galería de iconos
La web SHALL mostrar los 1.172 iconos del set completo, todos los logos de terceros y los sets de banderas, pagos, archivos y cursores. Cada galería SHALL tener buscador por nombre y tamaño de vista previa. Al elegir uno SHALL mostrar un panel con el icono o recurso en varios tamaños que permita copiar su nombre, su uso en React, su importación SVG y el SVG en bruto. Cada galería SHALL cargar solo los dibujos que están a la vista y quedar dentro del límite de JavaScript de su página.

#### Scenario: Buscar un icono
- **WHEN** el usuario escribe "cal" en el buscador de iconos
- **THEN** solo se muestran los iconos cuyo nombre contiene "cal"

#### Scenario: Elegir un icono
- **WHEN** el usuario pulsa el icono `calendar`
- **THEN** el panel muestra `calendar` y su código usa el paquete `@jotis-me/icons`

#### Scenario: Icono fuera del núcleo
- **WHEN** el usuario elige un icono que no está en el set núcleo
- **THEN** el código del panel importa su componente suelto (`IconXxx`) en lugar de usar `Icon name`

#### Scenario: Elegir un logo
- **WHEN** el usuario busca "github" y pulsa el logo de GitHub del set social
- **THEN** el panel muestra sus variantes en color y en gris y su código importa ese logo de `@jotis-me/icons/logos`

#### Scenario: Galería larga
- **WHEN** se abre la galería de iconos, que tiene 1.172
- **THEN** se ven los primeros con el recuento total («1172 iconos») y un botón «Mostrar más» que añade más, sin pedir los dibujos de los que no están a la vista, y el buscador recorre los 1.172

#### Scenario: Filtrar por categoría
- **WHEN** el usuario elige la categoría «Tiempo» en la galería de iconos
- **THEN** solo quedan los iconos de esa categoría del Figma y el recuento dice cuántos son del total

#### Scenario: Elegir una bandera
- **WHEN** el usuario busca "spain" en la galería de banderas y pulsa la bandera
- **THEN** el panel enseña el círculo, el cuadrado y el rectángulo, y su código importa de `@jotis-me/icons/flags`

## ADDED Requirements

### Requirement: Composiciones de ejemplo
La web SHALL montar cada tipo del Figma de `Modal` (los 49), de `Slide out menu` (los 23) y el `Color picker modal` como composición de ejemplo hecha solo con componentes de Regula, en una página de composiciones de su componente, con su código copiable y su captura aprobada. Estas composiciones no se exportan del paquete.

#### Scenario: Modal de invitar usuarios
- **WHEN** el usuario abre la composición «Invitar usuarios» de la página de composiciones de Modal
- **THEN** ve el modal del Figma funcionando y su código solo importa componentes de `@jotis-me/react`

#### Scenario: Lista completa
- **WHEN** se comparan las composiciones de Modal y de Slideout con los tipos de sus conjuntos del Figma
- **THEN** cada tipo tiene su composición, sin que falte ninguno
