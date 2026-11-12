// Caja aproximada de los trazos de un SVG, que usan los importadores de pagos y de cursores para recortar su marco.
// Antes vivía en el importador de banderas, que se eliminó al pasar a @untitledui/country-flags.
import type { El } from "./import-logos.ts";

const attr = (el: El, name: string) => el.attrs.find(([k]) => k === name)?.[1];
// Lo que no se pinta tal cual (máscaras, recortes, patrones, filtros y definiciones) no cuenta para medir la caja
const NOT_DRAWN = new Set(["mask", "clipPath", "pattern", "filter", "defs"]);
const walkDrawn = (el: El, fn: (e: El) => void) => {
	if (NOT_DRAWN.has(el.tag)) return;
	fn(el);
	for (const c of el.children) walkDrawn(c, fn);
};

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
