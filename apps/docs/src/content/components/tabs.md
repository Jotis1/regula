---

name: Tabs
description: "Pestañas para cambiar entre vistas hermanas dentro de una página."
interactive: true
astroNote: "`onChange` y `children` son funciones y no cruzan de Astro a una isla: envuelve `Tabs` en un `.tsx` y úsalo con `client:load`."
---

**Props.** `items` [{`id`, `label`, `count`?}], `value` / `defaultValue`, `onChange(id)`, `type` (`underline` · `button-brand` · `button-gray` · `button-border` · `button-minimal` · `line`), `size` (`sm` · `md`), `fullWidth` (las pestañas se reparten todo el ancho, solo en horizontal), `orientation` (`horizontal` · `vertical`) y `aria-label`.

**Cuál.** `underline` para secciones de página (es la de por defecto); `button-border` como control segmentado dentro de una tarjeta; `button-brand` cuando la navegación es la protagonista; `button-minimal` es un segmentado sin borde, con la actual sobre `bg-primary` y `shadow-sm`; `line` pone una raya de 2px en `fg-brand-primary` a la izquierda de la actual, y solo tiene sentido en vertical (en horizontal se pinta como `underline`, y `underline` en vertical, como `line`).

**Vertical.** Con `orientation="vertical"` las pestañas se apilan (`aria-orientation="vertical"`, ↑ y ↓ cambian de pestaña) y, con `children`, el panel queda a la derecha. Por debajo de `lg` (1024px) la lista se oculta y en su lugar sale un `Select` del paquete con las mismas opciones (el contador va como texto de apoyo), enlazado al mismo estado: elegir una cambia el panel y avisa con `onChange`. Las dos versiones van en el HTML y la CSS elige, así que no hay salto al cargar; la que está oculta con `display: none` no cuenta para los lectores.

**Teclado.** Solo la pestaña activa entra en el orden de Tab; las flechas, Inicio y Fin cambian de pestaña. En `underline`, la pestaña activa con foco de teclado lleva el subrayado y además el anillo de foco (en la guía el subrayado lo tapaba).

**Panel (ampliación sobre la guía).** Con `children` (una función que recibe el `id` activo), el componente pinta el contenido en un `tabpanel` enlazado a su pestaña, y en Astro sin directiva el HTML ya trae el panel activo. Sin `children`, `Tabs` es solo la lista y el contenido lo pintas tú; en ese caso las pestañas no llevan `aria-controls`, porque apuntaría a un panel que no existe.

**Detalles.** El tamaño por defecto es `sm` (36px); `md` mide 44px.
