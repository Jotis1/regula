# Design

## Context

- `apps/docs` es Astro 7 sin adaptador. Vercel lo construye y lo sirve como estático. La salida en `dist/` la leen pagefind (`--site dist`), `check:js`, Lighthouse y Playwright, que lanza `astro preview` en el puerto 4321.
- Fuentes de datos que ya existen:
  - normas: la colección `standards` y `standardsJson`, que ya sirve `/standards.json`;
  - componentes:
    - la colección `components`, con frontmatter y cuerpo de la ficha;
    - `propsOf`, que lee los tipos con react-docgen-typescript en el build;
    - `snippetsOf`, que da los fragmentos de Next y Astro;
    - los grupos de `catalog.ts`;
  - tokens: `@jotis-me/tokens/tokens.json`, con las categorías `color`, `type`, `spacing`, `radius`, `width`, `shadow` y `blur`. Cada token lleva `value` (por tema cuando cambia entre temas) y `usage`;
  - iconos: `gallery.ts` (`GalleryEntry`, `searchText`, `kebab` y `pascal`) y las páginas de cada galería, que montan las entradas.
- react-docgen y la lectura de los SVG necesitan el código fuente y `node_modules`. Funcionan en el build, no en una función de Vercel.

## Goals / Non-Goals

**Goals:**
- Que los datos del MCP y los de las páginas salgan del mismo código, en el mismo build.
- Que la lógica del servidor sea una función pura `Request → Response` que se pueda probar sin Vercel.
- Que las páginas sigan saliendo exactamente como hoy (mismo HTML, mismo JS y misma búsqueda).

**Non-Goals:**
- Recursos MCP, prompts y herramientas que escriban: llegarán en cambios posteriores si hacen falta.
- Autenticación, sesiones y límites de uso propios. Si hace falta, se usará el firewall de Vercel.
- Servir el SVG de los iconos: el MCP da el nombre y el import, y la URL de la galería para verlo.

## Decisions

### D1. Datos precalculados en JSON estáticos

Los endpoints `components.json.ts`, `tokens.json.ts` e `icons.json.ts` se prerenderizan, igual que `standards.json.ts`, con las funciones que ya usan las páginas. Para no repetirlas, la construcción de cada payload va a `src/lib/` (`componentsJson`, `tokensJson` e `iconsJson`). El endpoint y los tests las llaman igual.

Las entradas de las galerías se montan hoy dentro de cada página de `icons/`. Ese montaje sale a una función por galería en `src/lib/gallery-entries.ts`, que usan la página y `iconsJson`. En el JSON no van las URL de los SVG: cada entrada lleva su `import` y la URL de su galería (`/icons/?icon=SearchLg`, `/icons/flags/?icon=es`…).

**Alternativa descartada:** calcular los datos en la función en cada petición. react-docgen y la lectura de los SVG no funcionan sin el código fuente, y meter todo `@untitledui/icons` en la función la haría pesada.

### D2. `@astrojs/vercel` con una sola ruta en servidor, comprobado antes que nada

Se añade `@astrojs/vercel` y `src/pages/mcp.ts` con `export const prerender = false`. Todo lo demás sigue en el modo estático por defecto de Astro.

El adaptador puede cambiar dos cosas de las que depende el CI:
- dónde queda la salida estática, ya que puede escribir en `.vercel/output/static`;
- si `astro preview` sigue funcionando, porque `@astrojs/vercel` no tiene preview.

La primera tarea fue esa prueba, y con el adaptador siempre activo se rompen dos cosas: la web estática pasa a `dist/client` (pagefind, `check:js`, Lighthouse y `astro preview` dejan de encontrarla) y en Windows el empaquetado de la función falla con `EPERM` al crear enlaces simbólicos. **Variante elegida: el plan B.** `astro.config.mjs` registra el adaptador y una integración propia que llama a `injectRoute({ pattern: "/mcp", entrypoint: "./src/mcp/route.ts", prerender: false })` solo cuando existe `process.env.VERCEL`. En local y en CI el build es estático como hoy, y el servidor se prueba por su manejador (D4 y D6).

En Vercel el adaptador deja la web en `.vercel/output/static`, así que el índice de pagefind lo construye `scripts/search-index.ts`, que elige esa carpeta o `dist` según el entorno. El build con `VERCEL=1` en Windows llega a generar `_render.func` y solo falla en el enlace simbólico; lo confirma la preview de Vercel, que corre en Linux.

### D3. SDK oficial, sin sesión, sobre Request/Response

`@modelcontextprotocol/sdk` aporta `McpServer` y `WebStandardStreamableHTTPServerTransport`, configurado con `sessionIdGenerator: undefined` y `enableJsonResponse: true`.

En cada petición se crea un servidor y un transporte nuevos: es el patrón sin estado del SDK y no deja nada entre peticiones. Los parámetros se validan con Zod; el SDK lo integra y da los errores de parámetro como error de herramienta.

Todas las herramientas llevan `annotations: { readOnlyHint: true, openWorldHint: false }`. Un `GET` o un `DELETE` responden 405 con un enlace a `/start/mcp/`.

**Alternativa descartada:** escribir JSON-RPC a mano. Ahorra una dependencia, pero deja en nuestras manos la negociación de versiones del protocolo y los detalles del transporte.

### D4. `src/mcp/`: datos inyectados

- `src/mcp/data.ts`:
  - `type RegulaData = { standards; components; tokens; icons; version; site }`;
  - `loadData(origin)`, que descarga los cuatro JSON del mismo despliegue y los guarda en memoria mientras dura la instancia.
- `src/mcp/tools.ts`: una función por herramienta, `(data, args) → resultado`. Son puras y se prueban con datos de ejemplo.
- `src/mcp/server.ts`: `createServer(data)`, que registra las herramientas, y `handle(request, load)`, que devuelve la `Response`.
- `src/pages/mcp.ts`: tres líneas que llaman a `handle` con `loadData(new URL(request.url).origin)`.

Las búsquedas usan la misma normalización que la web, sin tildes ni mayúsculas (`searchText` de `gallery.ts` y su equivalente para el resto). Ordenan así:
1. coincidencia exacta de nombre o ID;
2. prefijo;
3. contenido.

### D5. Leer los JSON del propio despliegue

La función descarga `/standards.json`, `/components.json`, `/tokens.json` e `/icons.json` de su propio origen. Es la forma más simple de cumplir «sin otra fuente»: lo que responde el MCP es byte a byte lo que se publica.

**Riesgo:** la protección de despliegues de Vercel puede devolver 401 en las previews. En producción no hay protección. En las previews, la comprobación manual usa el bypass de Vercel o se hace tras fusionar.

**Alternativa:** `includeFiles` del adaptador para empaquetar los JSON en la función y leerlos con `fs`. Se queda como plan B si el `fetch` falla en producción.

### D6. Tests con un cliente MCP real

`test/mcp.test.ts` (Vitest) carga datos de ejemplo construidos con las mismas funciones `*Json`. Conecta `Client` y el transporte HTTP del SDK a `handle` mediante un `fetch` falso que llama al manejador sin red. Cubre:
- `initialize` y `tools/list`;
- por cada herramienta, una llamada con éxito y otra con error.

Las funciones de `tools.ts` tienen además tests unitarios propios.

La comprobación tras desplegar es manual: `claude mcp add --transport http regula https://regula.jotis.me/mcp` y una consulta. Se apunta en la PR.

### D7. Página `/start/mcp/`

Es una página MDX en `src/pages/start/mcp.mdx`, con el layout de `install.mdx`, y una entrada en la navegación de Empezar (`nav.ts`), detrás de Instalación. Contiene:
- la URL y el aviso de solo consulta;
- un `CodeSnippet` con el comando de Claude Code y otro con la configuración JSON genérica (`"type": "http"`, `"url"`);
- una tabla de herramientas;
- los JSON públicos.

La lista de herramientas de la página sale del registro del servidor, de un array exportado por `server.ts`. Así la página y `tools/list` no se separan.

## Risks / Trade-offs

- **El adaptador rompe `dist` o `astro preview`.** Mitigación: lo comprueba la primera tarea, y el plan B de D2 deja el build local como hoy.
- **El `fetch` al propio origen falla o tarda.** Mitigación: los datos se guardan en memoria por instancia. Si falla, la herramienta da un error claro y el plan B es `includeFiles` (D5).
- **Los JSON públicos crecen.** `/icons.json` trae unas 1.200 entradas de línea más las otras galerías, sin SVG; se estima por debajo de 500 kB. Se mide en el build.
- **Abuso del endpoint público.** Solo lee datos públicos y estáticos, y cada respuesta está acotada (máximo 50 resultados). Si hiciera falta, se añade una regla de límite en el firewall de Vercel, sin tocar código.
- **Versión del protocolo MCP.** La negocia el SDK. Se fija la versión del SDK en el `package.json` y se actualiza con cuidado.

## Migration Plan

1. Fusionar con el CI en verde. Vercel despliega `/mcp` como función y el resto como estático.
2. Comprobar a mano en producción: `initialize`, `tools/list` y una llamada por herramienta desde Claude Code.
3. Vuelta atrás: revertir el merge. Las páginas no cambian, así que no hay nada que migrar.

## Open Questions

- Si las previews de Vercel tienen la protección activa, la comprobación del paso 2 se hace en producción en vez de en la preview. No cambia el diseño.
