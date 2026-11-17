---

name: TextEditor
description: "Editor de texto enriquecido sencillo: negrita, cursiva, subrayado, color, listas, enlaces, imágenes y alineación, con barra simple, avanzada o flotante."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `label`, `defaultValue` (HTML), `onChange(html)`, `placeholder`, `maxLength` (muestra los caracteres restantes) o `hint`, `minHeight`, `disabled`, `toolbar`, `size` y `onGenerate`.

**Barras (`toolbar`).** Sin la prop, la barra de siempre (negrita, cursiva, subrayado, lista, enlace y las tres alineaciones). Con ella, la del Figma:
- `simple`: negrita, cursiva, subrayado, color del texto, alinear a la izquierda, centrar y lista.
- `advanced`: lo anterior más los selectores de tipo y tamaño de letra, enlace, imagen y, si pasas `onGenerate`, el botón de generar (sin la función no se pinta: un botón sin acción no sirve).
- `floating`: sin barra sobre el área; al seleccionar texto sale una tarjeta sobre la selección con los botones de `simple` en `sm` y de `advanced` (sin selectores) en `md`. Escape la cierra y devuelve el foco al área.

**Tamaño (`size`).** `md` (por defecto): área de `radius-xl`, 20px de relleno y texto de 16px. `sm`: `radius-md`, 16px y 14px.

**Visual.** Barra de botones de 32px con `text-editor-icon-fg` (activos `text-editor-icon-fg_active` sobre `bg-primary_hover`); área `radius-xl`, borde `border-primary`, foco `border-brand`.

**Límites.** Usa el modo de edición nativo del navegador: vale para notas y descripciones. Para documentos largos o Markdown, mejor un editor dedicado. Limpia el HTML antes de guardarlo.

**Recuento.** `maxLength` muestra "421 caracteres restantes", contando los saltos entre párrafos y elementos de lista, pero no corta el texto.

**Tooltips.** Con `toolbar`, cada botón lleva un `Tooltip` con su nombre (sin él, el `title` nativo de siempre). Los atajos del navegador (negrita, cursiva, subrayado) funcionan en el área, pero el tooltip no los escribe porque cambian con el sistema.

**Color.** El botón de color abre una lista de 16 muestras y un campo «Personalizado» (hex de 6 cifras y Enter). Se aplica a la selección con estilos en línea.

**Accesibilidad.** El área es un `contentEditable` con `role="textbox"`; la etiqueta la nombra con `aria-labelledby` porque un área editable no admite `<label for>`. Los botones de formato llevan `aria-pressed`.
