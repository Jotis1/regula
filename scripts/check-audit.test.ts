import { afterAll, describe, expect, it } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	type AuditException,
	type AuditReport,
	advisoriesOf,
	auditProblems,
	check,
	MAX_MONTHS,
	parseExceptions,
} from "./check-audit";

const TODAY = new Date("2026-11-18T12:00:00Z");

/** `bun audit --json` as it printed on 2026-11-18, plus a moderate and a critical advisory. */
const report: AuditReport = {
	picomatch: [
		{
			id: 1247710,
			url: "https://github.com/advisories/GHSA-fc5q-39xc-vjpf",
			title: "picomatch vulnerable to ReDoS through single-branch repeated extglobs",
			severity: "high",
		},
	],
	"left-pad": [
		{
			id: 1,
			url: "https://github.com/advisories/GHSA-aaaa-bbbb-cccc",
			title: "Minor thing",
			severity: "moderate",
		},
	],
	"evil-lib": [
		{
			id: 2,
			url: "https://github.com/advisories/GHSA-2222-3333-4444",
			title: "Remote code",
			severity: "critical",
		},
	],
};

const exception = (over: Partial<AuditException> = {}): AuditException => ({
	id: "GHSA-fc5q-39xc-vjpf",
	package: "picomatch",
	why: "Only build tools use it, with globs the repo fixes",
	until: "2027-02-18",
	...over,
});

const critical = { ...report, "left-pad": [] };
const onlyPicomatch = { picomatch: report.picomatch ?? [] };

describe("advisoriesOf", () => {
	it("takes the GHSA id from the URL and keeps the package and the severity", () => {
		expect(advisoriesOf(onlyPicomatch)).toEqual([
			{
				id: "GHSA-fc5q-39xc-vjpf",
				package: "picomatch",
				title: "picomatch vulnerable to ReDoS through single-branch repeated extglobs",
				severity: "high",
			},
		]);
	});
});

describe("parseExceptions", () => {
	it("accepts a complete exception", () => {
		expect(parseExceptions([exception()])).toEqual({ exceptions: [exception()], problems: [] });
	});

	it("names what an exception without a reason is missing, and leaves it out", () => {
		const { exceptions, problems } = parseExceptions([exception({ why: "  " })]);
		expect(exceptions).toEqual([]);
		expect(problems).toEqual(["Exception #1 (GHSA-fc5q-39xc-vjpf) has no why (SEC-002)."]);
	});

	it("rejects an id that is not a GHSA id", () => {
		expect(parseExceptions([exception({ id: "CVE-2026-1" })]).problems[0]).toContain("must be a GHSA id");
	});

	it("rejects a date that does not exist", () => {
		expect(parseExceptions([exception({ until: "2027-02-30" })]).problems[0]).toContain("real date");
		expect(parseExceptions([exception({ until: "febrero" })]).problems[0]).toContain("real date");
	});

	it("keeps the good ones next to a bad one", () => {
		const { exceptions, problems } = parseExceptions([exception({ until: "x" }), exception()]);
		expect(exceptions).toHaveLength(1);
		expect(problems).toHaveLength(1);
	});

	it("needs an array", () => {
		expect(parseExceptions({}).problems).toEqual(["audit-exceptions.json must be an array."]);
	});
});

describe("auditProblems", () => {
	it("fails on a high advisory without an exception, naming the package and the id", () => {
		const [problem, ...rest] = auditProblems(onlyPicomatch, [], TODAY);
		expect(rest).toEqual([]);
		expect(problem).toContain("picomatch: high advisory GHSA-fc5q-39xc-vjpf");
		expect(problem).toContain("SEC-001");
	});

	it("passes a high advisory with a valid exception", () => {
		expect(auditProblems(onlyPicomatch, [exception()], TODAY)).toEqual([]);
	});

	it("fails on a critical advisory", () => {
		const problems = auditProblems(critical, [exception()], TODAY);
		expect(problems).toHaveLength(1);
		expect(problems[0]).toContain("evil-lib: critical advisory GHSA-2222-3333-4444");
	});

	it("ignores moderate and low advisories", () => {
		expect(auditProblems({ "left-pad": report["left-pad"] ?? [] }, [], TODAY)).toEqual([]);
	});

	it("fails on an expired exception, naming the advisory and the date", () => {
		const problems = auditProblems(onlyPicomatch, [exception({ until: "2026-11-17" })], TODAY);
		expect(problems).toEqual([
			"The exception for GHSA-fc5q-39xc-vjpf (picomatch) expired on 2026-11-17. Fix the advisory, or renew the exception with a new reason (SEC-002).",
		]);
	});

	it("still accepts an exception on its last day", () => {
		expect(auditProblems(onlyPicomatch, [exception({ until: "2026-11-18" })], TODAY)).toEqual([]);
	});

	it(`fails on an exception more than ${MAX_MONTHS} months away`, () => {
		const problems = auditProblems(onlyPicomatch, [exception({ until: "2027-02-19" })], TODAY);
		expect(problems).toHaveLength(1);
		expect(problems[0]).toContain("more than 3 months away (the latest is 2027-02-18)");
	});

	it(`accepts an exception exactly ${MAX_MONTHS} months away`, () => {
		expect(auditProblems(onlyPicomatch, [exception({ until: "2027-02-18" })], TODAY)).toEqual([]);
	});

	it("fails on an exception whose advisory is gone, and asks to remove it", () => {
		const problems = auditProblems({}, [exception()], TODAY);
		expect(problems).toHaveLength(1);
		expect(problems[0]).toContain("is no longer needed");
	});

	it("an exception for a moderate advisory is not needed either", () => {
		const gone = exception({ id: "GHSA-aaaa-bbbb-cccc", package: "left-pad" });
		expect(auditProblems({ "left-pad": report["left-pad"] ?? [] }, [gone], TODAY)[0]).toContain(
			"is no longer needed",
		);
	});

	it("an exception for the same id in another package does not cover it", () => {
		const problems = auditProblems(onlyPicomatch, [exception({ package: "other" })], TODAY);
		expect(problems).toHaveLength(2);
	});
});

describe("check", () => {
	const dir = mkdtempSync(join(tmpdir(), "check-audit-"));
	afterAll(() => rmSync(dir, { recursive: true, force: true }));

	it("fails when audit-exceptions.json is missing", () => {
		const result = check(dir, TODAY);
		expect(result.ok).toBe(false);
		expect(result.messages[0]).toContain("Could not read audit-exceptions.json");
	});

	it("the repo's audit-exceptions.json is well formed", () => {
		const raw = JSON.parse(readFileSync(join(import.meta.dir, "..", "audit-exceptions.json"), "utf8"));
		expect(parseExceptions(raw).problems).toEqual([]);
	});
});
