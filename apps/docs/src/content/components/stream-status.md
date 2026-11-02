---

name: StreamStatus
description: "Píldora de estado del canal: en directo, reemisión o sin directo, con espectadores, tiempo en emisión y categoría."
interactive: false
---

**Props.** `status` (`live`, `offline`, `rerun`), `viewers`, `uptime` (texto, por ejemplo `2:14:05`), `category`, `labels`.

**Cuándo usarla.** En la cabecera del overlay o en una página propia del canal. El punto lleva el color del estado (`fg-success-secondary`, `fg-warning-secondary`, `fg-quaternary`) y siempre va con la palabra. Espectadores y tiempo solo aparecen en `live`. No se usa rojo para "en directo": en el sistema el rojo es error.

**Evita.** Enseñar la cifra de espectadores si no quieres exponerla: quita `viewers`.

**Ampliaciones sobre la guía.** `labels` sustituye sus textos: `live`, `rerun`, `offline` y los que solo oyen los lectores de pantalla, `viewers` ("espectadores") y `uptime` ("en emisión").

**Accesibilidad.** Es una región de estado. Las cifras van con números tabulares, y un lector oye "1.284 espectadores" y "2:14:05 en emisión", no solo los números.
