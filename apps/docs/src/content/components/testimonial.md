---

name: Testimonial
description: "Testimonio sobre una foto: la cita, las estrellas y la persona en un panel de cristal, flotante o a todo el ancho."
interactive: false
---

**Props.** `quote` (sin comillas), `name`, `role`, `company`, `rating` (estrellas, de 0 a 5), `image` (la foto del fondo), `type` (`floating` · `full-width`), `size` (`md` · `sm`), `onPrevious`/`onNext` (las flechas) y `labels`.

**Visual.** La del Figma (`_Quote image bottom panel`, `1376:1163`): el panel abajo, con radio 16 y separado del borde (`floating`) o a todo el ancho, con la cita en Bricolage (`display-xs` en `md`, `text-lg` en `sm`), las estrellas blancas (`Rating color="white"`), el nombre, el cargo y la empresa, y las flechas en círculo. El cristal es `bg-overlay/60` con desenfoque: el del Figma, blanco translúcido, no da contraste al texto blanco sobre una foto clara.

**Uso.** En la portada o la página de precios, solo o en un `Carousel` (con `arrowStyle` para las flechas del Figma: en un círculo con flecha o largas sin círculo).

**Accesibilidad.** Una `figure` con la cita en `blockquote` y la persona en `figcaption`; las estrellas son una imagen con su valor («5 de 5»). La foto del fondo, si es decorativa, con `alt=""`.
