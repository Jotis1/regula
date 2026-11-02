Marco de cámara con el interior vacío, para que OBS ponga la cámara debajo, con etiqueta de nombre y estado.

**Props.** `ratio` (`16:9`, `4:3`, `1:1`), `width`, `live`, `name`, `role` (por ejemplo, pronombres o cargo), `children` (solo para maquetar: en directo no se pasa nada), `style`.

**Cuándo usarlo.** En el overlay de directo, sobre la fuente de vídeo. El marco es un borde de 2px en `border-primary` con `radius-2xl`, sin fondo. La etiqueta va abajo a la izquierda en `bg-primary_alt`; `live` añade el punto verde y la palabra "En directo", nunca solo el color.

**Evita.** Poner fondo al marco: taparía la cámara. Más de una etiqueta por marco. Esquinas distintas de `radius-2xl`, que es la de las tarjetas flotantes del sistema.
