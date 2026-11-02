Cuenta atrás en formato mm:ss (h:mm:ss si pasa de una hora), con etiqueta opcional debajo.

**Props.** `seconds` (duración fija) o `target` (fecha objetivo), `now` (hora fija: congela la cuenta, útil para pruebas), `paused`, `size` (`md`, `lg`, `xl` o un número en px), `label`.

**Cuándo usarla.** Dentro de `StreamScene` o suelta en un overlay. Llega a 00:00 y se queda ahí: lo que pase después (cambiar de escena) es cosa de OBS, no del componente.

**Detalle.** Las cifras van en Geist semibold con `tabular-nums`. Bricolage Grotesque tiene cifras de ancho variable y el contador temblaría cada segundo. Lleva `role="timer"` y `aria-live="off"`, para que un lector de pantalla no lea cada tic.

**Evita.** Usarla como reloj de la hora actual. Mostrarla sin etiqueta cuando haya dos contadores en pantalla.
