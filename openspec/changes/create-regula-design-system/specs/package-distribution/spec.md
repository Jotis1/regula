# Spec Delta

## Purpose

Define cómo las apps de la suite obtienen el sistema de diseño: qué paquetes npm públicos existen, qué requieren del proyecto, cómo se versionan y qué garantiza cada versión.

## ADDED Requirements

### Requirement: Paquetes públicos bajo el scope @jotis-me
El sistema SHALL publicarse en el registro público de npm como `@jotis-me/tokens`, `@jotis-me/icons` y `@jotis-me/react`, instalables sin token ni `.npmrc`.

#### Scenario: Instalación anónima
- **WHEN** se ejecuta `npm install @jotis-me/react` en un proyecto nuevo sin credenciales
- **THEN** la instalación termina sin error y trae `@jotis-me/tokens` y `@jotis-me/icons` como dependencias

### Requirement: Dependencias declaradas como peer
`@jotis-me/react` SHALL declarar React y React DOM (18 o 19) y Tailwind CSS v4 como `peerDependencies` y no incluirlos en su bundle.

#### Scenario: Una sola copia de React
- **WHEN** una app con React 19 instala `@jotis-me/react`
- **THEN** `npm ls react` muestra una sola copia de React

### Requirement: Formato de módulo y tipos
Cada paquete SHALL publicarse como ES modules con `exports` explícitos, tipos TypeScript incluidos y `sideEffects` declarado para que los bundlers eliminen lo no usado.

#### Scenario: Eliminación de código no usado
- **WHEN** una app importa solo `Button` y construye para producción
- **THEN** el bundle de cliente no contiene el código de `DatePicker` ni de las gráficas

#### Scenario: Tipos
- **WHEN** un proyecto TypeScript en modo estricto importa cualquier componente
- **THEN** obtiene autocompletado de props sin instalar paquetes `@types` adicionales

### Requirement: Versionado semántico
Los paquetes SHALL seguir semver: un cambio de API pública, de nombre de token o de utilidad, o un cambio visual intencionado que rompa layouts SHALL publicarse como versión mayor, y cada versión SHALL tener su entrada en el changelog.

#### Scenario: Renombrar un token
- **WHEN** se renombra un token
- **THEN** la versión publicada es mayor y el changelog describe el renombrado y cómo migrar

### Requirement: Publicación automatizada y verificable
La publicación SHALL hacerse desde CI al integrar en la rama principal, solo si pasan tipos, tests, auditoría de accesibilidad y la construcción de los proyectos de ejemplo Next.js y Astro, y SHALL incluir procedencia (provenance) de npm.

#### Scenario: Tests en rojo
- **WHEN** falla cualquier test en la rama principal
- **THEN** no se publica ninguna versión

#### Scenario: Procedencia
- **WHEN** se consulta una versión publicada en npmjs.com
- **THEN** muestra la procedencia enlazada al commit y al flujo de CI que la construyó

### Requirement: Guía de instalación
Cada paquete SHALL incluir un README con la instalación y la configuración mínima para Next.js y para Astro con Tailwind v4, y esos pasos SHALL coincidir con los proyectos de ejemplo.

#### Scenario: Seguir el README
- **WHEN** alguien crea un proyecto Next.js o Astro nuevo y sigue solo el README de `@jotis-me/react`
- **THEN** puede pintar un `Button` con su aspecto final en claro y en oscuro
