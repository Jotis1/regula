---

name: ButtonGroup
description: "Grupo segmentado de botones secundarios unidos, para elegir una opción entre pocas (periodos, vistas)."
interactive: true
---

**Props.** `items` [{`value`, `label`, `icon`?, `dot`?, `iconOnly`?}], `size` (`md` 40px · `sm` 36px), `value` / `defaultValue`, `onChange(value)`, `aria-label`. `iconOnly` enseña solo el icono y exige `label`, que es su nombre accesible. `dot` pone un punto de estado delante. El elegido lleva `aria-pressed` y fondo `bg-secondary_hover`.

**Cuándo.** De 2 a 5 opciones cortas que cambian lo que se ve en la misma pantalla. Para navegar entre secciones usa `Tabs`.
