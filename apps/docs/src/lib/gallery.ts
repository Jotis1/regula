// Datos de las galerías de recursos: iconos de línea, banderas y tipos de archivo de Untitled UI, y pagos y cursores de
// `@jotis-me/assets`. Es código puro, sin `fs`: la página de Astro le pasa las URL de los SVG (los de Untitled UI los
// escribe el endpoint `/icons/svg/`; los de assets los copia Vite con `import.meta.glob`) y la isla `AssetGallery`
// recibe las entradas ya agrupadas. Los logos tienen su propia galería (`LogoGallery`).

export type GalleryKind = "icons" | "flags" | "payments" | "files" | "cursors";

export interface GalleryVariant {
	/** Clave de la variante: `circle`, `md`, `gray`, `open`… (`icon` si el recurso solo tiene una). */
	key: string;
	/** Nombre del fichero SVG sin extensión (`spain-circle`). */
	slug: string;
	url: string;
}

export interface GalleryEntry {
	/** Nombre que se busca y se copia: el del icono (`SearchLg`), el código de la bandera (`es`), el método, el tipo de archivo… */
	name: string;
	/** Nombre legible que también se busca (el país en castellano). */
	title?: string;
	/** Categorías a las que pertenece (casi siempre una). */
	groups: string[];
	variants: GalleryVariant[];
}

export const pascal = (s: string) =>
	s
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("");

/** `SearchLg` → `search-lg`: cómo se escribiría con guiones, para que el buscador acepte las dos formas. */
export const kebab = (s: string) =>
	s
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/([a-zA-Z])(\d)/g, "$1-$2")
		.toLowerCase();

/** Lo que se busca en una entrada: su nombre en las dos formas y su título, sin tildes ni mayúsculas. */
export function searchText(e: GalleryEntry): string {
	return [e.name, kebab(e.name), e.title ?? ""]
		.join(" ")
		.normalize("NFD")
		.replace(/\p{M}/gu, "")
		.toLowerCase();
}
export const searchQuery = (q: string) => q.trim().normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** El componente suelto de un recurso. En los iconos de línea el nombre del archivo ya es el del componente. */
export function componentName(kind: GalleryKind, slug: string): string {
	switch (kind) {
		case "icons":
			return slug;
		case "flags":
			return `Flag${pascal(slug)}`;
		case "payments":
			return `Payment${pascal(slug)}`;
		case "cursors":
			return `Cursor${pascal(slug)}`;
		case "files":
			return "FileIcon";
	}
}

/** Los iconos de archivo se pintan con un solo componente: `<FileIcon type="pdf" variant="gray" />`. */
export function fileIconTag(type: string, key: string, extra = ""): string {
	return `<FileIcon type="${type}"${key === "default" ? "" : ` variant="${key}"`}${extra} />`;
}

/** De dónde se importan los componentes de cada set. */
export const importPath = (kind: GalleryKind) =>
	kind === "icons"
		? "@untitledui/icons"
		: kind === "flags"
			? "@untitledui/country-flags"
			: kind === "files"
				? "@untitledui/file-icons"
				: `@jotis-me/assets/${kind}`;

/** Ruta del SVG dentro de `@jotis-me/assets`, para importarlo con `?raw` en Astro (solo pagos y cursores). */
export const svgModule = (kind: GalleryKind, slug: string) => `@jotis-me/assets/${kind}/${slug}.svg`;

/** Los recursos que son un fichero SVG del paquete `@jotis-me/assets` (los demás son componentes de Untitled UI). */
export const hasSvgModule = (kind: GalleryKind) => kind === "payments" || kind === "cursors";

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
};

/** Tipos que acepta `FileIcon` (la lista del paquete, que no la exporta en ejecución), con su categoría. */
export const FILE_GROUP: Record<string, string> = {
	audio: "media",
	mp3: "media",
	wav: "media",
	video: "media",
	"video-01": "media",
	"video-02": "media",
	avi: "media",
	mkv: "media",
	mp4: "media",
	mpeg: "media",
	image: "image",
	img: "image",
	gif: "image",
	jpeg: "image",
	jpg: "image",
	png: "image",
	svg: "image",
	tiff: "image",
	webp: "image",
	document: "document",
	doc: "document",
	docx: "document",
	pdf: "document",
	"pdf-simple": "document",
	ppt: "document",
	pptx: "document",
	txt: "document",
	spreadsheets: "document",
	csv: "document",
	xls: "document",
	xlsx: "document",
	aep: "design",
	ai: "design",
	eps: "design",
	fig: "design",
	indd: "design",
	psd: "design",
	code: "development",
	css: "development",
	html: "development",
	java: "development",
	js: "development",
	json: "development",
	rss: "development",
	sql: "development",
	xml: "development",
	dmg: "development",
	exe: "development",
	rar: "archive",
	zip: "archive",
	empty: "generic",
	folder: "generic",
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
/** Los nombres de las banderas (código → país) como texto: `es:España` por línea. */
export const encodeTitles = (t: Record<string, string>) =>
	Object.entries(t)
		.map(([k, v]) => `${k}:${v}`)
		.join("\n");
export const decodeTitles = (s: string): Record<string, string> =>
	Object.fromEntries(
		s.split("\n").map((line) => {
			const i = line.indexOf(":");
			return [line.slice(0, i), line.slice(i + 1)];
		}),
	);
const byName = (a: GalleryEntry, b: GalleryEntry) => a.name.localeCompare(b.name);

/** Agrupa `[slug, url]` en entradas con `split(slug) → { name, key }`; las variantes siguen el orden de `order`. */
function group(
	files: [string, string][],
	split: (slug: string) => { name: string; key: string; groups: string[]; title?: string },
	order: string[],
): GalleryEntry[] {
	const entries = new Map<string, GalleryEntry>();
	for (const [slug, url] of files) {
		const { name, key, groups, title } = split(slug);
		const entry = entries.get(name) ?? { name, groups, variants: [], ...(title ? { title } : {}) };
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
	titles?: Record<string, string>,
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
				(slug) => ({ name: slug, key: "circle", groups: [], title: titles?.[slug] }),
				["circle"],
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
					const m = slug.match(/^(.*?)(?:-(gray|solid))?$/) as RegExpMatchArray;
					return {
						name: m[1] as string,
						key: (m[2] as string | undefined) ?? "default",
						groups: [FILE_GROUP[m[1] as string] ?? "generic"],
					};
				},
				["default", "gray", "solid"],
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

/** Un set de `/icons/`: las cinco galerías de `AssetGallery` y la de logos. */
export type IconSet = GalleryKind | "logos";

/** Los seis sets, en el orden de su navegación, cada uno en su URL. */
export const ICON_SETS: { id: IconSet; label: string; href: string }[] = [
	{ id: "icons", label: "De línea", href: "/icons/" },
	{ id: "logos", label: "Logos", href: "/icons/logos/" },
	{ id: "flags", label: "Banderas", href: "/icons/flags/" },
	{ id: "payments", label: "Pagos", href: "/icons/payments/" },
	{ id: "files", label: "Archivos", href: "/icons/files/" },
	{ id: "cursors", label: "Cursores", href: "/icons/cursors/" },
];

/** Los elementos de la navegación de sets (`Tabs` con `href`), cada uno con su recuento. */
export const setTabs = (counts: Record<IconSet, number>) =>
	ICON_SETS.map((s) => ({ ...s, count: counts[s.id] }));

/**
 * Cuántos logos enseña la galería entre los SVG de `@jotis-me/assets/logos`: los de apps, integraciones y redes (las
 * insignias de tiendas, `store`, son de `AppStoreBadge`), y la versión gris de un logo no cuenta aparte.
 */
export const countLogos = (paths: string[]) =>
	new Set(
		paths.flatMap((p) => {
			const m = p.match(/logos\/(app|integration|social)\/(.+?)(-gray)?\.svg$/);
			return m ? [`${m[1]}/${m[2]}`] : [];
		}),
	).size;

/** El nombre legible de las categorías de cada galería (sin recuento), para la etiqueta del panel. */
export const CATEGORY_LABELS: Partial<Record<GalleryKind, Record<string, string>>> = {
	icons: ICON_CATEGORIES,
	files: FILE_CATEGORIES,
	cursors: CURSOR_CATEGORIES,
};
