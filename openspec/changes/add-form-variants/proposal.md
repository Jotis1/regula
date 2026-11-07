# Proposal

## Why

Con el repo ya como fuente de verdad (`adopt-repo-as-source`), toca añadir lo que el Figma «Yoruverse UI v8.0» tiene y `@jotis-me/react` no. El inventario del 6 de noviembre de 2026 (46 páginas de componentes base, de aplicación y de recursos compartidos) reparte lo que falta en tres fases. Esta es la primera: los formularios, porque son lo que más usan las apps de la suite y hoy obligan a cada app a montar a mano campos con prefijo, contraseñas, contadores, códigos de verificación o selección múltiple.

## What Changes

- **`Input`** gana los tipos del Figma que caben en un campo de una línea:
  - texto fijo delante (`https://`);
  - desplegable delante o detrás (prefijo telefónico, divisa);
  - contraseña con botón para mostrarla.
  
  Son props nuevas y opcionales: lo que ya funciona no cambia.
- **`NumberInput`** (nuevo): campo numérico con botones para sumar y restar, en horizontal o en vertical (Figma «Number counter»).
- **`TagInput`** (nuevo): campo que convierte lo escrito en etiquetas, con las etiquetas dentro o debajo del campo (Figma «Tags inner/outer»).
- **`VerificationCodeInput`** (nuevo): código de 4 o 6 dígitos, una casilla por dígito, en tres tamaños (Figma «Verification code input field»).
- **`MultiSelect`** (nuevo): selector que elige varias opciones de una lista con casillas y buscador, y resume lo elegido en el campo («2 elegidos»), como el Figma «Multi-select». `Select` sigue siendo el nativo para listas cortas.
- **`RadioGroup`** gana el aspecto de tarjeta: cada opción es una tarjeta con icono, avatar o logo de pago, en las variantes del Figma («Icon simple», «Icon card», «Avatar», «Payment icon»). El aspecto actual sigue siendo el de por defecto.
- **`Toggle`** gana la variante `slim` del Figma.
- Cada componente nuevo o cambiado lleva:
  - su página en la web;
  - su ejemplo y sus dos capturas aprobadas (claro y oscuro);
  - su ficha en el artefacto "Jotis.me", que se republica después de la versión.
- El catálogo pasa de 74 a 78 componentes.

Fuera de este cambio:
- Los tipos de `Input` que ya cubre otro componente: «Date and time» (`DatePicker`), «File upload» (`FileUpload`) y «Payment input», que va con la tarjeta de pago en una fase posterior.
- «Trailing button» y la `Textarea` con etiquetas, que no usa ninguna app hoy.
- Fase 2 (navegación y progreso) y fase 3 (variantes menores): cada una, su cambio.
- Corregir la paleta del Figma: los componentes usan los tokens semánticos, no los colores del archivo.

## Capabilities

### New Capabilities

Ninguna: los componentes nuevos y sus variantes entran en la capacidad existente de la librería.

### Modified Capabilities
- `component-library`: el catálogo suma `MultiSelect`, `NumberInput`, `TagInput` y `VerificationCodeInput`. Se añade un requisito con los tipos de campo de formulario y sus reglas: etiqueta y error en los campos nuevos, teclado y lectores de pantalla en el código de verificación, la selección múltiple y la contraseña. También se añaden las variantes de `RadioGroup` y `Toggle`.

## Impact

- **Código:**
  - `packages/react/src/components/`: `Input`, `RadioGroup` y `Toggle` cambian, y hay cuatro componentes nuevos;
  - `internal/field.tsx` e `internal/choice.tsx`;
  - el punto de entrada `index.ts`.
- **API:** solo añade props y componentes, sin rupturas. Va en una versión *minor* de `@jotis-me/react` (changeset).
- **Dependencias:** ninguna nueva. Los componentes interactivos usan `react-aria-components`, que ya está.
- **Web (`apps/docs`):**
  - cuatro páginas nuevas en el grupo «Formularios»;
  - los ejemplos del registro visual y sus PNG aprobadas;
  - las de `Input`, `RadioGroup` y `Toggle` se recapturan porque su ejemplo enseña las variantes nuevas.
- **Artefacto "Jotis.me":** se resincroniza tras publicar la versión, siguiendo `scripts/artifact/README.md`.
