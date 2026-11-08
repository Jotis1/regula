---

name: PaginationDots
description: "Puntos o rayas que dicen en qué página o diapositiva estás, con o sin marco, y que llevan a otra si se les da onChange."
interactive: false
astroNote: "Sin `onChange` es solo un indicador y funciona sin JavaScript. Con `onChange` (una función), envuélvelo en un `.tsx` con `client:load`."
---

**Cuándo usarlo.** Para decir en qué diapositiva o paso de una serie corta estás: un carrusel, una presentación de bienvenida, una galería. Para recorrer páginas de una tabla o una lista, `Pagination`.

**Props.** `total`, `current` (desde 1), `onChange(página)`, `variant` (`dot` · `line`), `size` (`md` · `lg`), `framed`, `labels` (`pageOf` y `goTo`) y `aria-label`.

**Visual.** Cada marca va en `bg-quaternary` y la actual en `bg-brand-solid`. En `dot`, el punto mide 8px (`md`, a 12px del siguiente) o 10px (`lg`, a 16px); en `line`, la raya mide 44px de largo y 8 o 10 de alto. Con `framed` van sobre una píldora `bg-primary` con 8px (`md`) o 12px (`lg`) de relleno, para ponerlas encima de una imagen.

**Comportamiento.** Sin `onChange` es un indicador: no se puede pulsar. Con `onChange`, cada marca es un botón que lleva a su página, con un área de pulsación algo mayor que el punto, el color un escalón más oscuro al pasar el ratón y el anillo de foco con teclado.

**Accesibilidad.** El indicador dice «2 de 5» solo para lectores y sus marcas son decorativas. Con `onChange` es un grupo de botones con nombre «Ir a la página n de N» y `aria-current` en la actual.
