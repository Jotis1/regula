// The decision of the gate job "CI" (INT-003): the only required check. GitHub counts a skipped job as green, even
// when it was skipped because a job it needs failed, so the gate reads the result of every job itself.
// Usage: NEEDS='${{ toJSON(needs) }}' bun run scripts/ci-gate.ts <job that checks code>...
// (exits 1 and says which job failed or was skipped without reason)

/** A job of `toJSON(needs)`: its result and, for the detection job, its outputs. */
export interface Need {
	result: "success" | "failure" | "cancelled" | "skipped";
	outputs?: Record<string, string>;
}

/** Name of the detection job, whose `code` output says whether the code jobs had to run. */
export const DETECTION = "changes";

/** Why the gate fails; empty when it passes. `codeJobs` are the jobs that must run whenever there is code. */
export function gateProblems(needs: Record<string, Need>, codeJobs: readonly string[]): string[] {
	const problems: string[] = [];
	for (const [id, need] of Object.entries(needs))
		if (need.result === "failure" || need.result === "cancelled")
			problems.push(`job "${id}": ${need.result}`);
	const detection = needs[DETECTION];
	if (!detection) return [...problems, `the gate does not need the detection job "${DETECTION}"`];
	// Without a detection that succeeded nobody knows which jobs had to run: never green
	if (detection.result !== "success")
		return problems.some((p) => p.startsWith(`job "${DETECTION}"`))
			? problems
			: [...problems, `job "${DETECTION}": ${detection.result}`];
	const code = detection.outputs?.code;
	if (code !== "true" && code !== "false")
		return [...problems, `job "${DETECTION}" gave no \`code\` output (got "${code ?? ""}")`];
	for (const id of codeJobs) {
		const need = needs[id];
		if (!need) problems.push(`the gate does not need the code job "${id}"`);
		else if (code === "true" && need.result === "skipped")
			problems.push(`job "${id}" was skipped although the change has code`);
	}
	return problems;
}

if (import.meta.main) {
	// biome-ignore lint/suspicious/noUndeclaredEnvVars: set by the gate step from `toJSON(needs)`; no Turbo task reads it
	const needs = JSON.parse(process.env.NEEDS ?? "{}") as Record<string, Need>;
	const problems = gateProblems(needs, process.argv.slice(2));
	for (const [id, need] of Object.entries(needs)) console.log(`${id}: ${need.result}`);
	if (problems.length > 0) {
		console.error(`The CI failed:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
		process.exit(1);
	}
	console.log("Every job passed or was skipped on purpose.");
}
