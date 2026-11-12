// Importa los iconos de métodos de pago del Figma («Payment method icon», 1142:83268) a
// assets/payments/<metodo>-<tamaño>.svg. Se ejecuta una vez por cada actualización del Figma, no en el build. El
// conjunto se exporta entero como SVG (download_assets del MCP de Figma) y este script recorta cada variante por su
// nombre de capa («Size=sm, Payment method=JCB»), con su caja como viewBox.
//
// Cada variante es una caja de 34×24 (`sm`) o 46×32 (`md`) en una rejilla de tres columnas (x = 16, 192 y 368; los `md`
// 66 px más a la derecha) y filas cada 48 px desde y=16. La caja sale de esa rejilla y se comprueba contra sus trazos.
// Uso: bun run scripts/import-payments.ts <payments.svg> [--check]
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cut, type El, parseSvg } from "./import-logos.ts";
import { bboxOf } from "./svg-bbox.ts";

const SIZES = {
	sm: { w: 34, h: 24, xs: [16, 192, 368] },
	md: { w: 46, h: 32, xs: [82, 258, 434] },
} as const;
type PaymentSize = keyof typeof SIZES;
const GRID = { y0: 16, dy: 48 };

const attr = (el: El, name: string) => el.attrs.find(([k]) => k === name)?.[1];

// Nombres del Figma → nombre de fichero. Se separan las palabras que el Figma escribe juntas y se corrigen tres erratas.
const RENAMES: Record<string, string> = {
	ApplePay: "apple-pay",
	GooglePay: "google-pay",
	BitcoinCash: "bitcoin-cash",
	DinersClub: "diners-club",
	Etherium: "ethereum",
	Lightcoin: "litecoin",
	Ayden: "adyen",
};

export function paymentSlug(method: string): string {
	return (RENAMES[method] ?? method)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export interface PaymentItem {
	file: string;
	svg: string;
	warnings: string[];
}

export function parsePayments(text: string): PaymentItem[] {
	const root = parseSvg(text);
	const top = root.children.find((c) => c.tag === "g") as El;
	const out: PaymentItem[] = [];
	for (const g of top.children.filter((c) => c.tag === "g")) {
		const id = attr(g, "id") ?? "";
		const m = id.match(/^Size=(sm|md), Payment method=(.+)$/);
		if (!m) throw new Error(`capa inesperada «${id}»`);
		const size = m[1] as PaymentSize;
		const spec = SIZES[size];
		const slug = paymentSlug(m[2] as string);
		const warnings: string[] = [];
		const bb = bboxOf(g);
		let box: [number, number, number, number] = [0, 0, spec.w, spec.h];
		if (!bb) warnings.push("no se pudo medir");
		else {
			const [minX, minY, maxX, maxY] = bb;
			const x = [...spec.xs].reverse().find((c) => c <= minX + 0.5);
			const y = GRID.y0 + GRID.dy * Math.floor((minY - GRID.y0 + 0.5) / GRID.dy);
			if (x === undefined) warnings.push("no cae en ninguna columna");
			else {
				box = [x, y, spec.w, spec.h];
				if (maxX > x + spec.w + 0.5 || maxY > y + spec.h + 0.5 || minX < x - 0.5 || minY < y - 0.5)
					warnings.push(
						`se sale de su caja (${bb.map((v) => v.toFixed(1)).join(",")} en ${box.join(",")})`,
					);
				if (maxX - minX < spec.w * 0.9 || maxY - minY < spec.h * 0.9)
					warnings.push("ocupa menos del 90 % de su caja");
			}
		}
		const { svg } = cut(root, g, box, `p-${slug}-${size}`, false);
		out.push({ file: `${slug}-${size}.svg`, svg, warnings });
	}
	return out;
}

function main() {
	const file = process.argv[2];
	const check = process.argv.includes("--check");
	if (!file) throw new Error("Uso: bun run scripts/import-payments.ts <payments.svg> [--check]");
	const items = parsePayments(readFileSync(file, "utf8"));
	const names = new Set<string>();
	const problems: string[] = [];
	for (const it of items) {
		if (names.has(it.file)) problems.push(`repetido: ${it.file}`);
		names.add(it.file);
		for (const w of it.warnings) problems.push(`${it.file}: ${w}`);
	}
	console.log(`${items.length} iconos de pago (${items.length / 2} métodos)`);
	console.log(
		problems.length ? `AVISOS (${problems.length}):\n${problems.slice(0, 40).join("\n")}` : "sin avisos",
	);
	if (check || problems.length) return;
	const dir = join(import.meta.dirname, "../assets/payments");
	rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir, { recursive: true });
	for (const it of items) writeFileSync(join(dir, it.file), it.svg);
	console.log("escritos en assets/payments/");
}

if (process.argv[1]?.endsWith("import-payments.ts")) main();
