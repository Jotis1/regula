---

name: Pager
description: "Anterior y siguiente al final de una página: una tarjeta por dirección, con el nombre de la página a la que lleva."
interactive: false
---

**Props.** `prev` y `next` ({`href`, `label`}), `labels` ({`previous`, `next`}), `aria-label` (por defecto «Anterior y siguiente») y `className`.

**Pagination o Pager.** `Pager` recorre páginas con nombre que forman una secuencia (guías, fundamentos, los componentes de un grupo) y se pone al final de la página. `Pagination` recorre los números de una lista larga.

**Visual.** Tarjeta de `radius-xl` con 16px de relleno y un filo de 1px `border-secondary`, que pasa a `bg-primary_hover` al pasar el ratón. Arriba, la dirección en `text-xs` `text-tertiary` con su flecha de 16px, a la izquierda en «Anterior» y a la derecha en «Siguiente», que además alinea a la derecha. Debajo, el nombre de la página en `text-md` semibold. En escritorio las dos tarjetas se reparten el ancho; en móvil se apilan.

**Accesibilidad.** Es una navegación con nombre y enlaces normales, con `rel="prev"` y `rel="next"`. El foco usa el anillo del sistema, con teclado. Las flechas son decorativas.

**Detalles.** Sin `prev` ni `next` no pinta nada. Funciona sin JavaScript. No trae margen: sepárala del contenido con `className` (`mt-14` en esta web).
