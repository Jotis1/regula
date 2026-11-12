---

name: SubscribeCard
description: "Tarjeta de suscripción al blog: icono, título, texto, el campo del correo y el botón."
interactive: true
astroNote: "`onSubscribe` es una función y no cruza de Astro a una isla: envuélvelo en un `.tsx` y úsalo con `client:load`. Sin ella, el formulario se envía como uno normal si le pones `action` en un envoltorio."
---

**Props.** `title` («Boletín semanal»), `description`, `type` (`default` · `line`), `onSubscribe(email)`, `placeholder`, `buttonLabel` y `privacy` (la nota bajo el campo, con su enlace).

**Visual.** La del Figma (`Blog subscribe card`, `1391:213014`): `bg-secondary` con radio 16 y 32 de margen, el `FeaturedIcon` moderno (avión de papel; el sobre en `line`, que lleva una raya de 4 px `fg-brand-primary_alt` arriba), título `text-xl`, campo de 44 y botón primario `lg` a todo el ancho.

**Uso.** En la barra lateral o al final de una entrada del blog. Para la suscripción en una sección de la portada, `InlineCTA` o el pie (`Footer`).

**Accesibilidad.** Una región con el nombre del título; el campo es `type="email"`, obligatorio, con su etiqueta para lectores y la nota de privacidad como descripción.
