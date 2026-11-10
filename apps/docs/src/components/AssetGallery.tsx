// Galería de recursos de `@jotis-me/icons`: iconos de línea, banderas, métodos de pago, iconos de archivo y cursores. Una
// sola isla para los cinco: buscador por nombre, filtro por categoría, vista previa por variante, recuento y el panel
// del elegido con sus variantes y su código (componente React, SVG importado y SVG en bruto). En escritorio el panel va a
// la derecha; en móvil se abre como hoja inferior (`<dialog>` modal: foco atrapado, Escape y foco de vuelta).
//
// No lleva ningún dibujo dentro: recibe las URL de los SVG que el build copia como ficheros y los pinta como `<img>`
// perezosas, así que la isla pesa lo mismo con 50 recursos que con 1.172. La rejilla enseña los primeros y «Mostrar más»
// añade más: ni el HTML ni las peticiones crecen con el set. Los iconos de línea son negros (`currentColor` no llega a una
// `<img>`): en oscuro se invierten.
import { Button, ButtonGroup, CodeSnippet, EmptyState, Input, Select } from "@jotis-me/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	buildEntries,
	componentName,
	decodeCategories,
	decodeUrls,
	type GalleryEntry,
	type GalleryKind,
	type GalleryVariant,
	importPath,
	svgModule,
	variantLabel,
} from "../lib/gallery";

/** Cuántos recursos enseña la rejilla de entrada y cuántos más añade «Mostrar más». */
const FIRST = 96;
const MORE = 240;

const ICON_SIZES = ["16", "20", "24"] as const;
/** Uso por contexto, de la guía (Iconografía): el tamaño según dónde va. */
const CONTEXTS = [
	{ label: "Botón e input", size: "20 px" },
	{ label: "xs y menús", size: "16 px" },
	{ label: "Navegación", size: "24 px" },
];

interface Config {
	idPrefix: string;
	noun: string;
	one: string;
	searchLabel: string;
	placeholder: string;
	emptyTitle: string;
	emptyText: string;
	asideLabel: string;
	filterLabel: string;
	/** Variantes que se pueden elegir para la vista previa de la rejilla (la clave, el texto del botón). */
	previews?: { label: string; keys: string[] };
	/** Alto de la imagen en la rejilla y en el panel. */
	tileHeight: (variant: GalleryVariant, size: number) => number;
	panelHeight: (variant: GalleryVariant) => number;
	note: string;
}

const CONFIG: Record<GalleryKind, Config> = {
	icons: {
		idPrefix: "icon",
		noun: "iconos",
		one: "icono",
		searchLabel: "Buscar icono",
		placeholder: "calendar, arrow, trash…",
		emptyTitle: "Ese icono no está en el set",
		emptyText:
			"Ningún icono se llama así. Prueba con otra palabra, en inglés: los nombres son los del Figma.",
		asideLabel: "Icono elegido",
		filterLabel: "Categoría",
		tileHeight: (_v, size) => size,
		panelHeight: () => 48,
		note: "",
	},
	flags: {
		idPrefix: "flag",
		noun: "banderas",
		one: "bandera",
		searchLabel: "Buscar bandera",
		placeholder: "spain, japan, scotland…",
		emptyTitle: "Esa bandera no está",
		emptyText:
			"Ningún país ni región se llama así. Prueba con su nombre en inglés, en minúsculas: spain, united-kingdom…",
		asideLabel: "Bandera elegida",
		filterLabel: "",
		previews: { label: "Forma", keys: ["circle", "square", "rectangle"] },
		tileHeight: () => 28,
		panelHeight: () => 48,
		note: "El nombre es el del país o la región, no el código ISO: Portugal y las Azores comparten PT, y 11 regiones no tienen código. Sin title la bandera es decorativa; si va sola, dale nombre.",
	},
	payments: {
		idPrefix: "payment",
		noun: "métodos de pago",
		one: "método de pago",
		searchLabel: "Buscar método de pago",
		placeholder: "visa, paypal, apple-pay…",
		emptyTitle: "Ese método de pago no está",
		emptyText:
			"Ningún método se llama así. Prueba con su nombre en minúsculas: visa, mastercard, stripe…",
		asideLabel: "Método de pago elegido",
		filterLabel: "",
		previews: { label: "Tamaño", keys: ["sm", "md"] },
		tileHeight: (v) => (v.key === "sm" ? 24 : 32),
		panelHeight: (v) => (v.key === "sm" ? 48 : 64),
		note: "Cada marca es de su dueño: úsala para representar el método de pago, sin cambiar su forma ni sus colores.",
	},
	files: {
		idPrefix: "file",
		noun: "iconos de archivo",
		one: "icono de archivo",
		searchLabel: "Buscar tipo de archivo",
		placeholder: "pdf, png, zip…",
		emptyTitle: "Ese tipo de archivo no está",
		emptyText: "Ningún icono se llama así. Prueba con la extensión en minúsculas: pdf, docx, json…",
		asideLabel: "Icono de archivo elegido",
		filterLabel: "Tipo",
		previews: { label: "Estilo", keys: ["default", "gray", "solid"] },
		tileHeight: (v) => (v.slug.startsWith("folder-") ? 48 : 40),
		panelHeight: (v) => (v.slug.startsWith("folder-") ? 72 : 64),
		note: "Los tipos de archivo vienen en default, gray y solid; las carpetas, cerradas y abiertas. Las carpetas noise y transparent llevan una textura PNG dentro del SVG.",
	},
	cursors: {
		idPrefix: "cursor",
		noun: "cursores",
		one: "cursor",
		searchLabel: "Buscar cursor",
		placeholder: "hand-grab, resize, zoom…",
		emptyTitle: "Ese cursor no está",
		emptyText: "Ningún cursor se llama así. Prueba con otra palabra: hand, resize, zoom, text…",
		asideLabel: "Cursor elegido",
		filterLabel: "Estilo",
		tileHeight: () => 32,
		panelHeight: () => 64,
		note: "El SVG no lleva el punto activo del cursor: lo pones tú en la regla de CSS, tras la URL. Los cursores de macOS 26 son más grandes que 20 × 20 cuando su dibujo sobresale.",
	},
};

/** Una imagen decorativa: el nombre va en el texto del botón o en el título del panel. */
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

/** El código del recurso: el componente de `@jotis-me/icons`, el SVG importado (Astro sin React) y el SVG en bruto. */
export function assetCode(
	kind: GalleryKind,
	entry: GalleryEntry,
	svg: string | null,
	core: boolean,
	preview: GalleryVariant,
) {
	const components = entry.variants.map((v) => componentName(kind, v.slug));
	const first = components[0] as string;
	const imports = components.join(", ");
	const tag = (c: string) => `<${c} size={24} title="${entry.name}" />`;
	let react = `import { ${imports} } from "${importPath(kind)}";\n\n${components.map(tag).join("\n")}`;
	if (kind === "icons") {
		react = core
			? `import { Icon, ${first} } from "@jotis-me/icons";\n\n<${first} size={20} />\n\n// o por nombre, entre los 83 del núcleo\n<Icon name="${entry.name}" size={20} />`
			: `import { ${first} } from "@jotis-me/icons";\n\n<${first} size={20} />`;
	}
	const mod = svgModule(kind, preview.slug);
	const tabs = [
		{ label: "React", code: react },
		{
			label: "Importar SVG",
			code: `---\nimport svg from "${mod}?raw";\n---\n\n<Fragment set:html={svg} />`,
		},
		{ label: "SVG", code: svg ?? "Cargando…" },
	];
	if (kind === "cursors")
		tabs.push({
			label: "CSS",
			code: `/* El punto activo (6 4) lo eliges tú */\n.arrastrable {\n  cursor: url("${mod}") 6 4, grab;\n}`,
		});
	return tabs;
}

function Panel({
	kind,
	entry,
	preview,
	core,
	onClose,
}: {
	kind: GalleryKind;
	entry: GalleryEntry;
	preview: GalleryVariant;
	core: boolean;
	onClose?: () => void;
}) {
	const c = CONFIG[kind];
	const [svg, setSvg] = useState<string | null>(null);
	useEffect(() => {
		setSvg(null);
		let alive = true;
		fetch(preview.url)
			.then((r) => r.text())
			.then((t) => {
				if (!alive) return;
				const text = t.trim();
				// Las carpetas con textura llevan un PNG de decenas de kB en base64: no cabe en un fragmento
				setSvg(
					text.length > 4000
						? `${text.slice(0, 3000)}\n<!-- … el resto del SVG está en el fichero -->`
						: text,
				);
			})
			.catch(() => alive && setSvg("No se pudo cargar el SVG."));
		return () => {
			alive = false;
		};
	}, [preview.url]);
	const line = kind === "icons";
	const components = entry.variants.map((v) => componentName(kind, v.slug));
	return (
		<div className="flex flex-col">
			<div className="flex min-h-42 flex-wrap items-center justify-center gap-x-8 gap-y-4 bg-secondary px-4 py-6 text-fg-primary shadow-[inset_0_-1px_0_var(--border-secondary)]">
				{line
					? [16, 20, 24, 48].map((s) => <Img key={s} url={preview.url} height={s} line />)
					: entry.variants.map((v) => (
							<figure key={v.slug} className="m-0 flex flex-col items-center gap-2">
								<Img url={v.url} height={c.panelHeight(v)} />
								{entry.variants.length > 1 ? (
									<figcaption className="text-xs text-tertiary">
										{variantLabel(v.key)}
									</figcaption>
								) : null}
							</figure>
						))}
			</div>
			<div className="flex flex-col gap-4 p-5">
				<div className="flex items-start gap-3">
					<div className="min-w-0 grow">
						<h2
							id={onClose ? `${c.idPrefix}-sheet-name` : `${c.idPrefix}-detail-name`}
							className="break-words font-mono text-md font-semibold text-primary"
						>
							{entry.name}
						</h2>
						<p className="mt-0.5 text-[13px] leading-5 text-tertiary">
							React:{" "}
							{components.map((name, i) => (
								<span key={name}>
									{i > 0 ? ", " : ""}
									<code className="font-mono text-xs font-medium text-secondary">
										{name}
									</code>
								</span>
							))}
						</p>
					</div>
					<Button hierarchy="secondary" size="sm" iconLeading="copy-01" data-copy={entry.name}>
						Copiar nombre
					</Button>
					{onClose && (
						<Button
							hierarchy="tertiary"
							size="sm"
							iconOnly="x-close"
							label="Cerrar"
							onClick={onClose}
						/>
					)}
				</div>
				{line && (
					<dl className="grid grid-cols-3 gap-2 text-xs">
						{CONTEXTS.map((x) => (
							<div key={x.label} className="rounded-md bg-secondary px-2.5 py-2">
								<dt className="text-tertiary">{x.label}</dt>
								<dd className="font-semibold text-primary">{x.size}</dd>
							</div>
						))}
					</dl>
				)}
			</div>
			<CodeSnippet
				className="rounded-none shadow-none"
				lineNumbers={false}
				tabs={assetCode(kind, entry, svg, core, preview)}
			/>
			<p className="px-5 py-3.5 text-xs text-tertiary shadow-[inset_0_1px_0_var(--border-secondary)]">
				{line ? (
					<>
						Un icono sin texto necesita <code className="font-mono">title</code>. Como{" "}
						<code className="font-mono">&lt;img&gt;</code> no hereda el color: el SVG del paquete
						usa <code className="font-mono">currentColor</code>, así que va en línea o con{" "}
						<code className="font-mono">mask-image</code>.
					</>
				) : (
					c.note
				)}
			</p>
		</div>
	);
}

export interface AssetGalleryProps {
	kind: GalleryKind;
	/** Las URL de los SVG, una por línea (`encodeUrls`): la isla no recibe un objeto por recurso. */
	urls: string;
	/** Solo para `icons`: categoría → nombres, codificado (`encodeCategories`). */
	categories?: string;
	/** Opciones del filtro por categoría (sin «todas»); sin ellas no hay filtro. */
	groups?: { value: string; label: string }[];
	/** Solo para `icons`: los nombres que acepta `<Icon name>` (el núcleo). */
	core?: string[];
	/** Nombre elegido de entrada. */
	initial?: string;
}

export default function AssetGallery({
	kind,
	urls,
	categories,
	groups,
	core = [],
	initial,
}: AssetGalleryProps) {
	const c = CONFIG[kind];
	const entries = useMemo(
		() => buildEntries(kind, decodeUrls(urls), categories ? decodeCategories(categories) : undefined),
		[kind, urls, categories],
	);
	const [query, setQuery] = useState("");
	const [group, setGroup] = useState("all");
	const [size, setSize] = useState<(typeof ICON_SIZES)[number]>("24");
	const [previewKey, setPreviewKey] = useState(c.previews?.keys[0] ?? "");
	const [limit, setLimit] = useState(FIRST);
	const [selected, setSelected] = useState(
		() => entries.find((e) => e.name === initial) ?? (entries[0] as GalleryEntry),
	);
	const sheet = useRef<HTMLDialogElement>(null);
	const q = query.trim().toLowerCase();
	const matches = entries.filter(
		(e) => (group === "all" || e.groups.includes(group)) && e.name.includes(q),
	);
	const shown = matches.slice(0, limit);
	const total = entries.length;
	const noun = c.noun;

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
		// En móvil el panel no está a la vista: se abre como hoja inferior
		if (matchMedia("(max-width: 1023px)").matches) sheet.current?.showModal();
	};
	const preview = variantOf(selected, previewKey);
	const hasMore = shown.length < matches.length;

	return (
		<div className="flex flex-col gap-7">
			<div className="flex flex-wrap items-end gap-x-6 gap-y-4">
				<div className="max-w-110 flex-[1_1_320px]">
					<Input
						id={`${c.idPrefix}-search`}
						label={c.searchLabel}
						icon="search-md"
						type="search"
						autoComplete="off"
						placeholder={c.placeholder}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
				{groups ? (
					<div className="w-60 max-w-full">
						<Select
							label={c.filterLabel}
							options={[{ value: "all", label: "Todos" }, ...groups]}
							value={group}
							onChange={setGroup}
						/>
					</div>
				) : null}
				{c.previews ? (
					<div className="hidden flex-col gap-1.5 sm:flex">
						<span aria-hidden="true" className="text-sm font-medium text-secondary">
							{c.previews.label}
						</span>
						<ButtonGroup
							aria-label={`${c.previews.label} de la vista previa`}
							value={previewKey}
							onChange={setPreviewKey}
							items={c.previews.keys.map((k) => ({ value: k, label: variantLabel(k) }))}
						/>
					</div>
				) : null}
				{kind === "icons" ? (
					<div className="hidden flex-col gap-1.5 sm:flex">
						<span aria-hidden="true" className="text-sm font-medium text-secondary">
							Tamaño
						</span>
						<ButtonGroup
							aria-label="Tamaño de vista previa"
							value={size}
							onChange={(v) => setSize(v as (typeof ICON_SIZES)[number])}
							items={ICON_SIZES.map((s) => ({ value: s, label: s }))}
						/>
					</div>
				) : null}
				<div className="hidden grow sm:block" />
				<p
					id={`${c.idPrefix}-count`}
					role="status"
					className="mb-2.5 text-sm text-tertiary tabular-nums"
				>
					{matches.length === total ? `${total} ${noun}` : `${matches.length} de ${total}`}
				</p>
			</div>

			<div className="flex items-start gap-6">
				<div className="min-w-0 flex-1">
					<ul
						aria-label={c.noun.charAt(0).toUpperCase() + c.noun.slice(1)}
						className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(112px,1fr))]"
					>
						{shown.map((e) => {
							const v = variantOf(e, previewKey);
							return (
								<li key={e.name} data-item={e.name}>
									<button
										type="button"
										data-select={e.name}
										aria-pressed={e.name === selected.name}
										onClick={() => pick(e)}
										className="flex h-full w-full flex-col items-center justify-between gap-3 rounded-lg px-2 py-4 text-fg-secondary shadow-[inset_0_0_0_1px_var(--border-secondary)] transition-colors duration-100 hover:bg-primary_hover focus-visible:shadow-focus-ring focus-visible:outline-none aria-pressed:bg-secondary_hover aria-pressed:text-fg-primary aria-pressed:shadow-[inset_0_0_0_2px_var(--border-brand)]"
									>
										<span className="flex min-h-12 items-center">
											<Img
												url={v.url}
												height={c.tileHeight(v, Number(size))}
												line={kind === "icons"}
											/>
										</span>
										<span className="w-full truncate text-center font-mono text-[11px] leading-4 text-tertiary">
											{e.name}
										</span>
									</button>
								</li>
							);
						})}
					</ul>
					{matches.length === 0 && (
						<div className="py-12">
							<EmptyState icon="search-lg" title={c.emptyTitle} description={c.emptyText} />
						</div>
					)}
					{hasMore && (
						<div className="flex flex-col items-center gap-2 pt-8">
							<p className="text-sm text-tertiary tabular-nums">
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
				</div>
				<aside
					aria-label={c.asideLabel}
					className="sticky top-6 hidden w-95 flex-none overflow-hidden rounded-xl bg-primary_alt shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)] lg:block"
				>
					<Panel
						kind={kind}
						entry={selected}
						preview={preview}
						core={core.includes(selected.name)}
					/>
				</aside>
			</div>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: pulsar el fondo es un atajo de ratón; con teclado, el <dialog> se cierra con Escape y la hoja tiene su botón «Cerrar» */}
			<dialog
				ref={sheet}
				aria-labelledby={`${c.idPrefix}-sheet-name`}
				className="m-0 mt-auto max-h-[85vh] w-full max-w-none overflow-y-auto rounded-t-2xl bg-primary_alt p-0 text-primary shadow-xl backdrop:bg-overlay/70 backdrop:[backdrop-filter:var(--backdrop-blur-lg)] lg:hidden"
				onClick={(e) => {
					// Pulsar fuera de la hoja (en el fondo) la cierra
					if (e.target === e.currentTarget) e.currentTarget.close();
				}}
			>
				<Panel
					kind={kind}
					entry={selected}
					preview={preview}
					core={core.includes(selected.name)}
					onClose={() => sheet.current?.close()}
				/>
			</dialog>
		</div>
	);
}
