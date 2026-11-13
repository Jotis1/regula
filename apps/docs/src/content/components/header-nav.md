---

name: HeaderNav
description: "Cabecera de una app con marca, secciones, acciones y cuenta, en cinco tipos, con su menú móvil."
interactive: true
astroNote: "El menú móvil necesita JavaScript: úsalo en una isla con `client:load`. La marca, las acciones y la cuenta son nodos React, así que va en un `.tsx`."
---

**Cuándo usarlo.** La cabecera superior de una app o de una web con varias secciones. Para una navegación lateral de una app densa, `SidebarNav`.

**Props.** `type` (`simple` · `dual-tier` · `tabs` · `centered` · `underline`), `brand`, `items` (`{ label, href, current?, badge?, icon?, children? }[]`; `children` son las subsecciones), `search` (el buscador), `actions` (botones e iconos de la derecha), `account` (lo de la esquina: un `Dropdown` con la cuenta, un botón de entrar…), `mobile` (`{ footerItems?, footer? }`: los enlaces de pie y la última pieza del panel móvil), `mobileBar` (lo de la derecha de la fila móvil: si se da, sustituye al botón de menú y al panel integrados), `fullWidth` (el contenido a todo el ancho), `labels` (`nav`, `subnav`, `openMenu`) y `className`.

**Tipos.** `simple`: una fila de 64px con la marca, las secciones, las acciones y la cuenta. `dual-tier`: una segunda fila de 64px con las subsecciones de la sección actual y, a la derecha, el buscador. `tabs`: una segunda fila de 44px con las subsecciones como pestañas, con la actual subrayada en `fg-brand-primary_alt`. `centered`: la marca a la izquierda, las secciones al centro y las acciones a la derecha, con la segunda fila centrada. `underline`: una fila de 64px como `simple`, pero las secciones van en `text-tertiary` de `text-sm`, con la actual en `text-primary` y subrayada 2px en `fg-brand-primary_alt`, sin subsecciones: la cabecera de una web de documentación.

**Visual.** Fondo `bg-primary` con un filo inferior `border-secondary`, contenido a 1280px como máximo con 32px a los lados. Los enlaces son de `text-md` semibold en `text-secondary`, con `bg-primary_hover` al pasar el ratón y para la sección actual; las subsecciones, de `text-sm`. Las pestañas de `tabs` van en `text-quaternary` y la actual en `text-brand-secondary`.

**Ancho completo.** Con `fullWidth`, las dos filas de escritorio ocupan todo el ancho con los 32px de relleno de siempre, en lugar de centrarse en 1280px; el panel móvil no cambia. Úsalo con `fullWidth` cuando la marca deba alinearse con una navegación lateral.

**Escritorio y móvil.** Las dos versiones van en el HTML y la CSS elige por el ancho de la propia cabecera, con una consulta de contenedor de 1024px: a pantalla completa es el `lg` de la página y, dentro de una caja más estrecha, la cabecera ya se pinta en móvil. Por debajo de 1024px hay una fila con la marca y un botón de menú que abre un panel de 296px desde la izquierda (un `Slideout` con `side="left"`): arriba el buscador, después las secciones con icono, y pegados abajo los enlaces de `mobile.footerItems` y `mobile.footer`. Las secciones con subsecciones son botones con `aria-expanded` que despliegan su lista (la actual parte desplegada); elegir un enlace cierra el panel.

**Segunda fila.** En `dual-tier`, `tabs` y `centered`, las subsecciones de la sección actual van en una segunda `<nav>` con su propio nombre («Subsecciones»). En `tabs` se pintan como pestañas, pero son enlaces con `aria-current="page"` y no un `tablist`: navegan, no cambian un panel. Sin subsecciones en la actual, no hay segunda fila.

**Accesibilidad.** Es la cabecera de la página (`banner`); la navegación principal y la segunda fila son `<nav>` con nombre y la página actual lleva `aria-current="page"`. El panel móvil atrapa el foco, Escape lo cierra y devuelve el foco al botón de menú.
