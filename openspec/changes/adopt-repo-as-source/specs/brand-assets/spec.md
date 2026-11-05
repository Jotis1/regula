# Spec Delta

## MODIFIED Requirements

### Requirement: Registro de apps de la suite
El sistema SHALL mantener un registro de apps con nombre, letras y tono: Ornatus (Or, `indigo`), Vinculum (Vi, `sky`), Pecunia (Pe, `emerald`), Emptor (Em, `orange`), Regula (Re, `fuchsia`) y Scaena (Sc, `lime`), y SHALL rechazar en la validación una app con tono `red`, `yellow`, gris o ya usado, o vecino de uno usado.

#### Scenario: App registrada
- **WHEN** se pide el icono de `pecunia`
- **THEN** se obtiene la baldosa con "Pe" en el tono `emerald`

#### Scenario: Tono prohibido
- **WHEN** se añade al registro una app con tono `red`
- **THEN** la validación del registro falla indicando que `red` está reservado para errores

#### Scenario: Regula
- **WHEN** se pide el icono de `regula`
- **THEN** se obtiene la baldosa con "Re" en el tono `fuchsia` (fondo `#4b004f`, mayúscula `#f4a8ff`, minúscula `#e12afb`) y coincide con los SVG de Regula de la guía

#### Scenario: Vecino de Regula
- **WHEN** se añade al registro una app con tono `purple` o `pink`
- **THEN** la validación del registro falla porque es vecino de `fuchsia`, el tono de Regula

#### Scenario: Scaena
- **WHEN** se pide el icono de `scaena`
- **THEN** se obtiene la baldosa con "Sc" en el tono `lime` y sus cinco variantes coinciden con los SVG de Scaena que añadió la guía

#### Scenario: Vecino de Scaena
- **WHEN** se añade al registro una app con tono `green`
- **THEN** la validación del registro falla porque es vecino de `lime`, el tono de Scaena
