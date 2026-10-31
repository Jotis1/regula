---

name: Toggle
description: "Interruptor para ajustes que se aplican al momento, sin botón de guardar."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `label`, `hint`, `checked` / `defaultChecked`, `onChange(checked)`, `size` (`sm` 36×20 · `md` 44×24), `disabled`. Pista apagada `bg-tertiary`, encendida `bg-brand-solid`; mando `fg-white` con `shadow-sm`. Usa `role="switch"`.

**Toggle o Checkbox.** Si el cambio necesita confirmar con un botón, es un `Checkbox`.
