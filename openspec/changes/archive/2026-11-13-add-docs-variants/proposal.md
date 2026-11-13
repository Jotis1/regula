# Proposal

## Why

El rediseño de regula.jotis.me tiene ocho sitios donde un componente del sistema casi sirve y le falta una variante pequeña. Hoy la web los resolvería con marcado propio, que hay que mantener aparte y que no hereda los arreglos del paquete. Son variantes baratas y casi todas útiles para cualquier app de la suite.

## What Changes

- **`HeaderNav`**: prop `fullWidth`. La cabecera ocupa todo el ancho con 32 px a los lados, en lugar de centrarse a 1.280 px, para que la marca quede alineada con una navegación lateral.
- **`Tabs`**: cada elemento admite `href`. Con `href` en todos, la lista es una `<nav>` de enlaces con `aria-current` en el actual, con el mismo aspecto y sin `tablist`. Para el índice «En esta página» y las pestañas que cambian de URL.
- **`Carousel`**: prop `type` (`"slides"` por defecto, `"strip"`). La tira enseña un trozo de la siguiente diapositiva, se pasa con el dedo o la rueda sin JavaScript (`scroll-snap`) y no lleva flechas.
- **`Toggle`**: acepta `aria-label`, para usarlo sin etiqueta visible cuando la etiqueta está fuera (una fila de tabla, un inspector).
- **Etiqueta con acompañante**: prop `labelAside` en los campos que llevan etiqueta (`Input`, `Textarea`, `Select`, `MultiSelect`, `NumberInput`, `TagInput`) y en `Toggle`. Pinta un nodo al final de la fila de la etiqueta: una insignia «Cambiado» y un «Restablecer», un contador, un enlace de ayuda.
- **`CodeSnippet`**: `highlight` (lista de líneas, desde 1) en el código o en cada pestaña, que marca esas líneas con un fondo y una raya a la izquierda.
- **`CommandMenu`**: prop `defaultQuery`, el texto con el que se abre el buscador.
- **`Slideout`**: `side="bottom"`, una hoja que sube desde abajo con el ancho de la pantalla, el alto de su contenido hasta el 85 % y un asa arriba.
- Fuera de alcance: arrastrar la hoja para cerrarla (se cierra con la X, Escape o un clic fuera), resaltar rangos dentro de una línea en `CodeSnippet` y tiras con más de una fila.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `component-library`: los ocho componentes ganan su variante, con un requisito para cada una.

## Impact

- `packages/react`: cambios retrocompatibles en `HeaderNav`, `Tabs`, `Carousel`, `Toggle`, `CodeSnippet`, `CommandMenu`, `Slideout` y en el campo común (`internal/field.tsx`). Tests, fichas y límites en `size-budget.json` si crecen. Changeset `minor`.
- `apps/docs`: los ejemplos interactivos de cada componente con su variante nueva y las capturas de los ejemplos que cambian, miradas en claro y oscuro.
- Artefacto: fichas y bundle nuevos en la próxima sincronización.
- Orden: después de `unblock-docs-redesign` y antes de `redesign-docs-site-v2`. Puede ir en la misma PR que `add-docs-pieces`.
