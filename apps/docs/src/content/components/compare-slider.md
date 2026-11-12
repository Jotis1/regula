---

name: CompareSlider
description: "Dos capas superpuestas y una línea que las reparte: antes y después, claro y oscuro, dos versiones de una pantalla."
interactive: true
astroNote: "Mover la línea necesita JavaScript: úsalo en una isla con `client:load`. Sin él se ve en `defaultValue` y no se mueve. Las capas son nodos React, así que va en un `.tsx`."
---

**Props.** `before` y `after` (nodos: la de abajo y la de arriba), `label` (obligatorio: qué se compara), `beforeLabel` y `afterLabel` («Antes» y «Después» por defecto), `value` / `defaultValue` (de 0 a 100, 50 por defecto), `onChange`, `height` (px, 320 por defecto) y `className`.

**Cuándo.** Para enseñar el efecto de un cambio con las dos versiones a la vista: una pantalla en claro y en oscuro, un diseño antes y después de un rediseño, una foto retocada. Las dos capas tienen que ser la misma cosa vista de dos maneras, con el mismo tamaño.

**Evita.** Dos contenidos distintos que no se pueden comparar a ojo, y capas con controles que el usuario tenga que pulsar: el mando cubre toda la caja y se lleva los clics. Para una sola imagen con un pie de foto, usa una imagen.

**Visual.** Una caja de `radius-xl` con las dos capas a todo el ancho. La de arriba (`after`) se recorta con `clip-path: inset(0 0 0 <valor>%)` y deja ver la de abajo hasta la línea. La línea mide 2px en `fg-brand-primary` y lleva un tirador de 36px en `bg-brand-solid` con dos chevrons blancos. Las etiquetas van en las esquinas de abajo, en un `Badge` `modern`.

**Teclado.** Con Tab llega al control. ← y ↓ mueven la línea 1 hacia la izquierda, → y ↑ 1 hacia la derecha, Re Pág suma 10 y Av Pág resta 10, Inicio la lleva al 0 y Fin al 100. El anillo de foco aparece en el tirador. Con el ratón o el dedo se arrastra desde cualquier punto de la caja; el desplazamiento vertical de la página sigue funcionando en pantallas táctiles.

**Accesibilidad.** El control es un deslizador con el nombre de `label` que anuncia su valor como «55 % Después». La capa de abajo lleva `aria-hidden` e `inert`: no se lee ni recibe el foco, y la que cuenta para los lectores es la de encima. Las dos etiquetas son texto, no solo posición.

**Detalles.** Se pinta en el servidor con la línea en `defaultValue` y las dos capas a su lado. Sin JavaScript no se mueve: el mando va desactivado hasta que el cliente lo hidrata, para que no haya un control que no hace nada. Para enseñar claro y oscuro con una misma pantalla, usa `light-mode` y `dark-mode` de `@jotis-me/tokens` en cada capa; un `dark-mode` dentro de un `light-mode` no está soportado, así que pon el claro dentro de un contenedor oscuro o las dos capas como hermanas, nunca al revés. Con `value` manda el padre.
