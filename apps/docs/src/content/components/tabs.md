---

name: Tabs
description: "Pestañas para cambiar entre vistas hermanas dentro de una página."
interactive: true
astroNote: "`onChange` y `children` son funciones y no cruzan de Astro a una isla: envuelve `Tabs` en un `.tsx` y úsalo con `client:load`."
---

**Props.** `items` [{`id`, `label`, `count`?}], `value` / `defaultValue`, `onChange(id)`, `type` (`underline` · `button-brand` · `button-gray` · `button-border`), `size` (`sm` · `md`).

**Cuál.** `underline` para secciones de página (es la de por defecto); `button-border` como control segmentado dentro de una tarjeta; `button-brand` cuando la navegación es la protagonista.

**Teclado.** Solo la pestaña activa entra en el orden de Tab; las flechas, Inicio y Fin cambian de pestaña. En `underline`, la pestaña activa con foco de teclado lleva el subrayado y además el anillo de foco (en la guía el subrayado lo tapaba).

**Panel (ampliación sobre la guía).** Con `children` (una función que recibe el `id` activo), el componente pinta el contenido en un `tabpanel` enlazado a su pestaña, y en Astro sin directiva el HTML ya trae el panel activo. Sin `children`, `Tabs` es solo la lista y el contenido lo pintas tú; en ese caso las pestañas no llevan `aria-controls`, porque apuntaría a un panel que no existe.

**Detalles.** El tamaño por defecto es `sm` (36px); `md` mide 44px.
