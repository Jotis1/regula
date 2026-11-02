Píldora de estado del canal: en directo, reemisión o sin directo, con espectadores, tiempo en emisión y categoría.

**Props.** `status` (`live`, `offline`, `rerun`), `viewers`, `uptime` (texto, por ejemplo `2:14:05`), `category`.

**Cuándo usarla.** En la cabecera del overlay o en una página propia del canal. El punto lleva el color del estado (`fg-success-secondary`, `fg-warning-secondary`, `fg-quaternary`) y siempre va con la palabra. Espectadores y tiempo solo aparecen en `live`. No se usa rojo para "en directo": en el sistema el rojo es error.

**Evita.** Enseñar la cifra de espectadores si no quieres exponerla: quita `viewers`.
