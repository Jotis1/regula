---

name: Icon
description: "Los iconos de línea del archivo (24×24, trazo 2px redondeado) como componente que hereda `currentColor`."
interactive: false
source: packages/icons/src/Icon.tsx
---

**Props.** `name` (ver `Jotis.iconNames`), `size` (20 en controles, 16 en xs y menús, 24 en navegación), `title` (si el icono transmite algo por sí solo), `spin`.

**Colores.** El icono toma el color del texto. En controles usa `fg-quaternary`; en navegación `fg-quaternary` y `fg-tertiary` activo; con estado, `fg-success-primary`, `fg-error-primary`…
