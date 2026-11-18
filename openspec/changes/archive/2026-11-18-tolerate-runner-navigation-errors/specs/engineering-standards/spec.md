# Spec Delta

## ADDED Requirements

### Requirement: Área de tests: navegación rechazada por el runner
La norma de los tests deterministas SHALL admitir una sola excepción: la navegación de un e2e al servidor de pruebas local MAY reintentarse una vez, dentro del mismo test, cuando la máquina del CI rechaza la conexión. El reintento SHALL quedar anotado en el informe. Cualquier otro fallo, y un segundo fallo de conexión, SHALL contar como siempre.

#### Scenario: Conexión rechazada por el runner
- **WHEN** la máquina del CI rechaza la conexión al abrir una página del servidor de pruebas local
- **THEN** la navegación se intenta una vez más, y si entonces carga, el test sigue y el informe anota el reintento

#### Scenario: Otro fallo
- **WHEN** un e2e falla por una comprobación y pasa en el reintento del test
- **THEN** el CI falla y lo nombra como inestable
