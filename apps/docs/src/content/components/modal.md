---

name: Modal
description: "Diálogo sobre la página para confirmar o completar una tarea corta sin salir de ella."
interactive: true
astroNote: "`onClose` es una función y abrirlo necesita estado: envuélvelo en un `.tsx` con el botón que lo abre y úsalo con `client:load`."
---

**Props.** `title`, `description`, `icon` (+ `color`, `iconVariant`), `actions` (normalmente `Button` secundario + primario), `children` (formulario), `onClose`, `layout` (`stacked` · `horizontal`), `destructive`, `width`, `contained` (posiciona dentro del padre, para demos).

**Visual.** Ancho `width-sm` (480px), `radius-2xl`, `shadow-xl`, padding `spacing-3xl`. Fondo de página `bg-overlay` al 70% con `backdrop-blur-lg`. En apilado los botones ocupan el ancho a partes iguales; en horizontal se alinean a la derecha.

**Reglas.** Un modal, una decisión. El botón de confirmar repite el verbo del título ("Eliminar", no "Aceptar").

**Una acción principal por modal.** Solo un `Button` primario en `actions`: el que confirma la decisión del título. El resto, secundarios (Cancelar) o `link`. Si un modal necesita dos acciones principales, son dos decisiones y van en dos pasos.

**Accesibilidad.** Sobre la página, el foco entra en el modal y no sale de él con Tab; Escape, la X o un clic fuera lo cierran y el foco vuelve al botón que lo abrió. La página de debajo no se desplaza. El diálogo se llama como su título y se describe con `description`.

**Sin `onClose`.** No hay X y ni Escape ni el clic fuera lo cierran: úsalo solo cuando el usuario tenga que decidir sí o sí.

**Detalles.** `open` vale `true` por defecto; con `open={false}` no se pinta nada. `destructive` pone el icono en `error`; el botón rojo lo pones tú en `actions`. `contained` lo pinta dentro de su contenedor (con posición relativa) sin atrapar el foco, como en esta página.
