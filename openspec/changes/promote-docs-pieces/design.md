# Design

## Context

Lo que hay hoy (ver proposal.md, Why):

- **Damero**: `apps/docs/src/components/LivePreview.astro` tiene una constante `CHECKER` (clases de Tailwind, cuadros de 8px de `bg-secondary` sobre `bg-primary`). El ejemplo de CamFrame (`src/visual/examples/stream.tsx`) tiene otro `CHECKER` en estilo en línea (cuadros de 16px de `bg-tertiary` sobre `bg-secondary`). Scaena tiene una copia del primero.
- **Vista previa encogida**: Scaena tiene `Scaled({ width, scale, box: [w, h] })`, un `div` con `overflow-hidden` del tamaño de la caja y dentro el contenido a su ancho con `transform: scale()` desde la esquina superior izquierda. En la web, `LivePreview.astro` encoge los ejemplos sin muestra con `thumbOf()`, que además los desplaza para recortar; los lienzos fijos (`StreamScene`, `ChannelBanner`) tienen su propio escalado.
- **Tecla**: `packages/react/src/internal/kbd.tsx` exporta `Kbd` y la clase `KBD` (menús de Dropdown y CommandMenu). La web repite a mano otro estilo (22px, `bg-secondary`, Geist Mono) en `SideNav.astro` (dos veces), `SiteSearch.tsx` y `pages/index.astro`.
- **Card enlazada**: en `pages/components/index.astro`, cada `li` es `relative` y su `a` lleva `after:absolute after:inset-0`; la vista previa va fuera del enlace, inerte y `aria-hidden`.
- **Anterior / Siguiente**: `Pager.astro` con la clase `PAGER` de `src/lib/toc.ts`.
- **Copiar**: `CopyToast.astro` escucha en todo el documento los clics en `[data-copy]` (tablas de tokens en Astro, sin JavaScript propio, y la galería de iconos) y muestra un aviso con `role="status"`.

## Goals / Non-Goals

**Goals:**
- Que cada pieza se escriba una vez en el paquete, con su ficha, su ejemplo y su captura como cualquier componente, y que la web la use.
- Que nada de lo que ya se ve cambie, salvo el damero del ejemplo de CamFrame, que se unifica.
- Que todo se pueda pintar en el servidor sin JavaScript, salvo lo que copia.

**Non-Goals:**
- Cambiar Scaena (otro repo).
- Tocar `CodeSnippet`, que conserva su ✓ y «Copiado».
- Usar `ScaledPreview` en `LivePreview.astro`: allí `thumbOf()` también recorta, y eso es otra cosa.

## Decisions

### D1. Las APIs

- **`TransparencyGrid`**: `size?: "sm" | "md"` (cuadros de 8 o 16px; `sm` por defecto), `className`, `children`. Es un `div` con `bg-primary` y el damero de `bg-secondary` en `background-image`. Como es fondo, no añade nada a la accesibilidad. Las cards de `/components/` usan `sm`; el ejemplo de CamFrame, `md`. El de CamFrame pasa de `bg-tertiary` sobre `bg-secondary` a los colores comunes: un damero, no dos.
- **`ScaledPreview`**: `width` (ancho real del contenido), `box: [ancho, alto]`, `contentHeight?`, `scale?`, `children`. Sin `scale`, usa `min(box[0] / width, box[1] / contentHeight)`; sin `contentHeight`, solo el ancho. Calcula sin medir nada: así funciona en el servidor, sin JavaScript. Es la API de `Scaled` de Scaena, más la escala automática.
  - Alternativa: medir el contenido con `ResizeObserver`. Obliga a hidratar y da un salto al cargar.
- **`Kbd`**: `variant?: "menu" | "field"` (`menu` por defecto), `className`, `children`. `internal/kbd.tsx` pasa a `components/Kbd.tsx`, y Dropdown y CommandMenu lo usan con `menu`: mismas clases, así que sus capturas no cambian.
- **`LinkCard`**: `href`, `title`, `description?`, `preview?`, `as?` (`div` por defecto, o `li` si la card es un elemento de lista, como en `/components/`), `className`. El `div` raíz es `relative`; el enlace estira su `::after` sobre toda la card. La vista previa va fuera del enlace, con `inert` y `aria-hidden`. Hover y foco con `has-[a:hover]` y `has-[a:focus-visible]`, como hoy en la web.
- **`Pager`**: `prev?`, `next?` (`{ href, label }`) `labels?` para «Anterior» y «Siguiente» y `aria-label` para el nombre de la navegación («Anterior y siguiente», en `defaultStrings`), como en `Breadcrumbs`. No trae margen: la web le pasa `not-prose mt-14` por `className`. Sin ninguno de los dos, devuelve `null`.
- **`useCopy` / `copy` / `CopyTooltip`**: `copy(text, anchor)` escribe en el portapapeles y avisa a quien escuche, con el elemento sobre el que poner la burbuja; `useCopy()` la devuelve para usarla desde React. `CopyTooltip` pinta una burbuja con las clases de `Tooltip` (`BUBBLE` y su flecha, que pasan a un módulo interno compartido), en posición fija, centrada sobre el ancla a 10px y debajo si no cabe arriba. Se va a los 1,5 s o al desplazar la página. Primera versión (descartada por el usuario): un toast en la esquina. La burbuja (`role="status"`, `aria-live="polite"`, se va a los 1,8 s), que dice solo «Copiado» y no repite el valor: uno largo (una variable, una utilidad con modificadores) llenaría el aviso y se vería mal (decisión del usuario) y escucha esos avisos. Con `copyAttribute="data-copy"` también copia al pulsar cualquier elemento con ese atributo, para HTML estático sin islas, que es lo que necesitan las tablas de tokens.
  - Alternativa: un contexto de React. No llega a HTML estático ni de una isla a otra.

### D2. La web usa las piezas

- `LivePreview.astro` usa `TransparencyGrid`; `pages/components/index.astro`, `LinkCard`, con `LivePreview` en el *slot* `preview`. Astro pasa los *slots* con nombre a un componente de React como props, ya pintados.
- `Pager.astro` → `Pager`. `SideNav.astro`, `SiteSearch.tsx` y `pages/index.astro` → `Kbd variant="field"`.
- `CopyToast.astro` → `CopyTooltip copyAttribute="data-copy"` en una isla `client:idle` dentro de `Base.astro`.

### D3. Catálogo y páginas

Seis páginas nuevas, cada una con su grupo: `TransparencyGrid` y `ScaledPreview` en «Fondos y maquetas», `Kbd` en «Etiquetas e identidad», `LinkCard` en «Estructura de página», `Pager` en «Navegación» y `CopyTooltip` en «Capas», junto a `Tooltip`. Cada una lleva ficha, ejemplo, muestra para su card, fragmento de código y capturas aprobadas en claro y oscuro (flujo D4 de siempre: la captura nueva se aprueba en su PR).

### D4. Orden

De menos a más riesgo: `Kbd` (refactor interno), `Pager`, `LinkCard`, `TransparencyGrid`, `ScaledPreview` y, por último, `useCopy` con `CopyTooltip`, que es la de menor prioridad.

## Risks / Trade-offs

- [*Slot* de Astro en un componente de React sin isla] → Se comprueba al principio de `LinkCard` (tarea propia) que `LivePreview` llega como `preview` ya pintado y sin JavaScript. Si no, la web compone la card con las clases que exporte el paquete.
- [Un aviso para varias islas] → `copy` y `CopyTooltip` comparten un módulo del paquete; en el bundle de Astro es un solo trozo compartido. Un e2e copia desde la galería de iconos (isla) y desde una tabla de tokens (HTML estático) y espera el mismo aviso.
- [El damero de CamFrame cambia] → Es buscado (un damero, no dos). Su captura se vuelve a aprobar.
- [Muchas capturas nuevas] → Doce (seis componentes por dos temas), que se miran una a una antes de aprobarlas.

## Migration Plan

Sin migración para las apps: todo son exportaciones nuevas. `Kbd` era privado. Para volver atrás, la web recupera `Pager.astro`, `CopyToast.astro` y sus clases.
