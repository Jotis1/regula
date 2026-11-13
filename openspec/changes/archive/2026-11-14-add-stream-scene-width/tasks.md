# Tasks

Comandos: `bun run --cwd packages/react test`, `bunx biome ci .`, `bunx turbo run typecheck build`, `bun run --cwd packages/react check:size`, `bun run --cwd apps/docs check:js` y los e2e de `apps/docs`.

## 1. `StreamScene` con ancho configurable

- [x] 1.1 Prop `width` normalizada y pasada a `StreamStage` (design D1). Tests: 2580 con `scale={4/3}` mide 3440×1440 con lienzo de 2580×1080; sin `scale`, `aspectRatio` 2580/1080 y escala medida; 1280, 1919, 2000.5, `NaN`, infinito y negativos se tratan como 1920; sin `width`, el mismo HTML que con 1920.
- [x] 1.2 HTML de las cuatro variantes a 1920 idéntico al de `main` (con y sin `scale`) y paridad visual de `StreamScene` en claro y oscuro.
- [x] 1.3 Revisar la máscara de la cuadrícula a 2580 (design D2): se queda en porcentajes.
- [x] 1.4 Capturas aprobadas de las cuatro variantes a 3440×1440 con su e2e: pie a 80 px lógicos de cada borde y titular centrado (design D4). Miradas.
- [x] 1.5 Ficha: `width` en las props y en «Cuándo usarla», y el bloque «En 21:9» con su e2e (design D3).

## 2. `HeaderNav` con acciones en móvil

- [x] 2.1 `mobileActions` (design D5). Tests: sin la prop, el HTML de siempre y sin acciones en la fila móvil; con ella, acciones y después el botón de menú; con `mobileBar`, acciones y después `mobileBar`. Ficha.

## 3. `ProgressSteps` sin `label-content-name-mismatch`

- [x] 3.1 Descripción fuera del botón (design D6). Tests en los cinco tipos y dos orientaciones: el texto visible del botón es su título, la descripción va justo después y es su `aria-describedby`; sin `onChange`, igual que antes. Mutación: con el código anterior fallan los seis casos con descripción.
- [x] 3.2 e2e con axe y `label-content-name-mismatch` sobre todos los tipos navegables; con el código anterior falla. Ficha.

## 4. Cierre

- [x] 4.1 Changeset `patch` (0.8.1).
- [x] 4.2 Comprobaciones completas: tests del paquete, `biome ci`, `typecheck build`, `check:size`, `check:js` y e2e de la web.
