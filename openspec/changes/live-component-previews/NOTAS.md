# Notas

## Medida de `/components/` (tarea 1.1 y 5.1)

Lighthouse no se puede ejecutar en esta máquina (Chrome bloqueado y Lighthouse se cuelga con el Chromium de Playwright), así que se mide de dos formas (design D5, decisión del usuario).

### Local

`bun run scripts/measure-page.ts /components/ [--scroll]` en `apps/docs`, con la web construida y `astro preview`. Chromium de Playwright por CDP, emulación móvil (412×823, CPU a 4×, red 4G lenta, sin caché), mediana de varias pasadas.

| | Partida (fotos WebP, 6 nov) | Después |
|---|---|---|
| HTML transferido | 21,9 kB | |
| Peticiones al cargar | 20 | |
| Transferido al cargar | 525,8 kB | |
| Peticiones con scroll hasta el final | 93 | |
| Transferido con scroll hasta el final | 1.004,8 kB | |
| Nodos del DOM | 2.068 | |
| Maquetación | 701 ms | |
| Cálculo de estilos | 74 ms | |
| Scripts | 290 ms | |
| Tareas (total) | 1.457 ms | |

El HTML sin comprimir pesa 238.528 bytes y las 156 WebP del endpoint suman 1.198.744 bytes.

### CI (Lighthouse)

`/components/` se añade a `lighthouserc.json` en el primer commit de la PR, que no cambia nada más. La nota de ese commit es la de partida.

| | Partida | Después |
|---|---|---|
| Rendimiento (mediana) | | |
| Accesibilidad (mediana) | | |
