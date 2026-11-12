---

name: Avatar
description: "Foto o iniciales de una persona en círculo, de 24 a 64px."
interactive: false
---

**Props.** `src` + `alt`, o `initials`; sin ninguno muestra el icono de usuario. `size` (`xs` 24 · `sm` 32 · `md` 40 · `lg` 48 · `xl` 56 · `2xl` 64), `status` (`online` · `offline`), `ring` (anillo `bg-primary` para apilar), `badge` (`verified` · `count` con `count` · `company` con `company`) y `badgeLabel`.

**Notas.** El fondo de iniciales es `avatar-styles-bg-neutral` con texto `bg-secondary-solid` (#525252, fijo en ambos temas porque el fondo también lo es); borde interior de 0,5px al 16% negro para que la foto no se funda con el fondo.

**Insignias.** Van en la esquina, en el sitio del punto de estado (si pasas `status` y `badge`, se pinta la insignia), y miden de 10 a 20px según el tamaño, sobresaliendo 2px, como el Figma. `verified` es el sello `utility-blue-500` con tick; `count` escribe el número en blanco sobre `fg-error-secondary` (desde 100, «99+»); `company` recibe la URL de una imagen o un nodo, como un logo de `@jotis-me/assets/logos`. Cada una se anuncia a los lectores: «Verificado», «8 notificaciones» o lo que diga `badgeLabel` (el logo sin `badgeLabel` es decorativo). En `xs` el número del contador mide 6px: úsalo desde `sm` si tiene que leerse.
