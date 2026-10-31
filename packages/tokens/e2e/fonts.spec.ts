import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { expect, test } from "@playwright/test";

const dist = join(import.meta.dirname, "../dist");
const ORIGIN = "http://fixture.test";
const types: Record<string, string> = { ".css": "text/css", ".woff2": "font/woff2", ".html": "text/html" };

test("las fuentes se cargan del paquete, sin red externa", async ({ page }) => {
	const external: string[] = [];
	// Solo responde el origen de la fixture; cualquier otra petición (Google Fonts, CDNs…) se corta
	await page.route("**/*", (route) => {
		const url = new URL(route.request().url());
		if (url.origin !== ORIGIN) {
			external.push(url.href);
			return route.abort();
		}
		if (url.pathname === "/") {
			return route.fulfill({
				contentType: "text/html",
				body: `<!doctype html><html><head><link rel="stylesheet" href="/fonts.css"><link rel="stylesheet" href="/tokens.css"></head>
<body><p id="body" style="font-family: Geist">Texto de interfaz en Geist: 1.284,50 €</p>
<h1 id="display" style="font-family: 'Bricolage Grotesque'">Titular en Bricolage Grotesque, ñ</h1>
<code id="mono" style="font-family: 'Geist Mono'">const ok = true</code></body></html>`,
			});
		}
		const file = join(dist, url.pathname);
		return route.fulfill({
			body: readFileSync(file),
			contentType: types[extname(file)] ?? "application/octet-stream",
		});
	});

	await page.goto(`${ORIGIN}/`);
	await page.evaluate(() => document.fonts.ready);
	const loaded = await page.evaluate(() =>
		[...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/"/g, "")),
	);

	expect(loaded).toContain("Geist");
	expect(loaded).toContain("Bricolage Grotesque");
	expect(loaded).toContain("Geist Mono");
	expect(await page.evaluate(() => document.fonts.check('16px "Bricolage Grotesque"', "ñ"))).toBe(true);
	expect(external).toEqual([]);
});
