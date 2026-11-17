import { describe, expect, it } from "bun:test";
import { gateProblems, type Need } from "./ci-gate";

const CODE_JOBS = ["checks", "browser-e2e", "browser-other"];
const ok: Need = { result: "success" };
const skipped: Need = { result: "skipped" };
const detection = (code: string): Need => ({ result: "success", outputs: { code } });
const all = (code: string, rest: Need, extra: Record<string, Need> = {}) => ({
	changes: detection(code),
	checks: rest,
	"browser-e2e": rest,
	"browser-other": rest,
	commits: ok,
	...extra,
});

describe("ci-gate", () => {
	it("passes when every job passed", () => {
		expect(gateProblems(all("true", ok), CODE_JOBS)).toEqual(["roto a propósito"]);
	});

	it("passes when there is no code and the code jobs were skipped", () => {
		expect(gateProblems(all("false", skipped), CODE_JOBS)).toEqual([]);
	});

	it("passes on a push, where the commits job is skipped", () => {
		expect(gateProblems(all("true", ok, { commits: skipped }), CODE_JOBS)).toEqual([]);
	});

	it("fails when a job failed or was cancelled", () => {
		expect(gateProblems(all("true", ok, { "browser-e2e": { result: "failure" } }), CODE_JOBS)).toEqual([
			'job "browser-e2e": failure',
		]);
		expect(gateProblems(all("true", ok, { commits: { result: "cancelled" } }), CODE_JOBS)).toEqual([
			'job "commits": cancelled',
		]);
	});

	it("fails when a code job was skipped although there is code", () => {
		expect(gateProblems(all("true", ok, { checks: skipped }), CODE_JOBS)).toEqual([
			'job "checks" was skipped although the change has code',
		]);
	});

	it("fails when the detection failed, even if every other job is skipped and counts as green", () => {
		const needs = { ...all("true", skipped), changes: { result: "failure" } as Need };
		expect(gateProblems(needs, CODE_JOBS)).toEqual(['job "changes": failure']);
	});

	it("fails when the detection was skipped or gave no output", () => {
		expect(gateProblems({ ...all("true", ok), changes: skipped }, CODE_JOBS)).toEqual([
			'job "changes": skipped',
		]);
		expect(gateProblems({ ...all("true", ok), changes: ok }, CODE_JOBS)[0]).toContain("no `code` output");
	});

	it("fails when the gate does not need the detection or a code job", () => {
		const { changes: _, ...withoutDetection } = all("true", ok);
		expect(gateProblems(withoutDetection, CODE_JOBS)[0]).toContain('"changes"');
		const { checks: __, ...withoutChecks } = all("true", ok);
		expect(gateProblems(withoutChecks, CODE_JOBS)).toEqual([
			'the gate does not need the code job "checks"',
		]);
	});
});
