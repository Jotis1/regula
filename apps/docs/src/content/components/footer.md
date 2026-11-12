---

name: Footer
description: "Pie de una web de marketing: los veinte tipos del Figma, en el tema por defecto y en el de marca."
interactive: false
---

**Props.** `type` (`large-01` a `large-16` y `small-01` a `small-04`), `theme` (`default` · `brand`), y las piezas, que cada tipo coloca en su sitio: `brand`, `description`, `extra` (una valoración, avatares), `columns` [{`title`, `links` [{`label`, `href`, `badge`?}]}], `links` (una fila), `cta` {`title`, `description`, `actions`}, `aside` (las insignias de la app, una suscripción), `copyright`, `legal` y `social`.

**Tipos.** Los del Figma (`Footer`, `1517:334473`): columnas con la marca abajo (`large-01`), marca al lado y banda de pie (`02`), columnas fuertes con la app (`03`) o con la suscripción (`04`), boletín arriba (`05`) o en banda (`06`, `12`), fila de enlaces con la app (`07`) o la suscripción (`08`), llamada centrada (`09`, `11`, `13`) o a los lados (`10`), lema en el pie (`14`), centrados (`15`, `16`) y cuatro de una línea (`small-01` a `04`). Lo que un tipo no usa no se pinta.

**Visual.** Contenido a 1280 con 32 de margen; títulos de columna en `text-sm` `text-quaternary` (o `text-primary` con enlaces de marca en `large-03` y `04`), enlaces en `text-md` seminegrita `text-tertiary`, divisor `border-secondary` y bandas `bg-secondary`. En `brand`, fondo `bg-brand-section` con los textos `*_on-brand`, divisor `border-brand_alt` y bandas `bg-brand-section_subtle`. En un contenedor de menos de 768 px, las columnas van de dos en dos y los bloques uno debajo de otro, como el Figma en móvil.

**Accesibilidad.** Un `footer` (región de información de contenido). Los títulos de columna son `h2`; los iconos de redes necesitan su nombre (`aria-label`).
