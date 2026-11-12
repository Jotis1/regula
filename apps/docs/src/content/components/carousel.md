---

name: Carousel
description: "Pasa diapositivas con flechas, puntos, el teclado y deslizando el dedo, o las enseña en una tira que se desplaza."
interactive: true
astroNote: "Pasar de diapositiva necesita JavaScript: úsalo en una isla con `client:load`. Con `type=\"strip\"` la fila se desplaza sin él: la isla (`client:visible`) solo mueve los puntos. Las diapositivas son nodos React, así que va en un `.tsx`."
---

**Cuándo usarlo.** Una serie corta de contenido del mismo tipo que se ve de una en una: novedades, fotos de un producto, pasos de una presentación. Si el contenido es imprescindible, no lo escondas tras un carrusel: ponlo en una lista.

**Props.** `slides` (un nodo por diapositiva), `aria-label` (obligatorio: nombre de la región), `size` (`md` · `lg`), `index` / `defaultIndex` / `onChange` (desde 0) y `labels` (`carousel`, `slide`, `previous`, `next`, `slideOf`, `goTo`), `type` (`slides` · `strip`) y `slideWidth` (px de cada diapositiva en `strip`, 300 por defecto). `arrowStyle` (`button-chevron`, la de siempre · `button-arrow` · `arrow`, larga y sin círculo), las flechas del Figma (`_Testimonial carousel arrow`, `1374:440`).

**Visual.** Una caja de `radius-xl` que recorta las diapositivas, a todo el ancho. Encima, una flecha redonda `bg-primary` a cada lado, a 16px del borde y centrada en vertical (36px en `md`, 44 en `lg`), y abajo, centrados y a 16px, los puntos de `PaginationDots` sobre su píldora (`md` o `lg`). Cada diapositiva llena la caja; su alto lo da su contenido.

**Comportamiento.** Las flechas y los puntos pasan de diapositiva; las flechas se atenúan en los extremos (no da la vuelta) y no pasan. Con el foco dentro, ← y → también. En pantallas táctiles se desliza: un arrastre de 48px o más a un lado pasa a la siguiente o a la anterior. No avanza solo. La pista se mueve con una transición de 300 ms, que se quita con `prefers-reduced-motion`.

**Variantes.** `slides` (la de siempre) pasa de una en una. `strip` es una tira: las diapositivas van en una fila de `slideWidth` px con 12px entre ellas, que se desplaza en horizontal con el dedo o la rueda (`overflow-x: auto`, `scroll-snap-type: x mandatory`) y se detiene en cada una. Deja ver parte de la siguiente: cada diapositiva mide como mucho el ancho del contenedor menos 48px. No lleva flechas ni usa JavaScript para desplazarse; debajo, los puntos de `PaginationDots` sin `onChange` solo indican cuál se ve. Sin hidratar marcan la primera; con `client:visible`, un `IntersectionObserver` los mueve. En `strip` no cuentan `index`, `defaultIndex`, `onChange`, `arrowStyle` ni `labels` salvo `slideOf`, que da el texto «1 de 6» de los puntos para los lectores.

**Accesibilidad.** Es una región con nombre y rol «carrusel»; cada diapositiva, un grupo «n de N». Las que no se ven llevan `inert` y `aria-hidden`, así que su contenido no recibe el foco ni se lee. Las flechas conservan el foco al llegar a un extremo (usan `aria-disabled`). `strip` es una lista con nombre (`aria-label`) y un elemento por diapositiva; todas siguen en el árbol de accesibilidad y la fila se recorre con el teclado, sin flechas propias.

**Detalles.** Las diapositivas del ejemplo están hechas con componentes: el carrusel no trae imágenes.
