# Tasks

Comandos: `bunx biome ci .`, `bunx turbo run build typecheck test`, `bun run --cwd apps/docs check:js` y los e2e de `apps/docs`.

## 1. Adaptador y build

- [x] 1.1 Probar `@astrojs/vercel` con una ruta `/mcp` de prueba (`prerender = false`) según D2. Después de `bun run build`, comprobar estas cuatro cosas:
  - pagefind indexa las páginas;
  - `check:js` pasa;
  - `astro preview` sirve la web en el 4321 y pasan `header.spec.ts` y `search.spec.ts`;
  - la salida tiene `/mcp` como función.

  Anotar en `design.md` qué variante queda: el adaptador siempre o el plan B con `process.env.VERCEL`.
- [x] 1.2 Dejar la variante elegida en `astro.config.mjs`. Ajustar las rutas de `dist` en pagefind, `check:js`, `lighthouserc.json` y `playwright.config.ts` si el adaptador las movió. Verificar con el build completo y con `check:js`

## 2. JSON públicos

- [x] 2.1 `componentsJson` en `src/lib/`: grupo, descripción, guía (cuerpo de la ficha), props de `propsOf`, `interactive`, `astroNote`, fragmentos de `snippetsOf`, `url` y `version`. Endpoint `/components.json`. Test: `Button` trae `hierarchy` con sus cinco valores y los dos fragmentos; están los 130 componentes
- [x] 2.2 `tokensJson`: las categorías de `@jotis-me/tokens` aplanadas en `{ name, category, value, usage }`, con `value` por tema cuando lo trae la fuente. Endpoint `/tokens.json`. Test: `text-secondary` trae `light` y `dark`; `spacing-none` trae un valor único
- [x] 2.3 Sacar el montaje de las entradas de cada galería de las páginas de `icons/` a `src/lib/gallery-entries.ts` (D1). Las páginas pasan a usarlo sin cambiar su HTML; verificar con los e2e de iconos
- [x] 2.4 `iconsJson` con cada entrada, su galería, sus variantes, su `import` y su `url`. Endpoint `/icons.json`. Test: `SearchLg` trae `import { SearchLg } from "@untitledui/icons"` y la bandera `es` tiene el título de España. Medir el tamaño y anotarlo en la PR

## 3. Servidor MCP

- [x] 3.1 Dependencia `@modelcontextprotocol/sdk` con versión fijada. Crear `src/mcp/data.ts` con `RegulaData` y `loadData(origin)`, que guarda los datos en memoria (D4 y D5)
- [x] 3.2 Crear `src/mcp/tools.ts` con siete herramientas puras:
  - `list_standards` y `get_standard`;
  - `list_components` y `get_component`;
  - `search_tokens`;
  - `search_icons`;
  - `search`.

  Requisitos comunes:
  - normalizar el texto como la web;
  - ordenar los resultados por coincidencia exacta, después por prefijo y después por contenido;
  - limitar a 20 resultados por defecto y a 50 como máximo;
  - en los errores, dar sugerencias por parecido.

  Tests unitarios con los escenarios de la spec `mcp-server`: `git-001`, `NOM-999`, `button`, `Botón`, `text-secondary`, `search-lg`, `españa` con `flags` y `dominio inverso`
- [x] 3.3 Crear `src/mcp/server.ts`:
  - `createServer(data)` con `McpServer`, nombre `regula`, la versión de la web, esquemas Zod y `readOnlyHint` en todas las herramientas;
  - `handle(request, load)` con el transporte sin sesión de D3. Un `GET` o un `DELETE` devuelven 405 con el enlace a `/start/mcp/`;
  - un array exportado con las herramientas, para la página.
- [x] 3.4 Crear `src/mcp/route.ts`, que llama a `handle` y se inyecta como `/mcp` desde la integración de `astro.config.mjs` cuando existe `VERCEL` (D2). Verificar: el build con `VERCEL=1` genera `_render.func` (en Windows solo falla el enlace simbólico) y la preview de Vercel responde a `initialize`
- [x] 3.5 Crear `test/mcp.test.ts` con `Client` del SDK contra `handle` (D6), usando un `fetch` falso. Cubrir `initialize` (nombre y versión), `tools/list` (siete herramientas, todas de solo lectura), una llamada con éxito y otra con error por herramienta, la llamada sin `query` y el `GET` con 405

## 4. Guía

- [x] 4.1 Página `src/pages/start/mcp.mdx` (D7). Debe tener:
  - la URL;
  - el aviso de que es solo de consulta;
  - un `CodeSnippet` con `claude mcp add --transport http regula https://regula.jotis.me/mcp`;
  - la configuración JSON genérica;
  - la tabla de herramientas, que sale del array de `server.ts`;
  - los cuatro JSON.
- [x] 4.2 Añadir la entrada «Servidor MCP» en Empezar de `nav.ts`, detrás de Instalación, con palabras clave para la búsqueda (`mcp agente ia claude`). Actualizar los tests de `sidenav` si cuentan las entradas
- [x] 4.3 e2e del escenario «Conectar desde la guía», con el comando copiable y la página marcada en la navegación (`e2e/mcp.spec.ts`), y axe en los dos temas para `/start/mcp/`, que ya cubre el recorrido de `a11y.spec.ts`

## 5. Entrega

- [ ] 5.1 Comprobaciones locales en verde:
  - `bunx biome ci .`;
  - `bunx turbo run build typecheck test`;
  - `check:js`;
  - los e2e afectados;
  - `openspec validate add-mcp-server --strict`.
- [ ] 5.2 PR con Conventional Commits en español y el CI en verde
- [ ] 5.3 Tras fusionar, comprobar a mano en producción con Claude Code: `initialize`, `tools/list` y una llamada por herramienta. Dejar el resultado en la PR. Verificar con el visto bueno del usuario

## Workflow follow-up

- `/opsx:archive add-mcp-server` cuando 5.3 esté hecha.
