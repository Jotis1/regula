---

name: Select
description: "Desplegable con el aspecto de `Input` y una lista bajo el campo, con apoyo, icono, avatar o punto por opción, para elegir una de una lista corta."
interactive: true
astroNote: "Abrir la lista y elegir necesitan JavaScript: úsalo en una isla con `client:load`. `onChange` es una función, así que envuélvelo en un `.tsx`."
---

**Cuándo usarlo.** Elegir una opción de una lista corta y conocida (hasta ~12): categoría, responsable, estado. Para varias opciones o con búsqueda, `MultiSelect`.

**Props.** `label`, `required`, `hint`, `error` (como `Input`), `options`, `placeholder`, `value` / `defaultValue` (`string`), `onChange(value)`, `size` (`sm` 36px · `md` 40 · `lg` 44), `icon`, `disabled`, `name` (el valor viaja en el formulario), `defaultOpen` (abierto de inicio, para vistas previas). Cada opción es un `string` o `{ value, label, supporting?, icon?, avatar?, dot?, disabled? }`: `supporting` es el texto de apoyo («@olivia»), `icon` un icono de 20px, `avatar` (`src`, o sin nada para el icono de usuario) un avatar `xs`; con `initials` los lectores de pantalla leen las iniciales antes del nombre, así que mejor una foto y `dot` un punto de color (`gray`, `brand`, `error`, `warning`, `success`).

**Cambia `onChange`.** Antes recibía el evento del `<select>` nativo; ahora recibe el valor elegido (`onChange={(valor) => …}`). Quien leía `event.target.value` debe pasar a leer el argumento.

**Comportamiento.** El campo es un botón con el marco de `Input`: enseña la opción elegida con su icono, avatar o punto y su apoyo en `text-tertiary`, y un chevron a la derecha. Sin `placeholder` parte con la primera opción elegida. Al abrirlo sale la lista bajo el campo, del ancho del campo, con `radius-lg`, `shadow-lg` y filo `border-secondary_alt`; la opción bajo el ratón o el teclado va en `bg-primary_hover`, la elegida lleva un check de 20px en `fg-brand-primary`, y si hay más opciones de las que caben, la lista se desplaza. Ya no es el menú nativo del sistema: se pierde el selector del móvil y se gana el mismo menú en todos los navegadores. El valor viaja en el formulario con `name` (React Aria pinta un `<select>` oculto).

**Teclado.** Enter, Espacio o flecha abajo abren la lista; las flechas recorren las opciones, escribir una letra salta a la que empieza por ella, Enter elige y cierra devolviendo el foco al campo, y Escape cierra sin cambiar nada.

**Estados.** Los del marco de `Input`; abierto o con foco, borde de 2px `border-brand` (`border-error` con error), sin anillo exterior. Deshabilitado al 50%. Una opción `disabled` se ve al 50% y no se puede elegir.

**Dentro de `Input`.** `leadingSelect` y `trailingSelect` usan esta misma lista, sin marco propio.
