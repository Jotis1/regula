# Spec Delta

## Purpose

Da a todas las apps de la suite jotis.me los mismos tokens semánticos de diseño (color, tipografía, espaciado, radios, sombras y foco), en claro y oscuro, como variables CSS, utilidades de Tailwind v4 y datos legibles por código.

## ADDED Requirements

### Requirement: Tokens semánticos de color con valor claro y oscuro
El paquete de tokens SHALL exponer cada token de color de la guía (fondos, texto, bordes, `fg-*`, estados, `utility-*`, `alpha-*`, `focus-ring`) con el nombre de la guía y un valor para el tema claro y otro para el oscuro, idénticos a los de `tokens.json` de la guía.

#### Scenario: Valor claro por defecto
- **WHEN** una página carga el CSS de tokens sin activar el tema oscuro
- **THEN** `--text-primary` vale `#171717` y `--bg-primary` vale el blanco de la guía

#### Scenario: Valor oscuro con la clase de tema
- **WHEN** un ancestro del elemento tiene la clase `dark-mode`
- **THEN** `--text-primary` vale `#fafafa` y el resto de tokens toman su valor oscuro

#### Scenario: Paridad con la guía
- **WHEN** se compara la lista de tokens publicada con `tokens.json` de la guía
- **THEN** no falta ningún token ni sobra ninguno fuera de los documentados como añadidos

### Requirement: Utilidades de Tailwind v4 con los nombres de la guía
El paquete SHALL incluir un fichero CSS para Tailwind v4 que registre los tokens en `@theme`, de modo que cada token sea la utilidad del mismo nombre (`bg-primary`, `text-brand-secondary`, `border-secondary`, `text-fg-quaternary`, `bg-utility-brand-50`, `bg-alpha-white/10`).

#### Scenario: Utilidad de color disponible
- **WHEN** un proyecto con Tailwind v4 importa el tema y usa `bg-brand-solid`
- **THEN** el CSS generado aplica el color `bg-brand-solid` de la guía y cambia en oscuro sin clases adicionales

#### Scenario: Variante dark redefinida
- **WHEN** un componente usa `dark:` en una clase
- **THEN** la variante se activa cuando un ancestro tiene la clase `dark-mode`, no por `prefers-color-scheme`

### Requirement: Escalas de tipografía, espaciado, radios y sombras
El tema SHALL exponer `text-xs`…`text-xl` y `text-display-xs`…`text-display-2xl` con sus alturas de línea (y −2 % de interletrado desde `display-md`), las familias `font-body`, `font-display` y `font-mono`, los radios `rounded-*` con los valores de la guía, las sombras `shadow-xs`…`shadow-xl` y `shadow-xs-skeuomorphic`, `max-w-container` (1280px) y `max-w-paragraph` (720px).

#### Scenario: Estilo de display
- **WHEN** se aplica `text-display-sm`
- **THEN** el texto mide 30px con altura de línea 38px

#### Scenario: Radio de botón
- **WHEN** se aplica `rounded-lg`
- **THEN** el radio es 8px

#### Scenario: Espaciado numérico
- **WHEN** se aplica `p-6`
- **THEN** el padding es 24px, el valor de `spacing-3xl`

### Requirement: Anillo de foco
El tema SHALL ofrecer las sombras `focus-ring-shadow` (hueco de 2px en `bg-primary` y anillo de 4px en `focus-ring`) y `focus-ring-error-shadow`, con el hueco en `#0A0A0A` en oscuro.

#### Scenario: Foco en oscuro
- **WHEN** un control enfocado usa `focus-ring-shadow` dentro de `.dark-mode`
- **THEN** el hueco interior es `#0A0A0A` y el anillo es `#615FFF`

### Requirement: Fuentes de la suite incluidas
El paquete SHALL incluir Geist, Geist Mono y Bricolage Grotesque en woff2 variable con sus `@font-face`, cargables sin depender de servicios de terceros.

#### Scenario: Fuentes sin red externa
- **WHEN** una app importa el CSS de fuentes y se sirve sin acceso a Google Fonts ni CDNs
- **THEN** los textos se pintan en Geist y los titulares en Bricolage Grotesque

### Requirement: Tokens legibles desde código
El paquete SHALL exportar los tokens como JSON y como módulo JS/TS tipado, con nombre, valor claro, valor oscuro y nota de uso, para que la web y las gráficas los lean sin parsear CSS.

#### Scenario: Leer un token en TypeScript
- **WHEN** un módulo importa los tokens y lee `text-primary`
- **THEN** obtiene `{ light: "#171717", dark: "#fafafa" }` con tipos que rechazan nombres inexistentes en compilación
