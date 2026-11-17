# Design

## Context

- **Las páginas.** Los fundamentos son diez archivos de `apps/docs/src/content/foundations/` (nueve `.mdx` y `brand.md`), en la colección `foundations`, con `title`, `description` y `order` en el frontmatter. `src/pages/foundations/[slug].astro` los pinta con `render()`. Los `##` llevan el `id` que les pone el procesador. Tipografía, layout y estados añaden al final unas secciones de tablas de tokens (`tokenSections` en `src/lib/tokens.ts`).
- **Dónde está el texto.** Gran parte del texto que importa está en props de componentes de `src/components/compose/`:
  - `Rule`: `verdict` y `caption`;
  - `Example`: `caption`;
  - `Essentials`: `items[].title` y `items[].text`;
  - `Terms`: `items[].term` y `items[].text`;
  - `Formats`: `items[].label` y `items[].value`;
  - `Fit`: `fits`, `nots`, `fitsLabel` y `notsLabel`.

  `Pair` solo agrupa dos `Rule`. Los demás (`Button`, `Badge`, `Input`, `Alert`, `TokenExplorer`, `ContrastExceptions`…) son demos.
- **El MCP lee los JSON públicos.** El MCP (`src/features/mcp/`) carga hoy cuatro JSON públicos (`data.ts`) y responde solo con ellos (requisito «Datos públicos en JSON»).
- **Astro 7 no usa remark.** El MDX lo procesa `satteri` (`@astrojs/markdown-satteri`), que ya está en el árbol en la versión 0.10.5 y exporta `mdxToMdast`. Probado con `color.mdx`:
  - devuelve un mdast con `mdxJsxFlowElement`;
  - los atributos de texto llegan como cadenas (`caption`);
  - los de expresión llegan como el código fuente del literal (`items={[{ title: "Fondos", … }]}`).

## Goals / Non-Goals

**Goals:**
- Que un agente lea por el MCP lo mismo que dice la página de un fundamento, con sus reglas de «Esto sí» y «Esto no».
- Una sola fuente: el JSON sale de los mismos archivos que la página.
- Que un componente nuevo en un fundamento no pierda su texto sin que nadie se entere.

**Non-Goals:**
- Renderizar las demos ni devolver HTML.
- Repetir los tokens: las secciones de tablas de tokens remiten a `search_tokens`.
- Cambiar cómo se escriben los fundamentos.

## Decisions

### D1. Leer el MDX con `satteri`, no renderizar la página

`src/lib/foundations-json.ts` parsea el cuerpo de cada entrada (`entry.body`) con `mdxToMdast` y recorre el árbol. `satteri` pasa a `dependencies` de la web con la versión exacta que ya resuelve Astro (`0.10.5`): es 0.x, así que VER exige fijarla. No entra nada nuevo en `bun.lock` salvo la línea del workspace.

Alternativas descartadas:
- **Renderizar con el Container API de Astro y quitar las etiquetas.** Necesita los renderers de React, pinta las demos y mezcla su texto («Pagado», «Exportar») con el de la guía.
- **Leer el HTML del build.** Los JSON se generan durante el build, antes de que las páginas existan como archivos.
- **Añadir `remark-parse` y `remark-mdx`.** Serían paquetes nuevos para algo que ya hace una dependencia que tenemos.

### D2. Un mapa explícito de componentes (KISS)

```ts
const TEXT: Record<string, (props) => string[]> = {
	Rule: (p) => [`**${VERDICT[p.verdict]}.** ${p.caption}`],
	Example: (p) => [p.caption],
	Essentials: (p) => p.items.map((i) => `**${i.title}.** ${i.text}`),
	Terms: (p) => p.items.map((i) => `**${i.term}.** ${i.text}`),
	Formats: (p) => p.items.map((i) => `**${i.label}.** ${i.value}`),
	Fit: (p) => [`**${p.fitsLabel ?? "Cabe"}:** ${p.fits.join(", ")}`, `**${p.notsLabel ?? "No cabe"}:** ${p.nots.join(", ")}`],
};
const CONTAINERS = new Set(["Pair"]); // its children are read
const DEMOS = new Set(["Button", "Badge", "Input", "Alert", "Banner", "EmptyState", "Calendar", "BackgroundPattern", "TokenExplorer", "ContrastExceptions", "OversizedIcon"]);
```

`VERDICT` usa las etiquetas de `ExampleCard`: «Esto sí», «Esto no», «En lugar de» y «Mejor». Los elementos HTML en minúscula (`div`, `span`) se recorren por si llevan texto de la guía dentro, y se quedan con su texto. Las cadenas de una sola palabra de una demo no llegan, porque las demos no se recorren.

Un componente que no está ni en `TEXT`, ni en `CONTAINERS`, ni en `DEMOS` hace fallar la función con su nombre y el archivo. Así falla el build, y el test de D6 lo comprueba.

Alternativa descartada: una heurística general (coger toda cadena con espacios). Es menos código para empezar, pero mezcla textos de demo y nadie sabe qué entra.

### D3. Los atributos de expresión se evalúan solo si son literales

`items={[...]}` llega como código fuente. Se evalúa con `new Function(\`return (${source});\`)()` y solo para las props que usa `TEXT`. El código es del propio repo y corre en el build, no con datos de fuera. Si la expresión no es un literal (un identificador como `icon={Inbox01}`), lanza `ReferenceError`. Eso solo pasa en props que `TEXT` no lee, porque esas no se evalúan.

Alternativa descartada: un parser de JS (`acorn`) para leer el literal sin evaluarlo. Sería otro paquete y otro recorrido de árbol para el mismo resultado, en código de confianza.

### D4. Forma del JSON

```json
{
	"version": "0.10.0",
	"foundations": [
		{
			"id": "color",
			"title": "Color",
			"description": "Tokens semánticos de color en claro y oscuro.",
			"order": 3,
			"url": "https://regula.jotis.me/foundations/color/",
			"intro": "Los tokens son **semánticos**: …",
			"sections": [
				{ "title": "Con ejemplos", "url": "https://regula.jotis.me/foundations/color/#con-ejemplos", "text": "…" }
			]
		}
	]
}
```

- **Orden de los fundamentos:** ordenados por `order`, el de la navegación.
- **`intro`:** es el texto anterior al primer `##`.
- **Secciones:** una por `##`, con `###`, listas, negritas y código en Markdown. El texto se escribe con un serializador pequeño para los nodos que usan los fundamentos: párrafo, encabezado, lista, `strong`, `emphasis`, `inlineCode`, `link` y `text`. Un nodo de otro tipo hace fallar el build, como en D2.
- **Anclas:** salen de los `headings` que devuelve `render()`, emparejados por orden con los `##`. Así son las mismas que la página, sin volver a calcularlas.
- **Tablas de tokens:** las secciones de `tokenSections` entran al final, con el texto «Los tokens de esta sección están en `search_tokens`, categoría `<x>`.».

### D5. Las herramientas

- `list_foundations`, sin parámetros: `{ id, title, description, url, sections: [{ title, url }] }` de cada uno.
- `get_foundation`, con `id` (`queryParam`): compara sin distinguir mayúsculas, y también acepta el título («Tipografía»), plegado como hace `fold`. Si no lo encuentra, falla con los más parecidos (`closest`) y sugiere `list_foundations`. Es el patrón de `get_component`.
- **`search`:** añade el grupo `foundations`. Busca en el título, la descripción y el texto de cada sección, y devuelve una entrada por sección que coincide (`{ name: "Color - Con ejemplos", url, detail: "get_foundation" }`). Así el agente llega al ancla.
- **`guide.ts`:** lleva el texto en español de las dos herramientas. Sin él, `toolTerms()` para el build.
- **`data.ts`:** carga `/foundations.json` con los otros cuatro.

### D6. Tests

- **`test/foundations-json.test.ts`:**
  - los diez fundamentos, en orden;
  - las secciones de tipografía coinciden con sus `##` y sus anclas;
  - la regla «Esto no» de color;
  - un apartado de `Essentials` y otro de `Terms`;
  - el `intro`;
  - un MDX inventado con `<Nuevo />`, que lanza un error que nombra `Nuevo` y el archivo.
- **`test/mcp-tools.test.ts`:**
  - `list_foundations`;
  - `get_foundation` con `Color`, con `tipografía` y con `colour`, que da error con `color`;
  - `search` con `semánticos`.
- **`test/mcp.test.ts`:** el cliente real lista las dos herramientas y llama a cada una con éxito y con error.
- **`mcp-fixture.ts`:** suma `/foundations.json`.

## Risks / Trade-offs

- **[`satteri` es 0.x y Astro lo actualiza]** → Se fija en la versión de Astro. VER-010 hace que una subida de Astro que lo cambie se note en «Normas de desarrollo», que pide el mismo rango en todo el monorepo. Si el mdast cambia de forma, fallan los tests de D6.
- **[`new Function` sobre código del repo]** → Solo en el build, solo sobre las props de `TEXT` y sobre archivos que pasan revisión. Si algún día los fundamentos vinieran de fuera, habría que cambiarlo por un parser.
- **[El texto del JSON no es idéntico al de la página]** → Es la misma fuente, pero sin las demos y con las etiquetas en negrita. El test compara secciones y textos clave, no el HTML.
- **[El cambio choca con `add-development-standards` en `mcp-server`]** → Se archiva después. Sus escenarios ya usan los IDs nuevos.
