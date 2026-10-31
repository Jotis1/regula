---

name: Alert
description: "Aviso en la página sobre algo que afecta a lo que el usuario está viendo."
interactive: false
astroNote: "Con `onClose` o acciones que hacen algo necesita funciones: envuélvelo en un `.tsx` y úsalo como isla `client:load`."
---

**Props.** `color` (`gray` · `brand` · `success` · `warning` · `error`), `title`, `description`, `actions` (botones `link-gray` + `link-color`), `onClose`, `icon`, `variant` (`floating` · `full` a todo el ancho).

**Visual.** `bg-primary_alt`, borde `border-primary`, `radius-xl`, `shadow-xs`, icono `FeaturedIcon` outline. El color va solo en el icono: el texto sigue en `text-secondary` / `text-tertiary`.

**Accesibilidad.** Los errores se anuncian al momento (`role="alert"`); el resto, sin interrumpir (`role="status"`). El icono cambia con el color, así que el estado no depende solo del color. La X se llama "Descartar" (se cambia con `closeLabel`).

**Detalles.** Sin `icon`, cada color trae el suyo: `info-circle` (gris y marca), `check-circle`, `alert-triangle` y `alert-circle`.
