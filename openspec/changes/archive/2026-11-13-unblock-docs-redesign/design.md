# Design

## Context

- `SidebarNav` (`packages/react/src/components/SidebarNav.tsx`) pinta cada elemento con `children` como un botón con `aria-expanded` y `aria-controls`, con el estado en React. La web lo necesita como HTML de servidor: la spec `docs-site` («La web sigue el propio sistema») pide un lateral con grupos `<details>` que funcione con el JavaScript desactivado.
- `packages/tokens/src/generate.ts` escribe `tokens.css` con los valores claros en `:root` y los oscuros en `.dark-mode`, y `theme.css` registra `dark` como `&:where(.dark-mode, .dark-mode *)`. El artefacto añade `[data-theme="dark"]` al mismo bloque (`scripts/artifact/src/sheet.ts`).
- `ProgressSteps` pinta una lista ordenada con `aria-current="step"` en el actual, en cinco tipos y dos orientaciones.
- El lienzo del rediseño ya prueba las tres cosas a mano: la lista de pasos de la portada, la división claro y oscuro de «Así se ve» (con un bloque de valores claros copiado en el artboard) y el lateral.

## Goals / Non-Goals

**Goals:**
- Las tres ampliaciones sin cambiar el HTML ni el comportamiento de quien no usa las props nuevas.
- `SidebarNav` nativo que se vea entero y se pueda abrir y cerrar sin JavaScript, con el mismo aspecto que el de siempre.
- Un solo origen para los valores claros: el mismo `tokens.json`, sin copiar valores a mano.

**Non-Goals:**
- Anidar temas más de un nivel.
- `disclosure="native"` en `dual-tier` y `slim`.
- Un asistente completo con validación por paso: `ProgressSteps` solo navega y pinta el contenido que le den.

## Decisions

### D1. `SidebarNav` con `disclosure="native"`
- **API:** `disclosure?: "script" | "native"`, `"script"` por defecto. Solo cambia los elementos con `children` en los tipos `simple`, `sections-dividers` y `sections-subheadings`; en `dual-tier` y `slim` se ignora y lo dice la ficha.
- **HTML:** `<details>` con `open` si el elemento lleva `defaultOpen` o contiene el activo; `<summary>` con el icono, el texto, el `badge` y el chevron, que gira con `details[open]`. Sin `aria-expanded` ni `aria-controls`: el navegador anuncia el estado del `<summary>` por sí solo.
- **Filtro:** el buscador de `search` es un `Input` normal; filtrar es cosa de quien lo usa (la web lo hace con su script de siempre, que abre los `<details>` con coincidencias). La ficha lo dice.
- **Movimiento:** el chevron gira en 100 ms; con `prefers-reduced-motion`, sin transición. El contenido no se anima.

### D2. `.light-mode`
- **CSS:** `generate.ts` escribe, después de `.dark-mode`, un bloque `.light-mode { color-scheme: light; … }` con el valor claro de cada token que cambia entre temas, igual que el oscuro solo lleva los que cambian.
- **Variante `dark`:** pasa a `&:where(.dark-mode, .dark-mode *):not(:where(.light-mode, .light-mode *))`. Un `dark:` dentro de `.light-mode` no se aplica aunque un ancestro sea `.dark-mode`. Un `.dark-mode` dentro de un `.light-mode` no está soportado y lo dice la ficha de color.
- **Artefacto:** `sheet.ts` añade `[data-theme="light"]` al bloque `.light-mode`, igual que hace con el oscuro.
- **Nombre:** `light-mode`, por simetría con `dark-mode`. Se descarta `theme-light` porque rompe la pareja.

### D3. `ProgressSteps` navegable
- **API:** `onChange?: (index: number) => void` y `children?: (current: number) => ReactNode`.
- **Con `onChange`:** cada paso (marcador y texto) es un `<button>` dentro de su `<li>`, con el foco del sistema; el actual sigue llevando `aria-current="step"`. Los pasos pendientes también se pueden pulsar: si una app quiere bloquearlos, no pasa `onChange` o lo ignora.
- **Con `children`:** en vertical, el contenido va dentro del `<li>` del actual, bajo su texto; en horizontal, en un bloque bajo la lista. El contenido se anuncia con `aria-live="polite"` al cambiar de paso.
- **Tipos:** funciona en los cinco; en `minimal` y `minimal-connected`, los marcadores son los botones y su nombre es el título del paso.

## Risks / Trade-offs

- **`<details>` no se anima** → se acepta: es lo que hace hoy el lateral de la web.
- **El selector `:not(:where(...))` sube el peso de la variante `dark`** → no cambia la especificidad (`:where` vale cero) y Tailwind v4 lo admite en `@custom-variant`. Se comprueba con un test que compila una utilidad `dark:` dentro y fuera de `.light-mode`.
- **Pasos pendientes pulsables** → en un alta real puede no tener sentido; quien no lo quiera no pasa `onChange`.
