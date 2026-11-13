# Proposal

## Why

Scaena necesita escenas para monitores ultrapanorámicos (3440×1440). Hoy `StreamScene` dibuja siempre un lienzo de 1920×1080: fuera de 16:9 solo se puede centrar, y entonces el pie (canal, línea y enlace) no llega a los bordes. De paso, dos arreglos pequeños que pueden ir en la misma versión: `HeaderNav` pierde sus acciones en móvil (el botón de tema, por ejemplo) y `ProgressSteps` interactivo incumple WCAG 2.5.3 (`label-content-name-mismatch`).

## What Changes

- **`StreamScene`**: prop `width?: number`, el ancho lógico del lienzo (por defecto 1920; el alto sigue siendo 1080). Para 3440×1440, `width={2580}` con `scale={4/3}`. Un valor que no sea un entero de al menos 1920 se trata como 1920. La cuadrícula y el pie se estiran; el bloque central sigue centrado y al mismo tamaño.
- **`HeaderNav`**: prop `mobileActions?: boolean`. Con ella, `actions` se pinta también en la fila móvil, antes del botón de menú (o de `mobileBar`).
- **`ProgressSteps`** con `onChange`: la descripción de cada paso sale del botón y va debajo, como texto aparte enlazado con `aria-describedby`, para que el texto visible del botón coincida con su nombre.
- Fuera de alcance: altos distintos de 1080 y anchos menores de 1920 en `StreamScene`; cambiar el aspecto de `ProgressSteps` sin `onChange`.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `component-library`: lienzo configurable en `StreamScene`, acciones en la fila móvil de `HeaderNav` y nombre de los pasos navegables de `ProgressSteps`.
- `docs-site`: la ficha de `StreamScene` incluye un ejemplo en 21:9.

## Impact

- `packages/react`: cambios retrocompatibles en `StreamScene`, `HeaderNav` y `ProgressSteps`; tests. Changeset `patch` (0.8.1).
- `apps/docs`: ficha de `StreamScene` con el ejemplo en 21:9, capturas nuevas de las cuatro variantes a 3440×1440, regresión visual de las de 1920 sin cambios.
