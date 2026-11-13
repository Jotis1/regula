# Design

## Context

- Mismo flujo que los cambios anteriores que añaden componentes (`archive/2026-11-10-add-minor-variants`): cada componente nuevo lleva su ejemplo en `apps/docs/src/visual/registry.ts`, su muestra en `showcases.tsx`, su fragmento, su página, su grupo en `catalog.ts`, su arranque del ejemplo interactivo en `src/lib/starts/`, sus dos capturas aprobadas de la paridad visual y las dos capturas WebP de su card (`bun run capture:showcases <Nombre>`). El test de catálogo falla si falta algo, y cada componente necesita su límite en `size-budget.json`.
- Estas piezas no vienen del Figma: salen del lienzo del rediseño. La referencia visual es ese lienzo, y las medidas y colores son los tokens que ya usa.
- Lo que se reutiliza: `TransparencyGrid` (damero), `Badge` (veredicto), `iconSlot` con los iconos de `@untitledui/icons`, `Tooltip` y el chevron de `SidebarNav`.

## Goals / Non-Goals

**Goals:**
- Seis piezas pintadas en el servidor; JavaScript solo en `CompareSlider` (mover la línea) y en `IconTile` cuando quien lo usa pasa `onSelect`.
- Accesibles sin depender del color: los veredictos llevan palabra e icono, y `CompareSlider` se maneja con teclado.

**Non-Goals:**
- Recorridos de varios pasos con `Spotlight`.
- `CompareSlider` vertical o con más de dos capas.

## Decisions

### D1. Grupos del catálogo
Sin grupos nuevos (el test exige doce en Componentes):
- `CompareSlider` en «Contenido y medios», junto a `Carousel` y `VideoPlayer`.
- `Spotlight` en «Capas», junto a `Tooltip`.
- `Disclosure` en «Estructura de página», junto a `ContentDivider`.
- `ExampleCard` en «Fondos y maquetas», junto a `TransparencyGrid`.
- `IconTile` y `TokenSwatch` en «Etiquetas e identidad», junto a `Kbd`.

### D2. `CompareSlider`
- **Props:** `before` y `after` (nodos), `beforeLabel` y `afterLabel` (por defecto «Antes» y «Después»), `value` / `defaultValue` (0 a 100, 50 por defecto), `onChange`, `height`, `label` (nombre del control, obligatorio), `className`.
- **Pintura:** `after` encima de `before`, recortado con `clip-path: inset(0 0 0 <valor>%)`; la línea de 2 px en `fg-brand-primary` con un tirador de 36 px en `bg-brand-solid` y dos chevrons blancos; las etiquetas, en `Badge` `modern` en las esquinas de abajo.
- **Control:** un `input type="range"` transparente que cubre toda la caja: ratón, dedo y flechas (paso 1, Re Pág y Av Pág de 10, Inicio y Fin). Su valor se anuncia como «55 % Después».
- **Sin JavaScript:** se ve en `defaultValue` y no se mueve. La ficha lo dice.
- **Capa escondida:** la de abajo lleva `aria-hidden` e `inert`; la que tiene el foco de los lectores es la de encima.

### D3. `Spotlight`
- **Props:** `active` (boolean), `note` (nodo opcional), `notePlacement` (`top`, `bottom`, `left`, `right`; `bottom` por defecto), `children`.
- **Pintura:** sin `active`, solo `children`. Con `active`, un anillo de 2 px en `border-brand` a 8 px de su contenido con `radius-xl`, y la nota en una burbuja como la de `Tooltip` pero en `bg-primary_alt` con `shadow-lg`. Entra en 150 ms con fundido; con movimiento reducido, sin transición.
- **Accesibilidad:** la nota es texto normal enlazado al contenido con `aria-describedby` y se anuncia con `aria-live="polite"` cuando `active` pasa a verdadero.

### D4. `Disclosure`
- **Props:** `title`, `aside` (nodo a la derecha del título: un contador, un `Badge`), `defaultOpen`, `size` (`sm` 40 px de cabecera, `md` 48 px), `divider` (raya inferior, por defecto sí), `children`.
- **HTML:** `<details>` y `<summary>` con el chevron de 16 px en `fg-quaternary` que gira al abrir, título en `text-sm` semibold `text-primary` y `aside` empujado a la derecha. Sin JavaScript.
- **`Disclosure` o `Accordion`:** `Accordion` es una lista de preguntas con respuestas de texto; `Disclosure` es un bloque suelto con contenido libre y denso (controles, listas, propiedades).

### D5. `ExampleCard`
- **Props:** `verdict` (`do`, `dont`, `instead`, `better`; textos «Esto sí», «Esto no», «En lugar de», «Mejor» en `defaultStrings`), `caption`, `children` (el espécimen), `minHeight` (168 por defecto), `grid` (`sm` por defecto; `false` sin damero).
- **Pintura:** tarjeta `radius-xl` con filo `border-secondary`; arriba el damero con el espécimen centrado y 24 px de relleno; abajo, separado por una raya, un `Badge` (`success` con check en `do` y `better`; `error` con X en `dont` e `instead`) y el texto en `text-sm` `text-tertiary`.
- **Accesibilidad:** es un `<figure>` con su `<figcaption>`; el veredicto es texto, no solo color. El espécimen es interactivo salvo que quien lo usa le ponga `inert`.

### D6. `IconTile`
- **Props:** `icon` (un `IconProp`: componente o nodo, como en el resto del paquete), `label` (el nombre, visible), `selected`, `onSelect`, `href`, `size` (preview de 16, 20 o 24), `className`.
- **Pintura:** botón (o enlace con `href`) de 84 px de alto mínimo con el icono y el nombre en `text-xs`, recortado con puntos suspensivos; filo `border-secondary`, hover `bg-primary_hover`, elegido con filo de 2 px `border-brand`.
- **Accesibilidad:** `aria-pressed` cuando es botón; el nombre completo va en `title` y en el nombre accesible aunque se recorte.

### D7. `TokenSwatch`
- **Props:** `name`, `light`, `dark` (valores), `usage` (texto), `utility` (la utilidad a copiar), `layout` (`row`, `card`), `onCopy`.
- **Pintura:** dos muestras de 20 px (24 en `card`) con su hexadecimal en Geist Mono, cada una con un filo que se ve en su propio tema (el claro con el `border-primary` claro y el oscuro con el oscuro, valores del token, no del tema de la página). En `row` está pensado para ir en una celda de `Table`; en `card`, apila nombre, muestras, utilidad y uso.
- **Copiar:** el nombre de la utilidad es un botón que copia con `CopyTooltip` y su aviso de siempre; si falla, avisa como los demás.

## Risks / Trade-offs

- **`CompareSlider` con dos copias de una pantalla** → el doble de nodos. Se acepta: es una sección de portada y las dos copias son estáticas.
- **`TokenSwatch` lee valores, no tokens** → recibe hexadecimales para poder enseñar los dos temas a la vez. Quien lo usa los saca de `@jotis-me/tokens`, como hace hoy la web.
