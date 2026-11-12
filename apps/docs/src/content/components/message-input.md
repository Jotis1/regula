---

name: MessageInput
description: "Caja para escribir y enviar un mensaje: la de siempre, la mínima de una línea, con área de texto o la avanzada con barra."
interactive: true
astroNote: "`onSend` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `placeholder`, `onSend(texto)`, `onAttach`, `sendLabel`, `disabled`, `variant`, `onVoice`, `onEmoji`, `onShortcuts`, `toolbar`, `labels`.

**Variantes.** Las del Figma (`Message action`, `9206:602532`): `minimal` (una línea con el botón de enviar al lado), `textarea` (micrófono arriba; adjuntar, emoji y «Enviar» abajo) y `advanced` (micrófono y una barra con `toolbar` a la izquierda, como el selector de persona, y «Atajos» y «Adjuntar» a la derecha). Cada botón sale solo si pasas su función. Enter envía y Mayús+Enter salta de línea. El botón Enviar se desactiva con el campo vacío.

**Detalles.** Envía el texto sin espacios a los lados. Con un método de entrada (IME) a medias, Enter confirma la palabra y no envía. `attachLabel` cambia el nombre accesible del botón de adjuntar.
