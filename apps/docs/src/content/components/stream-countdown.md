---

name: StreamCountdown
description: "Cuenta atrás en formato mm:ss (h:mm:ss si pasa de una hora), con etiqueta opcional debajo."
interactive: true
---

**Props.** `seconds` (duración fija) o `target` (fecha objetivo), `now` (hora fija: congela la cuenta, útil para pruebas), `paused`, `size` (`md`, `lg`, `xl` o un número en px), `label`.

**Cuándo usarla.** Dentro de `StreamScene` o suelta en un overlay. Llega a 00:00 y se queda ahí: lo que pase después (cambiar de escena) es cosa de OBS, no del componente.

**Detalle.** Las cifras van en Geist semibold con `tabular-nums`. Bricolage Grotesque tiene cifras de ancho variable y el contador temblaría cada segundo. Lleva `role="timer"` y `aria-live="off"`, para que un lector de pantalla no lea cada tic.

**Sin fondo.** Como en la guía, la cuenta no tiene fondo propio: va sobre la escena o sobre el vídeo. Sus cifras son las del tema oscuro, así que sobre un fondo claro no se leen; ponla siempre sobre algo oscuro.

**Evita.** Usarla como reloj de la hora actual. Mostrarla sin etiqueta cuando haya dos contadores en pantalla.

**En el paquete.** Es un componente de cliente: cuenta el tiempo. Vuelve a empezar si cambian `seconds`, `target` o `now`. Con `target` y sin `now`, el servidor y el navegador pueden pintar un segundo distinto, y no se avisa de error de hidratación por eso.
