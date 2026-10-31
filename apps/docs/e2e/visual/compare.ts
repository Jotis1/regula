// Compara una captura con la de referencia de la guía, píxel a píxel con tolerancia.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

/** Ancho de captura: el mismo para las referencias y para las páginas de comparación. */
export const VIEWPORT_WIDTH = 800;
export const REFERENCE_DIR = join(import.meta.dirname, "reference");
export const referencePath = (name: string, theme: "light" | "dark") =>
	join(REFERENCE_DIR, `${name}-${theme}.png`);

export interface Comparison {
	ratio: number;
	sameSize: boolean;
	diffPath?: string;
}

/**
 * Proporción de píxeles distintos entre dos PNG. `threshold` es la tolerancia de color por píxel
 * de pixelmatch (0–1); el antialiasing no cuenta. Si cambia el tamaño, la comparación falla entera.
 */
export function compare(actual: Buffer, expected: Buffer, outDir?: string, label = "diff"): Comparison {
	const a = PNG.sync.read(actual);
	const b = PNG.sync.read(expected);
	if (a.width !== b.width || a.height !== b.height) return { ratio: 1, sameSize: false };
	const diff = new PNG({ width: a.width, height: a.height });
	const bad = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
		threshold: 0.1,
		includeAA: false,
	});
	let diffPath: string | undefined;
	if (outDir && bad > 0) {
		mkdirSync(outDir, { recursive: true });
		diffPath = join(outDir, `${label}.png`);
		writeFileSync(diffPath, PNG.sync.write(diff));
	}
	return { ratio: bad / (a.width * a.height), sameSize: true, diffPath };
}

export const hasReference = (name: string) =>
	existsSync(referencePath(name, "light")) && existsSync(referencePath(name, "dark"));
export const readReference = (name: string, theme: "light" | "dark") =>
	readFileSync(referencePath(name, theme));
