---

name: AvatarProfilePhoto
description: "Foto de perfil grande, con filo blanco y sombra, para cabeceras de perfil y de cuenta."
interactive: false
---

**Props.** `src` (foto), `alt` (nombre de la persona), `initials`, `size` (`sm` 72 · `md` 96, por defecto · `lg` 160), `verified` (sello azul de verificado) y `verifiedLabel`.

**Visual.** La del Figma (`Avatar profile photo`, `1217:108477`): un aro `bg-primary` con filo `border-secondary_alt` y, dentro, el círculo con la foto, las iniciales en Bricolage Grotesque (`display-xs`, `display-md` y `display-xl` según el tamaño) sobre `bg-tertiary` o el icono de usuario, con la sombra `shadow-2xl`. El sello es el mismo de `Avatar`.

**Uso.** Encima o al lado del nombre en una cabecera de perfil (con `PageHeader` `avatar`), en la página de cuenta o en una ficha de equipo. Para listas y menús, `Avatar` o `AvatarLabel`.

**Accesibilidad.** Con foto, `alt` es su texto alternativo. Con iniciales y `alt`, el conjunto es una imagen con ese nombre (y «Verificado» si lleva el sello). Sin `alt`, es decorativa; el sello se anuncia aparte. Funciona sin JavaScript.
