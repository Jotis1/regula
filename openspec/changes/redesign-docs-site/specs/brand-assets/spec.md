# Spec Delta

## MODIFIED Requirements

### Requirement: Registro de apps de la suite
El sistema SHALL mantener un registro de apps con nombre, letras y tono: Ornatus (Or, `indigo`), Vinculum (Vi, `sky`), Pecunia (Pe, `emerald`), Emptor (Em, `orange`) y Regula (Re, `chartreuse`), y SHALL rechazar en la validación una app con tono `red`, `yellow`, gris o ya usado, o vecino de uno usado. `chartreuse`, la paleta propia de la suite, SHALL aceptarse como tono.

#### Scenario: App registrada
- **WHEN** se pide el icono de `pecunia`
- **THEN** se obtiene la baldosa con "Pe" en el tono `emerald`

#### Scenario: Tono prohibido
- **WHEN** se añade al registro una app con tono `red`
- **THEN** la validación del registro falla indicando que `red` está reservado para errores

#### Scenario: Regula con su paleta propia
- **WHEN** se pide el icono de `regula`
- **THEN** se obtiene la baldosa con "Re" en el tono `chartreuse` (fondo `#222b06`, mayúscula `#dce930`, minúscula `#b1c300`) y coincide con los SVG de Regula de la guía
