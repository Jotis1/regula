// Decides whether a CI run has to check code (INT-002): the heavy jobs are skipped only when every changed file is
// in SKIP_PATHS, paths no check reads. Anything else, an empty diff or a failing `git diff` means "check everything":
// the safe side is to run, and a path joins the list only through a PR with its test.
// Usage: bun run scripts/ci-changes.ts <base> <head>   (writes `code=true|false` to $GITHUB_OUTPUT, or prints it)
import { appendFileSync } from "node:fs";
import { Glob } from "bun";

/** Paths that no check reads. Not here: the CI itself, Turbo, Biome or the root scripts, which every job uses. */
export const SKIP_PATHS = ["openspec/**", ".claude/**"] as const;

const globs = SKIP_PATHS.map((p) => new Glob(p));

/** Whether a repository path (with `/`) is one of the paths no check reads. */
export const isSkippable = (path: string) => globs.some((g) => g.match(path));

/** `true` when the CI has to check code: `files` is `null` if the diff could not be computed. */
export function needsCode(files: readonly string[] | null): boolean {
	if (files === null || files.length === 0) return true;
	return !files.every(isSkippable);
}

/**
 * Files changed between `base` and `head` (from their merge base, as a PR shows them), in the repository at `cwd`;
 * `null` if git fails.
 */
export function changedFiles(base: string, head: string, cwd?: string): string[] | null {
	// A push that creates a branch has no previous commit (`0000…`): there is nothing to compare with
	if (!base || /^0+$/.test(base)) return null;
	const diff = Bun.spawnSync(["git", "diff", "--name-only", `${base}...${head}`], { cwd });
	if (diff.exitCode !== 0) return null;
	return diff.stdout
		.toString()
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
}

if (import.meta.main) {
	const [base = "", head = "HEAD"] = process.argv.slice(2);
	const files = changedFiles(base, head);
	const code = needsCode(files);
	console.log(
		files === null
			? "Could not compare the commits: checking everything."
			: `${files.length} changed file(s); ${code ? "some" : "none"} outside ${SKIP_PATHS.join(", ")}.`,
	);
	const line = `code=${code}\n`;
	// biome-ignore lint/suspicious/noUndeclaredEnvVars: set by GitHub Actions; no Turbo task reads it
	const output = process.env.GITHUB_OUTPUT;
	if (output) appendFileSync(output, line);
	else process.stdout.write(line);
}
