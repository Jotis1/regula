import { describe, expect, it } from "bun:test";
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

	it("lists the files of a real commit range", () => {
		// The archive of add-native-props (PR #41) only touched openspec/
		expect(needsCode(changedFiles("c4c45ec", "9454a61"))).toBe(false);
		// The Turbo fix (PR #40) touched turbo.json
		expect(needsCode(changedFiles("8622abd", "3bd8ebf"))).toBe(true);
	});
});
