# Tasks

Comandos: `bun run --cwd packages/react test`, `bunx biome ci .`, `bunx turbo run typecheck build`, `bun run --cwd packages/react check:size`, `bun run --cwd apps/docs check:js` y los e2e de `apps/docs`.

## 1. Base común

- [x] 1.1 `redemption` en `StreamEventType` y `STREAM_EVENTS` (`Gift01`, «Canje de puntos»), `reward` en `StreamEventData`, `streamDetail` y `streamShort`, y `reward` en `StreamAlert` y en los elementos de `StreamEvents` (design D5). Tests: «Alerta de canje», «Canje en la lista», que sin `reward` dice «Ha canjeado una recompensa.» y que los textos de los demás tipos no cambian
- [x] 1.2 Textos nuevos en `strings.ts` (design D10)

## 2. `ChatBox`: arreglos y chat seleccionable

- [x] 2.1 Sacar la fila del mensaje a `internal/chat-line.tsx`, sin cambiar nada. Verificar con `renderToString` que el HTML de `ChatBox` es idéntico al de `main` en todos los ejemplos de su ficha. Así los cambios de 2.2 y 2.3 se ven aparte en el diff
- [x] 2.2 Enlaces en el texto con `internal/links.ts` (design D7).
  - Tests de la función:
    - «Mensaje con enlace», sin el punto final.
    - «Con www» y «Sin protocolo».
    - Paréntesis y signos al final.
    - Varios enlaces en un mensaje, y un texto sin enlaces.
  - Tests del componente: «Enlace con HTML» y que no hay ningún `<a>`.
- [x] 2.3 Insignias, nombre y dos puntos en un grupo que no se parte, con las insignias centradas en una caja de una línea de alto (design D8). Verificar en Playwright, a 420 px y con el texto a 20 y a 30 px:
  - «Mensaje largo con insignias»: la caja de las insignias y la del nombre en la misma línea.
  - «Insignias centradas»: los centros a ±1 px.
- [x] 2.4 `onSelect`, `selectedId` y `selectable` (design D6). Tests: «Elegir un mensaje», «Elegido a la vista», «Mensaje no seleccionable», «Con teclado» y «Sin onSelect». axe sin errores con `onSelect`
- [x] 2.5 Ejemplo de `ChatBox` en la web (design D9):
  - Con `animate`, un mensaje cada 2,5 s en ventana deslizante de 8. La lista preparada incluye uno con enlace y uno largo con tres insignias.
  - Sin `animate`, quieto.
  - El código enseña solo `<ChatBox messages={…} animate />`.
  - e2e «Encender la animación» y «Animación apagada».
- [x] 2.6 Ejemplo «Seleccionable» y los enlaces en la ficha de `ChatBox`, con su e2e («Elegir en la ficha»). Sustituir sus capturas aprobadas por unas nuevas, con un enlace y un mensaje largo con insignias, y explicar el motivo en el PR

## 3. Piezas nuevas

- [x] 3.1 `StreamPoll` (design D1). Tests: «Encuesta en marcha», «Predicción bloqueada», «Resultado», «Sin votos», `seconds` en m:ss, `motion` con la entrada y la salida comunes, y de 2 a 10 opciones
- [x] 3.2 `StreamCounter` (design D2). Tests: «Dos contadores», «Cambio de cifra», que se ignora a partir del tercero, y que `NaN`, −1 y 2,5 se pintan como 0
- [x] 3.3 `StreamPinnedMessage` (design D3). Tests: «Mensaje con HTML», «Mensaje de 500 caracteres» (en Playwright, con la altura de cuatro líneas) y que la fila es la de `ChatBox`
- [x] 3.4 `StreamMeter` (design D4). Tests: «Nivel», «Valor fuera de rango» y «Lleno con movimiento reducido»
- [x] 3.5 Exportar las cuatro desde el índice con sus tipos. Comprobar «Exportaciones» y «Catálogo coherente», y que `check:size` sigue dentro del límite

## 4. Web y artefacto

- [x] 4.1 Ficha, página y ejemplo interactivo de las cuatro piezas (design D10), con sus fragmentos de Next.js y de Astro
- [ ] 4.2 Capturas en oscuro de las cuatro, de la página y de la card, y regresión visual del resto del catálogo sin cambios. Verificar con el visto bueno del usuario en el PR
- [x] 4.3 Regenerar el artefacto y comprobar que trae las cuatro fichas

## 5. Cierre

- [x] 5.1 Changeset `minor` (0.9.0)
- [x] 5.2 Comprobaciones completas: tests del paquete, `biome ci`, `typecheck build`, `check:size`, `check:js` y e2e de la web. `openspec validate add-live-interaction-pieces --strict` sin errores
- [ ] 5.3 Publicar 0.9.0 en npm y comprobarlo con `npm view @jotis-me/react version`
