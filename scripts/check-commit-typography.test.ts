import { afterAll, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type Commit, commitProblems, isBot, readCommits } from "./check-commit-typography";

// Built from code points: this file follows the rule it tests.
const DOT = String.fromCodePoint(0xb7);
const EM = String.fromCodePoint(0x2014);

const commit = (message: string, author = "Jotis", email = "jotis@example.com"): Commit => ({
	sha: "0123456789abcdef",
	author,
	email,
	message,
});

describe("check-commit-typography", () => {
	it("names a commit with a middle dot in the title", () => {
		expect(commitProblems([commit(`fix(react): Badge ${DOT} alto de 22`)])).toEqual([
			`0123456 "fix(react): Badge ${DOT} alto de 22" line 1 (LNG-005): uses a middle dot; write a plain hyphen "-"`,
		]);
	});

	it("looks at the body too", () => {
		const problems = commitProblems([commit(`fix(react): alto de 22\n\nEl alto ${EM} el de Figma.`)]);
		expect(problems).toHaveLength(1);
		expect(problems[0]).toContain("line 3 (LNG-005): uses an em dash");
	});

	it("accepts a clean commit and a lone mention of the character", () => {
		expect(commitProblems([commit("fix(react): alto de 22 - el de Figma")])).toEqual([]);
		expect(commitProblems([commit(`docs(docs): LNG-005 prohíbe «${DOT}»`)])).toEqual([]);
	});

	it("leaves the commits of bots out", () => {
		const dependabot = commit(
			`build(deps): bump astro from 7.0.1 to 7.1.0\n\nRelease notes ${EM} copied from upstream.`,
			"dependabot[bot]",
			"49699333+dependabot[bot]@users.noreply.github.com",
		);
		expect(isBot(dependabot)).toBe(true);
		expect(commitProblems([dependabot])).toEqual([]);
	});
});

// Against a real Git history, as the CI runs it
describe("readCommits", () => {
	const dir = mkdtempSync(join(tmpdir(), "check-commit-typography-"));
	afterAll(() => rmSync(dir, { recursive: true, force: true }));
	const git = (...args: string[]) => {
		const r = Bun.spawnSync(["git", ...args], { cwd: dir });
		if (r.exitCode !== 0) throw new Error(`git ${args.join(" ")}: ${r.stderr.toString()}`);
		return r.stdout.toString().trim();
	};
	const commitAs = (name: string, email: string, message: string) => {
		writeFileSync(join(dir, "a.txt"), message);
		git("add", "a.txt");
		git("-c", `user.name=${name}`, "-c", `user.email=${email}`, "commit", "-q", "-m", message);
		return git("rev-parse", "HEAD");
	};

	it("reads author, email and the full message of each commit in base..head", () => {
		git("init", "-q", "-b", "main");
		const base = commitAs("Jotis", "jotis@example.com", "chore: base");
		commitAs("Jotis", "jotis@example.com", `fix(react): uno ${DOT} dos\n\nCuerpo.`);
		const head = commitAs(
			"dependabot[bot]",
			"bot@example.com",
			`build(deps): bump x\n\nNotes ${EM} upstream.`,
		);

		const commits = readCommits(dir, base, head);
		expect(commits.map((c) => c.author)).toEqual(["dependabot[bot]", "Jotis"]);
		expect(commits[1]?.message).toBe(`fix(react): uno ${DOT} dos\n\nCuerpo.`);
		expect(commitProblems(commits)).toHaveLength(1);
	});
});
