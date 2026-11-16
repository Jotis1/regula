# Spec Delta

## ADDED Requirements

### Requirement: Chat seleccionable en la ficha
La ficha de `ChatBox` SHALL incluir un ejemplo «Seleccionable» en el que, al pulsar un mensaje, este queda marcado como elegido.

#### Scenario: Elegir en la ficha
- **WHEN** en `/components/chat-box/` se pulsa un mensaje del ejemplo «Seleccionable»
- **THEN** ese mensaje queda marcado como elegido y el anterior deja de estarlo

### Requirement: Chat animado en el ejemplo
Con `animate` encendido, el ejemplo interactivo de `ChatBox` SHALL recibir mensajes nuevos cada pocos segundos, para que se vea su entrada. Con `animate` apagado, el chat del ejemplo MUST NOT moverse. El código del ejemplo SHALL enseñar solo el uso del componente, sin el temporizador.

#### Scenario: Encender la animación
- **WHEN** en `/components/chat-box/` se enciende «Animar último mensaje»
- **THEN** en los siguientes 5 segundos entra al menos un mensaje nuevo, con su animación de entrada, y el más antiguo sale si ya hay 8

#### Scenario: Animación apagada
- **WHEN** «Animar último mensaje» está apagado
- **THEN** el chat del ejemplo no cambia
