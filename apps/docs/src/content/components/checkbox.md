---

name: Checkbox
description: "Casilla para activar opciones independientes, con etiqueta y texto de apoyo."
interactive: false
astroNote: "Sin directiva es una casilla nativa que se envía con el formulario. `indeterminate` y `onChange` necesitan una isla `.tsx` con `client:load`."
---

**Props.** `label`, `hint`, `checked` / `defaultChecked`, `onChange`, `indeterminate`, `size` (`sm` 16px · `md` 20px), `disabled`.

**Visual.** Marcada: `bg-brand-solid` con check blanco de 1,67px. Sin marcar: borde `border-primary`. Etiqueta `text-secondary` medium; apoyo `text-tertiary`. La caja baja 2px para alinearse con la primera línea.

**Por dentro.** Es un `<input type="checkbox">` nativo: espacio para marcar, envío en formularios y `required`. `indeterminate` marca la propiedad del DOM y `aria-checked="mixed"`.
