---

name: ButtonGroup
description: "Grupo segmentado de botones secundarios unidos, para elegir una opción entre pocas (periodos, vistas)."
interactive: true
---

**Props.** `items` [{`value`, `label`, `icon`?}], `value` / `defaultValue`, `onChange(value)`, `aria-label`. El elegido lleva `aria-pressed` y fondo `bg-secondary_hover`.

**Cuándo.** De 2 a 5 opciones cortas que cambian lo que se ve en la misma pantalla. Para navegar entre secciones usa `Tabs`.
