---

name: Slideout
description: "Panel lateral derecho para ver o editar el detalle de un elemento sin perder la lista de fondo."
interactive: true
astroNote: "`onClose` es una función y abrirlo necesita estado: envuélvelo en un `.tsx` con el botón que lo abre y úsalo con `client:load`."
---

**Props.** `open`, `title`, `description`, `children`, `actions` (botones del pie, a la derecha), `onClose`, `width` (400 por defecto), `side` (`right` por defecto · `left`: de qué lado sale; el filo con la página pasa al lado contrario) `contained`, `icon` (icono destacado `modern` junto al título) y `footerStart` (a la izquierda del pie: «Guardar filtro», «Código para incrustar»).

**Composiciones.** Los 23 tipos del Figma (`Slide out menu`, `1240:137582`), montados con componentes de Regula y con su código, están en su página de composiciones.

**Visual.** Panel `bg-primary_alt` a toda la altura, `shadow-xl`; cabecera con padding `spacing-3xl` y botón de cerrar; pie con línea `border-secondary`. Fondo `bg-overlay` al 70% con desenfoque, igual que el modal.

**Slideout o Modal.** Si hay que leer o rellenar más de tres campos, o el usuario quiere comparar con la lista, slideout. Para confirmar una decisión, `Modal`.

**Accesibilidad.** Igual que `Modal`: el foco no sale del panel, Escape, la X o un clic fuera lo cierran, el foco vuelve a quien lo abrió y la página no se desplaza debajo. Sin `onClose` no hay X ni se puede descartar.

**Detalles.** El cuerpo se desplaza si el contenido no cabe; cabecera y pie se quedan fijos. `contained` lo pinta dentro de su contenedor sin atrapar el foco, como en esta página.
