# Proposal

## Why

El MCP de Regula responde sobre normas, componentes, tokens e iconos, pero no sobre los fundamentos de diseño: principios, color, tipografía, layout, estados, contenido, iconografía, fondos, marca y stream. Un agente que diseña una pantalla consulta el `Button`, pero no lee la regla «casi todo es gris, el índigo marca lo interactivo». Sin esos fundamentos, usa bien cada componente y compone mal la pantalla.

## What Changes

- **`/foundations.json`**: un JSON público nuevo, generado en el build desde la colección `foundations`, la misma de las páginas. Trae cada fundamento con:
  - su título y su descripción;
  - su URL;
  - sus secciones (los `##` de la página), cada una con su texto en Markdown.
- **El texto incluye lo que hay dentro de los componentes de la página**, no solo el Markdown:
  - el pie de cada `Rule`, con la etiqueta de su veredicto («Esto sí», «Esto no»…);
  - los apartados de `Essentials`, `Terms`, `Formats` y `Fit`;
  - el pie de cada `Example`.

  Los componentes que solo pintan una demo (`Button`, `Badge`, `TokenExplorer`…) no aportan texto.
- **Herramientas nuevas en el MCP:**
  - `list_foundations`: los fundamentos con su descripción y los títulos de sus secciones;
  - `get_foundation`: un fundamento completo por su id (`color`), sin distinguir mayúsculas. Si no existe, devuelve un error con los más parecidos.
- **`search` busca también en los fundamentos**, en un grupo nuevo, `foundations`, cuyo detalle sale de `get_foundation`.
- **La página `/start/mcp/`** explica las dos herramientas nuevas.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `mcp-server`:
  - las herramientas de fundamentos;
  - la búsqueda global, que incluye los fundamentos;
  - `/foundations.json` entre los datos públicos de los que lee el MCP;
  - la lista de herramientas de `tools/list`.

## Impact

- **Web (`apps/docs`):**
  - un endpoint nuevo, `src/pages/foundations.json.ts`;
  - un módulo que saca el texto de los `.md` y `.mdx` de `src/content/foundations/`;
  - `src/mcp/data.ts`, que pasa a cargar cinco JSON;
  - `src/mcp/tools.ts`, con las dos herramientas y el grupo nuevo de `search`;
  - `src/mcp/guide.ts`.
- **Tests:**
  - el del JSON (las secciones coinciden con los `##` de cada página, y no se pierde el texto de `Rule` ni de `Essentials`);
  - los de las herramientas;
  - el del servidor con un cliente MCP real;
  - uno que falla si un MDX de fundamentos usa un componente que el extractor no conoce.
- **Dependencias:** `satteri` pasa a dependencia directa de la web, fijada en la versión que ya usa Astro para el MDX. No entra ningún paquete nuevo en el árbol.
- **Orden:** este cambio se archiva después de `add-development-standards` (PR #47), que también modifica `mcp-server`. Sus escenarios ya usan `NAM-001`.
- **Fuera de alcance:**
  - escribir desde el MCP;
  - devolver las demos renderizadas;
  - los tokens de cada fundamento, que ya da `search_tokens`.
