---

name: Disclosure
description: "Bloque plegable con título y contenido libre, que se abre y se cierra sin JavaScript."
interactive: false
---

**Props.** `title`, `aside` (un contador, un `Badge`), `defaultOpen`, `size` (`sm` · `md`), `divider`, `className`, contenido en `children`.

**Disclosure o Accordion.** `Accordion` es una lista de preguntas con respuestas de texto. `Disclosure` es un bloque suelto con contenido libre y denso: controles, listas, propiedades. Si lo que quieres es una columna de preguntas frecuentes, usa `Accordion`.

**Cuándo.** Para agrupar lo que no hace falta ver siempre: un grupo de propiedades en un panel lateral, los ajustes avanzados de un formulario, el detalle de una fila. `aside` dice qué hay dentro sin abrirlo («3 props», un `Badge`).

**Visual.** La cabecera mide 40px en `sm` y 48px en `md`. Lleva un chevron de 16px en `text-fg-quaternary` que gira al abrir, el título en `text-sm` semibold `text-primary` y `aside` empujado a la derecha. El contenido va en `text-sm` `text-tertiary`, alineado con el título. Con `divider` (por defecto) lleva una raya inferior `border-secondary`; quítala con `divider={false}` cuando varios `Disclosure` van seguidos dentro de algo que ya tiene filos.

**Accesibilidad.** Es un `<details>` con su `<summary>`: el navegador anuncia el estado abierto o cerrado, se abre con Intro y Espacio y el foco se ve con el anillo de siempre. El chevron es decorativo. Con movimiento reducido, el chevron gira sin transición.

**Detalles.** Funciona sin JavaScript y se pinta en el servidor. `defaultOpen` lo deja abierto al cargar; después lo manda el usuario, no la prop.
