# brand-assets Specification

## Purpose
Mantiene la identidad visual común de la suite jotis.me: los iconos de cada app, con su construcción fija y sus variantes, y los adornos (fondos, patrones, trazos a mano) que la guía permite.

## Requirements

### Requirement: Registro de apps de la suite
El sistema SHALL mantener un registro de apps con nombre, letras y tono: Ornatus (Or, `indigo`), Vinculum (Vi, `sky`), Pecunia (Pe, `emerald`), Emptor (Em, `orange`), Regula (Re, `fuchsia`) y Scaena (Sc, `lime`), y SHALL rechazar en la validación una app con tono `red`, `yellow`, gris o ya usado, o vecino de uno usado.

#### Scenario: App registrada
- **WHEN** se pide el icono de `pecunia`
- **THEN** se obtiene la baldosa con "Pe" en el tono `emerald`

#### Scenario: Tono prohibido
- **WHEN** se añade al registro una app con tono `red`
- **THEN** la validación del registro falla indicando que `red` está reservado para errores

#### Scenario: Regula
- **WHEN** se pide el icono de `regula`
- **THEN** se obtiene la baldosa con "Re" en el tono `fuchsia` (fondo `#4b004f`, mayúscula `#f4a8ff`, minúscula `#e12afb`) y coincide con los SVG de Regula de la guía

#### Scenario: Vecino de Regula
- **WHEN** se añade al registro una app con tono `purple` o `pink`
- **THEN** la validación del registro falla porque es vecino de `fuchsia`, el tono de Regula

#### Scenario: Scaena
- **WHEN** se pide el icono de `scaena`
- **THEN** se obtiene la baldosa con "Sc" en el tono `lime` y sus cinco variantes coinciden con los SVG de Scaena que añadió la guía

#### Scenario: Vecino de Scaena
- **WHEN** se añade al registro una app con tono `green`
- **THEN** la validación del registro falla con un problema que nombra a Scaena por ser vecino de `lime`, además del que nombra a Pecunia por ser vecino de `emerald`

### Requirement: Construcción fija del icono de app
`AppIcon` SHALL dibujar la baldosa con tres esquinas de radio 22,5 % del lado y la inferior izquierda a 6/128, la mayúscula en el tono claro y la minúscula en el medio, en Bricolage Grotesque SemiBold convertida a curvas, y la virgulilla de tamaño fijo (40/128) centrada bajo las letras.

#### Scenario: Letras en curvas
- **WHEN** se pinta un `AppIcon` en un entorno sin Bricolage Grotesque instalada
- **THEN** las letras se ven igual que con la fuente, porque el SVG no usa elementos de texto

#### Scenario: Virgulilla de tamaño fijo
- **WHEN** se comparan los iconos de "Or" y "Em" al mismo tamaño
- **THEN** la virgulilla tiene la misma longitud y posición en ambos

### Requirement: Variantes del icono de app
`AppIcon` SHALL ofrecer las variantes `primary` (fondo `T-950`, letras `T-300`/`T-500`), `solid` (fondo `T-600`, letras blancas, sin virgulilla), `light` (fondo `T-50` con borde `T-200`, letras `T-800`/`T-600`) y `mono` (fondo `neutral-950`, blanco/`neutral-400`).

#### Scenario: Variante clara
- **WHEN** se pinta `AppIcon` de Vinculum con `variant="light"`
- **THEN** el fondo es `sky-50` con borde de 1px `sky-200` y las letras `sky-800` y `sky-600`

### Requirement: Tamaños y reglas por tamaño
`AppIcon` SHALL admitir los tamaños 16, 20, 24, 32, 48, 64, 96 y 128 px, SHALL dibujar la virgulilla solo desde 32px y SHALL usar `solid` por debajo de 20px cuando no se indica variante.

#### Scenario: Tamaño pequeño
- **WHEN** se pinta `AppIcon` a 16px sin `variant`
- **THEN** se usa la variante `solid` y no aparece la virgulilla

### Requirement: Iconos de app para favicon y PWA
El sistema SHALL generar para cada app los ficheros de favicon (variante `solid`), el icono `any` (principal), el icono `maskable` a sangre sin radio con letras y virgulilla dentro de la zona segura, y el `apple-touch-icon` de 180px.

#### Scenario: Ficheros de una app
- **WHEN** se generan los recursos de Emptor
- **THEN** existen favicon SVG, iconos PNG `any` y `maskable` y `apple-touch-icon` de 180×180, listos para el manifest

### Requirement: Fondos, patrones y trazos a mano
El sistema SHALL ofrecer `BackgroundPattern` (rejilla, puntos, rejilla con casillas, círculos y cuadrados concéntricos, siempre con máscara de desvanecido y en `border-secondary`), las texturas del grupo Patterns y los trazos a mano en tinta `#171717`, que SHALL recolorearse a `#FAFAFA` en oscuro.

#### Scenario: Trazo a mano en oscuro
- **WHEN** un trazo a mano se pinta dentro de `.dark-mode`
- **THEN** su color es `#FAFAFA`

#### Scenario: Patrón desvanecido
- **WHEN** se pinta `BackgroundPattern` con el patrón de puntos
- **THEN** los puntos se desvanecen hacia los bordes sin corte visible
