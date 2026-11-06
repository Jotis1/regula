# Spec Delta

## MODIFIED Requirements

### Requirement: Tokens semánticos de color con valor claro y oscuro
El paquete de tokens SHALL exponer cada token de color de la guía (fondos, texto, bordes, `fg-*`, estados, `utility-*`, `alpha-*`, `focus-ring`) con el nombre de la guía y un valor para el tema claro y otro para el oscuro, idénticos a los de la fuente de tokens del repo, que es la única fuente de esos valores para el paquete, la web y el artefacto generado.

#### Scenario: Valor claro por defecto
- **WHEN** una página carga el CSS de tokens sin activar el tema oscuro
- **THEN** `--text-primary` vale `#171717` y `--bg-primary` vale el blanco de la guía

#### Scenario: Valor oscuro con la clase de tema
- **WHEN** un ancestro del elemento tiene la clase `dark-mode`
- **THEN** `--text-primary` vale `#fafafa` y el resto de tokens toman su valor oscuro

#### Scenario: Paridad con la guía
- **WHEN** se compara la lista de tokens que publica el paquete (variables CSS y exportación de TypeScript) con la lista de nombres de la guía, fijada en los tests del paquete
- **THEN** coinciden en nombre y orden, y quitar o renombrar un token obliga a cambiar esa lista en el mismo PR
