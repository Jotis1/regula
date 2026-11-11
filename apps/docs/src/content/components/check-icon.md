---

name: CheckIcon
description: "Check en círculo, tintado, de contorno o sólido, para listas de lo que incluye un plan o de pasos hechos."
interactive: false
---

**Props.** `type` (`default` círculo tintado · `line` contorno · `filled` sólido con el check en blanco), `color` (`brand` · `gray` · `success`), `size` (`sm` 20 · `md` 24 · `lg` 28 · `xl` 32).

**Visual.** El del Figma (`Check icon`, `1254:137887`). Tintado: `utility-*-100` con el check en `utility-*-600`, que se invierten en oscuro; sólido: `bg-brand-solid`, `bg-secondary-solid` o `bg-success-solid`.

**Uso.** Junto a un texto que lo explica; para una línea con su texto, `CheckItem`. No es una casilla: no se puede marcar.

**Accesibilidad.** Es decorativo (`aria-hidden`): lo que se lee es el texto de al lado.
