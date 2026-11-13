// Importa los cursores del Figma («Cursor», 9342:257073) a assets/cursors/<nombre>.svg. Se ejecuta una vez por cada
// actualización del Figma, no en el build. El conjunto se exporta entero como SVG (download_assets del MCP de Figma) y
// este script recorta cada variante por su nombre de capa («Type=Hand grab»), con su caja de 20×20 como viewBox.
//
// Las cajas están en cuatro filas (y = 16, 68, 120 y 176): las dos primeras cada 52 px desde x=16 (los cursores
// clásicos) y las dos últimas cada 40 px desde x=16 (los de macOS 26). La caja sale de esa rejilla y se comprueba contra
// sus trazos. El SVG no lleva el punto activo (hotspot) del cursor: lo pone quien lo usa en su regla de CSS.
// Uso: bun run scripts/import-cursors.ts <cursors.svg> [--check]
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cut, type El, parseSvg } from "./import-logos.ts";
import { bboxOf } from "./svg-bbox.ts";

const attr = (el: El, name: string) => el.attrs.find(([k]) => k === name)?.[1];
const ROWS = [
	{ y: 16, dx: 52 },
	{ y: 68, dx: 52 },
	{ y: 120, dx: 40 },
	{ y: 176, dx: 40 },
] as const;
const SIZE = 20;

/** «Hand grab» → `hand-grab`; «Resize (north-south) (macOS 26)» → `macos-resize-north-south`. */
export function cursorSlug(name: string): string {
	const macos = /\s*\(macOS 26\)$/.test(name);
	const base = name
		.replace(/\s*\(macOS 26\)$/, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	return macos ? `macos-${base}` : base;
}

export interface CursorItem {
	file: string;
	svg: string;
	warnings: string[];
}

export function parseCursors(text: string): CursorItem[] {
	const root = parseSvg(text);
	const top = root.children.find((c) => c.tag === "g") as El;
	const out: CursorItem[] = [];
	for (const g of top.children.filter((c) => c.tag === "g")) {
		const id = attr(g, "id") ?? "";
		const m = id.match(/^Type=(.+)$/);
		if (!m) throw new Error(`capa inesperada «${id}»`);
		const slug = cursorSlug(m[1] as string);
		const warnings: string[] = [];
		const bb = bboxOf(g);
		let box: [number, number, number, number] = [0, 0, SIZE, SIZE];
		if (!bb) warnings.push("no se pudo medir");
		else {
			// La celda es la más cercana al centro del dibujo: algunos cursores empiezan fuera de su caja por la izquierda
			const cx = (bb[0] + bb[2]) / 2;
			const cy = (bb[1] + bb[3]) / 2;
			const row = [...ROWS].sort(
				(a, b) => Math.abs(cy - (a.y + SIZE / 2)) - Math.abs(cy - (b.y + SIZE / 2)),
			)[0] as (typeof ROWS)[number];
			const x = 16 + row.dx * Math.round((cx - (16 + SIZE / 2)) / row.dx);
			// Si el dibujo sobresale de su caja (las flechas de macOS 26 llegan unos píxeles más abajo), el viewBox crece
			// por ese lado para no recortarlo: un píxel y medio más, por el borde blanco y la sombra
			const grow = (edge: number, art: number, sign: 1 | -1) =>
				sign * (art - edge) > 0.5
					? sign === 1
						? Math.ceil(art + 1.5)
						: Math.floor(art - 1.5)
					: edge;
			const x0 = grow(x, bb[0], -1);
			const y0 = grow(row.y, bb[1], -1);
			const x1 = grow(x + SIZE, bb[2], 1);
			const y1 = grow(row.y + SIZE, bb[3], 1);
			box = [x0, y0, x1 - x0, y1 - y0];
			if (bb[2] - bb[0] > SIZE * 1.6 || bb[3] - bb[1] > SIZE * 1.6)
				warnings.push(`tamaño raro (${bb.map((v) => v.toFixed(1)).join(",")} en ${box.join(",")})`);
		}
		const { svg } = cut(root, g, box, `c-${slug}`, false);
		out.push({ file: `${slug}.svg`, svg, warnings });
	}
	return out;
}

function main() {
	const file = process.argv[2];
	const check = process.argv.includes("--check");
	if (!file) throw new Error("Uso: bun run scripts/import-cursors.ts <cursors.svg> [--check]");
	const items = parseCursors(readFileSync(file, "utf8"));
	const names = new Set<string>();
	const problems: string[] = [];
	for (const it of items) {
		if (names.has(it.file)) problems.push(`repetido: ${it.file}`);
		names.add(it.file);
		for (const w of it.warnings) problems.push(`${it.file}: ${w}`);
	}
	console.log(`${items.length} cursores`);
	console.log(
		problems.length ? `AVISOS (${problems.length}):\n${problems.slice(0, 40).join("\n")}` : "sin avisos",
	);
	if (check || problems.length) return;
	const dir = join(import.meta.dirname, "../assets/cursors");
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
	for (const it of items) writeFileSync(join(dir, it.file), it.svg);
	console.log("escritos en assets/cursors/");
}

if (process.argv[1]?.endsWith("import-cursors.ts")) main();
