// Checks the development standards that a machine can see (STK, STR, COD, TST, DOC, VER and SEC areas, and the
// typography of LNG-005) against the repo: workspaces, tsconfigs, Biome, the CI workflows, Dependabot, READMEs, the
// source of the published packages and every text file. What cannot be seen from here is checked in review.
// Usage: bun run scripts/check-dev.ts   (exits 1 and lists every problem with its file and rule)
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Workflow } from "./check-ci";

type Json = Record<string, unknown>;
export interface PackageJson {
	name?: string;
	private?: boolean;
	packageManager?: string;
	scripts?: Record<string, string>;
	engines?: Record<string, string>;
	sideEffects?: unknown;
	workspaces?: string[];
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
}
export interface Workspace {
	/** Repository path (`packages/react`). */
	dir: string;
	pkg: PackageJson;
	/** Published to npm: not `private`. */
	published: boolean;
	/** Lives in `apps/` or `examples/`. */
	app: boolean;
	/** `compilerOptions` of its tsconfig with the `extends` already resolved; `null` when it has none. */
	compilerOptions: Json | null;
	readme: string | null;
	hasVercelJson: boolean;
}
export interface SourceFile {
	path: string;
	text: string;
}
export interface Repo {
	rootPkg: PackageJson;
	/** Lockfiles found anywhere in the repo, by path. */
	lockfiles: string[];
	/** Config files of tools the stack does not use (ESLint, Prettier), by path. */
	foreignConfigs: string[];
	biome: Json;
	/** Each workflow parsed, and its raw text: the parser drops the comments that SEC-007 reads. */
	workflows: { path: string; workflow: Workflow; text: string }[];
	dependabot: Json | null;
	rootReadme: string;
	workspaces: Workspace[];
	/** Every `.ts`, `.tsx`, `.astro`, `.mjs` and `.js` file tracked by Git. */
	sources: SourceFile[];
	/** Every text file tracked by Git that LNG-005 applies to. */
	texts: SourceFile[];
	/** Every path tracked by Git. */
	files: string[];
	/** The root `.gitignore`, or `""` when there is none. */
	gitignore: string;
	/** Every standard of the guide: its id and how it is verified (`biome`, `ci`, `test` or `review`). */
	standards: { id: string; kind: string }[];
	/** `standards-exceptions.json` as parsed, or `null` when the repo has none. */
	standardsExceptions: unknown;
	/** The root `AGENTS.md`, `CLAUDE.md`, `.mcp.json` and `.claude/settings.json` as text; `null` when missing. */
	agentsMd: string | null;
	claudeMd: string | null;
	mcpJson: string | null;
	claudeSettings: string | null;
}

export const TS_FLAGS = [
	"strict",
	"noUncheckedIndexedAccess",
	"erasableSyntaxOnly",
	"noImplicitOverride",
	"noImplicitReturns",
	"noFallthroughCasesInSwitch",
	"verbatimModuleSyntax",
] as const;
/** Frameworks the app shares with the package: peer dependencies, never dependencies (VER-007). */
const SHARED = ["react", "react-dom", "next", "astro", "tailwindcss"];
const SITE = "https://regula.jotis.me";
/** Tools that read the TypeScript 6 JS API: the workspaces that depend on them keep `typescript` at 6 (VER-010). */
const TS6_TOOLS = ["@astrojs/check", "next", "dts-bundle-generator"];

/** The Biome block of the guide (STK-004): where it lives in `biome.json` and what it must say. */
const BIOME_BLOCK: [path: string[], expected: unknown][] = [
	[["linter", "rules", "preset"], "recommended"],
	[["linter", "rules", "suspicious", "noExplicitAny"], "error"],
	[["linter", "rules", "suspicious", "noTsIgnore"], "error"],
	[["linter", "rules", "suspicious", "noConsole"], "error"],
	[["linter", "rules", "suspicious", "noFocusedTests"], "error"],
	[["linter", "rules", "suspicious", "noSkippedTests"], "error"],
	[["linter", "rules", "style", "noEnum"], "error"],
	[["linter", "rules", "style", "noNonNullAssertion"], "error"],
	[["linter", "rules", "style", "noDefaultExport"], "error"],
	[["linter", "rules", "style", "useImportType"], "error"],
	[["linter", "rules", "style", "useFilenamingConvention"], "error"],
	[["linter", "rules", "performance", "noReExportAll"], "error"],
	[["linter", "rules", "performance", "noNamespaceImport"], "error"],
	[["linter", "rules", "security", "noDangerouslySetInnerHtml"], "error"],
	[["linter", "rules", "security", "noGlobalEval"], "error"],
	[["formatter", "indentStyle"], "tab"],
	[["formatter", "indentWidth"], 4],
	[["formatter", "lineWidth"], 110],
	[["javascript", "formatter", "quoteStyle"], "double"],
	[["javascript", "formatter", "semicolons"], "always"],
	[["assist", "actions", "source", "organizeImports"], "on"],
	[["vcs", "useIgnoreFile"], true],
];

const at = (obj: unknown, path: string[]): unknown =>
	path.reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Json)[k] : undefined), obj);
/** A Biome rule value is `"error"` or `{ level: "error" }`. */
const levelOf = (value: unknown): unknown =>
	value && typeof value === "object" ? (value as Json).level : value;
const allDeps = (pkg: PackageJson) => ({
	...pkg.devDependencies,
	...pkg.peerDependencies,
	...pkg.dependencies,
});
const has = (pkg: PackageJson, name: string) => name in allDeps(pkg);
const isGenerated = (path: string) => /\.generated\./.test(path);
const isInternal = (path: string) => /\/internal\//.test(path);

// ── STK ────────────────────────────────────────────────────────────────────────────────────────────────────────────

export function stackProblems(repo: Repo): string[] {
	const out: string[] = [];
	const add = (file: string, rule: string, text: string) => out.push(`${file} (${rule}): ${text}`);

	for (const w of repo.workspaces)
		if (w.app && !has(w.pkg, "next") && !has(w.pkg, "astro"))
			add(
				`${w.dir}/package.json`,
				"STK-001",
				"an app is built with Next.js or Astro, and this one uses neither",
			);

	if (!/^bun@\d+\.\d+\.\d+$/.test(repo.rootPkg.packageManager ?? ""))
		add("package.json", "STK-002", "`packageManager` must pin an exact Bun version (`bun@1.2.3`)");
	for (const lock of repo.lockfiles)
		if (!lock.endsWith("bun.lock")) add(lock, "STK-002", "the only lockfile is `bun.lock`");
	for (const { path, workflow } of repo.workflows)
		for (const [id, job] of Object.entries(workflow.jobs ?? {}))
			for (const step of job.steps ?? []) {
				const uses = (step as { uses?: string; with?: Json }).uses ?? "";
				const withBlock = ((step as { with?: Json }).with ?? {}) as Json;
				if (uses.startsWith("oven-sh/setup-bun") && !withBlock["bun-version-file"])
					add(
						path,
						"STK-002",
						`job "${id}" installs Bun without \`bun-version-file: package.json\``,
					);
			}

	for (const w of repo.workspaces)
		for (const tool of ["eslint", "prettier"])
			if (has(w.pkg, tool))
				add(`${w.dir}/package.json`, "STK-003", `depends on \`${tool}\`: Biome does lint and format`);
	if (["eslint", "prettier"].some((t) => has(repo.rootPkg, t)))
		add("package.json", "STK-003", "depends on ESLint or Prettier: Biome does lint and format");
	for (const file of repo.foreignConfigs)
		add(file, "STK-003", "a config file of ESLint or Prettier: Biome does lint and format");

	for (const [path, expected] of BIOME_BLOCK) {
		const value = at(repo.biome, path);
		if (levelOf(value) !== expected)
			add(
				"biome.json",
				"STK-004",
				`\`${path.join(".")}\` must be ${JSON.stringify(expected)} (the guide's block)`,
			);
	}
	const warnAt = (value: unknown, where: string[]): string | null => {
		if (value === "warn") return where.join(".");
		// Arrays hold option values (`allow: ["error", "warn"]`), not severities
		if (value && typeof value === "object" && !Array.isArray(value))
			for (const [k, v] of Object.entries(value)) {
				const found = warnAt(v, [...where, k]);
				if (found) return found;
			}
		return null;
	};
	const warn = warnAt(repo.biome, []);
	if (warn)
		add("biome.json", "STK-004", `\`${warn}\` is "warn": a rule is "error" or "off", never a warning`);
	for (const { path, workflow } of repo.workflows)
		for (const [id, job] of Object.entries(workflow.jobs ?? {}))
			for (const step of job.steps ?? [])
				if (/\bbiome ci\b/.test(step.run ?? "") && !/--error-on-warnings\b/.test(step.run ?? ""))
					add(path, "STK-004", `job "${id}" runs \`biome ci\` without \`--error-on-warnings\``);

	for (const script of ["build", "typecheck", "test"]) {
		const command = repo.rootPkg.scripts?.[script];
		if (command !== undefined && !/\bturbo run\b/.test(command))
			add("package.json", "STK-005", `the \`${script}\` script must call \`turbo run ${script}\``);
	}

	for (const w of repo.workspaces)
		if (w.app && w.hasVercelJson && !w.pkg.engines?.node)
			add(`${w.dir}/package.json`, "STK-006", "an app deployed to Vercel declares `engines.node`");

	const updates = (repo.dependabot?.updates ?? []) as Json[];
	for (const ecosystem of ["bun", "github-actions"]) {
		const u = updates.find((x) => x["package-ecosystem"] === ecosystem);
		const where = ".github/dependabot.yml";
		if (!u) add(where, "STK-007", `Dependabot does not watch \`${ecosystem}\``);
		else {
			if (at(u, ["schedule", "interval"]) !== "weekly")
				add(where, "STK-007", `\`${ecosystem}\` must be weekly`);
			if (at(u, ["commit-message", "prefix"]) !== "build")
				add(where, "STK-007", `\`${ecosystem}\` commits must use the \`build\` prefix`);
			const groups = Object.values((u.groups ?? {}) as Record<string, Json>);
			const grouped = groups.some((g) => {
				const types = (g["update-types"] ?? []) as string[];
				return types.includes("minor") && types.includes("patch");
			});
			if (!grouped) add(where, "STK-007", `\`${ecosystem}\` must group its minor and patch updates`);
		}
	}
	return out;
}

// ── COD ────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** `@ts-ignore` and `@ts-nocheck` are never right; a `@ts-expect-error` or `biome-ignore` must say why. */
export function suppressionProblems(file: SourceFile): string[] {
	const out: string[] = [];
	const lines = file.text.split("\n");
	lines.forEach((line, i) => {
		// Only a directive that opens a comment counts: the same words inside a string or a sentence are not one
		const m =
			/^\s*(?:\{\s*)?(?:\/\/+|\/\*+)\s*(@ts-ignore|@ts-nocheck|@ts-expect-error|biome-ignore(?:-all|-start)?)\b(.*)$/.exec(
				line,
			);
		if (!m) return;
		const [, directive, rest = ""] = m as unknown as [string, string, string];
		const reason = rest.replace(/\*\/\s*\}?\s*$/, "").trim();
		const where = `${file.path}:${i + 1}`;
		if (directive === "@ts-ignore" || directive === "@ts-nocheck")
			out.push(
				`${where} (COD-005): \`${directive}\` is not allowed; use \`@ts-expect-error\` with a reason`,
			);
		else if (directive === "@ts-expect-error" && reason.replace(/^:/, "").trim() === "")
			out.push(`${where} (COD-005): \`@ts-expect-error\` must say why`);
		else if (directive.startsWith("biome-ignore") && !/:\s*\S/.test(reason))
			out.push(`${where} (COD-005): \`${directive}\` must say why, after a colon`);
	});
	return out;
}

export function codeProblems(repo: Repo): string[] {
	const out: string[] = [];
	for (const w of repo.workspaces) {
		if (!w.compilerOptions) continue;
		for (const flag of TS_FLAGS)
			if (w.compilerOptions[flag] !== true)
				out.push(`${w.dir}/tsconfig.json (COD-001): \`${flag}\` must be true`);
		if (!w.pkg.scripts?.typecheck)
			out.push(
				`${w.dir}/package.json (COD-002): the workspace has a tsconfig and no \`typecheck\` script`,
			);
		if (w.published) {
			const norm = (v: unknown) => String(v ?? "").toLowerCase();
			if (
				norm(w.compilerOptions.module) !== "nodenext" ||
				norm(w.compilerOptions.moduleResolution) !== "nodenext"
			)
				out.push(`${w.dir}/tsconfig.json (COD-007): a published package compiles with \`NodeNext\``);
		}
	}
	for (const file of repo.sources) out.push(...suppressionProblems(file));
	return out;
}

// ── DOC ────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** The closest line above `index` that is not blank and not a `//` comment, so a `biome-ignore` between the two is fine. */
function lineAbove(lines: string[], index: number): string {
	for (let i = index - 1; i >= 0; i--) {
		const l = (lines[i] as string).trim();
		if (l && !l.startsWith("//")) return l;
	}
	return "";
}

/**
 * JSDoc gaps of one source file of a published package. Line-based on purpose: the code is formatted by Biome, so the
 * shape of a declaration is predictable, and TypeScript 7 has no stable API to walk it.
 * - an `export function|const|class` needs a JSDoc right above it (DOC-001);
 * - every member of a top-level `interface` or object `type` needs one (DOC-002);
 * - a `@deprecated` needs to say what to use instead (DOC-003).
 */
export function jsdocProblems(file: SourceFile): string[] {
	const out: string[] = [];
	const lines = file.text.split("\n");
	let owner: string | null = null;
	lines.forEach((line, i) => {
		const where = `${file.path}:${i + 1}`;
		const dep = /@deprecated\b(.*)$/.exec(line);
		if (dep && (dep[1] as string).replace(/\*\/\s*$/, "").trim() === "")
			out.push(`${where} (DOC-003): \`@deprecated\` must say what to use instead`);
		const open =
			/^(?:export )?(?:interface (\w+)(?:<[^>]*>)?(?: extends [^{]+)? \{|type (\w+)(?:<[^>]*>)? = \{)$/.exec(
				line,
			);
		if (!owner && open) {
			owner = (open[1] ?? open[2]) as string;
			return;
		}
		if (owner) {
			if (line.startsWith("}")) owner = null;
			else {
				const member = /^\t(?:readonly )?"?([\w-]+)"?\??[(:<]/.exec(line);
				if (member && !/\*\/$/.test(lineAbove(lines, i)))
					out.push(`${where} (DOC-002): \`${owner}.${member[1]}\` has no JSDoc`);
			}
			return;
		}
		const exported = /^export (?:async )?(?:function|const|class) (\w+)/.exec(line);
		if (exported && !/\*\/$/.test(lineAbove(lines, i)))
			out.push(`${where} (DOC-001): the export \`${exported[1]}\` has no JSDoc`);
	});
	return out;
}

export function docProblems(repo: Repo): string[] {
	const out: string[] = [];
	for (const w of repo.workspaces) {
		if (!w.published) continue;
		if (w.readme === null) out.push(`${w.dir}/README.md (DOC-004): a published package has a README`);
		else if (!w.readme.includes(SITE))
			out.push(`${w.dir}/README.md (DOC-004): the README must link to the guide (${SITE})`);
		for (const file of repo.sources)
			if (
				file.path.startsWith(`${w.dir}/src/`) &&
				/\.tsx?$/.test(file.path) &&
				!isGenerated(file.path) &&
				!isInternal(file.path)
			)
				out.push(...jsdocProblems(file));
	}
	out.push(...commandProblems("README.md", "DOC-005", repo.rootReadme));
	return out;
}

/** The code blocks of a root document show how to install, start, build and test (DOC-005, AGT-001). */
function commandProblems(file: string, rule: string, text: string): string[] {
	const blocks = [...text.matchAll(/```(?:sh|bash)?\n([\s\S]*?)```/g)]
		.map((m) => m[1] as string)
		.join("\n");
	return (
		[
			["install", /\binstall\b/],
			["start (dev)", /\bdev\b/],
			["build", /\bbuild\b/],
			["test", /\btest\b/],
		] as const
	)
		.filter(([, re]) => !re.test(blocks))
		.map(([word]) => `${file} (${rule}): the code blocks must show how to ${word}`);
}

// ── AGT ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const MCP_URL = `${SITE}/mcp`;
/** What the shared agent configuration must deny (AGT-006): `.env` files anywhere in the monorepo. */
const DENIED_READS = ["Read(**/.env)", "Read(**/.env.*)"];
const PERSONAL_SETTINGS = ".claude/settings.local.json";

const parseJson = (text: string): unknown => {
	try {
		return JSON.parse(text);
	} catch {
		return undefined;
	}
};

export function agentProblems(repo: Repo): string[] {
	const out: string[] = [];
	const add = (file: string, rule: string, message: string) => out.push(`${file} (${rule}): ${message}`);

	if (repo.agentsMd === null)
		add("AGENTS.md", "AGT-001", "missing: the root tells an agent the commands and the structure");
	else {
		if (!repo.agentsMd.includes(SITE)) add("AGENTS.md", "AGT-001", `must link to the guide (${SITE})`);
		out.push(...commandProblems("AGENTS.md", "AGT-001", repo.agentsMd));
	}

	if (repo.claudeMd === null)
		add("CLAUDE.md", "AGT-002", "missing: it imports AGENTS.md with `@AGENTS.md`");
	else if (repo.claudeMd.trim() !== "@AGENTS.md")
		add("CLAUDE.md", "AGT-002", "must contain only `@AGENTS.md`; the instructions live in AGENTS.md");

	if (repo.mcpJson === null) add(".mcp.json", "AGT-003", "missing: it declares the Regula MCP server");
	else {
		const mcp = parseJson(repo.mcpJson) as { mcpServers?: { regula?: { url?: unknown } } } | undefined;
		if (mcp === undefined) add(".mcp.json", "AGT-003", "is not valid JSON");
		else if (mcp?.mcpServers?.regula?.url !== MCP_URL)
			add(".mcp.json", "AGT-003", `\`mcpServers.regula.url\` must be ${MCP_URL}`);
	}

	const ignored = repo.gitignore.split("\n").map((l) => l.trim());
	if (!ignored.includes(PERSONAL_SETTINGS))
		add(".gitignore", "AGT-005", `does not ignore \`${PERSONAL_SETTINGS}\``);
	if (repo.files.includes(PERSONAL_SETTINGS))
		add(PERSONAL_SETTINGS, "AGT-005", "tracked by Git: personal configuration is not shared");

	const file = ".claude/settings.json";
	if (repo.claudeSettings === null)
		add(file, "AGT-006", "missing: it denies the agent reading `.env` files");
	else {
		const settings = parseJson(repo.claudeSettings) as { permissions?: { deny?: unknown } } | undefined;
		if (settings === undefined) add(file, "AGT-006", "is not valid JSON");
		else {
			const deny = Array.isArray(settings?.permissions?.deny)
				? (settings.permissions.deny as unknown[])
				: [];
			for (const rule of DENIED_READS)
				if (!deny.includes(rule))
					add(file, "AGT-006", `\`permissions.deny\` must include \`${rule}\``);
		}
	}
	return out;
}

// ── VER ────────────────────────────────────────────────────────────────────────────────────────────────────────────

export function dependencyProblems(repo: Repo): string[] {
	const out: string[] = [];
	for (const { path, workflow } of repo.workflows)
		for (const [id, job] of Object.entries(workflow.jobs ?? {}))
			for (const step of job.steps ?? [])
				if (/\bbun install\b/.test(step.run ?? "") && !/--frozen-lockfile\b/.test(step.run ?? ""))
					out.push(
						`${path} (VER-006): job "${id}" runs \`bun install\` without \`--frozen-lockfile\``,
					);

	for (const w of repo.workspaces) {
		if (!w.published) continue;
		const file = `${w.dir}/package.json`;
		for (const name of SHARED)
			if (w.pkg.dependencies && name in w.pkg.dependencies)
				out.push(`${file} (VER-007): \`${name}\` goes in \`peerDependencies\`, not \`dependencies\``);
		for (const field of ["dependencies", "peerDependencies"] as const)
			for (const [name, range] of Object.entries(w.pkg[field] ?? {}))
				if (/^[\^~]0\./.test(range))
					out.push(
						`${file} (VER-008): \`${name}\` is 0.x and must be pinned (\`${range.slice(1)}\`)`,
					);
		if (w.pkg.sideEffects === undefined)
			out.push(`${file} (VER-011): a published package declares \`sideEffects\``);
	}

	// VER-010: one range per dependency in the whole monorepo. The exception is a framework's own convention:
	// `astro check`, `next build` and `dts-bundle-generator` read the TypeScript 6 JS API (TypeScript 7 has none), so
	// the workspaces that use them pin `typescript` 6
	const ranges = new Map<string, Map<string, string[]>>();
	const note = (file: string, pkg: PackageJson) => {
		for (const field of ["dependencies", "devDependencies"] as const)
			for (const [name, range] of Object.entries(pkg[field] ?? {})) {
				if (range.startsWith("workspace:") || range.startsWith("npm:")) continue;
				if (name === "typescript" && TS6_TOOLS.some((tool) => has(pkg, tool))) continue;
				const byRange = ranges.get(name) ?? new Map<string, string[]>();
				byRange.set(range, [...(byRange.get(range) ?? []), file]);
				ranges.set(name, byRange);
			}
	};
	note("package.json", repo.rootPkg);
	for (const w of repo.workspaces) note(`${w.dir}/package.json`, w.pkg);
	for (const [name, byRange] of ranges)
		if (byRange.size > 1)
			out.push(
				`${[...byRange.values()].flat().join(", ")} (VER-010): \`${name}\` has different ranges: ${[...byRange.keys()].join(" and ")}`,
			);
	return out;
}

// ── STR ────────────────────────────────────────────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOTS = ["apps/", "packages/", "examples/", "scripts/"];
const SHARED_DIRS = ["components", "hooks", "lib", "styles", "data", "features"];
const FRAMEWORK_DIRS = { next: ["app"], astro: ["pages", "layouts", "content", "assets"] };
const TEST_IN_SRC = /(^|\/)src\/.*\.(test|spec)\.[cm]?[jt]sx?$/;
const BUILD_OR_CACHE = /(^|\/)(dist|\.astro|\.next|\.turbo)\/|\.tsbuildinfo$/;

export function structureProblems(repo: Repo): string[] {
	const out: string[] = [];
	for (const glob of repo.rootPkg.workspaces ?? [])
		if (!WORKSPACE_ROOTS.some((root) => glob.startsWith(root)))
			out.push(
				`package.json (STR-001): workspace "${glob}" is outside apps/, packages/, examples/ and scripts/`,
			);
	for (const file of repo.files) {
		if (TEST_IN_SRC.test(file)) out.push(`${file} (STR-002): tests go in test/ or e2e/, not in src/`);
		if (BUILD_OR_CACHE.test(file))
			out.push(`${file} (STR-008): build output or cache tracked by Git; add it to .gitignore`);
	}
	for (const w of repo.workspaces.filter((x) => x.app)) {
		const inside = repo.files
			.filter((f) => f.startsWith(`${w.dir}/`))
			.map((f) => f.slice(w.dir.length + 1));
		const next = has(w.pkg, "next");
		if (next && !inside.some((f) => f.startsWith("src/app/")))
			out.push(`${w.dir} (STR-003): a Next app keeps its routes in src/app/`);
		if (next && inside.some((f) => f.startsWith("app/")))
			out.push(`${w.dir}/app (STR-003): move it to src/app/`);
		const allowed = [
			...SHARED_DIRS,
			...(next ? FRAMEWORK_DIRS.next : []),
			...(has(w.pkg, "astro") ? FRAMEWORK_DIRS.astro : []),
		];
		const dirs = new Set(inside.flatMap((f) => /^src\/([^/]+)\//.exec(f)?.[1] ?? []));
		for (const dir of dirs)
			if (!allowed.includes(dir))
				out.push(
					`${w.dir}/src/${dir} (STR-004): only framework folders, ${SHARED_DIRS.slice(0, -1).join(", ")} and features/ go in src/; move it to src/features/${dir}/ or a shared folder`,
				);
	}
	return out;
}

// ── LNG-005 ────────────────────────────────────────────────────────────────────────────────────────────────────────

// Built from code points so that this file does not break the rule it checks.
const DASHES: Record<string, string> = {
	[String.fromCodePoint(0xb7)]: "a middle dot",
	[String.fromCodePoint(0x2014)]: "an em dash",
	[String.fromCodePoint(0x2013)]: "an en dash",
};
const DASH = `[${Object.keys(DASHES).join("")}]`;
const FORBIDDEN = new RegExp(DASH);
/** A lone mention of the character, which is how a text names it: `«·»` or the bare character between backticks. */
// No spaces inside the backticks: "`right` - `left`" with a dot would otherwise look like a mention.
const MENTION = new RegExp(`«[ ]?${DASH}[ ]?»|\`${DASH}\``, "g");
const TEXT_FILE = /\.(md|mdx|ya?ml|jsonc?|tsx?|mts|astro|mjs|cjs|js|css|html|svg|txt)$/;
/** History, frozen copies, files written by outside tools and generated output stay as they are. */
const OUT_OF_TYPOGRAPHY =
	/^(reference\/|openspec\/changes\/archive\/|\.claude\/|packages\/assets\/assets\/)|(^|\/)CHANGELOG\.md$|\.generated\./;

/** Whether LNG-005 applies to a file tracked by Git. */
export const inTypographyScope = (path: string): boolean =>
	TEXT_FILE.test(path) && !OUT_OF_TYPOGRAPHY.test(path);

/** Each line (from 1) of `text` with a middle dot, an em dash or an en dash, and which one it is. */
export function dashesIn(text: string): { line: number; name: string }[] {
	const out: { line: number; name: string }[] = [];
	text.split("\n").forEach((line, i) => {
		const found = FORBIDDEN.exec(line.replace(MENTION, ""));
		if (found) out.push({ line: i + 1, name: DASHES[found[0]] ?? found[0] });
	});
	return out;
}

export function typographyProblems(repo: Repo): string[] {
	return repo.texts.flatMap((file) =>
		dashesIn(file.text).map(
			({ line, name }) => `${file.path}:${line} (LNG-005): uses ${name}; write a plain hyphen "-"`,
		),
	);
}

// ── TST ────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Test runners the suite does not use (TST-002). */
const FOREIGN_RUNNERS = ["jest", "mocha", "cypress"];

export function testingProblems(repo: Repo): string[] {
	const out: string[] = [];
	for (const w of repo.workspaces) {
		const file = `${w.dir}/package.json`;
		for (const name of Object.keys(allDeps(w.pkg)))
			if (FOREIGN_RUNNERS.includes(name) || name.startsWith("@jest/"))
				out.push(
					`${file} (TST-002): depends on \`${name}\`; tests run with Vitest, Playwright or \`bun test\``,
				);
		const test = w.pkg.scripts?.test;
		if (test !== undefined && !/\bvitest\b|\bbun test\b/.test(test))
			out.push(`${file} (TST-002): the \`test\` script runs neither Vitest nor \`bun test\``);
		const e2e = w.pkg.scripts?.["test:e2e"];
		if (e2e !== undefined && !/\bplaywright test\b/.test(e2e))
			out.push(`${file} (TST-002): the \`test:e2e\` script does not run Playwright`);
	}
	for (const file of repo.sources) {
		if (/(^|\/)e2e\//.test(file.path))
			file.text.split("\n").forEach((line, i) => {
				if (/\bwaitForTimeout\(/.test(line))
					out.push(
						`${file.path}:${i + 1} (TST-004): a fixed wait; wait for a condition, or move the test clock (\`page.clock\`)`,
					);
			});
		// A text search on purpose: the config is not run here, and Biome formats it predictably
		if (/(^|\/)playwright\.config\.[cm]?[jt]s$/.test(file.path)) {
			const retries = /\bretries\s*:\s*([^,\n]+)/.exec(file.text)?.[1]?.trim();
			if (retries !== undefined && retries !== "0" && !/\bfailOnFlakyTests\s*:/.test(file.text))
				out.push(
					`${file.path} (TST-004): retries tests without \`failOnFlakyTests\`, so a flaky test passes in silence`,
				);
		}
	}
	return out;
}

// ── SEC ────────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Owners whose actions can stay on a major tag (SEC-007); a local action (`./`) has no version at all. */
const PINNED_EXEMPT = /^(actions|github)\/|^\.\/|^docker:\/\//;
const PINNED = /@[0-9a-f]{40}$/;
/** A dependency that does not come from the registry (SEC-013): Git, a hosted repo, a URL or a local tarball. */
const OFF_REGISTRY = /^(git\+|git:|github:|gitlab:|bitbucket:|https?:|file:)|^[\w.-]+\/[\w.-]+(#.*)?$/;
const UNTRUSTED = /\$\{\{\s*github\.(event\.|head_ref\b)/;

type SecStep = { name?: string; uses?: string; run?: string };
type SecJob = { uses?: string; steps?: SecStep[] };

export function securityProblems(repo: Repo): string[] {
	const out: string[] = [];
	const add = (file: string, rule: string, text: string) => out.push(`${file} (${rule}): ${text}`);

	const published = repo.workspaces.filter((w) => w.published);
	const texts = [...repo.workflows.map((w) => w.text), ...repo.sources.map((src) => src.text)];
	for (const { path, text } of repo.workflows)
		for (const token of ["NPM_TOKEN", "NODE_AUTH_TOKEN"])
			if (text.includes(token))
				add(path, "SEC-005", `names \`${token}\`: npm publishes with trusted publishing`);
	const provenance =
		texts.some((t) => t.includes("--provenance")) ||
		published.every((w) => (w.pkg as { publishConfig?: Json }).publishConfig?.provenance === true);
	if (published.length > 0 && !provenance)
		add(
			"package.json",
			"SEC-005",
			"nothing publishes with `--provenance` (or `publishConfig.provenance`)",
		);

	for (const { path, workflow, text } of repo.workflows) {
		const root = (workflow as { permissions?: unknown }).permissions;
		const values = root && typeof root === "object" ? Object.values(root) : [root];
		if (root === undefined) add(path, "SEC-006", "declares no `permissions` at its root");
		else if (!(root === "read-all" || values.every((v) => v === "read" || v === "none")))
			add(path, "SEC-006", "the root `permissions` grant writing; ask for it in the job that needs it");

		const on = workflow.on;
		const events = typeof on === "string" ? [on] : Array.isArray(on) ? on : Object.keys(on ?? {});
		if (events.includes("pull_request_target"))
			add(
				path,
				"SEC-008",
				"uses `pull_request_target`, which runs the PR with the secrets of the repo",
			);

		const lines = text.split("\n");
		for (const [id, job] of Object.entries((workflow.jobs ?? {}) as Record<string, SecJob>)) {
			const uses = [job.uses, ...(job.steps ?? []).map((st) => st.uses)].filter(
				(u): u is string => typeof u === "string",
			);
			for (const action of uses) {
				if (PINNED_EXEMPT.test(action)) continue;
				if (!PINNED.test(action))
					add(
						path,
						"SEC-007",
						`job "${id}" uses \`${action}\`: pin it to the full SHA of its commit`,
					);
				else if (!lines.some((l) => l.includes(action) && /#\s*\S/.test(l.slice(l.indexOf(action)))))
					add(path, "SEC-007", `job "${id}" pins \`${action}\` without its version in a comment`);
			}
			for (const st of job.steps ?? [])
				if (UNTRUSTED.test(st.run ?? ""))
					add(
						path,
						"SEC-008",
						`job "${id}", step "${st.name ?? "(unnamed)"}" puts the event or the branch name inside \`run:\`; pass it through \`env:\``,
					);
		}
	}

	const ignored = repo.gitignore.split("\n").map((l) => l.trim());
	for (const entry of [".env", ".env.*"])
		if (!ignored.includes(entry)) add(".gitignore", "SEC-009", `does not ignore \`${entry}\``);
	if (!repo.files.includes("SECURITY.md"))
		add("SECURITY.md", "SEC-010", "missing: the root says how to report a vulnerability in private");

	const manifests: [string, PackageJson][] = [
		["package.json", repo.rootPkg],
		...repo.workspaces.map((w): [string, PackageJson] => [`${w.dir}/package.json`, w.pkg]),
	];
	for (const [file, pkg] of manifests)
		for (const [name, range] of Object.entries(allDeps(pkg)))
			if (OFF_REGISTRY.test(range))
				add(file, "SEC-013", `\`${name}\` comes from \`${range}\`, not from the npm registry`);
	return out;
}

const isDay = (value: string) =>
	/^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

/**
 * The standards the repo does not follow yet live in standards-exceptions.json, each with its reason and its last
 * day. An exception only covers a standard verified by review: it cannot switch off an automatic check.
 */
export function exceptionProblems(repo: Repo, today: string): string[] {
	const raw = repo.standardsExceptions;
	if (raw === null) return [];
	const file = "standards-exceptions.json";
	if (!Array.isArray(raw)) return [`${file}: must be an array`];
	const out: string[] = [];
	raw.forEach((item: unknown, index) => {
		const e = (typeof item === "object" && item !== null ? item : {}) as Record<string, unknown>;
		const text = (key: string) => (typeof e[key] === "string" ? (e[key] as string).trim() : "");
		const label = `${file} #${index + 1}${text("rule") ? ` (${text("rule")})` : ""}`;
		const missing = ["rule", "why", "until"].filter((key) => text(key) === "");
		if (missing.length > 0) {
			out.push(`${label}: has no ${missing.join(", ")}`);
			return;
		}
		const standard = repo.standards.find((s) => s.id === text("rule"));
		if (!standard) out.push(`${label}: there is no standard with that id`);
		else if (standard.kind !== "review")
			out.push(
				`${label}: the standard is verified by ${standard.kind}, and an exception cannot switch off a check`,
			);
		if (!isDay(text("until"))) out.push(`${label}: the day in until must be YYYY-MM-DD`);
		else if (text("until") < today) out.push(`${label}: expired on ${text("until")}`);
	});
	return out;
}

export function devProblems(repo: Repo, today = new Date().toISOString().slice(0, 10)): string[] {
	return [
		...exceptionProblems(repo, today),
		...stackProblems(repo),
		...codeProblems(repo),
		...testingProblems(repo),
		...securityProblems(repo),
		...docProblems(repo),
		...agentProblems(repo),
		...dependencyProblems(repo),
		...structureProblems(repo),
		...typographyProblems(repo),
	];
}

// ── reading the repo ───────────────────────────────────────────────────────────────────────────────────────────────

const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8")) as Json;
const readText = (root: string, path: string) =>
	existsSync(join(root, path)) ? readFileSync(join(root, path), "utf8") : null;

/** Expands the `workspaces` globs of the root package.json into directories that hold a package.json. */
export function workspaceDirs(root: string, patterns: string[]): string[] {
	const dirs: string[] = [];
	for (const pattern of patterns) {
		if (pattern.endsWith("/*")) {
			const base = pattern.slice(0, -2);
			if (existsSync(join(root, base)))
				for (const d of readdirSync(join(root, base), { withFileTypes: true }))
					if (d.isDirectory() && existsSync(join(root, base, d.name, "package.json")))
						dirs.push(`${base}/${d.name}`);
		} else if (existsSync(join(root, pattern, "package.json"))) dirs.push(pattern);
	}
	return dirs;
}

/** `compilerOptions` of the workspace's tsconfig with its `extends` resolved, as the workspace's own `tsc` sees them. */
function resolvedCompilerOptions(root: string, dir: string): Json | null {
	if (!existsSync(join(root, dir, "tsconfig.json"))) return null;
	const r = Bun.spawnSync(["bunx", "tsc", "--showConfig", "-p", "."], { cwd: join(root, dir) });
	if (r.exitCode !== 0) throw new Error(`tsc --showConfig failed in ${dir}: ${r.stderr.toString()}`);
	return (JSON.parse(r.stdout.toString()) as { compilerOptions?: Json }).compilerOptions ?? {};
}

export function readRepo(root: string): Repo {
	const rootPkg = readJson(join(root, "package.json")) as PackageJson;
	const tracked = Bun.spawnSync(["git", "ls-files"], { cwd: root })
		.stdout.toString()
		.split("\n")
		.filter(Boolean);
	const workspaces: Workspace[] = workspaceDirs(root, rootPkg.workspaces ?? []).map((dir) => {
		const pkg = readJson(join(root, dir, "package.json")) as PackageJson;
		const readme = join(root, dir, "README.md");
		return {
			dir,
			pkg,
			published: pkg.private !== true,
			app: dir.startsWith("apps/") || dir.startsWith("examples/"),
			compilerOptions: resolvedCompilerOptions(root, dir),
			readme: existsSync(readme) ? readFileSync(readme, "utf8") : null,
			hasVercelJson: existsSync(join(root, dir, "vercel.json")),
		};
	});
	const workflowDir = join(root, ".github/workflows");
	const dependabot = join(root, ".github/dependabot.yml");
	return {
		rootPkg,
		lockfiles: tracked.filter((f) =>
			/(^|\/)(bun\.lockb?|package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$/.test(f),
		),
		foreignConfigs: tracked.filter((f) =>
			/(^|\/)(\.eslintrc[\w.]*|eslint\.config\.[\w]+|\.prettierrc[\w.]*|prettier\.config\.[\w]+)$/.test(
				f,
			),
		),
		biome: readJson(join(root, "biome.json")),
		workflows: existsSync(workflowDir)
			? readdirSync(workflowDir)
					.filter((f) => /\.ya?ml$/.test(f))
					.map((f) => {
						const text = readFileSync(join(workflowDir, f), "utf8");
						return {
							path: `.github/workflows/${f}`,
							workflow: Bun.YAML.parse(text) as Workflow,
							text,
						};
					})
			: [],
		dependabot: existsSync(dependabot)
			? (Bun.YAML.parse(readFileSync(dependabot, "utf8")) as Json)
			: null,
		rootReadme: readFileSync(join(root, "README.md"), "utf8"),
		workspaces,
		sources: tracked
			.filter((f) => /\.(tsx?|mts|astro|mjs|js)$/.test(f))
			.map((path) => ({ path, text: readFileSync(join(root, path), "utf8") })),
		files: tracked,
		texts: tracked
			.filter(inTypographyScope)
			.filter((path) => existsSync(join(root, path)))
			.map((path) => ({ path, text: readFileSync(join(root, path), "utf8") })),
		gitignore: existsSync(join(root, ".gitignore")) ? readFileSync(join(root, ".gitignore"), "utf8") : "",
		standards: tracked
			.filter((f) => /^apps\/docs\/src\/content\/standards\/[\w-]+\.yaml$/.test(f))
			.flatMap((f) => {
				const area = Bun.YAML.parse(readFileSync(join(root, f), "utf8")) as {
					rules?: { id: string; verification: { kind: string } }[];
				};
				return (area.rules ?? []).map((r) => ({ id: r.id, kind: r.verification.kind }));
			}),
		standardsExceptions: existsSync(join(root, "standards-exceptions.json"))
			? readJson(join(root, "standards-exceptions.json"))
			: null,
		agentsMd: readText(root, "AGENTS.md"),
		claudeMd: readText(root, "CLAUDE.md"),
		mcpJson: readText(root, ".mcp.json"),
		claudeSettings: readText(root, ".claude/settings.json"),
	};
}

if (import.meta.main) {
	const problems = devProblems(readRepo(join(import.meta.dir, "..")));
	if (problems.length > 0) {
		console.error(
			`The repo does not follow the development standards:\n${problems.map((p) => `  - ${p}`).join("\n")}`,
		);
		process.exit(1);
	}
	console.log("The repo follows the development standards.");
}
