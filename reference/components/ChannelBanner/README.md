Banner de perfil de 1200×480 con el nombre del canal, una frase y el horario de directos.

**Props.** `name`, `tagline`, `eyebrow` ("Directos en Twitch" por defecto), `schedule` (`{ day, time }`), `scale`.

**Cuándo usarlo.** Como imagen de cabecera del canal. Sin `scale` se ajusta al ancho disponible; con `scale={1}` mide 1200×480 y se puede exportar tal cual. Twitch recorta el banner en móvil y tapa parte con el avatar: el contenido deja 120px de margen a cada lado y el horario va en la derecha, dentro de esa zona segura.

**Evita.** Poner texto pegado a los bordes. Un horario de más de cuatro filas. Para la imagen de canal sin directo (1920×1080) usa `StreamScene` con `variant="offline"`.
