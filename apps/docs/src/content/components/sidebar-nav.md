---

name: SidebarNav
description: "Navegación lateral de las apps de la suite: cinco tipos (simple, dos niveles, estrecho y dos de secciones), submenús, tarjetas destacadas, tarjeta de cuenta y diseño adaptable."
interactive: true
astroNote: "Los ítems son enlaces y se pintan sin directiva, pero los submenús, el segundo panel, la tarjeta de cuenta y `responsive` necesitan `client:load`. `onLogout`, `account` y `featured` con funciones: envuélvelo en un `.tsx` con `client:load`."
---

**Props.** `type` (`simple`, `dual-tier`, `slim`, `sections-dividers`, `sections-subheadings`), `brand` (texto o nodo) y `mark` (marca compacta de `slim`), `search`, `items` [{`icon`, `label`, `href`, `active`, `badge`, `shortcut`, `trailing`, `children`, `defaultOpen`}], `sections` [{`title`, `items`}] para los dos tipos de secciones, `footerItems`, `featured` (un nodo), `account` (el `Dropdown` de tarjeta de cuenta: `items`, `accounts`, `onAddAccount`…), `user` (props de `AvatarLabel`), `responsive` y `defaultMenuOpen`.

**Tipos.** Los del Figma (`Sidebar navigation`, `1158:90768`):
- `simple`: una columna de 296 px. Un elemento con `children` se despliega bajo él.
- `dual-tier`: la columna de siempre más un segundo panel de 256 px con el submenú del elemento elegido. Empieza con el de la página actual o el que lleva `defaultOpen`; volver a pulsarlo cierra el panel.
- `slim`: 68 px, solo iconos, cada uno con su nombre en un tooltip; el submenú sale en el segundo panel, con el nombre del elemento como título. La marca es `mark`, y la ficha del usuario queda en el avatar. No lleva buscador ni tarjeta destacada.
- `sections-dividers`: tarjeta redondeada con los grupos de `sections` separados por rayas.
- `sections-subheadings`: igual, con el título de cada grupo en mayúsculas; con `search` el buscador es una lupa junto a la marca.

**Tarjetas destacadas.** `featured` recibe un nodo. `SidebarCards` trae tres plantillas: `Progress` (barra o `variant="circle"`), `Upgrade` (icono, etiqueta, texto y botón principal) y `Notice` (imagen o icono, texto, un hueco libre y botones). Con `Notice` se hacen las otras ocho del Figma (imagen, cookies, referidos, soporte, evento, mensaje, proyectos, prueba gratuita y QR); la vista previa las enseña todas. `onClose` pinta la X; `outline` la pasa a tarjeta blanca con filo.

**Cuenta.** `account` pinta `Dropdown` con `variant="account-card-md"`: la tarjeta con la cuenta elegida, el menú y la lista para cambiar de cuenta. Sin él, `user` pinta la ficha sencilla con cerrar sesión (el `Simple` del Figma).

**Diseño adaptable.** Con `responsive`, por debajo de `lg` se pinta una barra de 56 px con la marca y un botón de menú que abre la navegación a ancho completo (`defaultMenuOpen` la deja abierta); el segundo panel pasa debajo del primero. Sin `responsive`, el ancho es el fijo de siempre.

**Visual.** Ítems `text-md-semibold` en `text-secondary`, icono 24px `fg-quaternary`; activo `bg-secondary_hover`. Fondo `bg-primary` y línea derecha `border-secondary`; los tipos de secciones y `slim` van en tarjeta con filo y `rounded-2xl`.

**Accesibilidad.** Es un `<nav>` llamado "Principal"; el ítem `active` lleva `aria-current="page"`. Un ítem sin `href` se pinta como texto, no como enlace a `#`. Un elemento con `children` es un botón con `aria-expanded` y `aria-controls`: Enter o Espacio lo abren y cierran, y cerrado su submenú no está en el árbol de accesibilidad. En `slim` el nombre de cada icono es texto oculto y además sale en el tooltip al enfocar. Cada grupo de `sections` es una lista con el nombre de su título.

**Diferencias con el Figma.** Las que quedan:
- El menú de la tarjeta de cuenta se abre debajo o encima de ella (lo decide `Dropdown`), no a su derecha.
- El panel de `slim` no lleva la ficha del usuario con correo: en el Figma está en el panel, aquí en el avatar de la columna.
- No hay atajo `⌘K` en el buscador; los atajos (`shortcut`) solo se muestran, no registran nada.
- La imagen de la tarjeta destacada con imagen es un hueco (`media`): el Figma enseña un vídeo.

**Ampliaciones sobre la guía.** `onLogout` se llama al pulsar el botón de cerrar sesión de la ficha del usuario (en la guía no hacía nada) y `labels` cambia "Principal", "Buscar", "Cerrar sesión" y "Abrir menú".
