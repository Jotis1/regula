// The contract of the MCP server and of the public JSON files (spec mcp-server, «Versión del contrato»): its own
// SemVer, apart from the version of the packages, because agents and programs depend on it. Adding a tool, an optional
// parameter or a field is a minor; removing or renaming one, or changing what it means, is a major, and only after a
// minor that marks it as deprecated (VER-012 and VER-013). The server announces it, every JSON carries it in
// `apiVersion`, and `/start/mcp/` shows its history.

export const API_VERSION = "1.1.0";

/**
 * The tools of this version, in the order of `tools/list`. A test compares them with `TOOLS`: a PR that adds or
 * removes a tool has to edit this list too, and whoever reviews it sees whether the version moves as SemVer asks.
 */
export const CONTRACT_TOOLS = [
	"list_standards",
	"get_standard",
	"list_components",
	"get_component",
	"list_foundations",
	"get_foundation",
	"search_tokens",
	"search_icons",
	"search",
] as const;

/** The public JSON files of this version. */
export const CONTRACT_FILES = [
	"/standards.json",
	"/components.json",
	"/foundations.json",
	"/tokens.json",
	"/icons.json",
] as const;

/** Newest first: what each version added, deprecated or removed, in Spanish (`/start/mcp/` shows it). */
export const API_HISTORY: readonly { version: string; date: string; changes: string[] }[] = [
	{
		version: "1.1.0",
		date: "2026-11-20",
		changes: [
			"Añade `list_foundations` y `get_foundation`, y `/foundations.json` con los fundamentos de diseño.",
			"`search` busca también en los fundamentos, en un grupo nuevo, `foundations`.",
			"Cada JSON lleva la versión del contrato en `apiVersion`, y el servidor se anuncia con ella.",
		],
	},
	{
		version: "1.0.0",
		date: "2026-11-16",
		changes: [
			"Siete herramientas: `list_standards`, `get_standard`, `list_components`, `get_component`, `search_tokens`, `search_icons` y `search`.",
			"Cuatro JSON: `/standards.json`, `/components.json`, `/tokens.json` y `/icons.json`.",
		],
	},
];

/** A public JSON as it is published: the version of the contract next to the version of Regula it documents. */
export function published<T extends { version: string }>({ version, ...rest }: T) {
	return { version, apiVersion: API_VERSION, ...rest };
}

const DATE = new Intl.DateTimeFormat("es-ES", {
	day: "numeric",
	month: "short",
	year: "numeric",
	timeZone: "UTC",
});

/** The history as the page lists it: one entry per version, with its date and its changes in one text. */
export function historyTerms(): { term: string; text: string }[] {
	return API_HISTORY.map((entry) => ({
		term: entry.version,
		text: `${DATE.format(new Date(entry.date))}. ${entry.changes.join(" ")}`,
	}));
}
