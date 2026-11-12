---

name: BlogPostCard
description: "Tarjeta de entrada del blog: portada, categoría, título, resumen y autor, en ocho tipos."
interactive: false
---

**Props.** `href`, `title`, `description`, `image` (un nodo: el paquete no trae fotos), `category`, `readTime`, `author` {`name`, `avatar`?, `date`}, `tags` [{`label`, `color`?}], `readLabel`, `type` (`simple-01` a `04` y `card-01` a `04`) y `orientation` (`vertical` · `horizontal`).

**Tipos.** Los del Figma (`Blog post card`, `1390:58`). `simple`: la portada con radio 16 suelta sobre el fondo; `card`: todo en una tarjeta `bg-primary` con borde, la portada a sangre y el texto con 24 de margen. Cabeceras: `01` la categoría en `text-brand-secondary` y el autor abajo; `02` un `BadgeGroup` con la categoría y el tiempo de lectura; `03` autor y fecha arriba y etiquetas de color abajo; `04` el autor y la categoría sobre la portada, con velo y desenfoque, y «Leer la entrada». Título `text-lg` seminegrita con la flecha `arrow-up-right` y resumen `text-md` `text-tertiary` en tres líneas (dos en horizontal).

**Uso.** En la portada del blog y en «Entradas relacionadas». Horizontal para destacadas; en un contenedor de menos de 576 px vuelve a vertical, como el Figma en móvil.

**Accesibilidad.** Un `article` con el título en `h3`; el título es el enlace y su área cubre toda la tarjeta, así hay un solo enlace por entrada. La flecha y «Leer la entrada» son decorativos.
