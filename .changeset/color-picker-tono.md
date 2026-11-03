---

"@jotis-me/react": patch
---

`ColorPicker`: la barra de tono tiene nombre propio («Tono», cambiable con `hueLabel`). Antes, en el HTML de servidor, su `aria-labelledby` apuntaba a una etiqueta que no existía hasta hidratar.
