---

name: RadioGroup
description: "Grupo de opciones excluyentes con etiqueta y apoyo por opción."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `options` [{`value`, `label`, `hint`?}], `value` / `defaultValue`, `onChange(value)`, `size`, `aria-label`. Hasta cinco opciones; más, `Select`.

**Teclado.** Tab entra en el grupo por la opción elegida y las flechas cambian de opción.
