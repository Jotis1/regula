Zona para subir archivos con clic o arrastrando, y lista de archivos con su progreso.

**Props.** `accept`, `multiple`, `hint` (formatos y tamaño máximo), `onFiles(files)`, `files` [{`name`, `size` (bytes), `progress` 0–100, `status` (`complete` · `error`), `error`}], `onRemove(index)`, `disabled`.

**Visual.** Zona `bg-primary` con borde `border-secondary` y `radius-xl`; al arrastrar o en hover, borde de 2px `border-brand`. Cada archivo en tarjeta con icono, nombre, tamaño y `ProgressBar`; completado en `text-success-primary` con icono; error con borde `border-error_subtle` y mensaje.

**Reglas.** Di siempre qué formatos se aceptan antes de que el usuario lo intente. El componente no sube nada: tú gestionas la subida y le pasas el progreso.
