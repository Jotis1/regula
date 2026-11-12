---

name: Rating
description: "Valoración con estrellas, con relleno parcial en pasos de 10 % y su valor para lectores."
interactive: false
---

**Props.** `value` (de 0 a `max`), `max` (de 1 a 5 estrellas, 5 por defecto), `color` (`yellow` · `gray`), `size` (`sm` 16 · `md` 20 · `lg` 24) y `label`. El paquete exporta también `ratingLabel(value, max)`, que da «4,5 de 5».

**Visual.** La estrella del Figma (`Star icon`, `1232:9`): fondo `bg-tertiary` y, encima, la misma estrella recortada con `clip-path` al relleno, en `fg-warning-secondary` (amarillo) o `fg-primary` (gris). El relleno va en pasos de 10 %, como las once variantes del Figma: 4,5 son cuatro llenas y una a medias.

**Uso.** Para mostrar una nota (reseñas, valoración media). No es un control: para pedir una valoración, un `RadioGroup`. En una tabla, la celda `rating` de `Table`.

**Accesibilidad.** Es una imagen con nombre: los lectores anuncian «4,5 de 5» (con coma decimal), y las estrellas son decorativas. `label` lo cambia. Funciona sin JavaScript.
