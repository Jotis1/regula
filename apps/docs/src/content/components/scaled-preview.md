---

name: ScaledPreview
description: "Pinta una pieza a su ancho real y la encoge para que quepa en una caja, como la vista previa de una escena de 1920px."
interactive: false
---

**Props.** `width` (el ancho real del contenido), `box` (`[ancho, alto]` de la caja), `scale`, `contentHeight` y `className`.

**Cuándo.** Para enseñar en pequeño algo que solo existe a un tamaño grande: una escena de Stream de 1920×1080, un lienzo, una pantalla entera. El contenido se pinta de verdad a su ancho y se encoge; no es una imagen. Para piezas que ya traen su escala (`StreamScene` y `ChannelBanner` con `scale`), no hace falta.

**Visual.** Una caja del tamaño de `box`, con `overflow-hidden`, y dentro el contenido a `width` con `transform: scale()` desde la esquina superior izquierda. Sin `scale`, usa la mayor con la que cabe en el ancho de la caja, sin pasar de 1: encoge, no amplía. Con `contentHeight`, también cuida que no sobre alto. Lo que se salga de la caja queda recortado.

**Accesibilidad.** El contenido sigue siendo el real, con su texto y sus enlaces. Si es solo una muestra, envuélvelo en un contenedor con `aria-hidden` e `inert`, como en las cards de `/components/`.

**Detalles.** El cálculo no mide nada, así que se pinta en el servidor, sin JavaScript. Viene del `Scaled` de la pantalla de fuentes de Scaena.
