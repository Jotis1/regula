---

name: BrowserFrame
description: "Marco de navegador para enseñar una pantalla de la app dentro de una página: documentación, onboarding, presentaciones."
interactive: false
---

**Props.** `variant` (`safari`: semáforo, navegación, barra de direcciones de hasta 516 px y acciones · `minimal`: semáforo gris y dirección · `minimal-color`: el mismo con el semáforo en color), `theme` (`dark` pinta el marco y su contenido con el tema oscuro aunque la página esté en claro; `light` o sin él, sigue al tema de la página), `url`, `height` (alto del área de contenido), `children` (la pantalla, normalmente componentes reales).

**Visual.** `radius-xl`, borde `border-secondary` y `shadow-xl`. Barra en `bg-primary` (`minimal`: `bg-secondary`) con línea inferior; dirección en `bg-secondary`. Los colores del semáforo (#EE6A5F, #F5BD4F, #61C454) son fijos; el resto sigue el tema.

**Reglas.** Mete dentro componentes de verdad, no capturas: así cambian con el tema. Para capturas a pantalla completa no hace falta marco.

**Detalles.** Funciona sin JavaScript (lo que lleve dentro puede necesitar sus islas). La barra es una maqueta: sus iconos no son botones y se ocultan en pantallas de menos de 560px.

**Ampliación sobre la guía.** El área de contenido es una región con foco, con la dirección de la barra como nombre: si la pantalla no cabe (alto fijo o pantalla estrecha), se desplaza también con el teclado.
