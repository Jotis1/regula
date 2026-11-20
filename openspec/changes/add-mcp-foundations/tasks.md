# Tasks

## 1. Extraer el texto de los fundamentos

- [x] 1.1 `satteri` y `acorn` en `dependencies` de `apps/docs`, con las versiones exactas que ya están en el árbol (D1 y D3). Comprobar con `bun install --frozen-lockfile` sin paquetes nuevos en `bun.lock` y con `bun run check:dev`
- [x] 1.2 `src/lib/foundations-json.ts` con:
  - el mapa `TEXT`, `CONTAINERS` y `DEMOS` (D2);
  - la lectura de los literales (D3);
  - el serializador de Markdown (D4);
  - el error con el nombre del componente o del nodo y el archivo.

  Comprobar con `test/foundations-json.test.ts`: los casos de D6, incluido el MDX inventado con `<Nuevo />`
- [x] 1.3 `src/pages/foundations.json.ts`, con las anclas de `render()` y las secciones de tokens (D4). Comprobar con el build y `e2e/foundations-json.spec.ts`: `/foundations.json` tiene los diez fundamentos, y las secciones de cada página coinciden con las del JSON

## 2. MCP

- [x] 2.1 `data.ts` carga `/foundations.json`, y `mcp-fixture.ts` lo sirve. Comprobar con `test/mcp.test.ts`
- [x] 2.2 `list_foundations` y `get_foundation` en `tools.ts` (D5), con su texto en `guide.ts`. Comprobar con `test/mcp-tools.test.ts`: listar, `Color`, `tipografía` y `colour`, que da error y propone `color`
- [x] 2.3 El grupo `foundations` en `search`, una entrada por sección. Comprobar con `search` y `semánticos` en `test/mcp-tools.test.ts`
- [x] 2.4 El test del servidor con un cliente MCP real: `tools/list` trae las dos herramientas, y cada una tiene una llamada con éxito y otra con error (`list_foundations` no tiene parámetros, así que solo la de éxito). Comprobar con `bun run --cwd apps/docs test`

## 3. Versión del contrato

- [x] 3.1 `src/features/mcp/contract.ts` con `API_VERSION` (`1.1.0`), `CONTRACT_TOOLS` y `API_HISTORY` (D7). El servidor se anuncia con `API_VERSION`, y los cinco JSON llevan `apiVersion`. Comprobar con los tres tests de D7 y con `initialize` en `test/mcp.test.ts`, que recibe `1.1.0`
- [x] 3.2 El historial del contrato en `/start/mcp/`. Comprobar con el build y con un e2e que encuentra `1.1.0` y `1.0.0` en la página
- [x] 3.3 `VER-012` y `VER-013` en `versioning.yaml` (D8). Comprobar con los tests de normas y del MCP (`list_standards` del área `versioning` trae trece normas)

## 4. Cierre

- [x] 4.1 Comprobar, en la vista previa de Vercel de la PR:
  - `/start/mcp/` lista las dos herramientas y el historial del contrato;
  - `/foundations.json` responde, con `apiVersion` `1.1.0`;
  - `/mcp` responde a `initialize` con la versión `1.1.0` y a `tools/list` con las nueve herramientas.

  Llamar a una herramienta no se puede comprobar en la vista previa: está protegida por Vercel Authentication y el servidor, al pedir sus propios JSON, recibe la página de acceso (le pasa igual a `get_standard`, no es de este cambio). Esa llamada queda para producción, en «Workflow follow-up».

  Pasan `bunx biome ci --error-on-warnings .`, `bun run check:dev` y `bunx turbo run build typecheck test`
- [ ] 4.2 Abrir la PR, con el CI en verde, y fusionarla tras la revisión del usuario

## Workflow follow-up

- Tras desplegar, comprobar que un cliente MCP se conecta a `https://regula.jotis.me/mcp` y lee un fundamento con `get_foundation` y `color` (requisito «Servidor comprobado»). Es la llamada que la vista previa no dejó comprobar.
- Archivar con `/opsx:archive` en una PR aparte, solo de `openspec/`.
