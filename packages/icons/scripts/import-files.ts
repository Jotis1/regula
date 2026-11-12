// Importa los iconos de tipo de archivo («File type icon», 4916:411695) y las carpetas («Folder icon», 7585:9240) del
// Figma a assets/files/<nombre>.svg. Se ejecuta una vez por cada actualización del Figma, no en el build. Cada conjunto
// se exporta entero como SVG (download_assets del MCP de Figma) y este script recorta cada variante por su nombre de
// capa, con su caja como viewBox.
//
// Archivos: 153 cajas de 40×40 en 10 columnas (cada 72 px desde x=16) y 7 bloques de 3 filas (Default, Gray y Solid; filas
// cada 56 px, bloques cada 216 px desde y=16). La caja sale de esa rejilla y se comprueba contra sus trazos.
// Carpetas: 8 cajas de 48×48 (cerrada) o 54×48 (abierta) en posiciones fijas.
// Uso: bun run scripts/import-files.ts <files.svg> <folders.svg> [--check]
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { bboxOf } from "./import-flags.ts";
import { cut, type El, parseSvg } from "./import-logos.ts";

const attr = (el: El, name: string) => el.attrs.find(([k]) => k === name)?.[1];
const kebab = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

const FILE = { x0: 16, dx: 72, y0: 16, rowDy: 56, blockDy: 216, size: 40 };

/**
 * «Design / FIG (Figma)» + «Gray» → `design-fig-gray`. El Figma llama «Simple» o «Default» a los diez iconos genéricos
 * (sin extensión): aquí son `generic-*`. El tipo `Default` no lleva sufijo.
 */
export function fileSlug(fileType: string, type: string): string {
	const [category, name] = fileType.split(" / ") as [string, string];
	const cat = category === "Simple" || category === "Default" ? "generic" : kebab(category);
	const base = `${cat}-${kebab(name.replace(/\s*\(.*\)$/, ""))}`;
	return type === "Default" ? base : `${base}-${type.toLowerCase()}`;
}

const FOLDERS: Record<string, [number, number, number, number]> = {
	"Type=Brand, Open=False": [16, 16, 48, 48],
	"Type=Gray, Open=False": [16, 80, 48, 48],
	"Type=Noise, Open=False": [16, 144, 48, 48],
	"Type=Transparent, Open=False": [16, 208, 48, 48],
	"Type=Brand, Open=True": [96, 16, 54, 48],
	"Type=Gray, Open=True": [96, 80, 54, 48],
	"Type=Noise, Open=True": [96, 144, 54, 48],
	"Type=Transparent, Open=True": [96, 208, 54, 48],
};

export function folderSlug(id: string): string {
	const m = id.match(/^Type=(\w+), Open=(True|False)$/) as RegExpMatchArray;
	return `folder-${(m[1] as string).toLowerCase()}${m[2] === "True" ? "-open" : ""}`;
}

/**
 * Figma exporta el desenfoque de fondo de una capa (las carpetas «noise» y «transparent») como un <foreignObject> con
 * `backdrop-filter`, que no es un dibujo y no funciona en un SVG suelto. Se quita, con su recorte (diferencia aceptada).
 */
export function stripBackdropBlur(svg: string): string {
	const fo = /<foreignObject\b[\s\S]*?<\/foreignObject>/g;
	const ids = [...svg.matchAll(fo)].flatMap((m) =>
		[...m[0].matchAll(/url\(#([^)]+)\)/g)].map((x) => x[1] as string),
	);
	let out = svg.replace(fo, "");
	for (const id of ids)
		if (!out.includes(`url(#${id})`))
			out = out.replace(new RegExp(`<clipPath id="${id}"[\\s\\S]*?</clipPath>`), "");
	return out.replace(/<defs>\s*<\/defs>/, "");
}

/** `xlink:href` (la imagen embebida) necesita su espacio de nombres: sin él, el SVG no es XML válido como imagen. */
export function withXlink(svg: string): string {
	return svg.includes("xlink:") && !svg.includes("xmlns:xlink")
		? svg.replace(
				'<svg xmlns="http://www.w3.org/2000/svg"',
				'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"',
			)
		: svg;
}

export interface Item {
	file: string;
	svg: string;
	warnings: string[];
}

function check(bb: ReturnType<typeof bboxOf>, box: number[], min: number, warnings: string[]) {
	if (!bb) return warnings.push("no se pudo medir");
	const [x, y, w, h] = box as [number, number, number, number];
	const [minX, minY, maxX, maxY] = bb;
	const tol = 1.5;
	if (minX < x - tol || minY < y - tol || maxX > x + w + tol || maxY > y + h + tol)
		warnings.push(`se sale de su caja (${bb.map((v) => v.toFixed(1)).join(",")} en ${box.join(",")})`);
	if (maxX - minX < w * min || maxY - minY < h * min)
		warnings.push(`ocupa menos del ${min * 100} % de su caja`);
}

export function parseFiles(text: string): Item[] {
	const root = parseSvg(text);
	const top = root.children.find((c) => c.tag === "g") as El;
	const out: Item[] = [];
	for (const g of top.children.filter((c) => c.tag === "g")) {
		const id = attr(g, "id") ?? "";
		const m = id.match(/^File type=(.+), Type=(Default|Gray|Solid)$/);
		if (!m) throw new Error(`capa inesperada «${id}»`);
		const warnings: string[] = [];
		const bb = bboxOf(g);
		let box: number[] = [0, 0, FILE.size, FILE.size];
		if (bb) {
			const col = Math.floor((bb[0] - FILE.x0 + 0.5) / FILE.dx);
			const rel = bb[1] - FILE.y0 + 0.5;
			const block = Math.floor(rel / FILE.blockDy);
			const row = Math.floor((rel - block * FILE.blockDy) / FILE.rowDy);
			box = [
				FILE.x0 + FILE.dx * col,
				FILE.y0 + FILE.blockDy * block + FILE.rowDy * row,
				FILE.size,
				FILE.size,
			];
			const wanted = (m[2] as string) === "Default" ? 0 : (m[2] as string) === "Gray" ? 1 : 2;
			if (row !== wanted) warnings.push(`fila ${row}, se esperaba ${wanted} por su tipo`);
		}
		check(bb, box, 0.3, warnings);
		const slug = fileSlug(m[1] as string, m[2] as string);
		const { svg } = cut(root, g, box as [number, number, number, number], `f-${slug}`, false);
		out.push({ file: `${slug}.svg`, svg, warnings });
	}
	return out;
}

export function parseFolders(text: string): Item[] {
	const root = parseSvg(text);
	const top = root.children.find((c) => c.tag === "g") as El;
	const out: Item[] = [];
	for (const g of top.children.filter((c) => c.tag === "g")) {
		const id = attr(g, "id") ?? "";
		const box = FOLDERS[id];
		if (!box) throw new Error(`carpeta inesperada «${id}»`);
		const warnings: string[] = [];
		check(bboxOf(g), box, 0.5, warnings);
		const slug = folderSlug(id);
		const { svg } = cut(root, g, box, `d-${slug}`, false);
		out.push({ file: `${slug}.svg`, svg: withXlink(stripBackdropBlur(svg)), warnings });
	}
	return out;
}

function main() {
	const [filesSvg, foldersSvg] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
	const checkOnly = process.argv.includes("--check");
	if (!filesSvg || !foldersSvg)
		throw new Error("Uso: bun run scripts/import-files.ts <files.svg> <folders.svg> [--check]");
	const items = [
		...parseFiles(readFileSync(filesSvg, "utf8")),
		...parseFolders(readFileSync(foldersSvg, "utf8")),
	];
	const names = new Set<string>();
	const problems: string[] = [];
	for (const it of items) {
		if (names.has(it.file)) problems.push(`repetido: ${it.file}`);
		names.add(it.file);
		for (const w of it.warnings) problems.push(`${it.file}: ${w}`);
	}
	console.log(`${items.length} iconos (${items.length - 8} de archivo y 8 carpetas)`);
	console.log(
		problems.length ? `AVISOS (${problems.length}):\n${problems.slice(0, 40).join("\n")}` : "sin avisos",
	);
	if (checkOnly || problems.length) return;
	const dir = join(import.meta.dirname, "../assets/files");
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
	for (const it of items) writeFileSync(join(dir, it.file), it.svg);
	console.log("escritos en assets/files/");
}

if (process.argv[1]?.endsWith("import-files.ts")) main();
