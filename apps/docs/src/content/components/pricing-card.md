---

name: PricingCard
description: "Tarjeta de un plan de precios: el plan, la cifra, lo que incluye y los botones, en diez tipos."
interactive: false
---

**Props.** `type` (`icon` · `call-out` · `icon-offset` · `dual-check-items` · `badge` · `badge-group` · `dual-action` · `banner` · `primary-simple` · `primary-icon`), `name`, `price` y `period`, `description`, `badge`, `icon`, `features` (una línea por elemento), `featuresTitle` y `featuresDescription`, `actions` (a todo el ancho), `banner` y `callout`.

**Tipos.** Los del Figma (`_Pricing tier card`, `1346:182709`): con icono y pie gris (`icon`), la cifra arriba (`call-out`, con su nota), el icono sobre el borde (`icon-offset`), ancho con la lista en dos columnas (`dual-check-items`), el plan en una etiqueta y dos botones (`badge`), en un `BadgeGroup` (`badge-group`), alineado a la izquierda con dos botones (`dual-action`), con banda de marca (`banner`) y sobre fondo de marca (`primary-simple` y `primary-icon`). Cada tipo lleva los checks del Figma (`CheckItem` tintado, de contorno o lleno, en marca o éxito).

**Visual.** `bg-primary` con radio 16, borde `border-secondary_alt` y `shadow-lg`; la cifra en Bricolage `display-lg` (`display-md` en estrecho); 32 de margen (24 en estrecho). Hasta 400 de ancho (576 en `dual-check-items`); se encoge con el contenedor.

**Uso.** Dos o tres juntas en la página de precios, con el mismo tipo; destaca una con `banner`, `badge` o el tipo `primary-*`.

**Accesibilidad.** Un `article`; la lista de lo que incluye es una lista con sus checks decorativos. Los botones van como los pases.
