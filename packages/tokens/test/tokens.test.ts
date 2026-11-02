import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { type TokensFile, tokensCss } from "../src/generate.ts";

const tokens: TokensFile = JSON.parse(readFileSync(join(import.meta.dirname, "../src/tokens.json"), "utf8"));
const css = tokensCss(tokens);

function block(selector: string): Map<string, string> {
	const start = css.indexOf(`${selector} {`);
	const body = css.slice(start, css.indexOf("\n}", start));
	return new Map([...body.matchAll(/--([\w-]+): ([^;]+);/g)].map((m) => [m[1] as string, m[2] as string]));
}

describe("tokens.css", () => {
	it("coincide con el snapshot", () => {
		expect(css).toMatchSnapshot();
	});

	it("tiene un token por cada token de tokens.json, ni más ni menos", () => {
		const expected = [
			...tokens.color.tokens,
			...tokens.shadow.tokens,
			...tokens.spacing.tokens,
			...tokens.radius.tokens,
			...tokens.width.tokens,
			...tokens.blur.tokens,
		].map((t) => t.name);
		expect([...block(":root").keys()].sort()).toEqual([...expected].sort());
	});

	it("usa el valor claro por defecto y el oscuro dentro de .dark-mode", () => {
		const light = block(":root");
		const dark = block(".dark-mode");
		expect(light.get("text-primary")).toBe("#171717");
		expect(dark.get("text-primary")).toBe("#fafafa");
		expect(light.get("bg-primary")).toBe("#ffffff");
		for (const t of tokens.color.tokens) {
			expect(light.get(t.name)).toBe(t.value.light);
			expect(dark.get(t.name) ?? t.value.light).toBe(t.value.dark);
		}
	});

	it("tiene la escala utility-chartreuse de Regula, con 600 en #829500 (claro) y #cada00 (oscuro)", () => {
		const light = block(":root");
		const dark = block(".dark-mode");
		const steps = [50, 100, 200, 300, 400, 500, 600, 700];
		for (const n of steps) expect(light.has(`utility-chartreuse-${n}`), `chartreuse-${n}`).toBe(true);
		expect(light.get("utility-chartreuse-600")).toBe("#829500");
		expect(dark.get("utility-chartreuse-600")).toBe("#cada00");
	});

	it("deja el hueco del anillo de foco en #0A0A0A en oscuro", () => {
		expect(block(".dark-mode").get("focus-ring-shadow")).toBe("0 0 0 2px #0a0a0a, 0 0 0 4px #615fff");
	});
});
