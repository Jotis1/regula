---

name: InlineCTA
description: "Tarjeta de invitación dentro de una página para animar a una acción secundaria (conectar algo, mejorar algo)."
interactive: false
astroNote: "Descartarla con `onClick` necesita una función: envuélvela en un `.tsx` y úsala como isla `client:load`."
---

**Props.** `title`, `description`, `actions`, `icon` o `image` (+ `imageAlt`). Tarjeta `radius-xl` con borde y `shadow-xs`.

**Reglas.** Una por pantalla como mucho, siempre descartable ("Ahora no"). Si bloquea el trabajo, no es un CTA: es un `Alert`.

**Detalles.** Funciona sin JavaScript. El título es un `<h3>` (en la guía era un bloque sin nivel de encabezado). La imagen va a la izquierda con 240px de ancho; sin `imageAlt` se trata como decorativa.
