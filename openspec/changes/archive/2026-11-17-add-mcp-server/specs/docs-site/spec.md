## MODIFIED Requirements

### Requirement: Publicación en regula.jotis.me
La web SHALL servirse en `https://regula.jotis.me` con HTTPS. Todas sus páginas SHALL prerenderizarse en el build; solo `/mcp` SHALL correr en servidor. La web SHALL indicar en el pie la versión de los paquetes que documenta, con un enlace al historial de cambios.

#### Scenario: Versión documentada
- **WHEN** se publica una versión nueva de los paquetes
- **THEN** tras el despliegue el pie de la web muestra ese número de versión

#### Scenario: Solo el MCP en servidor
- **WHEN** se construye la web
- **THEN** todas las páginas y los JSON salen como ficheros estáticos y `/mcp` es la única ruta en servidor

## ADDED Requirements

### Requirement: Página del MCP
La sección Empezar SHALL tener una página `/start/mcp/` que explica:
- la URL del servidor y que es solo de consulta;
- cómo conectarlo desde Claude Code (`claude mcp add --transport http regula https://regula.jotis.me/mcp`) y desde un cliente genérico por configuración JSON;
- qué herramientas hay y qué devuelve cada una;
- los JSON públicos que lo alimentan.

#### Scenario: Conectar desde la guía
- **WHEN** se abre `/start/mcp/`
- **THEN** aparece el comando de Claude Code en un `CodeSnippet` que se puede copiar y la lista de herramientas, y la navegación lateral marca la página dentro de Empezar
