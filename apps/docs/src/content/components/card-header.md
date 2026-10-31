---

name: CardHeader
description: "Cabecera de una tarjeta: título con insignia opcional, descripción, acciones y menú, con línea inferior."
interactive: false
astroNote: "Con `onMenu` necesita una función: envuélvelo en un `.tsx` y úsalo como isla `client:load`."
---

**Props.** `title`, `badge` (+ `badgeColor`), `description`, `actions`, `menu` (+ `onMenu`), `avatar` (props de `Avatar`, para fichas de persona). Título `text-lg-semibold`; padding 20/24; separador `border-secondary`.

**Uso.** Encabeza tablas y paneles dentro de una tarjeta. Para el título de toda la página, `PageHeader`; para un bloque sin tarjeta, `SectionHeader`.

**Detalles.** Funciona sin JavaScript. El título es un `<h3>` (en la guía era un bloque sin nivel de encabezado); la insignia es `brand` si no se indica otro color.

**Ampliaciones sobre la guía.** Como en `MetricCard`: `menuLabel` cambia el nombre del botón de tres puntos ("Más opciones") y `menu` también admite un nodo, como un `Dropdown` con su propio `trigger`.
