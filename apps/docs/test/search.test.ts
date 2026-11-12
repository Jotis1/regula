import { describe, expect, it } from "vitest";
import { fold, plain, type SearchEntry, searchGroups } from "../src/search/entries";

const entries: SearchEntry[] = [
	{ group: "pages", label: "Tipografía", href: "/foundations/typography/" },
	{ group: "pages", label: "Color", href: "/foundations/color/" },
	{
		group: "components",
		label: "CommandMenu",
		description: "Menú de comandos (⌘K)",
		href: "/components/command-menu/",
	},
	{
		group: "components",
		label: "Modal",
		description: "Ventana sobre la página",
		href: "/components/modal/",
	},
	{
		group: "components",
		label: "Slideout",
		description: "Panel lateral, como un modal",
		href: "/components/slideout/",
	},
	{
		group: "tokens",
		label: "bg-overlay",
		description: "Color · Fondo de modal",
		href: "/foundations/color/",
	},
	{ group: "icons", label: "Calendar", href: "/icons/?icono=Calendar" },
];

describe("búsqueda de la web", () => {
	it("sin texto, solo las páginas", () => {
		expect(searchGroups(entries, "  ").map((g) => g.group)).toEqual(["pages"]);
	});

	it('"modal": el componente Modal primero, luego coincidencias en la descripción y los tokens', () => {
		const groups = searchGroups(entries, "modal");
		expect(groups.map((g) => g.label)).toEqual(["Componentes", "Tokens"]);
		expect(groups[0]?.entries.map((e) => e.label)).toEqual(["Modal", "Slideout"]);
	});

	it("sin tildes ni mayúsculas", () => {
		expect(fold("Tipografía")).toBe("tipografia");
		expect(searchGroups(entries, "TIPOGRAFIA")[0]?.entries[0]?.label).toBe("Tipografía");
		expect(searchGroups(entries, "cal")[0]?.entries[0]?.href).toBe("/icons/?icono=Calendar");
	});

	it("el texto completo va al final y sin repetir lo ya visible", () => {
		const text: SearchEntry[] = [
			{ group: "text", label: "Modal", href: "/components/modal/" },
			{
				group: "text",
				label: "Contenido y tono",
				description: "…un modal…",
				href: "/foundations/content/",
			},
		];
		const groups = searchGroups(entries, "modal", text);
		expect(groups.at(-1)?.label).toBe("En el texto");
		expect(groups.at(-1)?.entries.map((e) => e.href)).toEqual(["/foundations/content/"]);
	});

	it("extracto de Pagefind en texto plano", () => {
		expect(plain("Una <mark>modal</mark> &amp; su  foco")).toBe("Una modal & su foco");
	});
});
