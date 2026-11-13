# Spec Delta

## MODIFIED Requirements

### Requirement: Utilidades de Tailwind v4 con los nombres de la guía
El paquete SHALL incluir un fichero CSS para Tailwind v4 que registre los tokens en `@theme`, de modo que cada token sea la utilidad del mismo nombre (`bg-primary`, `text-brand-secondary`, `border-secondary`, `text-fg-quaternary`, `bg-utility-brand-50`, `bg-alpha-white/10`). La variante `dark:` SHALL activarse cuando un ancestro tiene la clase `dark-mode` y ninguno más cercano tiene la clase `light-mode`.

#### Scenario: Utilidad de color disponible
- **WHEN** un proyecto con Tailwind v4 importa el tema y usa `bg-brand-solid`
- **THEN** el CSS generado aplica el color `bg-brand-solid` de la guía y cambia en oscuro sin clases adicionales

#### Scenario: Variante dark redefinida
- **WHEN** un componente usa `dark:` en una clase
- **THEN** la variante se activa cuando un ancestro tiene la clase `dark-mode`, no por `prefers-color-scheme`

#### Scenario: Variante dark dentro de un tema claro forzado
- **WHEN** un elemento con una clase `dark:` está dentro de un `light-mode` que a su vez está dentro de un `dark-mode`
- **THEN** la clase `dark:` no se aplica

## ADDED Requirements

### Requirement: Tema claro forzado
El CSS de tokens SHALL publicar la clase `light-mode`, que dentro de su contenedor SHALL devolver cada token de color y de sombra a su valor claro, con los valores de la misma fuente de tokens que `:root`. Anidar un `dark-mode` dentro de un `light-mode` no está soportado.

#### Scenario: Claro dentro de oscuro
- **WHEN** un elemento está dentro de un `light-mode` que a su vez está dentro de un `dark-mode`
- **THEN** `--text-primary` vale `#171717` y `--bg-primary` vale el blanco de la guía en ese elemento, y fuera del `light-mode` siguen con su valor oscuro

#### Scenario: Mismos valores que el tema claro
- **WHEN** se compara el bloque `light-mode` con los valores de `:root`
- **THEN** cada token que cambia entre temas tiene en `light-mode` el mismo valor que en `:root`
