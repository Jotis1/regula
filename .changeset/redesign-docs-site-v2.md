---
"@jotis-me/react": minor
---

- `CopyTooltip`: prop `onCopyError`. Con ella, cuando una copia falla el componente no pinta su burbuja y avisa a quien la pasa, para dar el aviso con una `Notification` de error que no se cierre sola.
- `CodeSnippet`: si el navegador no deja copiar, el botón ya no confirma «Copiado»: avisa del fallo al `CopyTooltip` de la página.
- `Carousel` con `type="strip"`: la tira se puede enfocar con el teclado para desplazarla.
