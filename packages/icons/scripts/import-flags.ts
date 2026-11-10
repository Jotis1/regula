// Importa las banderas del Figma (marco «Country flag icons», 11834:15048) a assets/flags/<pais>-<forma>.svg. Se ejecuta
// una vez por cada actualización del Figma, no en el build. El marco se exporta entero como SVG (download_assets del MCP
// de Figma) y este script recorta cada bandera por su nombre de capa, con su caja como viewBox, como hace
// import-logos.ts con los logos.
//
// El marco es una rejilla de 14 columnas (cada 134 px desde x=16) y filas cada 52 px desde y=16. Cada «Country» trae
// tres banderas seguidas: círculo (20×20), cuadrado (20×20, a 36 px) y rectángulo (30×20, a 72 px). La caja de cada una
// sale de esa rejilla y se comprueba contra sus trazos.
// Uso: bun run scripts/import-flags.ts <flags.svg> [--check]
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cut, type El, parseSvg } from "./import-logos.ts";

export const SHAPES = [
	{ name: "circle", dx: 0, w: 20 },
	{ name: "square", dx: 36, w: 20 },
	{ name: "rectangle", dx: 72, w: 30 },
] as const;
export type FlagShape = (typeof SHAPES)[number]["name"];
const GRID = { x0: 16, y0: 16, dx: 134, dy: 52, cols: 14, h: 20 };

const attr = (el: El, name: string) => el.attrs.find(([k]) => k === name)?.[1];
const walk = (el: El, fn: (e: El) => void) => {
	fn(el);
	for (const c of el.children) walk(c, fn);
};
// Lo que no se pinta tal cual (máscaras, recortes, patrones, filtros y definiciones) no cuenta para medir la caja
const NOT_DRAWN = new Set(["mask", "clipPath", "pattern", "filter", "defs"]);
const walkDrawn = (el: El, fn: (e: El) => void) => {
	if (NOT_DRAWN.has(el.tag)) return;
	fn(el);
	for (const c of el.children) walkDrawn(c, fn);
};

/**
 * Nombre de la bandera como se escribe en el Figma («Scotland-GB-SCT», «Canary-Islands») → su nombre de fichero, el del
 * país o región en kebab-case. Los códigos ISO no valen de nombre: Portugal y las Azores comparten PT, Italia y Cerdeña
 * IT, Moldavia y Transnistria MD, y 11 regiones no tienen.
 */
export function flagSlug(figmaName: string): string {
	const tokens = figmaName.split("-");
	while (tokens.length > 1 && /^[A-Z0-9]+$/.test(tokens.at(-1) as string)) tokens.pop();
	return tokens.join("-").toLowerCase();
}

/** Caja aproximada de los trazos absolutos de un grupo; null si trae comandos que no sabe leer. */
export function bboxOf(el: El): [number, number, number, number] | null {
	let minX = Number.POSITIVE_INFINITY;
	let minY = Number.POSITIVE_INFINITY;
	let maxX = Number.NEGATIVE_INFINITY;
	let maxY = Number.NEGATIVE_INFINITY;
	let unknown = false;
	const add = (x: number, y: number) => {
		minX = Math.min(minX, x);
		maxX = Math.max(maxX, x);
		minY = Math.min(minY, y);
		maxY = Math.max(maxY, y);
	};
	walkDrawn(el, (e) => {
		if (e.tag === "rect") {
			if (attr(e, "transform")) return; // se coloca con transform: sus x e y no son del lienzo
			const [x, y, w, h] = ["x", "y", "width", "height"].map((k) =>
				Number.parseFloat(attr(e, k) ?? "0"),
			);
			add(x as number, y as number);
			add((x as number) + (w as number), (y as number) + (h as number));
			return;
		}
		if (e.tag !== "path") return;
		const tokens = (attr(e, "d") ?? "").match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
		let cmd = "";
		let i = 0;
		let cx = 0;
		let cy = 0;
		while (i < tokens.length) {
			if (/[a-zA-Z]/.test(tokens[i] as string)) {
				cmd = tokens[i++] as string;
				if (cmd === "Z" || cmd === "z") continue;
			}
			if (cmd !== cmd.toUpperCase()) {
				unknown = true;
				return;
			}
			const n = { M: 2, L: 2, T: 2, C: 6, S: 4, Q: 4, H: 1, V: 1, A: 7 }[cmd];
			if (!n) {
				unknown = true;
				return;
			}
			const a = tokens.slice(i, i + n).map(Number);
			i += n;
			if (cmd === "H") cx = a[0] as number;
			else if (cmd === "V") cy = a[0] as number;
			else if (cmd === "A") [cx, cy] = [a[5] as number, a[6] as number];
			else {
				for (let k = 0; k < a.length; k += 2) add(a[k] as number, a[k + 1] as number);
				[cx, cy] = [a[a.length - 2] as number, a[a.length - 1] as number];
			}
			add(cx, cy);
		}
	});
	return unknown || !Number.isFinite(minX) ? null : [minX, minY, maxX, maxY];
}

export interface FlagItem {
	file: string;
	svg: string;
	warnings: string[];
}

export function parseFlags(text: string): FlagItem[] {
	const root = parseSvg(text);
	const top = root.children.find((c) => c.tag === "g") as El;
	const countries = top.children.filter((c) => c.tag === "g");
	const out: FlagItem[] = [];
	countries.forEach((country, i) => {
		const x0 = GRID.x0 + GRID.dx * (i % GRID.cols);
		const y0 = GRID.y0 + GRID.dy * Math.floor(i / GRID.cols);
		const flags = country.children.filter((c) => c.tag === "g");
		if (flags.length !== SHAPES.length)
			throw new Error(`«${attr(country, "id")}» (n.º ${i}) no trae 3 banderas`);
		flags.forEach((flag, k) => {
			const shape = SHAPES[k] as (typeof SHAPES)[number];
			const id = attr(flag, "id") as string;
			if (!id.endsWith(`-${shape.name}`)) throw new Error(`${id}: se esperaba la forma ${shape.name}`);
			const slug = flagSlug(id.slice(0, -(shape.name.length + 1)));
			const box: [number, number, number, number] = [x0 + shape.dx, y0, shape.w, GRID.h];
			const warnings: string[] = [];
			const bb = bboxOf(flag);
			if (bb) {
				const [bx0, by0, bx1, by1] = bb;
				const tol = 1.25;
				if (
					bx0 < box[0] - tol ||
					by0 < box[1] - tol ||
					bx1 > box[0] + box[2] + tol ||
					by1 > box[1] + box[3] + tol
				)
					warnings.push(
						`se sale de su caja (${bb.map((v) => v.toFixed(1)).join(",")} en ${box.join(",")})`,
					);
				if (bx1 - bx0 < box[2] * 0.7 || by1 - by0 < box[3] * 0.7)
					warnings.push("ocupa menos del 70 % de su caja");
			} else warnings.push("no se pudo medir");
			const { svg } = cut(root, flag, box, `f-${slug}-${shape.name}`, false);
			out.push({ file: `${slug}-${shape.name}.svg`, svg, warnings });
		});
	});
	return out;
}

function main() {
	const file = process.argv[2];
	const check = process.argv.includes("--check");
	if (!file) throw new Error("Uso: bun run scripts/import-flags.ts <flags.svg> [--check]");
	const items = parseFlags(readFileSync(file, "utf8"));
	const names = new Set<string>();
	const problems: string[] = [];
	for (const it of items) {
		if (names.has(it.file)) problems.push(`repetido: ${it.file}`);
		names.add(it.file);
		for (const w of it.warnings) problems.push(`${it.file}: ${w}`);
	}
	console.log(`${items.length} banderas (${items.length / SHAPES.length} países)`);
	console.log(
		problems.length ? `AVISOS (${problems.length}):\n${problems.slice(0, 40).join("\n")}` : "sin avisos",
	);
	if (check || problems.length) return;
	const dir = join(import.meta.dirname, "../assets/flags");
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
	for (const it of items) writeFileSync(join(dir, it.file), it.svg);
	console.log(`escritas en assets/flags/`);
}

if (process.argv[1]?.endsWith("import-flags.ts")) main();
