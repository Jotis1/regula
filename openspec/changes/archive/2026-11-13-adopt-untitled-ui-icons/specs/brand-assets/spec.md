# Spec Delta

## ADDED Requirements

### Requirement: Dónde se publica la marca
El icono de app (su geometría, el registro de apps y la validación) SHALL publicarse en `@jotis-me/react`, con una entrada `@jotis-me/react/app-icon` que se puede usar sin React. Los ficheros de favicon y PWA de cada app, los trazos a mano y las texturas SHALL publicarse en `@jotis-me/assets` (`app-icons/*`, `hand-drawn/*` y `patterns/*`), con los mismos nombres de fichero que tenían.

#### Scenario: Icono de app sin React
- **WHEN** una página Astro importa `appIconSvg` de `@jotis-me/react/app-icon` y lo llama con `{ app: "pecunia", variant: "light" }`
- **THEN** obtiene el SVG del icono como texto, y lo que se empaqueta para esa importación no incluye React ni ningún componente

#### Scenario: Ficheros de una app
- **WHEN** una app referencia `@jotis-me/assets/app-icons/emptor-maskable-512.png`
- **THEN** el fichero existe y es el mismo icono `maskable` de Emptor que se publicaba antes
