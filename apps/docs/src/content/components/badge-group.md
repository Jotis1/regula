---

name: BadgeGroup
description: "Un badge dentro de otro con un mensaje, para avisar de una novedad o un estado y llevar a verlo."
interactive: false
---

**Cuándo usarlo.** Encima de un título o en la cabecera de una sección, para anunciar algo nuevo («Nuevo · Hemos publicado los estados vacíos») o un estado que pide atención, con un enlace a verlo. Para una etiqueta suelta, `Badge`; para un aviso que interrumpe, `Alert` o `Banner`.

**Props.** `badge` (texto del badge de dentro), `children` (el mensaje, en una línea), `color` (`brand` por defecto · `gray` · `error` · `warning` · `success`), `type` (`pill` por defecto · `modern`), `badgePosition` (`leading` por defecto · `trailing`), `size` (`md`, texto de 12 · `lg`, texto de 14), y `href` u `onClick` para que lleve a algún sitio.

**Visual.** `pill`: contenedor redondo con fondo `utility-*-50`, borde `utility-*-200` y texto `utility-*-700`, y el badge de dentro sobre `bg-primary`. `modern`: contenedor `bg-primary` con `radius-lg`, borde `border-primary` y `shadow-xs`, texto `text-secondary` y un punto `utility-*-500`. Con acción, una flecha al final (tras el mensaje si el badge va delante, dentro del badge si va detrás) y, al pasar el ratón, el fondo un escalón más (`utility-*-100`, o `bg-secondary` en `modern`).

**Accesibilidad.** Con `href` es un enlace y con `onClick` un botón, cuyo nombre es el badge y el mensaje («Nuevo Hemos publicado los estados vacíos»); la flecha y el punto son decorativos. Sin acción es texto, sin rol. El color nunca es lo único que informa: el badge lo dice con palabras.
