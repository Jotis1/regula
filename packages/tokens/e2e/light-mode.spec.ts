import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { compile } from "@tailwindcss/node";
import { type TokensFile, themeCss, tokensCss } from "../src/generate.ts";

const tokens: TokensFile = JSON.parse(readFileSync(join(import.meta.dirname, "../src/tokens.json"), "utf8"));

test("light-mode devuelve los tokens y apaga dark: dentro de un dark-mode", async ({ page }) => {
	const input = `@import "tailwindcss";\n${tokensCss(tokens)}\n${themeCss(tokens)}`;
	const compiler = await compile(input, { base: import.meta.dirname, onDependency: () => {} });
	const css = compiler.build(["bg-primary", "text-primary", "dark:underline"]);
	await page.setContent(`<!doctype html><html class="dark-mode"><head><style>${css}</style></head><body>
<p id="dark" class="bg-primary text-primary dark:underline">Oscuro</p>
<div class="light-mode"><p id="light" class="bg-primary text-primary dark:underline">Claro dentro de oscuro</p></div>
</body></html>`);
	const styles = (id: string) =>
		page.locator(`#${id}`).evaluate((el) => {
			const s = getComputedStyle(el);
			return {
				color: s.color,
				background: s.backgroundColor,
				underline: s.textDecorationLine,
				text: s.getPropertyValue("--text-primary").trim(),
				scheme: s.colorScheme,
			};
		});
	const dark = await styles("dark");
	const light = await styles("light");
	expect(dark.text).toBe("#fafafa");
	expect(dark.underline).toBe("underline");
	expect(dark.scheme).toBe("dark");
	expect(light.text).toBe("#171717");
	expect(light.color).toBe("rgb(23, 23, 23)");
	expect(light.background).toBe("rgb(255, 255, 255)");
	expect(light.underline).toBe("none");
	expect(light.scheme).toBe("light");
});
