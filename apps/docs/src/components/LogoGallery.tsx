// Galería de logos de terceros (`@jotis-me/icons/logos`): buscador por nombre, filtro por set, recuento y el panel del
// logo elegido con su versión en color y en gris y su código. Recibe solo nombres y URL de los SVG, no los 332
// componentes: la isla pesa lo mismo que la de iconos. Los grises de un color (currentColor) se pintan con
// `mask-image`, porque un <img> no hereda el color del texto.
import { Button, ButtonGroup, CodeSnippet, EmptyState, Input } from "@jotis-me/react";
import { useEffect, useRef, useState } from "react";

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

/** Decorativo: el nombre del logo va en el texto de su botón o en el título del panel. */
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

/** El código del logo: el componente de `@jotis-me/icons/logos`, el SVG importado (Astro sin React) y el SVG en bruto. */
export function logoCode(logo: LogoEntry, svg: string | null) {
	const component = logoComponent(logo.set, logo.name);
	const file = `${logo.set}/${logo.name}`;
	return [
		{
			label: "React",
			code: `import { ${component} } from "@jotis-me/icons/logos";\n\n<${component} size={24} title="${logo.name}" />`,
		},
		{
			label: "Importar SVG",
			code: `---\nimport logo from "@jotis-me/icons/logos/${file}.svg?raw";\n---\n\n<Fragment set:html={logo} />`,
		},
		{ label: "SVG", code: svg ?? "Cargando…" },
	];
}

function Panel({ logo, onClose }: { logo: LogoEntry; onClose?: () => void }) {
	const [svg, setSvg] = useState<string | null>(null);
	useEffect(() => {
		setSvg(null);
		let alive = true;
		fetch(logo.url)
			.then((r) => r.text())
			.then((t) => alive && setSvg(t.trim()))
			.catch(() => alive && setSvg("No se pudo cargar el SVG."));
		return () => {
			alive = false;
		};
	}, [logo.url]);
	return (
		<div className="flex flex-col">
			<div className="flex h-42 items-center justify-center gap-10 bg-secondary shadow-[inset_0_-1px_0_var(--border-secondary)]">
				<figure className="m-0 flex flex-col items-center gap-2">
					<ColorChip url={logo.url} size={48} />
					<figcaption className="text-xs text-tertiary">Color</figcaption>
				</figure>
				{logo.gray ? (
					<figure className="m-0 flex flex-col items-center gap-2">
						<LogoImage url={logo.gray.url} mono={logo.gray.mono} size={48} />
						<figcaption className="text-xs text-tertiary">Gris</figcaption>
					</figure>
				) : null}
			</div>
			<div className="flex flex-col gap-3 p-5">
				<div className="flex items-start gap-3">
					<div className="min-w-0 grow">
						<h2
							id={onClose ? "logo-sheet-name" : "logo-detail-name"}
							className="font-mono text-md font-semibold text-primary"
						>
							{logo.name}
						</h2>
						<p className="mt-0.5 text-[13px] leading-5 text-tertiary">
							{SET_LABELS[logo.set]} · React:{" "}
							<code className="font-mono text-xs font-medium text-secondary">
								{logoComponent(logo.set, logo.name)}
							</code>
							{logo.gray ? (
								<>
									{" "}
									y{" "}
									<code className="font-mono text-xs font-medium text-secondary">
										{logoComponent(logo.set, logo.name, true)}
									</code>
								</>
							) : null}
						</p>
					</div>
					<Button hierarchy="secondary" size="sm" iconLeading="copy-01" data-copy={logo.name}>
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
			</div>
			<CodeSnippet
				className="rounded-none shadow-none"
				lineNumbers={false}
				tabs={logoCode(logo, svg)}
			/>
			<p className="px-5 py-3.5 text-xs text-tertiary shadow-[inset_0_1px_0_var(--border-secondary)]">
				Cada marca es de su dueño: úsala para representar una integración o un perfil, sin cambiar su
				forma ni sus colores. En oscuro, una marca negra va en su versión gris (sigue el color del
				texto) o sobre un fondo claro. Sin <code className="font-mono">title</code> el logo es
				decorativo; si va solo, dale nombre.
			</p>
		</div>
	);
}

export default function LogoGallery({ logos }: { logos: LogoEntry[] }) {
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState<Filter>("all");
	const [selected, setSelected] = useState(
		() => logos.find((l) => l.name === "github" && l.set === "social") ?? logos[0],
	);
	const sheet = useRef<HTMLDialogElement>(null);
	const q = query.trim().toLowerCase();
	const visible = (l: LogoEntry) => (filter === "all" || l.set === filter) && l.name.includes(q);
	const shown = logos.filter(visible).length;
	const total = logos.length;
	const key = (l: LogoEntry) => `${l.set}/${l.name}`;

	const pick = (logo: LogoEntry) => {
		setSelected(logo);
		if (matchMedia("(max-width: 1023px)").matches) sheet.current?.showModal();
	};

	return (
		<div className="flex flex-col gap-7">
			<div className="flex flex-wrap items-end gap-x-6 gap-y-4">
				<div className="max-w-110 flex-[1_1_320px]">
					<Input
						id="logo-search"
						label="Buscar logo"
						icon="search-md"
						type="search"
						autoComplete="off"
						placeholder="github, figma, slack…"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<span aria-hidden="true" className="text-sm font-medium text-secondary">
						Set
					</span>
					<ButtonGroup
						aria-label="Set de logos"
						value={filter}
						onChange={(v) => setFilter(v as Filter)}
						items={FILTERS.map((f) => ({
							value: f,
							label: f === "all" ? "Todos" : SET_LABELS[f],
						}))}
					/>
				</div>
				<div className="hidden grow sm:block" />
				<p id="logo-count" role="status" className="mb-2.5 text-sm text-tertiary tabular-nums">
					{shown === total ? `${total} logos` : `${shown} de ${total}`}
				</p>
			</div>

			<div className="flex items-start gap-6">
				<div className="min-w-0 flex-1">
					<ul
						aria-label="Logos"
						className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(112px,1fr))]"
					>
						{logos.map((logo) => (
							<li key={key(logo)} data-logo={key(logo)} hidden={!visible(logo)}>
								<button
									type="button"
									aria-pressed={key(logo) === key(selected as LogoEntry)}
									onClick={() => pick(logo)}
									className="flex w-full flex-col items-center gap-3 rounded-lg px-2 py-4 shadow-[inset_0_0_0_1px_var(--border-secondary)] transition-colors duration-100 hover:bg-primary_hover focus-visible:shadow-focus-ring focus-visible:outline-none aria-pressed:bg-secondary_hover aria-pressed:shadow-[inset_0_0_0_2px_var(--border-brand)]"
								>
									<ColorChip url={logo.url} size={28} />
									<span className="w-full truncate text-center font-mono text-[11px] leading-4 text-tertiary">
										{logo.name}
									</span>
								</button>
							</li>
						))}
					</ul>
					{shown === 0 && (
						<div className="py-12">
							<EmptyState
								icon="search-lg"
								title="Ese logo no está"
								description="Ningún logo se llama así en este set. Prueba con el nombre de la marca en minúsculas, o con todos los sets."
							/>
						</div>
					)}
				</div>
				<aside
					aria-label="Logo elegido"
					className="sticky top-6 hidden w-95 flex-none overflow-hidden rounded-xl bg-primary_alt shadow-[var(--shadow-lg),inset_0_0_0_1px_var(--border-secondary_alt)] lg:block"
				>
					{selected ? <Panel logo={selected} /> : null}
				</aside>
			</div>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: pulsar el fondo es un atajo de ratón; con teclado, el <dialog> se cierra con Escape y la hoja tiene su botón «Cerrar» */}
			<dialog
				ref={sheet}
				aria-labelledby="logo-sheet-name"
				className="m-0 mt-auto max-h-[85vh] w-full max-w-none overflow-y-auto rounded-t-2xl bg-primary_alt p-0 text-primary shadow-xl backdrop:bg-overlay/70 backdrop:[backdrop-filter:var(--backdrop-blur-lg)] lg:hidden"
				onClick={(e) => {
					if (e.target === e.currentTarget) e.currentTarget.close();
				}}
			>
				{selected ? <Panel logo={selected} onClose={() => sheet.current?.close()} /> : null}
			</dialog>
		</div>
	);
}
