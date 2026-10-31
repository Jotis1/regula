---

name: Select
description: "Desplegable nativo con el aspecto de `Input` y un chevron, para elegir una opción de una lista corta."
interactive: false
astroNote: "Sin directiva funciona como campo nativo dentro de un `<form>`. Si necesitas `onChange`, ponlo en una isla `.tsx` con `client:load`."
---

**Props.** `label`, `options` (strings o {`value`, `label`}), `placeholder`, `value` / `onChange`, `hint`, `error`, `size`, `icon`. Más de ~12 opciones o con búsqueda: no es este componente.
