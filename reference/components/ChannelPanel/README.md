Panel de 320px para la página del canal de Twitch, con título, texto, filas de datos y una acción opcional.

**Props.** `title`, `icon` (nombre de `Icon`), `children` (párrafos), `rows` (`{ label, value }`, para horario, normas cortas o enlaces), `action` (`{ label, href, icon?, hierarchy? }`), `width`.

**Cuándo usarlo.** En "Sobre el canal", horario, normas y enlaces. Twitch pide 320px de ancho: exporta cada panel como imagen PNG a 640px de ancho (2x) para que se vea nítido en pantallas densas. El título va en Bricolage Grotesque semibold (24/32); el resto, en Geist. La acción es un `Button` secundario a todo el ancho.

**Evita.** Más de una acción por panel. Párrafos de más de cuatro líneas: nadie lee un panel largo, y menos con el directo de fondo.
