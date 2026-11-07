900 ms |204 ms |34 ms |406 ms |4.377 |535,2 kB |15 |535,2 kB |15 |60,9 kB |900 ms |204 ms |34 ms |406 ms |4.377 |535,2 kB |15 |535,2 kB |15 |60,9 kB |# Notas

## Medida de `/components/` (tarea 1.1 y 5.1)

Lighthouse no se puede ejecutar en esta máquina (Chrome bloqueado y Lighthouse se cuelga con el Chromium de Playwright), así que se mide de dos formas (design D5, decisión del usuario).

### Local

`bun run scripts/measure-page.ts /components/ [--scroll]` en `apps/docs`, con la web construida y `astro preview`. Chromium de Playwright por CDP, emulación móvil (412×823, CPU a 4×, red 4G lenta, sin caché), mediana de varias pasadas.

| | Partida (fotos WebP, 6 nov) | Después |
|---|---|---|
| HTML transferido | 21,9 kB | 60,9 kB |
| Peticiones al cargar | 20 | 15 |
| Transferido al cargar | 525,8 kB | 535,2 kB |
| Peticiones con scroll hasta el final | 93 | 15 |
| Transferido con scroll hasta el final | 1.004,8 kB | 535,2 kB |
| Nodos del DOM | 2.068 | 4.377 |
| Maquetación | 701 ms | 406 ms |
| Cálculo de estilos | 74 ms | 34 ms |
| Scripts | 290 ms | 204 ms |
| Tareas (total) | 1.457 ms | 900 ms |

El HTML sin comprimir pesa 238.528 bytes y las 156 WebP del endpoint suman 1.198.744 bytes.

**Después (7 nov, mediana de 5; con scroll, de 3):** el HTML sin comprimir pasa a 514.574 bytes y ya no hay WebP. El HTML crece unos 39 kB comprimido, pero ya no se piden las 156 fotos: con scroll hasta el final se transfieren 535,2 kB en lugar de 1.004,8 kB, y 15 peticiones en lugar de 93. Los nodos del DOM se duplican (2.068 → 4.377), que es el coste esperado de pintar 78 componentes en lugar de 78 `<img>`. Aun así, maquetación, estilos, scripts y tareas bajan al cargar, gracias a `content-visibility` (D5): las cards fuera de pantalla no se maquetan. Con scroll hasta el final las tareas suben a 2.109 ms (maquetación 716 ms, estilos 260 ms) porque se acaban maquetando todas. La partida no tiene esa cifra con scroll, así que no se compara. No se aplica la salida del riesgo «DOM grande»: lo que se paga es al hacer scroll, repartido, y no al cargar.

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
