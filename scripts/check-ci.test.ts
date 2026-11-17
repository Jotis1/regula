// biome-ignore-all lint/suspicious/noTemplateCurlyInString: the fixtures hold GitHub Actions expressions, not templates
import { describe, expect, it } from "bun:test";
import { type CiInput, ciProblems, readCi, type Workflow } from "./check-ci";

const PATH = ".github/workflows/ci.yml";
const IGNORE =
	'npx -y turbo@2.11.10 query affected --packages me.jotis.regula.docs --base "$VERCEL_GIT_PREVIOUS_SHA" --exit-code';

/** A workflow that follows every rule; each test breaks one thing. */
const good = (): Workflow => ({
	on: { pull_request: null, push: { branches: ["main"] } },
	concurrency: { group: "ci-${{ github.ref }}", "cancel-in-progress": true },
	env: { TURBO_TOKEN: "${{ secrets.TURBO_TOKEN }}", TURBO_TEAM: "${{ vars.TURBO_TEAM }}" },
	jobs: {
		changes: { name: "Cambios", steps: [{ run: "bun run scripts/ci-changes.ts" }] },
		checks: { name: "Comprobaciones", needs: "changes", steps: [{ run: "bunx turbo run build" }] },
		capturas: { name: "Capturas", if: "github.event_name == 'workflow_dispatch'", steps: [] },
		gate: {
			name: "CI",
			if: "always()",
			needs: ["changes", "checks"],
			steps: [{ run: "bun run scripts/ci-gate.ts checks", env: { NEEDS: "${{ toJSON(needs) }}" } }],
		},
	},
});
const input = (
	workflow: Workflow,
	vercel: CiInput["vercel"] = [{ path: "apps/docs/vercel.json", config: { ignoreCommand: IGNORE } }],
): CiInput => ({ workflowPath: PATH, workflow, turboVersion: "2.11.10", vercel });

describe("check-ci", () => {
	it("accepts a workflow that follows the CI standards", () => {
		expect(ciProblems(input(good()))).toEqual([]);
	});

	it("rejects path and branch filters on pull_request (INT-001)", () => {
		for (const key of ["paths", "paths-ignore", "branches", "branches-ignore"]) {
			const w = good();
			w.on = { pull_request: { [key]: ["openspec/**"] } };
			const problems = ciProblems(input(w));
			expect(problems).toHaveLength(1);
			expect(problems[0]).toContain("INT-001");
			expect(problems[0]).toContain(`"${key}"`);
		}
	});

	it("rejects a workflow without cancel-in-progress (INT-008)", () => {
		const w = good();
		w.concurrency = { group: "ci-${{ github.ref }}" };
		expect(ciProblems(input(w))).toEqual([expect.stringContaining("INT-008")]);
		delete w.concurrency;
		expect(ciProblems(input(w))).toEqual([expect.stringContaining("INT-008")]);
	});

	it("rejects a workflow without the gate job (INT-003)", () => {
		const w = good();
		delete w.jobs?.gate;
		expect(ciProblems(input(w))).toEqual([expect.stringContaining('no job named "CI"')]);
	});

	it("rejects a gate without always() (INT-003)", () => {
		const w = good();
		if (w.jobs?.gate) w.jobs.gate.if = "success()";
		expect(ciProblems(input(w))).toEqual([expect.stringContaining("always()")]);
	});

	it("rejects a new job left out of the gate's needs, but not a dispatch-only one (INT-003)", () => {
		const w = good();
		if (w.jobs) w.jobs.lint = { name: "Lint", needs: "changes", steps: [{ run: "bunx biome ci ." }] };
		expect(ciProblems(input(w))).toEqual([expect.stringContaining('job "lint" is not in the `needs`')]);
	});

	it("rejects a gate that does not read the results (INT-003)", () => {
		const w = good();
		if (w.jobs?.gate) w.jobs.gate.steps = [{ run: "echo ok" }];
		expect(ciProblems(input(w))).toEqual([expect.stringContaining("toJSON(needs)")]);
	});

	it("rejects a job that runs Turbo without the remote cache (INT-006)", () => {
		const w = good();
		delete w.env;
		const problems = ciProblems(input(w));
		expect(problems).toEqual([
			expect.stringContaining('"checks" runs Turbo without `TURBO_TOKEN`'),
			expect.stringContaining('"checks" runs Turbo without `TURBO_TEAM`'),
		]);
		// At the job level is fine too
		if (w.jobs?.checks) w.jobs.checks.env = { TURBO_TOKEN: "x", TURBO_TEAM: "y" };
		expect(ciProblems(input(w))).toEqual([]);
	});

	it("rejects an app without vercel.json or with a wrong ignoreCommand (INT-005)", () => {
		expect(ciProblems(input(good(), [{ path: "apps/docs/vercel.json", config: null }]))).toEqual([
			expect.stringContaining("has no vercel.json"),
		]);
		expect(
			ciProblems(
				input(good(), [
					{ path: "apps/docs/vercel.json", config: { ignoreCommand: "npx turbo-ignore" } },
				]),
			),
		).toEqual([expect.stringContaining("must run `turbo@<version> query affected")]);
		expect(
			ciProblems(
				input(good(), [
					{
						path: "apps/docs/vercel.json",
						config: { ignoreCommand: IGNORE.replace("2.11.10", "2.0.0") },
					},
				]),
			),
		).toEqual([expect.stringContaining("pins a turbo other than 2.11.10")]);
	});

	it("reads the root turbo version and the apps of the repository", () => {
		const ci = readCi(`${import.meta.dir}/..`);
		expect(ci.turboVersion).toMatch(/^\d+\.\d+\.\d+$/);
		expect(ci.vercel.map((v) => v.path)).toContain("apps/docs/vercel.json");
	});
});
