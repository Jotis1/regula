Lista de los últimos eventos del canal (seguidores, subs, raids, bits, donaciones) con icono, usuario, detalle y hora relativa.

**Props.** `items` (`{ type, user, amount?, months?, detail?, time? }`), `max` (5 por defecto), `title` ("Últimos eventos"), `width` (360), `animate`.

**Cuándo usarla.** En un lateral del overlay, como memoria de lo que acaba de pasar mientras las alertas ya se han ido. Los siete tipos de evento comparten icono y etiqueta con `StreamAlert`. El detalle se genera solo (por ejemplo, "Donación · 5,00 €", "Raid entrante · 1.284"); `detail` lo sustituye. Con `animate`, solo entra la primera fila.

**Evita.** Más de siete filas: es una lista de un vistazo, no un historial. Poner la hora absoluta: "hace 2 min" se entiende al instante, "21:43" obliga a calcular.
