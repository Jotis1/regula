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

`/components/` se añade a `lighthouserc.json` en el segundo commit de la PR #16, que no cambia nada más (ejecución 42373677196, 7 nov). Lighthouse CI comprueba la mediana de tres pasadas por URL (`aggregationMethod: median-run`, umbral 0,9) y la anotación del CI enseña otra, la ejecución «representativa». Por eso la anotación puede estar por debajo de 0,9 con la aserción en verde, como aquí.

| | Partida (fotos WebP) | Después |
|---|---|---|
| Aserción de `lhci` (mediana de 3, ≥ 0,9) | pasa | |
| Rendimiento (ejecución representativa) | 84 | |
| LCP (representativa) | 4,2 s | |
| TBT (representativa) | 74 ms | |
| Accesibilidad (representativa) | 100 | |

Es una medida ruidosa: en esa misma ejecución `/` dio 88 (TBT 336 ms) y 96 en otras. Se compara con eso en cuenta.
