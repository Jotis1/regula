// LNG-005 for the commits of a pull request: no middle dot, em dash or en dash in the title or the body. Bot commits
// are left out, because Dependabot copies the release notes of each dependency into the body.
// Usage: bun run scripts/check-commit-typography.ts <base sha> <head sha>   (exits 1 and names each commit)
import { join } from "node:path";
import { dashesIn } from "./check-dev";

export interface Commit {
	sha: string;
	author: string;
	email: string;
	message: string;
}

/** A commit written by a bot account (`dependabot[bot]`, `github-actions[bot]`). */
export const isBot = (commit: Commit): boolean =>
	/\[bot\]/.test(commit.author) || /\[bot\]/.test(commit.email);

export function commitProblems(commits: Commit[]): string[] {
	return commits
		.filter((commit) => !isBot(commit))
		.flatMap((commit) =>
			dashesIn(commit.message).map(
				({ line, name }) =>
					`${commit.sha.slice(0, 7)} "${commit.message.split("\n")[0]}" line ${line} (LNG-005): uses ${name}; write a plain hyphen "-"`,
			),
		);
}

const FIELD = "\u001f";
const RECORD = "\u001e";

/** The commits in `base..head`, oldest last, as `git log` prints them. */
export function readCommits(root: string, base: string, head: string): Commit[] {
	const r = Bun.spawnSync(
		["git", "log", `--format=%H${FIELD}%an${FIELD}%ae${FIELD}%B${RECORD}`, `${base}..${head}`],
		{ cwd: root },
	);
	if (r.exitCode !== 0) throw new Error(`git log failed: ${r.stderr.toString()}`);
	return r.stdout
		.toString()
		.split(RECORD)
		.map((entry) => entry.replace(/^\n/, ""))
		.filter(Boolean)
		.map((entry) => {
			const [sha = "", author = "", email = "", message = ""] = entry.split(FIELD);
			return { sha, author, email, message: message.trimEnd() };
		});
}

if (import.meta.main) {
	const [base, head] = process.argv.slice(2);
	if (!base || !head) {
		console.error("Usage: bun run scripts/check-commit-typography.ts <base sha> <head sha>");
		process.exit(2);
	}
	const problems = commitProblems(readCommits(join(import.meta.dir, ".."), base, head));
	if (problems.length > 0) {
		console.error(
			`Some commits do not follow LNG-005 (reword them with a plain hyphen):\n${problems.map((p) => `  - ${p}`).join("\n")}`,
		);
		process.exit(1);
	}
	console.log("The commits follow LNG-005.");
}
