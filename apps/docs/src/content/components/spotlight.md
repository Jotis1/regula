---

name: Spotlight
description: "Señala una zona con un anillo de marca y una nota breve, por ejemplo tras un cambio."
interactive: true
astroNote: "Envuelve un contenido y se pinta en el servidor: no necesita JavaScript. Para activarlo y desactivarlo con el estado de la página, úsalo en una isla con `client:load`."
---

**Props.** `active` (activa el anillo y la nota), `note` (nodo opcional: lo que quieres decir de la zona), `notePlacement` (`bottom` por defecto · `top` · `left` · `right`: el lado del contenido en el que sale) y `children` (la zona que se señala).

**Cuándo.** Para llamar la atención sobre una zona concreta tras un cambio: un botón que acaba de pasar a gris, un campo nuevo, el resultado de una acción. Una zona a la vez; la nota, una frase corta.

**Evita.** Recorridos de varios pasos y fondos oscurecidos: `Spotlight` no los trae. Tampoco metas en la nota algo imprescindible ni controles: es texto que se anuncia una vez.

**Visual.** Sin `active` pinta solo `children`. Con `active`, un anillo de 2px en `border-brand` a 8px del contenido y con `radius-xl`, y la nota en una burbuja `bg-primary_alt` con `shadow-lg`, a 8px del anillo, de texto `text-xs` semibold. El anillo y la nota entran con un fundido de 150 ms, que se quita con movimiento reducido.

**Accesibilidad.** La nota es texto normal, enlazado al contenido con `aria-describedby`, y lleva `aria-live="polite"`: cuando `active` pasa a verdadero, un lector la anuncia. El anillo es decorativo. El foco y el teclado siguen en el contenido, que no cambia de sitio ni se vuelve a montar al activarlo.

**Detalles.** El contenedor es un bloque que mide lo que mide su contenido (`w-fit`). La nota no ocupa sitio en la página: sale por fuera del contenido, así que deja aire alrededor para que no se corte contra el borde de un contenedor con `overflow: hidden`.
