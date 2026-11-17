// Checks that a PR which changes what a published package ships brings a changeset that names it, or an empty
// changeset (VER-002). `changeset status` would ask for one even if the PR only touches tests, and changesets 3 cannot
// say which files count, so the rule lives here.
// Usage: bun run scripts/check-changesets.ts <base> <head> [head branch]   (exits 1 and names the packages)
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { type PackageJson, workspaceDirs } from "./check-dev";

export interface PublishedPackage {
	name: string;
	/** Repository path (`packages/react`). */
	dir: string;
	/** `files` of its package.json: what npm ships besides the package.json itself. */
	files: string[];
	/** Its package.json at the base commit; `null` when the package is new. */
	base: Record<string, unknown> | null;
	head: Record<string, unknown>;
}

/** The branch the changesets action opens for the version PR: it removes the changesets on purpose. */
export const VERSION_BRANCH = "changeset-release/";

/** Names a changeset covers: the ones in its frontmatter, or `"all"` when the frontmatter is empty. */
export function coveredBy(changeset: string): string[] | "all" {
	const front = /^---\r?\n([\s\S]*?)\r?\n?---/.exec(changeset);
	if (!front) return [];
	const names = [...(front[1] as string).matchAll(/^\s*["']?([^"':\s][^"':]*)["']?\s*:/gm)].map((m) =>
		(m[1] as string).trim(),
	);
	return names.length === 0 ? "all" : names;
}

/** The package.json minus what is not shipped to the people who install the package. */
const shipped = (pkg: Record<string, unknown> | null) => {
	if (!pkg) return null;
	const { devDependencies: _dev, scripts: _scripts, ...rest } = pkg;
	return JSON.stringify(rest);
};

/** Whether the changed files include something the package publishes. */
export function changesWhatShips(pkg: PublishedPackage, changed: readonly string[]): boolean {
	const dir = `${pkg.dir}/`;
	const entries = pkg.files.filter((f) => f !== "dist" && f !== "dist/");
	for (const file of changed) {
		if (file.startsWith(`${dir}src/`)) return true;
		if (entries.some((e) => file === `${dir}${e}` || file.startsWith(`${dir}${e.replace(/\/$/, "")}/`)))
			return true;
	}
	return changed.includes(`${dir}package.json`) && shipped(pkg.base) !== shipped(pkg.head);
}

/** Published packages whose shipped files changed and that no changeset covers. */
export function uncovered(
	packages: readonly PublishedPackage[],
	changed: readonly string[],
	changesets: readonly string[],
): string[] {
	const covers = changesets.map(coveredBy);
	if (covers.includes("all")) return [];
	const named = new Set(covers.flat());
	return packages.filter((p) => changesWhatShips(p, changed) && !named.has(p.name)).map((p) => p.name);
}

/** Whether the PR is the version PR that changesets opens, which has no changesets left. */
export const isVersionBranch = (headRef: string | undefined) => (headRef ?? "").startsWith(VERSION_BRANCH);

// ── reading Git ────────────────────────────────────────────────────────────────────────────────────────────────────

const git = (args: string[], cwd: string) => {
	const r = Bun.spawnSync(["git", ...args], { cwd });
	return r.exitCode === 0 ? r.stdout.toString() : null;
};
const lines = (text: string | null) =>
	(text ?? "")
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);

export function readPackages(root: string, base: string): PublishedPackage[] {
	const rootPkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as PackageJson;
	return workspaceDirs(root, rootPkg.workspaces ?? [])
		.map((dir) => ({
			dir,
			head: JSON.parse(readFileSync(join(root, dir, "package.json"), "utf8")) as Record<
				string,
				unknown
			>,
		}))
		.filter(({ head }) => head.private !== true)
		.map(({ dir, head }) => {
			const before = git(["show", `${base}:${dir}/package.json`], root);
			return {
				name: String(head.name),
				dir,
				files: Array.isArray(head.files) ? (head.files as string[]) : [],
				base: before ? (JSON.parse(before) as Record<string, unknown>) : null,
				head,
			};
		});
}

/** Runs the check on the repository at `root` for the PR `base...head`; `ok: false` carries what to tell the author. */
export function check(
	root: string,
	base: string,
	head: string,
	headRef?: string,
): { ok: boolean; message: string } {
	if (isVersionBranch(headRef))
		return { ok: true, message: "The version PR removes the changesets on purpose: nothing to check." };
	const changed = git(["diff", "--name-only", `${base}...${head}`], root);
	if (changed === null) return { ok: false, message: `Could not compare ${base} with ${head}.` };
	const added = lines(
		git(["diff", "--name-only", "--diff-filter=ACMR", `${base}...${head}`, "--", ".changeset"], root),
	).filter((f) => f.endsWith(".md") && !f.endsWith("README.md"));
	// The changesets as the PR brings them, not as they are in the working tree
	const changesets = added.flatMap((f) => git(["show", `${head}:${f}`], root) ?? []);
	const missing = uncovered(readPackages(root, base), lines(changed), changesets);
	if (missing.length > 0)
		return {
			ok: false,
			message:
				`This PR changes what these packages publish, and no changeset names them: ${missing.join(", ")}.\n` +
				"Run `bun run changeset`, or add an empty changeset if there is nothing to release (VER-002).",
		};
	return { ok: true, message: `${changesets.length} changeset(s); every package that changed is covered.` };
}

if (import.meta.main) {
	const [base = "", head = "HEAD", headRef] = process.argv.slice(2);
	const result = check(join(import.meta.dir, ".."), base, head, headRef);
	(result.ok ? console.log : console.error)(result.message);
	process.exit(result.ok ? 0 : 1);
}
