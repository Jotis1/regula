// Checks the development standards that a machine can see (STK, COD, DOC and VER areas) against the repo: workspaces,
// tsconfigs, Biome, the CI workflows, Dependabot, READMEs and the source of the published packages. What cannot be
// seen from here is checked in review.
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
	workflows: { path: string; workflow: Workflow }[];
	dependabot: Json | null;
	rootReadme: string;
	workspaces: Workspace[];
	/** Every `.ts`, `.tsx`, `.astro`, `.mjs` and `.js` file tracked by Git. */
	sources: SourceFile[];
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

/** The Biome block of the guide (STK-004): where it lives in `biome.json` and what it must say. */
const BIOME_BLOCK: [path: string[], expected: unknown][] = [
	[["linter", "rules", "preset"], "recommended"],
	[["linter", "rules", "suspicious", "noExplicitAny"], "error"],
	[["linter", "rules", "suspicious", "noTsIgnore"], "error"],
	[["linter", "rules", "suspicious", "noConsole"], "error"],
	[["linter", "rules", "style", "noEnum"], "error"],
	[["linter", "rules", "style", "noNonNullAssertion"], "error"],
	[["linter", "rules", "style", "noDefaultExport"], "error"],
	[["linter", "rules", "style", "useImportType"], "error"],
	[["linter", "rules", "style", "useFilenamingConvention"], "error"],
	[["linter", "rules", "performance", "noReExportAll"], "error"],
	[["linter", "rules", "performance", "noNamespaceImport"], "error"],
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
	const blocks = [...repo.rootReadme.matchAll(/```(?:sh|bash)?\n([\s\S]*?)```/g)]
		.map((m) => m[1] as string)
		.join("\n");
	for (const [word, re] of [
		["install", /\binstall\b/],
		["start (dev)", /\bdev\b/],
		["build", /\bbuild\b/],
		["test", /\btest\b/],
	] as const)
		if (!re.test(blocks)) out.push(`README.md (DOC-005): the code blocks must show how to ${word}`);
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
	// `astro check` and `next build` type-check through the TypeScript 6 JS API, so their workspaces pin `typescript` 6
	const ranges = new Map<string, Map<string, string[]>>();
	const note = (file: string, pkg: PackageJson) => {
		for (const field of ["dependencies", "devDependencies"] as const)
			for (const [name, range] of Object.entries(pkg[field] ?? {})) {
				if (range.startsWith("workspace:") || range.startsWith("npm:")) continue;
				if (name === "typescript" && (has(pkg, "@astrojs/check") || has(pkg, "next"))) continue;
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

export function devProblems(repo: Repo): string[] {
	return [...stackProblems(repo), ...codeProblems(repo), ...docProblems(repo), ...dependencyProblems(repo)];
}

// ── reading the repo ───────────────────────────────────────────────────────────────────────────────────────────────

const readJson = (path: string) => JSON.parse(readFileSync(path, "utf8")) as Json;

/** Expands the `workspaces` globs of the root package.json into directories that hold a package.json. */
function workspaceDirs(root: string, patterns: string[]): string[] {
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
					.map((f) => ({
						path: `.github/workflows/${f}`,
						workflow: Bun.YAML.parse(readFileSync(join(workflowDir, f), "utf8")) as Workflow,
					}))
			: [],
		dependabot: existsSync(dependabot)
			? (Bun.YAML.parse(readFileSync(dependabot, "utf8")) as Json)
			: null,
		rootReadme: readFileSync(join(root, "README.md"), "utf8"),
		workspaces,
		sources: tracked
			.filter((f) => /\.(tsx?|mts|astro|mjs|js)$/.test(f))
			.map((path) => ({ path, text: readFileSync(join(root, path), "utf8") })),
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
