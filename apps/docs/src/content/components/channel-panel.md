---

name: ChannelPanel
description: "Panel de 320px para la página del canal de Twitch, con título, texto, filas de datos y una acción opcional."
interactive: false
astroNote: "Con `action.onClick` necesita una función: envuélvelo en un `.tsx` y úsalo como isla `client:load`. Con `action.href`, no."
---

**Props.** `title`, `icon` (un icono de `@untitledui/icons`, o un nodo), `children` (párrafos), `rows` (`{ label, value }`, para horario, normas cortas o enlaces), `action` (`{ label, href, icon?, hierarchy?, onClick? }`), `width`.

**Cuándo usarlo.** En "Sobre el canal", horario, normas y enlaces. Twitch pide 320px de ancho: exporta cada panel como imagen PNG a 640px de ancho (2x) para que se vea nítido en pantallas densas. El título va en Bricolage Grotesque semibold (24/32); el resto, en Geist. La acción es un `Button` secundario a todo el ancho.

**Evita.** Más de una acción por panel. Párrafos de más de cuatro líneas: nadie lee un panel largo, y menos con el directo de fondo.

**Ampliaciones sobre la guía.** `action.onClick`, para una acción sin `href` (en la guía ese botón no hacía nada).

**Accesibilidad.** Es una sección con nombre (el título, en `<h3>`); las filas son una lista de definiciones (`<dl>`) con la cifra tabular a la derecha.
