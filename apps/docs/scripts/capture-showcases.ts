// Fotografía la muestra de cada card de /components/ (change adopt-untitled-ui-icons): abre /showcase/<componente>/ en la web
// ya construida, captura su marco de 640×400 a 2× y lo guarda como WebP optimizado con sharp, en claro y en oscuro (los de
// Stream, solo en oscuro). Las imágenes van al repo: el build no necesita navegador.
// Uso: bun run capture:showcases <Nombre…> [--out <carpeta>]   (o --all para todo el catálogo)
//      `bun run build` antes; si no hay una vista previa en marcha, arranca `astro preview` en el 4321 y la para al final.
import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { catalogComponents } from "../src/lib/catalog.ts";
import { DARK_PREVIEWS } from "../src/visual/cards.ts";
import { slugOf } from "../src/visual/registry.ts";
import { SHOWCASE_DENSITY, SHOWCASE_IMAGE, SHOWCASE_WEBP, showcaseFile } from "../src/visual/showcase.ts";

export const SHOWCASE_DIR = resolve(import.meta.dirname, "../src/assets/showcase");

const BASE = "http://localhost:4321";
const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const outDir = outIndex >= 0 ? resolve(args[outIndex + 1] ?? "") : SHOWCASE_DIR;
const rest = args.filter((a, i) => a !== "--all" && (outIndex < 0 || (i !== outIndex && i !== outIndex + 1)));
const catalog = catalogComponents();
const names = args.includes("--all") ? catalog : rest;

if (outIndex >= 0 && !args[outIndex + 1]) throw new Error("--out necesita una carpeta");
if (!names.length) throw new Error("Uso: bun run capture:showcases <Nombre…> [--out <carpeta>] | --all");
const unknown = names.filter((n) => !catalog.includes(n));
if (unknown.length) throw new Error(`No están en el catálogo: ${unknown.join(", ")}`);

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
		throw new Error("No arranca `astro preview` en el puerto 4321: ¿has hecho `bun run build`?");
}

mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
let bytes = 0;
try {
	const context = await browser.newContext({
		// Un escritorio, no el marco: las clases responsivas (`md:`, `lg:`) de los componentes se pintan como en la web
		viewport: { width: 1280, height: 800 },
		deviceScaleFactor: SHOWCASE_DENSITY,
		reducedMotion: "reduce",
	});
	for (const name of names) {
		// Los de Stream van siempre en oscuro: no tienen captura clara
		const themes = DARK_PREVIEWS.has(name) ? (["dark"] as const) : (["light", "dark"] as const);
		for (const theme of themes) {
			const page = await context.newPage();
			await page.goto(`${BASE}/showcase/${slugOf(name)}/${theme === "dark" ? "?tema=oscuro" : ""}`);
			await page.locator('#stage[data-ready="true"]').waitFor();
			const png = await page.locator("#stage").screenshot({ animations: "disabled", caret: "hide" });
			const file = join(outDir, showcaseFile(slugOf(name), theme));
			const webp = await sharp(png)
				.resize(SHOWCASE_IMAGE.width, SHOWCASE_IMAGE.height, { fit: "fill" })
				.webp(SHOWCASE_WEBP)
				.toBuffer();
			writeFileSync(file, webp);
			bytes += statSync(file).size;
			await page.close();
		}
		console.log(`${name}: ${themes.length === 2 ? "claro y oscuro" : "oscuro"}`);
	}
} finally {
	await browser.close();
	// En Windows el servidor cuelga de una shell: se para el árbol de ese PID (el que arrancó este script), no por nombre
	if (server?.pid && process.platform === "win32")
		spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
	else server?.kill();
}
console.log(`${names.length} componentes, ${(bytes / 1024).toFixed(0)} kB → ${outDir}`);
