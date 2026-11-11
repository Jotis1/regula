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

## 3.2 SidebarNav: pendiente de decisión (no se hace en esta pasada)

`SideNav.astro` no se puede sustituir por `SidebarNav` con una prop opcional, por un requisito que ya existe: la navegación lateral debe funcionar **sin JavaScript** (`e2e/docnav.spec.ts:83`, `javaScriptEnabled: false`; los grupos son `<details>`). `SidebarNav` es una isla hidratada, sus grupos se abren con botones `aria-expanded` y sus filas son de `text-md` semibold (el DocNav del diseño es compacto, de `text-sm`, con filtro y contadores). Montarla con el paquete exige añadirle: un modo de grupos con `<details>` (sin JS), una densidad compacta, y un filtro con su atajo `/` (hoy `search` solo pinta un campo), más el coste de hidratar ~140 enlaces en todas las páginas. Es rediseñar el componente, más que «una prop opcional retrocompatible» (design D5), así que se deja a decisión de quien lo revisa:

1. **Ampliar `SidebarNav`** con `groups="details"`, `density="compact"` y `onSearch`/filtro (trabajo de varias tareas, con capturas y changeset), o
2. **Excepción documentada:** la navegación lateral sigue siendo HTML del servidor sin JS, y el requisito «Estructura con el paquete» la excluye (la cabecera, el menú móvil y el pie sí usan el paquete).

Hasta que se decida, 3.2 queda sin marcar y el resto del grupo sigue.

## 3.3 Pie con Footer

- `SiteFooter.astro` pinta el `Footer` del paquete (`large-04`: marca y texto a un lado, dos columnas, y la fila inferior con las versiones de los paquetes y «Qué ha cambiado» como enlace legal), sin directiva `client:*`. Sin cambios en el componente.
- Cambia el aspecto respecto a `Footer.dc.html`: enlaces de `text-md` semibold en color de marca, títulos en `text-primary` y filas más altas, que es el diseño del `Footer` del paquete. Se acepta como la consecuencia de usarlo, tal como promete el pie. Revisado en claro, oscuro y móvil (390 px).
- Las versiones van como texto en la línea del copyright (`<p>`), con `data-versions` en el `span`; ya no es una `<dl>`.
- El test de ancho (`layout.spec.ts`) mide el contenedor interno del `Footer`.

## 3.4 Portada con el paquete

- La portada ya usaba `BackgroundPattern`, `Badge`, `Button`, `Icon`, `Kbd`, `StreamStatus`, `AppIcon` y `HeroForm` (corrige lo dicho en la propuesta: «no importa nada del paquete»). Lo que estaba a mano y ahora es componente: las cuatro cards de «Dónde está cada cosa» de escritorio pasan a `LinkCard` (muestra inerte arriba, título y texto como enlace que cubre la card; `data-map-meta` sigue en el texto). Sin cambios en el paquete.
- Se quedan a mano, porque ningún componente del paquete tiene su forma: la fila horizontal de las cards de móvil (icono a la izquierda y chevron: `LinkCard` solo tiene la muestra encima), la lista numerada de las cinco reglas, la lista de apps con su `AppIcon`, y el campo-botón «Busca lo que te falte» (un disparador con aspecto de campo, no un `Input`). Las cabeceras de sección son `h2` con las clases de la guía: `SectionHeader` es una cabecera de página con acciones y pestañas, no un título de sección de una portada.
- Revisada en claro y oscuro; `home.spec.ts` y `check:js` sin cambios.

## 4.1 Motor: controles de número, icono y contenido

- `lib/playground.ts` gana tres tipos de control (`number`, `icon`, `content`) y los ajustes por prop (`Start.tweaks`: `hidden`, `number` con rango, `icon`, `content` con opciones preparadas). `State` pasa a admitir números y `undefined` (sin valor: la prop no se pasa ni se escribe). El código lleva el JSX de cada opción de contenido y los imports que pida (`importsOf`).
- Reglas del generador sin ajustes: `number` y `string | number` dan campo numérico (`Skeleton` `width`…); las props `icon`, `iconLeading`, `iconTrailing` e `iconOnly` de tipo `ReactNode` o `IconName` dan selector de icono (con buscador) con los 86 iconos del núcleo; **`value` solo se excluye si el componente tiene `onChange`** (en uno que solo muestra, como `ProgressBar`, es un dato y cuenta como número; antes `value` se excluía siempre).
- Solo hay iconos del núcleo en el selector, porque un nombre de icono de fuera del núcleo no pinta nada como cadena (`iconSlot`); ofrecer los otros 1.086 exigiría el nodo ya pintado de cada uno y cargar el set entero. La spec lo permite («y de `@jotis-me/icons` si usa un icono que no está en el núcleo») pero no lo exige; queda para configs que lo pidan con un `content`.
- `Playground.tsx` pinta los controles con `NumberInput` y `Select` del paquete (con `searchable` en los iconos). Los de contenido siguen sin uso hasta las configs del grupo 5 (probados con un `Start` sintético).
- Tests: `test/playground.test.ts` (generación de cada control, propagación a props y al código con sus imports, `value` con y sin `onChange`) y e2e de `Button` (icono) y `Skeleton` (número). Los 62 de humo siguen verdes.
