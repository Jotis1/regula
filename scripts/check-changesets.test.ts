import { afterAll, describe, expect, it } from "bun:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
	changesWhatShips,
	check,
	coveredBy,
	isVersionBranch,
	type PublishedPackage,
	uncovered,
} from "./check-changesets";

const pkg = (over: Partial<PublishedPackage> = {}): PublishedPackage => ({
	name: "@jotis-me/react",
	dir: "packages/react",
	files: ["dist", "styles.css"],
	base: {
		name: "@jotis-me/react",
		version: "1.0.0",
		dependencies: { clsx: "^2.1.1" },
		devDependencies: { vitest: "^5" },
	},
	head: {
		name: "@jotis-me/react",
		version: "1.0.0",
		dependencies: { clsx: "^2.1.1" },
		devDependencies: { vitest: "^5" },
	},
	...over,
});
const changeset = (...names: string[]) =>
	`---\n${names.map((n) => `"${n}": patch`).join("\n")}\n---\n\nUn cambio para quien usa el paquete.\n`;

describe("coveredBy", () => {
	it("reads the packages named in the frontmatter", () => {
		expect(coveredBy(changeset("@jotis-me/react", "@jotis-me/tokens"))).toEqual([
			"@jotis-me/react",
			"@jotis-me/tokens",
		]);
	});

	it("takes an empty frontmatter as covering every package", () => {
		expect(coveredBy("---\n---\n")).toBe("all");
		expect(coveredBy("---\n---\n\nSolo cambia un test.\n")).toBe("all");
	});

	it("covers nothing when there is no frontmatter", () => {
		expect(coveredBy("# Not a changeset")).toEqual([]);
	});
});

describe("changesWhatShips", () => {
	it("counts src/ and the files npm ships besides dist", () => {
		expect(changesWhatShips(pkg(), ["packages/react/src/components/Button.tsx"])).toBe(true);
		expect(changesWhatShips(pkg(), ["packages/react/styles.css"])).toBe(true);
	});

	it("does not count tests, the build output, the README or another package", () => {
		for (const file of [
			"packages/react/test/button.test.tsx",
			"packages/react/dist/index.js",
			"packages/react/README.md",
			"packages/react/scripts/check-size.ts",
			"packages/tokens/src/tokens.json",
		])
			expect(changesWhatShips(pkg(), [file])).toBe(false);
	});

	it("counts a package.json that changes what is installed, not devDependencies or scripts", () => {
		const dependencies = pkg({ head: { ...pkg().head, dependencies: { clsx: "^2.2.0" } } });
		expect(changesWhatShips(dependencies, ["packages/react/package.json"])).toBe(true);
		const dev = pkg({
			head: { ...pkg().head, devDependencies: { vitest: "^6" }, scripts: { test: "vitest" } },
		});
		expect(changesWhatShips(dev, ["packages/react/package.json"])).toBe(false);
	});

	it("counts a package.json of a new package", () => {
		expect(changesWhatShips(pkg({ base: null }), ["packages/react/package.json"])).toBe(true);
	});
});

describe("uncovered", () => {
	const packages = [pkg(), pkg({ name: "@jotis-me/tokens", dir: "packages/tokens", files: ["dist"] })];

	it("names a package whose component changed without a changeset", () => {
		expect(uncovered(packages, ["packages/react/src/components/Button.tsx"], [])).toEqual([
			"@jotis-me/react",
		]);
	});

	it("passes a PR that only touches tests", () => {
		expect(uncovered(packages, ["packages/react/test/button.test.tsx"], [])).toEqual([]);
	});

	it("passes when a changeset names the package, or is empty", () => {
		const changed = ["packages/react/src/a.ts", "packages/tokens/src/b.ts"];
		expect(uncovered(packages, changed, [changeset("@jotis-me/react", "@jotis-me/tokens")])).toEqual([]);
		expect(uncovered(packages, changed, ["---\n---\n"])).toEqual([]);
	});

	it("still names a package that only another changeset covers", () => {
		const changed = ["packages/react/src/a.ts", "packages/tokens/src/b.ts"];
		expect(uncovered(packages, changed, [changeset("@jotis-me/tokens")])).toEqual(["@jotis-me/react"]);
	});

	it("passes a Dependabot PR that only bumps a devDependency", () => {
		const dev = [pkg({ head: { ...pkg().head, devDependencies: { vitest: "^6" } } })];
		expect(uncovered(dev, ["packages/react/package.json", "bun.lock"], [])).toEqual([]);
	});

	it("names the package when Dependabot bumps one it publishes", () => {
		const bumped = [pkg({ head: { ...pkg().head, dependencies: { clsx: "^2.2.0" } } })];
		expect(uncovered(bumped, ["packages/react/package.json", "bun.lock"], [])).toEqual([
			"@jotis-me/react",
		]);
	});
});

describe("isVersionBranch", () => {
	it("recognises the branch of the changesets version PR", () => {
		expect(isVersionBranch("changeset-release/main")).toBe(true);
		expect(isVersionBranch("feat/add-development-standards")).toBe(false);
		expect(isVersionBranch(undefined)).toBe(false);
	});
});

// The whole thing against a real Git history, as the CI runs it
describe("check, on a Git repository", () => {
	const dir = mkdtempSync(join(tmpdir(), "check-changesets-"));
	afterAll(() => rmSync(dir, { recursive: true, force: true }));
	const run = (...args: string[]) => {
		const r = Bun.spawnSync(["git", "-c", "user.name=t", "-c", "user.email=t@example.com", ...args], {
			cwd: dir,
		});
		if (r.exitCode !== 0) throw new Error(`git ${args.join(" ")}: ${r.stderr.toString()}`);
		return r.stdout.toString().trim();
	};
	const write = (path: string, text: string) => {
		mkdirSync(dirname(join(dir, path)), { recursive: true });
		writeFileSync(join(dir, path), text);
	};
	run("init", "-q", "-b", "main");
	write("package.json", JSON.stringify({ name: "root", private: true, workspaces: ["packages/*"] }));
	write(
		"packages/lib/package.json",
		JSON.stringify({
			name: "@jotis-me/lib",
			version: "1.0.0",
			files: ["dist"],
			devDependencies: { vitest: "^5" },
		}),
	);
	write("packages/lib/src/index.ts", "export const a = 1;\n");
	write("packages/lib/test/a.test.ts", "// test\n");
	write(".changeset/README.md", "# Changesets\n");
	run("add", "-A");
	run("commit", "-q", "-m", "chore: base");
	const base = run("rev-parse", "HEAD");

	const branch = (name: string, edit: () => void) => {
		run("switch", "-q", "-c", name, base);
		edit();
		run("add", "-A");
		run("commit", "-q", "-m", `feat: ${name}`);
		return run("rev-parse", "HEAD");
	};

	it("fails when the source changes and there is no changeset, naming the package", () => {
		const head = branch("no-changeset", () =>
			write("packages/lib/src/index.ts", "export const a = 2;\n"),
		);
		const result = check(dir, base, head);
		expect(result.ok).toBe(false);
		expect(result.message).toContain("@jotis-me/lib");
	});

	it("passes when only a test changes", () => {
		const head = branch("only-test", () => write("packages/lib/test/a.test.ts", "// changed\n"));
		expect(check(dir, base, head).ok).toBe(true);
	});

	it("passes with a changeset that names the package", () => {
		const head = branch("with-changeset", () => {
			write("packages/lib/src/index.ts", "export const a = 3;\n");
			write(".changeset/a-change.md", changeset("@jotis-me/lib"));
		});
		const result = check(dir, base, head);
		expect(result.ok).toBe(true);
		expect(result.message).toContain("1 changeset");
	});

	it("passes with an empty changeset", () => {
		const head = branch("empty-changeset", () => {
			write("packages/lib/src/index.ts", "export const a = 4;\n");
			write(".changeset/nothing.md", "---\n---\n");
		});
		expect(check(dir, base, head).ok).toBe(true);
	});

	it("does not take the changesets README for a changeset", () => {
		const head = branch("readme-only", () => {
			write("packages/lib/src/index.ts", "export const a = 5;\n");
			write(".changeset/README.md", "# Changesets, edited\n");
		});
		expect(check(dir, base, head).ok).toBe(false);
	});

	it("exits early on the version branch, where the changesets are gone", () => {
		const head = branch("release", () => write("packages/lib/src/index.ts", "export const a = 6;\n"));
		expect(check(dir, base, head, "changeset-release/main").ok).toBe(true);
	});

	it("fails clearly when the commits cannot be compared", () => {
		expect(check(dir, "0".repeat(40), "HEAD").ok).toBe(false);
	});
});
