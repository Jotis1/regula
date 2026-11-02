# Spec Delta

## MODIFIED Requirements

### Requirement: Tokens semánticos de color con valor claro y oscuro
El paquete de tokens SHALL exponer cada token de color de la guía (fondos, texto, bordes, `fg-*`, estados, `utility-*`, incluida la escala propia `utility-chartreuse-50…700`, `alpha-*`, `focus-ring`) con el nombre de la guía y un valor para el tema claro y otro para el oscuro, idénticos a los de `tokens.json` de la guía.

#### Scenario: Valor claro por defecto
- **WHEN** una página carga el CSS de tokens sin activar el tema oscuro
- **THEN** `--text-primary` vale `#171717` y `--bg-primary` vale el blanco de la guía

#### Scenario: Valor oscuro con la clase de tema
- **WHEN** un ancestro del elemento tiene la clase `dark-mode`
- **THEN** `--text-primary` vale `#fafafa` y el resto de tokens toman su valor oscuro

#### Scenario: Paridad con la guía
- **WHEN** se compara la lista de tokens publicada con `tokens.json` de la guía
- **THEN** no falta ningún token ni sobra ninguno fuera de los documentados como añadidos

#### Scenario: Escala chartreuse
- **WHEN** se usa la utilidad `bg-utility-chartreuse-600`
- **THEN** su color es `#829500` en claro y `#cada00` en oscuro, como en la guía
