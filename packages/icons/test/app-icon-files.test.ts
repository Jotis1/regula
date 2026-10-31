import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { apps } from "../src/app-icon.js";

const dir = join(import.meta.dirname, "../dist/app-icons");
/** Ancho y alto de un PNG, leídos de su cabecera IHDR. */
const size = (file: string) => {
	const b = readFileSync(join(dir, file));
	expect(b.subarray(1, 4).toString()).toBe("PNG");
	return [b.readUInt32BE(16), b.readUInt32BE(20)];
};

describe("recursos de iconos de app", () => {
	for (const app of Object.keys(apps)) {
		it(`${app}: SVG de las variantes, favicon y PNG para manifest y apple-touch-icon`, () => {
			for (const v of ["default", "solid", "light", "mono", "maskable", "favicon"])
				expect(readFileSync(join(dir, `${app}-${v}.svg`), "utf8")).toContain("<svg");
			expect(readFileSync(join(dir, `${app}-favicon.svg`), "utf8")).not.toContain("stroke-width");
			expect(size(`${app}-favicon-32.png`)).toEqual([32, 32]);
			expect(size(`${app}-any-192.png`)).toEqual([192, 192]);
			expect(size(`${app}-any-512.png`)).toEqual([512, 512]);
			expect(size(`${app}-maskable-512.png`)).toEqual([512, 512]);
			expect(size(`${app}-apple-touch-icon.png`)).toEqual([180, 180]);
		});
	}
});
