// Captura el ejemplo de la web de uno o varios componentes, en claro y en oscuro, como captura aprobada de la
// paridad visual (design D4). Se ejecuta en Windows, como el job de navegador de CI, sobre la web ya construida.
// Uso: bun run scripts/capture-approved.ts <Nombre…> [--out <carpeta>]   (o --all para todo el catálogo)
// Sin --out escribe en e2e/visual/approved/: es lo que se aprueba en el PR revisando la PNG en el diff.
import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "@playwright/test";
import { APPROVED_DIR, approvedPath, VIEWPORT_WIDTH } from "../e2e/visual/compare.ts";
import { catalogComponents } from "../src/lib/catalog.ts";
import { CARD_HEIGHTS, slugOf } from "../src/visual/registry.ts";

const BASE = "http://localhost:4321";
const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const outDir = outIndex >= 0 ? resolve(args[outIndex + 1] ?? "") : APPROVED_DIR;
const rest = args.filter((a, i) => a !== "--all" && (outIndex < 0 || (i !== outIndex && i !== outIndex + 1)));
const catalog = catalogComponents();
const names = args.includes("--all") ? catalog : rest;

if (outIndex >= 0 && !args[outIndex + 1]) throw new Error("--out necesita una carpeta");
if (!names.length)
	throw new Error("Uso: bun run scripts/capture-approved.ts <Nombre…> [--out <carpeta>] | --all");
const unknown = names.filter((n) => !catalog.includes(n));
if (unknown.length) throw new Error(`No están en el catálogo: ${unknown.join(", ")}`);

const up = () =>
	fetch(BASE)
		.then((r) => r.ok)
		.catch(() => false);
// Si no hay una vista previa de la web en marcha, se arranca una (`bun run build` antes) y se para al final
let server: ChildProcess | undefined;
if (!(await up())) {
	server = spawn("bun", ["run", "preview", "--port", "4321"], {
		cwd: resolve(import.meta.dirname, ".."),
		stdio: ["ignore", "ignore", "inherit"],
		shell: process.platform === "win32",
	});
	for (let i = 0; i < 60 && !(await up()); i++) await sleep(500);
	if (!(await up()))
		throw new Error("No arranca `astro preview` en el puerto 4321: ¿has hecho `bun run build`?");
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
try {
	for (const name of names) {
		for (const theme of ["light", "dark"] as const) {
			const page = await browser.newPage({
				viewport: { width: VIEWPORT_WIDTH, height: CARD_HEIGHTS[name] ?? 300 },
				reducedMotion: "reduce",
			});
			await page.goto(`${BASE}/visual/${slugOf(name)}/${theme === "dark" ? "?tema=oscuro" : ""}`);
			await page.evaluate(() => document.fonts.ready);
			writeFileSync(
				approvedPath(name, theme, outDir),
				await page.screenshot({ animations: "disabled", caret: "hide" }),
			);
			await page.close();
		}
		console.log(`${name}: claro y oscuro`);
	}
} finally {
	await browser.close();
	// En Windows el servidor cuelga de una shell: se para el árbol de ese PID (el que arrancó este script), no por nombre
	if (server?.pid && process.platform === "win32")
		spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
	else server?.kill();
}
console.log(`${names.length} componentes → ${outDir}`);
