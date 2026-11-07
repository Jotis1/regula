# Spec Delta

## MODIFIED Requirements

### Requirement: Tema claro y oscuro
La web SHALL ofrecer en la cabecera, en todos los anchos, un selector de tema con tres opciones: Sistema, Claro y Oscuro. Claro y Oscuro aplican o quitan `dark-mode` en toda la página y se recuerdan entre visitas; Sistema borra la elección guardada y sigue la preferencia del sistema, también si cambia con la página abierta. La primera vez la web SHALL usar la del sistema, sin parpadeo del tema equivocado al cargar. El menú móvil SHALL ofrecer las mismas tres opciones.

#### Scenario: Recordar tema
- **WHEN** el usuario elige oscuro y recarga la página
- **THEN** la página carga directamente en oscuro

#### Scenario: Volver al sistema
- **WHEN** el usuario elige "Sistema" en el menú móvil con el sistema en oscuro
- **THEN** la página pasa a oscuro y deja de recordar una elección propia

#### Scenario: Volver al sistema en escritorio
- **WHEN** en escritorio, con oscuro elegido y el sistema en claro, el usuario abre el selector de la cabecera y elige "Sistema"
- **THEN** la página pasa a claro, deja de recordar una elección propia y, si el sistema cambia a oscuro sin recargar, la página pasa a oscuro

#### Scenario: El selector dice lo elegido
- **WHEN** el usuario abre el selector de la cabecera
- **THEN** ve Sistema, Claro y Oscuro con la opción actual marcada, y el botón que lo abre muestra el icono de esa opción (pantalla, sol o luna) y tiene un nombre accesible que dice el tema elegido

#### Scenario: Mismo estado en los dos selectores
- **WHEN** el usuario elige "Claro" en la cabecera y después, a 390px, abre el menú móvil
- **THEN** el selector del menú móvil tiene "Claro" elegido
