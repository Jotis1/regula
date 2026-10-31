---

name: SidebarNav
description: "Navegación lateral de 296px de las apps de la suite: marca, búsqueda, secciones, ajustes y ficha del usuario."
interactive: false
astroNote: "Funciona sin directiva (los ítems son enlaces). `onLogout` es una función: si la usas, envuélvelo en un `.tsx` y úsalo con `client:load`."
---

**Props.** `brand` (texto o nodo), `search`, `items` [{`icon`, `label`, `href`, `active`, `badge`}], `footerItems`, `user` (props de `AvatarLabel`).

**Visual.** Ítems `text-md-semibold` en `text-secondary`, icono 24px `fg-quaternary`; activo `bg-secondary_hover`. Fondo `bg-primary` y línea derecha `border-secondary`.

**Accesibilidad.** Es un `<nav>` llamado "Principal"; el ítem `active` lleva `aria-current="page"`. Un ítem sin `href` se pinta como texto, no como enlace a `#`.

**Ampliaciones sobre la guía.** `onLogout` se llama al pulsar el botón de cerrar sesión de la ficha del usuario (en la guía no hacía nada) y `labels` cambia "Principal", "Buscar" y "Cerrar sesión".
