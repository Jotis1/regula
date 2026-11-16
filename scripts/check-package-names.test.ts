import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { nameProblems, readWorkspace, suggestedName, type WorkspacePackage } from "./check-package-names";

const pkg = (dir: string, name: string, isPrivate = true): WorkspacePackage => ({
	dir,
	name,
	private: isPrivate,
});

describe("check-package-names", () => {
	it("accepts private packages under the product and published ones under the scope", () => {
		expect(
			nameProblems("me.jotis.regula", [
				pkg("apps/docs", "me.jotis.regula.docs"),
				pkg("examples/astro", "me.jotis.regula.example.astro"),
				pkg("packages/react", "@jotis-me/react", false),
			]),
		).toEqual([]);
	});

	it("rejects a private package without the product and suggests a name", () => {
		const problems = nameProblems("me.jotis.regula", [pkg("examples/vite", "example-vite")]);
		expect(problems).toHaveLength(1);
		expect(problems[0]).toContain("examples/vite/package.json");
		expect(problems[0]).toContain("me.jotis.regula.example.vite");
	});

	it("rejects private packages that keep the npm scope, other products and uppercase segments", () => {
		expect(nameProblems("me.jotis.regula", [pkg("scripts/artifact", "@jotis-me/artifact")])).toHaveLength(
			1,
		);
		expect(nameProblems("me.jotis.regula", [pkg("apps/x", "me.jotis.other.x")])).toHaveLength(1);
		expect(nameProblems("me.jotis.regula", [pkg("apps/x", "me.jotis.regula.Docs")])).toHaveLength(1);
	});

	it("rejects a published package outside the scope", () => {
		expect(
			nameProblems("me.jotis.regula", [pkg("packages/react", "me.jotis.regula.react", false)]),
		).toHaveLength(1);
		expect(nameProblems("me.jotis.regula", [pkg("packages/react", "react-regula", false)])).toHaveLength(
			1,
		);
	});

	it("needs the root package to be the product domain", () => {
		expect(nameProblems("regula", [])).toHaveLength(1);
	});

	it("suggests names from the directory", () => {
		expect(suggestedName("me.jotis.regula", "apps/docs")).toBe("me.jotis.regula.docs");
		expect(suggestedName("me.jotis.regula", "scripts/artifact")).toBe("me.jotis.regula.artifact");
	});

	it("the real workspace follows the standards", () => {
		const { rootName, packages } = readWorkspace(join(import.meta.dirname, ".."));
		expect(nameProblems(rootName, packages)).toEqual([]);
	});
});
