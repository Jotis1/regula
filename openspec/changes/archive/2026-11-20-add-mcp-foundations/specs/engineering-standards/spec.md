## ADDED Requirements

### Requirement: Área de versiones: APIs públicas
El área de versiones SHALL fijar, con nivel DEBE y para las apps, una norma `VER-012`: una API pública de una app (un servidor MCP, unos JSON públicos, una API HTTP) tiene su propia versión SemVer, distinta de la de los paquetes, y la anuncia en sus respuestas.

#### Scenario: MCP versionado
- **WHEN** se mira el ejemplo que cumple la norma de las APIs
- **THEN** enseña un servidor MCP que se anuncia con la versión de su contrato y un JSON con `apiVersion`, y el que no la cumple, un MCP que se anuncia con la versión del paquete de componentes

### Requirement: Área de versiones: deprecación en las APIs
El área de versiones SHALL fijar, con nivel DEBE y para las apps, una norma `VER-013`: en una API pública, lo que se va a quitar se deprecia en una menor, sigue funcionando, y se quita en la siguiente mayor, como `VER-005` pide para los paquetes.

#### Scenario: Campo renombrado
- **WHEN** se mira el ejemplo que no cumple la norma de la deprecación en las APIs
- **THEN** enseña un campo de un JSON renombrado de un despliegue a otro, sin pasar por deprecado
