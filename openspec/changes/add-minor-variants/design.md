# Design

## Context

- Mismo flujo que las fases 1 y 2 (`archive/2026-11-07-add-form-variants`, `archive/2026-11-08-add-navigation-progress`): cada componente nuevo lleva su ejemplo en `apps/docs/src/visual/registry.ts`, su muestra en `thumbnails.tsx`, su fragmento, su página, su grupo en `catalog.ts` y sus dos capturas aprobadas, capturadas en Windows y miradas antes de aprobarlas. El test de catálogo falla si falta algo. Cada componente nuevo necesita su límite en `packages/react/size-budget.json` (`check:size`, paso aparte de CI).
- El Figma usa la paleta de Tailwind v3, no los tokens: de él se toman forma, medidas y estados, y el color se traduce al token semántico. Cuando el Figma y la spec no coinciden, se construye como el Figma y se actualiza la spec (regla del usuario).
- Lo que ya hay y se reutiliza: `Badge` (tipos `pill`, `badge`, `modern`; colores con `COLOR` exportado), `Button` (solo icono con `iconOnly`, `xs` de 32px), `Tooltip` con `placement`, `HelpIcon`, `FeaturedIcon`, `Avatar` (iniciales o `src`), `BackgroundPattern` (rejilla con máscara de desvanecido) y `Icon`.
- `@jotis-me/icons` tiene `"sideEffects": false`, genera sus componentes con `scripts/generate.ts` y publica SVG sueltos (`./svg/*`, `./hand-drawn/*`, `./patterns/*`). El artefacto ya tiene un grupo de assets «Logos» que no sale del repo (se conserva el publicado, `scripts/artifact/src/content.ts`).
- `trim-docs-js` va antes en la misma PR: la web tendrá límite de JS por página cuando entren estas piezas.

Nodos del Figma («Yoruverse UI v8.0», `WybK3J9Wu3crF84nKwrN1z`):

| Pieza | Nodos |
| --- | --- |
| BadgeGroup | `1046:8088` (Badge delante y detrás, `md` y `lg`, Pill color y Badge modern, Default y Hover) |
| SectionLabel | `5013:376534` (`sm` `5013:376528`, `md` `5013:376579`, con acciones `5013:376529` y `5013:376584`) |
| ButtonUtility | `8003:526508` (`sm` tertiary `8003:526509`, `sm` secondary `8003:526541`, `xs` secondary `8014:532022`, `xs` tertiary `7932:552045`, con sus estados Hover, Focused y Disabled) |
| Spinner | `1192:610` (Line simple `1192:607`, Line spinner `1196:283`, Dot circle `1192:633`, en `sm` a `xl`) |
| EmptyState | `1182:317` (Featured icon `1182:412`, Illustration `1182:2191`, File type icon `4980:382754`, Folder icon `9239:545816`, Folder icon transparent `11284:2621`, Users radius `11284:582775`, Users row `11290:589736`, Integrations `11293:590923`; los nodos son de `md`, los de `sm` y `lg` están en el mismo marco), ilustraciones `1182:1085` (Cloud, Box, Documents, Credit card en `sm`, `md` y `lg`) |
| Logos | App icons `6452:229238` (232), Integration icon `12464:573740` (16, color y gris), Social icon `1457:244804` (34, color y gris, con Hover); página «Misc icons» `1025:31781` |

## Goals / Non-Goals

**Goals:**
- Las tres piezas nuevas y las variantes de `Spinner` y `EmptyState` como el Figma, con tokens semánticos y en los dos temas, pintadas en el servidor; JavaScript solo para los tooltips.
- Los 282 logos en `@jotis-me/icons` sin que una app que use uno cargue los demás.
- Nada de lo existente cambia: las capturas aprobadas de `Spinner`, `EmptyState`, `Badge` y `Button` se mantienen salvo donde el ejemplo enseñe lo nuevo.

**Non-Goals:**
- Los iconos de tipo de archivo como set (153), las banderas, los logos ficticios y de prensa, los badges de tiendas y los botones de redes sociales.
- Fotos en los ejemplos de Regula: los avatares de las cabeceras de usuarios van con iniciales.
- Logos en modo oscuro propios: el Figma no los tiene para estos sets; los logos con fondo propio se ven igual en los dos temas y los grises usan `currentColor`.

## Decisions

### D1. Grupos del catálogo
`ButtonUtility` va en «Acciones», junto a `Button` y `CloseButton`. `BadgeGroup` va en «Etiquetas e identidad», junto a `Badge`. `SectionLabel` va en «Estructura de página», junto a `SectionHeader`. Sin grupos nuevos (el test exige 11 en Componentes).

### D2. `BadgeGroup`
- **Props:** `badge` (texto del badge interior), `children` (mensaje), `color` (`gray`, `brand`, `error`, `warning`, `success`), `type` (`pill` por defecto, `modern`), `badgePosition` (`leading` por defecto, `trailing`), `size` (`md`, `lg`), `href` / `onClick`, `className`.
- **Colores:** los del `COLOR` de `Badge` (fondo `-50`, filo `-200`, texto `-700`); el badge interior, blanco (`bg-primary`) con el mismo filo. En `modern`, contenedor `bg-primary` con `shadow-xs` y filo `border-primary`, y el badge interior con el punto del color, como el Figma.
- **Interacción:** con `href` es un `<a>`, con `onClick` un `<button>`; los dos llevan `arrow-right` decorativo al final y el hover del Figma (fondo un escalón más). Sin acción, un `<div>` sin flecha.

### D3. `SectionLabel`
- **Props:** `title`, `description?`, `required?`, `help?` (texto del `HelpIcon`), `actions?` (`ReactNode`, normalmente `Button` `link-gray` y `link-color` de tamaño `sm`), `size` (`sm`, `md`), `as` (`h2`, `h3` por defecto, `h4`).
- **Obligatorio:** asterisco en `text-brand-tertiary`, con `aria-hidden`, y un `sr-only` con el texto de `defaultStrings` («obligatorio»).
- **Medidas:** `sm` título `text-sm` semibold y apoyo `text-sm`; `md` título `text-md` y apoyo `text-md`, del nodo `5013:376534`.

### D4. `ButtonUtility`
- **Props:** `icon` (`IconName`), `label` (obligatorio: nombre accesible y texto del tooltip), `hierarchy` (`secondary` por defecto, `tertiary`), `size` (`xs`, `sm` por defecto), `tooltip` (`true` por defecto; `false` lo quita), `tooltipPlacement`, `disabled`, `href` y los atributos de botón o enlace.
- **Hecho con lo que hay:** el `Tooltip` del paquete envuelve un botón propio (no `Button`): el Figma pinta el icono en `fg-quaternary` (hover `fg-quaternary_hover`), con radios y rellenos menores que `Button` `xs`, y `secondary` con filo `border-primary` y `shadow-xs`. Medidas exactas del nodo `8003:526508` (`xs` 28 y `sm` 32 a confirmar en el nodo).
- *Alternativa:* `hierarchy="utility"` en `Button`. Mezcla dos componentes que el Figma separa, con estados y tamaños distintos. Se descarta.

### D5. `Spinner` con estilos
`variant` (`line-simple` por defecto, `line-spinner`, `dot-circle`). `line-spinner` es el mismo SVG sin el círculo de la pista. `dot-circle` son dieciséis puntos en círculo (como el nodo `1192:633`, no doce como se pensó al proponer) que se desvanecen en el sentido del reloj, en `fg-brand-primary`; `line-spinner` es un arco de unos 216° (0,6 de la circunferencia), del nodo `1196:283`; gira con la misma animación y la misma regla de movimiento reducido. Sin `variant`, el HTML es el de hoy (test con `renderToStaticMarkup`).

### D6. `EmptyState` con cabeceras
- **Props nuevas:** `media` (`icon` por defecto, `illustration`, `file`, `folder`, `folder-glass`, `users-radius`, `users-row`, `integrations`), `illustration` (`cloud`, `box`, `documents`, `credit-card`), `items` (`ReactNode[]`, para usuarios e integraciones), `size` (`sm` por defecto, `md`, `lg`). `icon` sigue sirviendo para `icon` y para el icono central de las demás.
- **`sm` es lo de hoy:** el título `text-md` y el `FeaturedIcon` `lg` actuales son el `sm` del Figma; `md` y `lg` suben título (`text-lg`, `text-xl`) y tamaños de cabecera según el nodo. La captura aprobada no cambia.
- **Ilustraciones y carpetas:** SVG en línea dentro del paquete (`src/internal/empty-media/`), tomados del Figma y con los colores pasados a tokens (`bg-secondary`, `bg-tertiary`, `border-secondary`, `fg-quaternary`), para que se adapten al tema oscuro. Las sombras suaves, con `filter` del SVG o `shadow-*` sobre el contenedor. Todas con `aria-hidden`.
- **Archivo:** el icono de archivo del Figma (`File type=Simple / Empty`, brand) dentro de un círculo `bg-secondary`, sobre `BackgroundPattern` de rejilla con casillas.
- **Usuarios e integraciones:** `items` se reparten en las posiciones del Figma (círculos concéntricos con `BackgroundPattern` de círculos; una fila; dos filas desplazadas), con máscara de desvanecido hacia los lados (`mask-image`) y el icono central (`search-lg`, `user-plus-01`) en un `FeaturedIcon` `modern`. Sin `items`, solo el fondo y el icono. Los ejemplos de la web usan `Avatar` con iniciales y logos de `@jotis-me/icons/logos`; `@jotis-me/react` no importa logos.

### D7. Logos en `@jotis-me/icons`
- **Fuente:** SVG guardados en el repo, `packages/icons/assets/logos/<set>/<nombre>.svg` y `<nombre>-gray.svg` (`set`: `app`, `integration`, `social`), exportados del Figma por nodo con el MCP (`download_assets` o las URL de `get_design_context`) mediante un script de una sola vez (`scripts/import-logos.ts`) que los nombra en kebab-case desde el nombre del Figma («Tailwind CSS» → `tailwind-css`, «jb_pycharm» → `jetbrains-pycharm` donde haga falta), los optimiza (atributos sobrantes, ids únicos por logo) y los guarda. Los grises monocromos pasan a `currentColor`.
- **Generación:** `scripts/generate.ts` crea `src/logos.generated.tsx` con un componente por logo y variante (`SocialGithubLogo`, `SocialGithubLogoGray`, `AppZapierLogo`, `IntegrationClaudeLogo`) y `logoNames` por set; `dist/logos/<set>/*.svg` se copian como los demás assets. Entrada `"./logos"` (componentes y tipos) y `"./logos/*"` (SVG) en `exports`.
- **Accesibilidad:** sin `title`, `aria-hidden`; con `title`, `role="img"` y `<title>`.
- **Peso:** con `sideEffects: false` y un componente por export, importar uno no arrastra los demás; un test empaqueta un import suelto con esbuild y comprueba que no aparece otro logo.
- *Alternativa:* un `Logo name="github"` con todos dentro. Más cómodo, pero cualquier uso carga los 282. Se descarta.

### D8. Logos en `/icons/` y en el artefacto
- **Web:** la galería gana un selector «Iconos / Logos» (pestañas del paquete) y, en logos, un filtro por set. El panel enseña color y gris y copia el import de `@jotis-me/icons/logos` o la ruta del SVG. Los logos se pintan en el servidor como SVG; la isla `IconGallery` recibe solo nombres y rutas, no el código de los 282 componentes, para no subir su JS (límite de `trim-docs-js`).
- **Artefacto:** un grupo de assets nuevo, «Marcas» (`tile` `m`), con los SVG de `dist/logos`, generado como los demás grupos que salen del repo. El grupo «Logos» se queda como está. Los assets no cuentan para el límite de 1.008 ficheros; se suben en tandas de 25 siguiendo `scripts/artifact/README.md`.

## Risks / Trade-offs

- [Exportar 564 SVG (282 × color y gris, donde exista) del Figma a mano es lento y propenso a errores] → Script de una vez con la lista de nodos sacada de los marcos; un test compara los nombres guardados con la lista esperada por set.
- [Logos de marcas de terceros] → Se usan para representar integraciones con esos servicios, como en el Figma; la ficha de la galería dice que cada marca es de su dueño y que se usan sin cambiar su forma ni sus colores.
- [El tarball de `@jotis-me/icons` crece] → Se mide con `scripts/pack.ts` antes y después y se anota en el changeset.
- [Las ilustraciones del Figma usan degradados y sombras que no tienen token] → Se aproximan con tokens de fondo y `shadow-*`; se comparan en claro y oscuro con el nodo antes de aprobar la captura, y las diferencias aceptadas se anotan en `NOTAS.md` del cambio.
- [Subir cientos de assets al artefacto] → Va en la sincronización tras publicar, no en este cambio; la herramienta acepta 25 por llamada y el README ya lo describe.
