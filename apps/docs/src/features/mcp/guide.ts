// What `/start/mcp/` says about each tool, in Spanish (the tool descriptions the server sends are in English, for the
// agent). The page builds its list from `TOOLS`, so a tool without text here stops the build instead of going missing
// from the guide.
import { TOOLS } from "./tools";

export const TOOL_GUIDE: Record<string, string> = {
	list_standards:
		"Las áreas de normas con el ID, el título y el nivel de cada una. Se puede filtrar por área (`naming`, `language`, `stack`, `structure`, `code`, `documentation`, `versioning`, `git`, `ci` o `process`).",
	get_standard:
		"Una norma completa por su ID (`GIT-001`): nivel, a qué se aplica, enunciado, porqué, ejemplos y cómo se verifica.",
	list_components:
		"Los componentes agrupados como en la guía, con su descripción. Se puede filtrar por grupo (`acciones`, `formularios`…).",
	get_component:
		"La ficha de un componente por su nombre (`Button`): guía de uso, props con su tipo y su valor por defecto, y los fragmentos de Next.js y Astro. Si el nombre no existe, propone los más parecidos.",
	search_tokens:
		"Busca tokens por nombre o por uso (`text-secondary`). Cada uno trae su valor en claro y oscuro cuando cambia entre temas. Filtra por categoría.",
	search_icons:
		"Busca en las galerías de iconos, banderas, tipos de archivo, pagos y cursores, por nombre (`SearchLg` o `search-lg`) o por título (`España`). Cada resultado trae su `import`.",
	search: "Busca a la vez en normas, componentes, tokens e iconos. Cada resultado dice qué herramienta da su detalle.",
};

/** The list the page shows: one entry per tool, in the order of `tools/list`. */
export function toolTerms(): { term: string; text: string }[] {
	return TOOLS.map((tool) => {
		const text = TOOL_GUIDE[tool.name];
		if (!text) throw new Error(`Falta el texto de ${tool.name} en src/features/mcp/guide.ts`);
		return { term: tool.name, text };
	});
}
