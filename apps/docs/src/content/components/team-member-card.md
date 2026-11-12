---

name: TeamMemberCard
description: "Persona del equipo: avatar o foto, nombre, cargo, biografía y redes, en siete tipos."
interactive: false
---

**Props.** `name`, `role`, `bio`, `avatar` (URL, en los `simple-*`), `image` (la foto grande, un nodo con su `alt`), `socials` (enlaces con nombre), `href` y `type` (`simple-left` · `simple-left-top` · `simple-center` · `image-top` · `image-left` · `image-glass-floating` · `image-glass-full-width`).

**Visual.** La del Figma (`_Team member`, `1458:240598`): avatar de 56 con el nombre al lado, encima o centrado; foto cuadrada encima o a la izquierda (desde 512 px de contenedor; por debajo, encima, como el Figma en móvil); o foto 3:4 con el texto en un panel de cristal flotante o a todo el ancho. Nombre `text-md` seminegrita, cargo `text-brand-secondary`, biografía `text-tertiary`, redes en `fg-quaternary`. El cristal es `bg-overlay/60` con desenfoque (más oscuro que el del Figma, para que el texto blanco se lea sobre cualquier foto).

**Uso.** La página de equipo o «Quiénes somos», en rejilla, todas del mismo tipo.

**Accesibilidad.** Un `article` con el nombre en `h3` (enlace con `href`). La foto necesita su `alt`; los iconos de redes, su nombre («X de Ana Martín»).
