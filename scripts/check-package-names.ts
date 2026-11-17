// Checks the `name` of every package in the workspace against the naming standards (NAM-001 and NAM-002):
// private packages are named after the product domain, reversed (`me.jotis.regula.docs`); published ones live under
// the `@jotis-me` scope. The product prefix is the root package's own name, so the same script works in any
// repository of the suite.
// Usage: bun run scripts/check-package-names.ts   (exits 1 and lists the offending packages)
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

export interface WorkspacePackage {
	/** Directory relative to the repository root, with `/` (`apps/docs`). */
	dir: string;
	name: string;
	private: boolean;
}

const SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const PRODUCT = /^me\.jotis\.[a-z0-9]+(-[a-z0-9]+)*$/;
const PUBLIC = /^@jotis-me\/[a-z0-9]+(-[a-z0-9]+)*$/;

/** The name a private package in `dir` should have: `apps/x` → `<prefix>.x`, `examples/x` → `<prefix>.example.x`. */
export function suggestedName(prefix: string, dir: string): string {
	const parent = basename(dirname(dir));
	return parent === "examples" ? `${prefix}.example.${basename(dir)}` : `${prefix}.${basename(dir)}`;
}

/** Everything wrong with the names of the workspace packages; empty when all follow the standards. */
export function nameProblems(rootName: string, packages: WorkspacePackage[]): string[] {
	if (!PRODUCT.test(rootName))
		return [
			`root package.json: "${rootName}" must be the product domain reversed, like "me.jotis.regula"`,
		];
	const problems: string[] = [];
	for (const pkg of packages) {
		const where = `${pkg.dir}/package.json`;
		if (pkg.private) {
			const rest = pkg.name.startsWith(`${rootName}.`)
				? pkg.name.slice(rootName.length + 1)
				: undefined;
			if (rest === undefined || !rest.split(".").every((s) => SEGMENT.test(s)))
				problems.push(
					`${where}: private package "${pkg.name}" must be "${rootName}" plus lowercase segments, try "${suggestedName(rootName, pkg.dir)}"`,
				);
		} else if (!PUBLIC.test(pkg.name)) {
			problems.push(`${where}: published package "${pkg.name}" must be "@jotis-me/<name>"`);
		}
	}
	return problems;
}

/** The directories a `workspaces` entry stands for: `packages/*` lists its subfolders, anything else is one folder. */
function expand(root: string, pattern: string): string[] {
	if (!pattern.endsWith("/*")) return [pattern];
	const base = pattern.slice(0, -2);
	return readdirSync(join(root, base), { withFileTypes: true })
		.filter((d) => d.isDirectory() && existsSync(join(root, base, d.name, "package.json")))
		.map((d) => `${base}/${d.name}`);
}

export function readWorkspace(root: string): { rootName: string; packages: WorkspacePackage[] } {
	const read = (dir: string) => JSON.parse(readFileSync(join(root, dir, "package.json"), "utf8"));
	const rootPkg = read(".");
	const packages = (rootPkg.workspaces as string[])
		.flatMap((w) => expand(root, w))
		.map((dir) => {
			const pkg = read(dir);
			return { dir, name: pkg.name as string, private: pkg.private === true };
		});
	return { rootName: rootPkg.name as string, packages };
}

if (import.meta.main) {
	const { rootName, packages } = readWorkspace(join(import.meta.dirname, ".."));
	const problems = nameProblems(rootName, packages);
	if (problems.length) {
		console.error(
			`Package names that break the naming standards:\n${problems.map((p) => `  - ${p}`).join("\n")}`,
		);
		process.exit(1);
	}
	console.log(`${packages.length} workspace packages follow the naming standards.`);
}
