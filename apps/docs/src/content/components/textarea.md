---

name: Textarea
description: "Campo de texto multilínea con la misma etiqueta, pista y estados que `Input`."
interactive: false
astroNote: "Sin directiva funciona como campo nativo dentro de un `<form>`. Si necesitas `onChange`, ponlo en una isla `.tsx` con `client:load`."
---

**Props.** `label`, `hint`, `error`, `rows` (4 por defecto), `size` (`md` por defecto · `sm`: texto de 14 px, pista de 12 y caja más baja, como el Figma) y los atributos de `<textarea>`. Altura mínima 104px (86 en `sm`), redimensionable en vertical.

**Etiquetas.** Con `tags` (controlado, con `onTagsChange`) o `defaultTags`, el campo pasa a ser de etiquetas de varias líneas, como `TagInput`: Enter o coma convierten lo escrito en etiqueta, sin repetidas ni vacías, y Retroceso con el campo vacío quita la última. `tagPlacement` pone las etiquetas `inside` (delante del texto, dentro de la caja de 104px, que se enfoca con un clic) u `outside` (debajo). Ya no hay texto libre: `rows`, `value` y `defaultValue` no se usan. `placeholder` y `name` (las etiquetas van separadas por comas) pasan al campo.
