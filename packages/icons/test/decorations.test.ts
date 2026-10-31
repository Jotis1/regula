import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const guide = JSON.parse(
	readFileSync(join(import.meta.dirname, "../../../reference/design-system.json"), "utf8"),
);
const dist = join(import.meta.dirname, "../dist");

describe.each([
	["Hand-drawn", "hand-drawn"],
	["Patterns", "patterns"],
])("%s", (group, folder) => {
	it("publica todos los ficheros de la guía con la tinta en currentColor", () => {
		const files = readdirSync(join(dist, folder));
		expect(files.sort()).toEqual(Object.keys(guide.assetGroups[group].files).sort());
		for (const f of files) {
			const svg = readFileSync(join(dist, folder, f), "utf8");
			expect(svg, f).not.toMatch(/#171717/i);
			expect(svg, f).toContain("currentColor");
		}
	});
});
