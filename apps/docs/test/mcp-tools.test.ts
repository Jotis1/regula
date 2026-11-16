// The MCP tools (spec mcp-server): each scenario of the spec, run on the pure functions.
import { describe, expect, it } from "vitest";
import { TOOLS } from "../src/mcp/tools";
import { data } from "./mcp-fixture";

function call(name: string, args: Record<string, unknown> = {}) {
	const tool = TOOLS.find((t) => t.name === name);
	if (!tool) throw new Error(`no tool ${name}`);
	const result = tool.run(data, args);
	return { ...result, json: result.isError ? undefined : JSON.parse(result.text) };
}

describe("estructura", () => {
	it("hay siete herramientas con nombre en inglés y snake_case", () => {
		expect(TOOLS.map((t) => t.name)).toEqual([
			"list_standards",
			"get_standard",
			"list_components",
			"get_component",
			"search_tokens",
			"search_icons",
			"search",
		]);
		for (const t of TOOLS) expect(t.name).toMatch(/^[a-z]+(_[a-z]+)*$/);
	});
});

describe("normas", () => {
	it("list_standards trae las áreas con sus normas", () => {
		const { json } = call("list_standards");
		expect(json.areas.map((a: { id: string }) => a.id)).toEqual(["naming", "language", "git", "process"]);
		expect(json.areas[0].rules[0]).toMatchObject({ id: "NOM-001", level: "must" });
	});

	it("list_standards filtra por área", () => {
		const { json } = call("list_standards", { area: "git" });
		expect(json.areas).toHaveLength(1);
		expect(json.areas[0].id).toBe("git");
	});

	it("list_standards con un área que no existe da error con las que hay", () => {
		const r = call("list_standards", { area: "seo" });
		expect(r.isError).toBe(true);
		expect(r.text).toContain("naming");
	});

	it("get_standard lee git-001 sin distinguir mayúsculas, con todos sus campos", () => {
		const { json } = call("get_standard", { id: "git-001" });
		expect(json).toMatchObject({ id: "GIT-001", level: "must", area: "git" });
		for (const field of ["appliesTo", "statement", "rationale", "examples", "verification", "url"])
			expect(json, field).toHaveProperty(field);
	});

	it("get_standard trae la URL de su página con el ancla", () => {
		const { json } = call("get_standard", { id: "NOM-001" });
		expect(json.url).toBe("https://regula.jotis.me/standards/naming/#nom-001");
	});

	it("get_standard con NOM-999 dice que no existe y sugiere list_standards", () => {
		const r = call("get_standard", { id: "NOM-999" });
		expect(r.isError).toBe(true);
		expect(r.text).toContain("list_standards");
	});
});

describe("componentes", () => {
	it("list_components agrupa y describe", () => {
		const { json } = call("list_components", { group: "acciones" });
		expect(json.groups).toHaveLength(1);
		expect(json.groups[0].components.map((c: { name: string }) => c.name)).toContain("Button");
	});

	it("list_components con un grupo que no existe da error", () => {
		expect(call("list_components", { group: "nada" }).isError).toBe(true);
	});

	it("get_component button trae hierarchy y los dos fragmentos", () => {
		const { json } = call("get_component", { name: "button" });
		expect(json.name).toBe("Button");
		expect(json.props.find((p: { name: string }) => p.name === "hierarchy").type).toContain(
			'"link-gray"',
		);
		expect(json.snippets.next).toContain("@jotis-me/react");
		expect(json.snippets.astro).toContain("---");
		expect(json.url).toBe("https://regula.jotis.me/components/button/");
	});

	it("get_component con Botón da error con los nombres más parecidos", () => {
		const r = call("get_component", { name: "Botón" });
		expect(r.isError).toBe(true);
		expect(r.text).toMatch(/Closest names: Button/);
	});
});

describe("tokens", () => {
	it("search_tokens text-secondary pone ese token primero, con claro y oscuro", () => {
		const { json } = call("search_tokens", { query: "text-secondary" });
		expect(json.results[0].name).toBe("text-secondary");
		expect(json.results[0].value).toMatchObject({ light: expect.any(String), dark: expect.any(String) });
	});

	it("filtra por categoría", () => {
		const { json } = call("search_tokens", { query: "none", category: "spacing" });
		expect(json.results.length).toBeGreaterThan(0);
		for (const t of json.results) expect(t.category).toBe("spacing");
	});

	it("respeta el límite", () => {
		const { json } = call("search_tokens", { query: "text", limit: 3 });
		expect(json.shown).toBe(3);
		expect(json.total).toBeGreaterThan(3);
	});
});

describe("iconos", () => {
	it("search-lg encuentra SearchLg con su import", () => {
		const { json } = call("search_icons", { query: "search-lg" });
		expect(json.results[0]).toMatchObject({
			gallery: "icons",
			name: "SearchLg",
			import: 'import { SearchLg } from "@untitledui/icons";',
		});
	});

	it("españa en la galería flags encuentra la bandera es", () => {
		const { json } = call("search_icons", { query: "españa", gallery: "flags" });
		expect(json.results.map((r: { name: string }) => r.name)).toContain("es");
	});
});

describe("búsqueda global", () => {
	it("«dominio inverso» trae NOM-001 y dice que su detalle sale de get_standard", () => {
		const { json } = call("search", { query: "dominio inverso" });
		expect(json.standards[0]).toMatchObject({ id: "NOM-001", detail: "get_standard" });
	});

	it("agrupa por tipo y limita cada grupo", () => {
		const { json } = call("search", { query: "button", limit: 2 });
		for (const kind of ["standards", "components", "tokens", "icons"])
			expect(json[kind].length).toBeLessThanOrEqual(2);
		expect(json.components[0]).toMatchObject({ name: "Button", detail: "get_component" });
	});
});
