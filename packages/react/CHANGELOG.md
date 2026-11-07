# @jotis-me/react

## 0.4.0

### Minor Changes

- ebf83b3: Formularios del Figma, fase 1. Cuatro componentes nuevos:
  - `NumberInput`: campo numérico con botones para restar y sumar, en horizontal o vertical, con mínimo, máximo, paso y formato `es-ES`.
  - `TagInput`: convierte lo escrito en etiquetas con Enter o coma, dentro o debajo del campo.
  - `VerificationCodeInput`: código de 4 o 6 dígitos, una casilla por dígito, con pegado, autocompletado (`one-time-code`) y `onComplete`.
  - `MultiSelect`: varias opciones con buscador y casillas; el campo resume lo elegido y la lista trae «Restablecer» y «Elegir todo».

  Y variantes nuevas, sin cambiar lo que ya había:
  - `Input`: `prefix` (texto fijo delante), `leadingSelect` / `trailingSelect` (desplegable nativo dentro del campo) y botón para mostrar la contraseña con `type="password"` (`revealable`, `revealLabels`). `Input` pasa a ser componente de cliente; un campo de texto se sigue pintando igual en el servidor.
  - `RadioGroup`: `appearance="card"` (opciones en tarjetas con `media` y `supporting`) e `indicator`.
  - `Toggle`: `variant="slim"`.

### Patch Changes

- cee0e19: `Dropdown` abierto de inicio (`defaultOpen`) ya no repite ids ni deja referencias ARIA rotas en el HTML de servidor. El panel en línea iba dentro del `MenuTrigger` de React Aria y cada opción recibía las props del botón (su `id`, `aria-controls`, `aria-haspopup`…). Ahora va fuera, y la etiqueta, la descripción y el atajo de cada opción van en sus huecos de React Aria. El aspecto y el comportamiento no cambian: el botón sigue cerrando el menú abierto de inicio y elegir una opción lo cierra.
- @jotis-me/icons@0.4.0
  - @jotis-me/tokens@0.4.0

## 0.3.0

### Minor Changes

- 94ffbf3: Scaena entra en la suite: `apps.scaena` / `appIcons.scaena` (`Sc`, tono `lime`), con sus SVG y PNG en `dist/app-icons/` y `app="scaena"` en `AppIcon`. `lime` no bloquea ningún tono libre: sus vecinos (`yellow` y `green`) ya estaban vetados.

### Patch Changes

- Updated dependencies [94ffbf3]
  - @jotis-me/icons@0.3.0
  - @jotis-me/tokens@0.3.0

## 0.2.0

### Minor Changes

- f691517: Regula entra en la familia de iconos de app: `AppIcon app="regula"` pinta "Re" en `fuchsia`. `@jotis-me/icons` publica sus SVG, favicon y PNG en `app-icons/regula-*`. Como `purple` y `pink` son vecinos de `fuchsia`, dejan de valer para una app nueva.

### Patch Changes

- 7749e46: `BrowserFrame`: el área de contenido es una región con foco (`tabIndex={0}`, `<section>` con la dirección como nombre y anillo de foco), para que una pantalla que no cabe se pueda desplazar con el teclado. Antes, a anchos estrechos, axe lo marcaba como región desplazable sin foco.
- cd49f95: `Checkbox`: con `indeterminate`, `aria-checked="mixed"` se pone al montar, junto con la propiedad `indeterminate` de la casilla. Antes, el HTML de servidor anunciaba "mixed" en una casilla nativa que hasta hidratar no lo estaba.
- 815df97: `ColorPicker`: la barra de tono tiene nombre propio («Tono», cambiable con `hueLabel`). Antes, en el HTML de servidor, su `aria-labelledby` apuntaba a una etiqueta que no existía hasta hidratar.
- Updated dependencies [f691517]
  - @jotis-me/icons@0.2.0
  - @jotis-me/tokens@0.2.0

## 0.1.0

### Minor Changes

- 060d186: Primera versión pública del sistema de diseño de la suite jotis.me: tokens semánticos en claro y oscuro con su tema de Tailwind v4 y las fuentes de la suite; los 81 iconos de línea como componentes React y SVG sueltos, con los iconos de app y los adornos; y los 74 componentes de la guía en React, compatibles con Next.js (App Router) y Astro.

### Patch Changes

- Updated dependencies [060d186]
  - @jotis-me/tokens@0.1.0
  - @jotis-me/icons@0.1.0
