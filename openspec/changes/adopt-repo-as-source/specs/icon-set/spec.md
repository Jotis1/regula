# Spec Delta

## MODIFIED Requirements

### Requirement: Set completo de iconos de la guía
El paquete de iconos SHALL incluir los iconos de uso común definidos en el repo, como mínimo los 81 de la guía original con sus mismos nombres, dibujados en 24×24 con trazo de 2px, extremos redondeados y sin relleno. La misma lista SHALL ser la que use el artefacto generado.

#### Scenario: Paridad de nombres
- **WHEN** se compara la lista de iconos exportada con la de `iconNames` del artefacto generado
- **THEN** coinciden uno a uno

#### Scenario: Los 81 originales
- **WHEN** se busca en la lista exportada cada uno de los 81 nombres de la guía original
- **THEN** están todos
