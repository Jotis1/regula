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

### D2. El selector de la cabecera es una isla con `Dropdown` y un disparador que ya se ve bien antes de hidratar

`ThemeToggle.astro` se sustituye por `ThemeMenu.tsx` (isla `client:idle`, como `SiteSearch`, para no adelantar React en la carga). El disparador es un botón de icono con los mismos tamaños que hoy (44px en móvil, 40px en escritorio) y pinta **los tres** iconos (pantalla, sol y luna). La CSS deja ver solo el que toca según un atributo de `<html>`, `data-tema="sistema|claro|oscuro"`. Ese atributo lo pone `ThemeScript.astro` en `<head>` y lo actualiza `setTheme()`. Así el icono es el bueno desde la primera pintura, como ahora con `dark:`. El nombre accesible del botón («Tema: Sistema», «Tema: Claro», «Tema: Oscuro») sale de `themeChoice()` al hidratar. En el HTML de servidor dice «Tema», sin estado, porque el servidor no lo sabe.

Alternativa: un `<button>` estático con un `<menu>` hecho a mano en un `<script>`. Evita la isla, pero rehace la accesibilidad del menú (foco, flechas, Escape, `menuitemradio`) que `Dropdown` ya trae y se prueba en el paquete.

### D3. Icono «sistema» desde Figma

Se busca en la página Icons del archivo «Yoruverse UI v8.0» (`WybK3J9Wu3crF84nKwrN1z`) el icono de pantalla de la misma familia (`monitor-01` o el nombre que tenga allí) y se añade a `packages/icons/src/data/icons.ts` con ese nombre. Después se regenera `components.generated.tsx`. Se comprueba que sigue la regla del set (24×24, trazo 2px, `currentColor`, sin relleno). Si el MCP de Figma no está disponible, se pide el SVG al usuario: no se dibuja a mano.

### D4. Sincronía entre cabecera y menú móvil

Las dos islas escuchan `regula:theme` (`onThemeChange`) y leen `themeChoice()`. `setTheme()` actualiza también `data-tema`. No hace falta estado compartido de React.

## Risks / Trade-offs

- [Antes de hidratar, el botón no abre nada] → Hasta `client:idle` (normalmente menos de 1 s), un clic no hace nada. Se acepta: es lo mismo que pasa con la búsqueda. El icono ya es correcto.
- [Lighthouse en la portada] → La isla comparte el chunk de React con `SiteSearch`, que ya se carga en todas las páginas. Lo medirá el job de Lighthouse del CI (con `staticDistDir` desde la rama `fix/review-comments`).
- [Cambio en `Dropdown`] → Retrocompatible. Un test asegura que un `Dropdown` sin `selectedValue` sigue dando `menuitem` y llamando a `onSelect`.
- [El icono no está en Figma con ese trazo] → Se para y se pregunta antes de inventarlo (D3).

## Migration Plan

Sin migración: la elección guardada (`regula-tema`) no cambia de formato. Para volver atrás basta con restaurar `ThemeToggle.astro` en la cabecera. Las props nuevas de `Dropdown` y el icono nuevo no rompen nada.
