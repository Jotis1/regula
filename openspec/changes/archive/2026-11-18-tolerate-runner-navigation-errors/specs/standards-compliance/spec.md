# Spec Delta

## ADDED Requirements

### Requirement: Navegación reintentada en los e2e de la web
Los e2e de la web SHALL reintentar una sola vez la navegación a una página cuando falla porque la máquina rechaza la conexión, y SHALL anotar el reintento en el informe del test. SHALL NOT reintentar ningún otro fallo de navegación, y un segundo fallo de conexión SHALL hacer fallar el test. Todos los e2e de la web SHALL usar el mismo punto de entrada, para que el reintento valga para todos.

#### Scenario: Primer intento rechazado
- **WHEN** la primera petición de una página se rechaza y la segunda carga
- **THEN** el test sigue, la página se ha pedido dos veces y el informe lleva una nota del reintento

#### Scenario: Dos intentos rechazados
- **WHEN** las dos peticiones de una página se rechazan
- **THEN** la navegación falla con el error de conexión

#### Scenario: Otro error de red
- **WHEN** la petición de una página falla con un error que no es de conexión rechazada
- **THEN** la navegación falla a la primera, sin reintento ni nota
