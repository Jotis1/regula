---

name: Textarea
description: "Campo de texto multilínea con la misma etiqueta, pista y estados que `Input`."
interactive: false
astroNote: "Sin directiva funciona como campo nativo dentro de un `<form>`. Si necesitas `onChange`, ponlo en una isla `.tsx` con `client:load`."
---

**Props.** `label`, `hint`, `error`, `rows` (4 por defecto) y los atributos de `<textarea>`. Altura mínima 104px, redimensionable en vertical.
