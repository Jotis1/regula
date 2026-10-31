Marco de navegador para enseñar una pantalla de la app dentro de una página: documentación, onboarding, presentaciones.

**Props.** `variant` (`safari`: semáforo, navegación, barra de direcciones de hasta 516 px y acciones · `minimal`: semáforo gris y dirección), `url`, `height` (alto del área de contenido), `children` (la pantalla, normalmente componentes reales).

**Visual.** `radius-xl`, borde `border-secondary` y `shadow-xl`. Barra en `bg-primary` (`minimal`: `bg-secondary`) con línea inferior; dirección en `bg-secondary`. Los colores del semáforo (#EE6A5F, #F5BD4F, #61C454) son fijos; el resto sigue el tema.

**Reglas.** Mete dentro componentes de verdad, no capturas: así cambian con el tema. Para capturas a pantalla completa no hace falta marco.
