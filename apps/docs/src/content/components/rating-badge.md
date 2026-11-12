---

name: RatingBadge
description: "Badge de valoración con corona de laurel, estrellas y texto, para la prueba social de una portada."
interactive: false
---

**Props.** `title` (texto principal), `supportingText`, `rating` (5 por defecto), `stars` (`true` por defecto) y `ratingLabel`.

**Visual.** El del Figma (`Ratings badge`, `7460:158976`): dos coronas de laurel de 36 × 80 en `fg-primary` (la derecha es la izquierda en espejo), y en medio cinco estrellas de 16 (`Rating` `sm`), el título en `text-sm` seminegrita y el texto de apoyo en `text-xs` `text-secondary`.

**Uso.** En una portada o una sección de prueba social, junto a otros badges o logos. El texto, corto: cabe en una línea.

**Accesibilidad.** Las coronas son decorativas; las estrellas se anuncian «5 de 5» y los textos se leen tal cual. Funciona sin JavaScript.
