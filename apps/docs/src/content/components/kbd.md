---

name: Kbd
description: "Tecla o atajo de teclado: el de una opción de menú o la pista de un campo de búsqueda."
interactive: false
---

**Props.** `variant` (`menu` · `field`), `className`, texto de la tecla en `children` («⌘K», «Ctrl K», «Esc»).

**Cuándo.** `menu` va a la derecha de una opción de menú o de un comando para decir su atajo («⌘P»). `field` va dentro de un campo o botón de búsqueda y dice qué tecla lo abre («Ctrl K»).

**Visual.** Los dos llevan texto de 12px (`text-xs`) medium en `text-quaternary`, `radius-sm` y un filo de 1px `border-secondary`. `menu` va en Geist, sin fondo y con 4px a los lados. `field` mide 22px de alto, lleva fondo `bg-secondary`, va en Geist Mono y deja 6px a los lados.

**Accesibilidad.** Es un `<kbd>`: un lector de pantalla lo lee como el texto de la tecla. Si el atajo es la única forma de llegar a una acción, tiene que haber también un botón o un enlace visible.

**Detalles.** Solo se muestra: el atajo de verdad lo registra la app. Dropdown y CommandMenu lo usan por dentro con `menu` para los atajos de sus opciones.
