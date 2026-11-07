---
"@jotis-me/react": minor
---

Formularios del Figma, fase 1. Cuatro componentes nuevos:

- `NumberInput`: campo numérico con botones para restar y sumar, en horizontal o vertical, con mínimo, máximo, paso y formato `es-ES`.
- `TagInput`: convierte lo escrito en etiquetas con Enter o coma, dentro o debajo del campo.
- `VerificationCodeInput`: código de 4 o 6 dígitos, una casilla por dígito, con pegado, autocompletado (`one-time-code`) y `onComplete`.
- `MultiSelect`: varias opciones con buscador y casillas; el campo resume lo elegido y la lista trae «Restablecer» y «Elegir todo».

Y variantes nuevas, sin cambiar lo que ya había:

- `Input`: `prefix` (texto fijo delante), `leadingSelect` / `trailingSelect` (desplegable nativo dentro del campo) y botón para mostrar la contraseña con `type="password"` (`revealable`, `revealLabels`). `Input` pasa a ser componente de cliente; un campo de texto se sigue pintando igual en el servidor.
- `RadioGroup`: `appearance="card"` (opciones en tarjetas con `media` y `supporting`) e `indicator`.
- `Toggle`: `variant="slim"`.
