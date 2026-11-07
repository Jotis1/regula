---

name: LinkCard
description: "Card cuyo enlace cubre toda su superficie, con una vista previa opcional que no es interactiva."
interactive: false
---

**Props.** `href`, `title`, `description`, `preview`, `as` (`div` · `li`) y `className`.

**Cuándo.** Para listas de destinos que se eligen mirando: los componentes, las plantillas, los proyectos. Una sola acción, la de abrir el destino, y una muestra que ayuda a reconocerlo. Si la card tiene varias acciones, no es una `LinkCard`.

**Visual.** Tarjeta de `radius-xl` con borde `border-secondary` y `overflow-hidden`. La muestra va arriba, a todo el ancho. Debajo, 16px de relleno con el título en `text-md` semibold y la descripción en `text-sm` `text-tertiary`. Con el ratón encima, el borde pasa a `border-primary` con `shadow-sm` y el título se subraya; con foco de teclado, la card entera lleva el anillo de foco.

**Accesibilidad.** El enlace es uno solo y su nombre es el título seguido de la descripción. Cubre toda la card con su `::after`, así que pulsar en cualquier punto, también sobre la muestra, lo abre. La muestra va fuera del enlace, inerte y oculta a los lectores de pantalla: puede llevar botones o enlaces dibujados sin que reciban foco ni clics.

**Detalles.** Funciona sin JavaScript. Con `as="li"` es un elemento de lista, para ponerla dentro de un `<ul>`. Desde Astro, pasa la muestra y la descripción como slots con nombre (`slot="preview"` y `slot="description"`).
