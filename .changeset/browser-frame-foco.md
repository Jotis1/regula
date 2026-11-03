---
"@jotis-me/react": patch
---

`BrowserFrame`: el área de contenido es una región con foco (`tabIndex={0}`, `role="region"` con la dirección como nombre y anillo de foco), para que una pantalla que no cabe se pueda desplazar con el teclado. Antes, a anchos estrechos, axe lo marcaba como región desplazable sin foco.
