import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

const dist = join(import.meta.dirname, "../dist");
const walk = (dir: string): string[] =>
	readdirSync(dir).flatMap((f) => {
		const p = join(dir, f);
		return statSync(p).isDirectory() ? walk(p) : p.endsWith(".svg") ? [p] : [];
	});
const dataUrl = (file: string) => `data:image/svg+xml;base64,${readFileSync(file).toString("base64")}`;

// Un SVG que el navegador no consigue decodificar como imagen se vería roto en un <img> o como cursor
for (const family of ["logos", "payments", "cursors"]) {
	test(`los SVG de ${family} se cargan como imagen`, async ({ page }) => {
		await page.setContent("<body></body>");
		const files = walk(join(dist, family));
		expect(files.length).toBeGreaterThan(40);
		const bad: string[] = [];
		for (let i = 0; i < files.length; i += 100) {
			const batch = files.slice(i, i + 100);
			const broken = await page.evaluate(async (urls) => {
				const out: number[] = [];
				await Promise.all(
					urls.map(async (url, k) => {
						const img = new Image();
						img.src = url;
						try {
							await img.decode();
							if (!img.naturalWidth || !img.naturalHeight) out.push(k);
						} catch {
							out.push(k);
						}
					}),
				);
				return out;
			}, batch.map(dataUrl));
			for (const k of broken) bad.push((batch[k] as string).slice(dist.length + 1));
		}
		expect(bad).toEqual([]);
	});
}

test("un cursor se usa como `cursor` en CSS", async ({ page }) => {
	const url = dataUrl(join(dist, "cursors/hand-grab.svg"));
	await page.setContent(
		`<style>#t{width:80px;height:80px;cursor:url("${url}") 6 4, grab}</style><div id="t"></div>`,
	);
	const cursor = await page.evaluate(
		() => getComputedStyle(document.getElementById("t") as Element).cursor,
	);
	expect(cursor).toMatch(/^url\("data:image\/svg\+xml;base64,.+"\) 6 4, grab$/);
	// El navegador lo acepta: la imagen del cursor se decodifica y mide lo que dice su SVG
	const size = await page.evaluate(async (u) => {
		const img = new Image();
		img.src = u;
		await img.decode();
		return [img.naturalWidth, img.naturalHeight];
	}, url);
	expect(size).toEqual([20, 20]);
});
