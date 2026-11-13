# Spec Delta

## MODIFIED Requirements

### Requirement: Paquetes públicos bajo el scope @jotis-me
El sistema SHALL publicarse en el registro público de npm como `@jotis-me/tokens`, `@jotis-me/assets` y `@jotis-me/react`, instalables sin token ni `.npmrc`. `@jotis-me/react` SHALL traer `@untitledui/icons` como dependencia y no SHALL depender de `@jotis-me/assets`. `@jotis-me/icons` SHALL dejar de publicarse y quedar marcado como obsoleto en npm, con un mensaje que diga con qué sustituirlo.

#### Scenario: Instalación anónima
- **WHEN** se ejecuta `npm install @jotis-me/react` en un proyecto nuevo sin credenciales
- **THEN** la instalación termina sin error y trae `@jotis-me/tokens` y `@untitledui/icons` como dependencias, y no trae `@jotis-me/icons` ni `@jotis-me/assets`

#### Scenario: Paquete obsoleto
- **WHEN** alguien instala `@jotis-me/icons` después de publicarse la 0.8.0
- **THEN** npm avisa de que está obsoleto y de que se sustituye por `@untitledui/icons`, `@untitledui/file-icons`, `@untitledui/country-flags` y `@jotis-me/assets`

#### Scenario: Guía de migración
- **WHEN** se abre la entrada de la 0.8.0 en el historial de cambios
- **THEN** explica cómo cambiar los nombres de icono en cadena por componentes y cada importación de `@jotis-me/icons` por su paquete nuevo
