// Galería de recursos: iconos de línea, banderas y tipos de archivo de Untitled UI, y métodos de pago y cursores de
// `@jotis-me/assets`. Una sola isla para los cinco: una fila de filtros (buscador por nombre, categoría, tamaño o
// variante de la vista previa y recuento), la rejilla de `IconTile` y el panel del elegido con sus tamaños o variantes y
// su código (componente React, SVG importado cuando el recurso es de assets, y SVG en bruto). El panel y la hoja inferior
// de móvil son de `GalleryShell`.
//
// No lleva ningún dibujo dentro: recibe las URL de los SVG que el build copia como ficheros y los pinta como `<img>`
// perezosas (el nodo que recibe `IconTile`), así que la isla pesa lo mismo con 50 recursos que con 1.181. La rejilla
// enseña los primeros y «Mostrar más» añade más: ni el HTML ni las peticiones crecen con el set. Los iconos de línea son
// negros (`currentColor` no llega a una `<img>`): en oscuro se invierten.
import { Button, ButtonGroup, IconTile, Input, Select } from "@jotis-me/react";
import { SearchMd } from "@untitledui/icons";
import { useEffect, useMemo, useState } from "react";
import {
	buildEntries,
	CATEGORY_LABELS,
	componentName,
	decodeCategories,
	decodeTitles,
	decodeUrls,
	fileIconTag,
	type GalleryEntry,
	type GalleryKind,
	type GalleryVariant,
	hasSvgModule,
	importPath,
	searchQuery,
	searchText,
	svgModule,
	variantLabel,
} from "../lib/gallery";
import {
	type Chosen,
	focusTile,
	GalleryEmpty,
	GalleryShell,
	isCompact,
	TILE_GRID,
	tileFit,
	useSvg,
} from "./GalleryShell";

/** Cuántos recursos enseña la rejilla de entrada y cuántos más añade «Mostrar más». */
const FIRST = 96;
const MORE = 240;

const ICON_SIZES = [16, 20, 24] as const;
type IconSize = (typeof ICON_SIZES)[number];

interface Config {
	idPrefix: string;
	noun: string;
	searchLabel: string;
	emptyText: string;
	asideLabel: string;
	/** Nombre del filtro por categoría y el texto de su opción «todas». */
	filterLabel: string;
	filterAll: string;
	/** Variantes que se pueden elegir para la vista previa de la rejilla (la clave, el texto del botón). */
	previews?: { label: string; keys: string[] };
	/** Alto de la imagen en la rejilla. */
	tileHeight: (variant: GalleryVariant, size: number) => number;
	/** Alto de cada variante en la lista del panel; con una sola variante, los tamaños en que se enseña. */
	panelHeight: (variant: GalleryVariant) => number;
	sizes: number[];
	note: string;
}

const CONFIG: Record<GalleryKind, Config> = {
	icons: {
		idPrefix: "icon",
		noun: "iconos",
		searchLabel: "Buscar icono",
		emptyText:
			"Ningún icono se llama así. Prueba con otra palabra, en inglés (los nombres son los de Untitled UI), o quita el filtro de categoría.",
		asideLabel: "Icono elegido",
		filterLabel: "Categoría",
		filterAll: "Todas las categorías",
		tileHeight: (_v, size) => size,
		panelHeight: () => 24,
		sizes: [16, 20, 24, 32],
		note: "",
	},
	flags: {
		idPrefix: "flag",
		noun: "banderas",
		searchLabel: "Buscar bandera",
		emptyText:
			"Ningún país se llama así. Prueba con su nombre en castellano o con su código: españa, japón, es, jp…",
		asideLabel: "Bandera elegida",
		filterLabel: "",
		filterAll: "",
		tileHeight: () => 24,
		panelHeight: () => 24,
		sizes: [16, 20, 24, 32],
		note: "Cada bandera es un componente con el código ISO de su país. Sin aria-label es decorativa; si va sola, dale nombre.",
	},
	payments: {
		idPrefix: "payment",
		noun: "métodos de pago",
		searchLabel: "Buscar método de pago",
		emptyText:
			"Ningún método se llama así. Prueba con su nombre en minúsculas: visa, mastercard, stripe…",
		asideLabel: "Método de pago elegido",
		filterLabel: "",
		filterAll: "",
		previews: { label: "Tamaño", keys: ["sm", "md"] },
		tileHeight: (v) => (v.key === "sm" ? 24 : 32),
		panelHeight: (v) => (v.key === "sm" ? 24 : 32),
		sizes: [],
		note: "Cada marca es de su dueño: úsala para representar el método de pago, sin cambiar su forma ni sus colores.",
	},
	files: {
		idPrefix: "file",
		noun: "iconos de archivo",
		searchLabel: "Buscar tipo de archivo",
		emptyText:
			"Ningún icono se llama así. Prueba con la extensión en minúsculas (pdf, docx, json…) o quita el filtro de tipo.",
		asideLabel: "Icono de archivo elegido",
		filterLabel: "Tipo",
		filterAll: "Todos los tipos",
		previews: { label: "Estilo", keys: ["default", "gray", "solid"] },
		tileHeight: () => 40,
		panelHeight: () => 40,
		sizes: [],
		note: "Un solo componente, FileIcon, con type, variant (default, gray o solid) y theme (light o dark). Acepta también un tipo MIME (video/mp4).",
	},
	cursors: {
		idPrefix: "cursor",
		noun: "cursores",
		searchLabel: "Buscar cursor",
		emptyText:
			"Ningún cursor se llama así. Prueba con otra palabra (hand, resize, zoom, text…) o quita el filtro de estilo.",
		asideLabel: "Cursor elegido",
		filterLabel: "Estilo",
		filterAll: "Todos los estilos",
		tileHeight: () => 32,
		panelHeight: () => 32,
		sizes: [20, 32, 40],
		note: "El SVG no lleva el punto activo del cursor: lo pones tú en la regla de CSS, tras la URL. Los cursores de macOS 26 son más grandes que 20 × 20 cuando su dibujo sobresale.",
	},
};

/** Una imagen decorativa: el nombre va en el texto de la baldosa o en el título del panel. */
function Img({
	url,
	height,
	line,
}: {
	url: string;
	height: number;
	/** Icono de línea: negro de origen, así que en oscuro se invierte. */
	line?: boolean;
}) {
	return (
		<img
			src={url}
			alt=""
			height={height}
			loading="lazy"
			decoding="async"
			className={line ? "opacity-90 [.dark-mode_&]:invert" : undefined}
			style={{ height, width: "auto", maxWidth: "100%" }}
		/>
	);
}

/** El código del recurso: el componente (de Untitled UI o de assets), el SVG importado (solo assets) y el SVG en bruto. */
export function assetCode(
	kind: GalleryKind,
	entry: GalleryEntry,
	svg: string | null,
	preview: GalleryVariant,
) {
	const components = entry.variants.map((v) => componentName(kind, v.slug));
	const first = components[0] as string;
	const label = entry.title ?? entry.name;
	let react: string;
	if (kind === "icons") {
		react = `import { ${first} } from "${importPath(kind)}";\n\n<${first} size={20} />\n\n// con nombre accesible, si va sola\n<${first} size={20} role="img" aria-label="${entry.name}" aria-hidden={undefined} />`;
	} else if (kind === "files") {
		react = `import { FileIcon } from "${importPath(kind)}";\n\n${entry.variants.map((v) => fileIconTag(entry.name, v.key, " size={40}")).join("\n")}`;
	} else if (kind === "flags") {
		react = `import { ${first} } from "${importPath(kind)}";\n\n<${first} size={24} />\n\n// con nombre accesible, si va sola\n<${first} size={24} role="img" aria-label="${label}" aria-hidden={undefined} />`;
	} else {
		const tag = (c: string) => `<${c} size={24} title="${entry.name}" />`;
		react = `import { ${[...new Set(components)].join(", ")} } from "${importPath(kind)}";\n\n${components.map(tag).join("\n")}`;
	}
	const mod = hasSvgModule(kind) ? svgModule(kind, preview.slug) : "";
	const tabs = [{ label: "React", code: react }];
	if (hasSvgModule(kind))
		tabs.push({
			label: "Importar SVG",
			code: `---\nimport svg from "${mod}?raw";\n---\n\n<Fragment set:html={svg} />`,
		});
	tabs.push({ label: "SVG", code: svg ?? "Cargando…" });
	if (kind === "cursors")
		tabs.push({
			label: "CSS",
			code: `/* El punto activo (6 4) lo eliges tú */\n.arrastrable {\n  cursor: url("${mod}") 6 4, grab;\n}`,
		});
	return tabs;
}

/** Lo que enseña el panel del elegido: el dibujo grande, sus tamaños o variantes, el código y la nota del set. */
function chosenOf(
	kind: GalleryKind,
	entry: GalleryEntry,
	preview: GalleryVariant,
	svg: string | null,
): Chosen {
	const c = CONFIG[kind];
	const line = kind === "icons";
	const group = entry.groups[0];
	const variants = entry.variants.length > 1;
	return {
		name: entry.name,
		subtitle: entry.title,
		badge: group ? CATEGORY_LABELS[kind]?.[group] : undefined,
		big: <Img url={preview.url} height={64} line={line} />,
		samplesLabel: variants ? "Variantes" : "Tamaños",
		samples: variants
			? entry.variants.map((v) => ({
					label: variantLabel(v.key),
					node: <Img url={v.url} height={c.panelHeight(v)} />,
				}))
			: c.sizes.map((s) => ({
					label: `${s} px`,
					node: <Img url={preview.url} height={s} line={line} />,
				})),
		tabs: assetCode(kind, entry, svg, preview),
		note: line ? (
			<>
				Un icono sin texto necesita <code className="font-mono">aria-label</code>. Como{" "}
				<code className="font-mono">&lt;img&gt;</code> no hereda el color: el SVG del paquete usa{" "}
				<code className="font-mono">currentColor</code>, así que va en línea o con{" "}
				<code className="font-mono">mask-image</code>.
			</>
		) : (
			c.note
		),
	};
}

export interface AssetGalleryProps {
	kind: GalleryKind;
	/** Las URL de los SVG, una por línea (`encodeUrls`): la isla no recibe un objeto por recurso. */
	urls: string;
	/** Solo para `icons`: categoría → nombres, codificado (`encodeCategories`). */
	categories?: string;
	/** Opciones del filtro por categoría (sin «todas»); sin ellas no hay filtro. */
	groups?: { value: string; label: string }[];
	/** Solo para `flags`: el nombre de cada país en castellano, codificado (`encodeTitles`). */
	titles?: string;
	/** Nombre elegido de entrada. */
	initial?: string;
}

export default function AssetGallery({ kind, urls, categories, groups, titles, initial }: AssetGalleryProps) {
	const c = CONFIG[kind];
	const entries = useMemo(
		() =>
			buildEntries(
				kind,
				decodeUrls(urls),
				categories ? decodeCategories(categories) : undefined,
				titles ? decodeTitles(titles) : undefined,
			),
		[kind, urls, categories, titles],
	);
	const [query, setQuery] = useState("");
	const [group, setGroup] = useState("all");
	const [size, setSize] = useState<IconSize>(24);
	const [previewKey, setPreviewKey] = useState(c.previews?.keys[0] ?? "");
	const [limit, setLimit] = useState(FIRST);
	const [selected, setSelected] = useState(
		() => entries.find((e) => e.name === initial) ?? (entries[0] as GalleryEntry),
	);
	const [sheetOpen, setSheetOpen] = useState(false);
	const q = searchQuery(query);
	const matches = entries.filter(
		(e) => (group === "all" || e.groups.includes(group)) && searchText(e).includes(q),
	);
	const shown = matches.slice(0, limit);
	const total = entries.length;
	const noun = c.noun;
	const searchId = `${c.idPrefix}-search`;

	// `/icons/?icono=calendar`: llega desde la búsqueda (Ctrl+K) con el icono ya filtrado y elegido
	useEffect(() => {
		if (kind !== "icons") return;
		const wanted = new URLSearchParams(location.search).get("icono");
		const hit = wanted ? entries.find((e) => e.name === wanted) : undefined;
		if (hit) {
			setQuery(hit.name);
			setSelected(hit);
		}
	}, [kind, entries]);

	// Cambiar el filtro vuelve a empezar por el principio de la lista
	// biome-ignore lint/correctness/useExhaustiveDependencies: se reinicia al cambiar la búsqueda o la categoría
	useEffect(() => setLimit(FIRST), [q, group]);

	const variantOf = (e: GalleryEntry, key: string) =>
		e.variants.find((v) => v.key === key) ?? (e.variants[0] as GalleryVariant);
	const pick = (e: GalleryEntry) => {
		setSelected(e);
		// En móvil el panel no está a la vista: se abre como hoja inferior, y al cerrarse el foco vuelve a la baldosa
		if (isCompact()) {
			focusTile("data-item", e.name);
			setSheetOpen(true);
		}
	};
	const preview = variantOf(selected, previewKey);
	const svg = useSvg(preview.url);
	const hasMore = shown.length < matches.length;

	return (
		<GalleryShell
			idPrefix={c.idPrefix}
			count={matches.length === total ? `${total} ${noun}` : `${matches.length} de ${total}`}
			asideLabel={c.asideLabel}
			chosen={chosenOf(kind, selected, preview, svg)}
			sheetOpen={sheetOpen}
			onSheetClose={() => setSheetOpen(false)}
			filters={
				<>
					<div className="min-w-50 max-w-90 flex-[1_1_100%] sm:flex-1">
						<Input
							id={searchId}
							aria-label={c.searchLabel}
							icon={SearchMd}
							type="search"
							autoComplete="off"
							placeholder={`Buscar entre ${total} ${noun}`}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
					</div>
					{groups ? (
						<div className="w-full sm:w-55">
							<Select
								aria-label={c.filterLabel}
								options={[{ value: "all", label: c.filterAll }, ...groups]}
								value={group}
								onChange={setGroup}
							/>
						</div>
					) : null}
					{c.previews ? (
						<ButtonGroup
							className="max-sm:hidden"
							aria-label={`${c.previews.label} de la vista previa`}
							value={previewKey}
							onChange={setPreviewKey}
							items={c.previews.keys.map((k) => ({ value: k, label: variantLabel(k) }))}
						/>
					) : null}
					{kind === "icons" ? (
						<ButtonGroup
							className="max-sm:hidden"
							aria-label="Tamaño de la vista previa"
							value={String(size)}
							onChange={(v) => setSize(Number(v) as IconSize)}
							items={ICON_SIZES.map((s) => ({ value: String(s), label: String(s) }))}
						/>
					) : null}
				</>
			}
		>
			<ul aria-label={c.noun.charAt(0).toUpperCase() + c.noun.slice(1)} className={TILE_GRID}>
				{shown.map((e) => {
					const v = variantOf(e, previewKey);
					const height = c.tileHeight(v, size);
					return (
						<li key={e.name} data-item={e.name}>
							<IconTile
								icon={<Img url={v.url} height={height} line={kind === "icons"} />}
								label={e.name}
								size={kind === "icons" ? size : 24}
								selected={e.name === selected.name}
								onSelect={() => pick(e)}
								className={tileFit(height)}
							/>
						</li>
					);
				})}
			</ul>
			{matches.length === 0 && (
				<GalleryEmpty
					query={query.trim()}
					description={c.emptyText}
					onClear={() => {
						setQuery("");
						document.getElementById(searchId)?.focus();
					}}
				/>
			)}
			{hasMore && (
				<div className="flex flex-col items-center gap-2 pt-8">
					<p className="m-0 text-sm text-tertiary tabular-nums">
						Mostrando {shown.length} de {matches.length} {noun}
					</p>
					<Button
						hierarchy="secondary"
						id={`${c.idPrefix}-more`}
						onClick={() => setLimit((n) => n + MORE)}
					>
						Mostrar más
					</Button>
				</div>
			)}
		</GalleryShell>
	);
}
