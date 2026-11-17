// Standards collection (spec engineering-standards): every YAML file follows the schema, IDs are unique, and every
// automatic check a rule names exists. The catalog lists the same areas as the files.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { STANDARD_AREAS } from "../src/lib/catalog";
import { type CheckContext, problemsOf, type StandardArea, standardsJson } from "../src/lib/standards";

const root = join(import.meta.dirname, "../../..");
const dir = join(import.meta.dirname, "../src/content/standards");

const areas = readdirSync(dir)
	.filter((f) => f.endsWith(".yaml"))
	.map((f) => ({ slug: f.replace(/\.yaml$/, ""), data: parse(readFileSync(join(dir, f), "utf8")) }));

/** Names of every job and step of the CI workflow. */
const ci = parse(readFileSync(join(root, ".github/workflows/ci.yml"), "utf8")) as {
	jobs: Record<string, { name?: string; steps?: { name?: string }[] }>;
};
const ciNames = new Set<string>(
	Object.values(ci.jobs)
		.flatMap((job) => [job.name, ...(job.steps ?? []).map((s) => s.name)])
		.filter((n): n is string => Boolean(n)),
);
const ctx: CheckContext = {
	ciNames,
	biomeConfig: readFileSync(join(root, "biome.json"), "utf8"),
	testExists: (path) => existsSync(join(root, path)),
};

type Mutable = {
	slug: string;
	data: {
		rules: { id: string; examples: { bad: unknown[] }; verification: unknown; exceptions?: unknown }[];
	};
}[];
const clone = () => structuredClone(areas) as unknown as Mutable;
/** The first rule of the area at `index`; the tests mutate it to break one thing at a time. */
function ruleOf(copy: Mutable, index: number) {
	const rule = copy[index]?.data.rules[0];
	if (!rule) throw new Error(`Area ${index} has no rules`);
	return rule;
}

describe("colección de normas", () => {
	it("las áreas del catálogo son los ficheros de content/standards", () => {
		expect(STANDARD_AREAS.map((a) => a.slug).sort()).toEqual(areas.map((a) => a.slug).sort());
	});

	it("el orden del catálogo es el de `order` de cada área", () => {
		const bySlug = new Map(areas.map((a) => [a.slug, a.data.order as number]));
		const orders = STANDARD_AREAS.map((a) => bySlug.get(a.slug) as number);
		expect(orders).toEqual([...orders].sort((a, b) => a - b));
	});

	it("sigue el esquema, sin IDs repetidos y con todas sus comprobaciones existentes", () => {
		expect(problemsOf(areas, ctx)).toEqual([]);
	});

	it("falla con un ID repetido", () => {
		const copy = clone();
		ruleOf(copy, 1).id = ruleOf(copy, 0).id;
		expect(problemsOf(copy, ctx).join("\n")).toContain("repeated");
	});

	it("falla con un ID que no lleva el prefijo de su área", () => {
		const copy = clone();
		ruleOf(copy, 0).id = "ZZZ-001";
		expect(problemsOf(copy, ctx).join("\n")).toContain("does not start with the prefix");
	});

	it("falla con un `check` de CI que no existe", () => {
		const copy = clone();
		ruleOf(copy, 0).verification = { kind: "ci", check: "Un paso que no existe" };
		expect(problemsOf(copy, ctx).join("\n")).toContain("no job or step named");
	});

	it("falla sin el ejemplo que no la cumple", () => {
		const copy = clone();
		ruleOf(copy, 0).examples.bad = [];
		expect(problemsOf(copy, ctx).join("\n")).toContain("examples.bad");
	});

	it("acepta excepciones de framework y las lleva al JSON", () => {
		const copy = clone();
		const exceptions = [{ where: "`app/**/page.tsx`", why: "Next imports it by its default export." }];
		ruleOf(copy, 0).exceptions = exceptions;
		expect(problemsOf(copy, ctx)).toEqual([]);
		const entries = copy.map((a) => ({ id: a.slug, data: a.data as unknown as StandardArea }));
		const rule = standardsJson(entries, "9.9.9", "https://regula.jotis.me/")
			.areas.flatMap((a) => a.rules)
			.find((r) => r.id === ruleOf(copy, 0).id);
		expect(rule?.exceptions).toEqual(exceptions);
	});

	it("falla con una excepción sin motivo", () => {
		const copy = clone();
		ruleOf(copy, 0).exceptions = [{ where: "`page.tsx`", why: "" }];
		expect(problemsOf(copy, ctx).join("\n")).toContain("exceptions");
	});

	it("falla con una norma de revisión sin decir qué se revisa", () => {
		const copy = clone();
		ruleOf(copy, 0).verification = { kind: "review" };
		expect(problemsOf(copy, ctx)).not.toEqual([]);
	});
});

describe("/standards.json", () => {
	const entries = areas.map((a) => ({ id: a.slug, data: a.data as StandardArea }));
	const json = standardsJson(entries, "9.9.9", "https://regula.jotis.me/");

	it("lleva la versión y las áreas por `order`", () => {
		expect(json.version).toBe("9.9.9");
		expect(json.areas.map((a) => a.id)).toEqual([
			"naming",
			"language",
			"stack",
			"code",
			"documentation",
			"versioning",
			"git",
			"ci",
			"process",
		]);
	});

	it("cada norma trae todos sus campos y su URL", () => {
		const rule = json.areas.flatMap((a) => a.rules).find((r) => r.id === "GIT-001");
		expect(rule).toMatchObject({
			title: expect.any(String),
			level: "must",
			appliesTo: "all",
			statement: expect.any(String),
			rationale: expect.any(String),
			examples: { good: expect.any(Array), bad: expect.any(Array) },
			verification: { kind: "ci", check: "Commits" },
			url: "https://regula.jotis.me/standards/git/#git-001",
		});
	});

	it("es determinista", () => {
		expect(standardsJson(entries, "9.9.9", "https://regula.jotis.me/")).toEqual(json);
	});
});

// Design D2 of add-development-standards: the exceptions of a rule Biome checks are the `overrides` of biome.json
describe("excepciones de framework y overrides de biome.json", () => {
	interface Override {
		includes: string[];
		linter?: { rules?: Record<string, Record<string, unknown>> };
	}
	const biome = JSON.parse(readFileSync(join(root, "biome.json"), "utf8")) as { overrides: Override[] };
	const allRules = areas.flatMap((a) => (a.data as StandardArea).rules);
	const ruleById = (id: string) => allRules.find((r) => r.id === id);
	/** The globs a rule lists in its exceptions: what is between backticks and starts with `**\/`. */
	const globsOf = (id: string) =>
		(ruleById(id)?.exceptions ?? [])
			.flatMap((e) => [...e.where.matchAll(/`([^`]+)`/g)].map((m) => m[1] as string))
			.filter((g) => g.startsWith("**/"))
			.sort();
	const includesOf = (pick: (o: Override) => boolean) =>
		biome.overrides
			.filter(pick)
			.flatMap((o) => o.includes)
			.sort();
	const rule = (o: Override, group: string, name: string) => o.linter?.rules?.[group]?.[name];

	it("COD-009 lista los archivos donde noDefaultExport está desactivado", () => {
		const globs = globsOf("COD-009");
		expect(globs.length).toBeGreaterThan(0);
		expect(globs).toEqual(includesOf((o) => rule(o, "style", "noDefaultExport") === "off"));
	});

	it("COD-013 lista los archivos donde noConsole está desactivado", () => {
		const globs = globsOf("COD-013");
		expect(globs.length).toBeGreaterThan(0);
		expect(globs).toEqual(includesOf((o) => rule(o, "suspicious", "noConsole") === "off"));
	});

	it("NAM-003 lista los archivos de componente, donde se admite PascalCase", () => {
		const globs = globsOf("NAM-003");
		expect(globs.length).toBeGreaterThan(0);
		expect(globs).toEqual(includesOf((o) => rule(o, "style", "useFilenamingConvention") !== undefined));
	});

	it("toda norma de Biome con excepciones de archivo tiene su override", () => {
		for (const r of allRules)
			if (r.verification.kind === "biome" && (r.exceptions ?? []).some((e) => e.where.includes("**/")))
				expect(globsOf(r.id), r.id).not.toEqual([]);
	});
});
