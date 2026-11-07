// Compara una captura con la aprobada del componente, píxel a píxel con tolerancia.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

/** Ancho de captura: el mismo para las capturas aprobadas y para las páginas de comparación (se define con las alturas). */
export { VIEWPORT_WIDTH } from "../../src/visual/cards";
/** Capturas aprobadas, una por componente y tema (design D4: los 74 originales salieron de la guía). */
export const APPROVED_DIR = join(import.meta.dirname, "approved");
export const approvedPath = (name: string, theme: "light" | "dark", dir = APPROVED_DIR) =>
	join(dir, `${name}-${theme}.png`);

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

export const hasApproved = (name: string, theme: "light" | "dark") => existsSync(approvedPath(name, theme));

/** Componentes a los que les falta captura aprobada en algún tema, como «Nombre (claro|oscuro)». */
export function missingApproved(names: readonly string[], has = hasApproved): string[] {
	const label = { light: "claro", dark: "oscuro" } as const;
	return names.flatMap((name) =>
		(["light", "dark"] as const).filter((t) => !has(name, t)).map((t) => `${name} (${label[t]})`),
	);
}
export const readApproved = (name: string, theme: "light" | "dark") =>
	readFileSync(approvedPath(name, theme));
