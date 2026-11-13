---

name: InlineCTA
description: "Tarjeta de invitación dentro de una página para animar a una acción secundaria (conectar algo, mejorar algo)."
interactive: true
astroNote: "Descartarla con `onClick` necesita una función: envuélvela en un `.tsx` y úsala como isla `client:load`. El tipo `email` también: guarda lo escrito y avisa con `onSubmit`."
---

**Props.** `title`, `description`, `actions`, `icon` o `image` (+ `imageAlt`), `type`, y los datos de cada tipo: `onSubmit`, `emailLabel`, `emailPlaceholder` y `submitLabel` (`email`), `plan` (`change-plan`), `features` (`upgrade-plan`), `payment` (`payment-method`) y `file` (`receipt`). Tarjeta `radius-xl` con borde y `shadow-xs`.

**Tipos.** Los siete del Figma (`Inline CTA`, `1255:131915`), plantillas sobre las mismas props. Sin `type`, la tarjeta de siempre.
- `image` y `actions`: título, texto y botones, con la imagen a la izquierda o sin ella.
- `email`: el campo de correo con su etiqueta y el botón «Suscribirse»; el botón o Enter avisan con `onSubmit(correo)`.
- `change-plan`: tarjeta interior con el icono, el nombre, el precio y la descripción del plan, y los botones dentro.
- `upgrade-plan`: lista de lo que incluye, cada cosa con su check en verde.
- `payment-method`: la tarjeta con el logo (de `@jotis-me/assets/payments`), «Visa terminada en 1234», la caducidad, el correo y el botón de editar.
- `receipt`: el archivo con su icono (`FileIcon` de `@untitledui/file-icons`), nombre y tamaño, y los botones.

**Estrecha.** Con `type`, la tarjeta se adapta a su propio ancho (container queries): por debajo de 448 px la imagen va arriba y los botones ocupan todo el ancho, con la acción principal arriba, como el Figma en móvil.

**Reglas.** Una por pantalla como mucho, siempre descartable ("Ahora no"). Si bloquea el trabajo, no es un CTA: es un `Alert`.

**Detalles.** Funciona sin JavaScript. El título es un `<h3>` (en la guía era un bloque sin nivel de encabezado). La imagen va a la izquierda con 240px de ancho; sin `imageAlt` se trata como decorativa.
