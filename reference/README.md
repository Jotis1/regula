# reference/

**Carpeta congelada.** Copia de la última versión del artefacto "Jotis.me" de Claude antes de que el repo pasara a ser la fuente de verdad (versión `1793805785-9fe2`, ver `VERSION`). Solo lectura: no se edita, no se publica y **ningún código, script ni test del repo la lee**. CI lo comprueba.

Se conserva para tres cosas:

- **Procedencia.** De aquí salieron las 74 fichas de `apps/docs/src/content/components/`, los datos de iconos y de iconos de app, los SVG de adornos y patrones y las capturas aprobadas de `apps/docs/e2e/visual/approved/`. Los comentarios de procedencia del código citan ficheros de esta carpeta.
- **Copia para deshacer.** Si la primera sincronización del repo al artefacto sale mal, se republican estos ficheros en el artefacto, sin `"editing": "code"`, y el artefacto vuelve a su estado anterior. El repo no depende del artefacto en ningún paso.
- **Contraste.** Para ver cómo era algo antes de este cambio.

Desde esta versión el sentido es el contrario: el repo genera el artefacto (`bun run artifact:build`) y no al revés. Los cambios se hacen en el repo.

## Contenido

- `GUIA.md`: la guía (el `README.md` del artefacto).
- `tokens.json`, `design-system.json`: tokens y metadatos.
- `components/<Nombre>/README.md` y `preview.html`: ficha y vista previa de cada componente.
- `components/index.d.ts`, `bundle.js`, `bundle.css`: tipos e implementación de las vistas previas.
- `assets/*/README.md`: notas de cada grupo de recursos; `assets/App icons/*.svg`, los iconos de app.
- `docs-design/`: los diseños de la web de documentación.
