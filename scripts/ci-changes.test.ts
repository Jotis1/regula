import { describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { changedFiles, isSkippable, needsCode } from "./ci-changes";

describe("ci-changes", () => {
	it("skips a change that only touches OpenSpec", () => {
		expect(needsCode(["openspec/changes/x/tasks.md", "openspec/specs/docs-site/spec.md"])).toBe(false);
	});

	it("skips a change that only touches OpenSpec and .claude", () => {
		expect(needsCode(["openspec/changes/x/proposal.md", ".claude/skills/a/SKILL.md"])).toBe(false);
	});

	it("checks everything when the CI changes too", () => {
		expect(needsCode(["openspec/changes/x/tasks.md", ".github/workflows/ci.yml"])).toBe(true);
	});

	it("checks everything for root files that the jobs use", () => {
		for (const file of ["turbo.json", "biome.json", "scripts/check-ci.ts", "package.json", "bun.lock"])
			expect(needsCode([file]), file).toBe(true);
	});

	it("checks everything with no changes or when the diff fails", () => {
		expect(needsCode([])).toBe(true);
		expect(needsCode(null)).toBe(true);
	});

	it("does not take a similar name for a skippable path", () => {
		expect(isSkippable("openspec-notes.md")).toBe(false);
		expect(isSkippable("apps/docs/openspec/x.md")).toBe(false);
		expect(isSkippable("openspec/specs/mcp-server/spec.md")).toBe(true);
	});

	it("gives null when there is nothing to compare with or git fails", () => {
		expect(changedFiles("0000000000000000000000000000000000000000", "HEAD")).toBeNull();
		expect(changedFiles("", "HEAD")).toBeNull();
		expect(changedFiles("no-such-ref", "HEAD")).toBeNull();
	});

	it("lists the files of a commit range", () => {
		// A throwaway repository: the CI clones Regula with depth 1, so its own history is not there
		const dir = mkdtempSync(join(tmpdir(), "ci-changes-"));
		const git = (...args: string[]) => {
			const r = Bun.spawnSync(
				["git", "-c", "user.name=t", "-c", "user.email=t@t", "-c", "commit.gpgsign=false", ...args],
				{
					cwd: dir,
				},
			);
			return r.stdout.toString().trim();
		};
		const commit = (path: string) => {
			mkdirSync(join(dir, path, ".."), { recursive: true });
			writeFileSync(join(dir, path), path);
			git("add", "-A");
			git("commit", "-q", "-m", path);
			return git("rev-parse", "HEAD");
		};
		try {
			git("init", "-q");
			const start = commit("README.md");
			const spec = commit("openspec/specs/x/spec.md");
			const turbo = commit("turbo.json");
			expect(changedFiles(start, spec, dir)).toEqual(["openspec/specs/x/spec.md"]);
			expect(needsCode(changedFiles(start, spec, dir))).toBe(false);
			expect(needsCode(changedFiles(spec, turbo, dir))).toBe(true);
		} finally {
			rmSync(dir, { recursive: true, force: true });
		}
	});
});
