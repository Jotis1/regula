---

name: MessageInput
description: "Caja para escribir y enviar un mensaje, con botón de adjuntar opcional."
interactive: true
astroNote: "`onSend` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `placeholder`, `onSend(texto)`, `onAttach`, `sendLabel`, `disabled`. Enter envía y Mayús+Enter salta de línea. El botón Enviar se desactiva con el campo vacío.

**Detalles.** Envía el texto sin espacios a los lados. Con un método de entrada (IME) a medias, Enter confirma la palabra y no envía. `attachLabel` cambia el nombre accesible del botón de adjuntar.
