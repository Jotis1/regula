// Galería de logos de terceros (`@jotis-me/assets/logos`): una fila de filtros (buscador por nombre, set y recuento), la
// rejilla de `IconTile` y el panel del logo elegido con su versión en color y en gris y su código. Recibe solo nombres y
// URL de los SVG, no los 332 componentes: la isla pesa lo mismo que la de iconos. Los grises de un color (currentColor)
// se pintan con `mask-image`, porque un <img> no hereda el color del texto. El panel y la hoja inferior de móvil son de
// `GalleryShell`.
import { ButtonGroup, IconTile, Input } from "@jotis-me/react";
import { SearchMd } from "@untitledui/icons";
import { useState } from "react";
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

export type LogoSetName = "app" | "integration" | "social";
export interface LogoEntry {
	set: LogoSetName;
	/** Nombre del fichero sin `.svg` ni `-gray`. */
	name: string;
	url: string;
	gray?: { url: string; mono: boolean };
}

const SET_LABELS: Record<LogoSetName, string> = {
	app: "Apps",
	integration: "Integraciones",
	social: "Redes",
};
const FILTERS = ["all", "app", "integration", "social"] as const;
type Filter = (typeof FILTERS)[number];

const pascal = (s: string) =>
	s
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join("");
/** Igual que `logoComponentName` de packages/icons/scripts/generate.ts. */
export const logoComponent = (set: LogoSetName, name: string, gray = false) =>
	`${pascal(set)}${pascal(name)}Logo${gray ? "Gray" : ""}`;

/** Decorativo: el nombre del logo va en el texto de su baldosa o en el título del panel. */
function LogoImage({ url, mono, size }: { url: string; mono?: boolean; size: number }) {
	if (mono)
		return (
			<span
				aria-hidden="true"
				className="inline-block bg-fg-primary"
				style={{
					width: size,
					height: size,
					maskImage: `url(${url})`,
					maskSize: "contain",
					maskRepeat: "no-repeat",
					maskPosition: "center",
				}}
			/>
		);
	return <img src={url} alt="" width={size} height={size} loading="lazy" decoding="async" />;
}

/**
 * El logo en color sobre una pastilla clara en los dos temas: hay marcas negras (GitHub, X, Apple) que sobre el
 * fondo oscuro no se verían, y el Figma no trae versión oscura.
 */
function ColorChip({ url, size }: { url: string; size: number }) {
	return (
		<span className="inline-flex rounded-md bg-fg-white p-1.5 shadow-[inset_0_0_0_1px_var(--border-secondary)]">
			<LogoImage url={url} size={size} />
		</span>
	);
}

/** Alto de la vista previa de la rejilla: el logo de 28 px más el relleno de su pastilla. */
const TILE_HEIGHT = 40;

/**
 * El código del logo: sus componentes de `@jotis-me/assets/logos` (el de color y, si lo hay, el gris), el SVG importado
 * (Astro sin React) y el SVG en bruto.
 */
export function logoCode(logo: LogoEntry, svg: string | null) {
	const components = [logoComponent(logo.set, logo.name)];
	if (logo.gray) components.push(logoComponent(logo.set, logo.name, true));
	const file = `${logo.set}/${logo.name}`;
	return [
		{
			label: "React",
			code: `import { ${components.join(", ")} } from "@jotis-me/assets/logos";\n\n${components.map((c) => `<${c} size={24} title="${logo.name}" />`).join("\n")}`,
		},
		{
			label: "Importar SVG",
			code: `---\nimport logo from "@jotis-me/assets/logos/${file}.svg?raw";\n---\n\n<Fragment set:html={logo} />`,
		},
		{ label: "SVG", code: svg ?? "Cargando…" },
	];
}

/** Lo que enseña el panel del logo elegido. */
function chosenOf(logo: LogoEntry, svg: string | null): Chosen {
	const samples = [{ label: "Color", node: <ColorChip url={logo.url} size={24} /> }];
	if (logo.gray)
		samples.push({
			label: "Gris",
			node: (
				<span className="inline-flex p-1.5">
					<LogoImage url={logo.gray.url} mono={logo.gray.mono} size={24} />
				</span>
			),
		});
	return {
		name: logo.name,
		badge: SET_LABELS[logo.set],
		big: <ColorChip url={logo.url} size={64} />,
		samplesLabel: "Variantes",
		samples,
		tabs: logoCode(logo, svg),
		note: (
			<>
				Cada marca es de su dueño: úsala para representar una integración o un perfil, sin cambiar su
				forma ni sus colores. En oscuro, una marca negra va en su versión gris (sigue el color del
				texto) o sobre un fondo claro. Sin <code className="font-mono">title</code> el logo es
				decorativo; si va solo, dale nombre.
			</>
		),
	};
}

export default function LogoGallery({ logos }: { logos: LogoEntry[] }) {
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState<Filter>("all");
	const [selected, setSelected] = useState(
		() => logos.find((l) => l.name === "github" && l.set === "social") ?? logos[0],
	);
	const [sheetOpen, setSheetOpen] = useState(false);
	const svg = useSvg(selected?.url);
	const q = query.trim().toLowerCase();
	const visible = (l: LogoEntry) => (filter === "all" || l.set === filter) && l.name.includes(q);
	const shown = logos.filter(visible).length;
	const total = logos.length;
	const key = (l: LogoEntry) => `${l.set}/${l.name}`;

	const pick = (logo: LogoEntry) => {
		setSelected(logo);
		// En móvil el panel no está a la vista: se abre como hoja inferior, y al cerrarse el foco vuelve a la baldosa
		if (isCompact()) {
			focusTile("data-logo", key(logo));
			setSheetOpen(true);
		}
	};

	return (
		<GalleryShell
			idPrefix="logo"
			count={shown === total ? `${total} logos` : `${shown} de ${total}`}
			asideLabel="Logo elegido"
			chosen={selected ? chosenOf(selected, svg) : undefined}
			sheetOpen={sheetOpen}
			onSheetClose={() => setSheetOpen(false)}
			filters={
				<>
					<div className="min-w-50 max-w-90 flex-[1_1_100%] sm:flex-1">
						<Input
							id="logo-search"
							aria-label="Buscar logo"
							icon={SearchMd}
							type="search"
							autoComplete="off"
							placeholder={`Buscar entre ${total} logos`}
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
					</div>
					<ButtonGroup
						aria-label="Set de logos"
						value={filter}
						onChange={(v) => setFilter(v as Filter)}
						items={FILTERS.map((f) => ({
							value: f,
							label: f === "all" ? "Todos" : SET_LABELS[f],
						}))}
					/>
				</>
			}
		>
			<ul aria-label="Logos" className={TILE_GRID}>
				{logos.map((logo) => (
					<li key={key(logo)} data-logo={key(logo)} hidden={!visible(logo)}>
						<IconTile
							icon={<ColorChip url={logo.url} size={28} />}
							label={logo.name}
							selected={!!selected && key(logo) === key(selected)}
							onSelect={() => pick(logo)}
							className={tileFit(TILE_HEIGHT)}
						/>
					</li>
				))}
			</ul>
			{shown === 0 && (
				<GalleryEmpty
					query={query.trim()}
					description="Ningún logo se llama así en este set. Prueba con el nombre de la marca en minúsculas, o con todos los sets."
					onClear={() => {
						setQuery("");
						document.getElementById("logo-search")?.focus();
					}}
				/>
			)}
		</GalleryShell>
	);
}
