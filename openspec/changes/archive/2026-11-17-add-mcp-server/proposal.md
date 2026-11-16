# Proposal

## Why

Hoy un agente que programa una app de la suite solo puede leer Regula como una persona: navegando la web o descargando `/standards.json`. Le falta una forma directa de preguntar «¿qué norma aplica a los nombres de paquete?», «¿qué props tiene `Button`?», «¿qué token es el texto secundario?» o «¿cómo se importa el icono de buscar?». Un servidor MCP remoto en `https://regula.jotis.me/mcp` le da esas respuestas como herramientas, y es el siguiente paso del camino a la beta.

## What Changes

- Servidor MCP remoto en `https://regula.jotis.me/mcp`, por Streamable HTTP, sin sesión y sin autenticación. Solo de consulta: ninguna herramienta escribe nada.
- Herramientas, con nombres y descripciones en inglés:
  - normas: listar áreas y normas, leer una por ID y buscar;
  - componentes: listar por grupo y leer la ficha (descripción, guía, props, fragmentos de Next y Astro, URL);
  - tokens: buscar por nombre o por categoría, con su valor en cada tema;
  - iconos: buscar por nombre en las galerías (línea, banderas, tipos de archivo, pagos, cursores) y devolver cómo se importa.
  - una búsqueda global sobre todo lo anterior.
- Los textos que devuelve son los de la guía, en español. Cada resultado lleva la URL de su página en la web.
- Datos en JSON públicos, generados en el build desde las mismas fuentes que la web: `/components.json`, `/tokens.json` e `/icons.json`, junto al `/standards.json` que ya existe. El MCP los sirve; cualquier programa puede leerlos también.
- La web deja de ser solo estática: el adaptador de Vercel sirve `/mcp` en servidor; el resto de páginas sigue prerenderizado.
- Página nueva en Empezar, `/start/mcp/`, que explica cómo conectar un cliente (Claude Code y otros) y qué herramientas hay.

## Capabilities

### New Capabilities
- `mcp-server`: el servidor MCP de Regula, sus herramientas de consulta, los JSON públicos que lo alimentan y cómo se comprueba.

### Modified Capabilities
- `docs-site`: «Publicación en regula.jotis.me» deja de exigir un sitio solo estático (`/mcp` corre en servidor), y se añade la página `/start/mcp/`.

## Impact

- `apps/docs`: nuevas dependencias `@astrojs/vercel` y `@modelcontextprotocol/sdk`; ruta `src/pages/mcp.ts` en servidor; lógica en `src/mcp/`; endpoints `components.json`, `tokens.json` e `icons.json`; página `start/mcp.mdx`; navegación de Empezar.
- Build y CI: el adaptador puede cambiar dónde queda la salida estática y si `astro preview` sigue sirviendo la web. Lo leen pagefind, `check:js`, Lighthouse y Playwright; hay que comprobarlo antes que nada (design D2).
- Vercel: `/mcp` pasa a ser una función. Coste dentro del plan Hobby; sin variables de entorno ni secretos.
- Nada cambia en los paquetes publicados; no hay changeset.
