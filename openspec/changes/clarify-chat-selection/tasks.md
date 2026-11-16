# Tasks

Comandos: `bun run --cwd packages/react test`, `bunx biome ci .`, `bunx turbo run typecheck build`, `bun run --cwd packages/react check:size`, `bun run --cwd apps/docs check:js` y los e2e de `apps/docs`.

## 1. `ChatBox`

- [x] 1.1 Textos en `strings.ts`: `chatSelect`, `chatSelected` y `chatSelectName` (design D3 y D4)
- [x] 1.2 Marca de la acción, aspecto del elegido, nombre accesible y `labels` en `ChatBox` (design D1–D4). Tests: «Elegido a la vista», «Nombre del botón», «Otros textos», «Mensaje no seleccionable» sin marca, «Sin onSelect» sin botones ni marca, y axe sin errores en los dos temas

## 2. Web y artefacto

- [x] 2.1 Ficha de `ChatBox` y un chat seleccionable en su ejemplo visual
- [x] 2.2 e2e «Qué hace el clic» (la marca sale al pasar por encima y el texto no se mueve) y «En táctil» (con `hasTouch` y sin hover, la chincheta sin texto)
- [ ] 2.3 Capturas de `ChatBox` en claro y en oscuro sustituidas a propósito, y regresión visual del resto sin cambios. Verificar con el visto bueno del usuario
- [x] 2.4 Regenerar el artefacto y comprobar que trae la ficha nueva

## 3. Arreglos

- [x] 3.1 `ChatBox` seleccionable sin recortes al rotar y con la marca solo en la primera línea (design D1). e2e «Chat lleno» en la ficha con `animate` y «Marca en la primera línea»
- [x] 3.2 `CodeSnippet`: el destacado de borde a borde (design D5). e2e con una pista larga en el ejemplo de `Input`
- [x] 3.3 `/changelog/`: sublistas, entrada que empieza por lista, tablas, negrita con código y sin las subidas de dependencias como arreglos (design D6). Tests de `changeBlocks` y de `inline`, y e2e de la 0.9.0

## 4. Cierre

- [x] 4.1 Changeset `minor` (0.10.0)
- [x] 4.2 Comprobaciones completas y `openspec validate clarify-chat-selection --strict` sin errores
- [ ] 4.3 Publicar 0.10.0 en npm y comprobarlo con `npm view @jotis-me/react version`
