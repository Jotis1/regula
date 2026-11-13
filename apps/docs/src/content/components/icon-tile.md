---

name: IconTile
description: "Baldosa con un icono y su nombre, para elegirlo de una rejilla de iconos."
interactive: true
---

**Props.** `icon` (componente de `@untitledui/icons` o nodo), `label` (el nombre), `selected`, `onSelect`, `href`, `size` (`16` · `20` · `24`), `className`.

**Cuándo.** En una rejilla de iconos donde se elige uno (un selector de iconos, el catálogo de la web). Con `onSelect` es un botón; con `href`, un enlace a la página del icono.

**Evita.** La selección múltiple: la baldosa marca una sola, quien la usa decide cuántas hay elegidas. Tampoco la uses como botón con icono y texto en una barra: para eso está `Button`.

**Visual.** Mide al menos 84px de alto, con `radius-lg`, el icono arriba y el nombre debajo en `text-xs` medium. Lleva un filo de 1px `border-secondary` y, al pasar por encima, `bg-primary_hover`. Elegida, el filo pasa a 2px `border-brand` y el fondo a `bg-brand-primary_alt`: se distingue por el grosor, no solo por el color. El nombre se recorta con puntos suspensivos si no cabe.

**Accesibilidad.** El botón anuncia si está elegido con `aria-pressed`; el enlace elegido, con `aria-current`. El nombre completo es el nombre accesible y va también en `title`, aunque se vea recortado. El icono es decorativo.

**Detalles.** Sin `href` ni `onSelect` es un botón que no hace nada: pasa uno de los dos. `size` cambia solo el tamaño del icono, no el de la baldosa.
