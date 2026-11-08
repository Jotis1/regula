# Design

## Context

- El tema de la web ya tiene tres estados en `apps/docs/src/lib/theme.ts`: `themeChoice()` (lo guardado en `localStorage` bajo `regula-tema`, o «sistema» si no hay nada), `setTheme()`, `followSystem()` y el evento `regula:theme`. `ThemeScript.astro` aplica el tema en `<head>` antes de pintar.
- La cabecera usa `ThemeToggle.astro`: un `<button>` estático, con un script que solo alterna claro y oscuro. Pinta el sol y la luna a la vez en el HTML y la CSS elige cuál se ve con `dark:`, así que el icono es correcto antes de que corra ningún script.
- El menú móvil (`MobileMenu.tsx`, isla `client:media`) ya ofrece Sistema / Claro / Oscuro con un `ButtonGroup` y escucha `regula:theme`.
- `Dropdown` (`packages/react`) se apoya en `Menu` / `MenuItem` de React Aria. Sus elementos usan el índice como `id` y solo llaman a `onSelect`. No tiene estado de elección.
- El set de iconos no tiene un icono de pantalla. La guía dice que los iconos que falten se saquen del mismo archivo de Figma (página Icons) para mantener el trazo.

## Goals / Non-Goals

**Goals:**
- Que el icono y el nombre accesible del botón sean correctos desde la primera pintura, sin esperar a la hidratación.
- Una sola fuente de verdad del tema (`lib/theme.ts`): cabecera y menú móvil leen y escriben lo mismo.
- La selección única de `Dropdown` es una ampliación retrocompatible, útil fuera de la web.

**Non-Goals:**
- Un componente `ThemeSelector` en el paquete. Se plantea después, con este como referencia.
- Cambiar el `ButtonGroup` del menú móvil.

## Decisions

### D1. Selección única en `Dropdown` con `value` por opción

Se añade `value?: string` a cada acción (`DropdownAction`) y dos props al menú: `selectedValue?: string` y `onSelectionChange?: (value: string) => void`. Con `selectedValue` definido, el `Menu` de React Aria va con `selectionMode="single"` y `selectedKeys`, y los `id` de las opciones pasan a ser su `value`. React Aria ya pinta `role="menuitemradio"` y `aria-checked`. El check se dibuja a la derecha con `Icon name="check"` (16px, `fg-brand-primary`), cuando el elemento tiene `data-selected`. Sin `selectedValue`, todo queda como hoy: índices como `id`, `menuitem` y `onSelect`.

Alternativas: un `checked` por opción, que obliga a calcularlo en cada elemento y deja abierta la elección múltiple por error. O un menú propio en la web, que no sirve a las apps y repite la accesibilidad del menú.

### D2. El selector de la cabecera es el `Dropdown` del paquete, con su botón de texto, que ya se ve bien antes de hidratar

`ThemeToggle.astro` se sustituye por `ThemeMenu.tsx` (isla `client:idle`, como `SiteSearch`, para no adelantar React en la carga). Usa el `Dropdown` con el mismo `Button` que pinta por defecto (secundario, con flecha), pasado como `trigger` solo para añadirle `iconLeading`. El botón lleva **las tres** opciones: los tres iconos (pantalla, sol, luna) en su hueco de icono y los tres nombres («Sistema», «Claro», «Oscuro») como texto. El icono va en `iconLeading` y no dentro del texto: metido en el texto, el icono de 20px se alineaba por la línea base y descolocaba el nombre en vertical (lo vio el usuario). Un e2e comprueba que las letras quedan centradas en el botón (±1px). La CSS deja ver solo la que toca según un atributo de `<html>`, `data-tema="sistema|claro|oscuro"`. Ese atributo lo pone `ThemeScript.astro` en `<head>` y lo actualiza `setTheme()`. Así el botón dice lo bueno desde la primera pintura, aunque el servidor no lo sepa. Un «Tema: » solo para lectores de pantalla delante hace que el nombre accesible sea «Tema: Claro»; las etiquetas ocultas con `display: none` no cuentan para el nombre.

Primera versión, descartada por el usuario: un botón solo de icono como disparador propio del `Dropdown`. Ocupaba lo mismo que el botón antiguo, pero no decía lo elegido con palabras.

Alternativa: un `<button>` estático con un `<menu>` hecho a mano en un `<script>`. Evita la isla, pero rehace la accesibilidad del menú (foco, flechas, Escape, `menuitemradio`) que `Dropdown` ya trae y se prueba en el paquete.

### D3. Icono «sistema» desde Figma

Se busca en la página Icons del archivo «Yoruverse UI v8.0» (`WybK3J9Wu3crF84nKwrN1z`) el icono de pantalla de la misma familia (`monitor-01` o el nombre que tenga allí) y se añade a `packages/icons/src/data/icons.ts` con ese nombre. Después se regenera `components.generated.tsx`. Se comprueba que sigue la regla del set (24×24, trazo 2px, `currentColor`, sin relleno). Si el MCP de Figma no está disponible, se pide el SVG al usuario: no se dibuja a mano.

### D4. Sincronía entre cabecera y menú móvil

Las dos islas escuchan `regula:theme` (`onThemeChange`) y leen `themeChoice()`. `setTheme()` actualiza también `data-tema`. No hace falta estado compartido de React.

## Risks / Trade-offs

- [Antes de hidratar, el botón no abre nada] → Hasta `client:idle` (normalmente menos de 1 s), un clic no hace nada. Se acepta: es lo mismo que pasa con la búsqueda. El icono ya es correcto.
- [Botón más ancho] → Con texto, el botón ocupa unos 130px en lugar de 40. Se comprueba que la cabecera móvil (390px) sigue cabiendo sin desplazamiento horizontal.
- [El botón cambia de ancho con lo elegido] → «Claro» es más corto que «Sistema». Por eso va a la **izquierda** de la búsqueda (petición del usuario): la búsqueda queda pegada al margen derecho y no se mueve al cambiar de tema. Un e2e lo comprueba a 1440 y 390px.
- [e2e de a11y inestable con carga] → En las dos ejecuciones completas en local tras este cambio, la regla de axe «lo que se desplaza se puede enfocar» a 390px agotó los 30 s en una página (InlineCTA y Button), distinta cada vez; por separado pasa siempre (21 de 21). Aceptado por el usuario el 2026-11-07: lo juzga el CI, que tiene `retries: 1`. Si allí falla de verdad, se investiga si la isla del tema pesa.
- [Lighthouse en la portada] → La isla comparte el chunk de React con `SiteSearch`, que ya se carga en todas las páginas. Lo medirá el job de Lighthouse del CI (con `staticDistDir` desde la rama `fix/review-comments`).
- [Cambio en `Dropdown`] → Retrocompatible. Un test asegura que un `Dropdown` sin `selectedValue` sigue dando `menuitem` y llamando a `onSelect`.
- [El icono no está en Figma con ese trazo] → Se para y se pregunta antes de inventarlo (D3).

## Migration Plan

Sin migración: la elección guardada (`regula-tema`) no cambia de formato. Para volver atrás basta con restaurar `ThemeToggle.astro` en la cabecera. Las props nuevas de `Dropdown` y el icono nuevo no rompen nada.
