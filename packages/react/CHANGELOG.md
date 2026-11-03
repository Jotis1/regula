# @jotis-me/react

## 0.2.0

### Minor Changes

- f691517: Regula entra en la familia de iconos de app: `AppIcon app="regula"` pinta "Re" en `fuchsia`. `@jotis-me/icons` publica sus SVG, favicon y PNG en `app-icons/regula-*`. Como `purple` y `pink` son vecinos de `fuchsia`, dejan de valer para una app nueva.

### Patch Changes

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
