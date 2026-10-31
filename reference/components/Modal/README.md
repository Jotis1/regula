Diálogo sobre la página para confirmar o completar una tarea corta sin salir de ella.

**Props.** `title`, `description`, `icon` (+ `color`, `iconVariant`), `actions` (normalmente `Button` secundario + primario), `children` (formulario), `onClose`, `layout` (`stacked` · `horizontal`), `destructive`, `width`, `contained` (posiciona dentro del padre, para demos).

**Visual.** Ancho `width-sm` (480px), `radius-2xl`, `shadow-xl`, padding `spacing-3xl`. Fondo de página `bg-overlay` al 70% con `backdrop-blur-lg`. En apilado los botones ocupan el ancho a partes iguales; en horizontal se alinean a la derecha.

**Reglas.** Un modal, una decisión. El botón de confirmar repite el verbo del título ("Eliminar", no "Aceptar").
