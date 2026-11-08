---

name: CopyTooltip
description: "Burbuja «Copiado» junto al botón pulsado, para avisar de que algo se ha copiado al portapapeles."
interactive: true
astroNote: "El aviso necesita JavaScript: móntalo una vez con `client:idle`. Con `copyAttribute` copia el HTML estático que lleve ese atributo; con `useCopy`, el botón tiene que estar en un componente interactivo."
---

**Props.** `copyAttribute` (un atributo cuyo valor se copia al pulsar, como `data-copy`), `labels` ({`copied`, `failed`}) y `duration` (1500 ms). El hook `useCopy()` devuelve `copy(texto, elemento)`, que copia y avisa junto a ese elemento.

**Cuándo.** Al copiar un valor que el usuario no ve cambiar: una utilidad, una variable, el nombre de un icono. La burbuja queda pegada al botón pulsado, que es donde está mirando. Para avisos de estado de la aplicación, `Notification`.

**Cómo se usa.** Monta un solo `CopyTooltip` por página. Desde React, `const copy = useCopy()` y `onClick={(e) => copy("bg-brand-solid", e.currentTarget)}`. En HTML estático, `<CopyTooltip copyAttribute="data-copy" />` y `data-copy="valor"` en cada botón: sin más JavaScript, como en las tablas de tokens de esta web.

**Visual.** La burbuja de `Tooltip`: fondo `bg-primary-solid`, texto blanco de 12px semibold y `shadow-lg`. Sale centrada sobre el elemento, a 10px y con su flecha; debajo si no cabe arriba, y sin salirse de la ventana por los lados. Dice solo «Copiado», sin repetir lo copiado, que podría ser largo. Si el portapapeles falla, «No se pudo copiar: selecciónalo a mano». Se va sola a los 1,5 s o al desplazar la página.

**Accesibilidad.** Es un `role="status"` que está siempre en la página y solo cambia de texto, que es lo que los lectores de pantalla anuncian, sin mover el foco. No recibe clics ni foco.

**Detalles.** Si hay varios montados, avisa solo el primero. `CodeSnippet` no lo usa: conserva su ✓ y su «Copiado».
