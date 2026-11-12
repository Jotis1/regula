---

name: FileUpload
description: "Zona para subir archivos con clic o arrastrando, y lista de archivos con su progreso."
interactive: true
astroNote: "`onFiles` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `accept`, `multiple`, `hint` (formatos y tamaño máximo), `onFiles(files)`, `files` [{`name`, `size` (bytes), `progress` 0–100, `status` (`complete` · `error`), `error`, `icon`}], `onRemove(index)`, `disabled`, `progressStyle` (`bar` · `fill`), `fileIcon(file)`.

**Progreso e iconos.** Los del Figma (`File upload`, `1175:101149`). `progressStyle="fill"` llena el fondo del archivo hasta su porcentaje (`bg-secondary`) y pone el porcentaje junto al tamaño, sin barra; el relleno es la barra de progreso para lectores de pantalla. El icono de cada archivo puede ser el de su tipo: `icon` en el archivo o `fileIcon(file)` para todos, con `FileIcon` de `@untitledui/file-icons` (`<FileIcon type="pdf" />`, `<FileIcon type="mp4" />`…). El paquete no los importa. Con error se sigue pintando el aviso.

**Visual.** Zona `bg-primary` con borde `border-secondary` y `radius-xl`; al arrastrar o en hover, borde de 2px `border-brand`. Cada archivo en tarjeta con icono, nombre, tamaño y `ProgressBar`; completado en `text-success-primary` con icono; error con borde `border-error_subtle` y mensaje.

**Reglas.** Di siempre qué formatos se aceptan antes de que el usuario lo intente. El componente no sube nada: tú gestionas la subida y le pasas el progreso.

**Textos.** Todos se pueden cambiar con `labels` (objeto parcial).

**Diferencia con la vista previa de la guía.** Los tamaños salen con un decimal, como el resto de cifras de la librería: "12,5 KB" donde la guía redondea a "13 KB".
