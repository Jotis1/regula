# Spec Delta

## ADDED Requirements

### Requirement: Escena en 21:9
La ficha de `StreamScene` SHALL incluir un ejemplo en 21:9 (`width={2580}`) con el código para 3440×1440.

#### Scenario: Ejemplo ultrapanorámico
- **WHEN** se abre `/components/stream-scene/`
- **THEN** hay un ejemplo de la escena en 21:9 con su código, que usa `width={2580}` y `scale={4/3}`
