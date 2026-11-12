---

name: Toggle
description: "Interruptor para ajustes que se aplican al momento, sin botón de guardar."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `label`, `hint`, `labelAside` (nodo tras la etiqueta, a la derecha y fuera del interruptor: pulsar sus botones no lo activa), `aria-label` / `aria-labelledby` (nombre accesible sin `label` visible; con `label`, manda `aria-label`), `checked` / `defaultChecked`, `onChange(checked)`, `size` (`sm` 36×20 · `md` 44×24), `variant` (`default` o `slim`), `disabled`. Pista apagada `bg-tertiary`, encendida `bg-brand-solid`; mando `fg-white` con `shadow-sm`. Usa `role="switch"`.

**Toggle o Checkbox.** Si el cambio necesita confirmar con un botón, es un `Checkbox`.

**Fino.** `variant="slim"` es la variante fina del Figma: pista de 32×16 (`sm`) o 40×20 (`md`) sin relleno, con borde `border-secondary` mientras está apagada, y el mando a su misma altura con borde `toggle-border` (encendido, `toggle-slim-border_pressed`). Mismo teclado, estados y `role="switch"` que el normal; úsalo donde el interruptor normal pesa demasiado, como en filas de tabla o listas densas.
