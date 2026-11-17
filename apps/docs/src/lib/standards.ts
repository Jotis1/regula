// Standards collection: schema, labels and helpers. Kept free of `astro:content` so Vitest can validate the YAML
// files with the very same schema the build uses (design D1 of add-standards-foundation).
import { z } from "astro/zod";

const example = z.object({
	caption: z.string(),
	lang: z.string(),
	code: z.string(),
});

/** How a rule is checked. Automatic kinds name the concrete check; `review` says what the reviewer looks at. */
const verification = z.discriminatedUnion("kind", [
	z.object({ kind: z.enum(["biome", "ci", "test"]), check: z.string().min(1) }),
	z.object({ kind: z.literal("review"), review: z.string().min(1) }),
]);

export const rule = z.object({
	id: z.string().regex(/^[A-Z]{3}-\d{3}$/, "ID must look like NOM-001"),
	title: z.string(),
	level: z.enum(["must", "should", "may"]),
	appliesTo: z.enum(["all", "app", "package"]),
	statement: z.string(),
	rationale: z.string(),
	examples: z.object({ good: z.array(example).min(1), bad: z.array(example).min(1) }),
	verification,
	/** What a framework convention forces the rule to allow: where it applies and why. */
	exceptions: z.array(z.object({ where: z.string().min(1), why: z.string().min(1) })).optional(),
});

export const area = z.object({
	prefix: z.string().regex(/^[A-Z]{3}$/),
	title: z.string(),
	description: z.string(),
	order: z.number(),
	rules: z.array(rule).min(1),
});

export type StandardRule = z.infer<typeof rule>;
export type StandardArea = z.infer<typeof area>;

/** RFC 2119 level, as the guide writes it. */
export const LEVEL_LABEL: Record<StandardRule["level"], string> = {
	must: "Debe",
	should: "Debería",
	may: "Puede",
};

export const APPLIES_LABEL: Record<StandardRule["appliesTo"], string> = {
	all: "Todos los proyectos",
	app: "Apps",
	package: "Paquetes publicados",
};

export const VERIFY_LABEL: Record<StandardRule["verification"]["kind"], string> = {
	biome: "Biome",
	ci: "CI",
	test: "Test",
	review: "Revisión",
};

/** `NOM-001` → `nom-001`: the anchor of a rule inside its area page. */
export const anchorOf = (id: string) => id.toLowerCase();

/** Where a rule lives: `/standards/<area>/#nom-001`. */
export const hrefOf = (areaId: string, id: string) => `/standards/${areaId}/#${anchorOf(id)}`;

/** One sentence on how a rule is verified, for the page and the JSON consumers. */
export function verificationText(v: StandardRule["verification"]): string {
	return v.kind === "review"
		? `${VERIFY_LABEL.review}: ${v.review}`
		: `${VERIFY_LABEL[v.kind]}: ${v.check}`;
}

/** What the cross-checks need to know about the repo; the test fills it from the real files. */
export interface CheckContext {
	/** `name` of every job and step in .github/workflows/ci.yml. */
	ciNames: ReadonlySet<string>;
	/** Text of biome.json. */
	biomeConfig: string;
	/** Whether a test file exists, by path relative to the repository root. */
	testExists: (path: string) => boolean;
}

/**
 * Everything wrong with a set of areas, as readable messages; empty when they are fine. Covers what one rule cannot
 * see alone (repeated IDs, prefixes, areas) and that every automatic check really exists.
 */
export function problemsOf(areas: { slug: string; data: unknown }[], ctx: CheckContext): string[] {
	const problems: string[] = [];
	const seen = new Map<string, string>();
	const prefixes = new Map<string, string>();
	for (const { slug, data } of areas) {
		const parsed = area.safeParse(data);
		if (!parsed.success) {
			for (const issue of parsed.error.issues)
				problems.push(`${slug}: ${issue.path.join(".")} ${issue.message}`);
			continue;
		}
		const other = prefixes.get(parsed.data.prefix);
		if (other) problems.push(`${slug}: prefix ${parsed.data.prefix} is already used by ${other}`);
		prefixes.set(parsed.data.prefix, slug);
		for (const r of parsed.data.rules) {
			if (!r.id.startsWith(`${parsed.data.prefix}-`))
				problems.push(`${r.id}: does not start with the prefix ${parsed.data.prefix} of ${slug}`);
			const first = seen.get(r.id);
			if (first) problems.push(`${r.id}: repeated (in ${first} and ${slug})`);
			seen.set(r.id, slug);
			const v = r.verification;
			if (v.kind === "ci" && !ctx.ciNames.has(v.check))
				problems.push(`${r.id}: no job or step named "${v.check}" in ci.yml`);
			if (v.kind === "biome" && !ctx.biomeConfig.includes(v.check))
				problems.push(`${r.id}: "${v.check}" is not in biome.json`);
			if (v.kind === "test" && !ctx.testExists(v.check))
				problems.push(`${r.id}: test file ${v.check} does not exist`);
		}
	}
	return problems;
}

/**
 * The public JSON (`/standards.json`): areas ordered by `order`, rules in file order, field names in English and
 * texts in Spanish. Deterministic: no generation date, so the build output does not change between runs.
 */
export function standardsJson(entries: { id: string; data: StandardArea }[], version: string, site: string) {
	return {
		version,
		areas: [...entries]
			.sort((a, b) => a.data.order - b.data.order)
			.map(({ id, data }) => ({
				id,
				prefix: data.prefix,
				title: data.title,
				description: data.description,
				url: new URL(`/standards/${id}/`, site).href,
				rules: data.rules.map((r) => ({ ...r, url: new URL(hrefOf(id, r.id), site).href })),
			})),
	};
}
