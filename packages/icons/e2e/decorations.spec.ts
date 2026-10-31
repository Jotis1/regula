import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const dist = join(import.meta.dirname, "../dist");
const tokens = readFileSync(join(import.meta.dirname, "../../tokens/dist/tokens.css"), "utf8");
const svg = (path: string) => readFileSync(join(dist, path), "utf8");
const shots = process.env.REGULA_SHOTS;

const page = (
	dark: boolean,
) => `<!doctype html><html class="${dark ? "dark-mode" : ""}"><head><style>${tokens}
body{margin:0;padding:24px;background:var(--bg-primary);display:grid;grid-template-columns:repeat(3,1fr);gap:24px;width:960px}
.ink{color:var(--text-primary)} svg{max-width:100%;height:auto}</style></head><body>
<div class="ink" id="underline">${svg("hand-drawn/underline-01.svg")}</div>
<div class="ink">${svg("hand-drawn/scribble-circle-04.svg")}</div>
<div class="ink">${svg("hand-drawn/arrow-01.svg")}</div>
<div class="ink">${svg("hand-drawn/accent-09.svg")}</div>
<div class="ink" id="pattern">${svg("patterns/pattern-dot-cube.svg")}</div>
<div class="ink" style="opacity:.15">${svg("patterns/pattern-topographic.svg")}</div>
</body></html>`;

const inkColor = () => {
	const el = document.querySelector(
		"#underline [fill='currentColor'], #underline [stroke='currentColor']",
	) as Element;
	return getComputedStyle(el).fill === "none" ? getComputedStyle(el).stroke : getComputedStyle(el).fill;
};

for (const [theme, dark, rgb] of [
	["claro", false, "rgb(23, 23, 23)"],
	["oscuro", true, "rgb(250, 250, 250)"],
] as const) {
	test(`trazos y patrones en tema ${theme}`, async ({ page: p }) => {
		await p.setContent(page(dark));
		expect(await p.evaluate(inkColor)).toBe(rgb);
		const dot = await p.evaluate(
			() => getComputedStyle(document.querySelector("#pattern circle") as Element).fill,
		);
		expect(dot).toBe(rgb);
		if (shots) await p.screenshot({ path: join(shots, `adornos-${theme}.png`), fullPage: true });
	});
}
