---

name: Carousel
description: "Pasa diapositivas con flechas, puntos, el teclado y deslizando el dedo, en dos tamaños."
interactive: true
astroNote: "Pasar de diapositiva necesita JavaScript: úsalo en una isla con `client:load`. Las diapositivas son nodos React, así que va en un `.tsx`."
---

**Cuándo usarlo.** Una serie corta de contenido del mismo tipo que se ve de una en una: novedades, fotos de un producto, pasos de una presentación. Si el contenido es imprescindible, no lo escondas tras un carrusel: ponlo en una lista.

**Props.** `slides` (un nodo por diapositiva), `aria-label` (obligatorio: nombre de la región), `size` (`md` · `lg`), `index` / `defaultIndex` / `onChange` (desde 0) y `labels` (`carousel`, `slide`, `previous`, `next`, `slideOf`, `goTo`).

**Visual.** Una caja de `radius-xl` que recorta las diapositivas, a todo el ancho. Encima, una flecha redonda `bg-primary` a cada lado, a 16px del borde y centrada en vertical (36px en `md`, 44 en `lg`), y abajo, centrados y a 16px, los puntos de `PaginationDots` sobre su píldora (`md` o `lg`). Cada diapositiva llena la caja; su alto lo da su contenido.

**Comportamiento.** Las flechas y los puntos pasan de diapositiva; las flechas se atenúan en los extremos (no da la vuelta) y no pasan. Con el foco dentro, ← y → también. En pantallas táctiles se desliza: un arrastre de 48px o más a un lado pasa a la siguiente o a la anterior. No avanza solo. La pista se mueve con una transición de 300 ms, que se quita con `prefers-reduced-motion`.

**Accesibilidad.** Es una región con nombre y rol «carrusel»; cada diapositiva, un grupo «n de N». Las que no se ven llevan `inert` y `aria-hidden`, así que su contenido no recibe el foco ni se lee. Las flechas conservan el foco al llegar a un extremo (usan `aria-disabled`).

**Detalles.** Las diapositivas del ejemplo están hechas con componentes: el carrusel no trae imágenes.
