---

name: RadioGroup
description: "Grupo de opciones excluyentes con etiqueta y apoyo por opción, en lista o en tarjetas."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `options` [{`value`, `label`, `hint`?, `supporting`?, `media`?, `disabled`?}], `value` / `defaultValue`, `onChange(value)`, `size`, `appearance` (`default` o `card`), `indicator` (`radio` o `checkbox`, solo en tarjetas), `aria-label`. Hasta cinco opciones; más, `Select`.

**Tarjetas.** Con `appearance="card"` cada opción es una tarjeta (`rounded-xl`, relleno de 16px, borde `border-secondary`) con el indicador arriba a la derecha; la elegida pasa a borde de 2px `border-brand` y el indicador se rellena en `bg-brand-solid`. `media` va delante del texto, a 32px: un `FeaturedIcon` (planes), un `Avatar` (personas) o un logo de pago. `supporting` va en línea tras la etiqueta, en `text-tertiary` («20 €/mes»), y `hint` debajo. `indicator="checkbox"` cambia el círculo por la casilla con check, como en algunas tarjetas del Figma; sigue siendo una elección única. `supporting`, `media` y `disabled` solo se ven en tarjetas.

**Teclado.** Tab entra en el grupo por la opción elegida y las flechas cambian de opción, también en tarjetas.
