---

name: Radio
description: "Botón de opción suelto; normalmente lo usarás dentro de `RadioGroup`."
interactive: false
astroNote: "Sin directiva funciona como campo nativo dentro de un `<form>`. Si necesitas `onChange`, ponlo en una isla `.tsx` con `client:load`."
---

**Props.** `name`, `value`, `checked`, `onChange`, `label`, `hint`, `size`.

**Por dentro.** Es un `<input type="radio">` nativo: las flechas pasan entre los radios con el mismo `name`.
