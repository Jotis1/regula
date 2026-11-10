# Spec Delta

## MODIFIED Requirements

### Requirement: Galería de iconos
La web SHALL mostrar todos los iconos del set y todos los logos de terceros con buscador por nombre y tamaño de vista previa, y al elegir uno SHALL mostrar un panel con el icono o logo en varios tamaños que permita copiar su nombre, su uso en React, su importación SVG y el SVG en bruto.

#### Scenario: Buscar un icono
- **WHEN** el usuario escribe "cal" en el buscador de iconos
- **THEN** solo se muestran los iconos cuyo nombre contiene "cal"

#### Scenario: Elegir un icono
- **WHEN** el usuario pulsa el icono `calendar`
- **THEN** el panel muestra `calendar` y su código usa el paquete `@jotis-me/icons`

#### Scenario: Elegir un logo
- **WHEN** el usuario busca "github" y pulsa el logo de GitHub del set social
- **THEN** el panel muestra sus variantes en color y en gris y su código importa ese logo de `@jotis-me/icons/logos`
