---

name: TextEditor
description: "Editor de texto enriquecido sencillo: negrita, cursiva, subrayado, listas, enlaces y alineación."
interactive: true
astroNote: "`onChange` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `label`, `defaultValue` (HTML), `onChange(html)`, `placeholder`, `maxLength` (muestra los caracteres restantes) o `hint`, `minHeight`, `disabled`.

**Visual.** Barra de botones de 32px con `text-editor-icon-fg` (activos `text-editor-icon-fg_active` sobre `bg-primary_hover`); área `radius-xl`, borde `border-primary`, foco `border-brand`.

**Límites.** Usa el modo de edición nativo del navegador: vale para notas y descripciones. Para documentos largos o Markdown, mejor un editor dedicado. Limpia el HTML antes de guardarlo.

**Recuento.** `maxLength` muestra "421 caracteres restantes", contando los saltos entre párrafos y elementos de lista, pero no corta el texto.

**Accesibilidad.** El área es un `contentEditable` con `role="textbox"`; la etiqueta la nombra con `aria-labelledby` porque un área editable no admite `<label for>`. Los botones de formato llevan `aria-pressed`.
