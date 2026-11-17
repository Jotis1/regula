import { describe, expect, it } from "bun:test";
import {
	codeProblems,
	dependencyProblems,
	devProblems,
	docProblems,
	jsdocProblems,
	type Repo,
	stackProblems,
	suppressionProblems,
	TS_FLAGS,
	type Workspace,
} from "./check-dev";

const FLAGS = Object.fromEntries(TS_FLAGS.map((f) => [f, true]));
const BIOME = {
	vcs: { enabled: true, clientKind: "git", useIgnoreFile: true },
	formatter: { indentStyle: "tab", indentWidth: 4, lineWidth: 110 },
	linter: {
		rules: {
			preset: "recommended",
			suspicious: {
				noExplicitAny: "error",
				noTsIgnore: "error",
				noConsole: { level: "error", options: { allow: ["error", "warn"] } },
			},
			style: {
				noEnum: "error",
				noNonNullAssertion: "error",
				noDefaultExport: "error",
				useImportType: "error",
				useFilenamingConvention: { level: "error", options: { filenameCases: ["kebab-case"] } },
			},
			performance: { noReExportAll: "error", noNamespaceImport: "error" },
		},
	},
	javascript: { formatter: { quoteStyle: "double", semicolons: "always" } },
	assist: { actions: { source: { organizeImports: "on" } } },
};
const UPDATE = {
	schedule: { interval: "weekly" },
	groups: { "minor-patch": { "update-types": ["minor", "patch"] } },
	"commit-message": { prefix: "build", include: "scope" },
};

const lib = (): Workspace => ({
	dir: "packages/lib",
	pkg: {
		name: "@jotis-me/lib",
		scripts: { typecheck: "tsc --noEmit" },
		sideEffects: false,
		dependencies: { clsx: "^2.1.1", "@untitledui/icons": "0.0.23" },
		peerDependencies: { react: "^19.3.1" },
		devDependencies: { typescript: "^7.0.2" },
	},
	published: true,
	app: false,
	compilerOptions: { ...FLAGS, module: "nodenext", moduleResolution: "nodenext" },
	readme: "# lib\n\nGuide: https://regula.jotis.me",
	hasVercelJson: false,
});
const site = (): Workspace => ({
	dir: "apps/site",
	pkg: {
		name: "me.jotis.site",
		private: true,
		scripts: { typecheck: "astro check" },
		engines: { node: "24.x" },
		dependencies: { astro: "^7" },
		devDependencies: { "@astrojs/check": "^0.9.12", typescript: "^6" },
	},
	published: false,
	app: true,
	compilerOptions: { ...FLAGS },
	readme: null,
	hasVercelJson: true,
});

/** A repo that follows every rule; each test breaks one thing. */
const good = (): Repo => ({
	rootPkg: {
		packageManager: "bun@1.4.3",
		scripts: { build: "turbo run build", typecheck: "turbo run typecheck", test: "turbo run test" },
		devDependencies: { typescript: "^7.0.2" },
		workspaces: ["packages/*", "apps/*"],
	},
	lockfiles: ["bun.lock"],
	foreignConfigs: [],
	biome: structuredClone(BIOME),
	workflows: [
		{
			path: ".github/workflows/ci.yml",
			workflow: {
				jobs: {
					checks: {
						steps: [
							{ uses: "oven-sh/setup-bun@v2", with: { "bun-version-file": "package.json" } },
							{ run: "bun install --frozen-lockfile" },
							{ run: "bunx biome ci --error-on-warnings ." },
						],
					},
				},
			},
		} as Repo["workflows"][number],
	],
	dependabot: {
		version: 2,
		updates: [
			{ "package-ecosystem": "bun", ...UPDATE },
			{ "package-ecosystem": "github-actions", ...UPDATE },
		],
	},
	rootReadme:
		"# Repo\n\n```sh\nbun install\nbun run build\nbun run --cwd apps/site dev\nbun run test\n```\n",
	workspaces: [lib(), site()],
	sources: [],
});

const withWorkspace = (repo: Repo, dir: string, change: (w: Workspace) => void): Repo => {
	const copy = structuredClone(repo);
	const w = copy.workspaces.find((x) => x.dir === dir);
	if (!w) throw new Error(`no workspace ${dir}`);
	change(w);
	return copy;
};
const rules = (problems: string[]) => problems.map((p) => /\((\w+-\d+)\)/.exec(p)?.[1]);

describe("check-dev", () => {
	it("accepts a repo that follows the standards", () => {
		expect(devProblems(good())).toEqual([]);
	});

	describe("stack", () => {
		it("rejects an app built with neither Next nor Astro (STK-001)", () => {
			const repo = withWorkspace(good(), "apps/site", (w) => {
				w.pkg.dependencies = { vite: "^7" };
				w.pkg.devDependencies = {};
			});
			expect(stackProblems(repo).join("\n")).toContain("apps/site/package.json (STK-001)");
		});

		it("rejects Bun without an exact version, another lockfile and a setup-bun without the version file (STK-002)", () => {
			const repo = good();
			repo.rootPkg.packageManager = "bun@^1.4";
			repo.lockfiles.push("package-lock.json");
			const step = (repo.workflows[0] as Repo["workflows"][number]).workflow.jobs?.checks?.steps?.[0];
			if (step) (step as { with?: unknown }).with = {};
			const problems = stackProblems(repo);
			expect(problems.filter((p) => p.includes("STK-002"))).toHaveLength(3);
			expect(problems.join("\n")).toContain("package-lock.json (STK-002)");
		});

		it("rejects ESLint and Prettier, as dependency or as config (STK-003)", () => {
			const repo = withWorkspace(good(), "apps/site", (w) => {
				w.pkg.devDependencies = { ...w.pkg.devDependencies, prettier: "^3" };
			});
			repo.foreignConfigs.push(".eslintrc.json");
			const problems = stackProblems(repo);
			expect(problems.join("\n")).toContain("apps/site/package.json (STK-003)");
			expect(problems.join("\n")).toContain(".eslintrc.json (STK-003)");
		});

		it("rejects a missing piece of the Biome block, a rule in warn and a Biome step without the flag (STK-004)", () => {
			const missing = good();
			delete (missing.biome.linter as { rules: Record<string, unknown> }).rules.performance;
			expect(stackProblems(missing).join("\n")).toContain("`linter.rules.performance.noReExportAll`");

			const warn = good();
			(warn.biome.linter as { rules: { style: Record<string, unknown> } }).rules.style.noEnum = "warn";
			expect(stackProblems(warn).join("\n")).toContain('is "warn"');

			const flag = good();
			const steps = (flag.workflows[0] as Repo["workflows"][number]).workflow.jobs?.checks?.steps;
			if (steps?.[2]) steps[2].run = "bunx biome ci .";
			expect(stackProblems(flag).join("\n")).toContain("without `--error-on-warnings`");
		});

		it("does not take the options of a rule for a rule in warn (STK-004)", () => {
			expect(stackProblems(good()).join("\n")).not.toContain('is "warn"');
		});

		it("rejects a root script that does not call Turbo (STK-005)", () => {
			const repo = good();
			(repo.rootPkg.scripts as Record<string, string>).test = "bun test";
			expect(rules(stackProblems(repo))).toEqual(["STK-005"]);
		});

		it("rejects a deployed app without engines.node (STK-006)", () => {
			const repo = withWorkspace(good(), "apps/site", (w) => {
				w.pkg.engines = undefined;
			});
			expect(rules(stackProblems(repo))).toEqual(["STK-006"]);
		});

		it("rejects a repo without Dependabot, or with it not weekly, grouped and with the build prefix (STK-007)", () => {
			const none = good();
			none.dependabot = null;
			expect(stackProblems(none).filter((p) => p.includes("STK-007"))).toHaveLength(2);

			const loose = good();
			const bun = (loose.dependabot as { updates: Record<string, unknown>[] }).updates[0] ?? {};
			bun.schedule = { interval: "daily" };
			bun.groups = {};
			bun["commit-message"] = { prefix: "chore" };
			expect(stackProblems(loose).filter((p) => p.includes("STK-007"))).toHaveLength(3);
		});
	});

	describe("code", () => {
		it("rejects a tsconfig that misses a flag (COD-001)", () => {
			for (const flag of TS_FLAGS) {
				const repo = withWorkspace(good(), "apps/site", (w) => {
					w.compilerOptions = { ...FLAGS, [flag]: undefined };
				});
				expect(codeProblems(repo).join("\n")).toContain(
					`apps/site/tsconfig.json (COD-001): \`${flag}\``,
				);
			}
		});

		it("rejects a workspace with a tsconfig and no typecheck script (COD-002)", () => {
			const repo = withWorkspace(good(), "packages/lib", (w) => {
				w.pkg.scripts = {};
			});
			expect(rules(codeProblems(repo))).toEqual(["COD-002"]);
		});

		it("skips a workspace without tsconfig", () => {
			const repo = withWorkspace(good(), "packages/lib", (w) => {
				w.compilerOptions = null;
				w.pkg.scripts = {};
			});
			expect(codeProblems(repo)).toEqual([]);
		});

		it("rejects a published package that does not compile with NodeNext (COD-007)", () => {
			const repo = withWorkspace(good(), "packages/lib", (w) => {
				w.compilerOptions = { ...FLAGS, module: "esnext", moduleResolution: "bundler" };
			});
			expect(rules(codeProblems(repo))).toEqual(["COD-007"]);
		});

		it("does not ask an app for NodeNext", () => {
			expect(codeProblems(good()).join("\n")).not.toContain("COD-007");
		});
	});

	describe("suppressions (COD-005)", () => {
		const check = (text: string) => suppressionProblems({ path: "src/a.ts", text });

		it("never allows @ts-ignore or @ts-nocheck", () => {
			expect(check("// @ts-ignore\nconst a = 1;")).toHaveLength(1);
			expect(check("// @ts-ignore: it is a long story")).toHaveLength(1);
			expect(check("// @ts-nocheck: the registry brings the web's types")).toHaveLength(1);
		});

		it("asks @ts-expect-error for a reason", () => {
			expect(check("// @ts-expect-error")).toHaveLength(1);
			expect(check("// @ts-expect-error:")).toHaveLength(1);
			expect(check("// @ts-expect-error: there is no `ghost` hierarchy")).toEqual([]);
			expect(check("// @ts-expect-error no label, no accessible name")).toEqual([]);
			expect(check("{/* @ts-expect-error: slots arrive as props */}")).toEqual([]);
		});

		it("asks biome-ignore for a reason after the colon", () => {
			expect(check("// biome-ignore lint/suspicious/noExplicitAny")).toHaveLength(1);
			expect(check("// biome-ignore lint/suspicious/noExplicitAny: ")).toHaveLength(1);
			expect(
				check("// biome-ignore lint/suspicious/noExplicitAny: the library types it that way"),
			).toEqual([]);
			expect(check("// biome-ignore-all lint/style/noEnum: generated")).toEqual([]);
		});

		it("ignores the same words inside a string or a sentence", () => {
			expect(check('const s = "// @ts-ignore";')).toEqual([]);
			expect(check("// we no longer use @ts-ignore here")).toEqual([]);
		});
	});

	describe("documentation", () => {
		const gaps = (text: string) => jsdocProblems({ path: "packages/lib/src/a.tsx", text });

		it("rejects an export without JSDoc (DOC-001)", () => {
			expect(gaps("export function Badge() {}")).toHaveLength(1);
			expect(gaps("export async function load() {}")).toHaveLength(1);
			expect(gaps("export const ALERT = 1;")).toHaveLength(1);
			expect(gaps("export class Store {}")).toHaveLength(1);
		});

		it("accepts an export with JSDoc, a multi-line one, or one with a // comment in between (DOC-001)", () => {
			expect(gaps("/** A badge. */\nexport function Badge() {}")).toEqual([]);
			expect(gaps("/**\n * A badge.\n * @default 1\n */\nexport const BADGE = 1;")).toEqual([]);
			expect(
				gaps("/** A badge. */\n// biome-ignore lint/x: because\nexport function Badge() {}"),
			).toEqual([]);
		});

		it("does not count a // comment as JSDoc, nor a re-export (DOC-001)", () => {
			expect(gaps("// A badge.\nexport function Badge() {}")).toHaveLength(1);
			expect(gaps('export { Badge } from "./Badge.js";')).toEqual([]);
			expect(gaps("export const a = {\n\tb: 1,\n};")).toHaveLength(1);
		});

		it("rejects a prop without JSDoc, optional or read-only (DOC-002)", () => {
			const text =
				"interface BadgeProps {\n\tsize?: string;\n\treadonly label: string;\n\tonClick(): void;\n}";
			expect(gaps(text)).toHaveLength(3);
			expect(gaps("export type X = {\n\tsize?: string;\n};")).toHaveLength(1);
			expect(gaps('interface P {\n\t"aria-label"?: string;\n}')).toHaveLength(1);
		});

		it("accepts documented props and ignores the body of a type member (DOC-002)", () => {
			const text =
				"interface BadgeProps {\n\t/** The size. */\n\tsize?: string;\n\t/** Where. */\n\tauthor?: {\n\t\tname: string;\n\t};\n}";
			expect(gaps(text)).toEqual([]);
		});

		it("rejects a @deprecated without a replacement (DOC-003)", () => {
			expect(gaps("/** @deprecated */\nexport const a = 1;")).toHaveLength(1);
			expect(gaps("/**\n * @deprecated\n */\nexport const a = 1;")).toHaveLength(1);
			expect(gaps("/** @deprecated Use `hierarchy` instead. */\nexport const a = 1;")).toEqual([]);
		});

		it("rejects a published package without README or without the link (DOC-004)", () => {
			const none = withWorkspace(good(), "packages/lib", (w) => {
				w.readme = null;
			});
			expect(rules(docProblems(none))).toEqual(["DOC-004"]);
			const noLink = withWorkspace(good(), "packages/lib", (w) => {
				w.readme = "# lib";
			});
			expect(rules(docProblems(noLink))).toEqual(["DOC-004"]);
		});

		it("applies the JSDoc rules to the src of published packages only, without generated or internal files (DOC-001)", () => {
			const repo = good();
			const bad = "export function f() {}";
			repo.sources = [
				{ path: "packages/lib/src/a.ts", text: bad },
				{ path: "packages/lib/src/b.generated.tsx", text: bad },
				{ path: "packages/lib/src/internal/c.ts", text: bad },
				{ path: "packages/lib/scripts/d.ts", text: bad },
				{ path: "apps/site/src/e.ts", text: bad },
			];
			expect(docProblems(repo)).toHaveLength(1);
			expect(docProblems(repo)[0]).toContain("packages/lib/src/a.ts:1");
		});

		it("rejects a root README without the commands (DOC-005)", () => {
			const repo = good();
			repo.rootReadme = "# Repo\n\n```sh\nbun install\n```\n";
			const problems = docProblems(repo);
			expect(problems).toHaveLength(3);
			expect(problems.join("\n")).toContain("start (dev)");
			expect(problems.join("\n")).toContain("test");
		});
	});

	describe("dependencies", () => {
		it("rejects a bun install without --frozen-lockfile (VER-006)", () => {
			const repo = good();
			const steps = (repo.workflows[0] as Repo["workflows"][number]).workflow.jobs?.checks?.steps;
			if (steps?.[1]) steps[1].run = "bun install";
			expect(rules(dependencyProblems(repo))).toEqual(["VER-006"]);
		});

		it("rejects a shared framework in dependencies, not in peerDependencies (VER-007)", () => {
			const repo = withWorkspace(good(), "packages/lib", (w) => {
				w.pkg.dependencies = { ...w.pkg.dependencies, react: "^19.3.1" };
			});
			expect(rules(dependencyProblems(repo))).toEqual(["VER-007"]);
		});

		it("rejects a 0.x dependency with a range, but not a dev one (VER-008)", () => {
			const loose = withWorkspace(good(), "packages/lib", (w) => {
				w.pkg.dependencies = { ...w.pkg.dependencies, "@untitledui/icons": "^0.0.23" };
			});
			expect(rules(dependencyProblems(loose))).toEqual(["VER-008"]);
			const dev = withWorkspace(good(), "packages/lib", (w) => {
				w.pkg.devDependencies = { ...w.pkg.devDependencies, publint: "^0.3.25" };
			});
			expect(dependencyProblems(dev)).toEqual([]);
		});

		it("rejects a published package without sideEffects (VER-011)", () => {
			const repo = withWorkspace(good(), "packages/lib", (w) => {
				w.pkg.sideEffects = undefined;
			});
			expect(rules(dependencyProblems(repo))).toEqual(["VER-011"]);
		});

		it("rejects one dependency with different ranges, and names both files (VER-010)", () => {
			const repo = withWorkspace(good(), "apps/site", (w) => {
				w.pkg.dependencies = { ...w.pkg.dependencies, clsx: "^2.0.0" };
			});
			const problems = dependencyProblems(repo);
			expect(rules(problems)).toEqual(["VER-010"]);
			expect(problems[0]).toContain("packages/lib/package.json");
			expect(problems[0]).toContain("apps/site/package.json");
		});

		it("lets the workspaces of Astro, Next and dts-bundle-generator pin TypeScript 6 (VER-010)", () => {
			expect(dependencyProblems(good())).toEqual([]);
			const next = withWorkspace(good(), "apps/site", (w) => {
				w.pkg.dependencies = { next: "^16" };
				w.pkg.devDependencies = { typescript: "^6" };
			});
			expect(dependencyProblems(next)).toEqual([]);
			const dts = withWorkspace(good(), "apps/site", (w) => {
				w.pkg.devDependencies = { "dts-bundle-generator": "^9.5.1", typescript: "^6" };
			});
			expect(dependencyProblems(dts)).toEqual([]);
			const plain = withWorkspace(good(), "apps/site", (w) => {
				w.pkg.devDependencies = { typescript: "^6" };
			});
			expect(rules(dependencyProblems(plain))).toEqual(["VER-010"]);
		});

		it("ignores workspace: and npm: ranges (VER-010)", () => {
			const repo = withWorkspace(good(), "apps/site", (w) => {
				w.pkg.dependencies = {
					...w.pkg.dependencies,
					"@jotis-me/lib": "workspace:*",
					"react-18": "npm:react@18.3.1",
				};
			});
			expect(dependencyProblems(repo)).toEqual([]);
		});
	});
});
