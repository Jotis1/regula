# Design

## Context

- Las cifras y el motivo, en proposal.md (Why). Medido con un script provisional que lee cada HTML de `apps/docs/dist`, toma los `<script src>`, los `component-url` y `renderer-url` de cada `<astro-island>` y los imports de los scripts en línea, sigue sus imports estáticos y dinámicos y suma tamaño bruto y gzip.
- `@jotis-me/react` se compila con `tsc`, archivo por archivo (`dist/components/*.js`, `dist/internal/*.js`), con `"sideEffects": ["**/*.css"]`. El paquete no llega empaquetado: es Vite 8 (Rolldown, el de Astro 7) quien junta sus módulos en el chunk `dist.*.js`.
- Islas de la web y sus directivas: `ThemeMenu` y `SiteSearch` (`client:idle`, en la cabecera de todas las páginas), `MobileMenu` (`client:media` por debajo de 1024px), `CopyTooltip` (`client:idle`, en `Base.astro`), `HeroForm` y `CodeSnippet` en `/` (`client:visible`), `Playground` y `VisualExample` en las páginas de componente (`client:visible`), `IconGallery` en `/icons/` y `FullCanvas` en los lienzos (`client:load`).
- `Playground.tsx` hacía `import * as Regula from "@jotis-me/react"` y buscaba el componente por nombre. `visual/registry.ts` importa estáticamente los ejemplos de los 91 componentes para `VisualExample`. `visual/thumbnails.tsx` se pinta solo en el servidor (cards de `/components/`).
- Lighthouse no se puede ejecutar en esta máquina (Browser Security Plus bloquea Chrome): se verifica en el CI del PR, que ya mide `/`, `/foundations/color/`, `/components/button/` y `/components/` con `staticDistDir`.

## Goals / Non-Goals

**Goals:**
- Que `/`, `/components/` y las páginas sin `Playground` ni `VisualExample` dejen de descargar el código de componentes que no usan.
- Un límite de JS por página que salte en CI, con mensajes que digan qué página, cuánto pesa y cuál es su límite.

**Non-Goals:**
- Quitar React Aria de `Dropdown`, `CommandMenu` o `Slideout`, o cambiar `@jotis-me/react`. Si tras el arreglo lo que queda en `/` es sobre todo React Aria de las islas de la cabecera, se mide y se anota, sin rehacer componentes en este cambio.
- Cambiar lo que ve o puede hacer el usuario: los mismos e2e y capturas tienen que pasar sin tocarlos.

## Decisions

### D1. Causa (confirmada)
Se probaron las tres hipótesis iniciales con un build cada una y ninguna era la causa:
1. `import * as Regula` del `Playground`: con un mapa explícito, `/` quedó en 289,6 kB gzip (antes 290,4).
2. `visual/registry.ts`: con `VisualExample` anulado, el chunk del paquete salió idéntico, byte a byte.
3. `sideEffects` del paquete: con `false`, idéntico.

La causa: `CodeSnippet` y `CopyTooltip` se hidratan como islas importadas directamente de `@jotis-me/react` (`Base.astro`, `index.astro`, `compose/Code.astro`, `ComponentPage.astro`); `changelog.astro` hidrataba además `EmptyState` sin necesidad. Astro apunta el `component-url` de esa isla al índice del paquete, con `component-export="CodeSnippet"`; el índice pasa a ser punto de entrada y Rolldown conserva todas las exportaciones de un punto de entrada, con lo que los 94 componentes acaban en un chunk (`dist.*.js`) que carga cualquier página con una de esas islas.

### D2. Islas propias de la web
- **Elegida:** `CodeSnippetIsland.tsx` y `CopyTooltipIsland.tsx`, que importan por nombre y reenvían las props. El punto de entrada pasa a ser la isla y el bundler solo se lleva lo que usa. `EmptyState` pierde su `client:load`: no es interactivo. Regla: un componente del paquete no lleva nunca `client:*` directamente (comentado en las dos islas).
- **Mapa del `Playground`:** aunque no era la causa, `import *` también impide quitar código en las páginas de componente, así que `src/lib/playground-components.ts` lista los componentes con playground y un test lo compara con `STARTS`.
- *Alternativa:* una regla (test o Biome) que prohíba `client:*` en componentes de `@jotis-me/react`. El peso medido por `check:js` ya lo detecta (el chunk único sube `/` por encima de su límite), así que no se añade.

### D3. Medir el JS por página
- **Script:** `apps/docs/scripts/js-weight.ts` (TypeScript, se ejecuta con `bun`), a partir del provisional: recorre todos los HTML de `dist`, junta las entradas (scripts, islas, scripts en línea con `import`), sigue los imports estáticos y suma el gzip. Los dinámicos se cuentan aparte y no entran en el límite, porque no se descargan al cargar la página.
- **Límites:** `apps/docs/js-budget.json` con un `default` para cualquier página y entradas por ruta para las que necesiten más (páginas de componente con `Playground` y `VisualExample`, `/icons/`, lienzos). Cada límite es lo medido tras el arreglo más un 10 %, redondeado al kB, como se hizo con `size-budget.json`. Quedaron: `default` 192, `/` y `/icons/` 211, `/components/*/` 350 y `/visual/*/` 341 (kB gzip). Se mide con el gzip de Bun, el de CI, que da algo más que el de Node (216,1 frente a 214,3 kB en el mismo archivo). `*` es un segmento: `/components/*/` no encaja con `/components/` ni con los lienzos `/components/<x>/full/`.
- **Salida:** una tabla con las páginas más pesadas y, si alguna se pasa, la lista de las que fallan con su peso y su límite, y salida con código 1.
- **CI:** `bun run --cwd apps/docs check:js` en el job que ya construye la web, tras `turbo run build`, junto a `check:size`.
- *Alternativa:* el `resource-summary` de Lighthouse (`lighthouserc.json`, `resourceSizes`). Solo cubre las cuatro páginas medidas, depende de un navegador y ya es la parte más inestable del CI. Se descarta como límite; Lighthouse sigue midiendo la nota.

### D4. Directivas de las islas
No se cambian por defecto. Solo si tras D2 `/` sigue sin llegar a 90 y la medición señala una isla de la cabecera, se prueba `client:visible` o `client:interaction` en ella, comprobando que el buscador sigue abriéndose con su atajo de teclado desde el primer momento (e2e `search.spec.ts`).

## Risks / Trade-offs

- [El mapa explícito del `Playground` se queda sin un componente nuevo] → Test que compara las claves del mapa con los componentes que tienen playground según `playground.ts`.
- [Tras el arreglo, `/` sigue por debajo de 90 por React Aria de la cabecera y React DOM] → Se mide qué queda y se anota; cambiar componentes del paquete es otro cambio (Non-Goals). Si Lighthouse sigue inestable sin cambios de la web, se cierra con lo medido, como en la regla de no entrar en bucles de verificación.
- [El límite salta por ruido] → No hay ruido: el peso de un build es determinista; solo cambia si cambia el código.
