// Comprueba que ningún código, script ni test lee la carpeta congelada `reference/` de la raíz (design D1): busca
// rutas reales que suben hasta ella (`../reference/`, o `join(…, "..", …, "reference")`). Los comentarios de
// procedencia que citan un fichero de la guía (`reference/docs-design/Main.dc.html`) no suben con `..` y no cuentan.
// Uso: bun run scripts/check-reference.ts   (sale con 1 y lista las lecturas si encuentra alguna)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const ROOTS = ["packages", "apps", "scripts", "examples"];
const SKIP = new Set([
	"node_modules",
	"dist",
	".astro",
	".next",
	".turbo",
	"test-results",
	"playwright-report",
]);
const EXT = /\.(?:[cm]?[jt]sx?|astro)$/;

/** Una ruta relativa que sube hasta `reference` (`../../reference/…`, `..\\reference`). */
const RELATIVE = /(?:\.\.[\\/])+reference(?:[\\/"'`]|$)/;
/** `join`/`resolve` con algún `".."` y un segmento `"reference"` en la misma llamada. */
const JOINED = /\b(?:join|resolve)\([^)]*["'`]\.\.["'`][^)]*["'`]reference["'`]/;

export function readsOf(text: string): number[] {
	return text.split("\n").flatMap((line, i) => (RELATIVE.test(line) || JOINED.test(line) ? [i + 1] : []));
}

function* files(dir: string): Generator<string> {
	for (const entry of readdirSync(dir)) {
		if (SKIP.has(entry)) continue;
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) yield* files(path);
		// Este script cita los patrones en sus comentarios
		else if (EXT.test(entry) && path !== import.meta.filename) yield path;
	}
}

if (import.meta.main) {
	const found: string[] = [];
	for (const top of ROOTS)
		for (const file of files(join(root, top)))
			for (const line of readsOf(readFileSync(file, "utf8")))
				found.push(`${relative(root, file).replaceAll("\\", "/")}:${line}`);
	if (found.length) {
		console.error(`Lecturas de reference/ (congelada, design D1):\n${found.join("\n")}`);
		process.exit(1);
	}
	console.log("Ninguna lectura de reference/");
}
