// Importa del Figma los dibujos de las cabeceras de EmptyState (ilustraciones, icono de archivo y carpetas) a
// src/internal/empty-media.generated.ts. Se ejecuta una vez por cada actualización del Figma, no en el build.
// Entradas: el SVG del marco «Illustration» (1182:1085) y los de los nodos 4981:383021 (archivo), 9239:547134 (carpeta)
// y 11284:2625 (carpeta translúcida), exportados con download_assets del MCP de Figma.
// Lo que no sale del Figma: el círculo de cristal con el icono de las ilustraciones y el círculo del archivo van en
// HTML (EmptyState); la textura de ruido de las carpetas (PNG) y el texto de marca de la plantilla («UUI Projects»,
// «0 results») se quitan. Los grises pasan a variables del tema para que sigan el oscuro.
// Uso: bun run scripts/import-empty-media.ts <illustration.svg> <file.svg> <folder.svg> <folder-glass.svg>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cut, type El, parseSvg } from "../../icons/scripts/import-logos.ts";

const GRAYS: Record<string, string> = {
	"#FAFAFA": "var(--bg-secondary)",
	"#F5F5F5": "var(--bg-tertiary)",
	"#E5E5E5": "var(--bg-quaternary)",
	"#D4D4D4": "var(--border-primary)",
	"#4F46E5": "var(--bg-brand-solid)",
};

const idOf = (e: El) => e.attrs.find(([k]) => k === "id")?.[1] ?? "";
/** Quita del árbol lo que no se lleva: cristal, foreignObject, imágenes, rellenos de imagen y texto de la plantilla. */
function prune(el: El) {
	el.children = el.children.filter((c) => {
		const id = idOf(c);
		if (c.tag === "foreignObject" || c.tag === "image") return false;
		if (/^Featured icon/.test(id) || /^(Logo|Text wrapper)/.test(id) || /^(Noise|Front noise)/.test(id))
			return false;
		if (c.attrs.some(([k, v]) => k === "fill" && v.startsWith("url(#pattern"))) return false;
		return true;
	});
	for (const c of el.children) prune(c);
}

function find(root: El, id: string): El {
	const queue = [root];
	while (queue.length) {
		const e = queue.shift() as El;
		if (idOf(e) === id) return e;
		queue.push(...e.children);
	}
	throw new Error(`No encuentro «${id}»`);
}

/**
 * Cambia colores por variables del tema en todo el árbol (también en los degradados de <defs>), salvo dentro de
 * máscaras, recortes y filtros: ahí el blanco y el negro dicen qué se ve, no de qué color es.
 */
function recolor(el: El, map: Record<string, string>) {
	if (el.tag === "mask" || el.tag === "clipPath" || el.tag === "filter") return;
	el.attrs = el.attrs.map(([k, v]) => {
		if (k !== "fill" && k !== "stroke" && k !== "stop-color") return [k, v];
		const key = v.toUpperCase() === "WHITE" ? "#FFFFFF" : v.toUpperCase();
		return [k, map[key] ?? v];
	});
	for (const c of el.children) recolor(c, map);
}

function piece(
	file: string,
	id: string,
	box: [number, number, number, number],
	prefix: string,
	extra: Record<string, string> = {},
) {
	const root = parseSvg(readFileSync(file, "utf8"));
	const el = find(root, id);
	prune(el);
	recolor(root, { ...GRAYS, ...extra });
	const { svg } = cut(root, el, box, prefix, false);
	const m = svg.match(
		/^<svg [^>]*width="([\d.]+)" height="([\d.]+)" viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>\s*$/,
	);
	if (!m) throw new Error(`SVG inesperado: ${id}`);
	return { width: Number(m[1]), height: Number(m[2]), viewBox: m[3] as string, inner: m[4] as string };
}

const [illustration, fileSvg, folderSvg, glassSvg] = process.argv.slice(2);
if (!illustration || !fileSvg || !folderSvg || !glassSvg)
	throw new Error(
		"Uso: bun run scripts/import-empty-media.ts <illustration.svg> <file.svg> <folder.svg> <folder-glass.svg>",
	);

// Cajas del tamaño md dentro del marco «Illustration» (las de sm y lg son la misma composición a otra escala)
// En las ilustraciones el blanco es superficie (sigue el tema); en la carpeta es el papel (se queda blanco) y el
// cuerpo oscuro pasa a fg-secondary para que se vea también en oscuro.
const SURFACE = { "#FFFFFF": "var(--bg-primary)" };
const media = {
	cloud: piece(illustration, "Style=Cloud, Size=md", [200, 16, 172, 128], "em-cloud", SURFACE),
	box: piece(illustration, "Style=Box, Size=md", [200, 192, 172, 136], "em-box", SURFACE),
	documents: piece(illustration, "Style=Documents, Size=md", [200, 376, 172, 128], "em-documents", SURFACE),
	"credit-card": piece(
		illustration,
		"Style=Credit card, Size=md",
		[200, 552, 172, 134],
		"em-card",
		SURFACE,
	),
	file: piece(fileSvg, "File type icon", [0, 0, 40, 46], "em-file"),
	folder: piece(folderSvg, "Folder icon", [0, 0, 54, 48], "em-folder", {
		"#262626": "var(--fg-secondary)",
	}),
	"folder-glass": piece(glassSvg, "Folder icon", [0, 0, 96, 96], "em-glass"),
};

writeFileSync(
	join(import.meta.dirname, "../src/internal/empty-media.generated.ts"),
	`// Generado por scripts/import-empty-media.ts desde el Figma. No editar a mano.
export interface EmptyMediaDrawing {
	width: number;
	height: number;
	viewBox: string;
	inner: string;
}

export const emptyMedia = ${JSON.stringify(media, null, "\t")} satisfies Record<string, EmptyMediaDrawing>;
`,
);
for (const [k, v] of Object.entries(media))
	console.log(`${k}: ${v.width}×${v.height}, ${(v.inner.length / 1024).toFixed(1)} kB`);
