# Proposal

## Why

El MCP de Regula responde sobre normas, componentes, tokens e iconos, pero no sobre los fundamentos de diseño: principios, color, tipografía, layout, estados, contenido, iconografía, fondos, marca y stream. Un agente que diseña una pantalla consulta el `Button`, pero no lee la regla «casi todo es gris, el índigo marca lo interactivo». Sin esos fundamentos, usa bien cada componente y compone mal la pantalla.

Además, el MCP y los JSON públicos son una API de la que dependen agentes y programas, pero no tienen versión propia: el MCP se anuncia con la de `@jotis-me/react`, que dice qué se documenta y no qué contrato se ofrece. Quitar una herramienta no lo avisaría nada. Como este cambio es el primero que toca el contrato, es el momento de versionarlo.

## What Changes

- **`/foundations.json`**: un JSON público nuevo, generado en el build desde la colección `foundations`, la misma de las páginas. Trae cada fundamento con:
  - su título y su descripción;
  - su URL;
  - sus secciones (los `##` de la página), cada una con su texto en Markdown.
- **El texto incluye lo que hay dentro de los componentes de la página**, no solo el Markdown:
  - el pie de cada `Rule`, con la etiqueta de su veredicto («Esto sí», «Esto no»…);
  - los apartados de `Essentials`, `Terms`, `Formats` y `Fit`;
  - las excepciones de contraste de la página de color;
  - el pie de cada `Example`.

  Los componentes que solo pintan una demo (`Button`, `Badge`, `TokenExplorer`…) no aportan texto.
- **Herramientas nuevas en el MCP:**
  - `list_foundations`: los fundamentos con su descripción y los títulos de sus secciones;
  - `get_foundation`: un fundamento completo por su id (`color`), sin distinguir mayúsculas. Si no existe, devuelve un error con los más parecidos.
- **`search` busca también en los fundamentos**, en un grupo nuevo, `foundations`, cuyo detalle sale de `get_foundation`.
- **La página `/start/mcp/`** explica las dos herramientas nuevas.
- **El contrato del MCP y de los JSON tiene su propia versión SemVer**, que no es la de los paquetes:
  - arranca en **1.0.0** con lo que ya está en producción: las siete herramientas y los cuatro JSON;
  - este cambio, que añade dos herramientas y un JSON, lo sube a **1.1.0**;
  - el MCP la anuncia en `serverInfo.version` y cada JSON en un campo nuevo, `apiVersion`. El campo `version` de los JSON sigue siendo la versión de Regula que documentan, para no romper a nadie;
  - lo que se vaya a quitar se marca antes como deprecado y sigue funcionando al menos una menor;
  - `/start/mcp/` enseña el historial del contrato, versión a versión.
- **Dos normas nuevas en Versiones, para toda la suite:**
  - `VER-012`: una API pública de una app (MCP, JSON, HTTP) tiene su propia versión SemVer y la anuncia;
  - `VER-013`: en una API pública se deprecia en una menor y se quita en la siguiente mayor, como `VER-005` pide para los paquetes.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `mcp-server`:
  - las herramientas de fundamentos;
  - la búsqueda global, que incluye los fundamentos;
  - `/foundations.json` entre los datos públicos de los que lee el MCP;
  - la lista de herramientas de `tools/list`;
  - la versión del contrato, su deprecación y su historial.
- `engineering-standards`: las normas `VER-012` y `VER-013`.

## Impact

- **Web (`apps/docs`):**
  - un endpoint nuevo, `src/pages/foundations.json.ts`;
  - un módulo que saca el texto de los `.md` y `.mdx` de `src/content/foundations/`;
  - `src/features/mcp/data.ts`, que pasa a cargar cinco JSON;
  - `src/features/mcp/tools.ts`, con las dos herramientas y el grupo nuevo de `search`;
  - `src/features/mcp/guide.ts`;
  - un módulo nuevo, `src/features/mcp/contract.ts`, con la versión del contrato, sus herramientas y su historial, que usan el servidor, los cinco JSON y `/start/mcp/`;
  - `versioning.yaml`, con `VER-012` y `VER-013`.
- **Tests:**
  - el del JSON (las secciones coinciden con los `##` de cada página, y no se pierde el texto de `Rule` ni de `Essentials`);
  - los de las herramientas;
  - el del servidor con un cliente MCP real;
  - uno que falla si un MDX de fundamentos usa un componente que el extractor no conoce;
  - uno que falla si cambian las herramientas del MCP y no cambia la versión del contrato.
- **Dependencias:** `satteri` y `acorn` pasan a dependencias directas de la web, fijadas en las versiones que ya están en el árbol (la primera la usa Astro para el MDX). No entra ningún paquete nuevo.
- **Fuera de alcance:**
  - escribir desde el MCP;
  - devolver las demos renderizadas;
  - los tokens de cada fundamento, que ya da `search_tokens`;
  - servir dos versiones del contrato a la vez (`/mcp/v1`, `/mcp/v2`): un cliente MCP vuelve a pedir las herramientas al conectarse, así que solo hará falta el día que haya una mayor con usuarios de fuera.
