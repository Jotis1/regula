Icono de una app de la suite: baldosa con las dos primeras letras del nombre (mayúscula + minúscula) y una virgulilla debajo, en el tono de la app (guiño al castellano). Misma construcción para todas, como una familia; solo cambia el color.

**Props.** `app` (`ornatus` · `vinculum` · `pecunia` · `emptor` · `regula`), o para una app nueva `letters` (dos letras) + `hue` (tono de la paleta Tailwind); `variant` (`default` · `solid` · `light` · `mono`), `size` (px, 48 por defecto), `shape` (`rounded` · `square` para maskable), `tilde` (forzar o quitar la virgulilla), `label` (nombre accesible; por defecto el de la app).

**Variantes.** `default`: fondo `{tono}-950`, mayúscula `{tono}-300`, minúscula y virgulilla `{tono}-500`. `solid`: fondo `{tono}-600`, letras blancas, sin virgulilla. `light`: fondo `{tono}-50`, borde de 1px `{tono}-200`, letras `{tono}-800` / `{tono}-600`. `mono`: fondo `neutral-950`, blanco y `neutral-400`. Por debajo de 20px, si no pasas `variant`, sale `solid`; la virgulilla solo se dibuja desde 32px.

**Construcción.** Esquina inferior izquierda casi recta, las otras tres con radio del 22,5 % del lado. Bricolage Grotesque 600 (tamaño óptico 14) al 47 % del lado, tracking −3 %, centrada por su caja de avance. Virgulilla simétrica de tamaño fijo (40/128 de largo), igual en todas las apps. El componente dibuja las letras en curvas, así que no depende de que la fuente esté cargada.

**No.** Nada de degradados, sombras, contornos en las letras, tres letras ni pictogramas dentro. Ni cambiar la forma de la virgulilla. El tono de la app no sale del icono: la interfaz sigue en `brand`.
