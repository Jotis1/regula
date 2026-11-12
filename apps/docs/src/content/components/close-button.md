---

name: CloseButton
description: "Botón cuadrado con la X, para cerrar modales, alertas y notificaciones."
interactive: false
astroNote: "Para que cierre algo necesita `onClick`: úsalo dentro del componente interactivo que lo contiene."
---

**Props.** `onClick`, `label` (por defecto "Cerrar"), `size` (`sm` 36px · `md` 40px · `lg` 44px con X de 24), `onDark` (X clara y fondo blanco translúcido al pasar por encima, para fondos de color u oscuros). Icono en `fg-quaternary`, hover `bg-primary_hover`. Se coloca arriba a la derecha a `spacing-xl` del borde.
