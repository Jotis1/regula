# Spec Delta

## ADDED Requirements

### Requirement: Menú con una opción elegida
`Dropdown` SHALL admitir, además de acciones, una elección única entre sus opciones: la opción elegida se marca con un check a la derecha y se anuncia como opción de radio de menú marcada. Elegir otra opción SHALL avisar con su valor y cerrar el menú. Sin elección configurada, el menú SHALL comportarse como hasta ahora.

#### Scenario: Opción elegida
- **WHEN** se pinta un `Dropdown` con las opciones Sistema, Claro y Oscuro y Claro como elegida, y se abre
- **THEN** Claro lleva el check y se anuncia como `menuitemradio` con `aria-checked="true"`, y Sistema y Oscuro como `menuitemradio` con `aria-checked="false"`

#### Scenario: Elegir otra
- **WHEN** en ese menú se elige Oscuro con el teclado (flechas y Enter)
- **THEN** el menú avisa con el valor de Oscuro, se cierra y el foco vuelve al botón que lo abrió

#### Scenario: Sin elección
- **WHEN** se pinta un `Dropdown` solo con acciones, como antes de este cambio
- **THEN** sus elementos se anuncian como `menuitem`, sin check, y cada acción llama a su `onSelect`
