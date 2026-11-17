// The MCP tools (spec mcp-server): each scenario of the spec, run on the pure functions.
import { describe, expect, it } from "vitest";
import { TOOLS } from "../src/features/mcp/tools";
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
		expect(json.areas.map((a: { id: string }) => a.id)).toEqual([
			"naming",
			"language",
			"stack",
			"structure",
			"code",
			"documentation",
			"versioning",
			"git",
			"ci",
			"process",
		]);
		expect(json.areas[0].rules[0]).toMatchObject({ id: "NAM-001", level: "must" });
	});

	it("list_standards filtra por área", () => {
		const { json } = call("list_standards", { area: "git" });
		expect(json.areas).toHaveLength(1);
		expect(json.areas[0].id).toBe("git");
	});

	it("list_standards filtra por el área de código y trae sus trece normas", () => {
		const { json } = call("list_standards", { area: "code" });
		expect(json.areas).toHaveLength(1);
		expect(json.areas[0].id).toBe("code");
		expect(json.areas[0].rules).toHaveLength(15);
	});

	it("get_standard devuelve las excepciones de COD-009: los archivos especiales de Next", () => {
		const { json } = call("get_standard", { id: "COD-009" });
		expect(json).toMatchObject({ id: "COD-009", level: "must", area: "code" });
		expect(json.verification).toEqual({ kind: "biome", check: "noDefaultExport" });
		expect(json.exceptions.map((e: { where: string }) => e.where).join(" ")).toContain("page,layout");
	});

	it("get_standard lee VER-002: el changeset de toda PR que cambia lo publicado", () => {
		const { json } = call("get_standard", { id: "VER-002" });
		expect(json).toMatchObject({
			id: "VER-002",
			level: "must",
			appliesTo: "package",
			area: "versioning",
		});
		expect(json.verification).toEqual({ kind: "ci", check: "Changesets" });
		expect(json.url).toBe("https://regula.jotis.me/standards/versioning/#ver-002");
	});

	it("get_standard lee LNG-005: el ejemplo malo enseña el punto medio aunque el YAML lo escriba escapado", () => {
		const { json } = call("get_standard", { id: "LNG-005" });
		expect(json).toMatchObject({ id: "LNG-005", area: "language" });
		expect(json.verification).toEqual({ kind: "ci", check: "Normas de desarrollo" });
		expect(JSON.stringify(json.examples.bad)).toContain(String.fromCodePoint(0xb7));
	});

	it("list_standards filtra por el área de estructura y trae sus ocho normas", () => {
		const { json } = call("list_standards", { area: "structure" });
		expect(json.areas[0].id).toBe("structure");
		expect(json.areas[0].rules.map((r: { id: string }) => r.id)).toEqual([
			"STR-001",
			"STR-002",
			"STR-003",
			"STR-004",
			"STR-005",
			"STR-006",
			"STR-007",
			"STR-008",
		]);
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

	it("get_standard lee INT-003, el job puerta del área de CI", () => {
		const { json } = call("get_standard", { id: "INT-003" });
		expect(json).toMatchObject({ id: "INT-003", level: "must", area: "ci" });
		expect(json.verification).toEqual({ kind: "ci", check: "Normas de CI" });
		expect(json.url).toBe("https://regula.jotis.me/standards/ci/#int-003");
	});

	it("get_standard trae la URL de su página con el ancla", () => {
		const { json } = call("get_standard", { id: "NAM-001" });
		expect(json.url).toBe("https://regula.jotis.me/standards/naming/#nam-001");
	});

	it("get_standard con el ID antiguo NOM-001 dice que no existe (sin alias)", () => {
		const r = call("get_standard", { id: "NOM-001" });
		expect(r.isError).toBe(true);
	});

	it("get_standard devuelve las excepciones de LNG-002", () => {
		const { json } = call("get_standard", { id: "LNG-002" });
		expect(json.exceptions[0].where).toContain("Dependabot");
	});

	it("get_standard con NAM-999 dice que no existe y sugiere list_standards", () => {
		const r = call("get_standard", { id: "NAM-999" });
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

	it("get_component button trae los atributos nativos de button y a", () => {
		const { json } = call("get_component", { name: "button" });
		expect(json.native.map((t: { element: string }) => t.element)).toEqual(["button", "a"]);
		expect(json.native[0].attributes).toContain("type");
		expect(json.native[1].attributes).toContain("target");
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
	it("«dominio inverso» trae NAM-001 y dice que su detalle sale de get_standard", () => {
		const { json } = call("search", { query: "dominio inverso" });
		expect(json.standards[0]).toMatchObject({ id: "NAM-001", detail: "get_standard" });
	});

	it("agrupa por tipo y limita cada grupo", () => {
		const { json } = call("search", { query: "button", limit: 2 });
		for (const kind of ["standards", "components", "tokens", "icons"])
			expect(json[kind].length).toBeLessThanOrEqual(2);
		expect(json.components[0]).toMatchObject({ name: "Button", detail: "get_component" });
	});
});
