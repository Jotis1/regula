// Importa los iconos de línea del Figma a src/data/icons.ts. Se ejecuta una vez por cada actualización del Figma, no
// en el build. Cada marco de categoría de la página «Icons» (3463:407484) se exporta entero como SVG (download_assets
// del MCP de Figma) y este script recorta cada icono por el nombre de su capa. Los iconos son componentes de 24×24
// en una rejilla de 4 columnas (cada 272 px desde x=64) y filas cada 40 px desde y=156; el origen de cada uno sale de
// esa rejilla y sus trazos se trasladan a 0..24. Los iconos que ya estaban conservan su dibujo.
// Uso: bun run scripts/import-icons.ts <carpeta con los SVG de los marcos> [--check]
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { icons as existing } from "../src/data/icons.ts";
import { type El, parseSvg } from "./import-logos.ts";

const GRID = { x0: 64, y0: 156, dx: 272, dy: 40, size: 24 };
// Cuántos iconos trae cada marco (página «Icons» del Figma), para detectar un recorte incompleto
export const EXPECTED: Record<string, number> = {
	layout: 63,
	charts: 49,
	security: 36,
	education: 31,
	development: 57,
	arrows: 92,
	finance: 79,
	general: 193,
	alerts: 26,
	shapes: 25,
	users: 41,
	media: 108,
	images: 29,
	communication: 58,
	editor: 104,
	time: 28,
	files: 57,
	maps: 45,
	weather: 52,
};

const attr = (el: El, name: string) => el.attrs.find(([k]) => k === name)?.[1];
const collect = (el: El, out: El[] = []) => {
	for (const c of el.children) {
		out.push(c);
		collect(c, out);
	}
	return out;
};

const fmt = (n: number) => {
	const s = (Math.round(n * 10000) / 10000).toString();
	return s === "-0" ? "0" : s;
};

/** Traslada un `d` de comandos absolutos restando (dx, dy). Falla ante comandos relativos o arcos mal formados. */
export function translatePath(d: string, dx: number, dy: number): string {
	const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
	const out: string[] = [];
	let i = 0;
	let cmd = "";
	const num = () => Number.parseFloat(tokens[i++] as string);
	const arity: Record<string, number> = { M: 2, L: 2, T: 2, C: 6, S: 4, Q: 4, H: 1, V: 1, A: 7, Z: 0 };
	while (i < tokens.length) {
		const t = tokens[i] as string;
		if (/[a-zA-Z]/.test(t)) {
			cmd = t;
			i++;
			if (cmd === "Z" || cmd === "z") {
				out.push("Z");
				continue;
			}
		}
		if (cmd !== cmd.toUpperCase() || !(cmd in arity))
			throw new Error(`comando no soportado «${cmd}» en ${d}`);
		const n = arity[cmd] as number;
		const args: number[] = [];
		for (let k = 0; k < n; k++) {
			if (i >= tokens.length || /[a-zA-Z]/.test(tokens[i] as string))
				throw new Error(`faltan argumentos de ${cmd}`);
			args.push(num());
		}
		let res: number[];
		if (cmd === "H") res = [(args[0] as number) - dx];
		else if (cmd === "V") res = [(args[0] as number) - dy];
		else if (cmd === "A")
			res = [
				args[0],
				args[1],
				args[2],
				args[3],
				args[4],
				(args[5] as number) - dx,
				(args[6] as number) - dy,
			] as number[];
		else res = args.map((v, k) => v - (k % 2 === 0 ? dx : dy));
		out.push(cmd + res.map(fmt).join(" "));
	}
	return out.join("");
}

export interface Parsed {
	name: string;
	paths: string[];
	warnings: string[];
}

export function parseFrame(file: string, text: string): Parsed[] {
	const svg = parseSvg(text);
	const frame = svg.children.find((c) => c.tag === "g");
	if (!frame) throw new Error(`${file}: sin grupo de marco`);
	const result: Parsed[] = [];
	for (const g of frame.children.filter((c) => c.tag === "g")) {
		const name = attr(g, "id") as string;
		const shapes = collect(g).filter((e) => e.tag !== "g");
		const warnings: string[] = [];
		const raw: string[] = [];
		for (const s of shapes) {
			if (s.tag !== "path") {
				warnings.push(`${s.tag}`);
				continue;
			}
			// fill-rule y clip-rule no pintan nada: el marco trae fill="none" y estos trazos no llevan relleno
			const rest = s.attrs.filter(
				([k]) =>
					![
						"d",
						"id",
						"stroke",
						"stroke-width",
						"stroke-linecap",
						"stroke-linejoin",
						"fill-rule",
						"clip-rule",
					].includes(k),
			);
			if (rest.length) warnings.push(`attrs ${rest.map(([k, v]) => `${k}=${v}`).join(",")}`);
			if (attr(s, "stroke") !== "black") warnings.push(`stroke=${attr(s, "stroke")}`);
			if (attr(s, "stroke-width") !== "2") warnings.push(`stroke-width=${attr(s, "stroke-width")}`);
			raw.push(attr(s, "d") as string);
		}
		// Origen: la celda de la rejilla que contiene el primer punto
		const first = (raw[0] ?? "").match(/^M\s*(-?[\d.]+)[\s,]*(-?[\d.]+)/);
		if (!first) {
			warnings.push("sin M inicial");
			result.push({ name, paths: [], warnings });
			continue;
		}
		const px = Number.parseFloat(first[1] as string);
		const py = Number.parseFloat(first[2] as string);
		const ox = GRID.x0 + GRID.dx * Math.floor((px - GRID.x0) / GRID.dx);
		const oy = GRID.y0 + GRID.dy * Math.floor((py - GRID.y0) / GRID.dy);
		const paths = raw.map((d) => translatePath(d, ox, oy));
		// Todo debe quedar dentro de la caja (un punto de control puede salirse un poco)
		for (const p of paths) {
			for (const v of p.match(/-?\d*\.?\d+/g) ?? []) {
				const n = Number.parseFloat(v);
				if (n < -2 || n > GRID.size + 2) {
					warnings.push(`fuera de caja (${n})`);
					break;
				}
			}
		}
		result.push({ name, paths, warnings });
	}
	return result;
}

function main() {
	const dir = process.argv[2];
	const check = process.argv.includes("--check");
	if (!dir) throw new Error("Uso: bun run scripts/import-icons.ts <carpeta> [--check]");
	const all = new Map<string, Parsed>();
	const warnings: string[] = [];
	for (const [frame, expected] of Object.entries(EXPECTED)) {
		const items = parseFrame(frame, readFileSync(join(dir, `${frame}.svg`), "utf8"));
		if (items.length !== expected)
			warnings.push(`${frame}: ${items.length} iconos, se esperaban ${expected}`);
		for (const it of items) {
			// «colors» está en dos categorías (Images y Editor) con el mismo dibujo: cuenta como un icono
			const prev = all.get(it.name);
			if (prev && JSON.stringify(prev.paths) !== JSON.stringify(it.paths))
				warnings.push(`repetido con otro dibujo: ${it.name} (${frame})`);
			all.set(it.name, it);
			for (const w of it.warnings) warnings.push(`${frame}/${it.name}: ${w}`);
		}
	}
	const missing = Object.keys(existing).filter((n) => !all.has(n));
	console.log(
		`${all.size} iconos del Figma; de los ${Object.keys(existing).length} actuales faltan en el Figma: ${missing.join(", ") || "ninguno"}`,
	);
	console.log(
		warnings.length ? `AVISOS (${warnings.length}):\n${warnings.slice(0, 60).join("\n")}` : "sin avisos",
	);
	if (check || warnings.length) return;
	// Los que ya estaban conservan su dibujo y su orden; los nuevos van detrás, ordenados por nombre
	const merged: Record<string, readonly string[]> = { ...existing };
	for (const name of [...all.keys()].sort())
		if (!(name in merged)) merged[name] = (all.get(name) as Parsed).paths;
	const body = Object.entries(merged)
		.map(
			([n, ps]) =>
				`\t${JSON.stringify(n)}: [\n${ps.map((p) => `\t\t${JSON.stringify(p)},\n`).join("")}\t],\n`,
		)
		.join("");
	const header = readFileSync(join(import.meta.dirname, "../src/data/icons.ts"), "utf8").split("\n")[0];
	writeFileSync(
		join(import.meta.dirname, "../src/data/icons.ts"),
		`${header}\n// Los iconos que no vienen de la guía original salen del Figma con scripts/import-icons.ts.\n// Las claves se quedan como unión de nombres y los trazos como \`readonly string[]\`: con \`as const\`, 1.172 iconos son\n// un tipo demasiado complejo para TypeScript.\nconst defineIcons = <K extends string>(icons: { [P in K]: readonly string[] }) => icons;\n\nexport const icons = defineIcons({\n${body}});\n`,
	);
	console.log(`escrito src/data/icons.ts con ${Object.keys(merged).length} iconos`);
}

if (process.argv[1]?.endsWith("import-icons.ts")) main();
