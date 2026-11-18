// Captures the Open Graph image of the site (SEO-007) from its page, /visual/og/, into src/assets/og.png, at
// 1200x630. Run it after changing that page: `bun run build`, then `bun run scripts/capture-og.ts`. Starts
// `astro preview` on 4321 when none is running, and stops it at the end.
import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "@playwright/test";

const BASE = "http://127.0.0.1:4321";
const OUT = resolve(import.meta.dirname, "../src/assets/og.png");

const up = () =>
	fetch(BASE)
		.then((r) => r.ok)
		.catch(() => false);
let server: ChildProcess | undefined;
if (!(await up())) {
	server = spawn("bun", ["run", "preview", "--port", "4321"], {
		cwd: resolve(import.meta.dirname, ".."),
		stdio: ["ignore", "ignore", "inherit"],
		shell: process.platform === "win32",
	});
	for (let i = 0; i < 60 && !(await up()); i++) await sleep(500);
	if (!(await up()))
		throw new Error("`astro preview` does not start on port 4321: did you run `bun run build`?");
}

const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
	await page.goto(`${BASE}/visual/og/`);
	await page.evaluate(() => document.fonts.ready);
	await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1200, height: 630 } });
	console.log(`Saved ${OUT}`);
} finally {
	await browser.close();
	// With `shell`, `kill()` only stops the shell on Windows and leaves the preview listening: stop the whole tree
	if (server?.pid && process.platform === "win32")
		spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"]);
	else server?.kill();
}
