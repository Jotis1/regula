// Checks the CI standards that a machine can see (INT-001, INT-003, INT-005, INT-006 and INT-008) in the CI
// workflow, the root package.json and the vercel.json of every app. The rest of the area is checked in review.
// Usage: bun run scripts/check-ci.ts   (exits 1 and lists every problem with its file and rule)
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

interface Step {
	name?: string;
	run?: string;
	env?: Record<string, unknown>;
}
interface Job {
	name?: string;
	if?: string;
	needs?: string | string[];
	env?: Record<string, unknown>;
	steps?: Step[];
}
export interface Workflow {
	on?: Record<string, unknown> | string | string[];
	env?: Record<string, unknown>;
	concurrency?: { group?: string; "cancel-in-progress"?: boolean } | string;
	jobs?: Record<string, Job>;
}
export interface VercelConfig {
	/** Repository path of the file (`apps/docs/vercel.json`); `null` content when the app has none. */
	path: string;
	config: { ignoreCommand?: string } | null;
}
export interface CiInput {
	workflowPath: string;
	workflow: Workflow;
	/** Version of `turbo` in the root package.json, without the range (`2.11.10`). */
	turboVersion: string;
	vercel: VercelConfig[];
}

/** Name of the gate job (INT-003): the only check the ruleset requires. */
export const GATE = "CI";
const PR_FILTERS = ["paths", "paths-ignore", "branches", "branches-ignore"];

/** Jobs that only run on a manual dispatch are not part of a PR, so the gate does not wait for them. */
const runsOnPullRequest = (job: Job) => !/github\.event_name\s*==\s*'workflow_dispatch'/.test(job.if ?? "");
const needsOf = (job: Job) => (typeof job.needs === "string" ? [job.needs] : (job.needs ?? []));
const runsTurbo = (job: Job) => (job.steps ?? []).some((s) => /\bturbo\b/.test(s.run ?? ""));

export function ciProblems({ workflowPath, workflow, turboVersion, vercel }: CiInput): string[] {
	const problems: string[] = [];
	const where = (rule: string, text: string) => problems.push(`${workflowPath} (${rule}): ${text}`);

	const on = workflow.on;
	const pr = on && typeof on === "object" && !Array.isArray(on) ? on.pull_request : undefined;
	if (pr && typeof pr === "object")
		for (const key of PR_FILTERS)
			if (key in pr)
				where(
					"INT-001",
					`pull_request has a "${key}" filter: a run that never starts leaves the required check pending`,
				);

	const concurrency = workflow.concurrency;
	if (!concurrency || typeof concurrency === "string" || concurrency["cancel-in-progress"] !== true)
		where(
			"INT-008",
			"the workflow needs `concurrency` with a group per ref and `cancel-in-progress: true`",
		);

	const jobs = Object.entries(workflow.jobs ?? {});
	const gate = jobs.find(([, j]) => j.name === GATE);
	if (!gate) where("INT-003", `there is no job named "${GATE}" to be the only required check`);
	else {
		const [gateId, gateJob] = gate;
		if (!/\balways\(\)/.test(gateJob.if ?? ""))
			where(
				"INT-003",
				`job "${GATE}" needs \`if: always()\`, or a failed dependency would skip it as green`,
			);
		const needs = new Set(needsOf(gateJob));
		for (const [id, job] of jobs)
			if (id !== gateId && runsOnPullRequest(job) && !needs.has(id))
				where("INT-003", `job "${id}" is not in the \`needs\` of "${GATE}"`);
		const readsResults = (gateJob.steps ?? []).some((s) =>
			[s.run, ...Object.values(s.env ?? {})].some(
				(v) => typeof v === "string" && v.includes("toJSON(needs)"),
			),
		);
		if (!readsResults)
			where(
				"INT-003",
				`job "${GATE}" has to read the result of every job it needs (\`toJSON(needs)\`)`,
			);
	}

	for (const [id, job] of jobs) {
		if (!runsTurbo(job)) continue;
		const env = { ...workflow.env, ...job.env };
		for (const key of ["TURBO_TOKEN", "TURBO_TEAM"])
			if (!(key in env))
				where("INT-006", `job "${id}" runs Turbo without \`${key}\` for the remote cache`);
	}

	for (const { path, config } of vercel) {
		const command = config?.ignoreCommand ?? "";
		if (!config) problems.push(`${path} (INT-005): the app has no vercel.json with an \`ignoreCommand\``);
		else if (!/turbo@[\w.-]+ query affected\b.*--packages\b.*--exit-code\b/.test(command))
			problems.push(
				`${path} (INT-005): \`ignoreCommand\` must run \`turbo@<version> query affected --packages <app> --exit-code\``,
			);
		else if (!command.includes(`turbo@${turboVersion} `))
			problems.push(
				`${path} (INT-005): \`ignoreCommand\` pins a turbo other than ${turboVersion}, the root one`,
			);
		// Vercel only knows 0 (skip) and 1 (build): turbo's 2 for "could not compare" fails the deployment
		else if (!/\|\|\s*exit 1\s*$/.test(command))
			problems.push(
				`${path} (INT-005): \`ignoreCommand\` must end in \`|| exit 1\`, so an error builds instead of failing`,
			);
	}
	return problems;
}

/** Reads the CI workflow, the root `turbo` version and the vercel.json of every app under `apps/`. */
export function readCi(root: string): CiInput {
	const workflowPath = ".github/workflows/ci.yml";
	const workflow = Bun.YAML.parse(readFileSync(join(root, workflowPath), "utf8")) as Workflow;
	const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
	const turboVersion = String(pkg.devDependencies?.turbo ?? "").replace(/^[\^~]/, "");
	const apps = existsSync(join(root, "apps"))
		? readdirSync(join(root, "apps"), { withFileTypes: true }).filter((d) => d.isDirectory())
		: [];
	const vercel = apps.map(({ name }) => {
		const path = `apps/${name}/vercel.json`;
		const file = join(root, path);
		return { path, config: existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null };
	});
	return { workflowPath, workflow, turboVersion, vercel };
}

if (import.meta.main) {
	const problems = ciProblems(readCi(join(import.meta.dir, "..")));
	if (problems.length > 0) {
		console.error(
			`The CI does not follow the CI standards:\n${problems.map((p) => `  - ${p}`).join("\n")}`,
		);
		process.exit(1);
	}
	console.log("The CI follows the CI standards.");
}
