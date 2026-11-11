# Notas de la implementación

## 1.1 Ancho del contenedor

- `Base.astro`: la barra lateral va sin contenedor; el contenido va en `div[data-container]` con `max-w-container` (1280) dentro de `main`, que conserva el padding de la guía. Cabecera y pie llevan `data-container` con el mismo ancho.
- La cabecera pasa a una barra de ancho completo con su contenido centrado en 1280, así que a 1440 px el contenido empieza 80 px más adentro. `e2e/header.spec.ts` (medidas a 1440) suma ese margen; el resto de lo que comprueba no cambia.
- No hay capturas aprobadas de páginas con cabecera o pie: el e2e completo en Chromium pasó sin rehacer ninguna. Fallos de carga ya conocidos (CopyTooltip, selector de archivo de Input) que pasan al repetirlos.
- Decisión sin consultar: la rama sale de `feat/figma-coverage` porque `complete-figma-coverage` aún no tiene PR; se rebasará sobre `main` cuando se fusione.

## 2.1 Recorte con fundido en las muestras

- `LivePreview.astro` ya no encoge ni tiene el respaldo del ejemplo entero (`thumbOf` y sus tests desaparecen: los 121 componentes tienen muestra y un test lo exige). El escenario (288×180) ancla la muestra según `crop` (`center` por defecto, `top`, `top-left`) y aplica una máscara con fundido de 24 px solo por los bordes por donde se recorta (`fadeMask`).
- `scale` queda como `@deprecated` en `Thumbnail` solo para las 55 muestras pendientes de 2.2: 54 con `scale` y `HeaderNav`, que se encoge con `ScaledPreview`. La lista (`SHRUNK_PENDING`, en `visual/thumbs.ts`) la comparten el test unitario y el e2e y debe quedar vacía en 2.2. La muestra de `ScaledPreview` queda fuera: es su demostración.
- La cuenta del resumen de la propuesta (60 muestras) era una estimación; las reales son 55.

## 2.2 Muestras a tamaño real

- Las 55 muestras pendientes ya van sin `scale` ni `ScaledPreview`: `scale` desaparece del tipo `Thumbnail` y `SHRUNK_PENDING` se borra. El test unitario falla si una muestra declara `scale:` o pinta `<ScaledPreview>` (salvo la de ScaledPreview, que es su demostración); el e2e comprueba en `/components/` que ninguna tiene `transform` con escala menor que 1.
- Cómo se resolvió cada una: los componentes que se adaptan al ancho se pintan a 288 px; el resto (Modal, Slideout y CommandMenu, en un escenario de 300–440 px; HeaderNav, MarketingNav, Footer, CalendarView…) se pinta a su ancho y se recorta arriba a la izquierda (`crop: "top-left"`) con fundido por los bordes recortados. LineChart y BarChart usan `width={288}` y `height={120}` (su SVG escala con el ancho, así que a 288 sobre 640 de diseño el texto salía a 6 px). Testimonial pierde `rating` y se pinta a 180 de alto para que se vea el panel con la cita. Accordion, TeamMemberCard y BadgeGroup pasan a `top-left` (se recortaban por los dos lados).
- **Excepción (decisión sin consultar):** `StreamScene` y `ChannelBanner` siguen miniaturizados con su propia prop `scale` del componente, porque son lienzos de 1920×1080 y 1200×… que a tamaño real solo enseñarían una esquina vacía. No pasa por `transform` de la card ni por `ScaledPreview`, así que los tests no los cuentan. A confirmar con el usuario.
- Revisado en claro y oscuro (Table, CalendarView, Modal, Slideout, CommandMenu, gráficas, marketing, mockups). Sin capturas aprobadas que rehacer: no hay referencia visual del índice.

## 3.1 Cabecera con HeaderNav

- **Hueco en el componente (changeset `header-nav-underline`, minor):** `HeaderNav` no tenía una cabecera de una fila con la sección actual subrayada ni dejaba usar el menú móvil de quien lo usa. Se añaden `type="underline"` (h-16, `text-sm` en `text-tertiary`, la actual en `text-primary` con subrayado de 2 px; en móvil, fila de 56) y `mobileBar` (sustituye al botón y al panel integrados). Test de HTML sin las props nuevas, ejemplo, ficha y captura de `HeaderNav` rehechas (claro y oscuro, revisadas).
- `SiteHeader.astro` pinta `HeaderNav` sin directiva `client:*` (cero JS propio) con tres slots de Astro (`brand`, `actions`, `mobileBar`), que llegan como props. Como `HeaderNav` pinta escritorio y móvil a la vez y la CSS elige, la cabecera lleva **dos islas de tema y dos de búsqueda** (una por versión). La búsqueda solo responde en la que se ve (`SiteSearch` comprueba que su botón tiene caja), así que Ctrl+K y el evento `regula:search` no abren dos diálogos. Los ayudantes de e2e que esperaban «la» isla esperan las dos (`theme`, `search`, `mobile`, `components`).
- `aria-current` de las secciones pasa de `"true"` a `"page"` (lo que pone `HeaderNav`); el test de la cabecera lo sigue. «Saltar al contenido» pasa a `fixed` porque ya no hay un `header` propio que lo contenga. El ejemplo nuevo de `HeaderNav` desplaza los índices de `e2e/header-nav.spec.ts` (+1).
- El tipado de la plantilla de Astro no ve que los slots son props: `{/* @ts-expect-error */}` con el motivo.
- `check:js`: sin cambios de límite; `/` y `/components/` siguen dentro.
