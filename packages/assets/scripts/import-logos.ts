// Importa los logos de terceros del Figma a assets/logos/<set>/<nombre>.svg (y <nombre>-gray.svg). Se ejecuta una vez
// por cada actualización del Figma, no en el build. Cada set se exporta entero como SVG (download_assets del MCP de
// Figma sobre su marco, ver assets/logos/figma.json) y este script recorta cada logo por su nombre de capa, con la
// caja del marco como viewBox, se lleva solo los <defs> que usa y da a sus ids un prefijo propio para que dos logos
// en la misma página no choquen. Los grises de un solo color pasan a currentColor.
// Uso: bun run scripts/import-logos.ts <app.svg> <integration.svg> <social.svg>
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type LogoSet = "app" | "integration" | "social";
interface Source {
	node: string;
	size: [number, number];
	items: [name: string, category: string, x: number, y: number][];
}

// ---- Árbol XML mínimo: el SVG de Figma no lleva comentarios, CDATA ni texto que importe ----
export interface El {
	tag: string;
	attrs: [string, string][];
	children: El[];
}

export function parseSvg(text: string): El {
	const root: El = { tag: "#root", attrs: [], children: [] };
	const stack = [root];
	const re = /<(\/?)([a-zA-Z][\w:-]*)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g;
	for (const m of text.matchAll(re)) {
		const [, closing, tag, rawAttrs, selfClosing] = m as unknown as [
			string,
			string,
			string,
			string,
			string,
		];
		if (closing) {
			stack.pop();
			continue;
		}
		const attrs = [...rawAttrs.matchAll(/([\w:-]+)="([^"]*)"/g)].map(
			(a) => [a[1], a[2]] as [string, string],
		);
		const el: El = { tag, attrs, children: [] };
		(stack.at(-1) as El).children.push(el);
		if (!selfClosing) stack.push(el);
	}
	return root.children[0] as El;
}

const attr = (el: El, name: string) => el.attrs.find(([k]) => k === name)?.[1];
const decodeEntities = (s: string) =>
	s.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&#34;", '"');
const walk = (el: El, fn: (e: El) => void) => {
	fn(el);
	for (const c of el.children) walk(c, fn);
};
const refsOf = (el: El) => {
	const out = new Set<string>();
	walk(el, (e) => {
		for (const [k, v] of e.attrs) {
			for (const m of v.matchAll(/url\(#([^)]+)\)/g)) out.add(m[1] as string);
			if ((k === "href" || k === "xlink:href") && v.startsWith("#")) out.add(v.slice(1));
		}
	});
	return out;
};

// ---- Nombres ----
const APP_RENAMES: Record<string, string> = {
	"c++": "cpp",
	"c#": "csharp",
	"jb_resharper_c++": "jetbrains-resharper-cpp",
	"yii 1": "yii",
	"g-calendar": "google-calendar",
	tumbler: "tumblr",
};
export function slugOf(set: LogoSet, name: string, category: string): string {
	if (set === "app") {
		if (name === "swift" && category === "Finance") return "swift-payments";
		const base = APP_RENAMES[name] ?? name;
		return base
			.replace(/^jb_/, "jetbrains-")
			.replace(/^ms_/, "microsoft-")
			.toLowerCase()
			.replace(/[_\s]+/g, "-");
	}
	const brand = (name.match(/(?:Integration|Platform)=([^,]+)/)?.[1] ?? name).trim();
	const slug = brand
		.replace(/\s*\(.*\)$/, "") // «X (Twitter)» → «X»
		.replace(/\.js$/i, "js")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
	return /Grayscale=True/.test(name) ? `${slug}-gray` : slug;
}

// ---- Recorte de un logo ----
const COLOR_ATTRS = ["fill", "stroke", "stop-color"];

export function cut(root: El, el: El, box: [number, number, number, number], prefix: string, gray: boolean) {
	// Lo que ya va dentro del logo (una máscara, un degradado) sale con él: no se copia otra vez a <defs>
	const inside = new Set<El>();
	walk(el, (e) => inside.add(e));
	const defsById = new Map<string, El>();
	walk(root, (e) => {
		const id = attr(e, "id");
		if (id && !inside.has(e)) defsById.set(id, e);
	});
	const ownIds = new Set<string>();
	walk(el, (e) => {
		const id = attr(e, "id");
		if (id) ownIds.add(id);
	});
	// Lo que usa el logo, y lo que usan esas definiciones (un degradado puede heredar de otro)
	const used = new Set<string>();
	const referenced = new Set<string>();
	const pending = [...refsOf(el)];
	while (pending.length) {
		const id = pending.pop() as string;
		if (ownIds.has(id)) referenced.add(id);
		if (used.has(id) || !defsById.has(id)) continue;
		used.add(id);
		referenced.add(id);
		for (const r of refsOf(defsById.get(id) as El)) pending.push(r);
	}
	const rename = new Map([...referenced].map((id, i) => [id, `${prefix}-${i}`]));
	const colors = new Set<string>();
	// Degradados cónicos: Figma los exporta como un <foreignObject> con CSS, que no entienden ni los visores de SVG
	// ni las herramientas. Se cambian por un degradado lineal con las mismas paradas (diferencia aceptada).
	const extraDefs: string[] = [];
	const conic = (e: El): string | undefined => {
		const raw = attr(e, "data-figma-gradient-fill");
		if (!raw || attr(e, "fill")) return undefined;
		const g = JSON.parse(decodeEntities(raw)) as {
			stops: { color: { r: number; g: number; b: number; a: number }; position: number }[];
		};
		const id = `${prefix}-g${extraDefs.length}`;
		const hex = (n: number) =>
			Math.round(n * 255)
				.toString(16)
				.padStart(2, "0");
		const stops = g.stops
			.map(
				(s) =>
					`<stop offset="${s.position}" stop-color="#${hex(s.color.r)}${hex(s.color.g)}${hex(s.color.b)}"${s.color.a < 1 ? ` stop-opacity="${s.color.a}"` : ""}/>`,
			)
			.join("");
		extraDefs.push(`<linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0">${stops}</linearGradient>`);
		return `url(#${id})`;
	};
	const serialize = (e: El, inDefs: boolean): string => {
		if (attr(e, "data-figma-skip-parse") !== undefined) return "";
		const fill = conic(e);
		const attrs = e.attrs
			.filter(([k]) => k !== "id" || rename.has(e.attrs.find(([a]) => a === "id")?.[1] as string))
			.filter(([k]) => !k.startsWith("data-figma"))
			.map(([k, v]): [string, string] =>
				k === "style" && v.replace(/\s|;/g, "") === "mask-type:alpha"
					? ["mask-type", "alpha"]
					: [k, v],
			)
			.concat(fill ? [["fill", fill]] : [])
			.map(([k, v]) => {
				let value = v;
				if (k === "id") value = rename.get(v) as string;
				value = value.replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${rename.get(id) ?? id})`);
				if ((k === "href" || k === "xlink:href") && value.startsWith("#"))
					value = `#${rename.get(value.slice(1)) ?? value.slice(1)}`;
				if (!inDefs && COLOR_ATTRS.includes(k) && !value.startsWith("url(") && value !== "none")
					colors.add(value.toUpperCase());
				return [k, value];
			});
		const open = `<${e.tag}${attrs.map(([k, v]) => ` ${k}="${v}"`).join("")}`;
		const inside = inDefs || e.tag === "clipPath" || e.tag === "mask";
		return e.children.length
			? `${open}>${e.children.map((c) => serialize(c, inside)).join("")}</${e.tag}>`
			: `${open}/>`;
	};
	const body = serialize(el, false);
	const defs = [...used].map((id) => serialize(defsById.get(id) as El, true)).join("") + extraDefs.join("");
	const [x, y, w, h] = box;
	let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}" fill="none">${body}${defs ? `<defs>${defs}</defs>` : ""}</svg>\n`;
	// Un gris de un solo color sigue el color del texto
	const mono = gray && colors.size === 1;
	if (mono) {
		const only = [...colors][0] as string;
		svg = svg.replace(new RegExp(`(fill|stroke)="${only}"`, "gi"), '$1="currentColor"');
	}
	return { svg, mono, colors: [...colors] };
}

function findLogo(root: El, set: LogoSet, name: string, category: string): El {
	const top = root.children.find((c) => c.tag === "g") as El;
	const parent =
		set === "app"
			? (top.children.find(
					(c) => decodeEntities(attr(c, "id") ?? "") === `App icons / ${category}`,
				) as El)
			: top;
	// Figma no repite ids en todo el SVG: si el nombre ya salió antes (en otra categoría o en una capa de otro logo), lo
	// llama «<nombre>_2», «_3»… Por anchura, el componente es la coincidencia más cercana a la raíz de su categoría.
	const matches = (id: string) =>
		id === name || (id.startsWith(`${name}_`) && /^\d+$/.test(id.slice(name.length + 1)));
	let found: El | undefined;
	const queue = parent ? [...parent.children] : [];
	while (queue.length && !found) {
		const c = queue.shift() as El;
		if (matches(decodeEntities(attr(c, "id") ?? ""))) found = c;
		else queue.push(...c.children);
	}
	if (!found)
		throw new Error(`No encuentro «${name}» (${set}${category ? `, ${category}` : ""}) en el SVG`);
	return found;
}

function main() {
	const [appFile, integrationFile, socialFile] = process.argv.slice(2);
	if (!appFile || !integrationFile || !socialFile)
		throw new Error("Uso: bun run scripts/import-logos.ts <app.svg> <integration.svg> <social.svg>");
	const dir = join(import.meta.dirname, "../assets/logos");
	const sources = JSON.parse(readFileSync(join(dir, "figma.json"), "utf8")) as Record<LogoSet, Source>;
	const files: Record<LogoSet, string> = { app: appFile, integration: integrationFile, social: socialFile };
	for (const set of ["app", "integration", "social"] as const) {
		const root = parseSvg(readFileSync(files[set], "utf8"));
		const target = join(dir, set);
		rmSync(target, { recursive: true, force: true });
		mkdirSync(target, { recursive: true });
		const [w, h] = sources[set].size;
		let mono = 0;
		const seen = new Set<string>();
		for (const [name, category, x, y] of sources[set].items) {
			const slug = slugOf(set, name, category);
			if (seen.has(slug)) throw new Error(`Nombre repetido: ${set}/${slug}`);
			seen.add(slug);
			const el = findLogo(root, set, name, category);
			const out = cut(root, el, [x, y, w, h], `${set}-${slug}`, slug.endsWith("-gray"));
			if (out.mono) mono++;
			writeFileSync(join(target, `${slug}.svg`), out.svg);
		}
		console.log(`${set}: ${seen.size} logos (${mono} grises en currentColor) → assets/logos/${set}/`);
	}
}

if (process.argv[1]?.endsWith("import-logos.ts")) main();
