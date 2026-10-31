Panel lateral derecho para ver o editar el detalle de un elemento sin perder la lista de fondo.

**Props.** `open`, `title`, `description`, `children`, `actions` (botones del pie, a la derecha), `onClose`, `width` (400 por defecto), `contained`.

**Visual.** Panel `bg-primary_alt` a toda la altura, `shadow-xl`; cabecera con padding `spacing-3xl` y botón de cerrar; pie con línea `border-secondary`. Fondo `bg-overlay` al 70% con desenfoque, igual que el modal.

**Slideout o Modal.** Si hay que leer o rellenar más de tres campos, o el usuario quiere comparar con la lista, slideout. Para confirmar una decisión, `Modal`.
