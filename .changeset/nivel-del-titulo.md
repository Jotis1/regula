---
"@jotis-me/react": minor
---

`PageHeader` y `StreamScene` ganan la prop `headingLevel` (de 1 a 6, 1 por defecto), que cambia la etiqueta del encabezado de su título sin cambiar su aspecto. Sirve cuando el componente va dentro de una página que ya tiene su `<h1>`: con `headingLevel={2}` el título es un `<h2>`. Sin la prop, nada cambia.
