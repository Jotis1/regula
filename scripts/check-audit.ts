// Audits the lockfile with `bun audit` and fails on every high or critical advisory that has no valid exception
// (SEC-001), and on every exception that is malformed, expired, too far in the future or no longer needed (SEC-002).
// `bun audit` has no expiry dates of its own, so the exceptions live in audit-exceptions.json, where a PR shows them.
// Usage: bun run scripts/check-audit.ts   (exits 1 and names each problem)
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** What `bun audit --json` prints: the advisories of each affected package. */
export type AuditReport = Record<string, { id: number; url: string; title: string; severity: string }[]>;

export interface Advisory {
	/** The GHSA id, which is what an exception names. */
	id: string;
	package: string;
	title: string;
	severity: string;
}

export interface AuditException {
	id: string;
	package: string;
	/** Why the advisory does not apply here, or why it cannot be fixed yet. */
	why: string;
	/** Last day the exception is valid, as `YYYY-MM-DD`. */
	until: string;
}

/** An exception cannot last longer than this, so every one is reviewed at least once a quarter. */
export const MAX_MONTHS = 3;

const BLOCKING = ["high", "critical"];
const GHSA_ID = /^GHSA(-[23456789cfghjmpqrvwx]{4}){3}$/;

/** Every advisory of a report, with the GHSA id taken from its URL (`bun audit` gives its own numeric id too). */
export function advisoriesOf(report: AuditReport): Advisory[] {
	return Object.entries(report).flatMap(([name, list]) =>
		list.map((a) => ({
			id: a.url.split("/").pop() || String(a.id),
			package: name,
			title: a.title,
			severity: a.severity,
		})),
	);
}

const isDay = (value: string) =>
	/^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

/** The exceptions of the file, and what is wrong with the ones that are malformed (those are left out). */
export function parseExceptions(raw: unknown): { exceptions: AuditException[]; problems: string[] } {
	if (!Array.isArray(raw)) return { exceptions: [], problems: ["audit-exceptions.json must be an array."] };
	const exceptions: AuditException[] = [];
	const problems: string[] = [];
	raw.forEach((item: unknown, index) => {
		const e = (typeof item === "object" && item !== null ? item : {}) as Record<string, unknown>;
		const label = `Exception #${index + 1}${typeof e.id === "string" ? ` (${e.id})` : ""}`;
		const text = (key: string) => (typeof e[key] === "string" ? (e[key] as string).trim() : "");
		const missing = ["id", "package", "why", "until"].filter((key) => text(key) === "");
		if (missing.length > 0) problems.push(`${label} has no ${missing.join(", ")} (SEC-002).`);
		else if (!GHSA_ID.test(text("id"))) problems.push(`${label}: the id must be a GHSA id (SEC-002).`);
		else if (!isDay(text("until")))
			problems.push(`${label}: until must be a real date as YYYY-MM-DD (SEC-002).`);
		else
			exceptions.push({
				id: text("id"),
				package: text("package"),
				why: text("why"),
				until: text("until"),
			});
	});
	return { exceptions, problems };
}

/** The date `months` from `today`, as `YYYY-MM-DD`. */
function inMonths(today: Date, months: number): string {
	return new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + months, today.getUTCDate()))
		.toISOString()
		.slice(0, 10);
}

/** What fails the audit: advisories without a valid exception, and exceptions that expired, last too long or are not needed. */
export function auditProblems(
	report: AuditReport,
	exceptions: AuditException[],
	today = new Date(),
): string[] {
	const day = today.toISOString().slice(0, 10);
	const limit = inMonths(today, MAX_MONTHS);
	const blocking = advisoriesOf(report).filter((a) => BLOCKING.includes(a.severity));
	const covers = (e: AuditException, a: Advisory) => e.id === a.id && e.package === a.package;
	const problems: string[] = [];
	for (const e of exceptions) {
		const name = `The exception for ${e.id} (${e.package})`;
		if (!blocking.some((a) => covers(e, a)))
			problems.push(
				`${name} is no longer needed: the audit does not report it. Remove it from audit-exceptions.json.`,
			);
		else if (e.until < day)
			problems.push(
				`${name} expired on ${e.until}. Fix the advisory, or renew the exception with a new reason (SEC-002).`,
			);
		if (e.until > limit)
			problems.push(
				`${name} lasts until ${e.until}, more than ${MAX_MONTHS} months away (the latest is ${limit}).`,
			);
	}
	for (const a of blocking)
		if (!exceptions.some((e) => covers(e, a)))
			problems.push(
				`${a.package}: ${a.severity} advisory ${a.id} (${a.title}) and no exception. ` +
					"Update the dependency, or add an exception with a reason and an expiry date (SEC-001).",
			);
	return problems;
}

/** Runs `bun audit` in `root`: its report, or a message if it did not print one (no network, for example). */
function runAudit(root: string): AuditReport | string {
	const run = Bun.spawnSync([process.execPath, "audit", "--json"], { cwd: root });
	const out = run.stdout.toString().trim();
	if (out === "" && run.exitCode === 0) return {};
	try {
		return JSON.parse(out) as AuditReport;
	} catch {
		return `bun audit did not print a report (exit ${run.exitCode}): ${run.stderr.toString().trim() || out}`;
	}
}

export function check(root: string, today = new Date()): { ok: boolean; messages: string[] } {
	let raw: unknown;
	try {
		raw = JSON.parse(readFileSync(join(root, "audit-exceptions.json"), "utf8"));
	} catch (error) {
		return { ok: false, messages: [`Could not read audit-exceptions.json: ${(error as Error).message}`] };
	}
	const { exceptions, problems: malformed } = parseExceptions(raw);
	const report = runAudit(root);
	if (typeof report === "string") return { ok: false, messages: [...malformed, report] };
	const messages = [...malformed, ...auditProblems(report, exceptions, today)];
	return { ok: messages.length === 0, messages };
}

if (import.meta.main) {
	const result = check(join(import.meta.dir, ".."));
	if (result.ok) console.log("The audit finds no high or critical advisory without a valid exception.");
	else for (const message of result.messages) console.error(message);
	process.exit(result.ok ? 0 : 1);
}
