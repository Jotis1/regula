// Datos de las galerías de recursos de `@jotis-me/icons` (iconos, banderas, pagos, archivos y cursores). Es código puro,
// sin `fs`: la página de Astro le pasa las URL de los SVG (`import.meta.glob`) y la isla `AssetGallery` recibe las
// entradas ya agrupadas. Los logos tienen su propia galería (`LogoGallery`).

export type GalleryKind = "icons" | "flags" | "payments" | "files" | "cursors";

export interface GalleryVariant {
	/** Clave de la variante: `circle`, `md`, `gray`, `open`… (`icon` si el recurso solo tiene una). */
	key: string;
	/** Nombre del fichero SVG sin extensión (`spain-circle`). */
	slug: string;
	url: string;
}

export interface GalleryEntry {
	/** Nombre que se busca y se copia: el del país, el método, el tipo de archivo… */
	name: string;
	/** Categorías a las que pertenece (casi siempre una). */
	groups: string[];
	variants: GalleryVariant[];
}

export const pascal = (s: string) =>
	s
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("");

/** El componente suelto de un SVG, igual que lo genera `packages/icons/scripts/generate.ts`. */
export function componentName(kind: GalleryKind, slug: string): string {
	switch (kind) {
		case "icons":
			return `Icon${pascal(slug)}`;
		case "flags":
			return `Flag${pascal(slug)}`;
		case "payments":
			return `Payment${pascal(slug)}`;
		case "cursors":
			return `Cursor${pascal(slug)}`;
		case "files":
			return slug.startsWith("folder-") ? `Folder${pascal(slug.slice(7))}` : `File${pascal(slug)}`;
	}
}

/** De dónde se importan los componentes de cada set. */
export const importPath = (kind: GalleryKind) =>
	kind === "icons" ? "@jotis-me/icons" : `@jotis-me/icons/${kind}`;

/** Ruta del SVG dentro del paquete, para importarlo con `?raw` en Astro. */
export const svgModule = (kind: GalleryKind, slug: string) =>
	kind === "icons" ? `@jotis-me/icons/svg/${slug}.svg` : `@jotis-me/icons/${kind}/${slug}.svg`;

const VARIANT_LABELS: Record<string, string> = {
	icon: "Icono",
	circle: "Círculo",
	square: "Cuadrado",
	rectangle: "Rectángulo",
	sm: "sm",
	md: "md",
	default: "Default",
	gray: "Gray",
	solid: "Solid",
	closed: "Cerrada",
	open: "Abierta",
};
export const variantLabel = (key: string) => VARIANT_LABELS[key] ?? key;

/** Categorías de los iconos de línea: las del Figma, en castellano. */
export const ICON_CATEGORIES: Record<string, string> = {
	layout: "Maquetación",
	charts: "Gráficas",
	security: "Seguridad",
	education: "Educación",
	development: "Desarrollo",
	arrows: "Flechas",
	finance: "Finanzas y comercio",
	general: "General",
	alerts: "Alertas y avisos",
	shapes: "Formas",
	users: "Usuarios",
	media: "Medios y dispositivos",
	images: "Imágenes",
	communication: "Comunicación",
	editor: "Editor",
	time: "Tiempo",
	files: "Archivos",
	maps: "Mapas y viajes",
	weather: "Clima",
};

/** Categorías de los iconos de archivo y carpeta. */
export const FILE_CATEGORIES: Record<string, string> = {
	generic: "Genéricos",
	document: "Documentos",
	image: "Imágenes",
	media: "Audio y vídeo",
	design: "Diseño",
	development: "Desarrollo",
	archive: "Comprimidos",
	folder: "Carpetas",
};

export const CURSOR_CATEGORIES: Record<string, string> = {
	classic: "Clásicos",
	macos: "macOS 26",
};

/** El nombre del SVG sin ruta ni extensión, y sin el hash que Vite le añade al copiarlo (`spain-circle.D8x2k.svg`). */
const slugOf = (path: string) => path.replace(/^.*\//, "").split(".")[0] as string;

/**
 * Los SVG como una sola cadena: es lo que viaja a la isla, mucho más corto que un objeto por entrada. La primera línea es
 * el prefijo que comparten todas las URL; cada una de las demás, `nombre<TAB>resto de la URL`. El nombre sale de la clave
 * (la ruta del fichero), no de la URL: Vite junta en un solo fichero los SVG idénticos (ocho iconos tienen el mismo dibujo
 * que otro) y esa URL lleva el nombre del primero.
 */
export function encodeUrls(urls: Record<string, string>): string {
	const list = Object.values(urls);
	let prefix = list[0] ?? "";
	for (const u of list) while (!u.startsWith(prefix)) prefix = prefix.slice(0, -1);
	prefix = prefix.slice(0, prefix.lastIndexOf("/") + 1);
	return [
		prefix,
		...Object.entries(urls).map(([path, url]) => `${slugOf(path)}\t${url.slice(prefix.length)}`),
	].join("\n");
}
export function decodeUrls(s: string): Record<string, string> {
	const [prefix = "", ...lines] = s.split("\n");
	return Object.fromEntries(
		lines.map((line) => {
			const [slug = "", rest = ""] = line.split("\t");
			return [slug, prefix + rest];
		}),
	);
}

/** Las categorías de los iconos de línea (categoría → nombres) como texto: `layout:a,b,c` por línea. */
export const encodeCategories = (c: Record<string, string[]>) =>
	Object.entries(c)
		.map(([k, names]) => `${k}:${names.join(",")}`)
		.join("\n");
export const decodeCategories = (s: string): Record<string, string[]> =>
	Object.fromEntries(
		s.split("\n").map((line) => {
			const i = line.indexOf(":");
			return [line.slice(0, i), line.slice(i + 1).split(",")];
		}),
	);
const byName = (a: GalleryEntry, b: GalleryEntry) => a.name.localeCompare(b.name);

/** Agrupa `[slug, url]` en entradas con `split(slug) → { name, key }`; las variantes siguen el orden de `order`. */
function group(
	files: [string, string][],
	split: (slug: string) => { name: string; key: string; groups: string[] },
	order: string[],
): GalleryEntry[] {
	const entries = new Map<string, GalleryEntry>();
	for (const [slug, url] of files) {
		const { name, key, groups } = split(slug);
		const entry = entries.get(name) ?? { name, groups, variants: [] };
		entry.variants.push({ key, slug, url });
		entries.set(name, entry);
	}
	for (const e of entries.values()) e.variants.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
	return [...entries.values()].sort(byName);
}

/**
 * Las entradas de una galería a partir de las URL de sus SVG (`import.meta.glob` con `?no-inline`, o cualquier mapa de
 * ruta a URL). `categories` son las categorías de los iconos de línea: categoría → nombres.
 */
export function buildEntries(
	kind: GalleryKind,
	urls: Record<string, string>,
	categories?: Record<string, string[]>,
): GalleryEntry[] {
	const files = Object.entries(urls).map(([path, url]) => [slugOf(path), url] as [string, string]);
	switch (kind) {
		case "icons": {
			const groupsOf = new Map<string, string[]>();
			for (const [cat, names] of Object.entries(categories ?? {}))
				for (const n of names) groupsOf.set(n, [...(groupsOf.get(n) ?? []), cat]);
			return group(files, (slug) => ({ name: slug, key: "icon", groups: groupsOf.get(slug) ?? [] }), [
				"icon",
			]);
		}
		case "flags":
			return group(
				files,
				(slug) => {
					const m = slug.match(/^(.*)-(circle|square|rectangle)$/) as RegExpMatchArray;
					return { name: m[1] as string, key: m[2] as string, groups: [] };
				},
				["circle", "square", "rectangle"],
			);
		case "payments":
			return group(
				files,
				(slug) => {
					const m = slug.match(/^(.*)-(sm|md)$/) as RegExpMatchArray;
					return { name: m[1] as string, key: m[2] as string, groups: [] };
				},
				["sm", "md"],
			);
		case "files":
			return group(
				files,
				(slug) => {
					if (slug.startsWith("folder-")) {
						const open = slug.endsWith("-open");
						return {
							name: open ? slug.slice(0, -5) : slug,
							key: open ? "open" : "closed",
							groups: ["folder"],
						};
					}
					const m = slug.match(/^(.*?)(?:-(gray|solid))?$/) as RegExpMatchArray;
					return {
						name: m[1] as string,
						key: (m[2] as string | undefined) ?? "default",
						groups: [(m[1] as string).split("-")[0] as string],
					};
				},
				["default", "gray", "solid", "closed", "open"],
			);
		case "cursors":
			return group(
				files,
				(slug) => ({
					name: slug,
					key: "icon",
					groups: [slug.startsWith("macos-") ? "macos" : "classic"],
				}),
				["icon"],
			);
	}
}

/** Las categorías que ofrece el filtro de una galería, en su orden y con sus recuentos. */
export function groupOptions(
	entries: GalleryEntry[],
	labels: Record<string, string>,
): { value: string; label: string }[] {
	return Object.entries(labels)
		.map(([value, label]) => ({
			value,
			label,
			n: entries.filter((e) => e.groups.includes(value)).length,
		}))
		.filter((g) => g.n > 0)
		.map((g) => ({ value: g.value, label: `${g.label} (${g.n})` }));
}
