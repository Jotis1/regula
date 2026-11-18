# Spec Delta

## MODIFIED Requirements

### Requirement: Área de tests: tests deterministas
El área de tests SHALL fijar con nivel DEBE, para todos los proyectos, que un test da el mismo resultado cada vez que se ejecuta:
- sin esperas fijas: se espera a una condición, no a un tiempo;
- sin red externa;
- con el reloj y el azar controlados cuando el resultado depende de ellos;
- un test que pasa solo al reintentarlo hace fallar el CI. Se arregla, no se esconde.

La norma SHALL admitir una sola excepción: la navegación de un e2e al servidor de pruebas local MAY reintentarse una vez, dentro del mismo test, cuando la máquina del CI rechaza la conexión. El reintento SHALL quedar anotado en el informe.

#### Scenario: Espera fija
- **WHEN** un e2e espera con `page.waitForTimeout(3000)` a que llegue un mensaje
- **THEN** incumple la norma, y el ejemplo que la cumple espera a que el mensaje sea visible o controla el reloj

#### Scenario: Test inestable
- **WHEN** un e2e falla en el primer intento y pasa en el reintento
- **THEN** el CI falla y lo nombra como inestable

#### Scenario: Conexión rechazada por el runner
- **WHEN** la máquina del CI rechaza la conexión al abrir una página del servidor de pruebas local
- **THEN** la navegación se intenta una vez más, y si entonces carga, el test sigue y el informe anota el reintento
